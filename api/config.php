<?php
/**
 * Database configuration for DND Builder API.
 * Update these values to match your MySQL / MariaDB setup.
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$servername = 'localhost';
$username   = 'root';
$password   = '';
$db_name    = 'db_tib';
$port       = 3306;

$conn = new mysqli($servername, $username, $password, $db_name, $port);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]);
    exit;
}

$conn->set_charset('utf8mb4');
