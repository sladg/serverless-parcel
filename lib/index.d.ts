import { Options } from "serverless";
import { FunctionsSls } from "./types";
declare class ServerlessPluginParcel {
    readonly serverlessFolder = ".serverless";
    readonly buildFolder = ".serverless_parcel";
    servicePath: string;
    buildPath: string;
    serverless: any;
    hooks: object;
    options: Options;
    functions: FunctionsSls;
    constructor(serverless: any, options: Options);
    bundle(): Promise<void>;
    cleanup(): void;
}
export default ServerlessPluginParcel;
