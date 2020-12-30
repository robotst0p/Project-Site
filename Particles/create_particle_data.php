<?php

ini_set('display_errors', 1);
$dbServername = "gator3315.hostgator.com";
$dbUsername = "meyercts_meyerct";
$dbPassword = ",{xHc6evSy-b";
$dbName = "meyercts_particle_data";
$conn = mysqli_connect($dbServername, $dbUsername, $dbPassword, $dbName);

$x = $_POST['xcoord'];
$y = $_POST['ycoord'];

$sql = "INSERT INTO `data_table` (x_coord, y_coord) VALUES ('$x', '$y');";

mysqli_query($conn, $sql);

header("Location: particles.html?creation=success");


