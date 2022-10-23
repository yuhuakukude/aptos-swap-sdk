"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasterChefModule = void 0;
const tslib_1 = require("tslib");
const contractComposeType_1 = require("../utils/contractComposeType");
const hex_1 = require("../utils/hex");
const is_1 = require("../utils/is");
const number_1 = require("../utils/number");
const utils_1 = require("../utils");
const ACC_ANI_PRECISION = 1e12;
class MasterChefModule {
    constructor(sdk) {
        this._sdk = sdk;
    }
    get sdk() {
        return this._sdk;
    }
    getLPInfoResources() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { modules } = this.sdk.networkOptions;
            const lpList = (0, contractComposeType_1.composeMasterChefLPList)(modules.MasterChefScripts);
            const resource = yield this.sdk.resources.fetchAccountResource(modules.MasterChefResourceAccountAddress, lpList);
            if (!resource) {
                throw new Error(`resource (${lpList}) not found`);
            }
            const aptosTypeInfoList = resource.data.lp_list;
            return aptosTypeInfoList.map(v => {
                return aptosTypeInfo2AptosResourceType(v);
            });
        });
    }
    getPoolInfoByCoinType(coinType) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { modules } = this.sdk.networkOptions;
            const poolInfoType = (0, contractComposeType_1.composeMasterChefPoolInfo)(modules.MasterChefScripts, coinType);
            const resource = yield this.sdk.resources.fetchAccountResource(modules.MasterChefResourceAccountAddress, poolInfoType);
            if (!resource) {
                throw new Error(`resource (${poolInfoType}) not found`);
            }
            return resource.data;
        });
    }
    getAllPoolInfo() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { modules } = this.sdk.networkOptions;
            const resources = yield this.sdk.resources.fetchAccountResources(modules.MasterChefResourceAccountAddress);
            if (!resources) {
                throw new Error('resources not found');
            }
            const lpCoinTypePrefix = (0, contractComposeType_1.composeMasterChefPoolInfoPrefix)(modules.MasterChefScripts);
            const regexStr = `^${lpCoinTypePrefix}<(.+)>$`;
            const filteredResource = resources.map(resource => {
                const regex = new RegExp(regexStr, 'g');
                const regexResult = regex.exec(resource.type);
                if (!regexResult)
                    return null;
                return {
                    coinType: regexResult[1],
                    poolInfo: resource.data,
                };
            }).filter(is_1.notEmpty);
            return filteredResource;
        });
    }
    getMasterChefData() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { modules } = this.sdk.networkOptions;
            const dataType = (0, contractComposeType_1.composeMasterChefData)(modules.MasterChefScripts);
            const resource = yield this.sdk.resources.fetchAccountResource(modules.MasterChefResourceAccountAddress, dataType);
            if (!resource) {
                throw new Error(`resource (${dataType}) not found`);
            }
            return resource.data;
        });
    }
    getUserInfoByCoinType(userAddress, coinType) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { modules } = this.sdk.networkOptions;
            const userInfoType = (0, contractComposeType_1.composeMasterChefUserInfo)(modules.MasterChefScripts, coinType);
            const task1 = this.sdk.resources.fetchAccountResource(userAddress, userInfoType);
            const task2 = this.getPoolInfoByCoinType(coinType);
            const task3 = this.getMasterChefData();
            const coinStoreType = (0, contractComposeType_1.composeCoinStore)(modules.CoinStore, coinType);
            const task4 = this.sdk.resources.fetchAccountResource(modules.MasterChefResourceAccountAddress, coinStoreType);
            const [resource, poolInfo, mcData, lpCoinStore] = yield Promise.all([task1, task2, task3, task4]);
            if (!resource) {
                throw new Error(`resource (${userInfoType}) not found`);
            }
            if (!lpCoinStore) {
                throw new Error(`resource (${coinStoreType}) not found`);
            }
            const userInfo = resource.data;
            const stakedTotal = lpCoinStore.data.coin.value;
            return meta2UserInfoReturn(poolInfo, userInfo, mcData, stakedTotal);
        });
    }
    getUserInfoAll(userAddress) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { modules } = this.sdk.networkOptions;
            // UserInfo
            const userInfoTypePrefix = (0, contractComposeType_1.composeMasterChefUserInfoPrefix)(modules.MasterChefScripts);
            const task1 = this.sdk.resources.fetchAccountResources(userAddress);
            // PoolInfo
            const lpCoinTypePrefix = (0, contractComposeType_1.composeMasterChefPoolInfoPrefix)(modules.MasterChefScripts);
            const task2 = this.sdk.resources.fetchAccountResources(modules.MasterChefResourceAccountAddress);
            // MasterChefData
            const task3 = this.getMasterChefData();
            // stakedLP
            const task4 = this.sdk.resources.fetchAccountResources(modules.MasterChefResourceAccountAddress);
            // await all
            const [userInfos, poolInfos, mcData, lpCoinStore] = yield Promise.all([task1, task2, task3, task4]);
            if (!userInfos || !poolInfos || !lpCoinStore) {
                throw new Error('resources not found');
            }
            // coinType2poolInfo
            const coinType2poolInfo = new Map();
            {
                const regexStr = `^${lpCoinTypePrefix}<(.+)>$`;
                poolInfos.map(resource => {
                    const regex = new RegExp(regexStr, 'g');
                    const regexResult = regex.exec(resource.type);
                    if (!regexResult)
                        return;
                    coinType2poolInfo.set(regexResult[1], resource.data);
                });
            }
            // coinType2StakedLP
            const coinType2StakedLP = new Map();
            {
                const regexStr = `^${modules.CoinStore}<(.+)>$`;
                lpCoinStore.map(resource => {
                    const regex = new RegExp(regexStr, 'g');
                    const regexResult = regex.exec(resource.type);
                    if (!regexResult)
                        return;
                    coinType2StakedLP.set(regexResult[1], resource.data.coin.value);
                });
            }
            // coinType2userInfo
            const coinType2userInfo = new Map();
            {
                const regexStr = `^${userInfoTypePrefix}<(.+)>$`;
                userInfos.map(resource => {
                    const regex = new RegExp(regexStr, 'g');
                    const regexResult = regex.exec(resource.type);
                    if (!regexResult)
                        return;
                    const coinType = regexResult[1];
                    const userInfo = resource.data;
                    const poolInfo = coinType2poolInfo.get(coinType);
                    const stakedLP = coinType2StakedLP.get(coinType);
                    if (!poolInfo || !stakedLP) {
                        throw new Error('resources not found');
                    }
                    const userInfoReturn = meta2UserInfoReturn(poolInfo, userInfo, mcData, stakedLP);
                    coinType2userInfo.set(coinType, userInfoReturn);
                });
            }
            return coinType2userInfo;
        });
    }
    // deposit/withdraw LPCoin payload
    stakeLPCoinPayload({ amount, coinType, method, }) {
        const { modules } = this.sdk.networkOptions;
        const functionName = (0, utils_1.composeType)(modules.MasterChefScripts, method);
        const typeArguments = [
            coinType,
        ];
        const args = [amount.toString()];
        return {
            type: 'entry_function_payload',
            function: functionName,
            type_arguments: typeArguments,
            arguments: args,
        };
    }
    // enter_staking/leave_staking ANI payload
    stakeANIPayload({ amount, method, }) {
        const { modules } = this.sdk.networkOptions;
        const functionName = (0, utils_1.composeType)(modules.MasterChefScripts, method);
        const args = [amount.toString()];
        return {
            type: 'entry_function_payload',
            function: functionName,
            type_arguments: [],
            arguments: args,
        };
    }
}
exports.MasterChefModule = MasterChefModule;
function aptosTypeInfo2AptosResourceType(params) {
    return `${params.account_address}::${(0, hex_1.hexToString)(params.module_name)}::${(0, hex_1.hexToString)(params.struct_name)}`;
}
function meta2UserInfoReturn(poolInfo, userInfo, mcData, stakedTotal) {
    // calculate pending ANI
    const currentTimestamp = Math.floor(Date.now() / 1000);
    // let multipler = get_multiplier(pool.last_reward_timestamp, get_current_timestamp(), mc_data.bonus_multiplier);
    const multipler = (0, number_1.d)(mcData.bonus_multiplier).mul((0, number_1.d)(currentTimestamp).sub((0, number_1.d)(poolInfo.last_reward_timestamp)));
    // let reward_ANI = multipler * mc_data.per_second_ANI * (pool.alloc_point as u128) / (mc_data.total_alloc_point as u128) * ((100 - mc_data.dao_percent) as u128) / 100u128;
    // FIXME @zzzkky devnet and testnet use different name for dao_percent / dev_percent
    const rewardAni = multipler.mul(mcData.per_second_ANI).mul((0, number_1.d)(poolInfo.alloc_point)).div((0, number_1.d)(mcData.total_alloc_point)).mul((0, number_1.d)(100).sub(mcData.dao_percent ? mcData.dao_percent : mcData.dev_percent)).div((0, number_1.d)(100));
    // pool.acc_ANI_per_share = pool.acc_ANI_per_share + reward_ANI * ACC_ANI_PRECISION / (lp_supply as u128);
    const accAniPerShare = (0, number_1.d)(poolInfo.acc_ANI_per_share).add(rewardAni.mul((0, number_1.d)(ACC_ANI_PRECISION)).div((0, number_1.d)(stakedTotal)));
    // let pending = (user_info.amount as u128) * pool.acc_ANI_per_share / ACC_ANI_PRECISION - user_info.reward_debt;
    const pendingAni = (0, number_1.d)(userInfo.amount).mul(accAniPerShare).div((0, number_1.d)(ACC_ANI_PRECISION)).sub((0, number_1.d)(userInfo.reward_debt));
    return {
        amount: (0, number_1.d)(userInfo.amount),
        pendingAni,
    };
}
//# sourceMappingURL=MasterChefModule.js.map