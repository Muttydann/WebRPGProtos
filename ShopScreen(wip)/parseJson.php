<?php
//This script is used to parse items.json and return an array of lists, each containing the items in that list. The lists are returned as an array of objects, each containing the name of the list and an array of items in that list.
$result = [];
$data = json_decode(file_get_contents("items.json"), true);

foreach ($data["Lists"] as $list) {
    $result[] = [
        "name" => $list["name"],
        "items" => $list["items"] ?? []
    ];
}

echo json_encode($result, JSON_PRETTY_PRINT);
?>