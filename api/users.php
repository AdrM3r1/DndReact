<?php
/**
 * Users API - Admin operations
 *
 * GET    /api/users.php        → list all users (excluding root)
 * DELETE /api/users.php?id=N   → delete a user by id
 */

require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

// ─── LIST USERS ─────────────────────────────────────
if ($method === 'GET') {
    $result = $conn->query("SELECT id, nick FROM users_ WHERE nick != 'root' ORDER BY nick");
    $users = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $users[] = $row;
        }
    }
    echo json_encode($users);
    exit;
}

// ─── DELETE USER ────────────────────────────────────
if ($method === 'DELETE') {
    $id = (int)($_GET['id'] ?? 0);
    if ($id === 0) {
        http_response_code(400);
        echo json_encode(['error' => 'User id is required']);
        exit;
    }

    // Get nick before deleting so we can remove their characters
    $res = $conn->query("SELECT nick FROM users_ WHERE id = $id");
    if ($res && $row = $res->fetch_assoc()) {
        $nick = $conn->real_escape_string($row['nick']);
        $conn->query("DELETE FROM tabla_pj WHERE asociadoa = '$nick'");
        $conn->query("DELETE FROM reg_uspj WHERE asociadoa = '$nick'");
        $conn->query("DELETE FROM users_ WHERE id = $id");
        echo json_encode(['success' => true]);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'User not found']);
    }
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
