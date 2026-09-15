import { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "./auth.config.js";

// Security Guard (Middleware)
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Request-il ninnu token eduthu user aaranennu check cheyyunnu
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers)
        });

        if (!session) {
            res.status(401).json({ message: "Unauthorized - Please login first" });
            return;
        }

        // User-ne kitiyal adutha function-ukalkku (Controllers) edukkan vendi save cheyyunnu
        res.locals.user = session.user;
        res.locals.session = session.session;

        next(); // Check pass aayi, adutha function-ilekku vidunnu
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
