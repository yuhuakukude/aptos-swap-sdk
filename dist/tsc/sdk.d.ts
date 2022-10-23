import { AptosClient } from 'aptos';
import { SwapModule } from './modules/SwapModule';
import { RouteModule } from './modules/RouteModule';
import { MasterChefModule } from './modules/MasterChefModule';
import { ResourcesModule } from './modules/ResourcesModule';
import { AptosResourceType } from './types/aptos';
export declare type SdkOptions = {
    nodeUrl: string;
    networkOptions: {
        nativeCoin: AptosResourceType;
        modules: {
            CoinInfo: AptosResourceType;
            CoinStore: AptosResourceType;
            Scripts: AptosResourceType;
            ResourceAccountAddress: AptosResourceType;
            DeployerAddress: AptosResourceType;
            AniAddress: AptosResourceType;
            MasterChefScripts: AptosResourceType;
            MasterChefDeployerAddress: AptosResourceType;
            MasterChefResourceAccountAddress: AptosResourceType;
        } & Record<string, AptosResourceType>;
    };
};
export declare enum NetworkType {
    Mainnet = 0,
    Devnet = 1,
    Testnet = 2
}
export declare class SDK {
    protected _client: AptosClient;
    protected _swap: SwapModule;
    protected _route: RouteModule;
    protected _masterchef: MasterChefModule;
    protected _resources: ResourcesModule;
    protected _networkOptions: SdkOptions['networkOptions'];
    get swap(): SwapModule;
    get route(): RouteModule;
    get MasterChef(): MasterChefModule;
    get resources(): ResourcesModule;
    get client(): AptosClient;
    get networkOptions(): {
        nativeCoin: string;
        modules: {
            CoinInfo: string;
            CoinStore: string;
            Scripts: string;
            ResourceAccountAddress: string;
            DeployerAddress: string;
            AniAddress: string;
            MasterChefScripts: string;
            MasterChefDeployerAddress: string;
            MasterChefResourceAccountAddress: string;
        } & Record<string, string>;
    };
    /**
     * SDK constructor
     * @param nodeUrl string
     * @param networkType? NetworkType
     */
    constructor(nodeUrl: string, networkType?: NetworkType);
}
