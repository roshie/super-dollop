<?php


header('Access-Control-Allow-Origin: *');
error_reporting(0);


$server = "localhost";
$username = "id17420074_roshdatabase";
$password = "]T2uf_]KOLcr)cTi";
$db = "id17420074_database";

$conn = new mysqli($server, $username, $password, $db);

if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}