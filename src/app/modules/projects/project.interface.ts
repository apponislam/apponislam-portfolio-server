import { Types } from "mongoose";

export interface IDescriptionDetailsInterface {
    paragraphs: string[];
    bullets: string[];
}

export interface IPagesInfoInterface {
    title: string;
    imgArr: string[];
    description?: string;
}

export interface IProjectsInterface {
    userId: Types.ObjectId;
    type: "Personal Project" | "Professional";
    companyName: string;
    category: ("Full Stack" | "Frontend" | "Backend" | "Web Dev")[];
    shortDescription: string;
    websiteLink?: string;
    githubLink?: string;
    techStack: ("Next.js" | "React" | "GraphQL" | "Express.js" | "Node.js" | "MongoDB" | "Firebase" | "Typescript" | "Javascript" | "HTML 5" | "CSS 3" | "React Native" | "Angular" | "Redux" | "Material UI" | "Tailwind CSS" | "Bootstrap" | "Google Auth" | "MySQL" | "JWT" | "TanStack Query" | "react-hook-form" | "SurjoPay" | "Prisma" | "PostgreSQL")[];
    startDate: Date;
    endDate: Date;
    companyLogoImg: string;
    descriptionDetails: IDescriptionDetailsInterface;
    pagesInfoArr: IPagesInfoInterface[];
}
