import h from "./main.module.styl";
import { useState } from "react";

import { StratColumn } from "./column";
import { useAPIQuery } from "~/system";
import { Spinner } from "@blueprintjs/core";
import { useStorageManager } from "~/system";
import {
  GrainsizeLayoutProps,
  LithologyProvider,
} from "@macrostrat/column-components";

function useColumnImage(column_id) {
  // For now, we only work with a single image
  const bucket = `column-${column_id}-images`;
  const { files } = useStorageManager(bucket);
  return files?.[0]?.publicURL;
}

function ColumnView({ column_id, project_id, clipImage, generalized }) {
  const [state, updateState] = useState({
    inEditMode: true,
    showFacies: true,
    editingInterval: null,
    clickedHeight: null,
  });

  const { data: surfaces, refresh } = useAPIQuery("column_surface", (q) => {
    return q.select("*").filter("column_id", "eq", column_id);
  });

  const columnImage = useColumnImage(column_id);

  if (surfaces == null) return h(Spinner);

  let { editingInterval, clickedHeight } = state;

  // Temporary store of view params
  const colData = columnViewIx[column_id];

  // orphaned state
  const showFacies = true;

  console.log(surfaces);

  return h(
    LithologyManager,
    { project_id },
    h("div.column-main", [
      h("div.cs-main", [
        h(StratColumn, {
          column_id,
          generalized,
          surfaces,
          inEditMode: true,
          editInterval: (obj) => {
            if (obj == null) {
              return updateState({ ...state, editingInterval: null });
            }
            let { height, division } = obj;
            if (division == editingInterval) division = null;
            console.log(division);
            updateState({
              ...state,
              editingInterval: division,
              clickedHeight: height,
            });
          },
          addInterval: () => {},
          removeInterval: () => {},
          onUpdate: () => {},
          editingInterval,
          clickedHeight,
          hideDetailColumn: false,
          columnImage,
          clipImage,
          ...colData,
        }),
      ]),
    ])
  );
}

interface ColumnViewData {
  height: number;
  startHeight?: number;
  margin: { [key: string]: number };
  pixelsPerMeter?: number;
  imageInsets?: { [key: string]: number };
  grainsizeScaleOptions?: GrainsizeLayoutProps;
}

const columnViewIx: { [key: number]: ColumnViewData } = {
  2: {
    height: 60,
    margin: { left: 30, top: 30, right: 10, bottom: 30 },
  },
  70: {
    height: 341.3,
    margin: { left: 30, top: 100, right: 10, bottom: 100 },
    pixelsPerMeter: 4,
    imageInsets: {
      left: 67,
      top: 85,
      right: 280,
      bottom: 135,
    },
    grainsizeScaleOptions: {
      grainSizes: [
        "cover",
        "shale/siltstone",
        "sandstone",
        "conglomerate",
        "micrite/calcisiltite",
        "grainstone",
        "rudstone/debrite",
        "dolomicrite/siltite",
      ],
      tickPositions: [58, 73, 86, 103, 130, 146, 162, 182],
    },
  },
};

function LithologyManager({ project_id, children }) {
  let { data: lithologies, refresh } = useAPIQuery("lithology", (q) => {
    return q.select("*").filter("project_id", "eq", project_id);
  });

  lithologies ??= [];

  return h(LithologyProvider, { lithologies }, children);
}

export { ColumnView };
