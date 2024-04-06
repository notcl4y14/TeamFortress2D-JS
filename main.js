let { app, BrowserWindow } = require('electron/main');
let ipc = require("electron").ipcMain;

function createWindow () {
	let config = require("./config.json");

	let win = new BrowserWindow({
		title: "Team Fortress 2D",
		width: 800,
		height: 600,
		autoHideMenuBar: config.autoHideMenuBar
	});

	win.addListener("close", (e) => {
		win.close();
	});
	
	win.addListener("set-title", (e, title) => {
		win.setTitle(title);
	});

	win.loadFile('src/index.html');
}

app.whenReady().then(() => {
	createWindow();

	// ipc.on("close", (e) => {
	// 	let webContents = e.sender;
	// 	let win = BrowserWindow.fromWebContents(webContents);
		
	// 	win.close();
	// });
	
	// ipc.on("set-title", (e, title) => {
	// 	let webContents = e.sender;
	// 	let win = BrowserWindow.fromWebContents(webContents);
		
	// 	win.setTitle(title);
	// });

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