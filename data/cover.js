console.log( "cover.js loaded" );

self.port.on( "show", function( data ) {

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
    
    // create button
    var yesButton = document.createElement("button");
    yesButton.onclick = function () {
        self.port.emit("held");
        document.location.reload();
    }
    yesButton.appendChild( document.createTextNode( "Yeah" ));
    

    document.body.appendChild( checkyourselfCover );
    checkyourselfCover.appendChild( textdiv );
    textdiv.appendChild( youlastNode );
    var linebreak = document.createElement("br");
    textdiv.appendChild( linebreak );
    textdiv.appendChild( urlNode );
    var linebreak = document.createElement("br");
    textdiv.appendChild( linebreak );
    textdiv.appendChild( intervalNode );
    var linebreak = document.createElement("br");
    textdiv.appendChild( linebreak );
    var linebreak = document.createElement("br");
    textdiv.appendChild( linebreak );
    textdiv.appendChild( doyouNode );
    var linebreak = document.createElement("br");
    textdiv.appendChild( linebreak );
    var linebreak = document.createElement("br");
    textdiv.appendChild( linebreak );
    textdiv.appendChild( yesButton );
});
