import { readFileSync } from "node:fs";

const catalog = JSON.parse(readFileSync("data/catalogo.json", "utf8"));
const schema = JSON.parse(readFileSync("data/catalogo.schema.json", "utf8"));
const app = readFileSync("assets/js/app.js", "utf8");
const css = readFileSync("assets/css/style.css", "utf8");
const errors = [];
const expectedCategories = ["audiovisual", "radio", "tecnologia", "escritos", "territorio"];

if (catalog.schema_version !== "1.0") errors.push("schema_version must be 1.0");
if (!Array.isArray(catalog.categories) || !Array.isArray(catalog.items)) errors.push("categories and items must be arrays");
const categoryIds = new Set((catalog.categories || []).map(c => c.id));
for (const id of expectedCategories) if (!categoryIds.has(id)) errors.push(`missing permanent category: ${id}`);

const itemIds = new Set();
for (const item of catalog.items || []) {
  if (!item.id || itemIds.has(item.id)) errors.push(`missing or duplicate item id: ${item.id || "(empty)"}`);
  itemIds.add(item.id);
  if (!item.title || !item.type || !item.summary) errors.push(`incomplete basic metadata: ${item.id}`);
  if (!Array.isArray(item.categories) || item.categories.length === 0) errors.push(`no category: ${item.id}`);
  for (const category of item.categories || []) if (!categoryIds.has(category)) errors.push(`unknown category ${category}: ${item.id}`);
  if (!["draft", "review", "published", "archived"].includes(item.status)) errors.push(`invalid editorial status: ${item.id}`);
  if (!["public", "private"].includes(item.visibility)) errors.push(`invalid visibility: ${item.id}`);
  if (item.url && !/^https?:\/\//i.test(item.url)) errors.push(`invalid URL: ${item.id}`);
  if (item.status === "published" && item.visibility === "public" && !item.url) errors.push(`published public item has no URL: ${item.id}`);
  if (item.type === "radio" && item.status === "published" && !/^https?:\/\//i.test(item.stream_url || "")) errors.push(`published radio has no HTTP(S) stream_url: ${item.id}`);
  if (item.type === "video" && item.status === "published" && !/(youtube\.com\/watch\?v=|youtu\.be\/)/i.test(item.url || "")) errors.push(`published video is not a recognized YouTube URL: ${item.id}`);
}

if (!schema.properties?.items?.items?.properties?.stream_url) errors.push("schema does not define stream_url");
if (!app.includes("youtube-nocookie.com/embed/")) errors.push("YouTube embed implementation missing");
if (!app.includes('<audio controls')) errors.push("radio audio controls missing");
if (!css.includes(".catalog-video") || !css.includes(".catalog-audio")) errors.push("responsive media styles missing");

if (errors.length) {
  console.error("Catalog validation failed:");
  for (const error of errors) console.error("- " + error);
  process.exit(1);
}

console.log(`Catalog checks passed: ${catalog.items.length} entries; ${(catalog.items || []).filter(i => i.status === "published" && i.visibility === "public").length} public published entries; ${(catalog.items || []).filter(i => i.status === "review").length} awaiting review.`);
