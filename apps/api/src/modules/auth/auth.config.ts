import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    trustedOrigins: ["http://localhost:3000"],
    
    // 1. Email and Password Settings
    emailAndPassword: {
        enabled: true,
        // Optional: requireEmailVerification: true, // Uncomment when ready to enforce
        async sendResetPassword({ user, url }: any) {
            // TODO: Wire up Resend/Sendgrid here
            console.log("=========================================");
            console.log(`[AUTH] Password Reset for ${user.email}`);
            console.log(`[AUTH] Reset Link: ${url}`);
            console.log("=========================================");
        },
        async sendVerificationEmail({ user, url }: any) {

            // TODO: Wire up Resend/Sendgrid here
            console.log("=========================================");
            console.log(`[AUTH] Verify Email for ${user.email}`);
            console.log(`[AUTH] Verification Link: ${url}`);
            console.log("=========================================");
        }
    },

    // 2. Social Providers
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }
    },  

    // 3. Custom Fields (Telling Better-Auth about our Prisma fields)
    user: {
        additionalFields: {
            username: {
                type: "string",
                required: false,
            },
            displayName: {
                type: "string",
                required: false,
            }
        }
    },

    // 4. Database Hooks (Generating username before saving)
    databaseHooks: {
        user: {
            create: {
                before: async (user: any) => {
                    // Extract first part of email for username
                    const emailUsername = user.email.split('@')[0];
                    // Generate a 4 digit random number
                    const randomNum = Math.floor(1000 + Math.random() * 9000);
                    
                    return {
                        data: {
                            ...user,
                            username: user.username || `${emailUsername}${randomNum}`,
                            displayName: user.displayName || user.name
                        }
                    };
                }
            }
        }
    },

    // 5. Advanced Settings
    advanced: {
        database: {
            generateId: false
        }
    }
});
