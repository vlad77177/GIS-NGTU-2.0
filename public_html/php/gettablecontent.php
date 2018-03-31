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
    $columns='';
    $result='';
    if(count($data['columns'])==0){
        $result=pg_fetch_all(pg_query($db,'SELECT * FROM '.$data['tablename'].''));
    }
    else{
        for($i=0;$i<count($data['columns']);$i++){
            if($i!=0){
                $columns=$columns.',';
            }
            $columns=$columns.$data['columns'][$i];
        }
        $result=pg_fetch_all(pg_query($db,'SELECT '.$columns.' FROM '.$data['tablename'].''));
    }
    if($result!=false){
        exit(json_encode($result));
    }
    else{
        exit(false);
    }
}

?>
