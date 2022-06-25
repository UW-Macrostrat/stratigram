/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import h from "./main.module.styl";
import { useState } from "react";

import { StratColumn } from "./column";
import { useAPIQuery } from "~/system";
import { Spinner } from "@blueprintjs/core";
import { useStorageManager } from "~/system";

function useColumnImage(column_id) {
  // For now, we only work with a single image
  const bucket = `column-${column_id}-images`;
  const { files } = useStorageManager(bucket);
  return files?.[0]?.publicURL;
}

function ColumnView({ column_id }) {
  const [state, updateState] = useState({
    inEditMode: true,
    showFacies: true,
    generalized: false,
    editingInterval: null,
    clickedHeight: null,
  });

  const { data: surfaces, refresh } = useAPIQuery("column_surface", (q) => {
    return q.select("*").filter("column_id", "eq", column_id);
  });

  const columnImage = useColumnImage(column_id);

  if (surfaces == null) return h(Spinner);

  let { generalized, inEditMode, editingInterval, clickedHeight } = state;

  if (!inEditMode) {
    editingInterval = null;
  }

  // Temporary store of view params
  const colData = columnViewIx[column_id];

  return h("div.column-main", [
    h("div.cs-main", [
      h(StratColumn, {
        column_id,
        generalized,
        inEditMode,
        editInterval: () => {},
        addInterval: () => {},
        removeInterval: () => {},
        onUpdate: () => {},
        editingInterval,
        clickedHeight,
        hideDetailColumn: false,
        columnImage,
        ...colData,
      }),
    ]),
  ]);
}

interface ColumnViewData {
  height: number;
  startHeight?: number;
  margin: { [key: string]: number };
  pixelsPerMeter?: number;
  imageInsets?: { [key: string]: number };
}

const columnViewIx: { [key: number]: ColumnViewData } = {
  2: {
    height: 60,
    margin: { left: 30, top: 30, right: 10, bottom: 30 },
  },
  70: {
    height: 341.3,
    margin: { left: 30, top: 30, right: 10, bottom: 30 },
    pixelsPerMeter: 4,
    imageInsets: {
      left: 67,
      top: 85,
      right: 280,
      bottom: 135,
    },
  },
};

export { ColumnView };
