import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { api } from "./routes.js";
import { HttpError } from "./middleware.js";

const app = express();
const port = Number(process.env.PORT ?? 4000);
const clientOrigin = process.env.CLIENT_ORIGIN ?? "http://localhost:5173";

app.disable("x-powered-by");
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      "img-src": ["'self'", "data:", "https:"]
    }
  }
}));
app.use(cors({ origin: clientOrigin, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use("/api/admin/login", rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false }));
app.use("/api", api);
app.use("/api", (_req, res) => res.status(404).json({ error: "API endpoint not found." }));
if (process.env.NODE_ENV === "production") {
  const clientBuild = resolve(fileURLToPath(new URL(".", import.meta.url)), "../../../client/dist");
  app.use(express.static(clientBuild, { index: false }));
  app.get("/{*splat}", (_req, res, next) => {
    res.sendFile(resolve(clientBuild, "index.html"), (error) => {
      if (error) next(error);
    });
  });
}
app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (error instanceof HttpError) return res.status(error.status).json({ error: error.message });
  if (error && typeof error === "object" && "name" in error && error.name === "ZodError") {
    const message = "issues" in error && Array.isArray(error.issues) ? String(error.issues[0]?.message ?? "Please check the provided information.") : "Please check the provided information.";
    return res.status(400).json({ error: message });
  }
  if (error && typeof error === "object" && "code" in error) {
    const code = String(error.code);
    if (code === "P2002") return res.status(409).json({ error: "That name is already in use." });
    if (code === "P2025") return res.status(404).json({ error: "The requested record was not found." });
  }
  console.error("Unhandled API error:", error);
  return res.status(500).json({ error: "Something went wrong. Please try again." });
});

app.listen(port, () => console.log(`SABA READYMADE API listening on http://localhost:${port}`));
