<?php

$data= json_decode(file_get_contents('php://input'),true);
$connect_string='host=localhost'.
                ' port=5432'.
                ' dbname=GIS-NGTU'.
                ' user='.$data['user']['login'].
                ' password='.$data['user']['password'].'';
$db=pg_connect($connect_string) or die('connection failed');

if($db!==false){
    $result=pg_fetch_all(pg_query($db,'SELECT column_name FROM information_schema.columns WHERE table_schema=\'public\' AND table_name=\''.$data['table_name'].'\''));
    exit(json_encode($result));
}

?>

