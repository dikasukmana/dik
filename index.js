const electron = require("electron");
const uuid = require("uuid").v4;


const {
    app,
    BrowserWindow,
    Menu,
    ipcMain
} = electron;

let todayWindow;
let beliWindow;
let createWindow;
let listWindow;

let allAppointment = [];

app.on("ready", () => {
    todayWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        title: "Aplikasi Kasir"
    });

    todayWindow.loadURL(`file://${__dirname}/today.html`);
    todayWindow.on("closed", () => {

        app.quit()
        todayWindow = null;
    });

    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);

});
const beliWindowCreator = () => {
    beliWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        widht: 600,
        height: 400,
        title: "Pembelian"
    });

    beliWindow.setMenu(null);
    beliWindow.loadURL(`file://${__dirname}/beli.html`);
    beliWindow.on("closed", () => (beliWindow = null));
};
const listWindowCreator = () => {
    listWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        widht: 600,
        height: 400,
        title: "Gudang"
    });

    listWindow.setMenu(null);
    listWindow.loadURL(`file://${__dirname}/list.html`);
    listWindow.on("closed", () => (listWindow = null));
};

const createWindowCreator = () => {
    createWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        widht: 600,
        height: 400,
        title: "Tambah Barang"
    });

    createWindow.setMenu(null);
    createWindow.loadURL(`file://${__dirname}/create.html`);
    createWindow.on("closed", () => (createWindow = null));
};

ipcMain.on("appointment:create", (event, appointment) => {
    appointment["id"] = uuid();
    appointment["done"] = 0;
    allAppointment.push(appointment);

    createWindow.close();

    console.log(allAppointment);
});
ipcMain.on("appointment:request:beli", event => {
    beliWindow.webContents.send('appointment:response:beli', allAppointment);
});
ipcMain.on("appointment:request:list", event => {
    listWindow.webContents.send('appointment:response:list', allAppointment);
});
ipcMain.on("appointment:request:today", event => {
    console.log("here2");
});
ipcMain.on("appointment:done", (event, id) => {
    console.log("here3");
});

const menuTemplate = [{
    label: "File",
    submenu: [{
            label: "Pembelian",

            click() {
                beliWindowCreator();
            }
        },
        {
                label: "Tambah Barang",

                click() {
                    createWindowCreator();
                }
            },
            {
                label: "Gudang",
                click() {
                    listWindowCreator();
                }
            },
            {
                label: "Quit",
                accelerator: process.platfrom === "darwin" ? "Command+Q" : "CTRL + Q",
                click() {
                    app.quit();
                }
            }
        ]
    },

    {
        label: "View",
        submenu: [{
            role: "reload"
        }, {
            role: "toggledevtools"
        }]
    }
]