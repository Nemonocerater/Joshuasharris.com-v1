<?php

$email = $_POST['email'];
$message= $_POST['message'];

mail("joshua40harris@gmail.com", "TRD_Feedback", "Email: $email\nComment: $message", "From: joshua40harris@gmail.com");

?>