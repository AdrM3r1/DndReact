<?php
/**
 * POST /api/register.php
 * Body (JSON): { "nick": "...", "email": "...", "password": "...", "cpass": "..." }
 * Returns:     { "success": true, "user": "nick" }
 *              or { "error": "..." }
 */

require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
if (!$input || empty($input['nick']) || empty($input['email']) || empty($input['password'])) {
    http_response_code(400);
    echo json_encode(['error' => 'All fields are required']);
    exit;
}

$nick     = $conn->real_escape_string($input['nick']);
$email    = $conn->real_escape_string($input['email']);
$password = $conn->real_escape_string($input['password']);
$cpass    = $input['cpass'] ?? '';

// Check passwords match
if ($password !== $cpass) {
    http_response_code(400);
    echo json_encode(['error' => 'Passwords do not match']);
    exit;
}

// Check if nick already exists
$result = $conn->query("SELECT id FROM users_ WHERE nick = '$nick'");
if ($result && $result->num_rows > 0) {
    http_response_code(409);
    echo json_encode(['error' => 'Nick already exists']);
    exit;
}

// Check if email already exists
$result = $conn->query("SELECT id FROM users_ WHERE mail = '$email'");
if ($result && $result->num_rows > 0) {
    http_response_code(409);
    echo json_encode(['error' => 'Email already registered']);
    exit;
}

// Insert new user
$sql = "INSERT INTO users_ (nick, mail, pass) VALUES ('$nick', '$email', '$password')";
if ($conn->query($sql)) {
    echo json_encode(['success' => true, 'user' => $nick]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Could not create user']);
}
