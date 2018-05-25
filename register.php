<?php

header("Content-Type: application/json; charset=UTF-8");

require_once "connect.php";

$connect = @new mysqli($hostname, $db_username, $db_password, $db_name);

if ($connect->connect_errno){
    
    $error = array();
    $error[0] = array(0, $connect->connect_errno);
    
    echo json_encode($error);

} else {
    
    if (isset($_POST['username']) && isset($_POST['password'])){
        
        $username = $_POST['username'];
        $password = $_POST['password'];

        $username = trim($username);
        $password = trim($password);
        
        $username = htmlentities($username, ENT_QUOTES, "UTF-8");
        $password = htmlentities($password, ENT_QUOTES, "UTF-8");
    
        $regUsername = "/^[a-zA-Z0-9]{3,20}$/";
        $regPassword = "/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{8,20}$/";
        
        if (preg_match($regUsername, $username) && preg_match($regPassword, $password)){
            
            if ($results = $connect->query(
                sprintf("SELECT id FROM users WHERE username='%s'",
                mysqli_real_escape_string($connect, $username)))){

                if ($results->num_rows){

                    $error = array();
                    $error[0] = array(0, "exists");

                    echo json_encode($error);

                    $results->free_result();

                } else {
                    
                    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

                    if ($result = $connect->query(
                        sprintf("INSERT INTO users VALUES (NULL, '%s', '$passwordHash')",
                        mysqli_real_escape_string($connect, $username)))){

                        $data = array();
                        $data[0] = array(0, "success");

                        echo json_encode($data);

                    } else {

                            $error = array();
                            $error[0] = array(0, "failure");

                            echo json_encode($error);
                    }
                }

            }
            
        }
        
    } else header("Location: to-do_list.php");
    
    $connect->close();
}

?>
