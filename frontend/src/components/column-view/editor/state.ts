import update from "immutability-helper";
import { ColumnDivision } from "@macrostrat/column-components";
import { useReducer } from "react";

type UpdateInterval = { type: "update-interval" };
type AddInterval = { type: "add-interval" };
type RemoveInterval = { type: "remove-interval" };
type SetEditingInterval = { type: "edit-interval"; interval: ColumnDivision };

type ColumnEditAction =
  | UpdateInterval
  | AddInterval
  | RemoveInterval
  | SetEditingInterval;

interface ColumnEditorState {
  surfaces: ColumnDivision[];
  editingInterval: ColumnDivision | null;
  clickedPosition: { height: number; grainsize?: string } | null;
}

function columnEditorReducer(
  state: ColumnEditorState,
  action: ColumnEditAction
) {
  switch (action.type) {
    case "update-interval":
      return state;
    case "add-interval":
      return state;
    case "remove-interval":
      return state;
  }
}

function useEditorState(section_id: number) {
  const [state, dispatch] = useReducer(columnEditorReducer, {
    surfaces: [],
    editingInterval: null,
    clickedPosition: null,
  });

  return [state, dispatch];
}
