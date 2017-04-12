//Inicio mapa de google
//Creacion marcadores de apartamentos

var elevator;
var map;
var PoliStation = [];

function initMap() {   
    
    map = new google.maps.Map(document.getElementById('map'), {   //Iniciar mapa de google
        center: {lat: 41.8708, lng: -87.6505},
        zoom: 12
    });


    var infowindow = new google.maps.InfoWindow({   
                            content: ""
                        });
   
    var xmlhttp = new XMLHttpRequest();
    
    var url = "https://data.cityofchicago.org/api/views/z8bn-74gv/rows.json?accessType=DOWNLOAD"; //
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

    
    xmlhttp.onreadystatechange = function() { //Obtencion de datos
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            
            var aptArray = xmlhttp.responseText;
            var text = aptArray;
            json = JSON.parse(text);
            
           
            for (var i = 0; i<23; i++) { //Agregar informacion marcadores
                var datos = [];
                datos.push(json.data[i][20]); //0.Latitud
                datos.push(json.data[i][21]); //1.Longitud
                datos.push(json.data[i][9]);  //2.Nombre
                datos.push(json.data[i][10]); //3.Calle
                datos.push(json.data[i][15][0]); //4.Telefono1
                datos.push(json.data[i][16][0]); //5.Telefono2
                datos.push(json.data[i][14][0]); //6.PaginaWeb
                PoliStation.push(datos);
            };           
    
            var numMarkers = PoliStation.length; //Numero de marcadores
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
                            position: {lat: Number(PoliStation[key][0]), lng: Number(PoliStation[key][1])},
                            map: map,                                            
                        });

                        google.maps.event.addListener(markers[key], 'click', function() {
                          
                            if( prev_infowindow ) {
                                prev_infowindow.close();
                            }
                            infowindow.setContent(PoliStation[key][2]);
                            infowindow.open(map, markers[key]);
                            
                            document.getElementById("station-name").innerHTML = "<b>Police Station Name</b>: " + PoliStation[key][2] + "</em>";
                            
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
