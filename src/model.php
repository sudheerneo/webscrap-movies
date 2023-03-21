<?php
function get_web_page($url)
{
    $user_agent =
        "Mozilla/5.0 (Windows NT 6.1; rv:8.0) Gecko/20100101 Firefox/8.0";

    $options = [
        CURLOPT_CUSTOMREQUEST => "GET",
        CURLOPT_USERAGENT => $user_agent,
        CURLOPT_COOKIEFILE => "cookie.txt",
        CURLOPT_COOKIEJAR => "cookie.txt",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_ENCODING => "",
        CURLOPT_AUTOREFERER => true,
        CURLOPT_CONNECTTIMEOUT => 120,
        CURLOPT_TIMEOUT => 120,
        CURLOPT_MAXREDIRS => 10,
    ];

    $ch = curl_init($url);
    curl_setopt_array($ch, $options);

    $content = curl_exec($ch);
    if ($content === false) {
        echo "Error: " . curl_error($ch);
        return false;
    }

    $err = curl_errno($ch);
    curl_reset($ch);

    $header["errno"] = $err;
    $header["content"] = $content;

    return $header;
}

// ENV FILE GRABBER
$dotenvPath = __DIR__ . '/../.env'; // define the path to your .env file
$dotenv = parse_ini_file($dotenvPath);

foreach ($dotenv as $key => $value) {
    $_ENV[$key] = $value;
}
$SOURCEDOMAIN = $_ENV['SOURCEDOMAIN'];

$url = $SOURCEDOMAIN;
$result = get_web_page($url);

if ($result === false) {
    echo "Error: failed to fetch URL";
} elseif ($result["errno"] != 0) {
    echo "Error: bad URL, timeout, redirect loop";
} else {
    $page = $result["content"];
    // find_links($page);
    echo $page;
}
