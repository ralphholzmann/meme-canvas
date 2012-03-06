steal( 'can/util/mvc.js', 'can/view/ejs' ).then(function() {

  var debounce = function( fn, ms, context ) {
    var timeout;
    return function() {
      var self = this,
          args = arguments;
      clearTimeout( timeout );
      timeout = setTimeout(function() {
        fn.apply( context || self, args );
      }, ms )
    }
  };

  can.Control("SearchController", {},
  {
    init : function() {
      
      can.view( "memecanvas/controllers/search/views/search.ejs", MemeModel.findAll({}).done($.proxy( function( memeList ) {
        this.memeList = memeList;
      }, this )), $.proxy( function( tmpl ) {
        this.element.html( tmpl );
      }, this ));

    },

    "li click" : function( el, ev ) {
      this.element.trigger("updateMeme", this.memeList.getById( el.data("id") ));
      setTimeout($.proxy(function() {
        this.element.siblings().find("header button:visible").trigger("mousedown");
      }, this), 0);
    },

    "input keyup" : debounce( function( el, ev ) {
      var term = el.val(),
          memes = this.memeList.searchByName( term );
      
      can.view( "memecanvas/controllers/search/views/results.ejs", {
        memes : memes,
        term : term
      }, $.proxy(function( tmpl ) {
        this.element.find("ul").html( tmpl );
      }, this ));
    }, 16)
  });



});
