var FireStation = [];

function fireb() {   
    
   
    var fxmlhttp = new XMLHttpRequest();
    
    var furl = "https://data.cityofchicago.org/api/views/28km-gtjn/rows.json?accessType=DOWNLOAD"; //
    fxmlhttp.open("GET", furl, true);
    fxmlhttp.send();

    
    fxmlhttp.onreadystatechange = function() { //Obtencion de datos
        if (fxmlhttp.readyState == 4 && fxmlhttp.status == 200) {
            
            var pArray = fxmlhttp.responseText;
            var text = pArray;
            json = JSON.parse(text);
            
           
            for (var i = 0; i<30; i++) { //Agregar informacion marcadores
                var datos = [];
                datos.push(json.data[i][14][1]); //0.Latitud
                datos.push(json.data[i][14][2]); //1.Longitud
                datos.push(json.data[i][9]);  //2.Nombre
                FireStation.push(datos);
            };           
    
            var numMarkers = FireStation.length; //Numero de marcadores
            var fmarkers = [];
            google.maps.event.addListener(map, 'idle', function() {  //Añadir marcadores al mapa
            
            elevation = new google.maps.ElevationService(); //Servicio de elevacion
            $.each(fmarkers, function(key, value)
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

                        
                        fmarkers[key] = new google.maps.Marker({
                            position: {lat: Number(FireStation[key][0]), lng: Number(FireStation[key][1])},
                            map: map,
                            icon: "img/Fire.png",                                            
                        });

                        google.maps.event.addListener(fmarkers[key], 'click', function() {
                          
                            if( prev_infowindow ) {
                                prev_infowindow.close();
                            }
                            infowindow.setContent(FireStation[key][2]);
                            infowindow.open(map, fmarkers[key]);                     
                            
                            
                        });
                        
                    });
                }
            });       
        });

        }


    };



}