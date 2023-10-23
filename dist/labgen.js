import { generateRandomAmbientPiece, startRandomMusic, stopRandomMusic } from "./genMusic.js";
// Music of the Peers source code - codesbase is based on labyinths3D by Chris Godber / DrNoir 2023

// ---------Reassignable global game stare vars-----
// boomboxes
let boom1; let boom2; let boom3; let boom4; let boom5;
// STORE TEXTURE INFO
let wallTexture = '0'; let floorTexture = 'floor';
// scene Globals / shit 
const mapSource = []; let mapSize;
let gameRunning = false;

// random generators 
function genMapSize() {
    mapSize = getRandomNumber(0, 2) >= 1 ? 5000 : 7500;
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomNumber1() {
    return 0.5+ Math.random() + 0.5
    // return getRandomNumber(0, 100) 
}

// init random spread
const randomSpread = getRandomNumber1();
console.log(randomSpread);

// Function to generate a random 0 or 1
function getRandomBit() {
    const probabilityOfOne = 0.08;

    // Generate a random number between 0 and 1
    const randomValue = Math.random();
    return randomValue < probabilityOfOne ? 1: 0;
}

// paint water 
function paintWater() {
    return 6;
}

//WATER
let waterIndexStr = 0; let waterIndexEnd = 1; let waterWidth = getRandomNumber(10, 100);
// generate random water positions
function randomArrIndexWater() {
    waterIndexStr = getRandomNumber(1, mapSize);
    waterIndexEnd = waterIndexStr + waterWidth;
}

// gen 5 random dwarves indexed
function randomArrIndexDwarves() {
    boom1 = getRandomNumber(0, mapSize);
    boom2 = getRandomNumber(5, mapSize);
    boom3 = getRandomNumber(10, mapSize);
    boom4 = getRandomNumber(15, mapSize);
    boom5 = getRandomNumber(20, mapSize);
}

// genreated randomExit
let randomExit = genRandomExit();
function genRandomExit() {
    return getRandomNumber(waterIndexEnd + 1, mapSize)
}

// Function to generate a random 50-character length array of 0s and 1s
function generateRandomArray() {
    for (let i = 0; i < mapSize; i++) {
        // water
        if (i >= waterIndexStr && i <= waterIndexEnd) {
            mapSource.push(paintWater());
        }
        else if (i === mapSize/2) {
            mapSource.push(2);
        }
        else if (i ===  boom1 || i ===  boom2 || i ===  boom3 || i ===  boom4 || i ===  boom5) {
            mapSource.push(9);
            console.log('dwarf added at' + i)
        }
        // walls
        else {
            mapSource.push(getRandomBit());
        }
    }
    console.log(mapSource);
}

// Function to download a JSON file
function downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}


// Trigger a download of JSON file
function downloadJSONonClick() {
    downloadJSON(mapSource, 'map.json');
}

// INIT LOAD - MAIN LOOP FOR LEVEL LOADING
    // loadNewLevel();


// CHARECETERS AND ENEMIES =--<
//Add chareceter to scene function 
function addBoom() {
    // let randomRotNum = getRandomNumber1();
    let boomBox = document.createElement('a-box');
    boomBox.setAttribute('id', ' boom');
    boomBox.setAttribute('name', ' boombox');
    boomBox.setAttribute('scale', '1 0.8 0.8');
    boomBox.setAttribute('boombox', '');
    boomBox.setAttribute('material', 'src:#' + 'boombox');
    return boomBox;
}

// LEVEL LOADING 
async function loadNewLevel() {
    await stopRandomMusic();
    await clearScene();
    // generate random map Array
    await genMapSize();
    await randomArrIndexWater();
    await randomArrIndexDwarves();
    await generateRandomArray();
    // player pos
    await updatePlayerPos('1 1.5 2');
    // render loop
    await createRooms();
    // start timer
    // await startTimer(10);
    await startRandomMusic();
    GameStarted();
}

// used for scoring to 
function GameStarted(){
    gameRunning = true;
}

