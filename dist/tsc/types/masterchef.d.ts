import { AptosTypeInfo } from './aptos';
export declare type MasterChefLPInfo = {
    lp_list: AptosTypeInfo[];
};
export declare type MasterChefPoolInfo = {
    acc_ANI_per_share: string;
    alloc_point: string;
    last_reward_timestamp: string;
};
export declare type MasterChefData = {
    bonus_multiplier: string;
    dev_percent: string;
    dao_percent: string;
    per_second_ANI: string;
    start_timestamp: string;
    total_alloc_point: string;
};
export declare type MasterChefUserInfo = {
    amount: string;
    reward_debt: string;
};
