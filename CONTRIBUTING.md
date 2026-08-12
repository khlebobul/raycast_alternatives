# Contributing

Data is split by responsibility:

- `data/apps.json` — applications people want to replace.
- `data/extensions.json` — Raycast extensions and the application IDs they replace.

An extension can replace several apps, and an app can have several extensions. Add IDs to the `replaces` array to create those links.

Apps use `iconUrl` for artwork. If an image cannot load, the UI uses the first letter of its name.

Run `npm test` and `npm run build`, then open a pull request.
