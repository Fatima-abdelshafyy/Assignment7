import { Router } from "express";
import * as NS from "./note.service.js";

const noteRouter = Router();

noteRouter.post("/", NS.createNote);
noteRouter.patch("/:noteId", NS.updateNote);
noteRouter.put("/replace/:noteId", NS.replaceNote);
noteRouter.patch("/all", NS.updateAllNotes);
noteRouter.delete("/:noteId", NS.deleteNote);
noteRouter.get("/paginate-sort", NS.getNotesPaginated);
noteRouter.get("/note-by-content", NS.getNoteByContent);
noteRouter.get("/note-with-user", NS.getNotesWithUser);
noteRouter.get("/aggregate", NS.aggregateNotes);
noteRouter.delete("/", NS.deleteAllNotes);
noteRouter.get("/:id", NS.getNoteById);

export default noteRouter;