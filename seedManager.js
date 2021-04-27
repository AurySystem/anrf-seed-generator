baseKey = "123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

gamemode = "A";
dupe = "DUPE";
error = "ERROR";
invaildItems = "INVALID ITEM LIST"

function convertToBaseK(val, baseDef) {

    if (typeof val === 'bigint') {
        var result = "";
        var targetBase = BigInt(baseDef.length);
        var valt = val;

        do {
            var temp = (valt % targetBase);
            result = baseDef[temp.valueOf()] + result;
            valt = valt / targetBase;
        }
        while (valt > 0n);
    }
    else {
        var result = "";
        var targetBase = baseDef.length;
        var valt = Math.floor(val);

        do {
            result = baseDef[valt % targetBase] + result;
            valt = Math.floor(valt / targetBase);
        }
        while (valt > 0);
    }
    return result;
}

function convertToBase10( str, baseDef) {
    var result = 0;
    for (var i = 0; i < str.length; i++)
    {
        var idxOfChar = baseDef.indexOf(str[i]);
        result += (idxOfChar * Math.pow(baseDef.length, (str.length - 1) - i));
    }

    return result;
}
console.log(convertToBase10("ZZZZZZ", baseKey));
console.log(convertToBaseK(convertToBase10("ZZZZZZ", baseKey), baseKey));

traversalItems = [
    'RocketLauncher',
    'Dash',
    'FireBolt',
    'ElectroCharge',
    'LightningGun',
    'Flamethrower',
    'DoubleJump',
    'Slide',
    'JetPack',
    'HeatShell',
    'GlowBot',
    'PowerJump',
    'ExplosiveBolt',
    'BrightShell',
    'PhaseShot',
    'Infinijump',
    'ViridianShell',
    'Arachnomorph',
    'RailGun',
    'CognitiveStabilizer',
    'HoverBoots',
    'BuzzsawShell',
    'Phaserang',
    'NecroluminantSpray',
    'UpDog',
    'DiveShell',
    'Kaboomerang',
    'HellfireCannon',
    'PhaseShell',
    'BuzzsawGun',
    'PulseMGL'
];

ultJump = [
    'JetPack',
    'Infinijump',
    'ViridianShell'
];

function isUltJump(id) {
    for (var i in ultJump) {
        if (id == traversalItems.indexOf(ultJump[i])) {
            return true
        }
    }
    return false
}

function isJump(id) {
    let jump = [
        'DoubleJump',
        'PowerJump',
        'HoverBoots',
        'UpDog'
    ];
    for (var i in jump) {
        if (id == traversalItems.indexOf(jump[i])) {
            return true
        }
    }
    return false
}

function getUltJumpid(id) {
    return traversalItems.indexOf(ultJump[id]) 
}

Acheviements = {};

function parseAcheviements(file) {
    var input = file.split("\n");
    var i = 0;
    while (i < input.length) {
        var line = input[i];
        if (line.startsWith("$")) {
            var mode = line.split("$")[1].split(" ")[0];
            console.log(mode)
            Acheviements[mode] = [];
            i++
            while (!(line.startsWith("!"))) {
                var line = input[i];
                var proc = line.split(" ");
                if (!(line.startsWith("!"))) {
                    Acheviements[mode][proc[0]] = proc[1];
                    i++
                }
            }
            
        }
        i++
    }

}
parseAcheviements(file);

function traversalItemListToKey(items, mode)
{
    if (mode == "B") { length = 0; return }
    if (mode == "N") { length = 10; }
    if (mode == "M") { length = 16; }
    var indices = 0n;
    for (i in items) {
        if (items[i] === dupe || items[i] === error) {
            return invaildItems
        }
        var mod = 100n ** BigInt.asUintN(64,i);
        var index = BigInt.asUintN(64,parseInt(items[i])+"" );
        indices += index * mod;
    }
    var key = convertToBaseK(indices, baseKey);

    return key.padStart(length, baseKey[0]);
}

function achievementsToKey(chevos, mode)
{
    var achievementList = [];
    var count = 3;
    var chars = 2;
    var amountPerGroup = 10;
    if (mode == "N") { count = 3; chars = 2; amountPerGroup = 10; achievementList = Acheviements.Normal;}
    if (mode == "B") { count = 4; chars = 2; amountPerGroup = 10; achievementList = Acheviements.BossRush;}
    if (mode == "M") { count = 1; chars = 1; amountPerGroup = 5; achievementList = Acheviements.MegaMap;}

    var achievementGroups = [];
    for (var i = 0; i < count; i++) {
        if (achievementGroups[i] == null || achievementGroups[i] == undefined) {
            achievementGroups[i] = 0n;
        }
    }

    var achievement;
    for (achievement of chevos)
    {
        var index = achievement;
        var group = index / amountPerGroup;
        group = Math.floor(group)
        var spot = index % amountPerGroup;

        if (group < count) {
            spot = BigInt.asUintN(64, BigInt(spot));
            achievementGroups[group] += BigInt.asUintN(64, (1n << spot));
        }
    }

    var key = "";
    for(var g of achievementGroups)
    {
        key += convertToBaseK(g, baseKey).padStart(chars, baseKey[0]);
    }

    return key;
}

