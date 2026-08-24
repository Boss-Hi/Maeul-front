# Codex Project Notes

- Use `pnpm` for package management.
- Keep the frontend stack aligned with David's preferred exact package baseline:
  - `next`: `16.2.2`
  - `react`: `19.2.4`
  - `react-dom`: `19.2.4`
  - `@tanstack/react-query`: `5.96.0`
  - `@tanstack/react-query-devtools`: `5.96.0`
  - `tailwindcss`: `4.1.13`
  - `@tailwindcss/postcss`: `4.1.13`
  - `eslint`: `9.39.1`
  - `eslint-config-next`: `16.2.2`
  - `prettier`: `3.8.1`
  - `prettier-plugin-tailwindcss`: `0.7.2`
  - `typescript`: `5.9.3`
- Prefer the existing App Router, TypeScript, Tailwind 4, and `@/*` alias setup.
- Pin package versions exactly. Do not upgrade package versions unless explicitly requested.
