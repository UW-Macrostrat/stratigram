import h from "@macrostrat/hyper";
import { AppShell, Navbar, Header } from "@mantine/core";

function App1() {
  return h(AppShell, {
    padding: "md",
    navbar: h(Navbar, { width: { base: 300 }, p: "xs" }),
    header: h(Header, { height: 60, p: "xs" }, h("h1", null, "Stratiform")),
    styles: (theme) => ({
      main: {
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[8]
            : theme.colors.gray[0],
      },
    }),
  });
}
