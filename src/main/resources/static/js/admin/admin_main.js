"use strict";

const apiCRUD_URL = "http://localhost:8080/api/admin/users";

// данные по всем пользователям
let usersData;
let usersTable;
// данные по текущему пользователю из сессии
let currentUserData;
let currentUserTable;

const tp_operationWindow = document.getElementById("js-OperationWindow");  // точка вставки для окон All users, Current user, Add new user
const tp_Footer = document.getElementById("js-footerData");                // точка вставки шапки страницы
let pageFooter                                                             // сформированная шапка для страницы


/* ------------ DAO ------------*/

async function getUserById(id) {
    const getData = await fetch(`${apiCRUD_URL}/${id}`);
    return await getData.json();
}

async function getAllRoles() {
    const getData = await fetch("http://localhost:8080/api/admin/roles");
    return await getData.json();
}

async function getCurrentUser() {
    const getData = await fetch("http://localhost:8080/api/admin/currentuser");
    currentUserData = await getData.json();
}

async function getAllUsers() {
    const usersResult = await fetch(apiCRUD_URL);
    usersData = await usersResult.json();
}

// Шаблон вызова для Create / Update / Delete
async function baseCall(urlString, requestMethod, requestBody) {
    await fetch(urlString, {
        method: requestMethod, body: requestBody});
    _navigationUsersTableSelect();
    await redrawUsersTable();

}

// Пересоздание таблицы после CRUD операций
async function redrawUsersTable() {
    await getAllUsers();
    buildUsersTable(usersData);
    drawUsersTable();
}


/* ----- Установщики состояний элементов навигации  ----- */

/* ----- Панель навигации (Users table | New user ----- */
// Выбрана вкладка Users table
function _navigationUsersTableSelect() {
    let tabUsersTable = document.getElementById("js-tabUsersTable");
    let tabNewUser = document.getElementById("js-tabNewUser");
    tabUsersTable.className = "nav-link active";
    tabUsersTable.removeAttribute("onclick");
    tabNewUser.className = "nav-link";
    tabNewUser.setAttribute("onclick", "_navigationNewUserSelect()");
    document.getElementById("js-innerTab").innerHTML = "All users";
    drawUsersTable();
    createListenersForUsersTable();
}
// Выбрана вкладка New user
function _navigationNewUserSelect() {
    let tabUsersTable = document.getElementById("js-tabUsersTable");
    let tabNewUser = document.getElementById("js-tabNewUser");
    tabUsersTable.className = "nav-link";
    tabUsersTable.setAttribute("onclick", "_navigationUsersTableSelect()");
    tabNewUser.className = "nav-link active";
    tabNewUser.removeAttribute("onclick");
    document.getElementById("js-innerTab").innerHTML = "New user";
    removeListenersForUsersTable();
    buildAndDrawNewUserView();
}

/* ----- левая колонка навигации (Admin | User ----- */
// Выбран Admin
function _leftBarNavigationAdminSelect() {
    let btnAdmin = document.getElementById("js-adminButton");
    let btnUser = document.getElementById("js-userButton");
    btnAdmin.className = ("nav-link active");
    btnUser.className = ("nav-link");
    btnAdmin.removeAttribute("onclick");
    btnUser.setAttribute("onclick", "_leftBarNavigationUserSelect()");
    document.getElementById("js-firstRow").hidden = false;                    // Показали первую линию вкладок (Users table | New user)
    document.getElementById("js-MainTitle").innerHTML = "Admin panel";
    document.getElementById("js-innerTab").innerHTML = "All users";
    drawUsersTable();
    createListenersForUsersTable();
}
// Выбран User
function _leftBarNavigationUserSelect() {
    let tabUsersTable = document.getElementById("js-tabUsersTable");
    let tabNewUser = document.getElementById("js-tabNewUser");
    tabUsersTable.className = "nav-link active";
    tabUsersTable.removeAttribute("onclick");
    tabNewUser.className = "nav-link";
    tabNewUser.setAttribute("onclick", "_navigationNewUserSelect()");
    document.getElementById("js-innerTab").innerHTML = "All users";


    let btnAdmin = document.getElementById("js-adminButton");
    let btnUser = document.getElementById("js-userButton");
    btnAdmin.className = ("nav-link");
    btnUser.className = ("nav-link active");
    btnUser.removeAttribute("onclick");
    btnAdmin.setAttribute("onclick", "_leftBarNavigationAdminSelect()");
    document.getElementById("js-firstRow").hidden = true;                         // Скрыли первую линию вкладок (Users table | New user)
    document.getElementById("js-MainTitle").innerHTML = "User information-page";
    document.getElementById("js-innerTab").innerHTML = "About user";
    removeListenersForUsersTable();
    drawCurrentUserTable();                                                       // Отрисовали в операционном окне таблицу CurrentUser
}


