<?php

ini_set('display_errors', 1);
$root = dirname(__DIR__);

require('twitterAPI.php');

// $json = json_decode(file_get_contents('php://input'), true);

$service = new twitterAPI();
$service->request();
$output = $service->prepare_output_data();

ob_start('ob_gzhandler');
header('Content-type: application/json');

echo json_encode($output, true);
$buffer = ob_get_contents();
ob_end_clean();
echo $buffer;

exit();

?>
