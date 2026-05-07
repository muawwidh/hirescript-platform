import { createReadStream, existsSync } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { Readable } from "node:stream";

const port = Number(process.env.PORT || 3000);
const clientDir = resolve("dist/client");
const serverModule = await import("../dist/server/index.js");
const app = serverModule.default ?? serverModule;

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function getStaticPath(url) {
  const pathname = decodeURIComponent(new URL(url, "http://localhost").pathname);
  const relativePath = normalize(pathname).replace(/^(\.\.[/\\])+/, "");
  const filePath = resolve(join(clientDir, relativePath));
  return filePath.startsWith(clientDir) ? filePath : undefined;
}

async function serveStatic(req, res) {
  if (!["GET", "HEAD"].includes(req.method || "")) return false;

  const filePath = getStaticPath(req.url || "/");
  if (!filePath || !existsSync(filePath)) return false;

  const fileStat = await stat(filePath);
  if (!fileStat.isFile()) return false;

  res.statusCode = 200;
  res.setHeader("content-length", fileStat.size);
  res.setHeader("content-type", contentTypes[extname(filePath)] || "application/octet-stream");

  if (filePath.includes("/assets/")) {
    res.setHeader("cache-control", "public, max-age=31536000, immutable");
  }

  if (req.method === "HEAD") {
    res.end();
    return true;
  }

  createReadStream(filePath).pipe(res);
  return true;
}

function toWebRequest(req) {
  const protocol = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost";
  const url = `${protocol}://${host}${req.url}`;
  const headers = new Headers();

  for (const [key, value] of Object.entries(req.headers)) {
    if (Array.isArray(value)) {
      for (const item of value) headers.append(key, item);
    } else if (value !== undefined) {
      headers.set(key, value);
    }
  }

  const init = {
    method: req.method,
    headers,
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = Readable.toWeb(req);
    init.duplex = "half";
  }

  return new Request(url, init);
}

async function sendWebResponse(webResponse, res) {
  res.statusCode = webResponse.status;
  webResponse.headers.forEach((value, key) => res.setHeader(key, value));

  if (!webResponse.body) {
    res.end();
    return;
  }

  Readable.fromWeb(webResponse.body).pipe(res);
}

createServer(async (req, res) => {
  try {
    if (await serveStatic(req, res)) return;
    const response = await app.fetch(toWebRequest(req), process.env, {});
    await sendWebResponse(response, res);
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.setHeader("content-type", "text/plain; charset=utf-8");
    res.end("Internal Server Error");
  }
}).listen(port, "0.0.0.0", () => {
  console.log(`Frontend server listening on ${port}`);
});