/* ----- для формирования и отрисовки элементов страницы -----*/

function buildFooter(currentUserData) {
    let dataStrings = `
        <span class="display-5"> <strong>${currentUserData.firstName}</strong> with roles: `;
    for (let i = 0; i < currentUserData.roles.length; i++) {
        dataStrings += `${currentUserData.roles[i].authority} `;
    }
    dataStrings += `</span>`;
    pageFooter = dataStrings;
}

function drawFooter(pageFooter) {
    tp_Footer.innerHTML = (pageFooter);
}

function buildUsersTable(data) {
    let dataStrings = `
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th><th>First Name (Login)</th><th>Last name</th><th>Role</th><th>Edit</th><th>Delete</th>
                    </tr>
                </thead>
                <tbody id="tryTableBody">`;
    for (let i = 0; i < data.length; i++) {
        dataStrings += "<tr>";
        dataStrings += "<td>" + data[i].id + "</td>";
        dataStrings += "<td>" + data[i].firstName + "</td>";
        dataStrings += "<td>" + data[i].lastName + "</td><td>";
        for (let j = 0; j < data[i].roles.length; j++) {
            dataStrings += "<span>" + data[i].roles[j].authority + " </span>";
        }
        dataStrings += "</td>";
        dataStrings += `<td> <button class="btn btn-info js-editButton" role="button" id="${data[i].id}">Edit</button></td>`;
        dataStrings += "</td>";
        dataStrings += `<td> <button class="btn btn-danger js-deleteButton" role="button" id="${data[i].id}">Delete</button></td>`;
        dataStrings += "</tr>";
    }
    dataStrings += "</tbody></table>";
    usersTable = dataStrings;
}

function drawUsersTable() {
    tp_operationWindow.innerHTML = usersTable;
    createListenersForUsersTable();
}

function buildCurrentUserTable(data) {
    let dataStrings = `
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th><th>First Name (Login)</th><th>Last name</th><th>Role</th>
                    </tr>
                </thead>
                <tbody id="tryTableBody">`;
    dataStrings += "<tr>";
    dataStrings += "<td>" + data.id + "</td>";
    dataStrings += "<td>" + data.firstName + "</td>";
    dataStrings += "<td>" + data.lastName + "</td><td>";
    for (let i = 0; i < data.roles.length; i++) {
        dataStrings += `<span>${data.roles[i].authority} </span>`;
    }
    dataStrings += "</td>";
    dataStrings += "</tr>";
    dataStrings += "</tbody></table>";
    currentUserTable = dataStrings;
}

function drawCurrentUserTable() {
    tp_operationWindow.innerHTML = (currentUserTable);
}

// Обработчики для кнопок в таблице All users

function createListenersForUsersTable () {
    let editButtons = document.querySelectorAll('.js-editButton');
    editButtons.forEach(editBtn => {
        editBtn.addEventListener('click', callEditModal);
    });

    let deleteButtons = document.querySelectorAll('.js-deleteButton');
    deleteButtons.forEach(delBtn => {
        delBtn.addEventListener('click', callDeleteModal);
    });
}

function removeListenersForUsersTable () {
    let editButtons = document.querySelectorAll('.js-editButton');
    editButtons.forEach(editBtn => {
        editBtn.removeEventListener('click', callEditModal);
    });

    let deleteButtons = document.querySelectorAll('.js-deleteButton');
    deleteButtons.forEach(delBtn => {
        delBtn.removeEventListener('click', callDeleteModal);
    });
}


