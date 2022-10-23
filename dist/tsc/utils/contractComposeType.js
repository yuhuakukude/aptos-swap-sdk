"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composeMasterChefUserInfoPrefix = exports.composeMasterChefUserInfo = exports.composeMasterChefData = exports.composeMasterChefPoolInfoPrefix = exports.composeMasterChefPoolInfo = exports.composeMasterChefLPList = exports.composeSwapEvent = exports.composeLiquidityPool = exports.composeCoinStore = exports.composePairInfo = exports.composeSwapPoolData = exports.composeLPCoinType = exports.composeLP = exports.composeLPCoin = void 0;
const contract_1 = require("./contract");
const LPCoinModule = 'LPCoinV1';
const LPCoinType = 'LPCoin';
const AnimeSwapLiquidityPool = 'LiquidityPool';
const AnimeSwapAdminData = 'AdminData';
const AnimeSwapPairInfo = 'PairInfo';
const AnimeSwapEvent = 'Events';
const AnimeMasterChefLPInfo = 'LPInfo';
const AnimeMasterChefPoolInfo = 'PoolInfo';
const AnimeMasterChefUserInfo = 'UserInfo';
const AnimeMasterChefData = 'MasterChefData';
function composeLPCoin(address, coin_x, coin_y) {
    return (0, contract_1.composeType)(address, LPCoinModule, LPCoinType, [coin_x, coin_y]);
}
exports.composeLPCoin = composeLPCoin;
function composeLP(swapScript, coin_x, coin_y) {
    return (0, contract_1.composeType)(swapScript, AnimeSwapLiquidityPool, [coin_x, coin_y]);
}
exports.composeLP = composeLP;
function composeLPCoinType(address) {
    return (0, contract_1.composeType)(address, LPCoinModule, LPCoinType);
}
exports.composeLPCoinType = composeLPCoinType;
function composeSwapPoolData(swapScript) {
    return (0, contract_1.composeType)(swapScript, AnimeSwapAdminData);
}
exports.composeSwapPoolData = composeSwapPoolData;
function composePairInfo(swapScript) {
    return (0, contract_1.composeType)(swapScript, AnimeSwapPairInfo);
}
exports.composePairInfo = composePairInfo;
function composeCoinStore(coinStore, coinType) {
    return `${coinStore}<${coinType}>`;
}
exports.composeCoinStore = composeCoinStore;
function composeLiquidityPool(swapScript) {
    return (0, contract_1.composeType)(swapScript, AnimeSwapLiquidityPool);
}
exports.composeLiquidityPool = composeLiquidityPool;
function composeSwapEvent(swapScript, coin_x, coin_y) {
    return (0, contract_1.composeType)(swapScript, AnimeSwapEvent, [coin_x, coin_y]);
}
exports.composeSwapEvent = composeSwapEvent;
function composeMasterChefLPList(mcScript) {
    return (0, contract_1.composeType)(mcScript, AnimeMasterChefLPInfo);
}
exports.composeMasterChefLPList = composeMasterChefLPList;
function composeMasterChefPoolInfo(mcScript, coinType) {
    return (0, contract_1.composeType)(mcScript, `${AnimeMasterChefPoolInfo}<${coinType}>`);
}
exports.composeMasterChefPoolInfo = composeMasterChefPoolInfo;
function composeMasterChefPoolInfoPrefix(mcScript) {
    return (0, contract_1.composeType)(mcScript, AnimeMasterChefPoolInfo);
}
exports.composeMasterChefPoolInfoPrefix = composeMasterChefPoolInfoPrefix;
function composeMasterChefData(mcScript) {
    return (0, contract_1.composeType)(mcScript, AnimeMasterChefData);
}
exports.composeMasterChefData = composeMasterChefData;
function composeMasterChefUserInfo(mcScript, coinType) {
    return (0, contract_1.composeType)(mcScript, `${AnimeMasterChefUserInfo}<${coinType}>`);
}
exports.composeMasterChefUserInfo = composeMasterChefUserInfo;
function composeMasterChefUserInfoPrefix(mcScript) {
    return (0, contract_1.composeType)(mcScript, AnimeMasterChefUserInfo);
}
exports.composeMasterChefUserInfoPrefix = composeMasterChefUserInfoPrefix;
//# sourceMappingURL=contractComposeType.js.map