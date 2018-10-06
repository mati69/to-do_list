<?php

header("Content-Type: application/json; charset=UTF-8");

require_once "connect.php";

class Lists implements JsonSerializable{
    
    private $id;
    private $userId;
    private $name;

    public function __construct($id, $userId, $name){
        
        $this->id = $id;
        $this->userId = $userId;
        $this->name = $name;
    }
    
    public function jsonSerialize(){
        
        return [
            "id" => $this->id,
            "userId" => $this->userId,
            "name" => $this->name
        ];
    }
}

class Tasks implements JsonSerializable{
    
    private $id;
    private $listId;
    private $name;
    private $done;

    public function __construct($id, $listId, $name, $done){
        
        $this->id = $id;
        $this->listId = $listId;
        $this->name = $name;
        $this->done = $done;
    }
    
    public function jsonSerialize(){
        
        return [
            "id" => $this->id,
            "listId" => $this->listId,
            "name" => $this->name,
            "done" => $this->done
        ];
    }
}

if (isset($_POST['username']) && isset($_POST['password']) && isset($_POST['type'])
        && isset($_POST['action']) && isset($_POST['id']) && isset($_POST['listId']) && isset($_POST['content'])){
    
    $connect = @new mysqli($hostname, $db_username, $db_password, $db_name);

    if ($connect->connect_errno == 0){
    
        mysqli_set_charset ($connect, "utf8");
    
        $username = $_POST['username'];
        $password = $_POST['password'];
        $type = $_POST['type'];
        $action = $_POST['action'];
        $id = $_POST['id'];
        $listId = $_POST['listId'];
        $content = $_POST['content'];
        
        $username = trim($username);
        $id = trim($id);
        $listId = trim($listId);
        $content = trim($content);
        
        if ($username != "" && $password != ""){
        
            $username = htmlentities($username, ENT_QUOTES, "UTF-8");

            if ($results = $connect->query(
                sprintf("SELECT id, username, password FROM users WHERE username='%s'",
                mysqli_real_escape_string($connect, $username)))){

                if ($results->num_rows){

                    $data = array();

                    while ($row = $results->fetch_row()){

                        $data[] = $row;
                    }

                    if ($data[0][2] == $password){

                        $userId = $data[0][0];

                        if ($type == "lists" && $action == "select"){

                            if ($listsResult = $connect->query("SELECT id, userId, name FROM lists WHERE userId='$userId'")){

                                if ($listsResult->num_rows){

                                    $lists = array();

                                    while ($row = $listsResult->fetch_row()){

                                        $lists[] = new Lists($row[0], $row[1], $row[2]);
                                    }

                                    echo json_encode($lists);

                                    $listsResult->free_result();

                                } else {

                                    $error = array();
                                    $error[0] = array(0);

                                    echo json_encode($error);
                                }
                            }
                        }

                        if ($type == "lists" && $action == "insert" && $content != ""){

                            if ($result = $connect->query(
                                sprintf("INSERT INTO lists VALUES (NULL, '$userId', '%s')",
                                mysqli_real_escape_string($connect, $content)))) {

                                if ($listsResult = $connect->query("SELECT id, userId, name FROM lists WHERE userId='$userId'")){

                                    if ($listsResult->num_rows){

                                        $lists = array();

                                        while ($row = $listsResult->fetch_row()){

                                            $lists[] = new Lists($row[0], $row[1], $row[2]);
                                        }

                                        echo json_encode($lists);

                                        $listsResult->free_result();

                                    }
                                }
                            }
                        }

                        if ($type == "tasks" && $action == "select"){

                            if ($tasksResult = $connect->query("SELECT tasks.id, tasks.listId, tasks.name, tasks.done 
                            FROM tasks INNER JOIN lists ON tasks.listId=lists.id WHERE lists.userId='$userId'")){

                                if ($tasksResult->num_rows){

                                    $tasks = array();

                                    while ($row = $tasksResult->fetch_row()){

                                        $tasks[] = new Tasks($row[0], $row[1], $row[2], $row[3]);
                                    }

                                    echo json_encode($tasks);

                                    $tasksResult->free_result();

                                } else {

                                    $error = array();
                                    $error[0] = array(0);

                                    echo json_encode($error);
                                }
                            }
                        }

                        if ($type == "tasks" && $action == "insert" && $listId != "" && $content != ""){

                            $listId = htmlentities($listId, ENT_QUOTES, "UTF-8");

                            if ($res = $connect->query(
                                sprintf("SELECT id, userId FROM lists WHERE id='%s'",
                                mysqli_real_escape_string($connect, $listId)))){

                                if ($res->num_rows){

                                    $dat = array();

                                    while ($row = $res->fetch_row()){

                                        $dat[] = $row;
                                    }

                                    if ($dat[0][1] == $userId){

                                        $listId = $dat[0][0];

                                        if ($result = $connect->query(
                                            sprintf("INSERT INTO tasks VALUES (NULL, '$listId', '%s', 'false')",
                                            mysqli_real_escape_string($connect, $content)))) {

                                            if ($tasksResult = $connect->query("SELECT tasks.id, tasks.listId, tasks.name, tasks.done 
                                            FROM tasks INNER JOIN lists ON tasks.listId=lists.id WHERE lists.userId='$userId'")){

                                                if ($tasksResult->num_rows){

                                                    $tasks = array();

                                                    while ($row = $tasksResult->fetch_row()){

                                                        $tasks[] = new Tasks($row[0], $row[1], $row[2], $row[3]);
                                                    }

                                                    echo json_encode($tasks);

                                                    $tasksResult->free_result();

                                                }
                                            }
                                        }
                                    }

                                    $res->free_result();
                                }
                            }
                        }

                        if ($type == "tasks&lists" && $action == "delete" && $listId != ""){

                            $listId = htmlentities($listId, ENT_QUOTES, "UTF-8");

                            if ($res = $connect->query(
                                sprintf("SELECT id, userId FROM lists WHERE id='%s'",
                                mysqli_real_escape_string($connect, $listId)))){

                                if ($res->num_rows){

                                    $dat = array();

                                    while ($row = $res->fetch_row()){

                                        $dat[] = $row;
                                    }

                                    if ($dat[0][1] == $userId){

                                        $listId = $dat[0][0];

                                        if ($result = $connect->query("DELETE FROM tasks WHERE listId='$listId'")){
                                            
                                            if ($r = $connect->query("DELETE FROM lists WHERE id='$listId'")){

                                                if ($tasksResult = $connect->query("SELECT tasks.id, tasks.listId, tasks.name, tasks.done 
                                                FROM tasks INNER JOIN lists ON tasks.listId=lists.id WHERE lists.userId='$userId'")){

                                                    if ($tasksResult->num_rows){

                                                        $tasks = array();

                                                        while ($row = $tasksResult->fetch_row()){

                                                            $tasks[] = new Tasks($row[0], $row[1], $row[2], $row[3]);
                                                        }

                                                        echo json_encode($tasks);

                                                        $tasksResult->free_result();

                                                    } else {

                                                        $error = array();
                                                        $error[0] = array(0);

                                                        echo json_encode($error);
                                                    }
                                                }
                                            }
                                        }
                                    }

                                    $res->free_result();
                                }
                            }                     
                        }
                        
                        if ($type == "tasks" && $action == "delete" && $id != ""){

                            $id = htmlentities($id, ENT_QUOTES, "UTF-8");

                            if ($res = $connect->query(
                                sprintf("SELECT tasks.id, lists.userId FROM tasks INNER JOIN lists ON tasks.listId=lists.id WHERE tasks.id='%s'",
                                mysqli_real_escape_string($connect, $id)))){

                                if ($res->num_rows){

                                    $dat = array();

                                    while ($row = $res->fetch_row()){

                                        $dat[] = $row;
                                    }

                                    if ($dat[0][1] == $userId){

                                        $id = $dat[0][0];

                                        if ($result = $connect->query("DELETE FROM tasks WHERE id='$id'")){
                                            
                                            if ($tasksResult = $connect->query("SELECT tasks.id, tasks.listId, tasks.name, tasks.done 
                                            FROM tasks INNER JOIN lists ON tasks.listId=lists.id WHERE lists.userId='$userId'")){

                                                if ($tasksResult->num_rows){

                                                    $tasks = array();

                                                    while ($row = $tasksResult->fetch_row()){

                                                        $tasks[] = new Tasks($row[0], $row[1], $row[2], $row[3]);
                                                    }

                                                    echo json_encode($tasks);

                                                    $tasksResult->free_result();

                                                } else {

                                                    $error = array();
                                                    $error[0] = array(0);

                                                    echo json_encode($error);
                                                }
                                            }
                                        }
                                    }

                                    $res->free_result();
                                }
                            }                     
                        }
                        
                        if ($type == "tasks" && $action == "update" && $id != ""){

                            $id = htmlentities($id, ENT_QUOTES, "UTF-8");

                            if ($res = $connect->query(
                                sprintf("SELECT tasks.id, lists.userId, tasks.done FROM tasks INNER JOIN lists ON tasks.listId=lists.id WHERE tasks.id='%s'",
                                mysqli_real_escape_string($connect, $id)))){

                                if ($res->num_rows){

                                    $dat = array();

                                    while ($row = $res->fetch_row()){

                                        $dat[] = $row;
                                    }

                                    if ($dat[0][1] == $userId){

                                        $id = $dat[0][0];
                                        if ($dat[0][2] == "false") $done = "true";
                                            else $done = "false";

                                        if ($result = $connect->query("UPDATE tasks SET done='$done' WHERE id='$id'")){
                                            
                                            if ($tasksResult = $connect->query("SELECT tasks.id, tasks.listId, tasks.name, tasks.done 
                                            FROM tasks INNER JOIN lists ON tasks.listId=lists.id WHERE lists.userId='$userId'")){

                                                if ($tasksResult->num_rows){

                                                    $tasks = array();

                                                    while ($row = $tasksResult->fetch_row()){

                                                        $tasks[] = new Tasks($row[0], $row[1], $row[2], $row[3]);
                                                    }

                                                    echo json_encode($tasks);

                                                    $tasksResult->free_result();

                                                }
                                            }
                                        }
                                    }

                                    $res->free_result();
                                }
                            }                     
                        }
                    }

                    $results->free_result();
                }
            }
        }
        
        $connect->close();
    }
    
} else header("Location: to-do_list.html");

?>
