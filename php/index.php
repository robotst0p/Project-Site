<!DOCTYPE html>
<html>
<head>
    <title></title>
    <link rel="stylesheet" href="index.css">
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBixj7xUy07lk5W_KrjtK_BWI2DZDD90Lo"></script>
</head>

<body>
    <div class = "title">
      <p id = "title-text">Protest Finder</p>
    </div>
    <div id = "name_test">
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

    <div id = "map_img"></div>

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
        var update_location;
        var result_name;
        var result_cause;
        var result_info;
        var result_date;
        var result_time;
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
                                alert(coords_to_address[key]);
                                var address = coords_to_address[key];
                                var xhr = new XMLHttpRequest();
                                xhr.open("POST", "http://meyer-projects.com/php/index.php?creation=success", true);
                                xhr.setRequestHeader('Content-Type', 'application/json');
                                xhr.send(JSON.stringify({
                                    value: address;
                                }));
                                <?php 
                                include_once 'dbh.inc.php';
                                $location = $_POST['address'];
                                $sql = "SELECT * FROM `protest_table` WHERE location = $location;";

                                $result = mysqli_query($conn, $sql);
                                $resultcheck = mysqli_num_rows($result);

                                if ($resultcheck > 0) {
                                    while ($row = mysqli_fetch_assoc($result)) {
                                        $result_name = $row['name'];
                                        $result_cause = $row['cause'];
                                        $result_info = $row['info'];
                                        $result_date = $row['date'];
                                        $result_time = $row['time'];
                                    }
                                }
                                ?>
                                var result_name = <?php echo json_encode($result_name); ?>;

                            }
                        }
                    }) 
                } else {
                    alert('Geocoder unsuccessful.');
                }
                for (let k in coords_to_address) {
                    console.log(k + "address is: " + coords_to_address[k]);
                }
            })
        }

        // marker.addEventListener("click", function (){
        //     var latlng = marker.getPosition();
        //     Object.keys(coords_to_address).forEach(function(key) {
        //         if (key = latlng) {
        //             alert(coords_to_address[key]);
        //         }
        //     })
            
        // })

        initMap();
    </script>
</body>
</html>