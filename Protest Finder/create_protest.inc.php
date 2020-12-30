<?php
    include_once 'dbh.inc.php';

    $name = $_POST['name'];
    $cause = $_POST['cause'];
    $info = $_POST['info'];
    $location = $_POST['location'];
    $date = $_POST['date'];
    $time = $_POST['time'];

    $sql = "INSERT INTO `protest_table` (name, cause, info, location, date, time) VALUES ('$name', '$cause', '$info', '$location', '$date', '$time');";
    mysqli_query($conn, $sql);

    header("Location: index.php?creation=success");

    // $sql = "SELECT * FROM `protest_table`;";

    // $query = mysqli_query($conn, $sql);
    // $array = array();

    // while ($row = mysql_fetch_assoc($query)){
    //     $array[] = $row;
    // }

    // $js_array = json_encode($array);
    

    // // $resultCheck = mysqli_num_rows($result);
    // // // if ($resultCheck > 0) {
    // // //     while ($row = mysqli_fetch_assoc($result)) {
    // // //         echo $row['Name'];
    // // //     }
    // // // }
?>