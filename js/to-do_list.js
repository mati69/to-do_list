// class of objects

const Div = class {

    constructor(type, index, location) {

        this.type = type;
        this.index = index;
        this.location = location;
    };

    create() {

        const newDivElement = document.createElement('div');
        newDivElement.setAttribute("id", this.type + this.index);
        newDivElement.setAttribute("class", this.type);

        if (this.location == 'left') {
            const myLeftLiElement = document.querySelector('#left' + this.index);
            myLeftLiElement.appendChild(newDivElement);

        } else if (this.location == 'right') {
            const myRightLiElement = document.querySelector('#right' + this.index);
            myRightLiElement.appendChild(newDivElement);
        };
    };

};

const Button = class extends Div {

    constructor(type, index, location) {

        super(type, index, location);
    };

    create() {

        super.create();

        const myDivElement = document.querySelector('#' + this.type + this.index);
        myDivElement.addEventListener('click', activateButton);

        const newIElement = document.createElement('i');
        newIElement.setAttribute("aria-hidden", "true");

        myDivElement.appendChild(newIElement);

        myDivElement.style.width = lineHeight * 0.7 + "px";
        myDivElement.style.height = lineHeight * 0.7 + "px";
        myDivElement.style.fontSize = fontSize;
        myDivElement.style.webkitTransform = "translateY(+15%)";
        myDivElement.style.transform = "translateY(+15%)";
        myDivElement.style.backgroundColor = "white";
        myDivElement.style.color = "#547D99";
        myDivElement.style.border = "3px solid white";
        myDivElement.style.borderRadius = "50%";
        myDivElement.style.textAlign = "center";
        myDivElement.style.overflow = "hidden";
        myDivElement.style.position = "absolute";
        myDivElement.style.zIndex = "2";
        myDivElement.style.top = (9 * this.index + 1) + "%";

        $('#' + this.type + this.index).hover(function () {
            $(this).css("background-color", "black");
        }, function () {
            $(this).css("background-color", "white");
        });
        $('#' + this.type + this.index).hover(function () {
            $(this).css("color", "white");
        }, function () {
            $(this).css("color", "#547D99");
        });
        $('#' + this.type + this.index).hover(function () {
            $(this).css("cursor", "pointer");
        }, function () {
            $(this).css("cursor", "auto");
        });

        if (this.type == 'remove') {

            newIElement.setAttribute("class", "fa fa-times");
            myDivElement.style.lineHeight = lineHeight * 0.7 - 7 + "px";
        };

        if (this.type == 'show') {

            newIElement.setAttribute("class", "fa fa-angle-down");
            myDivElement.style.lineHeight = lineHeight * 0.7 + "px";
            myDivElement.style.textShadow = "0 -14px 0 #547D99, 0 -28px 0 #547D99";
            myDivElement.style.webkitTransition = "0.5s ease";
            myDivElement.style.transition = "0.5s ease";

            $('#' + this.type + this.index).hover(function () {
                $(this).css("text-shadow", "0 -14px 0 white, 0 -28px 0 white");
            }, function () {
                $(this).css("text-shadow", "0 -14px 0 #547D99, 0 -28px 0 #547D99");
            });
        };

        if (this.type == 'check') {

            newIElement.setAttribute("class", "fa fa-check");
            myDivElement.style.lineHeight = lineHeight * 0.7 + "px";

            if (tasks[tasksIndexList[this.index]].done == "true") {

                myDivElement.style.backgroundColor = "black";
                myDivElement.style.color = "white";

                $('#' + this.type + this.index).hover(function () {
                    $(this).css("background-color", "white");
                }, function () {
                    $(this).css("background-color", "black");
                });
                $('#' + this.type + this.index).hover(function () {
                    $(this).css("color", "#547D99");
                }, function () {
                    $(this).css("color", "white");
                });
            };
        };

        if (this.location == 'left') {

            myDivElement.style.left = "20%";
            myDivElement.style.webkitTransform = "translateX(-150%)";
            myDivElement.style.transform = "translateX(-150%)";
        };

        if (this.location == 'right') myDivElement.style.right = "7%";
    };
};

const Task = class {

    constructor(id, listId, name) {

        this.id = id;
        this.listId = listId;
        this.name = name;
        this.done = "false";
    };
};

const List = class {

    constructor(id, userId, name) {

        this.id = id;
        this.userId = userId;
        this.name = name;
    };
};

const TextLine = class {

    constructor(name) {

        this.name = name;
    };

    create(index, done) {

        const newH2Element = document.createElement('h2');
        newH2Element.setAttribute("id", "task" + index);
        newH2Element.innerText = this.name;

        const myTasksLiElement = document.querySelector('#lists' + index);
        myTasksLiElement.style.listStyleType = "none";
        myTasksLiElement.appendChild(newH2Element);

        const myH2Element = document.querySelector('#task' + index);
        myH2Element.addEventListener('click', activateTextLine);

        myH2Element.style.height = lineHeight + "px";
        myH2Element.style.lineHeight = lineHeight + "px";
        myH2Element.style.fontSize = fontSize;
        myH2Element.style.fontWeight = "400";
        myH2Element.style.position = "absolute";
        myH2Element.style.top = (9 * index + 1) + "%";
        myH2Element.style.left = "20%";

        if (done == "true") {

            myH2Element.style.textDecoration = "line-through";
        };
    };
};

