import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";

const root = resolve(import.meta.dirname, "..");
const types = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css", ".json":"application/json", ".svg":"image/svg+xml" };
createServer(async (request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
  if (pathname === "/practice-test.html") {
    const page = (await readFile(resolve(root, "practice.html"), "utf8"))
      .replace(/<script src="firebase-config\.js[^\n]*\n/, "")
      .replace(/<script type="module" src="auth\.js[^\n]*\n/, "");
    response.writeHead(200, { "Content-Type":"text/html", "Cache-Control":"no-store" }).end(page);
    return;
  }
  const file = resolve(root, "." + pathname);
  if (file !== root && !file.startsWith(root + sep)) { response.writeHead(403).end(); return; }
  try {
    const body = await readFile(file);
    response.writeHead(200, { "Content-Type":types[extname(file)] || "application/octet-stream", "Cache-Control":"no-store" }).end(body);
  } catch { response.writeHead(404).end(); }
}).listen(8765, "127.0.0.1", () => console.log("Test server: http://127.0.0.1:8765"));
