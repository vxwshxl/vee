<?php
// Database configuration
$servername = "localhost";  // Change to your database server name or IP address
$username = "root";         // Your MySQL username
$password = "";             // Your MySQL password
$dbname = "kusu";           // Name of the database you want to connect to

// Create connection with error handling
try {
    $conn = new mysqli($servername, $username, $password, $dbname);
    
    // Check connection
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }
} catch (Exception $e) {
    // Log error but don't expose sensitive information to users
    error_log("Database connection error: " . $e->getMessage());
    // You might want to handle this differently in production
    $conn = null;
}
?>