<?php
  $filename = "./data/test1.json";
  $handle = fopen($filename, 'r') or die("File does not exist.");
  $text = fread($handle, filesize($filename));
  fclose($handle);
  echo $text;
  // echo json_encode($text);
?>
