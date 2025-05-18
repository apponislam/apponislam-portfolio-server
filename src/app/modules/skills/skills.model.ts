import { Schema, model } from "mongoose";
import { ISkills } from "./skills.interface";

const TechnologySchema = new Schema<ISkills>(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        icon: { type: String, required: true },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const slillsModel = model<ISkills>("skills", TechnologySchema);
