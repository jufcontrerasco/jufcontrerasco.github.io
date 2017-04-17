var HospitalData = [];

function hospb() {
    
   
    var hxmlhttp = new XMLHttpRequest();
    
    var hurl = "https://data.cityofchicago.org/api/views/kcki-hnch/rows.json?accessType=DOWNLOAD"; //
    hxmlhttp.open("GET", hurl, true);
    hxmlhttp.send();

    
    hxmlhttp.onreadystatechange = function() { //Obtencion de datos
        if (hxmlhttp.readyState == 4 && hxmlhttp.status == 200) {
            
            var hArray = hxmlhttp.responseText;
            var text = hArray;
            json = JSON.parse(text);
            
           
            for (var i = 0; i<25; i++) { //Agregar informacion marcadores
                var datos = [];
                datos.push(json.data[i][27]); //0.Latitud
                datos.push(json.data[i][28]); //1.Longitud
                datos.push(json.data[i][9]);  //2.Nombre
                HospitalData.push(datos);
            };           
    
            var numMarkers = HospitalData.length; //Numero de marcadores
            var hmarkers = [];
            google.maps.event.addListener(map, 'idle', function() {  //Añadir marcadores al mapa
            
            elevation = new google.maps.ElevationService(); //Servicio de elevacion
            $.each(hmarkers, function(key, value)
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

                        
                        hmarkers[key] = new google.maps.Marker({
                            position: {lat: Number(HospitalData[key][0]), lng: Number(HospitalData[key][1])},
                            map: map,
                            icon: "img/Hospital.png",                                            
                        });

                        google.maps.event.addListener(hmarkers[key], 'click', function() {
                          
                            if( prev_infowindow ) {
                                prev_infowindow.close();
                            }
                            infowindow.setContent(HospitalData[key][2]);
                            infowindow.open(map, hmarkers[key]);                     
                            
                            
                        });
                        
                    });
                }
            });       
        });

        }


    };



}