<?php
ini_set('display_errors', 0);
error_reporting(0);


if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Collect value of input field
    $url = json_decode(file_get_contents("php://input"));

    if (empty($url)) {
        echo "Name is empty";
        return;
    }

    // Read a web page and check for errors
    $result = @get_web_page($url);

    if (!$result || $result["errno"] != 0 || $result["http_code"] != 200) {
        echo "Error: Failed to fetch web page";
        return;
    }

    // Process the data
    processData($result["content"], $url);
}


function processData($res, $url)
{
    $doc = new DOMDocument();
    @$doc->loadHTML($res);

    $xpath = new DOMXpath($doc);

    // Finding links using torrents
    $torrlinksDom = $xpath->query('//a[@data-fileext="torrent"]');
    $torrData = [];

    if ($torrlinksDom->item(0) === null) {
        $result = [
            "torrlinks" => null
        ];

        echo json_encode($result);
    } else {
        foreach ($torrlinksDom as $ad) {
            // Get ad URL
            $ad_url = $ad->getAttribute("href");

            // Set current ad object as new DOMDocument object so we can parse it
            $ad_Doc = new DOMDocument();
            $cloned = $ad->cloneNode(true);
            $ad_Doc->appendChild($ad_Doc->importNode($cloned, true));
            $ypath = new DOMXPath($ad_Doc);

            // Get ad title
            $ad_title_tag = $ypath->query("//span");
            $ad_title = trim($ad_title_tag->item(0)->nodeValue);
            $torrData[] = [
                "torrName" => substr(strstr($ad_title, "- "), 2),
                "downlink" => $ad_url,
            ];
        }

        // Finding magnet links
        $magLinks = [];
        foreach ($xpath->query('//a[starts-with(@href, "magnet")]/@href') as $torrLink) {
            $magLinks[] = $torrLink->nodeValue;
        }

        // Finding images
        $imgLinks = [];
        foreach ($xpath->query('//div[@class="ipsType_normal ipsType_richText ipsPadding_bottom ipsContained"]/p/a/img/@src') as $imgLink) {
            $a = $imgLink->nodeValue;
            if (!strpos($a, "magnet") && !strpos($a, "megaphone") && !strpos($a, "gif") && !strpos($a, "uTorrent")) {
                $imgLinks[] = $a;
            }
        }

        if (empty($imgLinks)) {
            $thumbsLinks = [];
            foreach ($xpath->query('//img[@class="ipsImage_thumbnailed"]/@src') as $thumbLink) {
                $a = $thumbLink->nodeValue;
                if (!strpos($a, "magnet") && !strpos($a, "megaphone") && !strpos($a, "gif") && !strpos($a, "uTorrent")) {
                    $thumbsLinks[] = $a;
                }
            }
            $imgLinks = $thumbsLinks;
        }

        $result = [
            "url" => ($url === null || !isset($url) ? "default" : $url),
            "title" => (empty($torrData) ? "default" : strstr($torrData[0]['torrName'], '.torrent', true)),
            "thumbnail" => (empty($imgLinks) ? "default" : $imgLinks),
            "torrlinks" => (empty($torrData) ? "default" : $torrData),
            "magLinks" => (empty($magLinks) ? "default" : $magLinks),
        ];

        echo json_encode($result);
    }
}


function get_web_page($url, $ch = null)
{
    $user_agent =
        "Mozilla/5.0 (Windows NT 6.1; rv:8.0) Gecko/20100101 Firefox/8.0";

    $options = [
        CURLOPT_URL => $url,
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

    if ($ch === null) {
        $ch = curl_init();
    }

    curl_setopt_array($ch, $options);

    // Discard headers
    curl_setopt($ch, CURLOPT_HEADERFUNCTION, function ($ch, $header) {
        return strlen($header);
    });

    $content = curl_exec($ch);
    $err = curl_errno($ch);
    $errmsg = curl_error($ch);
    curl_setopt($ch, CURLOPT_HEADERFUNCTION, null);
    $header = curl_getinfo($ch);
    $header["errno"] = $err;
    $header["errmsg"] = $errmsg;
    $header["content"] = $content;

    return $header;
}
