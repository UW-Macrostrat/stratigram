import { NotesColumn } from "@macrostrat/column-components";
import h from "~/hyper";
import { useAPIQuery } from "~/system";
import { NoteEditor } from "../note-editor";
import { useState, useEffect } from "react";

export function ColumnNotesManager({ column_id, offset, width }) {
  const [notes, setNotes] = useState([]);

  const { data, loading } = useAPIQuery(
    "column_obs",
    (q) => {
      q.select("*")
        .filter("column_id", "eq", column_id)
        .filter("note", "neq", null);
    },
    []
  );

  useEffect(() => {
    if (data) {
      setNotes(data);
    }
  }, [data]);

  return h(NotesColumn, {
    notes,
    transform: `translate(${offset})`,
    width: width,
    onUpdateNote: this.props.onUpdateNote,
    onDeleteNote: this.props.onDeleteNote,
    noteEditor: NoteEditor,
    allowPositionEditing: true,
  });
}
