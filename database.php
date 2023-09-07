<?php


$connection = mysqli_connect("localhost", "root", "rootpassword", "rallyup_users");

if(!$connection)
    die("Could not connect".mysqli_connect_error());
else
    echo "Connection Established"


?>