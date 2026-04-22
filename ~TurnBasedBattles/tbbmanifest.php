<?php
$result = [];

foreach (glob("*", GLOB_ONLYDIR) as $dir) {
    foreach (glob("$dir/*.html") as $file) {
        $titlearr = preg_split('/(?=[A-Z]|\()/', basename($dir));
        $title = "";
        foreach ($titlearr as $word) {
            $title .= $word . " ";
        }


        $result[] = [
            "name" => $title,
            "path" => $file,
            "folder" => $dir,
            "thumb" => file_exists("$dir/src/thumb.png") ? "$dir/src/thumb.png" : null,
            "desc" => file_exists("$dir/desc.txt") ? file_get_contents("$dir/desc.txt") : null,
            "createdDate" => date("n/j/Y", filectime($file)),
            "editedDate" => date("n/j/Y", filemtime($file))
        ];

    }
}

header("Content-Type: application/json");
echo json_encode($result, JSON_PRETTY_PRINT);
?>