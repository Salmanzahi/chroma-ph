import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, isAbsolute, join, normalize, relative, resolve } from "node:path";

const root = resolve(process.cwd(), "out");
const port = Number.parseInt(process.env.PORT ?? "3000", 10);

const MIME = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
};

function resolveRequestPath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const safePath = normalize(decoded).replace(/^(\.\.[/\\])+/, "");
  const relativePath = safePath === "/" ? "index.html" : safePath.replace(/^[/\\]/, "");
  const candidates = [relativePath];

  // Next static export encodes the final RSC segment in request URLs as
  // `route.__PAGE__.txt`, while the artifact is stored at `route/__PAGE__.txt`.
  // Map that URL form so client-side Link prefetch remains error-free locally.
  if (relativePath.endsWith(".__PAGE__.txt")) {
    candidates.push(relativePath.replace(/\.__PAGE__\.txt$/, "/__PAGE__.txt"));
  }

  if (!extname(relativePath)) {
    candidates.push(`${relativePath}.html`, join(relativePath, "index.html"));
  }

  for (const candidate of candidates) {
    const absolutePath = resolve(root, candidate);
    const relativeToRoot = relative(root, absolutePath);
    const isInsideRoot =
      relativeToRoot !== "" &&
      !relativeToRoot.startsWith("..") &&
      !isAbsolute(relativeToRoot);
    if (
      isInsideRoot &&
      existsSync(absolutePath) &&
      statSync(absolutePath).isFile()
    ) {
      return absolutePath;
    }
  }

  const notFound = join(root, "404.html");
  return existsSync(notFound) ? notFound : null;
}

if (!existsSync(root)) {
  console.error('Folder "out" belum tersedia. Jalankan "npm run build" terlebih dahulu.');
  process.exit(1);
}

createServer((request, response) => {
  try {
    const filePath = resolveRequestPath(request.url ?? "/");
    if (!filePath) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not Found");
      return;
    }

    const isNotFound = filePath.endsWith("404.html");
    response.writeHead(isNotFound ? 404 : 200, {
      "Content-Type": MIME[extname(filePath)] ?? "application/octet-stream",
      "Cache-Control": "no-cache",
      "X-Content-Type-Options": "nosniff",
    });
    createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Bad Request");
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`Static build tersedia di http://localhost:${port}`);
});
