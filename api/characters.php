<?php
/**
 * Characters API - CRUD operations
 *
 * GET    /api/characters.php?user=nick   → list characters for a user (requires auth)
 * GET    /api/characters.php?all=1       → list ALL characters (admin only)
 * POST   /api/characters.php             → create character
 * PUT    /api/characters.php             → update character
 * DELETE /api/characters.php?id=N        → delete character
 */

require_once __DIR__ . '/auth_middleware.php';

$method = $_SERVER['REQUEST_METHOD'];

// ─── READ ─────────────────────────────────────────────
if ($method === 'GET') {
    if (isset($_GET['all'])) {
        require_admin();
        $result = $conn->query("SELECT * FROM tabla_pj ORDER BY asociadoa, nombre");
    } elseif (!empty($_GET['user'])) {
        require_auth();
        $user = $conn->real_escape_string($_GET['user']);
        $stmt = $conn->prepare("SELECT * FROM tabla_pj WHERE asociadoa = ? ORDER BY nombre");
        $stmt->bind_param("s", $user);
        $stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();
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
    require_auth();

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
    $sr = $conn->real_escape_string($input['subraza'] ?? '');
    $ac = (int)($input['armorClass'] ?? 0);
    $lv = (int)($input['nivel'] ?? 1);
    $hp = (int)($input['hitPoints'] ?? 0);
    $hd = $conn->real_escape_string($input['hitDice'] ?? '');
    $sp = (int)($input['speed'] ?? 30);
    $spl = $conn->real_escape_string($input['spells'] ?? '');
    $inv = $conn->real_escape_string($input['invent'] ?? '');
    $tf = $conn->real_escape_string($input['trasfondo'] ?? '');
    $al = $conn->real_escape_string($input['alineamiento'] ?? '');
    $co = $conn->real_escape_string($input['competencias'] ?? '');
    $mo = (int)($input['monedas_oro'] ?? 0);
    $ar = $conn->real_escape_string($input['arma'] ?? '');
    $am = $conn->real_escape_string($input['armadura'] ?? '');
    $xp = (int)($input['xp'] ?? 0);
    $cl = $conn->real_escape_string(json_encode($input['classList'] ?? []));
    $fu = (int)($input['fuerza'] ?? 10);
    $de = (int)($input['destreza'] ?? 10);
    $co2 = (int)($input['constitucion'] ?? 10);
    $in = (int)($input['inteligencia'] ?? 10);
    $sa = (int)($input['sabiduria'] ?? 10);
    $ca = (int)($input['carisma'] ?? 10);

    $stmt = $conn->prepare("INSERT INTO tabla_pj (asociadoa, nombre, raza, subraza, clase, armorClass, nivel, hitPoints, hitDice, speed, spells, invent, trasfondo, alineamiento, competencias, monedas_oro, arma, armadura, xp, classList, fuerza, destreza, constitucion, inteligencia, sabiduria, carisma) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssssiiisissssissssiiiiii", $a, $n, $r, $sr, $c, $ac, $lv, $hp, $hd, $sp, $spl, $inv, $tf, $al, $co, $mo, $ar, $am, $xp, $cl, $fu, $de, $co2, $in, $sa, $ca);

    if ($stmt->execute()) {
        $newId = $stmt->insert_id;
        $conn->query("INSERT INTO reg_uspj (asociadoa, nombre, raza, clase, nivel) VALUES ('$a', '$n', '$r', '$c', $lv)");
        echo json_encode(['success' => true, 'id' => $newId]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Could not create character']);
    }
    $stmt->close();
    exit;
}

// ─── UPDATE ──────────────────────────────────────────
if ($method === 'PUT') {
    require_auth();

    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input || empty($input['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Character id is required']);
        exit;
    }

    $id = (int)$input['id'];
    $n  = $conn->real_escape_string($input['nombre'] ?? '');
    $r  = $conn->real_escape_string($input['raza'] ?? '');
    $sr = $conn->real_escape_string($input['subraza'] ?? '');
    $c  = $conn->real_escape_string($input['clase'] ?? '');
    $ac = (int)($input['armorClass'] ?? 0);
    $lv = (int)($input['nivel'] ?? 1);
    $hp = (int)($input['hitPoints'] ?? 0);
    $hd = $conn->real_escape_string($input['hitDice'] ?? '');
    $sp = (int)($input['speed'] ?? 30);
    $spl = $conn->real_escape_string($input['spells'] ?? '');
    $inv = $conn->real_escape_string($input['invent'] ?? '');
    $tf = $conn->real_escape_string($input['trasfondo'] ?? '');
    $al = $conn->real_escape_string($input['alineamiento'] ?? '');
    $co = $conn->real_escape_string($input['competencias'] ?? '');
    $mo = (int)($input['monedas_oro'] ?? 0);
    $ar = $conn->real_escape_string($input['arma'] ?? '');
    $am = $conn->real_escape_string($input['armadura'] ?? '');
    $xp = (int)($input['xp'] ?? 0);
    $cl = $conn->real_escape_string(json_encode($input['classList'] ?? []));
    $fu = (int)($input['fuerza'] ?? 10);
    $de = (int)($input['destreza'] ?? 10);
    $co2 = (int)($input['constitucion'] ?? 10);
    $in2 = (int)($input['inteligencia'] ?? 10);
    $sa = (int)($input['sabiduria'] ?? 10);
    $ca = (int)($input['carisma'] ?? 10);

    $stmt = $conn->prepare("UPDATE tabla_pj SET nombre=?, raza=?, subraza=?, clase=?, armorClass=?, nivel=?, hitPoints=?, hitDice=?, speed=?, spells=?, invent=?, trasfondo=?, alineamiento=?, competencias=?, monedas_oro=?, arma=?, armadura=?, xp=?, classList=?, fuerza=?, destreza=?, constitucion=?, inteligencia=?, sabiduria=?, carisma=? WHERE id=?");
    $stmt->bind_param("ssssiiisissssissssiiiiiisi", $n, $r, $sr, $c, $ac, $lv, $hp, $hd, $sp, $spl, $inv, $tf, $al, $co, $mo, $ar, $am, $xp, $cl, $fu, $de, $co2, $in2, $sa, $ca, $id);

    if ($stmt->execute()) {
        $conn->query("UPDATE reg_uspj SET nombre='$n', raza='$r', clase='$c', nivel=$lv WHERE id=$id");
        echo json_encode(['success' => true]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Could not update character']);
    }
    $stmt->close();
    exit;
}

// ─── DELETE ──────────────────────────────────────────
if ($method === 'DELETE') {
    require_auth();

    $id = (int)($_GET['id'] ?? 0);
    if ($id === 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Character id is required']);
        exit;
    }

    $stmt = $conn->prepare("DELETE FROM tabla_pj WHERE id = ?");
    $stmt->bind_param("i", $id);
    if ($stmt->execute()) {
        $conn->query("DELETE FROM reg_uspj WHERE id = $id");
        echo json_encode(['success' => true]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Could not delete character']);
    }
    $stmt->close();
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
