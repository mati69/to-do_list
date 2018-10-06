<?php

header("Content-Type: application/json; charset=UTF-8");

if (isset($_POST['recaptcha'])){

    $recaptcha = $_POST['recaptcha'];

    $secret = "6LdlsE8UAAAAAPY53275Rn4gZlNgEL5r1niNqJDF";

    $response = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret=".$secret."&response=".$recaptcha);

    $result = json_decode($response);

    if ($result->success == true){

            $data = array();
            $data[0] = array(0, "correct");

            echo json_encode($data);

    } else {

            $error = array();
            $error[0] = array(0, "incorrect");

            echo json_encode($error);
    }
} else header("Location: to-do_list.html");

?>
