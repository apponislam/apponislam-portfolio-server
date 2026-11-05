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
    const socialLines: string[] = [];
    if (p.socialLinks && p.socialLinks.length > 0) {
        for (const s of p.socialLinks) {
            socialLines.push(`- **${s.platform}**: ${s.url}${s.description ? ` (${s.description})` : ""}`);
        }
    } else if (legacyP.social) {
        for (const [platform, url] of Object.entries(legacyP.social)) {
            socialLines.push(`- **${platform}**: ${url}`);
        }
    }

    // 2. Experience
    const expLines: string[] = [];
    if (data.experience && data.experience.length > 0) {
        data.experience.forEach((e, idx) => {
            const bulletStr = (e.description || []).map((b) => `   * ${b}`).join("\n");
            expLines.push(`${idx + 1}. **${e.title}** at **${e.organization}** (${e.duration})\n${bulletStr}`);
        });
    }

    // 3. Education
    const eduLines: string[] = [];
    if (data.education && data.education.length > 0) {
        data.education.forEach((edu, idx) => {
            const loc = edu.location ? ` (${edu.location})` : "";
            const bulletStr = (edu.description || []).map((b) => `   * ${b}`).join("\n");
            eduLines.push(`${idx + 1}. **${edu.title}** - ${edu.organization}${loc} [${edu.duration}]\n${bulletStr}`);
        });
    }

    // 4. Certificates
    const certLines: string[] = [];
    if (data.certificates && data.certificates.length > 0) {
        data.certificates.forEach((c, idx) => {
            const verify = c.credentialUrl ? ` | Verification: ${c.credentialUrl}` : "";
            const desc = c.description ? `\n   ${c.description.join(" ")}` : "";
            certLines.push(`${idx + 1}. **${c.title}** - Issued by ${c.issuer} (${c.issueDate})${verify}${desc}`);
        });
    }

    // 5. Categorized Skills
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

    // 6. Projects (All 9 projects with exact links & tech stacks)
    const projectList = data.projects?.allProjects || data.projects?.featured || data.featuredProjects || [];
    const projectLines: string[] = [];
    projectList.forEach((proj, idx) => {
        const pName = proj.companyName || proj.title || `Project #${idx + 1}`;
        const pDesc = proj.shortDescription || proj.description || "";
        const catStr = (proj.category || []).join(", ");
        const techStr = (proj.techStack || proj.technologies || []).join(", ");

        const demoUrl = proj.links?.demo?.url && !proj.links.demo.disabled ? proj.links.demo.url : proj.liveUrl;
        const ghFrontUrl = proj.links?.githubFrontend?.url && !proj.links.githubFrontend.disabled ? proj.links.githubFrontend.url : proj.githubUrl;
        const ghBackUrl = proj.links?.githubBackend?.url && !proj.links.githubBackend.disabled ? proj.links.githubBackend.url : null;

        const linkParts: string[] = [];
        if (demoUrl) linkParts.push(`Live Demo: ${demoUrl}`);
        if (ghFrontUrl) linkParts.push(`Frontend Repo: ${ghFrontUrl}`);
        if (ghBackUrl) linkParts.push(`Backend Repo: ${ghBackUrl}`);

        const highlights = proj.descriptionDetails?.bullets?.length ? `\n   * Highlights: ${proj.descriptionDetails.bullets.join("; ")}` : "";

        projectLines.push(`${idx + 1}. **${pName}**${catStr ? ` [${catStr}]` : ""}\n` + `   - Overview: ${pDesc}\n` + `   - Technologies: ${techStr}\n` + (linkParts.length ? `   - URLs: ${linkParts.join(" | ")}\n` : "") + highlights);
    });

    // 7. Verified Knowledge Base Q&A
    const kbLines: string[] = [];
    if (data.knowledgeBase && data.knowledgeBase.length > 0) {
        data.knowledgeBase.forEach((kb) => {
            kbLines.push(`Q: ${kb.question}\nA: ${kb.answer}`);
        });
    } else if (data.faqs && data.faqs.length > 0) {
        data.faqs.forEach((faq) => {
            kbLines.push(`Q: ${faq.question}\nA: ${faq.answer}`);
        });
    }

    return `You are the official, intelligent AI assistant on Appon Islam's personal portfolio website (www.apponislam.com).
Your primary role is to warmly represent Appon Islam, answer visitors' and recruiters' questions with 100% factual accuracy, showcase his projects, skills, education, and career history, and help potential employers or clients contact and hire him.

### APPON ISLAM'S PROFILE & CONTACT INFO:
- **Full Name**: ${name}
- **Professional Title**: ${title}
- **Bio**: ${bio}
- **Primary Email**: ${email}
- **Phone / WhatsApp**: ${phone}
- **Location**: ${location}
- **Availability / Status**: ${statusText}
- **Coding Experience**: ${experienceYears} of professional & practical coding experience
- **Portfolio Website**: ${website}
- **Curriculum Vitae / Resume Link**: ${resumeUrl}

### SOCIAL & PROFESSIONAL LINKS:
${socialLines.join("\n")}

### CURRENT WORK EXPERIENCE:
${expLines.join("\n\n")}

### EDUCATION & ACADEMIC BACKGROUND:
${eduLines.join("\n\n")}

### CERTIFICATIONS & COMPETITIVE CODING:
${certLines.join("\n\n")}

### TECHNICAL SKILLS:
${skillLines.join("\n")}

### COMPLETE PROJECT PORTFOLIO (${projectList.length} PROJECTS):
${projectLines.join("\n\n")}

### VERIFIED KNOWLEDGE BASE & FREQUENT QUESTIONS:
${kbLines.join("\n\n")}

### STRICT BEHAVIORAL INSTRUCTIONS:
1. **Grounding & Accuracy**: Always answer using ONLY the factual data provided above. Never invent fake projects, fake links, or fake metrics.
2. **Contact & Hiring**: Whenever asked how to contact, hire, or collaborate with Appon, immediately provide his direct email (${email}) and phone/WhatsApp (${phone}), and mention he is currently "${statusText}".
3. **Exact Links**: When asked for project demos, GitHub repositories, or his Resume, always give the exact URLs listed above.
4. **Tone & Style**: Be articulate, friendly, respectful, and developer-focused. Format responses with clean markdown (bullet points, bold text).
5. **Unknown Inquiries**: If a visitor asks about something not covered in the knowledge base, politely state that you don't have that specific detail and invite them to reach out directly to Appon at ${email}.
${customEnvPrompt ? `\n### ADDITIONAL INSTRUCTIONS:\n${customEnvPrompt}` : ""}
`.trim();
};
