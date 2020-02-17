const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const NoteSchema = new Schema({
      text: String,
    });

// This creates our model from the above schema, using mongoose's model method
const Note = mongoose.model("Note", NoteSchema);

// Export the Article model
module.exports = Note;
