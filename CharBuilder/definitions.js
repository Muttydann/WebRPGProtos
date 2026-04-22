//--- Class Definitions ---//

// Character Class
// This class defines the structure of a character, including their name, attributes (strength, intelligence, endurance, wisdom, agility, luck), and equipment.
// ~ Variable Descriptions ~
// name: 'String'               - The name of the character
// str: 'Integer'               - The strength attribute of the character
// int: 'Integer'               - The intelligence attribute of the character
// end: 'Integer'               - The endurance attribute of the character
// wis: 'Integer'               - The wisdom attribute of the character
// agi: 'Integer'               - The agility attribute of the character
// lck: 'Integer'               - The luck attribute of the character
//
// atk: 'Integer'               - The attack value of the character, calculated from strength and equipment modifiers
// def: 'Integer'               - The physical defense value of the character, calculated from endurance and equipment modifiers
// res: 'Integer'               - The magical resistance value of the character, calculated from intelligence and equipment modifiers
// typeDef: 'Array'             - An array of integers that represent the character's modifiers to damage taken for specific damage types, with each index corresponding to a particular damage type.
//
// eqpd: 'Array'                - An array that represents the character's equipment slots, with each specific index corresponding to a particular slot. Intended to store only {Equip}'s or nulls.
//      ~ Equipment Slot Indexes ~
//      0: 'MainHand'                - The main hand slot
//      1: 'OffHand'                 - The off hand slot
//      2: 'Head'                    - The head slot
//      3: 'Body'                    - The body slot
//      4: 'Arms'                    - The arms slot
//      5: 'Legs'                    - The legs slot
//      6: 'Accessory'               - The accessory slot
class Character {
    constructor(name, charClass, str, int, end, wis, agi, lck, eqpd) {
        this.name = name;
        this.charClass = charClass;
        this.str = str;
        this.int = int;
        this.end = end;
        this.wis = wis;
        this.agi = agi;
        this.lck = lck;
        this.eqpd = eqpd;

        this.critChance = Math.floor(this.lck / 2); // Base crit chance is 1% for every 2 points of luck
    }

    // Function for calculating the character's total stats including equipment modifiers
    calculateTotalStats() {
        let totalStr = this.str;
        let totalInt = this.int;
        let totalEnd = this.end;
        let totalWis = this.wis;
        let totalAgi = this.agi;
        let totalLck = this.lck;
        let totalAtk = this.str;
        let totalDef = this.end;
        let totalRes = this.wis;
        let totalTypeDef = [0, 0, 0, 0, 0, 0];
        let totalCritChance = 0;

        for (const equip of this.eqpd) {
            if (equip) {
                totalStr += equip.strMod;
                totalInt += equip.intMod;
                totalEnd += equip.endMod;
                totalWis += equip.wisMod;
                totalAgi += equip.agiMod;
                totalLck += equip.lckMod;
                if(equip instanceof Armor) {
                    if(equip.type !== "Accessory") { // Accessories do not contribute to defense or resistance
                        totalDef += equip.defense;
                        totalRes += equip.resistance;
                    }
                    for (let i = 0; i < totalTypeDef.length; i++) {
                        totalTypeDef[i] += equip.typeMods[i];
                    }
                }else if(equip instanceof Weapon) {
                    totalAtk += equip.attackPower;
                    totalCritChance += equip.critMod;
                }
            }
        }

        totalCritChance += Math.floor(totalLck / 2); // Recalculate crit chance with total luck

        return {
            str: totalStr,
            int: totalInt,
            end: totalEnd,
            wis: totalWis,
            agi: totalAgi,
            lck: totalLck,
            atk: totalAtk,
            def: totalDef,
            res: totalRes,
            typeDef: totalTypeDef,
            critChance: totalCritChance

        };
    }

