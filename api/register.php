<?php
/**
 * POST /api/register.php
 * Body (JSON): { "nick": "...", "email": "...", "password": "...", "cpass": "..." }
 * Returns:     { "success": true, "user": "nick", "token": "jwt..." }
 */

require_once __DIR__ . '/auth_middleware.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
if (!check_rate_limit($ip, 'register', 3, 3600)) {
    http_response_code(429);
    echo json_encode(['error' => 'Too many registration attempts. Try again in 1 hour.']);
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
$password = $input['password'];
$cpass    = $input['cpass'] ?? '';

if (strlen($nick) < 3 || strlen($nick) > 50) {
    http_response_code(400);
    echo json_encode(['error' => 'Nick must be 3-50 characters']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email format']);
    exit;
}

if (strlen($password) < 6) {
    http_response_code(400);
    echo json_encode(['error' => 'Password must be at least 6 characters']);
    exit;
}

if ($password !== $cpass) {
    http_response_code(400);
    echo json_encode(['error' => 'Passwords do not match']);
    exit;
}

$stmt = $conn->prepare("SELECT id FROM users_ WHERE nick = ?");
$stmt->bind_param("s", $nick);
$stmt->execute();
if ($stmt->get_result()->num_rows > 0) {
    $stmt->close();
    http_response_code(409);
    echo json_encode(['error' => 'Nick already exists']);
    exit;
}
$stmt->close();

$stmt = $conn->prepare("SELECT id FROM users_ WHERE mail = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
if ($stmt->get_result()->num_rows > 0) {
    $stmt->close();
    http_response_code(409);
    echo json_encode(['error' => 'Email already registered']);
    exit;
}
$stmt->close();

$hashedPass = password_hash($password, PASSWORD_DEFAULT);

$stmt = $conn->prepare("INSERT INTO users_ (nick, mail, pass) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $nick, $email, $hashedPass);

if ($stmt->execute()) {
    reset_rate_limit($ip, 'register');

    $token = jwt_encode([
        'user' => $nick,
        'role' => 'user',
        'user_id' => $stmt->insert_id,
    ]);

    echo json_encode([
        'success' => true,
        'user'    => $nick,
        'token'   => $token,
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Could not create user']);
}

$stmt->close();
