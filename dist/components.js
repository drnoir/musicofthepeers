// BARROWLANDS VR component system
// Components BASED OFF labrinth generator VR / AR
// Dependency tree - A-Frame / A-Frame Extras / labgen / scoring.js

// ENGINE CORE IMPORTS
import {getRandomNumber,  loadNewLevel} from "./labgen.js";
import {updateScore} from "./scoring.js";
import { invokeTone, stopRandomMusic, startRandomMusic, startRandomMusic2 } from "./genMusic.js";
// for step checking
let firstStep = true;
// score updating
let portalsFound = 0; let wallsDestroyed = 0; let StepsTakenScore = 0;

// PLAYER CAM componenet
AFRAME.registerComponent('playercam', {
    schema: {
        color: { type: 'color', default: 'white' },
        position: { type: 'string', default: '0 0 -3' },
        scale: { type: 'string', default: '1 1 1' },
        camNum: { type: 'number', default: 1 },
        camTestMode: { type: 'boolean', default: false },
        facePathID: { type: 'string', default: '#playerFace' },
        facePathMtl: { type: 'string', default: '#playerFaceMat' }
    },
    init: function () {
        const data = this.data;
        const el = this.el;
        let pos = data.position;
        let camnum = data.camNum;
 
        const newCursor = document.createElement('a-entity');
        const newCam = document.createElement('a-entity');
    
        // create cam
        newCam.setAttribute('position', pos);
        newCam.setAttribute('id', 'player');
        newCam.setAttribute('class', 'cam' + camnum);
        // testing mode allows for wasd for wondering around
        if (data.camTestMode) {
            newCam.setAttribute('wasd-controls', '');
        }
        newCam.setAttribute('look-controls', '');
        newCam.setAttribute('camera', '');
        scene.appendChild(newCam);
        // create cursor
        newCursor.setAttribute('position', '0 0 -1');
        newCursor.setAttribute('cursor', 'fuse: true; fiseTimeout:500');
        newCursor.setAttribute('geometry', 'primitive: ring; radiusInner: 0.02; radiusOuter: 0.03');
        newCursor.setAttribute('material', 'color: black; shader: flat');
        newCam.appendChild(newCursor);
    },
    remove: function () {
        this.el.destroy();
    },
});


// NPC AI - Pathing and behaviours boombox
AFRAME.registerComponent('boombox', {
    multiple: true,
    init: function () {
        const el = this.el;
        // on gaze cursor interaction
        el.addEventListener('click', function (evt) {
            // PLAY SOUND OF boom box
                const torch = document.querySelector('#torch')
                torch.emit(`animation`, null, false);
                setTimeout(torch.emit(`animation__2`, null, false), 2000);
            
            stopRandomMusic();
            Math.random() < 0.5 ? startRandomMusic() : startRandomMusic2();
        });
    },
    tick: function (time, timeDelta) {

    },
    remove: function () {
        const el = this.el;
        el.destroy();
    },
});

// Positioning component
AFRAME.registerComponent('playermovement', {
    init: function () {
        const el = this.el;
        el.addEventListener('click', function (evt) {
            let newPos = el.object3D.position;
            const playercam = document.getElementById('playercam');
            const playercamPos = document.getElementById('playercam').object3D.position;
            // distance checking
            console.log(newPos.x, newPos.z);
            let distanceCheck = playercamPos.distanceTo(newPos);
            console.log(distanceCheck);
            if (distanceCheck <= 3.5) {
                let walkAudio = document.querySelector("#walk");
                if (firstStep) {
                    walkAudio.play();
                    firstStep = false;
                }
                else {
                    walkAudio.play();
                }
                StepsTakenScore++;
                updateScore('StepsTakenScore', StepsTakenScore  )
                playercam.object3D.position.set(newPos.x, 1.5, newPos.z);
            }
        })
    }
});

