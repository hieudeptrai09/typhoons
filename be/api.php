<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once 'config.php';
require_once 'controllers/StormController.php';
require_once 'controllers/TyphoonNameController.php';
require_once 'controllers/SuggestedNameController.php';

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
            'GET /storms?position={id}' => 'Get storms by position',
            'GET /typhoon-names' => 'Get all typhoon names',
            'GET /typhoon-names?isRetired={0|1}' => 'Get typhoon names by retirement status',
            'GET /suggested-names' => 'Get all suggested names',
            'GET /suggested-names?nameId={id}' => 'Get suggested names by nameId'
        ]
    ]);
}

$resource = $request[0];

try {
    switch ($resource) {
        case 'storms':
            $controller = new StormController($db);
            if ($method === 'GET') {
                $position = isset($_GET['position']) ? intval($_GET['position']) : null;
                $result = $controller->getStorms($position);
                sendResponse(200, $result);
            } else {
                sendResponse(405, ['error' => 'Method not allowed']);
            }
            break;

        case 'typhoon-names':
            $controller = new TyphoonNameController($db);
            if ($method === 'GET') {
                $isRetired = isset($_GET['isRetired']) ? intval($_GET['isRetired']) : null;
                $result = $controller->getTyphoonNames($isRetired);
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

        default:
            sendResponse(404, ['error' => 'Endpoint not found']);
    }
} catch (Exception $e) {
    sendResponse(500, ['error' => 'Internal server error', 'message' => $e->getMessage()]);
}