// Вызовы модальных окон
function callDeleteModal(eventSource) {
    eventSource.preventDefault();
    buildDeleteModal(eventSource.target.getAttribute('id'));
}
function callEditModal(eventSource) {
    eventSource.preventDefault();
    buildEditModal(eventSource.target.getAttribute('id'));
}


/* ----- для формирования и отрисовки модальных окон и окна New User -----*/

async function buildEditModal(id) {
    let selectedUserData = await getUserById(id);
    let rolesData = await getAllRoles();
    let targetInsertionPoint = document.getElementById("js-editModal")
    targetInsertionPoint .innerHTML = "";
    let dataStrings = `
        <div class="modal fade" tabindex="-1" id="js-editModalWindow">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"> Edit user </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <form role="form" id="js-editForm">
                    <div class="modal-body" style="text-align: center; font-weight: bold">
                    <div class="form-group">
                    <label for="idData">ID</label>
                        <input type="text" class="form-control" name="id" value="${selectedUserData.id}" readonly/>
                    </div>
                    <div class="form-group">
                    <label for="firstNameData">firstName (LOGIN)</label>
                        <input type="text" class="form-control" name="firstName" value="${selectedUserData.firstName}"/>
                    </div>
                    <div class="form-group">
                    <label for="lastNameData">lastName</label>
                        <input type="text" class="form-control"  name="lastName" value="${selectedUserData.lastName}"/>
                    </div>
                    <div class="form-group">
                    <label for="passwordData">Password</label>
                        <input type="password" class="form-control"  name="password" value="${selectedUserData.password}"/>
                    </div>
                    <div class="form-group">
                    <label for="rolesData">Roles</label>
                    <select multiple class="form-control" name="roles">
                    `;
    for (let i = 0; i < rolesData.length; i++) {
        dataStrings += `
                <option value="${rolesData[i].authority}" name="${rolesData[i].authority}" >${rolesData[i].authority}</option>
          `;
    }
    dataStrings += `
           </select>
                    </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-danger">EDIT</button>
                    </div>
                    </form>
                </div>
            </div>
        </div>
        `;
    targetInsertionPoint .innerHTML = (dataStrings);
    let window = $('#js-editModalWindow');
    window.modal('show');
    const form = document.getElementById("js-editForm")
    form.addEventListener('submit', eventSource => {
        eventSource.preventDefault();
        const formUserData = new FormData(form);
        window.modal('hide');
        editUserCall(formUserData);
    });
}

async function buildDeleteModal(id) {
    <!--  ==================================================================== -->
    let selectedUserData = await getUserById(id);
    let targetInsertionPoint = document.getElementById("js-deleteModal");
    targetInsertionPoint.innerHTML = "";
    let dataStrings = `
        <div class="modal fade" tabindex="-1" id="js-deleteModalWindow">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"> Delete User </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <form role="form" id="js-deleteForm">
                    <div class="modal-body" style="text-align: center; font-weight: bold">
                    <div class="form-group">
                    <label for="idData">ID</label>
                        <input type="text" class="form-control" name="id" value="${selectedUserData.id}" readonly/>
                    </div>
                    <div class="form-group">
                    <label for="firstNameData">firstName (LOGIN)</label>
                        <input type="text" class="form-control" name="firstName" value="${selectedUserData.firstName}" readonly="readonly"/>
                    </div>
                    <div class="form-group">
                    <label for="lastNameData">lastName</label>
                        <input type="text" class="form-control"  name="lastName" value="${selectedUserData.lastName}" readonly="readonly"/>
                    </div>
                    <div class="form-group">
                    <label for="passwordData">Password</label>
                        <input type="password" class="form-control"  name="password" value="${selectedUserData.password}" readonly="readonly""/>
                    </div>
                    <div class="form-group">
                    <label for="rolesData">Roles</label>
                    <select multiple class="form-control" name="roles" readonly="readonly">
                    `;
    for (let i = 0; i < selectedUserData.roles.length; i++) {
        dataStrings += `
                <option value="${selectedUserData.roles[i].authority}" name="${selectedUserData.roles[i].authority}">${selectedUserData.roles[i].authority}</option>
          `;
    }
    dataStrings += `
           </select>
                    </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-danger">Delete</button>
                    </div>
                    </form>
                </div>
            </div>
        </div>
        `;
    targetInsertionPoint.innerHTML = (dataStrings);
    let window = $('#js-deleteModalWindow');
    window.modal('show');
    const form = document.getElementById("js-deleteForm")
    form.addEventListener('submit', eventSource => {
        eventSource.preventDefault();
        const formUserData = new FormData(form);
        window.modal('hide');
        deleteUserCall(formUserData);
    });
}

