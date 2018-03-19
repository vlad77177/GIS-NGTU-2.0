<?php

include 'connection.php';

$data= json_decode(file_get_contents('php://input'),true);
$connect_string='host='.$host.
                ' port='.$port.
                ' dbname='.$dbname.
                ' user='.$data['user']['login'].
                ' password='.$data['user']['password'].'';
$db=pg_connect($connect_string) or die('connection failed');

if($db!==false){
    //$result=pg_fetch_all(pg_query($db,'SELECT column_name FROM information_schema.columns WHERE table_schema=\'public\' AND table_name=\''.$data['tablename'].'\''));
    $result=pg_fetch_all(pg_query($db,'SELECT pg_attribute.attname AS column_name FROM pg_attribute,pg_class WHERE pg_class.relname=\''.$data['tablename'].'\' AND pg_class.relfilenode=pg_attribute.attrelid AND pg_attribute.attnum>0'));
    if($result!==false){
        exit(json_encode($result));
    }
    else {
        exit(false);
    }
}

?>

