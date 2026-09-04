"use strict";
const http = require("node:http"),
  fs = require("node:fs"),
  path = require("node:path");
const root = path.resolve(__dirname, ".."),
  port = Number(process.env.PORT || 8765);
http
  .createServer((req, res) => {
    let name;
    try {
      name = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    } catch {
      return res.writeHead(400).end();
    }
    if (name === "/") name = "/pam-ai/";
    if (name.endsWith("/")) name += "index.html";
    if (
      name.split("/").some((p) => p.startsWith(".")) ||
      !/^\/(pam-ai|docs)\//.test(name)
    )
      return res.writeHead(404).end();
    const file = path.resolve(root, "." + name);
    if (!file.startsWith(root + path.sep)) return res.writeHead(403).end();
    fs.readFile(file, (err, data) => {
      if (err) return res.writeHead(404).end("Niet gevonden");
      const type =
        {
          ".html": "text/html; charset=utf-8",
          ".js": "text/javascript; charset=utf-8",
          ".css": "text/css; charset=utf-8",
          ".svg": "image/svg+xml",
          ".json": "application/json",
          ".md": "text/plain; charset=utf-8",
          ".xlsx":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          ".docx":
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        }[path.extname(file)] || "application/octet-stream";
      res.writeHead(200, {
        "Content-Type": type,
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      });
      res.end(data);
    });
  })
  .listen(port, "127.0.0.1", () =>
    console.log("PAM-AI: http://127.0.0.1:" + port + "/pam-ai/"),
  );
