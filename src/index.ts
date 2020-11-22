import Parcel from "@parcel/core";
import { moveSync, removeSync } from "fs-extra";
import { join, relative, extname, dirname, basename } from "path";
import { Options } from "serverless";
import { FunctionsSls, InitialParcelOptions } from "./types";

const config: InitialParcelOptions = {
  defaultConfig: require.resolve("@parcel/config-default"),
  mode: "production",
  defaultEngines: { node: "12" },
  distDir: undefined,
  entries: undefined,
};

class ServerlessPluginParcel {
  readonly serverlessFolder = ".serverless";
  readonly buildFolder = ".serverless_parcel";
  servicePath: string;
  buildPath: string;
  serverless: any;
  hooks: object;
  options: Options;
  functions: FunctionsSls;

  constructor(serverless: any, options: Options) {
    this.servicePath = serverless.config.servicePath;
    this.buildPath = join(this.servicePath, this.buildFolder);

    this.serverless = serverless;
    this.options = options;
    this.functions = serverless.service.functions;

    this.hooks = {
      "before:package:createDeploymentArtifacts": this.bundle.bind(this),
      "after:package:createDeploymentArtifacts": this.cleanup.bind(this),
      "before:deploy:function:packageFunction": this.bundle.bind(this),
      "after:deploy:function:packageFunction": this.cleanup.bind(this),
    };
  }

  async bundle() {
    this.serverless.cli.log("[SLS Parcel2]: bundling parcel entries...");

    const parcelOptions = this.serverless.service.custom.parcel.options;

    for (const [key, value] of Object.entries(this.functions)) {
      // @NOTE: replaces handler path with extension
      const method = extname(value.handler);
      const entry = value.handler.replace(method, ".[jt]s");

      // @NOTE: output location
      const outPath = join(this.buildPath, dirname(entry));
      const distDir = relative(this.servicePath, outPath);

      // @NOTE: default settings
      const defaults = {
        target: "node",
        cache: false,
        watch: false,
        bundleNodeModules: true,
      };

      const bundler = new Parcel({
        ...config,
        ...defaults,
        ...parcelOptions,
        entries: `./${entry}`,
        distDir,
      });
      await bundler.run();
    }

    // point serverless to the build path to zip files
    this.serverless.config.servicePath = this.buildPath;
  }

  cleanup() {
    this.serverless.cli.log("[SLS Parcel2]: cleaning up parcel bundles");
    const serverlessBuildPath = join(this.servicePath, this.serverlessFolder);

    // update the package artifacts
    Object.entries(this.functions).forEach(([key, value]) => {
      const artifact = value.package.artifact || "default_artifact_name";

      const file = basename(artifact);
      const dest = join(serverlessBuildPath, file);

      // move the artifact to the serverless folder
      moveSync(artifact, dest, { overwrite: true });
      this.serverless.service.functions[key].package.artifact = dest;
    });

    // set the service path back
    this.serverless.config.servicePath = this.servicePath;
    // remove the build folder
    removeSync(this.buildPath);
  }
}

export default ServerlessPluginParcel;
