steal('can/util/mvc.js', 'can/view/ejs').then(function() {



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
      font : 'normal 1000px "ImpactBackup"'
    });
    
    return function( callback ) {
      context.fillRect( 0, 0, 1, 1 )
      context.fillStyle = "#ffffff";
      context.fillText( "X", 1, 1 );
      if ( context.getImageData(0, 0, 1, 1).data[0] === 0 ) {
        context.fillStyle = "#000000";
        setTimeout(function() {
          fire( callback );
        }, 0);
      } else {
        callback();
      }
    }
  }()),
  Meme = Can.Control("Meme", {
    imgurApiKey : "5bd69574be5c39339e97145062b40896",
    defaults : {
      strokeWeight : 10,
      xPadding : 10,
      yPadding : 2
    }
  },
  {
    init : function() {
      
      Can.view( "./meme/meme.ejs", {}, {}, $.proxy( function( tmpl ) {
       this.element.html( tmpl );
        this.canvas = this.element.find("canvas");
        this.cvsWidth  = this.canvas.width();
        this.cvsHeight = this.canvas.width();
        this.ctx    = this.canvas[0].getContext("2d");
        this.top    = this.element.find("#top");
        this.bottom = this.element.find("#bottom");
        this.imgurLink = this.element.find("#imgurLink");
        this.image  = $("<img />").load( $.proxy( function() {
          this.initCanvas( this.image[0].width, this.image[0].height );
          this.keyup();
        }, this )).attr("src", "/images/memes/one-does-not-simply.jpg");
      }, this ));
    },

    initCanvas : function( width, height ) {

      this.canvas[0].width = this.cvsWidth = width;
      this.canvas[0].height = this.cvsHeight = height;

      // Setup basic canvas settings
      $.extend( this.ctx, {
        strokeStyle : "#000000",
        textAlign : 'center',
        fillStyle : "#ffffff",
        lineCap : "round",
        lineJoin : "round",
        shadowColor : "#000000",
        shadowOffsetX : 0,
        shadowOffsetY : 0,
        shadowBlur : 3
      });

    },

    writeCaption : function( text, yPos ) {

      var size = 150;

      text = text.toUpperCase();

      do {
        size--;
        this.ctx.font = 'normal ' + size + 'px Impact, "ImpactBackup"';
        this.ctx.lineWidth = size / this.options.strokeWeight;
      } while ( this.ctx.measureText( text ).width > this.cvsWidth - ( 2 * this.options.xPadding ))

      this.ctx.strokeText( text, this.cvsWidth / 2, yPos );
      this.ctx.fillText( text, this.cvsWidth / 2, yPos );
    },

    "keyup" : function() {
      var topText     = this.top.val(),
          bottomText  = this.bottom.val(); 

      this.ctx.clearRect( 0, 0, this.cvsWidth, this.cvsHeight );
      this.ctx.drawImage( this.image[0], 0, 0 );
      this.ctx.textBaseline = 'top';
      this.writeCaption( topText, this.options.yPadding )
      this.ctx.textBaseline = 'bottom';
      this.writeCaption( bottomText, this.cvsHeight - this.options.yPadding )
    },

    "{window} drop" : function( el, ev ) {
      ev.preventDefault();

      var file = ev.originalEvent.dataTransfer.files[0],
          reader = new FileReader();

      reader.onload = $.proxy( function ( e ) {
        this.image = $("<img />")
          .load($.proxy(function() {
            this.initCanvas( this.image[0].width, this.image[0].height );
            this.keyup();
          }, this))
          .attr('src', event.target.result)
      }, this );
      reader.readAsDataURL(file);
    },
    
    "button click": function( el, ev ) {
      console.log( this );
      console.log("button clicked");
      $.ajax({
        url : "http://api.imgur.com/2/upload.json",
        type : "post",
        dataType : "json",
        data: {
          "image" : this.canvas[0].toDataURL("image/png").split(",").pop(),
          "key" : this.constructor.imgurApiKey,
          "type": "base64",
          "title" : "One does not simply",
          "caption" : [ this.top.val(), this.bottom.val() ].join(" ")
        },
        success: $.proxy( function( response ) {

          this.imgurLink.val( response.upload.links.original )

        }, this)
      });

    }
  });


  fontsReady(function() {
    new Meme("#container");
  });

});
