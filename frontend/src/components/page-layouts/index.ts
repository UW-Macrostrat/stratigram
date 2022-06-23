import hyper, { classed } from "@macrostrat/hyper";
import { Box } from "@mantine/core";
import { Link } from "react-router-dom";
import classNames from "classnames";
import styles from "./main.styl";

const h = hyper.styled(styles);

export function FocusPage({ children, className }) {
  return h(
    PageLayout,
    { padding: "xlarge", sx: { maxWidth: 600 }, mx: "auto", className },
    [h(PageHeader), children]
  );
}

export function WidePage({ children, className, sidebarContent = null }) {
  return h(
    PageLayout,
    {
      padding: "xlarge",
      sx: { maxWidth: 1200 },
      mx: "auto",
      className: classNames(className, "wide-page"),
    },
    [
      h("div.sidebar", [
        h(PageHeader),
        h("div.sidebar-content", null, sidebarContent),
      ]),
      h("div.main", children),
    ]
  );
}

const PageLayout = classed(Box, "page-layout");

export function PageHeader() {
  return h("header", [h("h1", null, h(Link, { to: "/" }, "Stratigram"))]);
}
