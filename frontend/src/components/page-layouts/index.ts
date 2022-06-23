import h, { classed } from "@macrostrat/hyper";
import { Box } from "@mantine/core";
import { Link } from "react-router-dom";

export function FocusPage({ children, className }) {
  return h(
    PageLayout,
    { padding: "xlarge", sx: { maxWidth: 600 }, mx: "auto", className },
    [h(PageHeader), children]
  );
}

const PageLayout = classed(Box, "page-layout");

export function PageHeader() {
  return h("header", [h("h1", null, h(Link, { to: "/" }, "Stratigram"))]);
}
