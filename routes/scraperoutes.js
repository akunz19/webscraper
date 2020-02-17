const axios = require('axios');
const cheerio = require('cheerio');
const CircularJSON = require('circular-json');
const fs = require('fs');
let db = require("../models");

module.exports = function(app){
    app.post("/api/load-articles", function(req, res){
        axios.get('https://www.theonion.com/')
        .then((response) => {
            if(response.status === 200) {
            const html = response.data;
            const $ = cheerio.load(JSON.stringify(html)); 
            $('article').each(function(i, elem) { //gets each article class
                const resultObj = {}; //creates an object for each article
                resultObj.title = $('h4', elem).text();
                resultObj.summary = $('p', elem).text(); 
                resultObj.link = $('a', elem).attr('href');
                db.Article.create(resultObj);
              });
              db.Article.find({}).populate("notes").then(function(articlesPopulated){
                res.json(articlesPopulated)
                console.log(articlesPopulated);
              });
        }
        
        })
    });

    app.post("/api/save-notes", function(req, res){
        const noteObj = {
            text: req.body.text
        };
        const article = req.body.article;
            db.Note.create(noteObj).then(function(dbNote){
                console.log("\n" + dbNote + "\n");
                res.json(dbNote);
                return db.Article.findOneAndUpdate({ _id: article}, {$push: { notes: dbNote._id } }, { new: true });
            })
              .catch(function(err) {
                console.log(err);
              });

    });
    
    app.post("/api/delete-notes", function(req, res){
        const noteObj = {
            id: req.body.id
        };
        console.log(noteObj.id);
        db.Note.findOneAndDelete(noteObj.id).then(function(noteDeleted){
         res.json("note successfully removed");
        })
              .catch(function(err) {
                console.log(err);
              });

    });
};
