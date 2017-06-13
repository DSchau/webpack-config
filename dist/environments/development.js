"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function developmentConfig() {
    return {
        devtool: 'cheap-module-eval-source-map',
        devServer: {
            host: '0.0.0.0',
            disableHostCheck: true
        }
    };
}
exports.default = developmentConfig;
