"use strict";

// данные по текущему пользователю из сессии
let currentUserData;
let currentUserTable;

const tp_operationWindow = document.getElementById("js-OperationWindow");  // точка вставки для окна Current user
const tp_Footer = document.getElementById("js-footerData");                // точка вставки для шапки страницы
let pageFooter                                                             // сформированная шапка для страницы


/* ------------ DAO ------------*/

async function getCurrentUser() {
    const getData = await fetch("http://localhost:8080/api/user/currentuser");
    currentUserData = await getData.json();
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



// Стартовый вызов
async function mainBuilder() {
    await getCurrentUser();                     // Взяли пользователя
    buildFooter(currentUserData);
    drawFooter(pageFooter);                     // Построили и отобразили шапку
    buildCurrentUserTable(currentUserData);
    drawCurrentUserTable();                     // Построили и отобразили таблицу для пользователя
}

mainBuilder();
