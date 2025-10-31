<?php
$servername = "localhost";  // Change to your database server name or IP address
$username = "root";         // Your MySQL username
$password = "";             // Your MySQL password
$dbname = "kusu";  // Name of the database you want to connect to

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} else {
    // echo "Connected successfully";
}
?>
