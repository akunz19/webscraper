$(document).ready(function() {
  console.log("I've been clicked!");

  $("#scrapeButton").on("click", event => {
    //loads articles
    event.preventDefault();
    $('#article-container').append(
        `<div class="progress">
            <div class="indeterminate"></div>
        </div>`
    );

    $.ajax({
      url: "/api/load-articles",
      method: "POST"
    }).then(function(res) {
      const divArray = [];
      res.forEach(function(article, i) {
        //loops through response
        let articleID = res[i]._id;
        let title = res[i].title;
        let str = res[i].link;
        let link = str
          ? str.substring(2, str.length - 2)
          : "https://www.theonion.com/"; //porses article link, it scrapes weird
        let summary = res[i].summary || "No summary available...";
        let notes = res[i].notes;
        let noteStr = "";
        //note logic
        for (let i = 0; i < notes.length; i++) {
          //only executes if there are notes for the article
          const noteHTML = `<div class="row" note-id="${notes[i]._id}">
            <div class="col s12" id="notes-cont" note-id="${notes[i]._id}">${notes[i].text}
            <a id="close-bttn" article-id="${articleID}" note-id="${notes[i]._id}">
            <i class="material-icons right">close</i>
        </a></div>
            </div>`;
          noteStr = noteStr + noteHTML;
        }
        //html for each article card
        const html = `<div class="col s3" id="article-col">
          <div class="card">
              <div class="card-image article-img">
                  <img src="https://media.wired.com/photos/5926ec83af95806129f510fe/master/pass/OnionLogoHP-1.jpg">
              </div>
              <div class="card-content">
                  <span class="card-title grey-text text-darken-4" article-id="${articleID}">
                    <a class="activator" id="add-note" article-id="${articleID}">
                        <i class="material-icons right">note_add</i>
                    </a>
                    <div class="article-title" article-id="${articleID}">${title}</div>
                 </span>
              <p class= "summary" article-id="${articleID}">${summary}</p>
              <p><a class="article-link" article-id="${articleID}" href="${link}">Link</a></p>
              </div>
              <div class="card-reveal">
                  <span class="card-title grey-text text-darken-4">${title}<i class="material-icons right">close</i></span>
                  <div class="row">
                      <form class="col s12">
                          <div class="row">
                              <div class="input-field col s12">
                                  <textarea id="textarea1" class="materialize-textarea" data-length="120" article-id="${articleID}"></textarea>
                                  <label for="textarea1">
                                      <h6>Add a note...</h6>
                                  </label>
                                  <button class="btn-small waves-effect waves-light" id="submit-bttn" article-id="${articleID}">Submit
                                  <i class="material-icons right">send</i>
                                </button>
                              </div>
                          </div>
                      </form>
                  </div>
                  <div class="container" id="notes-cont" article-id="${articleID}">
                  ${noteStr}
                  </div>
              </div>
          </div>
      </div>`;
        divArray.push(html);
      });
      const appendLoop = () => {
        let i = 0;
        let counter;
        const articleContainer = $("#article-container");
        while (i < divArray.length) {
            const row = $("<div class='row' id='article-row'>");
            counter = 0;
          articleContainer.append(row);
          while (counter < 4) {
            //only populates four per row
            counter++;
            i++;
            row.append(divArray[i]);
          }
        }
        $(".progress").remove();
      };

      appendLoop();

      $("body").on("click", "#submit-bttn", function(event) {
        event.preventDefault();
        const artID = $(this).attr("article-id");
        const note = $(`textarea[article-id="${artID}"]`);

        const noteData = {
          article: artID,
          text: note.val()
        };
        $.ajax({
          url: "/api/save-notes",
          method: "POST",
          data: noteData
        }).then(function(res) {
          const noteHTML = `<div class="row" note-id="${res._id}">
                <div class="col s12" id="notes-cont" note-id="${
                  res._id
                }">${note.val()}<a id="close-bttn" article-id="${artID}" note-id="${res._id}">
                <i class="material-icons right">close</i>
            </a></div>
                </div>`;
          $(`#notes-cont[article-id="${artID}"]`).append(noteHTML);
          console.log(artID);
          note.val(""); //empty text field
        });
      });
      $("body").on("click", "#close-bttn", function(event) {
        event.preventDefault();
        const noteID = $(this).attr("note-id");
        const artID = $(this).attr("article-id");
        const noteDeleteData = {
          id: noteID
        };
        console.log("art", artID, "note", noteDeleteData.id);
        $.ajax({
          url: "/api/delete-notes",
          method: "POST",
          data: noteDeleteData
        }).then(function(res) {
         $(`.row[note-id="${noteID}"]`).remove();
          console.log(res);
        });
      });

      
    });
  });
});
