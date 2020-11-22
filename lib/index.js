"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@parcel/core");
var fs_extra_1 = require("fs-extra");
var path_1 = require("path");
var config = {
    defaultConfig: require.resolve("@parcel/config-default"),
    mode: "production",
    defaultEngines: { node: "12" },
    distDir: undefined,
    entries: undefined,
};
var ServerlessPluginParcel = /** @class */ (function () {
    function ServerlessPluginParcel(serverless, options) {
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
    ServerlessPluginParcel.prototype.bundle = function () {
        return __awaiter(this, void 0, void 0, function () {
            var parcelOptions, _i, _a, _b, key, value, method, entry, outPath, distDir, defaults, bundler;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this.serverless.cli.log("[SLS Parcel2]: bundling parcel entries...");
                        parcelOptions = this.serverless.service.custom.parcel.options;
                        _i = 0, _a = Object.entries(this.functions);
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        _b = _a[_i], key = _b[0], value = _b[1];
                        method = path_1.extname(value.handler);
                        entry = value.handler.replace(method, ".[jt]s");
                        outPath = path_1.join(this.buildPath, path_1.dirname(entry));
                        distDir = path_1.relative(this.servicePath, outPath);
                        defaults = {
                            target: "node",
                            cache: false,
                            watch: false,
                            bundleNodeModules: true,
                        };
                        bundler = new core_1.default(__assign(__assign(__assign(__assign({}, config), defaults), parcelOptions), { entries: "./" + entry, distDir: distDir }));
                        return [4 /*yield*/, bundler.run()];
                    case 2:
                        _c.sent();
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        // point serverless to the build path to zip files
                        this.serverless.config.servicePath = this.buildPath;
                        return [2 /*return*/];
                }
            });
        });
    };
    ServerlessPluginParcel.prototype.cleanup = function () {
        var _this = this;
        this.serverless.cli.log("[SLS Parcel2]: cleaning up parcel bundles");
        var serverlessBuildPath = path_1.join(this.servicePath, this.serverlessFolder);
        // update the package artifacts
        Object.entries(this.functions).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            var artifact = value.package.artifact || "default_artifact_name";
            var file = path_1.basename(artifact);
            var dest = path_1.join(serverlessBuildPath, file);
            // move the artifact to the serverless folder
            fs_extra_1.moveSync(artifact, dest, { overwrite: true });
            _this.serverless.service.functions[key].package.artifact = dest;
        });
        // set the service path back
        this.serverless.config.servicePath = this.servicePath;
        // remove the build folder
        fs_extra_1.removeSync(this.buildPath);
    };
    return ServerlessPluginParcel;
}());
exports.default = ServerlessPluginParcel;
