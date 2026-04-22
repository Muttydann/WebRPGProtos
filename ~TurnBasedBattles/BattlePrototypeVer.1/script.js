//--- Object instantiation ---// 
// Player
const player = {
    name: "Player",
    maxHp: 100,
    hp: 100,
    attack: 10,
    defense: 5,
    defending: false
};
// Enemy
const enemy = {
    name: "Enemy",
    maxHp: 80,
    hp: 80,
    attack: 8,
    defense: 3,
    defending: false
};

//--- Global vars ---//
var playerTurn = true; // True if it's player's turn, false for enemy's turn
var turnCount = 1; // Track the number of turns that have passed

//--- DOM elements references ---//
// Status elements
const playerHp = document.getElementById('player-hp');
const enemyHp = document.getElementById('enemy-hp');
// Combat log
const combatLog = document.getElementById('combat-log');
// Action buttons
const atkBut = document.getElementById('attack-btn');
const defBut = document.getElementById('defend-btn');

//--- Functions ---//
// Append a {message} to the combat log
function updateCombatLog(message) {
    const logEntry = document.createElement('p');
    logEntry.textContent = message;
    combatLog.appendChild(logEntry);
    combatLog.scrollTop = combatLog.scrollHeight; // Auto-scroll to the bottom
}
// Add a blank line to the combat log for better separation between turns
function addCombatLogSeparator(name) {
    const separator = document.createElement('hr');
    separator.setAttribute('text', `------ ${name} Turn ${turnCount} ------`);
    combatLog.appendChild(separator);
    combatLog.scrollTop = combatLog.scrollHeight;
}

// Modify hp of {target} by {amount} and update the corresponding hp text
function modifyHp(target, amount) {
    target.hp = Math.max(0, Math.min(target.maxHp, target.hp + amount));
    if (target === player) {
        playerHp.textContent = `HP: ${player.hp}/${player.maxHp}`;
    } else {
        enemyHp.textContent = `HP: ${enemy.hp}/${enemy.maxHp}`;
    }
}
// Start an attack from {attacker} to {defender}, with a delay for better pacing
async function startAttack(attacker, defender) {
    updateCombatLog(`${attacker.name} attacks!`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Delay actual attack calculation for better pacing
    performAttack(attacker, defender);
}

// Perform actual attack calculation
function performAttack(attacker, defender) {
    let damage;
    if (defender.defending) { // If defender is defending, calculate damage with defense multiplier
        damage = Math.floor(Math.max(0, (attacker.attack - defender.defense*2.5)));
        updateCombatLog(`${defender.name} blocks ${attacker.name}'s attack, taking ${damage} damage!`);
    } else {
        damage = Math.floor(Math.max(0, attacker.attack - defender.defense));
        updateCombatLog(`${attacker.name} strikes ${defender.name} for ${damage} damage!`);
    }
    modifyHp(defender, -damage);
}

// Start player's turn, resetting defending status and enabling buttons
function startPlayerTurn() {
    turnCount++;
    addCombatLogSeparator(player.name);
    playerTurn = true;
    atkBut.disabled = false;
    defBut.disabled = false;
    player.defending = false;
}

// Enemy AI: Randomly choose to attack or defend
async function enemyTurn() {
    addCombatLogSeparator(enemy.name);
    enemy.defending = false; // Reset defending status at the start of enemy's turn
    const action = Math.random() < 0.5 ? 'attack' : 'defend';
    if (action === 'attack') {
        await startAttack(enemy, player);
    } else {
        enemy.defending = true;
        updateCombatLog(`${enemy.name} is defending!`);
    }
    startPlayerTurn(); // Start player's turn after enemy's action
}

// Initialize display
function init() {
    playerHp.textContent = `HP: ${player.hp}/${player.maxHp}`;
    enemyHp.textContent = `HP: ${enemy.hp}/${enemy.maxHp}`;
    addCombatLogSeparator(player.name);
}

// Attack button click handler
function attackButtonHandler() {
    if (!playerTurn) return; // Ignore clicks if it's not player's turn
    startAttack(player, enemy);
    playerTurn = false;
    atkBut.disabled = true; // Disable buttons during enemy's turn (may be redundant, but doesn't hurt anything)
    defBut.disabled = true;
    setTimeout(enemyTurn, 1000); // Enemy takes its turn after a short delay
}

// Defend button click handler
function defendButtonHandler() {
    if (!playerTurn) return;
    player.defending = true;
    updateCombatLog(`${player.name} is defending!`);
    playerTurn = false;
    atkBut.disabled = true;
    defBut.disabled = true;
    setTimeout(enemyTurn, 1000);
}

// Attach event listeners
function attachEventListeners() {
    atkBut.addEventListener('click', attackButtonHandler);
    defBut.addEventListener('click', defendButtonHandler);
}

//--- Document load ---//
document.addEventListener('DOMContentLoaded', () => {
    init();
    attachEventListeners();
});


