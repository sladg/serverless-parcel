import { FunctionDefinition } from "serverless";

export type PackageName = string;
export type FilePath = string;
export type Glob = string;
export type Semver = string;
export type SemverRange = string;
export type ModuleSpecifier = string;
export type EnvMap = typeof process.env;
export type BuildMode = "development" | "production" | string;
export type LogLevel = "none" | "error" | "warn" | "info" | "verbose";

export type HMROptions = {
  port?: number;
  host?: string;
};

export type HTTPSOptions = {
  cert: FilePath;
  key: FilePath;
};

export type InitialServerOptions = {
  publicUrl?: string;
  host?: string;
  port: number;
  https?: HTTPSOptions | boolean;
};

export type Engines = {
  browsers?: string | Array<string>;
  electron?: SemverRange;
  node?: SemverRange;
  parcel?: SemverRange;
};

export type InitialParcelOptions = {
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

export type FunctionsSls = { [key: string]: FunctionDefinition };
