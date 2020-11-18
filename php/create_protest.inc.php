<?php
    include_once 'dbh.inc.php';

    $name = $_POST['name'];
    $cause = $_POST['cause'];
    $info = $_POST['info'];
    $location = $_POST['location'];
    $date = $_POTS['date'];
    $time = $_POST['time'];

    $sql = "INSERT INTO `protest_table` (name, cause, info, location, date, time) VALUES ('$name', '$cause', '$info', '$location', '$date', '$time');";
    mysqli_query($conn, $sql);

    header("Location: index.php?creation=success");
?>