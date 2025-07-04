<?php
// 	|-------------------------------------------|
// 	|                      						|
//  |          Created by @MinKhoy				|
// 	|											|
// 	|-------------------------------------------|



// Get the request URI without the base directory
$uri = $_SERVER['REQUEST_URI'];

// Read the json body data
$json = file_get_contents('php://input');
$rawData = json_decode($json, true);

if(isset($rawData["sub"])){
	try {
		$whitelist_number = range(1,2000);
		$whitelist_sub = array("+","-","*","/");

		$num1 = $rawData["num1"];
		$num2 = $rawData['num2'];
		$sub = $rawData['sub'];

		if (in_array($num1, $whitelist_number) && in_array($num2, $whitelist_number) && in_array($sub, $whitelist_sub)) {
			$cal = "$num1 $sub $num2";
			$evalCal = "return $cal;";	

			// Add try catch to handle error
			try {
				ob_start();
				$result = eval($evalCal);
				$output = ob_get_clean();
			} catch(Error $e) {
				$response_data = array(
					'code' => 98,
					'status' => 'Something went wrong: ' . $e->getMessage() . ", traceID: " . md5(time()-rand(10,20)) . ". " . $e->getTraceAsString(),
					'result' => $result
				);
				header('Content-Type: application/json');
				die(json_encode($response_data));
			}
				
			// echo "[+] DEBUG: " . $result;
			// Handle Response
			if(isset($output)){
				$response_data = array(
					'code' => 200,
					'status' => 'success',
					'result' => $result.$output
				);
			} else {
				$response_data = array(
					'code' => 200,
					'status' => 'success',
					'result' => $result
				);
			}
			// Setup Content type header for response
			header('Content-Type: application/json');
			die(json_encode($response_data));
		} else {

			$result = "Number or operators not supported";
			$response_data = array(
				'code' => 99,
				'status' => 'Some thing went wrong: Number or operators not supported, traceID: ' . md5(time()),
				'message' => $result
			);

			// Setup Content type header for response
			header('Content-Type: application/json');
			die(json_encode($response_data));
		}
	} catch(Exception $e) {
		echo "Something went wrong";
		echo "Error: " . $e->getMessage();
	}
}
// include "./static/index.html";
?>