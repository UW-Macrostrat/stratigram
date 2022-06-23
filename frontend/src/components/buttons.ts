import h from "~/hyper";
import { Button } from "@blueprintjs/core";
import { useNavigate, useMatch, useResolvedPath } from "react-router";

export function SidebarButton(props) {
  let navigate = useNavigate();
  let { icon, to, ...rest } = props;
  let resolved = useResolvedPath(to);
  let active = useMatch({ path: resolved.pathname, end: true });

  return h(Button, {
    className: "sidebar-button",
    active,
    disabled: active,
    large: true,
    minimal: true,
    icon: icon,
    onClick: () => navigate(to),
    ...rest,
  });
}
