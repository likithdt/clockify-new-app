import type { IncomingMessage, ServerResponse } from "node:http";
import { handleApiRoute, type RequestContext } from "./routes/apiRouter.ts";

export function createViteApiMiddleware() {
  return async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    if (!req.url || !req.url.startsWith("/api")) {
      return next();
    }

    try {
      const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
      const path = parsedUrl.pathname;
      const query: Record<string, string> = {};
      parsedUrl.searchParams.forEach((value, key) => {
        query[key] = value;
      });

      let body: any = null;
      if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
        const chunks: Buffer[] = [];
        for await (const chunk of req) {
          chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
        }
        const rawBody = Buffer.concat(chunks).toString("utf-8");
        if (rawBody.trim()) {
          try {
            body = JSON.parse(rawBody);
          } catch (e) {
            body = rawBody;
          }
        }
      }

      const context: RequestContext = {
        method: req.method || "GET",
        path,
        query,
        body,
      };

      const result = await handleApiRoute(context);

      res.statusCode = result.status;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify(
          result.data !== undefined
            ? result.data
            : { error: result.error, errors: (result as any).errors }
        )
      );
    } catch (err: any) {
      console.error("[API Middleware Error]:", err);
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: err?.message || "Internal Server Error" }));
    }
  };
}
