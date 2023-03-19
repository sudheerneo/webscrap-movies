<?php
if (!isset($_GET['url']) || !isset($_GET['title'])) {
    die('Error: URL or title parameter not set');
}

$file_url = urldecode($_GET['url']);
$outputFile = urldecode($_GET['title']);

// Initialize curl session
$ch = curl_init();

// Set curl options
curl_setopt($ch, CURLOPT_URL, $file_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

// Execute curl session
$response = curl_exec($ch);

// Check if curl request was successful
if ($response === false) {
    die('Error: Failed to download file ');
}

// Extract content type and content disposition from response headers
$content_type = '';
$content_disposition = '';
$headers = explode("\r\n", $response);
foreach ($headers as $header) {
    if (strpos($header, 'Content-Type: ') !== false) {
        $content_type = str_replace('Content-Type: ', '', $header);
    } elseif (strpos($header, 'Content-Disposition: ') !== false) {
        $content_disposition = str_replace('Content-Disposition: ', '', $header);
    }
}

// Set content type and content disposition headers
header('Content-Type: ' . $content_type);
header('Content-Disposition: attachment; filename="' . $outputFile . '"');

// Output content to browser
echo $response;

// Close curl session
curl_close($ch);

?>