// global variables

let tasks = [], // JSON join
    lists = [], // JSON join

    tasksIndexList = [],

    left = [],
    right = [];

let viewWidth = 0,
    viewHeight = 0,
    lineHeight = 0,
    contentWidth = "",

    userId = 0, // taken from the database

    listCount = 0,
    taskCount = 0,
    actualList = 0,
    listName = "TO-DO Lists:",

    fontSize = "2.2rem",

    username = '',
    password = '';

// functions

const activateButton = function (event) {

    const index = Number(this.id.charAt(this.id.length - 1));

    if (this.className == 'remove' && actualList == 0) {

        if (userId == 0) {

            left.splice(index, 1);
            right.splice(index, 1);

            const listId = Number(lists[index].id);

            lists.splice(index, 1);

            let indexes = [];

            for (let i in tasks) {

                if (Number(tasks[i].listId) == listId) indexes.push(i);
            };

            for (let i in indexes) {

                tasks.splice(indexes[i] - i, 1);
            };

            if (typeof (Storage) !== "undefined") {

                localStorage.setItem('lists', JSON.stringify(lists));

                if (indexes.length) localStorage.setItem('tasks', JSON.stringify(tasks));
            };

            listCount--;

        } else {

            $.ajax({

                async: false,
                type: "POST",
                url: "transfer.php",
                data: {
                    username: username,
                    password: password,
                    type: "tasks&lists",
                    action: "delete",
                    id: "",
                    listId: Number(lists[index].id),
                    content: ""
                },
                dataType: 'json',

                success: function (json) {

                    const result = json[0][0];

                    if (result != 0) tasks = json;

                    else tasks = [];
                },

                error: function (error) {

                    alert("An error occurred! Please reload this page later or Sign out and use offline.");
                }
            });

            $.ajax({

                async: false,
                type: "POST",
                url: "transfer.php",
                data: {
                    username: username,
                    password: password,
                    type: "lists",
                    action: "select",
                    id: "",
                    listId: "",
                    content: ""
                },
                dataType: 'json',

                success: function (json) {

                    const result = json[0][0];

                    if (result != 0) {

                        lists = json;

                        listCount = lists.length;

                        left = [];
                        right = [];

                        for (let i = 0; i < listCount; i++) {
                            left[i] = 'show';
                            right[i] = 'remove';
                        };

                    } else {

                        lists = [];
                        listCount = 0;
                        left = [];
                        right = [];
                    };
                },

                error: function (error) {

                    alert("An error occurred! Please reload this page later or Sign out and use offline.");
                }
            });
        };
    };

    if (this.className == 'remove' && actualList != 0) {

        if (userId == 0) {

            left.splice(index, 1);
            right.splice(index, 1);

            tasks.splice(tasksIndexList[index], 1);

            tasksIndexList = [];

            for (let i in tasks) {

                if (Number(tasks[i].listId) == actualList) tasksIndexList.push(i);
            };

            if (typeof (Storage) !== "undefined") {

                localStorage.setItem('tasks', JSON.stringify(tasks));
            };

            taskCount--;

        } else {

            $.ajax({

                async: false,
                type: "POST",
                url: "transfer.php",
                data: {
                    username: username,
                    password: password,
                    type: "tasks",
                    action: "delete",
                    id: tasks[tasksIndexList[index]].id,
                    listId: "",
                    content: ""
                },
                dataType: 'json',

                success: function (json) {

                    const result = json[0][0];

                    if (result != 0) {

                        tasks = json;

                        tasksIndexList = [];

                        for (let i in tasks) {

                            if (Number(tasks[i].listId) == actualList) tasksIndexList.push(i);
                        };

                        taskCount = tasksIndexList.length;

                        left = [];
                        right = [];

                        for (let i = 0; i < taskCount; i++) {

                            left[i] = 'check';
                            right[i] = 'remove';
                        };

                    } else {

                        tasks = [];
                        tasksIndexList = [];
                        taskCount = 0;
                        left = [];
                        right = [];
                    };
                },

                error: function (error) {

                    alert("An error occurred! Please reload this page later or Sign out and use offline.");
                }
            });
        };
    };

    if (this.className == 'show') {

        myNavButton.style.display = "none";
        myHideButton.style.display = "block";

        listName = lists[index].name + ":";

        actualList = lists[index].id;

        for (let i in tasks) {

            if (Number(tasks[i].listId) == actualList) {

                tasksIndexList.push(i);

                taskCount++;
            };
        };

        if (taskCount == 10) myAddButton.style.display = "none";

        left = [];
        right = [];

        for (let i = 0; i < taskCount; i++) {

            left[i] = 'check';
            right[i] = 'remove';
        };
    };

    if (this.className == 'check') {

        if (userId == 0) {

            if (tasks[tasksIndexList[index]].done == "true") tasks[tasksIndexList[index]].done = "false"
            else tasks[tasksIndexList[index]].done = "true";

            if (typeof (Storage) !== "undefined") {

                localStorage.setItem('tasks', JSON.stringify(tasks));
            };

        } else {

            $.ajax({

                async: false,
                type: "POST",
                url: "transfer.php",
                data: {
                    username: username,
                    password: password,
                    type: "tasks",
                    action: "update",
                    id: tasks[tasksIndexList[index]].id,
                    listId: "",
                    content: ""
                },
                dataType: 'json',

                success: function (json) {

                    tasks = json;

                },

                error: function (error) {

                    alert("An error occurred! Please reload this page later or Sign out and use offline.");
                }
            });
        };
    };

    refreshView();
};

