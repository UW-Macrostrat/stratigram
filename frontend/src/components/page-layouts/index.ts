import { classed } from "~/hyper";
import h from "./main.styl";
import { Box } from "@mantine/core";
import { DarkModeButton } from "@macrostrat/ui-components";
import { Link } from "react-router-dom";
import classNames from "classnames";

export function FocusPage({ children, className }) {
  return h(
    PageLayout,
    { padding: "xlarge", sx: { maxWidth: 600 }, mx: "auto", className },
    [h(PageHeader, [h("div.right-buttons", h(DarkModeButton))]), children]
  );
}

export function WidePage({ children, className, sidebarContent = null }) {
  return h(
    PageLayout,
    {
      padding: "xlarge",
      mx: "auto",
      className: classNames(className, "wide-page"),
    },
    [
      h("div.sidebar", [
        h(PageHeader),
        h("div.sidebar-content", null, sidebarContent),
        h("div.spacer"),
        h(DarkModeButton, { showText: true, large: true, minimal: true }),
      ]),
      h("div.main", children),
    ]
  );
}

const PageLayout = classed(Box, "page-layout");

export function PageHeader({ children }) {
  return h("header.page-header", [
    h("h1", null, h(Link, { to: "/" }, "Stratigram")),
    h("div.spacer"),
    children,
  ]);
}
