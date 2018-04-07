<?php

session_start();

include 'connection.php';

$user= json_decode(file_get_contents('php://input'),true);
$connect_string='host='.$host.
                ' port='.$port.
                ' dbname='.$dbname.
                ' user='.$user['login'].
                ' password='.$user['password'].'';
$db=pg_connect($connect_string) or die('connection failed');

if($db!==false){

    $_SESSION['login']=$user['login'];
    $_SESSION['password']=$user['password'];

}

exit(true);

?>

