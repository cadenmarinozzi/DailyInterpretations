let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');

let width = (canvas.width = window.innerWidth);
let height = (canvas.height = window.innerHeight);

let img = document.querySelector('img');
ctx.drawImage(img, 0, 0, width, height);

const whitespace = true;
const chunkSize = 7;
const takeAverageDensity = true;
const displayOriginal = false;

const densityChars = (whitespace ? ' ' : '') + '.,-~:;=!*$&@#';

function charFromDensity(density) {
	// density is a number between 0 and 255, representing the average value of the pixel
	return densityChars[
		Math.floor(((densityChars.length - 1) * density) / 255)
	];
}

const imageData = ctx.getImageData(0, 0, width, height).data;

if (!displayOriginal) {
	ctx.clearRect(0, 0, width, height);
}

for (let x = 0; x < width; x += chunkSize) {
	for (let y = 0; y < height; y += chunkSize) {
		let density = 0;

		if (takeAverageDensity) {
			// Summate the density of all pixels in the chunk
			for (let i = 0; i < chunkSize; i++) {
				for (let j = 0; j < chunkSize; j++) {
					const pixel = imageData[(x + i + (y + j) * width) * 4];
					if (!pixel) continue;

					density += 255 - pixel; // invert it so that white is 0 and black is 255
				}
			}

			density /= chunkSize * chunkSize; // average it
		} else {
			density = 255 - imageData[(x + y * width) * 4];
		}

		ctx.fillText(charFromDensity(density), x, y);
	}
}
