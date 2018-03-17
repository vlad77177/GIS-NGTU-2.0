<?php

session_start();

$user='';

if(isset($_SESSION['login']) and isset($_SESSION['password'])){
    $user['login']=$_SESSION['login'];
    $user['password']=$_SESSION['password'];
    
    exit(json_encode($user));
}
else{
    $user['login']=null;
    $user['password']=null;
    exit(json_encode($user));
}

?>

