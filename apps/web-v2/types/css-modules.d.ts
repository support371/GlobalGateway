// CSS Module type declarations — allows TypeScript to import *.module.css files
declare module "*.module.css" {
  const classes: Record<string, string>;
  export default classes;
}
