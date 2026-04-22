import { Character, CharClass, Equip, Weapon, Armor, Accessory, classMap } from './definitions.js';
import { loadEquips, createCharacter, getEquipByKey } from './utils.js';

const equipDB = await loadEquips();

function createCharacterFromInput() {
    console.log('Creating character from input...');

    const nameInput = document.getElementById('name-input');
    const classSelect = document.getElementById('class-select');
    let name = nameInput.value.trim();
    const charClass = classMap.get(classSelect.value.toLowerCase());

    if (!name) {
        name = 'Adventurer';
    }

    return createCharacter(name, charClass, equipDB);
}

function displayCharacterStats(character) {

    console.log('Displaying character stats...');
    console.log(character.toString());

    const statsDisplay = document.getElementById('stats-display');

    while (statsDisplay.firstChild) {
        statsDisplay.removeChild(statsDisplay.firstChild);
    }

    const totalStats = character.calculateTotalStats();

    const nameElem = document.createElement('h2');
    nameElem.textContent = character.name;
    nameElem.id = 'char-name';
    statsDisplay.appendChild(nameElem);

    const classElem = document.createElement('h3');
    classElem.textContent = `Class: ${character.charClass.name}`;
    statsDisplay.appendChild(classElem);

    const coreStats = document.createElement('p');
    coreStats.textContent = `STR: ${totalStats.str} | INT: ${totalStats.int} | END: ${totalStats.end} | WIS: ${totalStats.wis} | AGI: ${totalStats.agi} | LCK: ${totalStats.lck}`;
    statsDisplay.appendChild(coreStats);

    const atkElem = document.createElement('p');
    atkElem.textContent = `Attack: ${totalStats.atk}`;
    statsDisplay.appendChild(atkElem);

    const physDef = document.createElement('p');
    physDef.textContent = `Defense: ${totalStats.def}`;
    statsDisplay.appendChild(physDef);

    const magDef = document.createElement('p');
    magDef.textContent = `Resistance: ${totalStats.res}`;
    statsDisplay.appendChild(magDef);

    const typeDef = document.createElement('p');
    typeDef.textContent = `Blunt: ${totalStats.typeDef[0]}, Slash: ${totalStats.typeDef[1]}, Pierce: ${totalStats.typeDef[2]}, Fire: ${totalStats.typeDef[3]}, Ice: ${totalStats.typeDef[4]}, Lightning: ${totalStats.typeDef[5]}`;
    statsDisplay.appendChild(typeDef);

    const equipList = document.createElement('ul');
    for (let i = 0; i < character.eqpd.length; i++) {
        const equip = character.eqpd[i];
        if (equip) {
            const equipItem = document.createElement('li');
            equipItem.textContent = `${equip.type}: ${equip.name}`;
            equipList.appendChild(equipItem);
        }
    }
    statsDisplay.appendChild(equipList);
}

function onChangeClass() {
    console.log('Class selection changed');
    const character = createCharacterFromInput();
    if (character) {
        displayCharacterStats(character);
    }
}

function onChangeName() {
    console.log('Name input changed');

    const nameElement = document.getElementById('char-name');
    const nameInput = document.getElementById('name-input');
    nameElement.textContent = nameInput.value;
}


function initialize(){
    const classSelect = document.getElementById('class-select');
    for (const charClass of classMap.values()) {
        const option = document.createElement('option');
        option.value = charClass.name.toLowerCase();
        option.textContent = charClass.name;
        classSelect.appendChild(option);
    }

    console.log('Initializing character builder...');
    const character = createCharacter('Adventurer', classMap.get(classSelect.value.toLowerCase()), equipDB);
    displayCharacterStats(character);
}

document.getElementById('class-select').addEventListener('change', onChangeClass);
document.getElementById('name-input').addEventListener('blur', onChangeName);

initialize(); // Initial display with default values