function gameEnded(){
    gameRunning = false;
}

function getGameRunningState(){
    return gameRunning;
}

// standard timer countdown function from ChatGPT
function startTimer(minutes) {
    let seconds = minutes * 60;
    const timerInterval = setInterval(function () {
        const minutesDisplay = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secondsDisplay = (seconds % 60).toString().padStart(2, '0');
        if (seconds <= 0) {
            clearInterval(timerInterval);
            // restart here
            console.log("Timer completed!");
            gameEnded();
            window.location.href = "endscreen.html";
        }
        seconds--;
    }, 1000);
}

// trigger a light effect
function triggerPortalLight() {
    const portalEffect = document.getElementById('portalLight');
    portalEffect.setAttribute('visible', 'true');
}

// random texture allocator for walls
function genRandomTexure() {
    // allocate a random texure
    let randTexture = getRandomNumber(0, 3);
    const wallTextures = ['1', '2', '3', '4']
    return wallTextures[randTexture]
}

// random floorAllocator
function genRandomFloorTexture() {
    // allocate a random floor texure
    let randTextureFloor = getRandomNumber(0,1);
    const floorTextures = ['floor', 'floor2']
    return floorTextures[randTextureFloor]
}

// ROOM CREATION
// Create rooms loop - called at init
function createRooms() {
    const mapData = mapSource;
    mapSize === 5000 ? mapSource.height = 100 : mapSource.height = 250;
    mapSize === 5000 ? mapSource.width = 100 : mapSource.width = 250;
    mapSize === 5000 ? mapSource.depth = 100: mapSource.depth = 250;
    // console.log(mapData);
    let exitTexture = 'exit'; let waterTexture = 'water';
    // genearte random Textures for mapping arr creation loop
    // wallTexture = genRandomTexure(); 
    const WALL_SIZE = 1; const WALL_HEIGHT = 2.25; const WATER_HEIGHT = 3.5;
    let el = document.getElementById('room');
    if (el === null) {
        const scene = document.querySelector('a-scene');
        el = document.createElement('a-entity');
        el.setAttribute('id', 'room');
        scene.appendChild(el);
    }

    let wall;
    // LOOP to map geometry 
    for (let x = 0; x < mapSource.height; x++) {
        for (let y = 0; y < mapSource.width; y++) {
            const i = (y * mapSource.width) + x;
            const floorPos = `${((x - (mapSource.width / 2)) * WALL_SIZE)} 0 ${(y - (mapSource.height / 2)) * WALL_SIZE}`;
            const position = `${((x - (mapSource.width / 2)) * WALL_SIZE)} 0 ${(y - (mapSource.height / 2)) * WALL_SIZE}`;
            const playerPos = `${((x - (mapSource.width / 2)) * WALL_SIZE)} 8  ${(y - (mapSource.height / 2)) * WALL_SIZE}`;
            if (mapData[i] === 9) {
                let newBoom = addBoom();
                newBoom.setAttribute('position', {x: position.x, y: 0.1, z: position.z});
                const floor = document.createElement('a-box');
                floor.setAttribute('height', WALL_HEIGHT / 20);
                floor.setAttribute('width', WALL_SIZE);
                floor.setAttribute('depth', WALL_SIZE);
                floor.setAttribute('ammo-body','type: static');
                floor.setAttribute('ammo-shape','type: box');
                floor.setAttribute('position', floorPos);
                floor.setAttribute('material', 'src:#' + 'floor');
                el.appendChild(floor);
                floor.appendChild(newBoom);
            }
            // floor
            if (mapData[i] === 0) {
                floorTexture = genRandomFloorTexture();
                wall = document.createElement('a-box');
                wall.setAttribute('width', WALL_SIZE);
                wall.setAttribute('height', WALL_HEIGHT);
                wall.setAttribute('depth', WALL_SIZE);
                wall.setAttribute('position', position);
                wall.setAttribute('material', 'src:#' + wallTexture);

                wall.setAttribute('class', 'floor');
                wall.setAttribute('height', WALL_HEIGHT / 20);
                wall.setAttribute('ammo-body','type: static;   emitCollisionEvents: true');
                wall.setAttribute('ammo-shape','type: box');
                wall.setAttribute('position', floorPos);
                wall.setAttribute('playermovement', '');
                wall.setAttribute('material', 'src:#' + floorTexture);
                el.appendChild(wall);
            }
            // full height wall
            if (mapData[i] === 1) {
                wallTexture = genRandomTexure(); 
                wall = document.createElement('a-box');
                let randomWidth = getRandomNumber(1,2);
                wall.setAttribute('width', randomWidth );
                let randomDepth = getRandomNumber(1,2);
                wall.setAttribute('depth', randomDepth );

                wall.setAttribute('id', 'wall' + i);
                wall.setAttribute('class', 'wall');
                let randomHeight = getRandomNumber(3,18);
                wall.setAttribute('height', randomHeight);
                wall.setAttribute('ammo-body','type: static;   emitCollisionEvents: true');
                wall.setAttribute('ammo-shape','type: box');
                wall.setAttribute('position', position);
                wall.setAttribute('material', 'src:#' + wallTexture);
                wall.setAttribute('material', 'repeat: 3 6');
                // wall.setAttribute('explosion-on-click', '');
                el.appendChild(wall);
            }
                  // full height wall
                  if (mapData[i] === 2) {
                    floorTexture = genRandomFloorTexture();
                    wall = document.createElement('a-box');
                    wall.setAttribute('width', WALL_SIZE);
                    wall.setAttribute('height', WALL_HEIGHT);
                    wall.setAttribute('depth', WALL_SIZE);
                    wall.setAttribute('position', position);
                    wall.setAttribute('material', 'src:#' + wallTexture);
    
                    wall.setAttribute('class', 'floor');
                    wall.setAttribute('height', WALL_HEIGHT / 20);
                    wall.setAttribute('ammo-shape','type: box');
                    wall.setAttribute('ammo-body','type: static;   emitCollisionEvents: true');
        
                    wall.setAttribute('position', floorPos);
                    wall.setAttribute('playermovement', '');
                    wall.setAttribute('material', 'src:#' + floorTexture);
                    el.appendChild(wall);
                    updatePlayerPos(playerPos);
                }
            //  water
            if (mapData[i] === 6) {
                const water = document.createElement('a-plane');
                water.setAttribute('height',  WATER_HEIGHT / 20);
                water.setAttribute('width', WALL_SIZE);
                water.setAttribute('depth', WALL_SIZE);
                water.setAttribute('ammo-shape','type: box');
                water.setAttribute('ammo-body','type: static;   emitCollisionEvents: true');
  
                water.setAttribute('position', floorPos);
                water.setAttribute('rotation', '90 0 0');
                water.setAttribute('scale', '1 5.72 2');
                water.setAttribute('material', 'src:#water' + '; color:#86c5da; opacity: 0.85; transparent: true;side: double; shader:phong; reflectivity: 0.9; shininess: 70;');
                water.setAttribute('sound', "src:# url(./sound/water.ogg); autoplay: true; positional; maxDistance: 10;")
                el.appendChild(water);
            }
        }
    }
}

// RANDOM AND UTILS ?
// Update Player pos
function updatePlayerPos(newPlayPos) {
    document.querySelector('#rig').setAttribute('position', newPlayPos);
}

var playerEl = document.querySelector("[camera]");
playerEl.addEventListener("collide", function(e) {
  console.log("Player has collided with body #" + e.detail.targetEl.id);
  e.detail.targetEl; // Other entity, which playerEl touched.
});

function clearScene() {
    const el = document.getElementById('room');
    const scene = document.querySelector('a-scene');
    el.parentNode.removeChild(el);
}

// EXPORT FUNCTIONS
export { loadNewLevel, getRandomNumber ,GameStarted , gameEnded, getGameRunningState}