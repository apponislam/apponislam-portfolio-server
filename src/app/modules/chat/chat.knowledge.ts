import fs from "fs";
import path from "path";
import config from "../../config";

export interface IProjectEntry {
    _id?: string;
    serial?: number;
    type?: string;
    companyName?: string;
    title?: string;
    category?: string[];
    shortDescription?: string;
    description?: string;
    links?: {
        demo?: { url?: string; disabled?: boolean; private?: boolean };
        githubFrontend?: { url?: string; disabled?: boolean; private?: boolean };
        githubBackend?: { url?: string; disabled?: boolean; private?: boolean };
    };
    techStack?: string[];
    technologies?: string[];
    liveUrl?: string;
    githubUrl?: string;
    contributions?: Array<{
        name?: string;
        role?: string;
        highlights?: string[];
    }>;
    descriptionDetails?: {
        paragraphs?: string[];
        bullets?: string[];
    };
}

export interface IMasterPortfolioData {
    meta?: {
        generatedAt?: string;
        schemaVersion?: string;
        author?: string;
        websiteUrl?: string;
        purpose?: string;
    };
    profile?: {
        name?: string;
        title?: string;
        headline?: string;
        bio?: string;
        email?: string;
        phone?: string;
        location?: string;
        country?: string;
        status?: {
            isOpenToWork?: boolean;
            statusText?: string;
            badgeText?: string;
        };
        avatarUrl?: string;
        ogImageUrl?: string;
        resumeUrl?: string;
        socialLinks?: Array<{
            platform: string;
            username?: string;
            url: string;
            description?: string;
        }>;
    };
    pages?: Record<string, { title: string; description: string; path: string }>;
    statistics?: {
        totalProjects?: number;
        totalSkills?: number;
        totalCertificates?: number;
        totalExperienceRecords?: number;
        totalEducationRecords?: number;
        yearsOfCodingExperience?: string;
    };
    skills?: Record<string, unknown> & {
        totalCount?: number;
        allSkills?: Array<{
            _id?: string;
            name: string;
            description?: string;
            rating?: number;
            icon?: string;
        }>;
        categorized?: Record<string, Array<{ name: string; description?: string } | string>>;
        languages?: string[];
        frontend?: string[];
        backend?: string[];
        databases?: string[];
        toolsAndDevOps?: string[];
    };
    projects?: {
        totalCount?: number;
        featured?: IProjectEntry[];
        allProjects?: IProjectEntry[];
    };
    experience?: Array<{
        id?: string;
        title: string;
        organization: string;
        duration: string;
        description?: string[];
    }>;
    education?: Array<{
        id?: string;
        title: string;
        organization: string;
        location?: string;
        duration: string;
        description?: string[];
    }>;
    certificates?: Array<{
        id?: string;
        title: string;
        issuer: string;
        issueDate: string;
        isOngoing?: boolean;
        credentialUrl?: string;
        codeChefUrl?: string;
        codeForcesUrl?: string;
        description?: string[];
    }>;
    knowledgeBase?: Array<{
        topic?: string;
        question: string;
        answer: string;
    }>;
    // Fallback/Legacy schema compatibility
    personal?: {
        name?: string;
        title?: string;
        tagline?: string;
        email?: string;
        backupEmail?: string;
        phone?: string;
        whatsapp?: string;
        website?: string;
        location?: string;
        social?: Record<string, string>;
        availability?: string;
    };
    about?: string;
    featuredProjects?: IProjectEntry[];
    services?: Array<{ title: string; description: string }>;
    faqs?: Array<{ question: string; answer: string }>;
}

/**
 * Load portfolio profile data from JSON / doc.txt files.
 */
export const loadPortfolioData = (): IMasterPortfolioData | null => {
    const candidatePaths = [path.join(process.cwd(), "src/app/modules/chat/doc.txt"), path.join(process.cwd(), "src/data/portfolioData.json"), path.join(__dirname, "doc.txt"), path.join(__dirname, "../../../data/portfolioData.json")];

    for (const candidate of candidatePaths) {
        try {
            if (fs.existsSync(candidate)) {
                const raw = fs.readFileSync(candidate, "utf-8");
                return JSON.parse(raw) as IMasterPortfolioData;
            }
        } catch {
            // Check next candidate path
        }
    }

    return null;
};

/**
 * Construct an accurate, grounded system prompt for Ollama AI based on Appon's master data.
 */
