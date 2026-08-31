"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// const handleValidationError = (err: mongoose.Error.ValidationError): TGenericErrorResponse => {
//     const errorSources: TErrorSources = Object.values(err.errors).map((val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
//         return {
//             path: val?.path,
//             message: val?.message,
//         };
//     });
//     const statusCode = 400;
//     return {
//         statusCode,
//         message: "Validation Error",
//         errorSources,
//     };
// };
// const handleValidationError = (err: mongoose.Error.ValidationError): TGenericErrorResponse => {
//     const errorSources: TErrorSources = Object.values(err.errors).map((val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => ({
//         path: val?.path,
//         message: val?.message,
//     }));
//     return {
//         statusCode: 400,
//         message: err.message,
//         errorSources,
//     };
// };
const handleValidationError = (err) => {
    var _a;
    const errorSources = Object.values(err.errors).map((val) => ({
        path: val.path,
        message: val.message,
    }));
    return {
        statusCode: 400,
        message: ((_a = errorSources[0]) === null || _a === void 0 ? void 0 : _a.message) || "Validation Error",
        errorSources,
    };
};
exports.default = handleValidationError;
