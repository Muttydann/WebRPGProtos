//--- Object definitions ---//

// Map Tile, which holds references to any adjacent mapTiles {north, east, south, west}, 
// booleans indicating whether those tiles are connected/navigable {northNav, eastNav, southNav, westNav}, 
// and a short description of the room/area {flavor}.
class mapTile {
    constructor(n, e, s, w, nNav, eNav, sNav, wNav, flav) {
        this.north = n;
        this.northNav = nNav;
        this.east = e;
        this.eastNav = eNav;
        this.south = s;
        this.southNav = sNav;
        this.west = w;
        this.westNav = wNav;
        this.flavor = flav;
    }
}

// Player, which holds the current mapTile of the player {currentTile} and a method to move in a given direction {move}.
class player {
    constructor(startTile) {
        this.currentTile = startTile;
    }

    move(direction) {
        switch(direction) {
            case 'north':
                if (this.currentTile.northNav) {
                    this.currentTile = this.currentTile.north;
                    return true;
                }else{
                    console.log("Can't move north!");
                    return false;
                }
                break;
            case 'east':
                if (this.currentTile.eastNav) {
                    this.currentTile = this.currentTile.east;
                    return true;
                }else{
                    console.log("Can't move east!");
                    return false;
                }
                break;
            case 'south':
                if (this.currentTile.southNav) {
                    this.currentTile = this.currentTile.south;
                    return true;
                }else{
                    console.log("Can't move south!");
                    return false;
                }
                break;
            case 'west':
                if (this.currentTile.westNav) {
                    this.currentTile = this.currentTile.west;
                    return true;
                }else{
                    console.log("Can't move west!");
                    return false;
                }
                break;
        }
    }
}

//--- Global Variables ---//

//Map array
let mapArr = [];

//Player object
let playerObj;

//Navigable path chance
let navChance = 0.35;

//--- Functions ---//

// Map generation function, which creates a grid of mapTiles of size {rows} x {cols} with random connections.
// -- Var Types --
// {rows}: int
// {cols}: int
function generateMap(rows, cols) {
    // Create an empty grid of blank mapTiles
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < cols; c++) {
            mapArr.push(new mapTile(null, null, null, null, false, false, false, false, `Tile at (${r}, ${c})`));
        }
    }

    // Assign adjacent tile references based on the grid
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let tile = mapArr[r * cols + c];
            tile.north = r > 0 ? mapArr[(r - 1) * cols + c] : null;
            tile.east = c < cols - 1 ? mapArr[r * cols + (c + 1)] : null;
            tile.south = r < rows - 1 ? mapArr[(r + 1) * cols + c] : null;
            tile.west = c > 0 ? mapArr[r * cols + (c - 1)] : null;
        }
    }

    // Randomly assign navigable directions
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let tile = mapArr[r * cols + c];
            tile.northNav = Math.random() < navChance;
            tile.eastNav = Math.random() < navChance;
            tile.southNav = Math.random() < navChance;
            tile.westNav = Math.random() < navChance;
        }
    }

    return mapArr;
}

// Cleans up the map, ensuring that: 
// 1. All edge tiles have null references for out-of-bounds directions.
// 2. Any tile that has a navigable connection to another tile can also be navigated to from that tile (i.e. if A is north of B and A.northNav is true, then B.southNav must also be true).
// 3. **Every tile is reachable from every other tile (i.e. there are no isolated sections of the map).** > Scrapping to see if it allows for more variety to the map shape
// 4. All tiles have a flavor text, even if it's just an empty string.
// -- Var Types --
// {map}: array of mapTile objects
function ensureMapSanity(map) {
    sanitizeEdges(map);
    ensureBidirectionalNav(map);
    //**ensureFullConnectivity(map);
    ensureFlavorText(map);
}