const activateTextLine = function (event) {

    const index = Number(this.id.charAt(this.id.length - 1));

    if (left[index] == 'show') {

        myNavButton.style.display = "none";
        myHideButton.style.display = "block";

        listName = lists[index].name + ":";

        actualList = lists[index].id;

        for (let i in tasks) {

            if (Number(tasks[i].listId) == actualList) {

                tasksIndexList.push(i);

                taskCount++;
            };
        };

        if (taskCount == 10) myAddButton.style.display = "none";

        left = [];
        right = [];

        for (let i = 0; i < taskCount; i++) {
            left[i] = 'check';
            right[i] = 'remove';
        };

    } else {

        if (userId == 0) {

            if (tasks[tasksIndexList[index]].done == "true") tasks[tasksIndexList[index]].done = "false"
            else tasks[tasksIndexList[index]].done = "true";

            if (typeof (Storage) !== "undefined") {

                localStorage.setItem('tasks', JSON.stringify(tasks));
            };

        } else {

            $.ajax({

                async: false,
                type: "POST",
                url: "transfer.php",
                data: {
                    username: username,
                    password: password,
                    type: "tasks",
                    action: "update",
                    id: tasks[tasksIndexList[index]].id,
                    listId: "",
                    content: ""
                },
                dataType: 'json',

                success: function (json) {

                    tasks = json;

                },

                error: function (error) {

                    alert("An error occurred! Please reload this page later or Sign out and use offline.");
                }
            });
        };
    };

    refreshView();
};

const refreshView = function () {

    if (document.querySelector('#textInput')) {

        const myTextInputElement = document.querySelector('#textInput');
        myMainElement.removeChild(myTextInputElement);
    };

    myMainElement.removeChild(myLeftElement);
    myMainElement.removeChild(myRightElement);
    myMainElement.removeChild(myTasksElement);

    let newMainElement = document.createElement('ul');
    newMainElement.setAttribute("id", "left");

    myMainElement.appendChild(newMainElement);
    myLeftElement = document.querySelector('#left');

    newMainElement = document.createElement('ul');
    newMainElement.setAttribute("id", "right");

    myMainElement.appendChild(newMainElement);
    myRightElement = document.querySelector('#right');

    newMainElement = document.createElement('ul');
    newMainElement.setAttribute("id", "tasks");

    myMainElement.appendChild(newMainElement);
    myTasksElement = document.querySelector('#tasks');

    if (actualList == 0) {

        myHeaderH1Element.innerText = listName;

        if (listCount < 10) myAddButton.style.display = "block";

        for (let i in lists) {

            const newListsElement = document.createElement('li');
            newListsElement.setAttribute("id", "lists" + i);
            myTasksElement.appendChild(newListsElement);

            const newTextLine = new TextLine(lists[i].name);
            newTextLine.create(i);
        };

        for (let i in left) {

            const newLeftElement = document.createElement('li');
            newLeftElement.setAttribute("id", "left" + i);
            myLeftElement.appendChild(newLeftElement);

            const newButton = new Button('show', i, 'left');
            newButton.create();
        };

        for (let i in right) {

            const newRightElement = document.createElement('li');
            newRightElement.setAttribute("id", "right" + i);
            myRightElement.appendChild(newRightElement);

            const newButton = new Button('remove', i, 'right');
            newButton.create();
        };

    } else {

        myHeaderH1Element.innerText = listName;

        if (taskCount < 10) myAddButton.style.display = "block";

        for (let i in tasksIndexList) {

            const newListsElement = document.createElement('li');
            newListsElement.setAttribute("id", "lists" + i);
            myTasksElement.appendChild(newListsElement);

            const newTextLine = new TextLine(tasks[tasksIndexList[i]].name);
            newTextLine.create(i, tasks[tasksIndexList[i]].done);
        };

        for (let i in left) {

            const newLeftElement = document.createElement('li');
            newLeftElement.setAttribute("id", "left" + i);
            myLeftElement.appendChild(newLeftElement);

            const newButton = new Button('check', i, 'left');
            newButton.create();
        };

        for (let i in right) {

            const newRightElement = document.createElement('li');
            newRightElement.setAttribute("id", "right" + i);
            myRightElement.appendChild(newRightElement);

            const newButton = new Button('remove', i, 'right');
            newButton.create();
        };
    };
};

