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
    $result=pg_fetch_all(pg_query($db,'SELECT relname,relacl FROM pg_class '.
            'JOIN pg_namespace ON pg_class.relnamespace=pg_namespace.oid '.
            'JOIN pg_tables ON pg_class.relname=pg_tables.tablename '.
            'WHERE pg_namespace.nspname=\'public\''));
    exit(json_encode($result));
}

?>