// Edge sanitization
function sanitizeEdges(map) {
    for (let tile of map) {
        if (!tile.north) {
            tile.northNav = false;
        }
        if (!tile.east) {
            tile.eastNav = false;
        }
        if (!tile.south) {
            tile.southNav = false;
        }
        if (!tile.west) {
            tile.westNav = false;
        }
    }
}

// Bidirectional navigation
function ensureBidirectionalNav(map) {
    for (let tile of map) {
        if (tile.northNav){
            tile.north.southNav = true;
        }
        if (tile.eastNav){
            tile.east.westNav = true;
        }
        if (tile.southNav){
            tile.south.northNav = true;
        }
        if (tile.westNav){
            tile.west.eastNav = true;
        }
    }
}

// Full connectivity
//**function ensureFullConnectivity(map) {

// Ensure flavor text
function ensureFlavorText(map) {
    for (let tile of map) {
        if (!tile.flavor) {
            tile.flavor = "";
        }
    }
}

//Map instantiation, brings it all together
function instantiateMap(rows, cols) {
    let map = generateMap(rows, cols);
    ensureMapSanity(map);
    playerObj = instantiatePlayer(map);
    renderMap(map, rows, cols);
    highlightPlayerTile();
}

// Create visual representation of the map
function renderMap(map, rows, cols) {
    const container = document.querySelector(".map-container");
    container.innerHTML = ""; // Clear previous map

    for (let r = 0; r < rows; r++) {
        let rowDiv = document.createElement("div");
        rowDiv.classList.add("map-row");
        for (let c = 0; c < cols; c++) {
            let tile = map[r * cols + c];
            let tileDiv = document.createElement("div");
            tileDiv.classList.add("map-tile", "unvisited-tile");
            tileDiv.style.borderTopStyle = tile.north ? "none" : "solid";
            tileDiv.style.borderRightStyle = tile.east ? "none" : "solid";
            tileDiv.style.borderBottomStyle = tile.south ? "none" : "solid";
            tileDiv.style.borderLeftStyle = tile.west ? "none" : "solid";
            if (!tile.northNav && !tile.eastNav && !tile.southNav && !tile.westNav) {
                tileDiv.classList.add("wall-tile");
            }
            rowDiv.appendChild(tileDiv);
        }
        container.appendChild(rowDiv);
    }
}

//Place player
function instantiatePlayer(map) {
    return new player(map[0]); // Start at the top-left tile
}

