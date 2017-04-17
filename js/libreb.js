var LibrariesData = [];

function libreb() {   

    
   
    var lxmlhttp = new XMLHttpRequest();
    
    var furl = "https://data.cityofchicago.org/api/views/x8fc-8rcq/rows.json?accessType=DOWNLOAD"; //
    lxmlhttp.open("GET", furl, true);
    lxmlhttp.send();

    
    lxmlhttp.onreadystatechange = function() { //Obtencion de datos
        if (lxmlhttp.readyState == 4 && lxmlhttp.status == 200) {
            
            var lArray = lxmlhttp.responseText;
            var text = lArray;
            json = JSON.parse(text);
            
           
            for (var i = 0; i<20; i++) { //Agregar informacion marcadores
                var datos = [];
                datos.push(json.data[i][18][1]); //0.Latitud
                datos.push(json.data[i][18][2]); //1.Longitud
                datos.push(json.data[i][12]);  //2.Nombre
                LibrariesData.push(datos);
            };           
    
            var numMarkers = LibrariesData.length; //Numero de marcadores
            var lmarkers = [];
            google.maps.event.addListener(map, 'idle', function() {  //Añadir marcadores al mapa
            
            elevation = new google.maps.ElevationService(); //Servicio de elevacion
            $.each(lmarkers, function(key, value)
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

                        
                        lmarkers[key] = new google.maps.Marker({
                            position: {lat: Number(LibrariesData[key][0]), lng: Number(LibrariesData[key][1])},
                            map: map,
                            icon: "img/Library.png",                                            
                        });

                        google.maps.event.addListener(lmarkers[key], 'click', function() {
                          
                            if( prev_infowindow ) {
                                prev_infowindow.close();
                            }
                            infowindow.setContent(LibrariesData[key][2]);
                            infowindow.open(map, lmarkers[key]);                     
                            
                            
                        });
                        
                    });
                }
            });       
        });

        }


    };



}