const nav = function (event) {

    myNavButton.classList.toggle('active');

    myContentElement.style.width = contentWidth;

    if (document.querySelector('#h2Menu')) {

        const myH2MenuElement = document.querySelector('#h2Menu');
        myContentElement.removeChild(myH2MenuElement);
    };

    if (document.querySelector('#textInputMenu')) {

        const myTextInputMenuElement = document.querySelector('#textInputMenu');
        myContentElement.removeChild(myTextInputMenuElement);
    };

    myRecaptchaElement.style.display = "none";
    myHomeButton.style.display = "block";
    myHelpButton.style.display = "-webkit-box";
    myHelpButton.style.display = "-ms-flexbox";
    myHelpButton.style.display = "flex";
    myAboutButton.style.display = "-webkit-box";
    myAboutButton.style.display = "-ms-flexbox";
    myAboutButton.style.display = "flex";

    if (userId) {

        myH2MainMenuElement.style.display = "block";

        mySignOutButton.style.display = "-webkit-box";
        mySignOutButton.style.display = "-ms-flexbox";
        mySignOutButton.style.display = "flex";
        mySignInButton.style.display = "none";
        myRegisterButton.style.display = "none";

    } else {

        myH2MainMenuElement.style.display = "none";

        mySignInButton.style.display = "-webkit-box";
        mySignInButton.style.display = "-ms-flexbox";
        mySignInButton.style.display = "flex";
        myRegisterButton.style.display = "-webkit-box";
        myRegisterButton.style.display = "-ms-flexbox";
        myRegisterButton.style.display = "flex";
        mySignOutButton.style.display = "none";
    };

    myMenuElement.classList.toggle('show');
};

const about = function (event) {

    this.style.display = "none";
    myHomeButton.style.display = "none";
    myHelpButton.style.display = "none";

    if (userId) {

        myH2MainMenuElement.style.display = "none";
        mySignOutButton.style.display = "none";

    } else {

        mySignInButton.style.display = "none";
        myRegisterButton.style.display = "none";

    };

    const newH2MenuElement = document.createElement('h2');
    newH2MenuElement.setAttribute("id", "h2Menu");
    newH2MenuElement.innerText = "TO-DO List\nVersion 1.0\nCopyright (C) 2018 by Mateusz Szul";

    myContentElement.style.width = "100vw";
    myContentElement.appendChild(newH2MenuElement);
};

const help = function (event) {

    this.style.display = "none";
    myHomeButton.style.display = "none";
    myAboutButton.style.display = "none";

    if (userId) {

        myH2MainMenuElement.style.display = "none";
        mySignOutButton.style.display = "none";

    } else {

        mySignInButton.style.display = "none";
        myRegisterButton.style.display = "none";

    };

    const newH2MenuElement = document.createElement('h2');
    newH2MenuElement.setAttribute("id", "h2Menu");
    newH2MenuElement.innerText = "You can create up to 10 lists that can contain up to 10 tasks.\nNames can not exceed 20 characters.\nRegister and Sign in to access online data on each device.";

    myContentElement.style.width = "100vw";
    myContentElement.appendChild(newH2MenuElement);
};

const signOut = function (event) {

    userId = 0;
    username = '';
    password = '';
    tasks = [];
    lists = [];
    listCount = 0;
    left = [];
    right = [];

    if (typeof (Storage) !== "undefined") {

        localStorage.clear();
    };

    this.style.display = "none";
    myHomeButton.style.display = "none";
    myHelpButton.style.display = "none";
    myAboutButton.style.display = "none";

    myH2MainMenuElement.innerText = "";
    myH2MainMenuElement.style.display = "none";

    const newH2MenuElement = document.createElement('h2');
    newH2MenuElement.setAttribute("id", "h2Menu");
    newH2MenuElement.innerText = "Success!";

    myContentElement.appendChild(newH2MenuElement);

    refreshView();
};

