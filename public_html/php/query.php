<?php

include 'connection.php';

$data= json_decode(file_get_contents('php://input'),true);
$connect_string='host='.$host.
                ' port='.$port.
                ' dbname='.$dbname.
                ' user='.$data['login'].
                ' password='.$data['password'].'';
$db=pg_connect($connect_string) or die('connection failed');

if($db!==false){
    $result=pg_fetch_all(pg_query($db,$data['string']));
    if($result==false)
        exit($false);
    else{
        exit(json_encode($result));
    }
}

?>

