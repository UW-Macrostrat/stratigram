/**
 * Correlation controls: these controls are orphaned until we build a correlation chart.
 */
import { useContext } from "react";
import { RaisedSelect } from "@macrostrat/column-components";

const CorrelatedSurfaceControl = (props) => {
  /** Control for correlated surfaces */
  //const { surfaces, updateSurfaces } = useContext(SectionSurfacesContext);
  const { onChange, interval } = props;

  const seqSurfaces = surfaces.filter((d) => d.type == "sequence-strat");

  const options = seqSurfaces.map((d) => ({
    value: d.surface_id,
    label: h(SurfaceLabel, { surface: d }),
  }));

  const value = options.find((d) => d.value === interval.surface);

  return h(RaisedSelect, {
    options,
    isClearable: true,
    isSearchable: true,
    name: "selected-state",
    value,
    placeholder: "Choose a surface...",
    onChange: (surface) => {
      if (surface != null) {
        surface = surface.value;
      }
      onChange({ surface });
      //updateSurfaces();
    },
  });
};

const SurfaceLabel = (props) => {
  const d = props.surface;
  if (d == null) return null;
  return h("div.correlated-surface-row", [
    h("span.bp3-code", d.surface_id),
    " ",
    h("span", d.note),
  ]);
};

const CorrelationControls = () => {
  const { interval, updateInterval } = useIntervalEditor();
  return h([
    h(LabeledControl, {
      title: "Correlated surface",
      is: CorrelatedSurfaceControl,
      interval,
      onChange: updateInterval,
    }),
    h(LabeledControl, {
      is: ClearableSlider,
      title: "Surface certainty",
      value: interval.surface_certainty,
      onChange(c) {
        updateInterval({ surface_certainty: c });
      },
    }),
  ]);
};