const rewriteTextMenu = function (event) {

    if (event.key == 'Enter' && this.value != '' && username == '') {

        username = this.value;

        this.value = '';

        const myH2MenuElement = document.querySelector('#h2Menu');
        myH2MenuElement.innerText = "Password:";

        this.setAttribute("type", "password");
        this.setAttribute("autofocus", "autofocus");
    };

    if (event.key == 'Enter' && this.value != '' && username != '') {

        password = this.value;

        this.value = '';

        myH2MainMenuElement.style.display = "none";

        myContentElement.removeChild(this);

        const myH2MenuElement = document.querySelector('#h2Menu');
        myH2MenuElement.innerText = "Wait ...";

        $.ajax({

            async: false,
            type: "POST",
            url: "signin.php",
            data: {
                username: username,
                password: password
            },
            dataType: 'json',

            success: function (json) {

                const row = json[0];

                userId = Number(row[0]);
                username = row[1];
                password = row[2];
            },

            error: function (error) {

                username = '';
                password = '';

                alert("An error occurred! Please try again later.");

                myH2MainMenuElement.innerText = "Offline only";
                myH2MainMenuElement.style.display = "block";
                myContentElement.removeChild(myH2MenuElement);
            }
        });

        myContentElement.style.width = "100vw";

        if (userId) {

            tasks = [];
            lists = [];
            listCount = 0;
            left = [];
            right = [];

            if (typeof (Storage) !== "undefined") {

                localStorage.setItem('userId', userId);
                localStorage.setItem('username', username);
                localStorage.setItem('password', password);

                if (typeof (localStorage.lists) !== "undefined") {

                    localStorage.removeItem('lists');
                };
                if (typeof (localStorage.tasks) !== "undefined") {

                    localStorage.removeItem('tasks');
                };
            };

            myH2MainMenuElement.innerText = username;

            $.ajax({

                async: false,
                type: "POST",
                url: "transfer.php",
                data: {
                    username: username,
                    password: password,
                    type: "lists",
                    action: "select",
                    id: "",
                    listId: "",
                    content: ""
                },
                dataType: 'json',

                success: function (json) {

                    const result = json[0][0];

                    if (result != 0) {

                        lists = json;

                        listCount = lists.length;

                        if (listCount == 10) myAddButton.style.display = "none";

                        for (let i = 0; i < listCount; i++) {
                            left[i] = 'show';
                            right[i] = 'remove';
                        };
                    };

                },

                error: function (error) {

                    alert("An error occurred! Please reload this page later or Sign out and use offline.");

                    myH2MenuElement.innerText = "Hello " + username + "!";
                }
            });

            $.ajax({

                async: false,
                type: "POST",
                url: "transfer.php",
                data: {
                    username: username,
                    password: password,
                    type: "tasks",
                    action: "select",
                    id: "",
                    listId: "",
                    content: ""
                },
                dataType: 'json',

                success: function (json) {

                    const result = json[0][0];

                    if (result != 0) tasks = json;

                    myH2MenuElement.innerText = "Hello " + username + "!";
                },

                error: function (error) {

                    alert("An error occurred! Please reload this page later or Sign out and use offline.");

                    myH2MenuElement.innerText = "Hello " + username + "!";
                }
            });

            refreshView();
        }

        if (userId == 0 && username == "incorrect") myH2MenuElement.innerText = "Incorrect username or password!";

        if (userId == 0 && username != "incorrect" && username != "") myH2MenuElement.innerText = "Connection error: " + username;
    };

    if (event.key == 'Escape') {

        nav();
    };
};

const signIn = function (event) {

    username = '';
    password = '';

    this.style.display = "none";
    myHomeButton.style.display = "none";
    myRegisterButton.style.display = "none";
    myHelpButton.style.display = "none";
    myAboutButton.style.display = "none";

    myH2MainMenuElement.innerText = "Sign in";
    myH2MainMenuElement.style.display = "block";

    const newH2MenuElement = document.createElement('h2');
    newH2MenuElement.setAttribute("id", "h2Menu");
    newH2MenuElement.innerText = "Username:";

    myContentElement.appendChild(newH2MenuElement);

    const newTextInputMenuElement = document.createElement('input');

    newTextInputMenuElement.setAttribute("id", "textInputMenu");
    newTextInputMenuElement.setAttribute("type", "text");
    newTextInputMenuElement.setAttribute("autofocus", "autofocus");

    myContentElement.appendChild(newTextInputMenuElement);

    const myTextInputMenuElement = document.querySelector('#textInputMenu');

    myTextInputMenuElement.addEventListener('keydown', rewriteTextMenu);
};