async function buildAndDrawNewUserView() {
    let rolesData = await getAllRoles();
    let dataStrings = "";
    dataStrings += `
          <div class="row px-3">
        <div class="col-12 p-3" style="border-width: thin; border-style: solid; border-color: lightgray">
          <div class="row align-items-center">
            <div class="col-4">
          </div>
          <div class="col-4">
            <form  role="form" id="js-newUserForm">
              <div class="form-group" style="text-align: center; font-weight: bold">
                <label for="inputFirstName" >
                  First Name
                </label>
                <input type="text" class="form-control" name="firstName" placeholder="First Name"/>
              </div>
              <div class="form-group" style="text-align: center; font-weight: bold">
                <label for="inputLastName" >
                  Last Name
                </label>
                <input type="text" class="form-control" name="lastName" placeholder="Last Name"/>
              </div>
              <div class="form-group" style="text-align: center; font-weight: bold">
                <label for="inputPassword" >
                 Password
                </label>
                <input type="password" class="form-control" name="password" placeholder="Password"/>
              </div>
              <div class="form-group" style="text-align: center; font-weight: bold">
                <label for="inputRoles">
                  Roles
                </label>
                <select multiple class="form-control" id="inputRoles" name="roles">
    `;
    for (let i = 0; i < rolesData.length; i++) {
        dataStrings += `
      <option value="${rolesData[i].authority}" name="${rolesData[i].authority}">${rolesData[i].authority}</option>
      `;
    }
    dataStrings += `
                </select>
              </div>
              <div class="form-group" style="text-align: center">
                <button type="submit" class="btn btn-success">Add new user</button>
              </div>
            </form>
          </div>
          <div class="col-4"></div>
          </div>
        </div>
      </div>

    `;
    tp_operationWindow.innerHTML = dataStrings;
    const form = document.getElementById("js-newUserForm");
    form.addEventListener("submit", eventSource => {
        eventSource.preventDefault();
        let formUserData = new FormData(form);
        createUserCall(formUserData);
    });

}



// формирование вызова для DAO -> baseCall
function editUserCall(formUserData) {
    const urlString = `${apiCRUD_URL}/${formUserData.get('id')}`;
    const requestBody = formUserData;
    const requestMethod = "PATCH"
    baseCall(urlString, requestMethod, requestBody);
}
function deleteUserCall(formUserData) {
    const urlString = `${apiCRUD_URL}/${formUserData.get('id')}`;
    const requestBody = formUserData;
    const requestMethod = "DELETE"
    baseCall(urlString, requestMethod, requestBody);
}
function createUserCall(formUserData) {
    const urlString = `${apiCRUD_URL}`;
    const requestBody = formUserData;
    const requestMethod = "POST"
    baseCall(urlString, requestMethod, requestBody);
}

// Стартовый вызов
async function mainBuilder() {
    await getCurrentUser();                     // Взяли пользователя
    buildFooter(currentUserData);
    drawFooter(pageFooter);                     // Построили и отобразили шапку
    buildCurrentUserTable(currentUserData);     // Построили таблицу для пользователя
    await getAllUsers();                        // Получили всех пользователей
    buildUsersTable(usersData);
    drawUsersTable();                           // Построили и отрисовали таблицу пользователей
    _leftBarNavigationAdminSelect();            // Установили левую панель навигации на Admin
    _navigationUsersTableSelect();              // Установили верхнюю панель навигации в All users

}

mainBuilder();
