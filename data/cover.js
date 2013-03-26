self.port.on( "show", function( data ) {

   var MAX_TIMEOUT_VAL = 2147483647;

   while( document.body.firstChild ) {
      document.body.removeChild(document.body.firstChild);
   }

    // create cover
    var checkyourselfCover = document.createElement( "div" );
    
    // get page dimensions
    var htmlheight = document.body.parentNode.scrollHeight;  
    var windowheight = window.innerHeight;  
    if ( htmlheight < windowheight ) { 
        checkyourselfCover.style.height = windowheight + "px"; 
    } else { 
        checkyourselfCover.style.height = htmlheight + "px"; 
    } 
    
    checkyourselfCover.style.backgroundColor = "white";
    checkyourselfCover.style.top = 0;
    checkyourselfCover.style.bottom = 0;
    checkyourselfCover.style.left = 0;
    checkyourselfCover.style.right = 0;
    checkyourselfCover.style.position = "fixed";
    checkyourselfCover.style.zindex = 2147483600;

    // create textdiv
    var textdiv = document.createElement("div");
    
    // style textdiv
    textdiv.style.position = "fixed"; 
    textdiv.style.top = Math.floor(windowheight*0.5 - 120) + "px"; 
    textdiv.style.left = "50%";
    textdiv.style.width = "600px";
    textdiv.style.marginLeft = "-300px";
    textdiv.style.height = "240px";
    textdiv.style.textAlign = "center";
    textdiv.style.fontSize = "large";
    textdiv.style.fontFamily = "Tahoma,Geneva,sans-serif"
    textdiv.style.fontWeight = 300;
    textdiv.style.lineHeight = 1.5;
    
    // create textnodes
    var url = data.url;
    var interval = data.interval;
    
    var intervalText = interval/60 > 2 ? (Math.floor(interval/60) + " minutes ago.")
        : (interval + " seconds ago.");
    var youlastNode = document.createTextNode("You last visited");
    var urlNode = document.createTextNode(url); 
    var intervalNode = document.createTextNode(intervalText); 

    var doyouNode = document.createTextNode("Do you really have to already?");

    document.body.appendChild( checkyourselfCover );
    checkyourselfCover.appendChild( textdiv );
    textdiv.appendChild( youlastNode );
    textdiv.appendChild( document.createElement("br") );
    textdiv.appendChild( urlNode );
    textdiv.appendChild( document.createElement("br") );
    textdiv.appendChild( intervalNode );
    textdiv.appendChild( document.createElement("br") );
    textdiv.appendChild( document.createElement("br") );
    textdiv.appendChild( doyouNode );

    var timeout;
    if( data.allowPass === "yes" ) {
       timeout = 0;
    } else if( data.allowPass === "wait" ) {
       timeout = 10000;
    } else { // data.allowPass === "no"
       timeout = MAX_TIMEOUT_VAL;
    }
    setTimeout( function() {
       
       // create button
       var yesButton = document.createElement("button");
       yesButton.onclick = function () {
           self.port.emit("held");
           document.location.reload();
       }
       yesButton.appendChild( document.createTextNode( "Yeah" ));

       textdiv.appendChild( document.createElement("br") );
       textdiv.appendChild( document.createElement("br") );
       textdiv.appendChild( yesButton );
    }, timeout );
});
