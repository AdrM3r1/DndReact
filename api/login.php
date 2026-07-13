<?php
/**
 * POST /api/login.php
 * Body (JSON): { "nick": "...", "pass": "..." }
 * Returns:     { "success": true, "user": "nick", "isAdmin": bool, "token": "jwt..." }
 */

require_once __DIR__ . '/auth_middleware.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
if (!check_rate_limit($ip, 'login', 5, 300)) {
    http_response_code(429);
    echo json_encode(['error' => 'Too many login attempts. Try again in 5 minutes.']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
if (!$input || empty($input['nick']) || empty($input['pass'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Nick and password are required']);
    exit;
}

$nick = $conn->real_escape_string($input['nick']);
$pass = $input['pass'];

$stmt = $conn->prepare("SELECT id, nick, pass FROM users_ WHERE nick = ?");
$stmt->bind_param("s", $nick);
$stmt->execute();
$result = $stmt->get_result();

if ($result && $result->num_rows === 1) {
    $row = $result->fetch_assoc();
    $passwordValid = ($row['pass'] === $pass) || password_verify($pass, $row['pass']);

    if ($passwordValid) {
        reset_rate_limit($ip, 'login');
        $isAdmin = ($nick === 'root');

        $token = jwt_encode([
            'user' => $nick,
            'role' => $isAdmin ? 'admin' : 'user',
            'user_id' => $row['id'],
        ]);

        echo json_encode([
            'success' => true,
            'user'    => $nick,
            'isAdmin' => $isAdmin,
            'token'   => $token,
        ]);
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Nick or password incorrect']);
    }
} else {
    http_response_code(401);
    echo json_encode(['error' => 'Nick or password incorrect']);
}

$stmt->close();
