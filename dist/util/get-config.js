"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
function getConfig(env) {
    try {
        return require(path.resolve(__dirname, '../environments/${env}'));
    }
    catch (e) {
        return {};
    }
}
exports.default = getConfig;
