import { createPortal } from "react-dom";
import { NotesModal } from "./NotesModal";
import { useState } from "react";

export function Notes({ entries }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && createPortal(<NotesModal entries={entries} setOpen={setOpen}/>, document.body)}
      <div className="relative my-3 flex justify-center">
        <button
          className="w-fit bg-red-400 hover:bg-red-500 text-sm md:text-base text-white font-medium px-2 md:px-4 py-1 md:py-3 rounded-md transition"
          onClick={() => setOpen(true)}
        >
          See all notes
        </button>
      </div>
    </>
  );
}
