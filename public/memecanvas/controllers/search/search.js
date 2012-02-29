steal( 'can/util/mvc.js', 'can/view/ejs' ).then(function() {


  can.Control("SearchController", {},
  {
    init : function() {
      console.log("init args", arguments );
      
      can.view( "memecanvas/controllers/search/views/search.ejs", MemeModel.findAll({}).done($.proxy( function( memeList ) {
        this.memeList = memeList;
      }, this )), $.proxy( function( tmpl ) {
        this.element.html( tmpl );
      }, this ));

    },

    "li mousedown" : function( el, ev ) {
      this.element.trigger("updateMeme", this.memeList.getById( el.data("id") ));
    }
  });



});