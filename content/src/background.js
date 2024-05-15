const { faker } = require('@faker-js/faker');
chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
        id: "rellenarCampoAleatorio",
        title: "Rellenar campo Aleatorio",
        contexts: ["editable"]
    });
    chrome.contextMenus.create({
        id: "rellenarCampo",
        title: "Rellenar campo como: ",
        contexts: ["editable"]
    });
    chrome.contextMenus.create({
        id: "obtenerQuery",
        title: "Obtener query: ",
        contexts: ["editable"]
    });
    // Crear el submenú
    chrome.contextMenus.create({
        id: "rellenarCampo_name",
        title: "Nombre",
        parentId: "rellenarCampo",
        contexts: ["editable"]
    });
    chrome.contextMenus.create({
        id: "rellenarCampo_lastName",
        title: "Apellido",
        parentId: "rellenarCampo",
        contexts: ["editable"]
    });
    chrome.contextMenus.create({
        id: "rellenarCampo_email",
        title: "Correo",
        parentId: "rellenarCampo",
        contexts: ["editable"]
    });
    chrome.contextMenus.create({
        id: "rellenarCampo_phone",
        title: "Teléfono",
        parentId: "rellenarCampo",
        contexts: ["editable"]
    });
    chrome.contextMenus.create({
        id: "rellenarCampo_jobType",
        title: "tipo de trabajo",
        parentId: "rellenarCampo",
        contexts: ["editable"]
    });
});
chrome.contextMenus.onClicked.addListener(function (info, tab) {
    let value = faker.string.sample(5);
    switch (info.menuItemId) {
        case "rellenarCampo_name": {
            value = faker.person.firstName();
            break;
        }
        case "rellenarCampo_lastName": {
            value = faker.person.lastName();
            break;
        }
        case "rellenarCampo_email": {
            value = faker.internet.email();
            break;
        }
        case "rellenarCampo_jobType": {
            value = faker.person.jobType();
            break;
        }
        case "rellenarCampo_phone": {
            value = faker.phone.number("##########");
            break;
        }
        case "rellenarCampoAleatorio": {
            value = faker.string.sample(5);
            break;
        }
        case "obtenerQuery": {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                const activeTab = tabs[0];
                chrome.tabs.sendMessage(activeTab.id, { action: "obtener-query", data: '' });
            });
            return;
        }
    }
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { action: "llenar-campo-activo", data: value });
    });
});