import { readFile } from 'node:fs/promises';

const load = (name) => readFile(new URL(`../data/${name}.json`, import.meta.url)).then(JSON.parse);
const [apps, extensions] = await Promise.all([load('apps'), load('extensions')]);
const categories = new Set(['productivity', 'developer', 'media', 'utilities', 'communication']);
const ids = (items, type) => {
  const found = new Set();
  for (const item of items) {
    if (!/^[a-z0-9-]+$/.test(item.id)) throw new Error(`${type}: invalid id ${item.id}`);
    if (found.has(item.id)) throw new Error(`${type}: duplicate id ${item.id}`);
    found.add(item.id);
  }
  return found;
};
const appIds = ids(apps, 'app');
ids(extensions, 'extension');

for (const app of apps) {
  if (!app.name || !app.url?.startsWith('https://') || !app.iconUrl?.startsWith('https://') || !app.description || !categories.has(app.category)) throw new Error(`Invalid app: ${app.id}`);
}
for (const extension of extensions) {
  if (!extension.name || !extension.description || !extension.url?.startsWith('https://www.raycast.com/') || !extension.replaces?.length) throw new Error(`Invalid extension: ${extension.id}`);
  for (const appId of extension.replaces) if (!appIds.has(appId)) throw new Error(`${extension.id}: unknown app ${appId}`);
}
for (const appId of appIds) if (!extensions.some((extension) => extension.replaces.includes(appId))) throw new Error(`${appId}: no replacements`);

console.log(`Validated ${apps.length} apps and ${extensions.length} extensions.`);
