<?php
    $dbServername = "gator3315.hostgator.com";
    $dbUsername = "meyercts_meyerct";
    $dbPassword = "AZQUOu1QKL9i";
    $dbName = "meyercts_particle_data";
    $conn = mqsqli_connect($dbServername, $dbUsername, $dbPassword, $dbName);
    
    $x = $_POST['x_coord'];
    $y = $_POST['y_coord'];

    $sql = "INSERT INTO `data_table` (x_coord, y_coord) VALUES ('$x', '$y');";
    msqli_query($conn, $sql);

    header("Location: particles.html?creation=success");
