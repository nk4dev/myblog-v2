// SKILL.md files are imported as text (Vite ?raw) by src/server/wellknown.ts
declare module "*.md?raw" {
  const content: string;
  export default content;
}
