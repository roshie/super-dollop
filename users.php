<?php

require_once 'config.php';
error_reporting(0);


$pagination = $_POST["pagination"];
$pagination = (int) $pagination;

$sql = "SELECT COUNT(*) AS totalRows from users";
$result = $conn->query($sql);
$totalRows = mysqli_fetch_assoc($result);

$start = $pagination - 1;

# Get this no of rows from db - pagination
$paginationRows = 10;

if ($pagination > 1)
    $start = $start * 10;


# Get records in pagination
$sql = "SELECT * FROM users LIMIT ".$start.",".$paginationRows;
$result = $conn->query($sql);
$results = array();

while($row = mysqli_fetch_assoc($result)) {
    $results[] = array('id' => $row['id'], 'name' => $row['name'], 'email' => $row['email'], 'designation' => $row['designation']);
}

echo json_encode($totalRows + array('data' => $results));