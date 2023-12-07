/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import h from "~/hyper";
import { Switch, Button } from "@blueprintjs/core";
import { Panel } from "~/components/ui-panel";
import { Spec } from "immutability-helper";
import { useImmutableState } from "@macrostrat/ui-components";

interface ColumnSettings {
  generalized: boolean;
  clipImage: boolean;
}

function useColumnSettings() {
  const [settings, updateSettings] = useImmutableState<ColumnSettings>({
    generalized: false,
    clipImage: false,
  });

  return [settings, updateSettings];
}

const Control = ({ title, children }) =>
  h("label.bp3-label", [title, h(Switch)]);

interface SettingsPanelProps {
  settings: ColumnSettings;
  updateSettings: (spec: Spec<ColumnSettings>) => void;
}

const SettingsPanel = function (props: SettingsPanelProps) {
  const { settings, updateSettings } = props;

  const toggle = (key: keyof ColumnSettings) => () =>
    updateSettings({ $toggle: [key] });

  return h("div.column-settings", [
    h("h1", "Settings"),
    h("form", [
      h(Switch, {
        label: "Generalized",
        checked: settings.generalized,
        onChange: toggle("generalized"),
      }),
      h(Switch, {
        label: "Clip column image",
        checked: settings.clipImage,
        onChange: toggle("clipImage"),
      }),
    ]),
  ]);
};

export { SettingsPanel, ColumnSettings, useColumnSettings };
