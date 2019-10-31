
#

## How

1- Kill Teams

2- Unpack app:

```
cd /Applications/Microsoft Teams.app/Contents/Resources/
sudo asar extract app.asar app
mv app.asar app.asar.bak
```

3- Run app in command-line, with debug mode:

```
/Applications/Microsoft\ Teams.app/Contents/MacOS/Teams --remote-debugging-port=4242 --spectron-run
# or
open -a Microsoft\ Teams --args --remote-debugging-port=4242 --spectron-run

netstat -an | grep 4242
```

4- Open Chrome and go to chrome://inspect.
   Then add a target: localhost:4242
   Inspect "about:blank" page

5- Add this to app/lib/main.js:

```
const css = `
.channel-list-channels li {
  overflow: hidden;
  margin-bottom: 1rem;
}
.channel-list-channels li h3 {
  font-size: 14px;
}
.channel-list-channels li h3 a {
  height: 2.8rem;
}
.channel-list-channels li h3 .team-icon img {
  width: 2rem;
  height: 2rem;
}
.channel-list-channels li:first-child:nth-last-child(1) {
    display: none !important;
}
.channel-list-channels li {
    width: 50%;
    float: left;
}
.channel-list-channels li a {
    width: 100%;
    padding: 5px 0px 5px 20px !important;
}
.channel-list-channels li a .important-icon {
    position: absolute;
    top: -4px;
    left: 3px;
}
.channel-list-channels li a .icons-more {
    position: relative;
    top: 0;
    right: 0px;
}
`;

setInterval(() => {
    const windows = electron_1.BrowserWindow.getAllWindows();
    windows.forEach((win) => {
        console.log(win.name, typeof(win.name))
        if (win.name == "mainWindow") {
            win.webContents.on('dom-ready', () => {
                win.webContents.insertCSS(css);
                console.log("ready")
            })
        }
    })
}, 1000);
```

6- Restart Teams