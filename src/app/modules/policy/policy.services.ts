import { TPolicyType } from "./policy.interface";

const getPolicyByType = async (type: TPolicyType) => {
    if (type === "terms") {
        return {
            title: "Terms & Conditions",
            type: "terms",
            version: "1.0",
            isPublished: true,
            content: `
## Terms & Conditions

Welcome to **Appon Islam Portfolio**. By accessing or using our services, you agree to be bound by these terms.

### 1. Services & Usage
- Appon Islam Portfolio provides details on software development services, project showcases, and developer contact forms.
- Users are responsible for providing accurate information when submitting contact or feedback requests.

### 2. Intellectual Property
- All source code, projects, media, and design elements featured are owned by or licensed to Appon Islam unless otherwise stated.

### 3. Fair Use & Privacy
- You agree not to use the contact or feedback services for spam, abusive behavior, or unauthorized automated requests.

### 4. Updates to Terms
We may update these terms from time to time. Continued use of the platform constitutes acceptance of updated terms.
            `.trim(),
        };
    } else {
        return {
            title: "Privacy Policy",
            type: "privacy",
            version: "1.0",
            isPublished: true,
            content: `
## Privacy Policy

At **Appon Islam Portfolio**, we value and respect your privacy.

### 1. Data Collection
- **Personal Information**: Name, email address, phone number, and message content when submitting contact requests or registering an account.
- **Analytics & Visitor Data**: IP address, device type, browser platform, and visit timestamps to optimize performance and security.

### 2. Data Usage
- We use your data strictly to reply to inquiries, provide developer services, and improve the user experience.
- We never sell or share your personal data with third parties.

### 3. Data Protection
- Industry-standard security practices (JWT authentication, bcrypt password hashing, and encrypted channels) are used to safeguard all records.

### 4. Contact Us
If you have questions regarding our privacy practices, please contact us via apponislamdev@gmail.com or through our Contact page.
            `.trim(),
        };
    }
};

const getAllPolicies = async () => {
    const terms = await getPolicyByType("terms");
    const privacy = await getPolicyByType("privacy");
    return [terms, privacy];
};

const upsertPolicy = async (type: TPolicyType, body: any, userId: string) => {
    return {
        title: type === "terms" ? "Terms & Conditions" : "Privacy Policy",
        type,
        content: body.content,
        version: body.version || "1.0",
        isPublished: body.isPublished !== undefined ? body.isPublished : true,
    };
};

export const policyServices = {
    getPolicyByType,
    getAllPolicies,
    upsertPolicy,
};
