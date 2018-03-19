<?php

include 'connection.php';

$user= json_decode(file_get_contents('php://input'),true);
$connect_string='host='.$host.
                ' port='.$port.
                ' dbname='.$dbname.
                ' user='.$user['login'].
                ' password='.$user['password'].'';
$db=pg_connect($connect_string) or die('connection failed');

if($db!==false){
    $result=pg_fetch_all(pg_query($db,'SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname=\'public\''));
    if($result!==null){
        exit(json_encode($result));
    }
    else{
        exit(false);
    }
}

?>