    toString() {
        const totalStats = this.calculateTotalStats();
        return `Name: ${this.name}\n` +
               `Class: ${this.charClass.name}\n` +
               `Base Stats - STR: ${this.str}, INT: ${this.int}, END: ${this.end}, WIS: ${this.wis}, AGI: ${this.agi}, LCK: ${this.lck}\n` +
               `Current Stats - STR: ${totalStats.str}, INT: ${totalStats.int}, END: ${totalStats.end}, WIS: ${totalStats.wis}, AGI: ${totalStats.agi}, LCK: ${totalStats.lck}\n` +
               `Attack: ${totalStats.atk} (Crit Chance: ${totalStats.critChance}%)\n` +
               `Defense: ${totalStats.def}\n` +
               `Resistance: ${totalStats.res}\n` +
               `- Type Defenses - \n` +
                `  Blunt: ${totalStats.typeDef[0]}\n` +
                `  Slash: ${totalStats.typeDef[1]}\n` +
                `  Pierce: ${totalStats.typeDef[2]}\n` +
                `  Fire: ${totalStats.typeDef[3]}\n` +
                `  Ice: ${totalStats.typeDef[4]}\n` +
                `  Lightning: ${totalStats.typeDef[5]}\n` +
               `- Equipment -\n` +
               `  Main Hand: ${this.eqpd[0] ? this.eqpd[0].name : "None"}\n` +
               `  Off Hand: ${this.eqpd[1] ? this.eqpd[1].name : "None"}\n` +
               `  Head: ${this.eqpd[2] ? this.eqpd[2].name : "None"}\n` +
               `  Body: ${this.eqpd[3] ? this.eqpd[3].name : "None"}\n` +
               `  Arms: ${this.eqpd[4] ? this.eqpd[4].name : "None"}\n` +
               `  Legs: ${this.eqpd[5] ? this.eqpd[5].name : "None"}\n` +
               `  Accessory: ${this.eqpd[6] ? this.eqpd[6].name : "None"}`;
    }
}

// Character Class Class
// This class defines the structure of a character class, including its name, description, starting attribute bonuses, and initial equipment.
// ~ Variable Descriptions ~
// name: 'String'               - The name of the class
// desc: 'String'               - A description of the class
// strBonus: 'Integer'          - The bonus to strength that characters of this class receive during character creation
// intBonus: 'Integer'          - The bonus to intelligence that characters of this class receive during character creation
// endBonus: 'Integer'          - The bonus to endurance that characters of this class receive during character creation
// wisBonus: 'Integer'          - The bonus to wisdom that characters of this class receive during character creation
// agiBonus: 'Integer'          - The bonus to agility that characters of this class receive during character creation
// lckBonus: 'Integer'          - The bonus to luck that characters of this class receive during character creation
// startingEqpd: 'Array'        - An array containing the initial equipment for characters of this class, using keys to be searched within the equipment database. 
//                                Follows the same slot structure as the 'eqpd' variable in the {Character} class.
class CharClass {
    constructor(name, desc, strBonus, intBonus, endBonus, wisBonus, agiBonus, lckBonus, startingEqpd) {
        this.name = name;
        this.desc = desc;
        this.strBonus = strBonus;
        this.intBonus = intBonus;
        this.endBonus = endBonus;
        this.wisBonus = wisBonus;
        this.agiBonus = agiBonus;
        this.lckBonus = lckBonus;
        this.startingEqpd = startingEqpd;
    }
}

// Equipment Class
// This class defines the shared structure of all equipment items, including name, type, description, and stat modifiers.
// ~ Variable Descriptions ~
// name: 'String'               - The name of the equipment item
// type: 'String'               - The type of equipment (e.g., 'Weapon', 'Armor', 'Accessory')
// desc: 'String'               - The description of the equipment item
// strMod: 'Integer'            - The strength modifier provided by the equipment
// intMod: 'Integer'            - The intelligence modifier provided by the equipment
// endMod: 'Integer'            - The endurance modifier provided by the equipment
// wisMod: 'Integer'            - The wisdom modifier provided by the equipment
// agiMod: 'Integer'            - The agility modifier provided by the equipment
// lckMod: 'Integer'            - The luck modifier provided by the equipment
// flags: 'Array'               - An array of strings that represent special properties or flags associated with the equipment item (e.g., "Two-Handed", "Staff", "Regen" etc.)
// flagVals: 'Array'            - An array of values corresponding to the flags, providing additional information or parameters for the flags
class Equip {
    constructor(name, type, desc, strMod, intMod, endMod, wisMod, agiMod, lckMod, flags, flagVals) {
        this.name = name;
        this.type = type;
        this.desc = desc;
        this.strMod = strMod;
        this.intMod = intMod;
        this.endMod = endMod;
        this.wisMod = wisMod;
        this.agiMod = agiMod;
        this.lckMod = lckMod;
        this.flags = flags;
        this.flagVals = flagVals;
    }
}


