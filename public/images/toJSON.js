var fs = require("fs");


fs.readdir("./memes", function( err, files ) {
  var o = [];

  files.forEach( function( file, i ) {
    o.push({
      id : i,
      name : file.split(".").shift().replace(/-/g, " ").replace(/^([a-z])|[\s_]+([a-z])/g, function ($1) {
        return $1.toUpperCase();
      }),
      src : file
    });
  });

  fs.writeFile("../memecanvas/memes.json", JSON.stringify( o ));

});
