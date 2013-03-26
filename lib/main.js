"use strict";

exports.main = function() {

var pageMod = require("page-mod");
var tabs = require("tabs");
var self = require("self");
var ss = require("simple-storage");

function doesNotExist( variable ) {
   if( !variable || typeof( variable === 'undefined') ) {
      return true;
   }
   return false;
}
if( doesNotExist( ss.storage.log ) ) {
    ss.storage.log = {};
}
if( doesNotExist( ss.storage.active ) ) {
    ss.storage.active = [];
}
if( doesNotExist( ss.storage.sites) ) {
   ss.storage.sites = [];
} 
if( doesNotExist( ss.storage.allowPass ) ) {
   ss.storage.allowPass = "yes";
}


function openPrefs() {
   console.log( "openPrefs called" );
   tabs.open({
      url: self.data.url("prefs/prefspage.html"),
      onReady: function( tab ) {
         var worker = tab.attach({
            contentScriptFile: self.data.url( "prefs/prefspage.js" )
         });

         var existingPrefs = {
            sites: ss.storage.sites || [],
            allowPass: ss.storage.allowPass
         }
         worker.port.emit( "existingPrefs", existingPrefs );
         worker.port.on( "prefsSaved", function( newPrefs ) {
            ss.storage.sites = newPrefs.sites;
            ss.storage.allowPass = newPrefs.allowPass;
            console.log( "saved " + JSON.stringify( newPrefs, undefined, 2 ) );
            tab.close();
         });
      }
   });
}

require("simple-prefs").on( "openPrefs", openPrefs );


var activeurls = [];

function urlInBlockList( blocklist, url ) {
   for( var index = 0; index < blocklist.length; index++ ) {
      if( url.indexOf(blocklist[index].url) !== -1 ) {
         return blocklist[index];
      }
   }
   return false;
}

function urlInActiveList( activelist, url ) {
   for( var index = 0; index < activelist.length; index++ ) {
      if( url.indexOf(activelist[index]) !== -1 ) {
         return activelist[index];
      }
   }
   return false;
}

// TODO: make this run and work when tabs are closed
function checkStillActive() {
   console.log( "checking still active" );
   var stillactive = [];
   for each( var eachtab in tabs ) {
      var found = urlInActiveList( activeurls, eachtab.url );
      if( found ) {
         stillactive.push( found );
      }
   }
   activeurls = stillactive;
}

tabs.on("ready", function( tab ) {
   checkStillActive();
   
   var blocklist = ss.storage.sites || [];
   var match = urlInBlockList( blocklist, tab.url );
   if( match ) {
      var lastTime = ss.storage.log[match.url] || 0;
      var currentTime = new Date().getTime() / 1000;
      var interval = Math.floor(currentTime - lastTime);
      var active = activeurls.indexOf(match.url) !== -1;
      if( interval < match.timeout && !active ) {
           var worker = tab.attach( {
               contentScriptFile: self.data.url( "cover.js" )
           });
           var coverdata = {
               url: match.url,
               interval: interval,
               allowPass: ss.storage.allowPass
           };
           worker.port.emit( "show", coverdata );
           worker.port.on("held", function( ) {
               activeurls.push(match.url);
               ss.storage.log[match.url] = currentTime;
           });
      } else {
        ss.storage.log[match.url] = currentTime;
        activeurls.push(match.url);
      }
   }
});

tabs.on( "close", checkStillActive );

};
