import * as THREE from 'https://unpkg.com/three@0.145.0/build/three.module.js';
import { EffectComposer } from 'https://unpkg.com/three@0.145.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://unpkg.com/three@0.145.0/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'https://unpkg.com/three@0.145.0/examples/jsm/postprocessing/ShaderPass.js';
import { PixelShader } from 'https://unpkg.com/three@0.145.0/examples/jsm/shaders/PixelShader.js';
import { FontLoader } from 'https://unpkg.com/three@0.145.0/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'https://unpkg.com/three@0.145.0/examples/jsm/geometries/TextGeometry';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xe6f5e8);

const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);

camera.position.z = 80;

const renderer = new THREE.WebGLRenderer({
	antialias: false,
});

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const torusGeometry = new THREE.TorusGeometry(20, 10, 16, 20);
const torusMaterial = new THREE.MeshToonMaterial({
	color: 0x381a42,
	shininess: 200,
});

let meshs = [];

for (let i = 0; i < 3; i++) {
	let torus = new THREE.Mesh(torusGeometry, torusMaterial);
	torus.position.x = Math.random() * 40 - 20;
	torus.position.y = Math.random() * 40 - 20;

	scene.add(torus);

	meshs.push({
		mesh: torus,
		rotvelocity: {
			x: Math.random() * 2 - 1,
			y: Math.random() * 2 - 1,
		},
		velocity: {
			x: Math.random() * 2 - 1,
			y: Math.random() * 2 - 1,
		},
	});
}

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

let pixelPass = new ShaderPass(PixelShader);
pixelPass.uniforms.resolution.value = new THREE.Vector2(
	window.innerWidth,
	window.innerHeight
);
pixelPass.uniforms.pixelSize.value = 16;
pixelPass.uniforms.resolution.value.multiplyScalar(window.devicePixelRatio);

composer.addPass(pixelPass);

function addDirLight(color, intensity, position) {
	const light = new THREE.DirectionalLight(color, intensity);
	light.position.set(position.x, position.y, position.z);
	scene.add(light);
}

addDirLight(0xdbd9bf, 2, {
	x: 150,
	y: 75,
	z: 150,
});

addDirLight(0xb57793, 20, {
	x: -20,
	y: 75,
	z: -20,
});

addDirLight(0x381a42, 5, {
	x: 0,
	y: 0,
	z: 0,
});

function getNextChar(char) {
	return char === 'A'
		? 'B'
		: char === 'B'
		? 'C'
		: char === 'C'
		? '1'
		: char === '1'
		? '2'
		: char === '2'
		? '3'
		: char === '3' && 'A';
}

let currentText = 'A';

new FontLoader().load(
	'https://threejs.org/examples/fonts/gentilis_regular.typeface.json',
	(font) => {
		const textParameters = {
			font,
			size: 60,
			height: 1,
			curveSegments: 12,
			bevelEnabled: true,
			bevelThickness: 0.1,
			bevelSize: 0.1,
			bevelOffset: 0,
			bevelSegments: 5,
		};

		let textGeometry = new TextGeometry(currentText, textParameters);
		const textMaterial = new THREE.MeshBasicMaterial({
			color: 0x000000,
		});

		let textMesh = new THREE.Mesh(textGeometry, textMaterial);
		textMesh.position.x = -25;
		textMesh.position.y = -20;
		textMesh.position.z = 5;

		scene.add(textMesh);

		let t = 0;

		function animate() {
			composer.render();

			if (t % 200 === 0) {
				currentText = getNextChar(currentText);
				textGeometry = new TextGeometry(currentText, textParameters);
				textMesh.geometry = textGeometry;
			}

			meshs.forEach((torus) => {
				torus.mesh.rotation.x += torus.rotvelocity.x * 0.03;
				torus.mesh.rotation.y += torus.rotvelocity.y * 0.03;

				torus.mesh.position.x += torus.velocity.x * Math.cos(t / 30);
				torus.mesh.position.y += torus.velocity.y * Math.sin(t / 30);
			});

			t++;
			requestAnimationFrame(animate);
		}

		animate();
	}
);
