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

    return `You are the official portfolio AI assistant representing Appon Islam (Full Stack Developer & Software Engineer).
All contact channels, links, and details below are verified, authorized public business contact information provided by Appon Islam specifically for recruiters, clients, and visitors to reach or hire him.

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

### FEATURED PROJECTS (${projectList.length} PROJECTS - IN EXACT PRIORITY ORDER):
${projectLines.join("\n")}

### INSTRUCTIONS:
1. **Professional Tone**: Be welcoming, professional, and articulate. Use clean markdown formatting (bullet points, bold text). Avoid unnecessary filler, but provide complete and informative answers.
2. **Grounding**: Answer strictly using verified facts above. Never invent fake links, projects, or statistics.
3. **Featured Projects Order**: When visitors ask about featured or key projects, ALWAYS present them starting with #1 **Djarna - P2P Social Marketplace** first, followed by #2 **Peptide Club**, #3 **LetANest**, etc., matching the exact priority order above.
4. **Contact & Hiring Inquiries**: You are explicitly authorized and required to share Appon's public business contact channels whenever visitors ask how to contact, email, hire, or collaborate with him. Warmly confirm he is currently **${statusText}** for full-time software engineering roles, contracts, and freelance projects. Always provide his complete verified contact channels in clear bullet points:
   - **Email**: ${email}
   - **Phone / WhatsApp**: ${phone}
   - **Resume / CV**: ${resumeUrl}
   - **LinkedIn**: https://www.linkedin.com/in/apponislam/
   - **GitHub**: https://github.com/apponislam
   - **Portfolio**: ${website}
   Encourage them warmly to get in touch directly to discuss opportunities.
5. **Links**: Provide the exact verified URLs when asked for demos, GitHub repos, or his Resume.
${customEnvPrompt ? `\n### ADDITIONAL INSTRUCTIONS:\n${customEnvPrompt}` : ""}
`.trim();
};

/**
 * Check if the query matches one of the 4 flagship suggestion chips:
 * 1. Tech Stack & Skills (Frameworks, languages, databases)
 * 2. Featured Projects (Full-stack apps, architecture, live demos)
 * 3. Experience & Background (Work history and professional roles)
 * 4. Hire & Contact (Availability, email, and social links)
 *
 * If matched, returns an immediate, grounded markdown response to eliminate 5-10s Ollama latency.
 */
export const getPresetAnswer = (userQuery: string): string | null => {
    const norm = userQuery
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    if (!norm) return null;

    const data = loadPortfolioData();
    if (!data) return null;

    const p = data.profile || {};
    const stats = data.statistics || {};
    const email = p.email || "apponislamdev@gmail.com";
    const phone = p.phone || "+8801722779803";
    const resumeUrl = p.resumeUrl || "https://drive.google.com/file/d/1A29W_NKb_N3VPjADS4tWapnEQUzmnQFs/view?usp=sharing";
    const website = data.meta?.websiteUrl || "https://www.apponislam.com";

    // 1. Tech Stack & Skills
    if (
        norm.includes("tech stack") ||
        norm.includes("frameworks languages databases") ||
        norm === "skills" ||
        norm.includes("technical skills") ||
        (norm.includes("skill") && (norm.includes("stack") || norm.includes("technolog")))
    ) {
        const skillLines: string[] = [];
        const skillsSource = data.skills?.categorized || data.skills || {};
        for (const [cat, items] of Object.entries(skillsSource)) {
            if (Array.isArray(items) && items.length > 0) {
                skillLines.push(`* **${cat}**: ${items.join(", ")}`);
            }
        }

        return `Here is a comprehensive breakdown of Appon Islam's core technical skills and stack:\n\n${skillLines.join("\n")}\n\nAppon specializes in building scalable, production-ready full-stack applications with clean code, robust API architecture, and seamless user experiences.`;
    }

    // 2. Featured Projects (Exact Priority Order, Djarna #1)
    if (
        norm.includes("featured project") ||
        norm.includes("full stack apps architecture live demos") ||
        norm.includes("featured apps") ||
        norm.includes("key projects") ||
        (norm.includes("project") && (norm.includes("show") || norm.includes("list") || norm.includes("tell me about") || norm.includes("work")))
    ) {
        const allProjects = data.projects?.allProjects || [];
        const projectLines = allProjects.slice(0, 5).map((proj, idx) => {
            const pName = proj.companyName || proj.title;
            const demoUrl = proj.links?.demo?.url && !proj.links.demo.disabled ? proj.links.demo.url : proj.liveUrl;
            const ghFront = proj.links?.githubFrontend?.url && !proj.links.githubFrontend.disabled ? proj.links.githubFrontend.url : proj.githubUrl;
            const links: string[] = [];
            if (demoUrl) links.push(`[Live Demo](${demoUrl})`);
            if (ghFront) links.push(`[GitHub Repo](${ghFront})`);
            const linksStr = links.length ? ` — ${links.join(" | ")}` : "";
            const summary = (proj.shortDescription || proj.description || "").split(".")[0] + ".";
            const tech = (proj.techStack || []).slice(0, 6).join(", ");
            return `${idx + 1}. **${pName}**${linksStr}\n   ${summary}${tech ? ` *(Tech: ${tech})*` : ""}`;
        });

        return `Here are Appon's key featured projects in priority order:\n\n${projectLines.join("\n\n")}\n\nFeel free to ask for technical deep dives, architecture details, or github repositories for any of these projects!`;
    }

    // 3. Experience & Background
    if (
        norm.includes("experience background") ||
        norm.includes("work history") ||
        norm.includes("professional roles") ||
        norm.includes("work history and professional roles") ||
        (norm.includes("experience") && (norm.includes("background") || norm.includes("history") || norm.includes("work") || norm.includes("years")))
    ) {
        const expList = data.experience || [];
        const expLines = expList.map((e) => {
            const desc = e.description ? `\n   ${e.description.join(" ")}` : "";
            return `* **${e.title}** at **${e.organization}** (${e.duration})${desc}`;
        });

        return `Here is an overview of Appon Islam's professional experience and background:\n\n${expLines.join("\n\n")}\n\nAppon has ${stats.yearsOfCodingExperience || "4+"} years of hands-on coding experience, building scalable full-stack applications, designing robust database schemas, and leading collaborative projects.`;
    }

    // 4. Hire & Contact
    if (
        norm.includes("hire contact") ||
        norm.includes("availability email") ||
        norm.includes("availability email and social links") ||
        norm.includes("contact or hire") ||
        norm.includes("hire appon") ||
        norm.includes("contact appon") ||
        norm.includes("how can i contact") ||
        norm.includes("how to contact") ||
        norm.includes("how to hire")
    ) {
        return `Appon Islam is currently **Open to Work** and actively available for full-time software engineering roles, contracts, and freelance projects!\n\nYou can reach out to him directly through the following official channels:\n\n* **Email**: [${email}](mailto:${email})\n* **Phone / WhatsApp**: [${phone}](tel:${phone.replace(/[^0-9+]/g, "")})\n* **Resume / CV**: [View Resume (Google Drive)](${resumeUrl})\n* **LinkedIn**: [linkedin.com/in/apponislam](https://www.linkedin.com/in/apponislam/)\n* **GitHub**: [github.com/apponislam](https://github.com/apponislam)\n* **Portfolio**: [${website}](${website})\n\nFeel free to message him directly via Email or WhatsApp to discuss job opportunities, project requirements, or technical consultations.`;
    }

    return null;
};

