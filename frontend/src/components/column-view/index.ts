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

import testImage from "~/example-data/Naukluft-Section-J.png";

function ColumnView({ column_id }) {
  const [state, updateState] = useState({
    columnImage: testImage,
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

  return h("div.column-main", [
    h("div.cs-main", [
      h(StratColumn, {
        column_id,
        height: 60,
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
      }),
    ]),
  ]);
}

export { ColumnView };