AFRAME.registerComponent('explosion-on-click', {
    schema: {
      duration: { type: 'number', default: 3500 }, // Duration to keep the explosion entity in milliseconds
    },
    init: function () {
      var el = this.el;
      var data = this.data;
      // Add a click event listener
      el.addEventListener('click', function () {
        // Create the explosion entity
        var explosion = document.createElement('a-entity');
        explosion.setAttribute('gltf-model', '#explosion'); // Load the GLB model
        explosion.setAttribute('animation-mixer',"clip:*; loop: once;");
        const elPos = el.object3D.position;
        console.log(elPos)
        explosion.object3D.position.set(el.object3D.position.x,el.object3D.position.y-1.5, el.object3D.position.z);
        // explosion.setAttribute('position', {x:el.object3D.position.x, y:el.object3D.position.y-1.5, z:el.object3D.position.z})
        // Add the explosion entity to the scene
        el.sceneEl.appendChild(explosion);

        const explodeLight = document.createElement('a-entity');
        explodeLight.setAttribute('light', "type: point; intensity: 0.85; distance: 20; decay: 2");
        explodeLight.object3D.position.set(el.object3D.position.x,el.object3D.position.y-1.5, el.object3D.position.z);
        el.sceneEl.appendChild(explodeLight);
        // Play the blast sound
        var blastSound = document.querySelector('#blast');
        if (blastSound) {
          blastSound.play();
        }
          // Play the explode sound
          var explodeSound= document.querySelector('#explode');
          if (explodeSound) {
            explodeSound.play();
          }

        // Remove the explosion entity after the specified duration
        setTimeout(function () {
            el.parentNode.removeChild(el);
        }, data.duration / 2);

        setTimeout(function(){
            explosion.parentNode.removeChild(explosion);
            explodeLight.parentNode.removeChild( explodeLight);
            // Update the scores using the updateScore function
            wallsDestroyed++;
            updateScore('wallsDestroyed', wallsDestroyed);
        }, 6800);
      });
    },
});


AFRAME.registerComponent('start-game-btn', {
    schema: {
      duration: { type: 'number', default: 3500 }, // Duration to keep the explosion entity in milliseconds
    },
    init: function () {
      var el = this.el;
      var data = this.data;
      // Add a click event listener
      el.addEventListener('click', function () {
        invokeTone();
        loadNewLevel();
        el.remove();
      });
    },
    remove: function () {
        const el = this.el;
        el.destroy();
    },
});


AFRAME.registerComponent("load-texture", {
    schema: {
        src: { type: 'string', default: 'textures/structures/rocky.JPG' },
    },
    init: function () {
        const data = this.data;
        const el = this.el;
        let src = data.src;
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(src,
            // onLoad
            function (tex) {
                let mesh = el.getObject3D('mesh')
                mesh.material.map = tex;
                console.log(tex);
            },
            // onProgress
            undefined,
            //onError
            function (err) {
                console.error('An error happened.');
            });
    }
})
// component for triggering an exit event
AFRAME.registerComponent('exit', {
    schema: {
        color: { type: 'string', default: 'green' },
        modelID: { type: 'string', default: 'exit' },
        modelMat: { type: 'string', default: 'exit' },
        position: { type: 'string', default: '0 0.1 0' },
        rotation: { type: 'string', default: '0 0 0' },
        scale: { type: 'string', default: '0.1 0.1 0.1' },
        status: { type: 'string', default: 'false' },
        toLoad: { type: 'number', default: 1 }
    },

    init: function () {
        const data = this.data; let src = data.src;
        const textureLoader = new THREE.TextureLoader();
        const exit = document.createElement('a-entity');
        let position = data.position;
        let color = data.color;
        let toLoad = data.toLoad;
        let scale = data.scale;

        exit.setAttribute('geometry', 'primitive: box;');
        exit.setAttribute('position', position);
        exit.setAttribute('color', color);
        exit.setAttribute('glowFX', 'visible:' + true);
        exit.setAttribute('scale', scale);

        this.el.addEventListener('click', function (evt) {
            var portalSound = document.querySelector('#dooropen');
            if (portalSound) {
                portalSound.play();
            }
            portalsFound++;
            updateScore('portalsFound', portalsFound )
            loadNewLevel();
        })
    },
    remove: function () {
        const el = this.el;
        el.destroy();
    },
});
