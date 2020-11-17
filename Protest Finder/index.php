<!DOCTYPE html>
<html>
<head>
    <title></title>
    <link rel="stylesheet" href="index.css">
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBixj7xUy07lk5W_KrjtK_BWI2DZDD90Lo"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
</head>

<body>
    <div class = "title">
      <p id = "title-text">Protest Finder</p>
    </div>
    <div class = "map-lookup-container">
      <div class = "Protest_Lookup">
        <p id = "protest_lookup_title">Protest Lookup</p>
        <p id = "name-title">Name:</p>
        <p id = "name"></p>
        <p id = "cause-title">Cause:</p>
        <p id = "cause"></p>
        <p id = "info-title">Info:</p>
        <p id = "info"></p>
        <p id = "location-title">Location:</p>
        <p id = "location_lookup"></p>
        <p id = "date-title">Date:</p>
        <p id = "date"></p>
        <p id = "time-title">Time:</p>
        <p id = "time"></p>
      </div>
      <div id = "map_img"></div>
    </div>
    <?php
        include_once 'dbh.inc.php';

        $sql = "SELECT * FROM `protest_table`;";

        $result = mysqli_query($conn, $sql);
        $resultcheck = mysqli_num_rows($result);

        $php_array = array();
        $php_locations = array();

        if ($resultcheck > 0) {
            while ($row = mysqli_fetch_assoc($result)) {
                array_push($php_array, $row['name']);
                array_push($php_locations, $row['location']);
            }
        }
    ?>

    <script>
        var js_array = <?php echo json_encode($php_array); ?>;
        var js_locations = <?php echo json_encode($php_locations); ?>;
    </script>

    <div class = "tab">
      <form action= "create_protest.inc.php" method="POST" id = "form">
          <input type="text" name="name" placeholder="Name">
          <input type="text" name="cause" placeholder="Cause">
          <input type="text" name="info" placeholder="Info">
          <input type="text" name="location" placeholder="Location" id = "location">
          <input type ="text" name = "date" placeholder = "Date">
          <input type="text" name="time" placeholder="Time">
          <button type="submit" name="submit" id = "submit-button">Create Protest</button>
      </form>
    </div>

    <script>
        var map_img = document.getElementById('map_img');
        var name_test = document.getElementById('name_test');
        var form_ele = document.getElementById('form');
        var location_ele = document.getElementById('location');

        var name_lookup = document.getElementById('name');
        var cause_lookup = document.getElementById('cause');
        var info_lookup = document.getElementById('info');
        var location_lookup = document.getElementById('location_lookup');
        var date_lookup = document.getElementById('date');
        var time_lookup = document.getElementById('time');

        var update_location;
        let map;
        let lat;
        var geocoder;
        var coords_to_address = {};
        var myCenter=new google.maps.LatLng(53, -1.33);

        form.addEventListener("submit", function(){
          update_location = location_ele.value;
          codeAddress(update_location);
        })

        function initMap() {
            map = new google.maps.Map(document.getElementById("map_img"), {
                center: { lat: 39.8283, lng: -98.7594},
                zoom: 5,
            });
            geocoder = new google.maps.Geocoder();
            for (i = 0; i < js_locations.length; i++) {
                codeAddress(js_locations[i]);
            }
        }

        function codeAddress(address) {
            geocoder.geocode( {'address': address}, function(results, status) {
                var latLng = { lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() };
                var lat = results[0].geometry.location.lat();
                if (status == 'OK') {
                        const marker = new google.maps.Marker({
                        animation: google.maps.Animation.DROP,
                        position: latLng,
                        map: map
                    });
                    coords_to_address[lat] = address;
                    console.log(coords_to_address);
                    marker.addListener("click", function(){
                        lat = marker.getPosition().lat();
                        for (let key in coords_to_address) {
                            if (key == lat) {
                                var address = coords_to_address[key];

                                var data = new FormData();
                                data.append('address', address);

                                var oReq = new XMLHttpRequest();
                                oReq.onload = function() {
                                    var res = this.responseText.split("\n");
                                    name_lookup.innerHTML = res[0];
                                    cause_lookup.innerHTML = res[1];
                                    info_lookup.innerHTML = res[2];
                                    location_lookup.innerHTML = address;
                                    date_lookup.innerHTML = res[3];
                                    time_lookup.innerHTML = res[4];
                                }
                                oReq.open("post", "test.php", true);
                                oReq.send(data);
                            }
                        }
                    });
                } else {
                    alert('Geocoder unsuccessful.');
                }

                for (let k in coords_to_address) {
                    console.log(k + "address is: " + coords_to_address[k]);
                }
            })
          }

        initMap();
    </script>
</body>
</html>
