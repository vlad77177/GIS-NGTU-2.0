<?php

$user= json_decode(file_get_contents('php://input'),true);
$connect_string='host=localhost'.
                ' port=5432'.
                ' dbname=GIS-NGTU'.
                ' user='.$user['login'].
                ' password='.$user['password'].'';
$db=pg_connect($connect_string) or die('connection failed');

if($db!==false){
    $result=pg_fetch_all(pg_query($db,'SELECT table_name FROM information_schema.tables WHERE table_schema=\'public\''));
    exit(json_encode($result));
}

?>

