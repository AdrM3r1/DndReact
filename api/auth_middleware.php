<?php
/**
 * Authentication middleware: JWT, rate limiting, CSRF protection.
 */

require_once __DIR__ . '/config.php';

// ─── JWT Helpers ──────────────────────────────────────
define('JWT_SECRET', 'dnd_builder_secret_key_change_in_production_2024');
define('JWT_EXPIRY', 86400);

function base64url_encode(string $data): string {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64url_decode(string $data): string {
    return base64_decode(strtr($data, '-_', '+/'));
}

function jwt_encode(array $payload): string {
    $header = base64url_encode(json_encode(['typ' => 'JWT', 'alg' => 'HS256']));
    $payload['iat'] = time();
    $payload['exp'] = time() + JWT_EXPIRY;
    $payloadEnc = base64url_encode(json_encode($payload));
    $signature = base64url_encode(hash_hmac('sha256', $header . '.' . $payloadEnc, JWT_SECRET, true));
    return $header . '.' . $payloadEnc . '.' . $signature;
}

function jwt_decode(string $token): ?array {
    $parts = explode('.', $token);
    if (count($parts) !== 3) return null;

    [$header, $payload, $signature] = $parts;
    $validSig = base64url_encode(hash_hmac('sha256', $header . '.' . $payload, JWT_SECRET, true));

    if (!hash_equals($validSig, $signature)) return null;

    $data = json_decode(base64url_decode($payload), true);
    if (!$data || !isset($data['exp']) || $data['exp'] < time()) return null;

    return $data;
}

function get_token_from_header(): ?string {
    $auth = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (preg_match('/^Bearer\s+(.+)$/i', $auth, $m)) {
        return $m[1];
    }
    return null;
}

// ─── Rate Limiting (file-based) ───────────────────────
define('RATE_LIMIT_DIR', __DIR__ . '/../tmp/rate_limits');

function check_rate_limit(string $ip, string $action, int $maxAttempts = 5, int $windowSeconds = 300): bool {
    if (!is_dir(RATE_LIMIT_DIR)) {
        mkdir(RATE_LIMIT_DIR, 0755, true);
    }

    $key = RATE_LIMIT_DIR . '/' . md5($ip . '_' . $action) . '.json';
    $data = ['attempts' => 0, 'first_attempt' => time()];

    if (file_exists($key)) {
        $stored = json_decode(file_get_contents($key), true);
        if ($stored && (time() - $stored['first_attempt']) < $windowSeconds) {
            $data = $stored;
        } else {
            $data = ['attempts' => 0, 'first_attempt' => time()];
        }
    }

    $data['attempts']++;

    if ($data['attempts'] > $maxAttempts) {
        file_put_contents($key, json_encode($data));
        return false;
    }

    file_put_contents($key, json_encode($data));
    return true;
}

function reset_rate_limit(string $ip, string $action): void {
    $key = RATE_LIMIT_DIR . '/' . md5($ip . '_' . $action) . '.json';
    if (file_exists($key)) {
        unlink($key);
    }
}

// ─── CSRF Token Generation ────────────────────────────
function generate_csrf_token(): string {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    $token = bin2hex(random_bytes(32));
    $_SESSION['csrf_token'] = $token;
    return $token;
}

function validate_csrf_token(string $token): bool {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

// ─── Require Authentication ───────────────────────────
function require_auth(): array {
    $token = get_token_from_header();
    if (!$token) {
        http_response_code(401);
        echo json_encode(['error' => 'Authentication required']);
        exit;
    }

    $payload = jwt_decode($token);
    if (!$payload) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid or expired token']);
        exit;
    }

    return $payload;
}

function require_admin(): array {
    $payload = require_auth();
    if (($payload['role'] ?? '') !== 'admin') {
        http_response_code(403);
        echo json_encode(['error' => 'Admin access required']);
        exit;
    }
    return $payload;
}

// ─── Input Sanitization ───────────────────────────────
function sanitize_string(string $input): string {
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}
