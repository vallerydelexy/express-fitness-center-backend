
import dotenv from 'dotenv';
dotenv.config();

const requiredVariables = [
    "DATABASE_URL", "ENCRYPTION_KEY", "FRONTEND_URL", "SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS",
];

export const validateEnv = async () => {
    const unsetVariables = [];

    for (const key of requiredVariables) {
        if (!process.env[key]) {
            unsetVariables.push(key);
        }
    }

    if (unsetVariables.length > 0) {
        throw new Error(`The following environment variables are not set:\r\n${unsetVariables.join('\r\n')}`);
    }
};
