<?php

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // collect value of input field
    $moviedata = file_get_contents("php://input");

    if (!isset($moviedata) || empty($moviedata)) {
        echo "no corresponding data received";
    } else {
        //Write data to file
        if (file_put_contents(__DIR__ . '/showcaselocal.json', $moviedata) === false) {
            echo "error writing data to file";
        } else {
            echo "data written to file";
        }
    }
}
