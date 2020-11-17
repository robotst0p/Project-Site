<?php
include_once 'dbh.inc.php';

foreach ($_POST as $param_name => $param_val) {
    $location = $param_val;
}

$sql = "SELECT * FROM `protest_table` WHERE location ='" . $location . "';";

$result = mysqli_query($conn, $sql);
$resultcheck = mysqli_num_rows($result);

$result_name = "";
$result_cause = "";
$result_info = "";
$result_date = "";
$result_time = "";

if ($resultcheck > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        $result_name = $row['name'];
        $result_cause = $row['cause'];
        $result_info = $row['info'];
        $result_date = $row['date'];
        $result_time = $row['time'];
    }
}

echo json_encode($result_name) . "\n";
echo json_encode($result_cause) . "\n";
echo json_encode($result_info) . "\n";
echo json_encode($result_date) . "\n";
echo json_encode($result_time) . "\n";
