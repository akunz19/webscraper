const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    title:  String, // String is shorthand for {type: String}
    summary: String,
    link:   String,
    id: mongoose.Types.ObjectId,
    notes:[{type: Schema.Types.ObjectId, ref: 'Note'}]
    });

// This creates our model from the above schema, using mongoose's model method
const Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;
