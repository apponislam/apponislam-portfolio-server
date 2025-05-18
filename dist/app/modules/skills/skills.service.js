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
exports.skillServices = void 0;
const skills_model_1 = require("./skills.model");
const createSkills = (techData) => __awaiter(void 0, void 0, void 0, function* () {
    return yield skills_model_1.slillsModel.create(techData);
});
const getAllSkills = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield skills_model_1.slillsModel.find().sort({ createdAt: -1 });
});
const getSkillsById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield skills_model_1.slillsModel.findById(id);
});
const updateSkills = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    return yield skills_model_1.slillsModel.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    });
});
const deleteSkills = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield skills_model_1.slillsModel.findByIdAndDelete(id);
});
exports.skillServices = {
    createSkills,
    getAllSkills,
    getSkillsById,
    updateSkills,
    deleteSkills,
};
