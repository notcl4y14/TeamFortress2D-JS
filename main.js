let { app, BrowserWindow } = require('electron/main');
let ipc = require("electron").ipcMain;

function createWindow () {
	let config = require("./config.json");

	let win = new BrowserWindow({
		title: "Team Fortress 2D",
		width: config.width,
		height: config.height,
		autoHideMenuBar: config.autoHideMenuBar,
		backgroundColor: "black"
	});
	
	win.addListener("set-title", (title) => {
		win.setTitle(title);
	});

	win.loadFile('src/index.html');
}

app.whenReady().then(() => {
	createWindow();

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
})