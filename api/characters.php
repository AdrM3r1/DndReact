<?php
/**
 * Characters API - CRUD operations
 *
 * GET    /api/characters.php?user=nick   → list characters for a user
 * GET    /api/characters.php?all=1       → list ALL characters (admin)
 * POST   /api/characters.php             → create character (JSON body)
 * PUT    /api/characters.php             → update character (JSON body)
 * DELETE /api/characters.php?id=N        → delete character by id
 */

require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

// ─── READ ─────────────────────────────────────────────
if ($method === 'GET') {
    if (isset($_GET['all'])) {
        // Admin: return every character
        $result = $conn->query("SELECT * FROM tabla_pj ORDER BY asociadoa, nombre");
    } elseif (!empty($_GET['user'])) {
        $user = $conn->real_escape_string($_GET['user']);
        $result = $conn->query("SELECT * FROM tabla_pj WHERE asociadoa = '$user' ORDER BY nombre");
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Provide ?user=nick or ?all=1']);
        exit;
    }

    $chars = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $chars[] = $row;
        }
    }
    echo json_encode($chars);
    exit;
}

// ─── CREATE ──────────────────────────────────────────
if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input || empty($input['asociadoa']) || empty($input['nombre'])) {
        http_response_code(400);
        echo json_encode(['error' => 'asociadoa and nombre are required']);
        exit;
    }

    $a = $conn->real_escape_string($input['asociadoa']);
    $n = $conn->real_escape_string($input['nombre'] ?? '');
    $r = $conn->real_escape_string($input['raza'] ?? '');
    $c = $conn->real_escape_string($input['clase'] ?? '');
    $ac = (int)($input['armorClass'] ?? 0);
    $lv = (int)($input['nivel'] ?? 1);
    $hp = (int)($input['hitPoints'] ?? 0);
    $hd = $conn->real_escape_string($input['hitDice'] ?? '');
    $sp = (int)($input['speed'] ?? 30);
    $spl = $conn->real_escape_string($input['spells'] ?? '');
    $inv = $conn->real_escape_string($input['invent'] ?? '');

    $sql = "INSERT INTO tabla_pj (asociadoa, nombre, raza, clase, armorClass, nivel, hitPoints, hitDice, speed, spells, invent)
            VALUES ('$a', '$n', '$r', '$c', $ac, $lv, $hp, '$hd', $sp, '$spl', '$inv')";

    if ($conn->query($sql)) {
        $newId = $conn->insert_id;

        // Log to reg_uspj
        $conn->query("INSERT INTO reg_uspj (asociadoa, nombre, raza, clase, nivel)
                       VALUES ('$a', '$n', '$r', '$c', $lv)");

        echo json_encode(['success' => true, 'id' => $newId]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Could not create character']);
    }
    exit;
}

// ─── UPDATE ──────────────────────────────────────────
if ($method === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input || empty($input['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Character id is required']);
        exit;
    }

    $id = (int)$input['id'];
    $n  = $conn->real_escape_string($input['nombre'] ?? '');
    $r  = $conn->real_escape_string($input['raza'] ?? '');
    $c  = $conn->real_escape_string($input['clase'] ?? '');
    $ac = (int)($input['armorClass'] ?? 0);
    $lv = (int)($input['nivel'] ?? 1);
    $hp = (int)($input['hitPoints'] ?? 0);
    $hd = $conn->real_escape_string($input['hitDice'] ?? '');
    $sp = (int)($input['speed'] ?? 30);
    $spl = $conn->real_escape_string($input['spells'] ?? '');
    $inv = $conn->real_escape_string($input['invent'] ?? '');

    $sql = "UPDATE tabla_pj SET
                nombre = '$n', raza = '$r', clase = '$c',
                armorClass = $ac, nivel = $lv, hitPoints = $hp,
                hitDice = '$hd', speed = $sp, spells = '$spl', invent = '$inv'
            WHERE id = $id";

    if ($conn->query($sql)) {
        // Update log
        $conn->query("UPDATE reg_uspj SET nombre = '$n', raza = '$r', clase = '$c', nivel = $lv WHERE id = $id");
        echo json_encode(['success' => true]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Could not update character']);
    }
    exit;
}

// ─── DELETE ──────────────────────────────────────────
if ($method === 'DELETE') {
    $id = (int)($_GET['id'] ?? 0);
    if ($id === 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Character id is required']);
        exit;
    }

    if ($conn->query("DELETE FROM tabla_pj WHERE id = $id")) {
        echo json_encode(['success' => true]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Could not delete character']);
    }
    exit;
}

// ─── UNSUPPORTED ────────────────────────────────────
http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
