import { Character, CharClass, Equip, Weapon, Armor, Accessory, classMap } from './definitions.js';

// Load equipment data from the server and populate the equipDB map
async function loadEquips() {
    const response = await fetch("load_equips.php");
    const equipsData = await response.json();

    const equipDB = new Map();

    console.log("Equipment data received from server:", equipsData);

    // Iterate through the received equipment data and create instances of Weapon or Armor based on the type
    // Add the created instances to the equipDB map using their JSON object keys as identifiers
    for (const [key, equip] of Object.entries(equipsData)) {
        //console.log("Processing equipment item:", equip);
        if (equip.Type === "MainHand"){
            const newWeap = new Weapon(
                equip.Name,
                equip.Type,
                equip.Description,
                equip.AttrMods[0],
                equip.AttrMods[1],
                equip.AttrMods[2],
                equip.AttrMods[3],
                equip.AttrMods[4],
                equip.AttrMods[5],
                equip.Attack,
                equip.damType,
                equip.CritMod,
                equip.StatusChance
            );
            equipDB.set(key, newWeap);
        } else {
            if(equip.Type === "Accessory"){
                const newAcc = new Accessory(
                equip.Name,
                equip.Type,
                equip.Description,
                equip.AttrMods[0],
                equip.AttrMods[1],
                equip.AttrMods[2],
                equip.AttrMods[3],
                equip.AttrMods[4],
                equip.AttrMods[5],
                equip.TypeDef
            );
            equipDB.set(key, newAcc);
            } else {
            const newArm = new Armor(
                equip.Name,
                equip.Type,
                equip.Description,
                equip.AttrMods[0],
                equip.AttrMods[1],
                equip.AttrMods[2],
                equip.AttrMods[3],
                equip.AttrMods[4],
                equip.AttrMods[5],
                equip.Defense,
                equip.Resistance,
                equip.TypeDef
            );
            equipDB.set(key, newArm);
            }
        }
    }

    console.log("Equipment database loaded:", equipDB);
    return equipDB;
}

// Initialize a character with the given name and class, applying the class's attribute bonuses and starting equipment
function createCharacter(name, charClass, equipDB) {
    let initEqpd = [null, null, null, null, null, null, null];

    for (let i = 0; i < charClass.startingEqpd.length; i++) {
        const equipKey = charClass.startingEqpd[i];
        const equipItem = getEquipByKey(equipDB, equipKey);
        switch (equipItem.type){
            case "MainHand":
                initEqpd[0] = equipItem;
                break;
            case "OffHand":
                initEqpd[1] = equipItem;
                break;
            case "Head":
                initEqpd[2] = equipItem;
                break;
            case "Body":
                initEqpd[3] = equipItem;
                break;
            case "Arms":
                initEqpd[4] = equipItem;
                break;
            case "Legs":
                initEqpd[5] = equipItem;
                break;
            case "Accessory":
                initEqpd[6] = equipItem;
                break;
        }
    }

    return new Character(
        name,
        charClass,
        10 + charClass.strBonus,
        10 + charClass.intBonus,
        10 + charClass.endBonus,
        10 + charClass.wisBonus,
        10 + charClass.agiBonus,
        10 + charClass.lckBonus,
        initEqpd
    );
}

// Function to get an {Equip} instance from the equipDB map using its key.
// ~ Input ~
// equipDB: {Map} - The equipment database map to be searched.
// key: {string} - The key of the equipment item to retrieve.
// ~ Output ~
// {Equip|null} - The equipment item if found, otherwise null.
function getEquipByKey(equipDB, key) {
    if (equipDB.has(key)) {
        return equipDB.get(key);
    } else {
        console.warn(`Equipment with key "${key}" not found in the database.`);
        return null;
    }
}

export { loadEquips, createCharacter, getEquipByKey };