//Highlight player's current tile, mark it visited, and make nearby navigable tiles visible
function highlightPlayerTile() {
    const tiles = document.querySelectorAll(".map-tile");
    tiles.forEach(tile => tile.classList.remove("player-tile"));
    const playerIndex = mapArr.indexOf(playerObj.currentTile);
    if (playerIndex !== -1) {
        tiles[playerIndex].classList.add("player-tile");
        if(tiles[playerIndex].classList.contains("unvisited-tile")){
            tiles[playerIndex].classList.remove("unvisited-tile");
            tiles[playerIndex].classList.add("visited-tile");
            if(!mapArr[playerIndex].northNav){
                tiles[playerIndex].style.borderTopStyle = "solid";
                tiles[playerIndex].style.borderTopWidth = "2px";
            }else{
                tiles[playerIndex].style.borderTopStyle = "dashed";
            }
            if(!mapArr[playerIndex].eastNav){
                tiles[playerIndex].style.borderRightStyle = "solid";
                tiles[playerIndex].style.borderRightWidth = "2px";
            }else{
                tiles[playerIndex].style.borderRightStyle = "dashed";
            }
            if(!mapArr[playerIndex].southNav){
                tiles[playerIndex].style.borderBottomStyle = "solid";
                tiles[playerIndex].style.borderBottomWidth = "2px";
            }else{
                tiles[playerIndex].style.borderBottomStyle = "dashed";
            }
            if(!mapArr[playerIndex].westNav){
                tiles[playerIndex].style.borderLeftStyle = "solid";
                tiles[playerIndex].style.borderLeftWidth = "2px";
            }else{
                tiles[playerIndex].style.borderLeftStyle = "dashed";
            }
        }
        if(tiles[playerIndex].classList.contains("visible-tile")){
            tiles[playerIndex].classList.remove("visible-tile");
            tiles[playerIndex].classList.add("visited-tile");
        }
        // Mark adjacent navigable tiles as visible and add dashed border, otherwise make border solid to indicate it's not navigable, and add solid borders to non-navigable adjacent tiles
            let currentTile = playerObj.currentTile;
            if (currentTile.northNav) {
                let northIndex = mapArr.indexOf(currentTile.north);
                if (tiles[northIndex].classList.contains("unvisited-tile")) {
                    tiles[northIndex].classList.add("visible-tile");
                    tiles[northIndex].style.borderBottomStyle = "dashed";
                    if(!mapArr[northIndex].westNav){
                        tiles[northIndex].style.borderLeftStyle = "solid";
                        tiles[northIndex].style.borderLeftWidth = "2px";
                    }else{
                        tiles[northIndex].style.borderLeftStyle = "dashed";
                    }
                    if(!mapArr[northIndex].eastNav){
                        tiles[northIndex].style.borderRightStyle = "solid";
                        tiles[northIndex].style.borderRightWidth = "2px";
                    }else{
                        tiles[northIndex].style.borderRightStyle = "dashed";
                    }
                    if(!mapArr[northIndex].northNav){
                        tiles[northIndex].style.borderTopStyle = "solid";
                        tiles[northIndex].style.borderTopWidth = "2px";
                    }else{
                        tiles[northIndex].style.borderTopStyle = "dashed";
                    }
                }
            }else{
                if(currentTile.north){
                    let northIndex = mapArr.indexOf(currentTile.north);
                    tiles[northIndex].style.borderBottomStyle = "solid";
                    tiles[northIndex].style.borderBottomWidth = "2px";
                }
            }
            if (currentTile.eastNav) {
                let eastIndex = mapArr.indexOf(currentTile.east);
                if (tiles[eastIndex].classList.contains("unvisited-tile")) {
                    tiles[eastIndex].classList.add("visible-tile");
                    tiles[eastIndex].style.borderLeftStyle = "dashed";
                    if(!mapArr[eastIndex].southNav){
                        tiles[eastIndex].style.borderBottomStyle = "solid";
                        tiles[eastIndex].style.borderBottomWidth = "2px";
                    }else{
                        tiles[eastIndex].style.borderBottomStyle = "dashed";
                    }
                    if(!mapArr[eastIndex].northNav){
                        tiles[eastIndex].style.borderTopStyle = "solid";
                        tiles[eastIndex].style.borderTopWidth = "2px";
                    }else{
                        tiles[eastIndex].style.borderTopStyle = "dashed";
                    }
                    if(!mapArr[eastIndex].eastNav){
                        tiles[eastIndex].style.borderRightStyle = "solid";
                        tiles[eastIndex].style.borderRightWidth = "2px";
                    }else{
                        tiles[eastIndex].style.borderRightStyle = "dashed";
                    }
                }
            }else{
                if(currentTile.east){
                    let eastIndex = mapArr.indexOf(currentTile.east);
                    tiles[eastIndex].style.borderLeftStyle = "solid";
                    tiles[eastIndex].style.borderLeftWidth = "2px";
                }
            }
            if (currentTile.southNav) {
                let southIndex = mapArr.indexOf(currentTile.south);
                if (tiles[southIndex].classList.contains("unvisited-tile")) {
                    tiles[southIndex].classList.add("visible-tile");
                    tiles[southIndex].style.borderTopStyle = "dashed";
                    if(!mapArr[southIndex].westNav){
                        tiles[southIndex].style.borderLeftStyle = "solid";
                        tiles[southIndex].style.borderLeftWidth = "2px";
                    }else{
                        tiles[southIndex].style.borderLeftStyle = "dashed";
                    }
                    if(!mapArr[southIndex].eastNav){
                        tiles[southIndex].style.borderRightStyle = "solid";
                        tiles[southIndex].style.borderRightWidth = "2px";
                    }else{
                        tiles[southIndex].style.borderRightStyle = "dashed";
                    }
                    if(!mapArr[southIndex].southNav){
                        tiles[southIndex].style.borderBottomStyle = "solid";
                        tiles[southIndex].style.borderBottomWidth = "2px";
                    }else{
                        tiles[southIndex].style.borderBottomStyle = "dashed";
                    }
                }
            }else{
                if(currentTile.south){
                    let southIndex = mapArr.indexOf(currentTile.south);
                    tiles[southIndex].style.borderTopStyle = "solid";
                    tiles[southIndex].style.borderTopWidth = "2px";
                }
            }
            if (currentTile.westNav) {
                let westIndex = mapArr.indexOf(currentTile.west);
                if (tiles[westIndex].classList.contains("unvisited-tile")) {
                    tiles[westIndex].classList.add("visible-tile");
                    tiles[westIndex].style.borderRightStyle = "dashed";
                    if(!mapArr[westIndex].southNav){
                        tiles[westIndex].style.borderBottomStyle = "solid";
                        tiles[westIndex].style.borderBottomWidth = "2px";
                    }else{
                        tiles[westIndex].style.borderBottomStyle = "dashed";
                    }
                    if(!mapArr[westIndex].northNav){
                        tiles[westIndex].style.borderTopStyle = "solid";
                        tiles[westIndex].style.borderTopWidth = "2px";
                    }else{
                        tiles[westIndex].style.borderTopStyle = "dashed";
                    }
                    if(!mapArr[westIndex].westNav){
                        tiles[westIndex].style.borderLeftStyle = "solid";
                        tiles[westIndex].style.borderLeftWidth = "2px";
                    }else{
                        tiles[westIndex].style.borderLeftStyle = "dashed";
                    }
                }
            }else{
                if(currentTile.west){
                    let westIndex = mapArr.indexOf(currentTile.west);
                    tiles[westIndex].style.borderRightStyle = "solid";
                    tiles[westIndex].style.borderRightWidth = "2px";
                }
            }
    }
}

