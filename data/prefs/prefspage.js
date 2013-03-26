"use strict";

// TODO: make page close on save

var tableNode = document.getElementById( "urltable" );

var rows = [];

self.port.on( "existingPrefs", function( prefs ) {
   var sites = prefs.sites;
   var allowPass = prefs.allowPass;
   console.log( "received existing: " + JSON.stringify( sites, undefined, 2 ));

   // add lines for existing blocked sites
   for( var index = 0; index < sites.length; index++ ) {
      var newRow = addLine();

      var urlBox = newRow.childNodes[0].childNodes[0];
      var url = sites[index].url;
      urlBox.value = url;

      var timeoutBox = newRow.childNodes[1].childNodes[0];
      var timeout = sites[index].timeout;
      timeoutBox.value = timeout/60;
   }

   console.log( "about to set radio values" );

   // set existing allowPass setting, or "yes" default
   setRadioValue( "allowPass", allowPass );
   
   console.log( "done setting radio values" );

   function addLine() {
      console.log( "adding line" );
      var newRow = tableNode.insertRow(-1);
      rows.push( newRow );
      var newCell = newRow.insertCell(0);
      var urlBox = document.createElement( "input" );
      urlBox.id = "url";
      urlBox.setAttribute( "placeholder", "example.com" );
      newCell.appendChild( urlBox );
      var timeoutBox = document.createElement( "input" );
      timeoutBox.id = "timeout";
      timeoutBox.type = "number";
      newCell = newRow.insertCell(1);
      newCell.appendChild( timeoutBox );
      newCell.appendChild( document.createTextNode( " minutes " ) );

      var remove = document.createElement( "a" );
      remove.href = "#";
      remove.id = "remove";
      remove.className = "icon";
      remove.onclick = function () {
         var arrIndex = rows.indexOf( newRow );
         tableNode.deleteRow( arrIndex + 1 );
         rows.splice( arrIndex, 1 );
      }
      var removeicon = document.createElement( "i" );
      removeicon.className = "icon-minus-sign";
      remove.appendChild( removeicon );
      newCell.appendChild( remove );

      return newRow;
   };


   // add an empty line at the end
   addLine();

   var moreButton = document.getElementById( "more" );
   moreButton.onclick = addLine;

   var saveButton = document.getElementById( "save" );
   saveButton.onclick = function() {
      var data = {};
      var sites = [];
      for( var rowdex = 1; rowdex < tableNode.rows.length; rowdex++ ) {
         var row = tableNode.rows[rowdex];
         var urlValue = row.cells[0].childNodes[0].value;
         var timeoutValue = row.cells[1].childNodes[0].value;
         if( (urlValue ? 1 : 0) ^ (timeoutValue ? 1 : 0) ) {
            alert( "Current settings are invalid." );
            return;
         }
         if( urlValue && timeoutValue ) {
            sites.push( {
               url: urlValue,
               timeout: timeoutValue * 60
            });
         }
      }
      var allowPass = getRadioValue( "allowPass" );
      data = {
         sites: sites,
         allowPass: allowPass
      }
      self.port.emit( "prefsSaved", data )
   }

   // from http://stackoverflow.com/questions/604167/how-can-we-access-the-value-of-a-radio-button-using-the-dom
   // user Canuckster
   function getRadioValue (theRadioGroup) {
       for (var i = 0; i < document.getElementsByName(theRadioGroup).length; i++) {
           if (document.getElementsByName(theRadioGroup)[i].checked) {
                   return document.getElementsByName(theRadioGroup)[i].value;
           }
       }
   }
   // and adapted slightly...
   function setRadioValue (theRadioGroup, value) {
       for (var i = 0; i < document.getElementsByName(theRadioGroup).length; i++) {
           if (document.getElementsByName(theRadioGroup)[i].value === value) {
                   return document.getElementsByName(theRadioGroup)[i].checked = true;
           }
       }
   }

});


