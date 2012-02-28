steal('can/util/mvc.js', 'can/view/ejs' ).then(function() {

  var calcTimeout;

  can.Control("MemeController", {

    getJpeg : (function() {
      var c = document.createElement("canvas"),
          data,
          enc;
      c.width = 1;
      c.height = 1;
      try {
        data = c.getContext("2d").toDataURL("image/jpeg");
      } catch ( e ) {} finally {
        // Supports jpeg natively
        if ( data && data.indexOf("image/jpeg") > -1 ) {
          return function( cavnas ) {
            return canvas.getContext("2d").toDataURL("image/jpeg", 0.9).split(",").pop();
          }
        // else fallback to encoder class
        } else {
          steal('/javascripts/jpeg_encoder_basic.js', function() {
            enc = new JPEGEncoder( 90 );
          });
          return function( canvas ) {
            return enc.encode( canvas.getContext("2d").getImageData( 0, 0, canvas.width, canvas.height )).split(",").pop();
          }
        }
      }
    }()),

    getPng : function( canvas ) {
      return canvas.toDataURL("image/png").split(",").pop();
    },

    imgurApiKey : "5bd69574be5c39339e97145062b40896",

    defaults : {
      strokeWeight : 10,
      xPadding : 10,
      yPadding : 2,
      textTransform : "uppercase",
      textAlign : "center",
      filetype : "jpeg"
    }

  },
  {
    init : function() {
      
      can.view( "memecanvas/controllers/meme/views/meme.ejs", {}, {}, $.proxy( function( tmpl ) {
       this.element.html( tmpl );
        this.canvas = this.element.find("canvas");
        this.cvsWidth  = this.canvas.width();
        this.cvsHeight = this.canvas.width();
        this.ctx    = this.canvas[0].getContext("2d");
        this.top    = this.element.find("#top");
        this.bottom = this.element.find("#bottom");
        this.imgurLink = this.element.find("#imgurLink");
        this.pngSize = this.element.find("#png-size");
        this.jpegSize = this.element.find("#jpeg-size");
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
        textAlign : this.options.textAlign,
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

      var lines = [],
          sizes = [],
          lineXPos,
          finalSize;

      // Determine text transform
      if ( this.options.textTransform == "uppercase" ) {
        text = text.toUpperCase();
      } else if ( this.options.textTransform == "uppercase" ) {
        text = text.toLowerCase();
      }

      // Figure out ideal size for each line
      lines = text.split("\n"),
      $.each( lines, $.proxy( function( index, line ) {
        var size = 75;
        do {
          size--;
          this.ctx.font = 'normal ' + size + 'px Impact, "ImpactBackup"';
          this.ctx.lineWidth = size / this.options.strokeWeight;
        } while ( this.ctx.measureText( line ).width > this.cvsWidth - ( 2 * this.options.xPadding ))
        sizes[ index ] = size;
      }, this ));

      // Set the final size
      finalSize = Math.min.apply( Math, sizes );
      this.ctx.font = 'normal ' + finalSize + 'px Impact, "ImpactBackup"';

      // Determine horizontal alignment
      if ( this.options.textAlign == "center" ) {
        lineXPos = this.cvsWidth / 2;
      } else if ( this.options.textAlign == "right" ) {
        lineXPos = this.cvsWidth - this.options.xPadding;
      } else {
        lineXPos = this.options.xPadding;
      }

      // Write the lines
      $.each( lines, $.proxy( function( index, line ) {
        var lineYPos = this.ctx.textBaseline == "top" ?
          yPos + (( index ) * finalSize ) :
          yPos - (( lines.length - index - 1 ) * finalSize );
        this.ctx.strokeText( line, lineXPos, lineYPos );
        this.ctx.fillText( line, lineXPos, lineYPos );
      }, this ));
    },

    "keyup" : function() {
      var topText     = this.top.val(),
          bottomText  = this.bottom.val(); 

      this.ctx.textAlign = this.options.textAlign;

      this.ctx.clearRect( 0, 0, this.cvsWidth, this.cvsHeight );
      this.ctx.drawImage( this.image[0], 0, 0 );
      this.ctx.textBaseline = 'top';
      this.writeCaption( topText, this.options.yPadding )
      this.ctx.textBaseline = 'bottom';
      this.writeCaption( bottomText, this.cvsHeight - this.options.yPadding )
      clearTimeout( calcTimeout );
      calcTimeout = setTimeout( $.proxy( this.calculateSize, this ), 100 );
    },
    "{window} dragover" : function( el, ev ) {
        ev.stopPropagation();
        ev.preventDefault();
    },

    "{window} drop" : function( el, ev ) {
      ev.preventDefault();
      ev.stopPropagation();

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

    "[name=text-transform] change" : function( el, ev ) {
      this.options.textTransform = el.val();
      this.keyup();
    },

    "[name=text-align] change" : function( el, ev ) {
      this.options.textAlign = el.val();
      this.keyup();
    },

    "[name=filetype] change" : function( el, ev ) {
      this.options.filetype = el.val();
      this.keyup();
    },

    calculateSize : function() {
      var sizes = {
        jpeg : this.constructor.getJpeg( this.canvas[0] ),
        png : this.constructor.getPng( this.canvas[0] )
      };

      $.each( sizes, $.proxy( function( type, data ) {
        var kb = ( data.length / 1024 );
        this[ type + "Size" ].text( kb.toFixed(1) + "kb" );
      }, this ));
      
    },
    
    "button click": function( el, ev ) {
      var data;

      if ( this.options.filetype == "jpeg" ) {
        data = this.constructor.getJpeg( this.canvas[0] );
      } else if ( this.options.filetype == "png" ) {
        data = this.constructor.getPng( this.canvas[0] );
      }
      
      $.ajax({
        url : "http://api.imgur.com/2/upload.json",
        type : "post",
        dataType : "json",
        data: {
          "image" : data,
          "key" : this.constructor.imgurApiKey,
          "type": "base64",
          "title" : "One does not simply",
          "caption" : [ this.top.val(), this.bottom.val() ].join(" ")
        },
        success: $.proxy( function( response ) {

          this.imgurLink.val( response.upload.links.original )

        }, this)
      });

      ev.preventDefault();
    }
  });



});