// Weapon Class (subclass of {Equip})
// This class defines the structure of a weapon, including attack power, damage type, crit chance, and status chances.
// ~ Variable Descriptions ~
// attackPower: 'Integer'       - The attack power of the weapon, which contributes to damage calculation
// damageType: 'Array'          - An array of strings that describe the types of damage the weapon can inflict.
//      ~ Damage Types ~
//      'Blunt (P)'                   - The blunt damage type
//      'Slash (P)'                   - The slash damage type
//      'Pierce (P)'                  - The pierce damage type
//      'Fire (M)'                    - The fire damage type
//      'Ice (M)'                     - The ice damage type
//      'Lightning (M)'               - The lightning damage type
//      'Void (V)'                    - The void damage type (cannot be resisted)
// critMod: 'Integer'           - The weapon's modifier to critical hit chance
// statusChance: 'Array'        - An array of integers that represent the weapon's chance to inflict specific status effects on hit, with each index corresponding to a particular status effect.
//      ~ Status Effect Indexes ~
//      0: 'Bleed'                   - The chance to inflict the Bleed status effect, causing damage over time
//      1: 'Poison'                  - The chance to inflict the Poison status effect, causing damage over time
//      2: 'Stun'                    - The chance to inflict the Stun status effect, causing the target to lose accuracy and evasion for a short duration
//      3: 'Burn'                    - The chance to inflict the Burn status effect, causing damage over time
//      4: 'Silence'                 - The chance to inflict the Silence status effect, preventing the use of magic or sound-based abilities for a short duration
class Weapon extends Equip {
    constructor(name, type, desc, strMod, intMod, endMod, wisMod, agiMod, lckMod, attackPower, damageType, critMod, statusChance) {
        super(name, type, desc, strMod, intMod, endMod, wisMod, agiMod, lckMod);
        this.attackPower = attackPower;
        this.damageType = damageType;
        this.critMod = critMod;
        this.statusChance = statusChance;
    }
}

// Armor Class (subclass of {Equip})
// This class defines the structure of a piece of armor, including defense and damage modifiers for each damage type.
// ~ Variable Descriptions ~
// genDef: 'Integer'          - The defense value of the armor, which contributes to damage reduction calculation
// typeDef: 'Array'           - An array of integers that represent the armor's modifiers to damage taken for specific damage types, with each index corresponding to a particular damage type.
//      ~ Damage Type Indexes ~
//      0: 'Blunt (P)'                   - The modifier to damage taken from blunt attacks
//      1: 'Slash (P)'                   - The modifier to damage taken from slash attacks
//      2: 'Pierce (P)'                  - The modifier to damage taken from pierce attacks
//      3: 'Fire (M)'                    - The modifier to damage taken from fire attacks
//      4: 'Ice (M)'                     - The modifier to damage taken from ice attacks
//      5: 'Lightning (M)'               - The modifier to damage taken from lightning attacks
//      - Note: As Void (V) damage cannot be resisted, there is no modifier for it, and thus no index for it in this array.
class Armor extends Equip {
    constructor(name, type, desc, strMod, intMod, endMod, wisMod, agiMod, lckMod, phyDef, magDef, typeDef) {
        super(name, type, desc, strMod, intMod, endMod, wisMod, agiMod, lckMod);
        this.defense = phyDef;
        this.resistance = magDef;
        this.typeMods = typeDef;
    }
}

//Accessory Class (subclass of {Equip})
// This class defines the structure of an accessory, which functions similarly to armor but does not contribute to physical defense or magical resistance.
// Accessories are intended to provide unique modifiers and utility without directly increasing survivability through defense or resistance.
class Accessory extends Equip {
    constructor(name, type, desc, strMod, intMod, endMod, wisMod, agiMod, lckMod, typeDef) {
        super(name, type, desc, strMod, intMod, endMod, wisMod, agiMod, lckMod);
        this.typeMods = typeDef;
    }
}

//--- Character Class Definitions ---//

// Knight Class
// Typical durable melee fighter.
const classKnight = new CharClass(
    'Knight',
    'A warrior clad in heavy armor, specializing in melee combat and defense.',
    3, -1, 4, 1, -1, 0,
    ["Longsword", "KnightShield", "IronHelm", "PlateArmor", "ArmGuards", "IronLegs"]
);

// Novice Class
// Basic all-rounder, not particularly good or bad at anything.
const classNovice = new CharClass(
    'Novice',
    'A seemingly unremarkable individual, but with great potential.',
    1, 1, 1, 1, 1, 1,
    ["Shortsword", "CoolHat", "LeatherArmor"]
);

const classMage = new CharClass(
    'Mage',
    'A spellcaster, with a natural affinity for magic but lacking in physical prowess.',
    -1, 5, -1, 3, 0, 0,
    ["InitiateStaff", "InitiateHood", "InitiateRobe"]
);

const classMap = new Map();
classMap.set(classKnight.name.toLowerCase(), classKnight);
classMap.set(classNovice.name.toLowerCase(), classNovice);
classMap.set(classMage.name.toLowerCase(), classMage);

export { Character, CharClass, Equip, Weapon, Armor, Accessory, classMap };