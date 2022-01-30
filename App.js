//global variables
var globalStartCoordArr = [];
var globalEndCoordArr =[];

var map = L.map('map', {
            center: [0, 0],
            zoom: 5
        });
        var nzoom = 12;

        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: 'OSM'
        }).addTo(map);

        //Icons
        var blueIcon = L.icon({
    iconUrl: 'img/blue.png',
    iconSize:     [38, 95], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});
        var redIcon = L.icon({
    iconUrl: 'img/red.png',
    iconSize:     [38, 95], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});
        var myBlueMarker = L.marker([0, 0], {
            icon: blueIcon, 
            title: "Coordinates",
            alt: "Coordinates",
            draggable: true
        }).addTo(map)
        
        var myRedMarker = L.marker([1, 1], {
            icon: redIcon, 
            title: "Coordinates",
            alt: "Coordinates",
            draggable: true
        }).addTo(map)
        
         

        function chooseStartAddr(lat1, lng1) {
            myBlueMarker.closePopup();
            map.setView([lat1, lng1], 15);
            myBlueMarker.setLatLng([lat1, lng1]);
            console.log(typeof lat1)
            latS = parseFloat(lat1);
            lonS = parseFloat(lng1);
            window.globalStartCoordArr = [latS, lonS];
            console.log("globalStartCoordArr: ", globalStartCoordArr);
            document.getElementById('latS').value = lat1;
            document.getElementById('lonS').value = lng1;
            myBlueMarker.bindPopup("Lat " + latS + "<br />Lon " + lonS).openPopup();
            updateBounds();  
             myBlueMarker.bindPopup("Lat " + latS + "<br />Lon " + lonS).openPopup();
            return globalStartCoordArr;
            
        }

        

         function startAddr_search() {
            var inp = document.getElementById("startAddr");
            var xmlhttp = new XMLHttpRequest();
            var url = "https://nominatim.openstreetmap.org/search?format=json&limit=3&q=" + inp.value;
            xmlhttp.onreadystatechange = async function() {
                if (this.readyState === 4 && this.status == 200) {
                    var myArr = await JSON.parse(this.responseText);
                    console.log("myArr: ", myArr[0].lat)
                    var latitude = myArr[0].lat;
                    var longitude = myArr[0].lon;
                    chooseStartAddr(latitude, longitude)
                }
            };
            xmlhttp.open("GET", url, true);
            xmlhttp.send();
        }
        
        
        //============================================================================
//This puts the coordinates from endAddr_search() onto the map
        function chooseEndAddr(lat1, lng1) {
            //myRedMarker.closePopup();
            //map.setView([lat1, lng1], 14);
            myRedMarker.setLatLng([lat1, lng1]);
            console.log(typeof lat1)
            latE = parseFloat(lat1);
            lonE = parseFloat(lng1);
            window.globalEndCoordArr = [latE, lonE];
            console.log("globalEndCoordArr: ", globalEndCoordArr);
            document.getElementById('DestLat').value = lat1;
            document.getElementById('DestLon').value = lng1;
            myRedMarker.bindPopup(" DestLat " + latE + "<br />DestLon " + lonE).openPopup();
            updateBounds(); 
             myRedMarker.bindPopup(" DestLat " + latE + "<br />DestLon " + lonE).openPopup();
           
        }

//this gets the 1ST (only!!!) address back from OSM database & gets lat/long coordinates
        function endAddr_search() {
            var inp = document.getElementById("endAddr");
            var xmlhttp = new XMLHttpRequest();
            var url = "https://nominatim.openstreetmap.org/search?format=json&limit=3&q=" + inp.value;
            xmlhttp.onreadystatechange = function() {
                if (this.readyState === 4 && this.status == 200) {
                    var myArr = JSON.parse(this.responseText);
                    console.log("myArr: ", myArr[0].lat)
                    var latitude = myArr[0].lat;
                    var longitude = myArr[0].lon;
                    //myFunction(myArr);
                    chooseEndAddr(latitude, longitude)
                }
            };
            xmlhttp.open("GET", url, true);
            xmlhttp.send();
        };
//===============================================
//this is to make both markers fit on the page
function updateBounds(){
            var group = new L.featureGroup([myBlueMarker, myRedMarker]);
            map.fitBounds(group.getBounds().pad(0.5));
             measureBetweenPoints()
        };

//this function searches both addresses at once
function searchAddresses() {
    startAddr_search();
    endAddr_search();
   ;
};

//this measures the distance between the two points
function measureBetweenPoints() {
    var globalStartCoordLat = globalStartCoordArr[0];
    var globalStartCoordLon = globalStartCoordArr[1];
    var globalEndCoordLat = globalEndCoordArr[0];
    var globalEndCoordLon = globalEndCoordArr[1];
    console.log("s", globalEndCoordArr[0]);

    //get the distance between 2 points
    var from = turf.point([globalStartCoordLat, globalStartCoordLon]);
    var to = turf.point([globalEndCoordLat, globalEndCoordLon]);
    var options = {units: 'miles'};
    var distance = turf.distance(from, to, options);
    console.log("distance: ", distance)
    
    //draw a line between 2 points
    var latlngs = [ [globalStartCoordLat, globalStartCoordLon], [globalEndCoordLat, globalEndCoordLon] ];
        var polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);

    // zoom the map to the polyline
    map.fitBounds(polyline.getBounds().pad(0.5));
    
};