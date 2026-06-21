<?php
/**
 * POST /api/recovery.php
 * Body (JSON): { "nick": "...", "mail": "..." }
 * Returns:     { "success": true, "password": "..." }
 *              or { "error": "..." }
 *
 * NOTE: In production, send the password by email instead of returning it.
 */

require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
if (!$input || empty($input['nick']) || empty($input['mail'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Nick and email are required']);
    exit;
}

$nick  = $conn->real_escape_string($input['nick']);
$email = $conn->real_escape_string($input['mail']);

$sql    = "SELECT pass FROM users_ WHERE nick = '$nick' AND mail = '$email'";
$result = $conn->query($sql);

if ($result && $row = $result->fetch_assoc()) {
    echo json_encode(['success' => true, 'password' => $row['pass']]);
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Nick and email do not match our records']);
}
