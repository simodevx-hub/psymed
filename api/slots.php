<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

$file = '../data/slots.json';

// Ensure data file exists
if (!file_exists($file)) {
    file_put_contents($file, '[]');
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Return all slots
    readfile($file);
    exit;
}

if ($method === 'POST') {
    require_once 'config.php';
    
    // Check Authorization Header
    $headers = getallheaders();
    $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
    
    if (trim($authHeader) !== 'Bearer ' . API_SECRET) {
        http_response_code(403);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }

    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['action'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Action required']);
        exit;
    }

    $data = json_decode(file_get_contents($file), true);

    if ($input['action'] === 'add') {
        // Add a slot (expecting 'start' and 'end' ISO strings)
        if (!isset($input['start']) || !isset($input['end'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Start and End required']);
            exit;
        }
        
        $newSlot = [
            'id' => uniqid(),
            'start' => $input['start'],
            'end' => $input['end'],
            'status' => 'available'
        ];
        $data[] = $newSlot;
        file_put_contents($file, json_encode($data));
        echo json_encode(['success' => true, 'slot' => $newSlot]);
    }

    elseif ($input['action'] === 'batch_add') {
        if (!isset($input['slots']) || !is_array($input['slots'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Slots array required']);
            exit;
        }

        $newSlots = [];
        foreach ($input['slots'] as $s) {
            $newSlots[] = [
                'id' => uniqid(),
                'start' => $s['start'],
                'end' => $s['end'],
                'status' => 'available'
            ];
        }

        $data = array_merge($data, $newSlots);
        file_put_contents($file, json_encode($data));
        echo json_encode(['success' => true, 'count' => count($newSlots)]);
    } 
    
    elseif ($input['action'] === 'delete') {
        // Remove a slot by ID
        if (!isset($input['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'ID required']);
            exit;
        }
        $data = array_values(array_filter($data, function($slot) use ($input) {
            return $slot['id'] !== $input['id'];
        }));
        file_put_contents($file, json_encode($data));
        echo json_encode(['success' => true]);
    }
    
    elseif ($input['action'] === 'cleanup') {
        // Remove all slots that ended before now
        $now = date('Y-m-d H:i:s');
        $initialCount = count($data);
        
        $data = array_values(array_filter($data, function($slot) use ($now) {
            // Keep slot if end time is in the future
            // converting ISO8601 to timestamp comparison
            return strtotime($slot['end']) > time();
        }));

        $removedCount = $initialCount - count($data);
        file_put_contents($file, json_encode($data));
        echo json_encode(['success' => true, 'removed' => $removedCount]);
    }
    
    exit;
}
?>
