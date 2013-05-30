/*
* Big Apps NYC hackathon - healthy living
* 
* by zeeberry + alonecuzzo 
*
* Many thanks to:
* Aurelio De Rosa
* http://www.sitepoint.com/find-a-route-using-the-geolocation-and-the-google-maps-api/
*
* Alex T.
* http://www.isgoodstuff.com/2012/07/22/cross-domain-xml-using-jquery/
*
*/
var myOptions;
function calculateRoute(from, to) {
// Center initialized to New York
  myOptions = {
      zoom: 10,
      center: new google.maps.LatLng(40.7142, 74.0064),
      mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  // Draw the map
  var mapObject = new google.maps.Map(document.getElementById("map"), myOptions);
  var directionsService = new google.maps.DirectionsService();
  var directionsRequest = {
        origin: from,
        destination: to,
        travelMode: google.maps.DirectionsTravelMode.TRANSIT,
        provideRouteAlternatives: true,
        unitSystem: google.maps.UnitSystem.METRIC
      };
      
  directionsService.route(directionsRequest,function(response, status){
      if (status == google.maps.DirectionsStatus.OK){
          var display = new google.maps.DirectionsRenderer({
                map: mapObject,
                directions: response
            });
          display.setPanel(document.getElementById("directions"));
      }else
          $("#error").append("Unable to retrieve your route<br />");
    });
}
function requestPlace(from, type){
  var request = {
    location: from,
    radius: 500,
    types: [type]
  };
  var placesMap = new google.maps.Map(document.getElementById('map-canvas'),myOptions);
  var placeService = new google.maps.places.PlacesService(placesMap);
  service.nearbySearch(request, placeCallback);

}

function placeCallback(results, status){
  if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        console.log(results[i]);
      }
    }

}

function requestXml(url){
  $.ajax({
          url: url,
          dataType: "xml",
          type: 'GET',
          success: function(res) {
            var myXML = res.responseText;
            // This is the part xml2Json comes in.
            var JSONConvertedXML = $.xml2json(myXML);
            $('#myXMLList').empty();
            for(var i = 0; i < JSONConvertedXML.facility.length; i++){
              //alert(JSONConvertedXML.facility[0].Name);
              $('#myXMLList').append('<li><a href="#">'+JSONConvertedXML.facility[i].Name+'</a></li>');
              
            }
          }
      });

}
function geocode(address){
  geocoder.geocode({'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
            return results.geometry.location;
      } else {
        console.log("Geocode was not successful for the following reason: " + status);
      }
    });
}

$(document).ready(function() {

  
//request xml data from nyc datasets
//requestXml("http://www.nycgovparks.org/bigapps/DPR_RecreationCenter_001.xml");
// requestXml("http://www.nycgovparks.org/bigapps/DPR_HistoricHouses_001.xml");
// requestXml("http://www.nycgovparks.org/bigapps/DPR_Hiking_001.xml");
requestXml("http://www.nycgovparks.org/bigapps/DPR_RunningTracks_001.xml");
      

// If the browser supports the Geolocation API
  if (typeof navigator.geolocation == "undefined") {

      $("#error").text("Your browser doesn't support the Geolocation API");

      return;
  }
  //Getting geolocation
  $("#from-link, #to-link").click(function(event) {
      event.preventDefault();
      var addressId = this.id.substring(0, this.id.indexOf("-"));
      navigator.geolocation.getCurrentPosition(function(position) {
          var geocoder = new google.maps.Geocoder();
          geocoder.geocode({
              "location": new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
            },
            function(results, status) {
              if (status == google.maps.GeocoderStatus.OK)
                $("#" + addressId).val(results[0].formatted_address);
              else
                $("#error").append("Unable to retrieve your address<br />");
            });
          },
          function(positionError){
            $("#error").append("Error: " + positionError.message + "<br />");
          },
          {
            enableHighAccuracy: true,
            timeout: 10 * 1000 // 10 seconds
          });
  });
  
  $("#calculate-route").submit(function(event) {
          event.preventDefault();
          calculateRoute($("#from").val(), $("#to").val());
          var placeType = 'subway_station';
          //requestPlace(from, placeType);
        });
      });