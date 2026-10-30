import { readFile, writeFile } from "node:fs/promises";
import { marked } from "marked";

const markdownPath = new URL("./07_clean_code.md", import.meta.url);
const htmlPath = new URL("./07_clean_code.html", import.meta.url);

const markdown = await readFile(markdownPath, "utf8");
const htmlBody = marked.parse(markdown);
const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>07 - Clean Code</title>
  </head>
  <body>
${htmlBody}
  </body>
</html>
`;

await writeFile(htmlPath, html, "utf8");
console.log("Converted 07_clean_code.md to 07_clean_code.html");
