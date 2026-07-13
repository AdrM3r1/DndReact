<?php
/**
 * POST /api/recovery.php
 * Body (JSON): { "nick": "...", "mail": "..." }
 * Returns:     { "success": true, "message": "..." }
 *
 * In production, send the reset link by email.
 * For now, generates a new random password and returns it.
 */

require_once __DIR__ . '/auth_middleware.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
if (!check_rate_limit($ip, 'recovery', 3, 600)) {
    http_response_code(429);
    echo json_encode(['error' => 'Too many recovery attempts. Try again in 10 minutes.']);
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

$stmt = $conn->prepare("SELECT id FROM users_ WHERE nick = ? AND mail = ?");
$stmt->bind_param("ss", $nick, $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result && $result->num_rows === 1) {
    $row = $result->fetch_assoc();
    $newPassword = substr(bin2hex(random_bytes(8)), 0, 12);
    $hashedNew = password_hash($newPassword, PASSWORD_DEFAULT);

    $update = $conn->prepare("UPDATE users_ SET pass = ? WHERE id = ?");
    $update->bind_param("si", $hashedNew, $row['id']);
    $update->execute();
    $update->close();

    reset_rate_limit($ip, 'recovery');

    echo json_encode([
        'success'  => true,
        'password' => $newPassword,
        'message'  => 'A new password has been generated. Change it after logging in.',
    ]);
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Nick and email do not match our records']);
}

$stmt->close();