function readItems(mode) {
    var length = 7;
    var items = []
    var checkFor = function (input) {
        if (items.indexOf(input) != null && items.indexOf(input) != undefined && items.indexOf(input) != -1) {
            return true
        }
        return false
    }
    if (mode == "N") { length = 7; }
    if (mode == "B") { length = 0; return ""}
    if (mode == "M") { length = 12;}
    for (var i = 0; i < length; i++) {//read in order per mode
        var e = document.getElementById("traversalItem" + mode + (i + 1));
        let temp = e.options[e.selectedIndex];
        if (temp === undefined) {
            temp = error;
        } else {
            temp = temp.value;
        }
        let rndm = Math.round(Math.random() * (traversalItems.length-1));
        if (gamemode != "E") {
            if (i != length - 1) {
                while (isUltJump(rndm)) {
                    rndm = Math.round(Math.random() * (traversalItems.length-1));
                }
                if (isUltJump(temp)) {
                    e.selectedIndex = -1;
                    temp = error;
                }
            } else {
                rndm = getUltJumpid(Math.round(Math.random() * (ultJump.length - 1)));
                if (!isUltJump(temp) && "Random" !== temp) {
                    e.selectedIndex = -1;
                    temp = error;
                }
            }
        }

        for (var t in items) {
            if (items[t] == temp) {
                e.selectedIndex = -1;
                temp = dupe;
            } else if ("Random" === temp) {
                if (gamemode != "E" && i != length - 1) {
                    while (checkFor(rndm) || isUltJump(rndm) || (isJump(rndm) && isJump(items[t]))) {
                        rndm = Math.round(Math.random() * (traversalItems.length - 1));
                    }
                } else {
                    while (checkFor(rndm)) {
                        rndm = Math.round(Math.random() * (traversalItems.length - 1));
                    }
                }
            } else if (gamemode != "E" && i != length - 1) {
                if ((isJump(items[t]) && isJump(temp))) {
                    e.selectedIndex = -1;
                    temp = dupe;
                }
            }

        }

        if (temp === "Random") {
            temp = e.querySelector(`option[value="${rndm}"]`);
            e.selectedIndex = parseInt(temp.index);
            temp = parseInt(rndm);
        }
        items[i] = temp; 
    }
    
    return items
}

function readAcheivements(mode) {
    var length = 14;
    var chevos = []
    if (mode == "N") { length = 14; }
    if (mode == "B") { length = 21;}
    if (mode == "M") { length = 5; }
    var e = document.getElementById("achivements" + mode);
    var temp = e.children;
    for (var i = 0; i < length; i++) {
        if (temp[length].children[0].checked) {
            temp[i].children[0].checked = (Math.random() >= 0.5)? true : false;
        }
        if (temp[i].children[0].checked) {
            let id = temp[i].children[0].id;
            chevos[i] = parseInt(id.replace("chevo" + mode, ""));
        }
    }    
    return chevos
}

function populateItems(mode) {
    var length = 7;
    if (mode == "B") { length = 0; return }
    if (mode == "N") { length = 7; }
    if (mode == "M") { length = 12; }
    var e = document.getElementById("Items");
    var interum = document.createElement("span");
    interum.id = "Items" + mode;

    var text = document.createTextNode("Progression Items: ");
    interum.appendChild(text);

    for (var i = 0; i < length; i++) {
        var box = document.createElement("select");
        box.id = "traversalItem" + mode + (i + 1);
        interum.appendChild(box);
        for (var b = 0; b < traversalItems.length + 1; b++) {
            var opt = document.createElement("option");
            if (b != traversalItems.length) {
                opt.text = traversalItems[b];
                opt.value = b;
            } else {
                opt.text = "Random";
                opt.value = "Random";
            }
            if (gamemode != "E") {
                if (!isUltJump(b) && i != length - 1) {
                    box.add(opt);
                } else if (isUltJump(b) && i == length - 1) {
                    box.add(opt);
                } else if (opt.value == "Random") {
                    box.add(opt);
                }
            } else {
                box.add(opt);
            }
        }
        box.selectedIndex = box.children.length - 1;
    }
    e.appendChild(interum)
}

