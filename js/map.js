//Inicio mapa de google
//Creacion marcadores de apartamentos

var elevator;
var map;
var librariesData = [];

function initMap() {   
    
    map = new google.maps.Map(document.getElementById('map'), {   //Iniciar mapa de google
        center: {lat: 41.8708, lng: -87.6505},
        zoom: 12
    });


    var infowindow = new google.maps.InfoWindow({   
                            content: ""
                        });
   
    var xmlhttp = new XMLHttpRequest();
    
    var url = "https://data.cityofchicago.org/api/views/hu6v-hsqb/rows.json?accessType=DOWNLOAD"; //
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

    
    xmlhttp.onreadystatechange = function() { //Obtencion de datos
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            
            var aptArray = xmlhttp.responseText;
            var text = aptArray;
            json = JSON.parse(text);
            
           
            for (var i = 0; i<44; i++) { //Agregar informacion marcadores
                var datos = [];
                datos.push(json.data[i][18]); //0.Latitud
                datos.push(json.data[i][19]); //1.Longitud
                datos.push(json.data[i][8]);  //2.Nombre
                datos.push(json.data[i][9]);  //3.Calle
                datos.push(json.data[i][10]); //Dias
                datos.push(json.data[i][11]); //start time - 5
                datos.push(json.data[i][12]); //end time - 6
                datos.push(json.data[i][13]); //start date -7
                datos.push(json.data[i][14]); //end date - 8
                datos.push(json.data[i][15][0]);

                librariesData.push(datos);
            };           
    
            var numMarkers = librariesData.length; //Numero de marcadores

            var markers = [];
            google.maps.event.addListener(map, 'idle', function() {  //Añadir marcadores al mapa
            
            elevation = new google.maps.ElevationService(); //Servicio de elevacion
            $.each(markers, function(key, value)
            {
                value.setMap(null);
            });

            //límites de la ubicación
            var boundBox = map.getBounds();
            var southWest = boundBox.getSouthWest();
            var northEast = boundBox.getNorthEast();
            var lngSpan = northEast.lng() - southWest.lng();
            var latSpan = northEast.lat() - southWest.lat();

            // Agregar los marcadores al mapa en ubicaciones aleatorias
            var locations = [];
            for (var j = 0; j < numMarkers; j++)
            {
                var location = new google.maps.LatLng(
                        southWest.lat() + latSpan * Math.random(),
                        southWest.lng() + lngSpan * Math.random()
                        );
                locations.push(location);
            }

            
            var positionalRequest = {
                'locations': locations
            };

            elevation.getElevationForLocations(positionalRequest, function(results, status)
            {
                if (status === google.maps.ElevationStatus.OK)
                {
                    
                    var prev_infowindow =false;

                    $.each(results, function(key, value) {

                        
                        markers[key] = new google.maps.Marker({
                            position: {lat: Number(librariesData[key][0]), lng: Number(librariesData[key][1])},
                            map: map,
                            
                        });
                        google.maps.event.addListener(markers[key], 'click', function() {
                          
                            if( prev_infowindow ) {
                                prev_infowindow.close();
                            }
                            infowindow.setContent(librariesData[key][2]);
                            infowindow.open(map, markers[key]);
                            
                            document.getElementById("market-name").innerHTML = "<b>Market Name</b>: " + librariesData[key][2] + "</em>";
                            
                        });
                        
                    });
                }
            });
            var markerU = new google.maps.Marker({ 
                position: new google.maps.LatLng(41.870750,-87.650086), 
                map: map,
                title: 'Department of Computer Science - University of Illinois, Chicago'});

            var trafficLayer = new google.maps.TrafficLayer();
                trafficLayer.setMap(map);
        });

        }
    };

}
