"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@parcel/core");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const config = {
    defaultConfig: require.resolve("@parcel/config-default"),
    mode: "production",
    defaultEngines: { node: "12" },
    distDir: undefined,
    entries: undefined,
};
class ServerlessPluginParcel {
    constructor(serverless, options) {
        this.serverlessFolder = ".serverless";
        this.buildFolder = ".serverless_parcel";
        this.servicePath = serverless.config.servicePath;
        this.buildPath = path_1.join(this.servicePath, this.buildFolder);
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
    bundle() {
        return __awaiter(this, void 0, void 0, function* () {
            this.serverless.cli.log("[SLS Parcel2]: bundling parcel entries...");
            const parcelOptions = this.serverless.service.custom.parcel.options;
            for (const [key, value] of Object.entries(this.functions)) {
                // @NOTE: replaces handler path with extension
                const method = path_1.extname(value.handler);
                const entry = value.handler.replace(method, ".[jt]s");
                // @NOTE: output location
                const outPath = path_1.join(this.buildPath, path_1.dirname(entry));
                const distDir = path_1.relative(this.servicePath, outPath);
                // @NOTE: default settings
                const defaults = {
                    target: "node",
                    cache: false,
                    watch: false,
                    bundleNodeModules: true,
                };
                const bundler = new core_1.default(Object.assign(Object.assign(Object.assign(Object.assign({}, config), defaults), parcelOptions), { entries: `./${entry}`, distDir }));
                yield bundler.run();
            }
            // point serverless to the build path to zip files
            this.serverless.config.servicePath = this.buildPath;
        });
    }
    cleanup() {
        this.serverless.cli.log("[SLS Parcel2]: cleaning up parcel bundles");
        const serverlessBuildPath = path_1.join(this.servicePath, this.serverlessFolder);
        // update the package artifacts
        Object.entries(this.functions).forEach(([key, value]) => {
            const artifact = value.package.artifact || "default_artifact_name";
            const file = path_1.basename(artifact);
            const dest = path_1.join(serverlessBuildPath, file);
            // move the artifact to the serverless folder
            fs_extra_1.moveSync(artifact, dest, { overwrite: true });
            this.serverless.service.functions[key].package.artifact = dest;
        });
        // set the service path back
        this.serverless.config.servicePath = this.servicePath;
        // remove the build folder
        fs_extra_1.removeSync(this.buildPath);
    }
}
exports.default = ServerlessPluginParcel;