// Debug function to print the map to the console in a readable format
function printMap(map, rows, cols) {
    for (let r = 0; r < rows; r++) {
        let rowStr = "";
        for (let c = 0; c < cols; c++) {
            let tile = map[r * cols + c];
            rowStr += `[${tile.northNav ? "N" : "_"}${tile.eastNav ? "E" : "_"}${tile.southNav ? "S" : "_"}${tile.westNav ? "W" : "_"}] `;
        }
        console.log(rowStr);
    }
}

//--- Event Listeners ---//

// On page load, generate the map, ensure its sanity, instantiate the player, and render the map.
addEventListener("DOMContentLoaded", () => {
    const genBtn = document.getElementById("gen_btn");
    genBtn.addEventListener("click", () => instantiateMap(5, 5));

    const rows = 5;
    const cols = 5;
    let gameMap = generateMap(rows, cols);
    ensureMapSanity(gameMap);

    playerObj = instantiatePlayer(gameMap);

    renderMap(gameMap, rows, cols);
    highlightPlayerTile();

    printMap(gameMap, rows, cols);
});

// Listen for arrow key presses to move the player in the corresponding direction, and log the result.
addEventListener("keydown", (event) => {
    const directionKeys = {
        "ArrowUp": "north",
        "w": "north",
        "ArrowRight": "east",
        "d": "east",
        "ArrowDown": "south",
        "s": "south",
        "ArrowLeft": "west",
        "a": "west"
    };
    if (directionKeys[event.key]) {
        const moved = playerObj.move(directionKeys[event.key]);
        if (moved) {
            highlightPlayerTile();
            console.log(`Moved ${directionKeys[event.key]}.`);
        }
    }
});