export const buildPortfolioSystemPrompt = (): string => {
    const data = loadPortfolioData();
    const customEnvPrompt = config.ollama.systemPrompt?.trim();

    if (!data) {
        return `You are the official AI assistant on Appon Islam's personal portfolio website (www.apponislam.com).
Appon Islam is a Full Stack Developer & Software Engineer based in Dhaka, Bangladesh.
Email: apponislamdev@gmail.com, Phone/WhatsApp: +8801722779803.
Respond warmly, professionally, and accurately.`.trim();
    }

    const p = data.profile || {};
    const legacyP = data.personal || {};
    const stats = data.statistics || {};
    const name = p.name || legacyP.name || "Appon Islam";
    const title = p.headline || p.title || legacyP.title || "Full Stack Developer & Software Engineer";
    const bio = p.bio || data.about || legacyP.tagline || "Full Stack Developer specializing in Next.js, TypeScript, Node.js, Express, MongoDB, and PostgreSQL.";
    const email = p.email || legacyP.email || "apponislamdev@gmail.com";
    const phone = p.phone || legacyP.phone || "+8801722779803";
    const location = p.location || legacyP.location || "Dhaka, Bangladesh";
    const website = data.meta?.websiteUrl || legacyP.website || "https://www.apponislam.com";
    const resumeUrl = p.resumeUrl || "https://drive.google.com/file/d/1A29W_NKb_N3VPjADS4tWapnEQUzmnQFs/view?usp=sharing";
    const statusText = p.status?.statusText || legacyP.availability || "Open to Work (Full-time, Contract, Freelance)";
    const experienceYears = stats.yearsOfCodingExperience || "4+";

    // 1. Social Profiles
    const socialSummary = p.socialLinks?.length
        ? p.socialLinks.map((s) => `${s.platform} (${s.url})`).join(" | ")
        : "GitHub (https://github.com/apponislam) | LinkedIn (https://www.linkedin.com/in/apponislam/)";

    // 2. Experience
    const expLines = (data.experience || []).map((e) => {
        const desc = e.description ? `: ${e.description.join(" ")}` : "";
        return `- **${e.title}** at **${e.organization}** (${e.duration})${desc}`;
    });

    // 3. Education & Certifications
    const eduLines = (data.education || []).map((edu) => {
        const loc = edu.location ? ` in ${edu.location}` : "";
        return `- **${edu.title}** - ${edu.organization}${loc} (${edu.duration})`;
    });

    const certLines = (data.certificates || []).map((c) => {
        const verify = c.credentialUrl ? ` [Verify: ${c.credentialUrl}]` : "";
        return `- **${c.title}** (${c.issuer}, ${c.issueDate})${verify}`;
    });

    // 4. Categorized Skills
    const skillLines: string[] = [];
    const skillsSource = data.skills?.categorized || data.skills;
    if (skillsSource && typeof skillsSource === "object") {
        for (const [category, items] of Object.entries(skillsSource)) {
            if (category === "totalCount" || category === "allSkills" || category === "categorized") continue;
            if (Array.isArray(items) && items.length > 0) {
                const catTitle =
                    category.includes(" ") || category.includes("&") || /^[A-Z]/.test(category)
                        ? category
                        : category
                              .replace(/([A-Z])/g, " $1")
                              .replace(/^./, (str) => str.toUpperCase())
                              .trim();
                const names = (items as Array<{ name?: string } | string>)
                    .map((item) => (typeof item === "string" ? item : item.name || ""))
                    .filter(Boolean)
                    .join(", ");
                skillLines.push(`- **${catTitle}**: ${names}`);
            }
        }
    }

    // 5. Featured Projects (9 projects with direct links and 1-line overview)
    const projectList = data.projects?.allProjects || data.projects?.featured || data.featuredProjects || [];
    const projectLines = projectList.map((proj, idx) => {
        const pName = proj.companyName || proj.title || `Project #${idx + 1}`;
        const demoUrl = proj.links?.demo?.url && !proj.links.demo.disabled ? proj.links.demo.url : proj.liveUrl;
        const ghFrontUrl = proj.links?.githubFrontend?.url && !proj.links.githubFrontend.disabled ? proj.links.githubFrontend.url : proj.githubUrl;
        const ghBackUrl = proj.links?.githubBackend?.url && !proj.links.githubBackend.disabled ? proj.links.githubBackend.url : null;

        const links: string[] = [];
        if (demoUrl) links.push(`Live: ${demoUrl}`);
        if (ghFrontUrl) links.push(`Client GH: ${ghFrontUrl}`);
        if (ghBackUrl) links.push(`Server GH: ${ghBackUrl}`);

        const summary = (proj.shortDescription || proj.description || "").split(".")[0] + ".";
        const tech = (proj.techStack || proj.technologies || []).slice(0, 8).join(", ");

        return `${idx + 1}. **${pName}**${links.length ? ` [${links.join(" | ")}]` : ""}: ${summary}${tech ? ` (Stack: ${tech})` : ""}`;
    });

    return `You are the official AI assistant on Appon Islam's personal portfolio website (www.apponislam.com).
Represent Appon warmly, accurately, and concisely.

### OFFICIAL PUBLIC CONTACT & PROFILES:
- Full Name: ${name} | Title: ${title}
- Bio: ${bio}
- Official Public Email: ${email}
- Public Phone / WhatsApp: ${phone}
- Location: ${location}
- Availability: ${statusText} (${experienceYears} years coding experience)
- Public Portfolio: ${website}
- Public Resume Link: ${resumeUrl}
- Public Social Profiles: ${socialSummary}

### WORK EXPERIENCE:
${expLines.join("\n")}

### EDUCATION & CERTIFICATIONS:
${eduLines.join("\n")}
${certLines.join("\n")}

### TECHNICAL SKILLS:
${skillLines.join("\n")}

### FEATURED PROJECTS (${projectList.length} PROJECTS):
${projectLines.join("\n")}

### INSTRUCTIONS:
1. **Be Concise**: Keep answers short, direct, and well-structured (2 to 4 sentences max). Never generate unnecessary filler or essays.
2. **Grounding**: Answer strictly using verified facts above. Never invent fake links or statistics.
3. **Contact Details**: When visitors ask how to contact, email, or hire Appon, always share his official public email (${email}) and phone/WhatsApp (${phone}).
4. **Links**: Provide the exact verified URLs when asked for demos, GitHub repos, or his Resume.
${customEnvPrompt ? `\n### ADDITIONAL INSTRUCTIONS:\n${customEnvPrompt}` : ""}
`.trim();
};
