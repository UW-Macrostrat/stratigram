import { NotesColumn } from "@macrostrat/column-components";
import h from "~/hyper";
import { useAPIQuery, APISchema, apiClient } from "~/system";
import { NoteEditor } from "../note-editor";
import { useState, useEffect } from "react";

type Note = APISchema["column_obs"];

const client = apiClient.from<Note>("column_obs");

export function ColumnNotesManager({ column_id, offset, width }) {
  const [notes, setNotes] = useState<Note[]>([]);

  const { data, loading } = useAPIQuery(
    "column_obs",
    (q) => {
      return q
        .select("*")
        .filter("column_id", "eq", column_id)
        .filter("note", "neq", null);
    },
    []
  );

  async function onUpdateNote(newNote: Note) {
    try {
      let res = await client.update(newNote).match({ id: newNote.id });
      let inserted = res.body[0];
      setNotes((notes) =>
        notes.map((n) => (n.id === inserted.id ? inserted : n))
      );
    } catch (error) {
      console.error(error);
    }
  }

  async function onDeleteNote(note: Note) {
    try {
      await client.delete().match({ id: note.id });
      setNotes((notes) => notes.filter((n) => n.id !== note.id));
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (data) {
      setNotes(data);
    }
  }, [data]);

  return h(NotesColumn, {
    notes,
    transform: `translate(${offset})`,
    width,
    onUpdateNote,
    onDeleteNote,
    noteEditor: NoteEditor,
    allowPositionEditing: true,
  });
}
