steal( 'can/util/mvc.js', 'can/view/ejs' ).then(function() {


  can.Control("SearchController", {},
  {
    init : function() {

      
      can.view( "memecanvas/controllers/search/views/search.ejs", MemeModel.findAll({}), $.proxy( function( tmpl ) {
        this.element.html( tmpl );
      }, this ));

    },

    "li click" : function( el, ev ) {

      console.log( this, "hi");

    }
  });



});
