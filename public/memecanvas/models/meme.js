steal("can/util/mvc.js", function() {


  can.Model("MemeModel", {
    findAll : "GET /memecanvas/memes.json"
  }, {
  });

  can.Model.List("MemeModel.List", {
  }, {
    getById: function( id ) {
      return can.grep( this, function( meme ) {
        return meme.id == id;
      }).pop();
    }
  });

});
