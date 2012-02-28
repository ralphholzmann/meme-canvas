steal(
  "memecanvas/controllers/meme", 
  "memecanvas/controllers/search", 
  "memecanvas/models/meme.js", 
  function() {

  var fontsReady = (function() {
    var canvas = document.createElement("canvas"),
        context;
    canvas.width  = 1;
    canvas.height = 1;
    context = canvas.getContext("2d");

    $.extend( context, {
      textAlign : 'center',
      textBaseline: 'middle',
      fillStyle : "#000000",
      font : 'normal 1000px Impact, "ImpactBackup"'
    });
    
    return function( callback ) {
      context.fillRect( 0, 0, 1, 1 )
      context.fillStyle = "#ffffff";
      context.fillText( "X", 1, 1 );
      if ( context.getImageData(0, 0, 1, 1).data[0] === 0 ) {
        context.fillStyle = "#000000";
        setTimeout(function() {
          fontsReady( callback );
        }, 0);
      } else {
        callback();
      }
    }
  }());

  fontsReady(function() {
    new MemeController("#container");
    new SearchController("#search");
  });
});
