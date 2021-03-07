baseKey = "123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function convertToBaseK(val, baseDef) {

    if (typeof val === 'bigint') {
        var result = "";
        var targetBase = BigInt(baseDef.length);
        var valt = val;

        do {
            var temp = (valt % targetBase)
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
            while (!(line.startsWith("!"))) {//todo add a check for boss rush that renames the achiements to the corosponding bosses
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
    //honestly this lil bit's just a one to one port mostly 
    var indices = 0;
    for (i in items) {
        var mod = 100 ** i;
        var index = items[i];
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
    if (mode == "N") { length = 7; }
    if (mode == "B") { length = 0; return null}
    if (mode == "M") { length = 10;}
    for (var i = 0; i < length; i++) {//read in order per mode
        var e = document.getElementById("traversalItem" + mode + (i + 1));
        items[i] = e.options[e.selectedIndex].value;
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
    for (var i = 0; i < temp.length; i++) {
        if (temp[i].children[0].checked) {
            let id = temp[i].children[0].id;
            chevos[i] = parseInt(id.replace("chevo"+mode,""));
        }
    }
    return chevos
}

function populateItems(mode) {
    var length = 7;
    if (mode == "B") { length = 0; return }
    if (mode == "N") { length = 7; }
    if (mode == "M") { length = 10; }
    var e = document.getElementById("Items" + mode);

    for (var i = 0; i < length; i++) {
        var box = document.createElement("select");
        box.id = "traversalItem" + mode + (i + 1);
        e.appendChild(box);
        for (var b = 0; b < traversalItems.length; b++) {
            var opt = document.createElement("option");
            opt.text = traversalItems[b];
            opt.value = b;
            box.add(opt);
        }
    }
}

function populateAcheivements(mode) {
    var length = 14;
    var achievementList = [];
    if (mode == "N") { length = 14; achievementList = Acheviements.Normal; }
    if (mode == "B") { length = 21; achievementList = Acheviements.BossRush; }
    if (mode == "M") { length = 5; achievementList = Acheviements.MegaMap; }
    var e = document.getElementById("Chevos" + mode);
    var box = document.createElement("span");
    var anchor = document.createElement("span");
    var text1 = document.createTextNode("achivements");
    var list = document.createElement("ul");
    anchor.append(text1);

    anchor.onclick = function (e) {
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

    box.appendChild(anchor);
    box.appendChild(list);
    list.id = "achivements" + mode;
    e.appendChild(box);
    for (var b = 0; b < achievementList.length; b++) {
        var opt = document.createElement("li");
        var check = document.createElement("input");
        var text = document.createTextNode(achievementList[b]);

        check.type = "checkbox"
        check.id = 'chevo'+mode+b
        opt.appendChild(check);
        opt.append(text);
        list.appendChild(opt);
    }
}

populateItems("N");
populateAcheivements("N");

function buildSeed() {
    var gameModeKey = "A";
    var seedKey = convertToBaseK(Math.floor(Math.random() * 1838265624 - 1), baseKey).padStart(6, baseKey[0]);
    var traversalKey = traversalItemListToKey(readItems("N"), "N");
    var achievementKey = achievementsToKey(readAcheivements("N"), "N");

    //Mega Map : 1 + 6 + 16 + 1 characters = 24 characters
    //Boss Rush: 1 + 6 + 0 + 8 characters = 15 characters
    //Other Modes : 1 + 6 + 10 + 6 characters = 23 characters

    console.log(gameModeKey + " " + seedKey + " " + traversalKey + " " + achievementKey); //debug display
    var key = gameModeKey + seedKey + traversalKey + achievementKey;
    key = key.padEnd(24, baseKey[0]);
    var temp = [];
    for (var i = 0; i < 4; i++){
        temp[i] = key.substr(i * 6, 6);
    }
    key = temp[0] + " " + temp[1] + " " + temp[2] + " " + temp[3];
    document.getElementById("SeedN").innerHTML = key;
    return key;
}