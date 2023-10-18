const { app, BrowserWindow, Notification } = require("electron");
const path = require("path");

let mainWindow

function createWindow () {
    mainWindow?.close;

    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
        autoHideMenuBar: true,
        icon: path.join(__dirname, "../assets/clapped.png"),
        show: false
    });

    mainWindow.maximize();
    mainWindow.show();

    if(process.platform === "win32") app.setAppUserModelId("CLAPPED.RIP - DESKTOP");

    (async () => {
        try {
            await mainWindow.loadURL("https://clapped.rip/login");
        }catch(error){
            console.log("Failed to load URL:" + error);
        }
    })();

    function sendNotification(title, body){
        new Notification({
            title: title,
            body: body,
            icon: path.join(__dirname, "../assets/clapped.png")
        }).show();
    }

    mainWindow.on("closed", () => mainWindow = null);

    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        mainWindow.loadURL(url);
        return { action: "deny" }
    });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    if(process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if(mainWindow === null){
        createWindow();
    }else{
        mainWindow?.close;
        createWindow();
    }
});