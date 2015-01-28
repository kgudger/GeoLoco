
var currentLatitude = 0;
var currentLongitude = 0;
var datetime = new Date();

var options = {			// Intel GPS options
    timeout: 10000,
    maximumAge: 11000,
    enableHighAccuracy: true
};

function enterformFn () {
	var category = document.getElementById('catselect').value;
//	alert("Category is " + category);
	sendGeoFunc();
};
	/**
	 *	Fires when DOM page loaded
	 */
    function ready() {
	    if (navigator.geolocation) {
   	      	navigator.geolocation.getCurrentPosition(showPosition);
		}
		console.log("In ready");
	};

	/** 
	 *	sets current latitude and longitude from ready() function
	 */
	function showPosition(position) {
	    currentLatitude = position.coords.latitude;
	    currentLongitude = position.coords.longitude;
		showLatLon(currentLatitude,currentLongitude);
	};

	if(typeof intel === 'undefined') {
	    document.addEventListener( "DOMContentLoaded", ready, false );
	} else {
		document.addEventListener("intel.xdk.device.ready",onDeviceReady,false);
	}
    //Success callback
	/**
	 *	function to set current latitude and longitude from GPS
	 *	@param p is passed from intel library function
	 */
	var suc = function(p) {
//	    console.log("geolocation success", 4);
    	currentLatitude = p.coords.latitude;
    	currentLongitude = p.coords.longitude;
		showLatLon(currentLatitude,currentLongitude);
	};
	/**
	 *	fail function for intel gps routine - does nothing 
	 */			    
	var fail = function() {
	    console.log("Geolocation failed. \nPlease enable GPS in Settings.", 1);
	};

    function onDeviceReady() {
        if( navigator.splashscreen && navigator.splashscreen.hide ) 		{   // Cordova API detected
            navigator.splashscreen.hide() ;
        }
        if( window.intel && intel.xdk && intel.xdk.device )
		{           // Intel XDK device API detected, but...
            if( intel.xdk.device.hideSplashScreen) {
			//...hideSplashScreen() is inside the base plugin
                intel.xdk.device.hideSplashScreen() ;
            }
			try {
		        if (intel.xdk.geolocation !== null) {
	     	      intel.xdk.geolocation.watchPosition(suc, fail, options);
//				  console.log("geolocation !== null", 4);
				}
			} catch(e) { 
//				alert(e.message);
//				console.log("geo watch failed",1);
			}
        }
	};

	function showLatLon(lat,lon) {
//		alert("In LatLon lat = " + lat + " lon = " + lon);
		document.getElementById('lat').value = lat;
		document.getElementById('lon').value = lon;
		document.getElementById("datetime").innerHTML = datetime;
	};

/* INSERT INTO Locations 
(user, lat, lon, pname, category,detail, dtime)
VALUES
('1', '37.0181085', '-121.96088139999999', 'home', 'Home', 'development', now()) */

	function sendGeoFunc() {
		var lat = document.getElementById('lat').value;
		var lon = document.getElementById('lon').value;
		var pname = document.getElementById('pname').value;
		var cat = document.getElementById('catselect').value;
		var len = document.getElementById('hlength').value;
		var det = document.getElementById('fname').value;
		document.getElementById('rstatus').innerHTML = "sending";

	    var xmlhttp;
		try {
		    xmlhttp=new XMLHttpRequest();
		} catch(e) {
			xmlhttp = false;
			console.log(e);
		}
		if (xmlhttp) {
		    xmlhttp.onreadystatechange=function()
		    {
		      if (xmlhttp.readyState==4 && xmlhttp.status==200)
			  {
//				alert(xmlhttp.responseText);
				var returned = (xmlhttp.responseText);
				document.getElementById('rstatus').innerHTML = returned;
			  }
			}
			var params = "lat=" + lat;
			params += "&lon=" + lon;
			params += "&pname=" + pname;
			params += "&cat=" + cat;
			params += "&len=" + len;
			params += "&det=" + det;
			xmlhttp.open("GET","http://home.loosescre.ws/~keith/GeoLoco/server.php" + '?' + params, true);
			xmlhttp.send(null);
		}
	}; // sendGeoFunc


