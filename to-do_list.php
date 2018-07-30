<!DOCTYPE html>
<html lang="pl">

<?php

require_once "connect.php";

$connect = @new mysqli($hostname, $db_username, $db_password, $db_name);

if ($connect->connect_errno){
    
    echo "Connection error with the database: ".$connect->connect_errno;
} else {
    
    $connect->close();
}

?>

    <head>
        <meta charset="UTF-8">
        <title>TO-DO List</title>

        <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">

        <link href="https://fonts.googleapis.com/css?family=Saira+Condensed:400,700&amp;subset=latin-ext" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css?family=Oswald:400,700&amp;subset=latin-ext" rel="stylesheet">

        <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">

        <link rel="stylesheet" href="css/to-do_list.css">
    </head>

    <body>
        <nav class="menu">

            <div id="home">
                <a href="index.html">
                    <i class="fa fa-home" aria-hidden="true"></i>
                </a>
            </div>

            <h2 id="h2MainMenu"></h2>

            <ul id="content">
                <div class="g-recaptcha" data-sitekey="6LdlsE8UAAAAAHo-dBc5L4xZNwu0wf76peN8jLQ4"></div>

                <li id="signIn">Sign in</li>

                <li id="register">Register</li>

                <li id="help">Help</li>

                <li id="about">About</li>

                <li id="signOut">Sign out</li>
            </ul>

        </nav>

        <header>

            <h1></h1>

            <div class="navIcon">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>

            <div id="hide">
                <i class="fa fa-angle-up" aria-hidden="true"></i>
            </div>

        </header>

        <main>

            <ul id="left"></ul>

            <ul id="tasks"></ul>

            <ul id="right"></ul>

            <div id="add">
                <i class="fa fa-plus" aria-hidden="true"></i>
            </div>

        </main>

        <footer>

            <h3>Copyright (C) 2018 by Mateusz Szul</h3>

        </footer>

        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>

        <script src='https://www.google.com/recaptcha/api.js'></script>

        <script src="js/to-do_list.js"></script>
    </body>

</html>
