<?php
  $filename = "./data/test.json";
  // $handle = fopen($filename, 'r') or die("File does not exist.");
  // $text = fread($handle, filesize($filename));
  // fclose($handle);
  $text = file_get_contents($filename);
  // echo $text;
  $json = json_decode($text);
  // echo json_encode($json);
  echo $text;
?>
