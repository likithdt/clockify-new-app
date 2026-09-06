import http from "node:http";
import { createViteApiMiddleware } from "./apiMiddleware.ts";

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

const middleware = createViteApiMiddleware();

const server = http.createServer((req, res) => {
  // Add CORS headers for mobile clients / dev
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  middleware(req, res, () => {
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Not Found" }));
  });
});

if (process.env.NODE_ENV !== "test" && process.argv[1]?.includes("server.ts")) {
  server.listen(PORT, () => {
    console.log(`[Clockify Mobile Backend] Server running at http://localhost:${PORT}`);
  });
}

export { server };
