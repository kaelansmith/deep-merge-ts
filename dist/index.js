"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepMerge = exports.isObject = void 0;
function isObject(item) {
    return item && typeof item === "object" && !Array.isArray(item);
}
exports.isObject = isObject;
function deepMerge(target, ...sources) {
    return sources.reduce((result, source) => {
        // Check if source is null or undefined
        if (source == null)
            return result;
        Object.keys(source).forEach((key) => {
            const sourceValue = source[key];
            if (sourceValue === undefined) {
                if (key in result) {
                    delete result[key];
                }
            }
            else if (isObject(result[key]) && isObject(sourceValue)) {
                result[key] = deepMerge(result[key], sourceValue);
            }
            else {
                result[key] = sourceValue;
            }
        });
        return result;
    }, { ...target });
}
exports.deepMerge = deepMerge;