const rewriteTextRegisterMenu = function (event) {

    if (event.key == 'Enter' && this.value != '' && username == '') {

        const myH2MenuElement = document.querySelector('#h2Menu');

        if (this.value.length < 3 || this.value.length > 20) {

            myH2MenuElement.innerText = "3 to 20 characters!";

        } else {

            const reg = /^[a-zA-Z0-9]+$/;

            if (reg.test(this.value)) {

                username = this.value;

                this.value = '';

                myH2MenuElement.innerText = "Password:";

                this.setAttribute("type", "password");
                this.setAttribute("autofocus", "autofocus");

            } else {

                myH2MenuElement.innerText = "No special characters!";
            };
        };
    };

    if (event.key == 'Enter' && this.value != '' && username != '' && password == '') {

        const myH2MenuElement = document.querySelector('#h2Menu');

        if (this.value.length < 8 || this.value.length > 20) {

            myH2MenuElement.innerText = "8 to 20 characters!";

        } else {

            const reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{8,20}$/;

            if (reg.test(this.value)) {

                password = this.value;

                this.value = '';

                myH2MenuElement.innerText = "Confirm password:";

                this.setAttribute("type", "password");
                this.setAttribute("autofocus", "autofocus");

            } else {

                myH2MenuElement.innerText = "Minimum one: a-z, A-Z, 0-9!";
            };
        };
    };

    if (event.key == 'Enter' && this.value != '' && username != '' && password != '') {

        const myH2MenuElement = document.querySelector('#h2Menu');

        if (this.value == password) {

            this.value = '';
            myContentElement.removeChild(this);
            myContentElement.removeChild(myH2MenuElement);

            myRecaptchaElement.style.display = "-webkit-box";
            myRecaptchaElement.style.display = "-ms-flexbox";
            myRecaptchaElement.style.display = "flex";

            const myTimer = setInterval(function () {

                if (grecaptcha.getResponse()) {

                    clearInterval(myTimer);

                    let recaptchaResp = '';

                    $.ajax({

                        async: false,
                        type: "POST",
                        url: "recaptcha.php",
                        data: {
                            recaptcha: grecaptcha.getResponse()
                        },
                        dataType: 'json',

                        success: function (json) {

                            const row = json[0];

                            recaptchaResp = row[1];
                        },

                        error: function (error) {

                            alert("An error occurred! Please try again later.");

                            myH2MainMenuElement.innerText = "Try again later.";
                            myH2MainMenuElement.style.display = "block";
                        }
                    });

                    if (recaptchaResp == "correct") {

                        myRecaptchaElement.style.display = "none";

                        const newH2MenuElement = document.createElement('h2');
                        newH2MenuElement.setAttribute("id", "h2Menu");

                        myContentElement.appendChild(newH2MenuElement);

                        const myH2MenuElement = document.querySelector('#h2Menu');

                        myH2MenuElement.innerText = "Wait ...";

                        let response = '';

                        $.ajax({

                            async: false,
                            type: "POST",
                            url: "register.php",
                            data: {
                                username: username,
                                password: password
                            },
                            dataType: 'json',

                            success: function (json) {

                                const row = json[0];

                                response = row[1];
                            },

                            error: function (error) {

                                username = '';

                                alert("An error occurred! Please try again later.");

                                myH2MainMenuElement.innerText = "Offline only.";
                                myH2MainMenuElement.style.display = "block";
                                myContentElement.removeChild(myH2MenuElement);
                            }
                        });
                        username = '';
                        password = '';

                        myContentElement.style.width = "100vw";

                        if (response == "success") myH2MenuElement.innerText = "Registration successful! Please Sign in.";

                        if (response == "exists") myH2MenuElement.innerText = "The username provided already exists!";

                        if (response == "failure") myH2MenuElement.innerText = "An error occurred! Please try again later.";

                        if (response != "success" && response != "exists" && response != "failure" && response != "") myH2MenuElement.innerText = "Connection error: " + response;

                    } else if (recaptchaResp == "incorrect") {

                        myRecaptchaElement.style.display = "none";

                        myContentElement.style.width = "100vw";

                        const newH2MenuElement = document.createElement('h2');
                        newH2MenuElement.setAttribute("id", "h2Menu");
                        newH2MenuElement.innerText = "Confirm that you are not a bot!";

                        myContentElement.appendChild(newH2MenuElement);

                        username = '';
                        password = '';

                    } else if (recaptchaResp != "") {

                        myRecaptchaElement.style.display = "none";

                        myContentElement.style.width = "100vw";

                        const newH2MenuElement = document.createElement('h2');
                        newH2MenuElement.setAttribute("id", "h2Menu");
                        newH2MenuElement.innerText = "Connection error: " + recaptchaResp;

                        myContentElement.appendChild(newH2MenuElement);

                        username = '';
                        password = '';
                    };
                };

            }, 3000);

        } else {

            this.value = '';
            myContentElement.removeChild(this);

            myContentElement.style.width = "100vw";

            myH2MenuElement.innerText = "The passwords are not the same!";

            username = '';
            password = '';
        };
    };

    if (event.key == 'Escape') {

        username = '';
        password = '';

        nav();
    };
};

const register = function (event) {

    username = '';
    password = '';

    this.style.display = "none";
    myHomeButton.style.display = "none";
    mySignInButton.style.display = "none";
    myHelpButton.style.display = "none";
    myAboutButton.style.display = "none";

    myH2MainMenuElement.innerText = "Register";
    myH2MainMenuElement.style.display = "block";

    const newH2MenuElement = document.createElement('h2');
    newH2MenuElement.setAttribute("id", "h2Menu");
    newH2MenuElement.innerText = "Username:";

    myContentElement.appendChild(newH2MenuElement);

    const newTextInputMenuElement = document.createElement('input');

    newTextInputMenuElement.setAttribute("id", "textInputMenu");
    newTextInputMenuElement.setAttribute("type", "text");
    newTextInputMenuElement.setAttribute("autofocus", "autofocus");

    myContentElement.appendChild(newTextInputMenuElement);

    const myTextInputMenuElement = document.querySelector('#textInputMenu');

    myTextInputMenuElement.addEventListener('keydown', rewriteTextRegisterMenu);
};

const hide = function (event) {

    myHideButton.style.display = "none";
    myNavButton.style.display = "block";

    listName = "TO-DO Lists:";
    actualList = 0;
    taskCount = 0;
    listCount = lists.length;

    if (listCount == 10) myAddButton.style.display = "none";

    tasksIndexList = [];

    left = [];
    right = [];

    for (let i = 0; i < listCount; i++) {
        left[i] = 'show';
        right[i] = 'remove';
    };

    refreshView();
};

