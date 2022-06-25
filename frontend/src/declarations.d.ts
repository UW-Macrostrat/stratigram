// import hyper from "@macrostrat/hyper";
//
type Hyper = import("@macrostrat/hyper").Hyper;

declare module "*.styl" {
  const content: Record<string, string>;
  const hyper: Hyper;
  export default hyper;
}
