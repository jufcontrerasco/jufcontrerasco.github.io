var PoliStation = [];

function policeb() {   

    
   
    var pxmlhttp = new XMLHttpRequest();
    
    var purl = "https://data.cityofchicago.org/api/views/z8bn-74gv/rows.json?accessType=DOWNLOAD"; //
    pxmlhttp.open("GET", purl, true);
    pxmlhttp.send();

    
    pxmlhttp.onreadystatechange = function() { //Obtencion de datos
        if (pxmlhttp.readyState == 4 && pxmlhttp.status == 200) {
            
            var pArray = pxmlhttp.responseText;
            var text = pArray;
            json = JSON.parse(text);
            
           
            for (var i = 0; i<23; i++) { //Agregar informacion marcadores
                var datos = [];
                datos.push(json.data[i][20]); //0.Latitud
                datos.push(json.data[i][21]); //1.Longitud
                datos.push(json.data[i][9]);  //2.Nombre
                PoliStation.push(datos);
            };           
    
            var numMarkers = PoliStation.length; //Numero de marcadores
            var pmarkers = [];
            google.maps.event.addListener(map, 'idle', function() {  //Añadir marcadores al mapa
            
            elevation = new google.maps.ElevationService(); //Servicio de elevacion
            $.each(pmarkers, function(key, value)
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

                        
                        pmarkers[key] = new google.maps.Marker({
                            position: {lat: Number(PoliStation[key][0]), lng: Number(PoliStation[key][1])},
                            map: map,
                            icon: "img/police.png",                                            
                        });

                        google.maps.event.addListener(pmarkers[key], 'click', function() {
                          
                            if( prev_infowindow ) {
                                prev_infowindow.close();
                            }
                            infowindow.setContent(PoliStation[key][2]);
                            infowindow.open(map, pmarkers[key]);                     
                            
                            
                        });
                        
                    });
                }
            });       
        });

        }


    };


    



}