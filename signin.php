<?php

header("Content-Type: application/json; charset=UTF-8");

require_once "connect.php";

$connect = @new mysqli($hostname, $db_username, $db_password, $db_name);

if ($connect->connect_errno){
    
    $error = array();
    $error[0] = array(0, $connect->connect_errno, "");
    
    echo json_encode($error);

} else {
    
    if (isset($_POST['username']) && isset($_POST['password'])){
        
        $username = $_POST['username'];
        $password = $_POST['password'];
        
        $username = trim($username);
        $password = trim($password);
        
        $username = htmlentities($username, ENT_QUOTES, "UTF-8");
    
        if ($result = $connect->query(
            sprintf("SELECT id, username, password FROM users WHERE username='%s'",
            mysqli_real_escape_string($connect, $username)))){
            
            if ($result->num_rows){
        
                $data = array();
    
                while ($row = $result->fetch_row()){

                    $data[] = $row;
                }
                
                if (password_verify($password, $data[0][2])){
                
                    echo json_encode($data);
                    
                } else {
                
                    $error = array();
                    $error[0] = array(0, "incorrect", "");

                    echo json_encode($error);
                }
                
                $result->free_result();
                
            } else {
                
                $error = array();
                $error[0] = array(0, "incorrect", "");
        
                echo json_encode($error);
            }
        }
    } else header("Location: to-do_list.php");
    
    $connect->close();
}

?>