function populateAcheivements(mode, rndm) {
    var length = 14;
    var achievementList = [];
    var altNames = undefined;
    if (mode == "N") { length = 14; achievementList = Acheviements.Normal; }
    if (mode == "B") { length = 21; achievementList = Acheviements.BossRush; altNames = Acheviements.AltBossRush;}
    if (mode == "M") { length = 5; achievementList = Acheviements.MegaMap; }
    var e = document.getElementById("Chevos");
    var interum = document.createElement("div");
    interum.id = "Chevos" + mode;
    interum.style.display = "inline-block";

    var anchor = document.createElement("span");
    var text1 = document.createTextNode("Active Acheivements");
    var list = document.createElement("ul");
    interum.classList.add('chevo-dropdown');
    anchor.append(text1);
    anchor.tabIndex = 0;
    list.tabIndex = 0;
    var onclick = function (e) {
        let list = document.getElementById("achivements" + mode);
        if (list.classList.contains('visible')) {
            list.classList.remove('visible');
            list.style.display = "none";
        }
        else {
            list.classList.add('visible');
            list.style.display = "block";
        }
    }

    var onblur = function (e) {
        let list = document.getElementById("achivements" + mode);
        var check = document.activeElement;
        setTimeout(function () {
            check = document.activeElement;
            if (list.contains(check) == false) {
                list.classList.remove('visible');
                list.style.display = "none";
            }
        }, 30)
    }

    anchor.onclick = onclick;
    anchor.onblur = onblur;
    list.onblur = onblur;

    anchor.onkeydown = function (e) {
        if (e.code == "Enter") {
            onclick();
        }
    }


    interum.appendChild(anchor);
    interum.appendChild(list);
    list.id = "achivements" + mode;
    e.appendChild(interum);
    for (var b = 0; b < achievementList.length + 1; b++) {
        var opt = document.createElement("li");
        var check = document.createElement("input");
        var text = document.createElement("label");
        if (b == achievementList.length) {
            text.innerText = "Random";
        } else if (altNames != undefined ) {
            if (altNames[b] != undefined) {
                text.innerText = altNames[b];
            } else {
                text.innerText = achievementList[b];
            }
        } else {
            text.innerText = achievementList[b];
        }

        check.type = "checkbox"
        if (b == achievementList.length) {
            text.htmlFor = 'chevo' + mode + "Random";
            check.id = 'chevo' + mode + "Random";
            if (rndm) {
                check.checked = true;
            }
        } else {
            check.id = 'chevo' + mode + b;
            text.htmlFor = 'chevo' + mode + b;
        }
        check.onblur = onblur;
        opt.appendChild(check);
        opt.append(text);
        list.appendChild(opt);
    }
}

function clear(mode) {
    let achievementHolder = document.getElementById("Chevos" + mode);
    let itemListHolder = document.getElementById("Items" + mode);

    if (achievementHolder != null) {
        achievementHolder.remove();
    }
    if (itemListHolder != null) {
        itemListHolder.remove();
    }
}

populateItems("N");
populateAcheivements("N", false);

function readgamemode() {
    clear(curMode(gamemode));
    var e = document.getElementById('mode');
    var rndm = false;
    if (e.options[e.selectedIndex].value == "Random") {
        e.selectedIndex = Math.round(Math.random() * 5);
        rndm = true;
    } else if (e.options[e.selectedIndex].value == "EventRandom") {
        e.selectedIndex = Math.round(Math.random() * 2);
        rndm = true;
    }

    switch (e.options[e.selectedIndex].value) {
        case "Normal":
            gamemode = "A";
            break;
        case "Exterminator":
            gamemode = "E";
            break;
        case "MegaMap":
            gamemode = "M";
            break;
        case "BossRush":
            gamemode = "B";
            break;
        case "MirrorWorld":
            gamemode = "R";
            break;
        case "Spooky":
            gamemode = "4";
            break;
    }
    populateItems(curMode(gamemode));
    populateAcheivements(curMode(gamemode), rndm);
}


function curMode(trueMode) {
    switch (trueMode) {
        case "E":
            return "N";
            break;
        case "R":
            return "N";
            break;
        case "4":
            return "N";
            break;
        case "A":
            return "N";
            break;
        case "B":
            return "B";
            break;
        case "M":
            return "M";
            break;
    }
}

function buildSeed() {
    var gameModeKey = gamemode;
    var rngKey = convertToBaseK(Math.floor(Math.random() * 1838265624 - 1), baseKey).padStart(6, baseKey[0]);
    var traversalKey = traversalItemListToKey(readItems(curMode(gamemode) ), curMode(gamemode) );
    var achievementKey = achievementsToKey(readAcheivements(curMode(gamemode) ), curMode(gamemode) );

    //Mega Map : 1 + 6 + 16 + 1 characters = 24 characters
    //Boss Rush: 1 + 6 + 0 + 8 characters = 15 characters
    //Other Modes : 1 + 6 + 10 + 6 characters = 23 characters
    if (traversalKey == null || traversalKey == undefined) {
        traversalKey = "";
    }
    console.log(gameModeKey + " " + rngKey + " " + traversalKey + " " + achievementKey); //debug display
    var key = gameModeKey + rngKey + traversalKey + achievementKey;
    key = key.padEnd(24, baseKey[0]);
    var temp = [];
    for (var i = 0; i < 4; i++){
        temp[i] = key.substr(i * 6, 6);
    }
    key = temp[0] + " " + temp[1] + " " + temp[2] + " " + temp[3];
    if (traversalKey === invaildItems) {
        key = traversalKey;
    }
    document.getElementById("Seed").innerHTML = key;
    return key;
}