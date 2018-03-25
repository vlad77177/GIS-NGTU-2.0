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
    /*
    $result=pg_fetch_all(pg_query($db,'SELECT * FROM (SELECT *,pg_attribute.attname AS column_name,pg_class.oid AS classoid FROM pg_attribute,pg_class,pg_type WHERE pg_class.relname=\''.$data['tablename'].'\' AND pg_class.relfilenode=pg_attribute.attrelid AND pg_attribute.attnum>0 AND pg_attribute.atttypid=pg_type.oid) AS f'.
            ' LEFT OUTER JOIN pg_constraint ON pg_constraint.conindid=f.classoid'));
    
    */ 
    $result=pg_fetch_all(pg_query($db,'SELECT *,pg_attribute.attname AS column_name,pg_class.oid FROM pg_attribute,pg_class,pg_type WHERE pg_class.relname=\''.$data['tablename'].'\' AND pg_class.relfilenode=pg_attribute.attrelid AND pg_attribute.attnum>0 AND pg_attribute.atttypid=pg_type.oid'));
    
     if($result!==false){
        exit(json_encode($result));
    }
    else {
        exit(false);
    }
}

?>

