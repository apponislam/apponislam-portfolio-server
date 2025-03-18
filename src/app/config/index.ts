import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
    port: process.env.PORT,
    database_url: process.env.DATABASE_URL,
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,

    jwt_secret: process.env.JWT_SECRET,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
    jwt_access_expire: process.env.JWT_ACCESS_EXPIRE,
    jwt_refresh_expire: process.env.JWT_REFRESH_EXPIRE,
};
