<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once 'config.php';
require_once 'controllers/StormController.php';
require_once 'controllers/TyphoonNameController.php';
require_once 'controllers/SuggestedNameController.php';
require_once 'controllers/SearchController.php';
require_once 'controllers/FactController.php';
require_once 'controllers/PositionController.php';

// Parse the request
$method = $_SERVER['REQUEST_METHOD'];
$request = isset($_SERVER['PATH_INFO']) ? explode('/', trim($_SERVER['PATH_INFO'], '/')) : [];

// Get database connection
$database = new Database();
$db = $database->getConnection();

// Response helper function
function sendResponse($statusCode, $data)
{
    http_response_code($statusCode);
    echo json_encode($data);
    exit;
}

// Route the request
if (empty($request)) {
    sendResponse(200, [
        'message' => 'Typhoon Database API',
        'endpoints' => [
            'GET /storms' => 'Get all storms',
            'GET /typhoon-names' => 'Get all typhoon names',
            'GET /typhoon-names?isRetired={0|1}' => 'Get typhoon names by retirement status',
            'GET /typhoon-names?position={id}' => 'Get storm history (name, position, year) for a naming position',
            'GET /suggested-names' => 'Get all suggested names',
            'GET /suggested-names?nameId={id}' => 'Get suggested names by nameId',
            'GET /search/names' => 'Get all typhoon name strings (for autocomplete and static params)',
            'GET /search?q={query}' => 'Search typhoon names with storm counts',
            'GET /typhoon-names?name={name}' => 'Get full details for a typhoon name (name info + storms)',
            'GET /positions?position={id}' => 'Get full details for a naming position (country + names roster + storms)'
        ]
    ]);
}

$resource = $request[0];

try {
    switch ($resource) {
        case 'storms':
            $controller = new StormController($db);
            if ($method === 'GET') {
                $result = $controller->getStorms();
                sendResponse(200, $result);
            } else {
                sendResponse(405, ['error' => 'Method not allowed']);
            }
            break;

        case 'typhoon-names':
            $controller = new TyphoonNameController($db);
            if ($method === 'GET') {
                if (isset($_GET['name'])) {
                    $result = $controller->getByName(trim($_GET['name']));
                } elseif (isset($_GET['position'])) {
                    $result = $controller->getStormHistory(intval($_GET['position']));
                } else {
                    $isRetired = isset($_GET['isRetired']) ? intval($_GET['isRetired']) : null;
                    $result = $controller->getTyphoonNames($isRetired);
                }
                sendResponse(200, $result);
            } else {
                sendResponse(405, ['error' => 'Method not allowed']);
            }
            break;

        case 'suggested-names':
            $controller = new SuggestedNameController($db);
            if ($method === 'GET') {
                $nameId = isset($_GET['nameId']) ? intval($_GET['nameId']) : null;
                $result = $controller->getSuggestedNames($nameId);
                sendResponse(200, $result);
            } else {
                sendResponse(405, ['error' => 'Method not allowed']);
            }
            break;

        case 'on-this-day':
            $controller = new StormController($db);
            if ($method === 'GET') {
                $day = isset($_GET['day']) ? intval($_GET['day']) : intval(date('j'));
                $month = isset($_GET['month']) ? intval($_GET['month']) : intval(date('n'));
                $result = $controller->getOnThisDay($day, $month);
                sendResponse(200, $result);
            } else {
                sendResponse(405, ['error' => 'Method not allowed']);
            }
            break;

        case 'active-on-this-day':
            $controller = new StormController($db);
            if ($method === 'GET') {
                $day = isset($_GET['day']) ? intval($_GET['day']) : intval(date('j'));
                $month = isset($_GET['month']) ? intval($_GET['month']) : intval(date('n'));
                $result = $controller->getActiveOnThisDay($day, $month);
                sendResponse(200, $result);
            } else {
                sendResponse(405, ['error' => 'Method not allowed']);
            }
            break;

        case 'facts':
            $controller = new FactController($db);
            if ($method === 'GET') {
                $result = $controller->getRandomFact();
                sendResponse(200, $result);
            } else {
                sendResponse(405, ['error' => 'Method not allowed']);
            }
            break;

        case 'positions':
            $controller = new PositionController($db);
            if ($method === 'GET') {
                if (!isset($_GET['position'])) {
                    sendResponse(400, ['error' => 'Missing required parameter: position']);
                } else {
                    $result = $controller->getPositionDetails(intval($_GET['position']));
                    sendResponse(200, $result);
                }
            } else {
                sendResponse(405, ['error' => 'Method not allowed']);
            }
            break;

        case 'search':
            $controller = new SearchController($db);
            if ($method === 'GET') {
                $subResource = $request[1] ?? null;
                if ($subResource === 'names') {
                    $result = $controller->getNameList();
                    sendResponse(200, $result);
                } elseif (isset($_GET['q']) && strlen(trim($_GET['q'])) > 0) {
                    $result = $controller->search(trim($_GET['q']));
                    sendResponse(200, $result);
                } else {
                    sendResponse(400, ['error' => 'Missing required parameter: q']);
                }
            } else {
                sendResponse(405, ['error' => 'Method not allowed']);
            }
            break;

        default:
            sendResponse(404, ['error' => 'Endpoint not found']);
    }
} catch (Exception $e) {
    sendResponse(500, ['error' => 'Internal server error', 'message' => $e->getMessage()]);
}
