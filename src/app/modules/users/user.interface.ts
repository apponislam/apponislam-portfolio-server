export interface IUser {
    name: string;
    email: string;
    image: string;
    password?: string;
    provider: "Google" | "Github" | "Email";
}
