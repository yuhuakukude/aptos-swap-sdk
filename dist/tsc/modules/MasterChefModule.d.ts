import { SDK } from '../sdk';
import { IModule } from '../interfaces/IModule';
import { AptosResourceType, Payload } from '../types/aptos';
import { MasterChefData, MasterChefPoolInfo } from '../types/masterchef';
import Decimal from 'decimal.js';
export declare type allPoolInfoList = {
    coinType: AptosResourceType;
    poolInfo: MasterChefPoolInfo;
};
export declare type UserInfoReturn = {
    amount: Decimal;
    pendingAni: Decimal;
};
export declare type AllUserInfoReturn = [
    {
        coinType: AptosResourceType;
        userInfo: UserInfoReturn;
    }
];
export declare type StakeLPCoinPayload = {
    amount: AptosResourceType;
    coinType: AptosResourceType;
    method: 'deposit' | 'withdraw';
};
export declare type StakeANIPayload = {
    amount: AptosResourceType;
    method: 'enter_staking' | 'leave_staking';
};
export declare class MasterChefModule implements IModule {
    protected _sdk: SDK;
    get sdk(): SDK;
    constructor(sdk: SDK);
    getLPInfoResources(): Promise<AptosResourceType[]>;
    getPoolInfoByCoinType(coinType: AptosResourceType): Promise<MasterChefPoolInfo>;
    getAllPoolInfo(): Promise<allPoolInfoList[]>;
    getMasterChefData(): Promise<MasterChefData>;
    getUserInfoByCoinType(userAddress: AptosResourceType, coinType: AptosResourceType): Promise<UserInfoReturn>;
    getUserInfoAll(userAddress: AptosResourceType): Promise<Map<string, UserInfoReturn>>;
    stakeLPCoinPayload({ amount, coinType, method, }: StakeLPCoinPayload): Payload;
    stakeANIPayload({ amount, method, }: StakeANIPayload): Payload;
}
