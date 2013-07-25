var notifications = 0
var title = document.title
var flashActive = false;
var activeVisible = false;
var favicon = {
    url:'favicon.ico'
}
var activeFavicon = {
    url:'favicon_red_on_white.ico'
}

function removeOldFavicons() {
    var dynamicFavicons = document.getElementsByClassName('dynamicFavicon');
    for (var i = 0; i < dynamicFavicons.length; i++) {
        dynamicFavicons[i].parentNode.removeChild(dynamicFavicons[i])
    }
}

function createAndSetFavicon(favicon) {
    removeOldFavicons();

    var canvas = document.createElement('canvas');
    canvas.width = canvas.height = 16;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(favicon.img, 0, 0);

    var link = document.createElement('link');
    link.className = 'dynamicFavicon'
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = canvas.toDataURL("image/x-icon");
    document.getElementsByTagName('head')[0].appendChild(link);
}

function updateFavicon(favicon) {
    if (favicon.img == undefined) {
        favicon.img = new Image();
        favicon.img.src = favicon.url;
    }

    favicon.img.onload = function() {
        createAndSetFavicon(favicon);
    }

    if (favicon.img.complete)
        createAndSetFavicon(favicon);
}

function updateNumUnread(n) {
    if (notifications && n == 0) {
        notifications = n;
        clearTimeout();
        document.title = title
        updateFavicon(favicon)
        activeVisible = false;
    }
    else if (!notifications && n) {
        notifications = n;
        document.title = '(' + n + ') ' + title
        updateFavicon(activeFavicon)
        activeVisible = true;
        if (flashActive) {
            startFlashing();
        }
    }
    else if (notifications != n && n > 0) {
        notifications = n;
        document.title = '(' + n + ') ' + title
    }
}

function startFlashing() {
    if (flashActive && notifications) {
        updateFavicon(activeVisible? favicon: activeFavicon)
        activeVisible = !activeVisible;

        setTimeout(function () {
            startFlashing();
        }, 1500)
    }
    else if (!flashActive && !notifications) {
        activeVisible = false;
        updateFavicon(favicon);
    }
    else if (!flashActive && notifications) {
        activeVisible = true;
        updateFavicon(activeFavicon);
    }
}

function flashActiveToggle() {
    flashActive = !flashActive;
    if (flashActive && notifications)
        startFlashing();
    else if (!flashActive && !notifications) {
        clearTimeout();
        updateFavicon(favicon);
    }
    else if (!flashActive && notifications) {
        clearTimeout();
        updateFavicon(activeFavicon);
    }
}

function changeActiveFavicon(button) {
    if (activeFavicon.url == 'favicon_red_on_white.ico') {
        activeFavicon.url = 'favicon_white_on_red.ico'
        activeFavicon.img = undefined;
        button.text = 'Change Active to Red on White';
    }
    else {
        activeFavicon.url = 'favicon_red_on_white.ico';    
        activeFavicon.img = undefined;
        button.text = 'Change Active to White on Red';
    }

    if (notifications)
        updateFavicon(activeFavicon);
}

updateFavicon(favicon);
