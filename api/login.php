<?php
/**
 * POST /api/login.php
 * Body (JSON): { "nick": "...", "pass": "..." }
 * Returns:     { "success": true, "user": "nick", "isAdmin": bool }
 *              or { "error": "..." }
 */

require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
if (!$input || empty($input['nick']) || empty($input['pass'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Nick and password are required']);
    exit;
}

$nick = $conn->real_escape_string($input['nick']);
$pass = $conn->real_escape_string($input['pass']);

$sql   = "SELECT * FROM users_ WHERE nick = '$nick' AND pass = '$pass'";
$result = $conn->query($sql);

if ($result && $result->num_rows === 1) {
    $isAdmin = ($nick === 'root');
    echo json_encode([
        'success' => true,
        'user'    => $nick,
        'isAdmin' => $isAdmin,
    ]);
} else {
    http_response_code(401);
    echo json_encode(['error' => 'Nick or password incorrect']);
}
