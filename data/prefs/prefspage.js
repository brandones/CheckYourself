"use strict";

// TODO: make page close on save

var pagesNode = document.getElementById( "urls" );

self.port.on( "existingPrefs", function( prefs ) {
   console.log( "received existing: " + JSON.stringify( prefs, undefined, 2 ));

   for( var index = 0; index < prefs.length; index++ ) {
      var url = prefs[index].url;
      var urlBox = document.createElement( "input" );
      urlBox.value = url;
      pagesNode.appendChild( urlBox );

      var timeout = prefs[index].timeout;
      var timeoutBox = document.createElement( "input" );
      timeoutBox.value = timeout/60;
      timeoutBox.size = 5
      pagesNode.appendChild( timeoutBox );

      var remove = document.createElement( "button" );
      remove.id = "remove";
      remove.onclick = function () {
         pagesNode.removeChild( urlBox );
         pagesNode.removeChild( urlBox );
      }
      pagesNode.appendChild( remove );

      pagesNode.appendChild( document.createElement( "br" ) );
   }

   function addLine() {
      pagesNode.appendChild( document.createElement( "input" ) );
      var timeoutBox = document.createElement( "input" );
      timeoutBox.type = "number";
      timeoutBox.size = 5;
      pagesNode.appendChild( timeoutBox );

      var remove = document.createElement( "button" );
      remove.id = "remove";
      remove.onclick = function () {
         pagesNode.removeChild( urlBox );
         pagesNode.removeChild( timeoutBox );
         pagesNode.removeChild( remove );
      }
      pagesNode.appendChild( remove );

      pagesNode.appendChild( document.createElement( "br" ) );
   };

   addLine();

   var moreButton = document.getElementById( "more" );
   moreButton.onclick = addLine;

   var saveButton = document.getElementById( "save" );
   saveButton.onclick = function() {
      var data = [];
      for( var index = 0; index < pagesNode.children.length - 1; index += 2 ) {
         var urlValue = pagesNode.children[index].value;
         var timeoutValue = pagesNode.children[index + 1].value;
         if( (urlValue ? 1 : 0) ^ (timeoutValue ? 1 : 0) ) {
            alert( "Current settings are invalid." );
            return;
         }
         if( urlValue && timeoutValue ) {
            data.push( {
               url: urlValue,
               timeout: timeoutValue * 60
            });
         }
      }
      self.port.emit( "prefsSaved", data )
      close();
   }
});