const getId = function (array) {

    let isExist;

    if (array == lists) {

        for (let i = 1; i < 11; i++) {

            isExist = false;

            for (let j in array) {

                if (Number(array[j].id) == i) isExist = true;
            };

            if (!isExist) return i;
        };
    } else {

        for (let i = 1; i < 101; i++) {

            isExist = false;

            for (let j in array) {

                if (Number(array[j].id) == i) isExist = true;
            };

            if (!isExist) return i;
        };
    };
};

const rewriteText = function (event) {

    if ((event.key == 'Enter' && this.value != '' && actualList == 0) || (this.value.length >= 20 && actualList == 0)) {

        myMainElement.removeChild(this);

        if (userId == 0) {

            left[listCount] = 'show';
            right[listCount] = 'remove';
            lists[listCount] = new List(getId(lists), userId, this.value);

            listCount++;

            if (typeof (Storage) !== "undefined") {

                localStorage.setItem('lists', JSON.stringify(lists));
            };

        } else {

            $.ajax({

                async: false,
                type: "POST",
                url: "transfer.php",
                data: {
                    username: username,
                    password: password,
                    type: "lists",
                    action: "insert",
                    id: "",
                    listId: "",
                    content: this.value
                },
                dataType: 'json',

                success: function (json) {

                    lists = json;

                    listCount = lists.length;

                    left = [];
                    right = [];

                    for (let i = 0; i < listCount; i++) {
                        left[i] = 'show';
                        right[i] = 'remove';
                    };

                },

                error: function (error) {

                    alert("An error occurred! Please reload this page later or Sign out and use offline.");
                }
            });
        };

        refreshView();
    };

    if ((event.key == 'Enter' && this.value != '' && actualList != 0) || (this.value.length >= 20 && actualList != 0)) {

        myMainElement.removeChild(this);

        if (userId == 0) {

            left[taskCount] = 'check';
            right[taskCount] = 'remove';
            tasks.push(new Task(getId(tasks), actualList, this.value));

            tasksIndexList[taskCount] = tasks.length - 1;

            taskCount++;

            if (typeof (Storage) !== "undefined") {

                localStorage.setItem('tasks', JSON.stringify(tasks));
            };

        } else {

            $.ajax({

                async: false,
                type: "POST",
                url: "transfer.php",
                data: {
                    username: username,
                    password: password,
                    type: "tasks",
                    action: "insert",
                    id: "",
                    listId: actualList,
                    content: this.value
                },
                dataType: 'json',

                success: function (json) {

                    tasks = json;

                    taskCount = 0;

                    tasksIndexList = [];

                    for (let i in tasks) {

                        if (Number(tasks[i].listId) == actualList) {

                            tasksIndexList.push(i);

                            taskCount++;
                        };
                    };

                    left = [];
                    right = [];

                    for (let i = 0; i < taskCount; i++) {
                        left[i] = 'check';
                        right[i] = 'remove';
                    };

                },

                error: function (error) {

                    alert("An error occurred! Please reload this page later or Sign out and use offline.");
                }
            });
        };

        refreshView();
    };

    if (event.key == 'Escape') {

        myMainElement.removeChild(this);

        refreshView();
    };
};

const add = function (event) {

    myAddButton.style.display = "none";

    const newTextInputElement = document.createElement('input');

    newTextInputElement.setAttribute("id", "textInput");
    newTextInputElement.setAttribute("type", "text");
    newTextInputElement.setAttribute("maxlength", "20");
    newTextInputElement.setAttribute("autofocus", "autofocus");

    myMainElement.appendChild(newTextInputElement);

    const myTextInputElement = document.querySelector('#textInput');

    myTextInputElement.style.width = lineHeight * 5 + "px";
    myTextInputElement.style.height = lineHeight + "px";
    myTextInputElement.style.lineHeight = lineHeight + "px";
    myTextInputElement.style.fontSize = fontSize;
    myTextInputElement.style.position = "absolute";
    myTextInputElement.style.bottom = "7%";
    myTextInputElement.style.left = "20%";

    myTextInputElement.addEventListener('keydown', rewriteText);
};

// main program

const myMenuElement = document.querySelector('.menu');
const myHeaderElement = document.querySelector('header');
const myHeaderH1Element = document.querySelector('header h1');
const myMainElement = document.querySelector('main');
const myContentElement = document.querySelector('#content');
const myHomeButton = document.querySelector('#home');
const myNavButton = document.querySelector('.navIcon');
const myH2MainMenuElement = document.querySelector('#h2MainMenu');
const myRecaptchaElement = document.querySelector('.g-recaptcha');
const mySignInButton = document.querySelector('#signIn');
const myRegisterButton = document.querySelector('#register');
const myHelpButton = document.querySelector('#help');
const myAboutButton = document.querySelector('#about');
const mySignOutButton = document.querySelector('#signOut');
const myHideButton = document.querySelector('#hide');
const myAddButton = document.querySelector('#add');
let myLeftElement = document.querySelector('#left');
let myRightElement = document.querySelector('#right');
let myTasksElement = document.querySelector('#tasks');

myNavButton.addEventListener('click', nav);
mySignInButton.addEventListener('click', signIn);
myRegisterButton.addEventListener('click', register);
myHelpButton.addEventListener('click', help);
myAboutButton.addEventListener('click', about);
mySignOutButton.addEventListener('click', signOut);
myHideButton.addEventListener('click', hide);
myAddButton.addEventListener('click', add);

