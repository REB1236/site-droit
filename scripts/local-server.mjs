// Serveur local de test : sert dist/ et les fonctions /api (comme Vercel). Usage : node scripts/local-server.mjs
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const PORT = Number(process.env.PORT || 4173);
const DIST = path.join(process.cwd(), "dist");
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".png": "image/png", ".json": "application/json" };

http
  .createServer(async (req, res) => {
    const url = new URL(req.url, "http://x");
    if (url.pathname.startsWith("/api/")) {
      const name = url.pathname.slice(5).replace(/[^a-z]/g, "");
      const { default: handler } = await import(path.join(process.cwd(), "api", name + ".js"));
      let body = "";
      for await (const c of req) body += c;
      req.body = body ? JSON.parse(body) : {};
      res.status = (c) => ((res.statusCode = c), res);
      res.json = (o) => (res.setHeader("Content-Type", "application/json"), res.end(JSON.stringify(o)));
      return handler(req, res);
    }
    let file = path.join(DIST, url.pathname);
    if (!file.startsWith(DIST) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(DIST, "index.html");
    res.setHeader("Content-Type", TYPES[path.extname(file)] || "application/octet-stream");
    fs.createReadStream(file).pipe(res);
  })
  .listen(PORT, () => console.log(`http://localhost:${PORT}`));
