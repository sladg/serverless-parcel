import { FunctionDefinition } from "serverless";
export declare type PackageName = string;
export declare type FilePath = string;
export declare type Glob = string;
export declare type Semver = string;
export declare type SemverRange = string;
export declare type ModuleSpecifier = string | any;
export declare type EnvMap = typeof process.env;
export declare type BuildMode = "development" | "production" | string;
export declare type LogLevel = "none" | "error" | "warn" | "info" | "verbose";
export declare type HMROptions = {
    port?: number;
    host?: string;
};
export declare type HTTPSOptions = {
    cert: FilePath;
    key: FilePath;
};
export declare type InitialServerOptions = {
    publicUrl?: string;
    host?: string;
    port: number;
    https?: HTTPSOptions | boolean;
};
export declare type Engines = {
    browsers?: string | Array<string>;
    electron?: SemverRange;
    node?: SemverRange;
    parcel?: SemverRange;
};
export declare type InitialParcelOptions = {
    entries?: FilePath | Array<FilePath>;
    entryRoot?: FilePath;
    config?: ModuleSpecifier;
    defaultConfig?: ModuleSpecifier;
    env?: EnvMap;
    targets?: Array<string>;
    disableCache?: boolean;
    cacheDir?: FilePath;
    killWorkers?: boolean;
    mode?: BuildMode;
    minify?: boolean;
    scopeHoist?: boolean;
    sourceMaps?: boolean;
    publicUrl?: string;
    distDir?: FilePath;
    hot?: HMROptions;
    contentHash?: boolean;
    serve?: InitialServerOptions | false;
    autoinstall?: boolean;
    logLevel?: LogLevel;
    profile?: boolean;
    patchConsole?: boolean;
    inputFS?: any;
    outputFS?: any;
    workerFarm?: any;
    packageManager?: any;
    defaultEngines?: Engines;
    detailedReport?: number | boolean;
};
export declare type FunctionsSls = {
    [key: string]: FunctionDefinition;
};
