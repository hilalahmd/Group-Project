import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    trustedOrigins: ["http://localhost:3000"],
    emailAndPassword: {
        enabled: true,
        // Optional: requireEmailVerification: true, // Uncomment when ready to enforce
        async sendResetPassword({ user, url }) {
            // TODO: Wire up Resend/Sendgrid here
            console.log("=========================================");
            console.log(`[AUTH] Password Reset for ${user.email}`);
            console.log(`[AUTH] Reset Link: ${url}`);
            console.log("=========================================");
        },
        async sendVerificationEmail({ user, url }) {
            // TODO: Wire up Resend/Sendgrid here
            console.log("=========================================");
            console.log(`[AUTH] Verify Email for ${user.email}`);
            console.log(`[AUTH] Verification Link: ${url}`);
            console.log("=========================================");
        }
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }
    },  

    advanced: {
        database: {
            generateId: false
        }
    }
});
