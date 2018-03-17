<?php

session_start();

$user= json_decode(file_get_contents('php://input'),true);
$connect_string='host=localhost'.
                ' port=5432'.
                ' dbname=GIS-NGTU'.
                ' user='.$user['login'].
                ' password='.$user['password'].'';
$db=pg_connect($connect_string) or die('connection failed');

if($db!==false){

    $_SESSION['login']=$user['login'];
    $_SESSION['password']=$user['password'];

}

exit(true);

?>