contentWidth = myContentElement.style.width;

viewHeight = window.getComputedStyle(myMainElement, null).getPropertyValue("height");
viewHeight = viewHeight.slice(0, viewHeight.length - 2);
viewHeight = Math.floor(viewHeight);

viewWidth = window.getComputedStyle(myMainElement, null).getPropertyValue("width");
viewWidth = viewWidth.slice(0, viewWidth.length - 2);
viewWidth = Math.floor(viewWidth);

lineHeight = viewHeight / 11;

if (typeof (Storage) !== "undefined") {

    if (typeof (localStorage.lists) !== "undefined") {

        lists = JSON.parse(localStorage.getItem('lists'));

        listCount = lists.length;

        if (listCount == 10) myAddButton.style.display = "none";

        for (let i = 0; i < listCount; i++) {
            left[i] = 'show';
            right[i] = 'remove';
        };
    };

    if (typeof (localStorage.tasks) !== "undefined") {

        tasks = JSON.parse(localStorage.getItem('tasks'));
    };

    if (typeof (localStorage.userId) !== "undefined") {

        userId = localStorage.getItem('userId');
        username = localStorage.getItem('username');
        password = localStorage.getItem('password');

        myH2MainMenuElement.innerText = username;

        $.ajax({

            async: false,
            type: "POST",
            url: "transfer.php",
            data: {
                username: username,
                password: password,
                type: "lists",
                action: "select",
                id: "",
                listId: "",
                content: ""
            },
            dataType: 'json',

            success: function (json) {

                const result = json[0][0];

                if (result != 0) {

                    lists = json;

                    listCount = lists.length;

                    if (listCount == 10) myAddButton.style.display = "none";

                    for (let i = 0; i < listCount; i++) {
                        left[i] = 'show';
                        right[i] = 'remove';
                    };
                };

            },

            error: function (error) {

                alert("An error occurred! Please reload this page later or Sign out and use offline.");
            }
        });

        $.ajax({

            async: false,
            type: "POST",
            url: "transfer.php",
            data: {
                username: username,
                password: password,
                type: "tasks",
                action: "select",
                id: "",
                listId: "",
                content: ""
            },
            dataType: 'json',

            success: function (json) {

                const result = json[0][0];

                if (result != 0) tasks = json;
            },

            error: function (error) {

                alert("An error occurred! Please reload this page later or Sign out and use offline.");
            }
        });
    };

} else {

    alert("Warning! This browser does not support Web Storage.\nThe data will not be saved until next visits!\nSign in to have access to them on every device.");
};

// media queries

const myMediaPFunction = function (p) {

    if (p.matches) {

        fontSize = "1.1rem";
        refreshView();
    };
};

const p = window.matchMedia("(orientation: landscape)");

myMediaPFunction(p);

const myMediaRFunction = function (r) {

    if (r.matches) {

        fontSize = "3.5rem";
        refreshView();
    };
};

const r = window.matchMedia("(min-width: 530px)");

myMediaRFunction(r);

const myMediaOFunction = function (o) {

    if (o.matches) {

        fontSize = "1.2rem";
        refreshView();
    };
};

const o = window.matchMedia("(min-width: 530px) and (orientation: landscape)");

myMediaOFunction(o);

const myMediaQFunction = function (q) {

    if (q.matches) {

        fontSize = "3.5rem";
        refreshView();
    };
};

const q = window.matchMedia("(min-width: 768px)");

myMediaQFunction(q);

q.addListener(myMediaQFunction);

const myMediaNFunction = function (n) {

    if (n.matches) {

        fontSize = "1.4rem";
        refreshView();
    };
};

const n = window.matchMedia("(min-width: 768px) and (orientation: landscape)");

myMediaNFunction(n);

const myMediaSFunction = function (s) {

    if (s.matches) {

        fontSize = "4.3rem";
        refreshView();
    };
};

const s = window.matchMedia("(min-width: 768px) and (orientation: portrait)");

myMediaSFunction(s);

const myMediaTFunction = function (t) {

    if (t.matches) {

        fontSize = "3.4rem";
        refreshView();
    };
};

const t = window.matchMedia("(min-width: 1024px)");

myMediaTFunction(t);

t.addListener(myMediaTFunction);

const myMediaVFunction = function (v) {

    if (v.matches) {

        fontSize = "3.6rem";
        refreshView();
    };
};

const v = window.matchMedia("(min-width: 1280px)");

myMediaVFunction(v);

v.addListener(myMediaVFunction);

const myMediaXFunction = function (x) {

    if (x.matches) {

        fontSize = "4rem";
        refreshView();
    };
};

const x = window.matchMedia("(min-width: 1600px)");

myMediaXFunction(x);

x.addListener(myMediaXFunction);

const myMediaZFunction = function (z) {

    if (z.matches) {

        fontSize = "1.9rem";
        refreshView();
    };
};

const z = window.matchMedia("(max-width: 320px)");

myMediaZFunction(z);

refreshView();
