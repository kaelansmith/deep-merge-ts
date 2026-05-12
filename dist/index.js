"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepMerge = exports.isObject = void 0;
function isObject(item) {
    return (item &&
        typeof item === "object" &&
        !Array.isArray(item) &&
        !(item instanceof Function));
}
exports.isObject = isObject;
function deepMerge(target, ...sources) {
    return sources?.reduce((result, source) => {
        // Check if source is null or undefined
        if (source == null)
            return result;
        // Extract options if they exist
        const options = source.__deepMergeOptions__;
        const invalidValues = options?.invalidValues || [];
        // Remove the options property before merging
        if ("__deepMergeOptions__" in source) {
            const sourceCopy = { ...source };
            delete sourceCopy.__deepMergeOptions__;
            source = sourceCopy;
        }
        Object.keys(source).forEach((key) => {
            const sourceValue = source[key];
            // Skip if sourceValue is in invalidValues
            if (invalidValues.some((value) => Object.is(value, sourceValue)))
                return;
            if (sourceValue === undefined) {
                if (key in result)
                    delete result[key];
            }
            else if (isObject(result[key]) && isObject(sourceValue)) {
                // Pass options to nested objects by adding them to the sourceValue
                const nestedSource = { ...sourceValue };
                if (options)
                    nestedSource.__deepMergeOptions__ = options;
                result[key] = deepMerge(result[key], nestedSource);
            }
            else {
                result[key] = sourceValue;
            }
        });
        return result;
    }, { ...target });
}
exports.deepMerge = deepMerge;
