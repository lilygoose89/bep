//load the DOM
$(document).ready(function(){

  //log
  console.log('ready!');

});

//smooth scrolling better because rachel
$('a[href^="#"]').on('click',function () {
  var link = this.hash.substr(1);
  var section = $('*[id=' + link + ']');

  $('html,body').animate({
    scrollTop: section.offset().top - 48
  }, 800);
  return false;
});

// naeem's google api script
var map_config = {
    center: {lat: 18.788996098499975, lng: 98.98642909008788},
    zoom: 12.2
};

$('document').ready(function () {
    init_map_1();
    init_map_2();
});

function init_map_1() {

    var map_1 = new google.maps.Map(document.getElementById('map-1'), map_config);

    var input_1 = document.getElementById('search-1');

    var auto_complete_1 = new google.maps.places.Autocomplete(input_1);
    auto_complete_1.bindTo('bounds', map_1);

    var marker_1 = new google.maps.Marker({
        map: map_1,
        draggable: true
    });

    auto_complete_1.addListener('place_changed', function() {

        marker_1.setVisible(false);

        var place_1 = auto_complete_1.getPlace();
        if (!place_1.geometry) {
            console.log("Map 1 autocomplete's returned place contains no geometry"); return;
        }

        get_geocode_address_segments(place_1, 1, false, place_1.geometry.location);

        // If the place_1 has a geometry, then present it on a map.
        if (place_1.geometry.viewport) {
            map_1.fitBounds(place_1.geometry.viewport);
        } else {
            map_1.setCenter(place_1.geometry.location);
            map_1.setZoom(17);
        }

        marker_1.setPosition(place_1.geometry.location);
        marker_1.setVisible(true);
    });

    marker_1.addListener('dragend',function(event) {

        $('#lat').val(event.latLng.lat());
        $('#lng').val(event.latLng.lng());

        geocodePosition(marker_1.getPosition(), 1);

        map_1.setCenter(
            new google.maps.LatLng(
                parseFloat(event.latLng.lat()),
                parseFloat(event.latLng.lng())
            )
        );
    });
}

function init_map_2() {

    var map_2 = new google.maps.Map(document.getElementById('map-2'), map_config);

    var input_2 = document.getElementById('search-2');

    var auto_complete_2 = new google.maps.places.Autocomplete(input_2);
    auto_complete_2.bindTo('bounds', map_2);

    var marker_2 = new google.maps.Marker({
        map: map_2,
        draggable: true
    });

    auto_complete_2.addListener('place_changed', function() {

        marker_2.setVisible(false);

        var place_2 = auto_complete_2.getPlace();
        if (!place_2.geometry) {
            console.log("Map 2 autocomplete's returned place contains no geometry"); return;
        }

        get_geocode_address_segments(place_2, 2, false, place_2.geometry.location);

        // If the place_2 has a geometry, then present it on a map.
        if (place_2.geometry.viewport) {
            map_2.fitBounds(place_2.geometry.viewport);
        } else {
            map_2.setCenter(place_2.geometry.location);
            map_2.setZoom(17);
        }

        marker_2.setPosition(place_2.geometry.location);
        marker_2.setVisible(true);
    });

    marker_2.addListener('dragend',function(event) {

        $('#lat').val(event.latLng.lat());
        $('#lng').val(event.latLng.lng());

        geocodePosition(marker_2.getPosition(), 2);

        map_2.setCenter(
            new google.maps.LatLng(
                parseFloat(event.latLng.lat()),
                parseFloat(event.latLng.lng())
            )
        );
    });
}

function geocodePosition(pos, section_counter) {

    var geocoder = new google.maps.Geocoder();

    geocoder.geocode({
        latLng: pos
    }, function (responses) {
        get_geocode_address_segments(responses, section_counter, 'geocode', pos);
    });
}

function get_geocode_address_segments(results, section_counter, call_type, coordinates) {

    var street_number = '';
    var route = '';
    var city = '';
    var province = '';
    var country = '';
    var country_iso = '';

    if(call_type == 'geocode'){

        for (var j=0; j<results.length; j++)
        {
            for (var i=0; i<results[j].address_components.length; i++)
            {
                if(!street_number){
                    if (results[j].address_components[i].types[0] == "street_number") {
                        street_number = results[j].address_components[i].long_name+' ';
                    }
                }
                if(!route){
                    if (results[j].address_components[i].types[0] == "route") {
                        route = results[j].address_components[i].long_name;
                    }
                }
                if(!city){
                    if (results[j].address_components[i].types[0] == "administrative_area_level_2") {
                        city = results[j].address_components[i].long_name;
                    }
                }
                if(!province){
                    if (results[j].address_components[i].types[0] == "administrative_area_level_1") {
                        province = results[j].address_components[i].long_name;
                    }
                }
                if(!country){
                    if (results[j].address_components[i].types[0] == "country") {
                        country = results[j].address_components[i].long_name;
                        country_iso = results[j].address_components[i].short_name;
                    }
                }

                if(province && country){
                    break;
                }
            }
        }

    } else {

        for (var i=0; i<results.address_components.length; i++)
        {
            if(!street_number){
                if (results.address_components[i].types[0] == "street_number") {
                    street_number = results.address_components[i].long_name+' ';
                }
            }
            if(!route){
                if (results.address_components[i].types[0] == "route") {
                    route = results.address_components[i].long_name;
                }
            }
            if(!city){
                if (results.address_components[i].types[0] == "administrative_area_level_2") {
                    city = results.address_components[i].long_name;
                }
            }
            if(!province){
                if (results.address_components[i].types[0] == "administrative_area_level_1") {
                    province = results.address_components[i].long_name;
                }
            }
            if(!country){
                if (results.address_components[i].types[0] == "country") {
                    country = results.address_components[i].long_name;
                    country_iso = results.address_components[i].short_name;
                }
            }

            if(province && country){
                break;
            }
        }
    }

    $('#lat-'+section_counter).val(coordinates.lat());
    $('#lng-'+section_counter).val(coordinates.lng());
    $('#province-'+section_counter).val(province);
    $('#country-'+section_counter).val(country);
}
