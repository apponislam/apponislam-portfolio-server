"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slillsModel = void 0;
const mongoose_1 = require("mongoose");
const TechnologySchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    icon: { type: String, required: true },
}, {
    timestamps: true,
    versionKey: false,
});
exports.slillsModel = (0, mongoose_1.model)("skills", TechnologySchema);
