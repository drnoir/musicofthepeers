// BARROWLANDS VR component system
// Components BASED OFF labrinth generator VR / AR
// Dependency tree - A-Frame / A-Frame Extras / labgen / scoring.js
// ENGINE CORE IMPORTS
import {loadNewLevel} from "./labgen.js";
import { invokeTone, stopRandomMusic, startRandomMusic, startRandomMusic2 } from "./genMusic.js";
// score updating
let portalsFound = 0; 

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

// NPC AI -  behaviours boombox
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
    remove: function () {
        const el = this.el;
        el.destroy();
    },
});

AFRAME.registerComponent("player-ammo-sphere", {
    init() {
          this.el.setAttribute("ammo-shape", "type:sphere");
          this.el.setAttribute("ammo-body", "type:kinematic; emitCollisionEvents: true");
    }
  });

  AFRAME.registerComponent('player', {
    init: function () {
        this.el.addEventListener('collide', function (e) {
            console.log('Player has collided with ', e.detail.body.el);
            e.detail.target.el; // Original entity (playerEl).
            e.detail.body.el; // Other entity, which playerEl touched.
            e.detail.contact; // Stats about the collision (CANNON.ContactEquation).
            e.detail.contact.ni; // Normal (direction) of the collision (CANNON.Vec3).
            if (e.detail.body.el.className === "wall") {
                health--;
            }
        });
    },
})

AFRAME.registerComponent('start-game-btn', {
    schema: {
      duration: { type: 'number', default: 3500 }, 
    },
    init: function () {
      var el = this.el;
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
