import { NoteModel } from "../../DB/models/note.model.js";


export const createNote = async (req, res) => {
    try {

        const { userId } = req.query;

        const { title, content } = req.body;

        const note = await NoteModel.create({
            title,
            content,
            userId
        });

        res.status(201).json({
            message: "Note created successfully",
            note
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


export const updateNote = async (req, res) => {
    try {

        const { noteId } = req.params;
        const { userId } = req.query;

        const { title, content } = req.body;

        const note = await NoteModel.findOne({
            _id: noteId,
            userId: userId
        });

        if (!note) {
            return res.status(404).json({
                message: "Note not found or you are not the owner"
            });
        }

        const updatedNote = await NoteModel.findByIdAndUpdate(
            noteId,
            {
                title,
                content
            },
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            message: "Note updated successfully",
            note: updatedNote
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


export const replaceNote = async (req, res) => {
    try {

        const { noteId } = req.params;
        const { userId } = req.query;

        const { title, content } = req.body;

        const note = await NoteModel.findOne({
            _id: noteId,
            userId: userId
        });

        if (!note) {
            return res.status(404).json({
                message: "Note not found or you are not the owner"
            });
        }

        const updatedNote = await NoteModel.findOneAndReplace(
            {
                _id: noteId,
                userId: userId
            },
            {
                title,
                content,
                userId
            },
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            message: "Note replaced successfully",
            note: updatedNote
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


export const updateAllNotes = async (req, res) => {
    try {

        const { userId } = req.query;

        const { title } = req.body;

        const result = await NoteModel.updateMany(
            {
                userId: userId
            },
            {
                $set: {
                    title: title
                }
            },
            {
                runValidators: true
            }
        );

        res.status(200).json({
            message: "All notes titles updated successfully",
            result
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


export const deleteNote = async (req, res) => {
    try {

        const { noteId } = req.params;
        const { userId } = req.query;

        const deletedNote = await NoteModel.findOneAndDelete({
            _id: noteId,
            userId: userId
        });

        if (!deletedNote) {
            return res.status(404).json({
                message: "Note not found or you are not the owner"
            });
        }

        res.status(200).json({
            message: "Note deleted successfully",
            note: deletedNote
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


export const getNotesPaginated = async (req, res) => {
    try {

        const { userId } = req.query;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 3;

        const skip = (page - 1) * limit;

        const notes = await NoteModel.find({
            userId: userId
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            page,
            limit,
            notes
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


export const getNoteById = async (req, res) => {
    try {

        const { id } = req.params;
        const { userId } = req.query;

        const note = await NoteModel.findOne({
            _id: id,
            userId: userId
        });

        if (!note) {
            return res.status(404).json({
                message: "Note not found or you are not the owner"
            });
        }

        res.status(200).json({
            note
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


export const getNoteByContent = async (req, res) => {
    try {

        const { userId, content } = req.query;

        const note = await NoteModel.findOne({
            userId: userId,
            content: content
        });

        if (!note) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        res.status(200).json({
            note
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


export const getNotesWithUser = async (req, res) => {
    try {

        const { userId } = req.query;

        const notes = await NoteModel.find({
            userId: userId
        })
            .select("title userId createdAt")
            .populate("userId", "email");

        res.status(200).json({
            notes
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


export const aggregateNotes = async (req, res) => {
    try {

        const { userId, title } = req.query;

        const matchStage = {
            userId: userId
        };

        if (title) {
            matchStage.title = title;
        }

        const notes = await NoteModel.aggregate([
            {
                $match: matchStage
            },

            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },

            {
                $unwind: "$user"
            },

            {
                $project: {
                    _id: 1,
                    title: 1,
                    content: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    user: {
                        name: "$user.name",
                        email: "$user.email"
                    }
                }
            }
        ]);

        res.status(200).json({
            notes
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


export const deleteAllNotes = async (req, res) => {
    try {

        const { userId } = req.query;

        const result = await NoteModel.deleteMany({
            userId: userId
        });

        res.status(200).json({
            message: "All notes deleted successfully",
            result
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};