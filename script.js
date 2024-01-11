const html = document.documentElement;
const canvas = document.getElementById("hero-lightpass");
const context = canvas.getContext("2d");

const frameCount = 5421;
const framesPerBatch = 20;  // Number of frames to load per batch
let currentBatch = 1;
const batchSize = Math.ceil(frameCount / framesPerBatch);

const currentFrame = index => (
  `sequence/image_sequence_${index.toString().padStart(4, '0')}.jpg`
);

const preloadImages = (start, end) => {
  for (let i = start; i <= end; i++) {
    const img = new Image();
    img.src = currentFrame(i);
  }
};

const img = new Image();
img.src = currentFrame(1);
canvas.width = 1920;
canvas.height = 1080;
img.onload = function () {
  context.drawImage(img, 0, 0);
};

const updateImage = index => {
  img.src = currentFrame(index);
  context.drawImage(img, 0, 0);
};

const lazyLoadImages = () => {
  const start = (currentBatch - 1) * framesPerBatch + 1;
  const end = Math.min(currentBatch * framesPerBatch, frameCount);
  preloadImages(start, end);
  currentBatch++;
};

window.addEventListener('scroll', () => {
  const scrollTop = html.scrollTop;
  const maxScrollTop = html.scrollHeight - window.innerHeight;
  const scrollFraction = scrollTop / maxScrollTop;
  const frameIndex = Math.min(
    frameCount - 1,
    Math.ceil(scrollFraction * frameCount)
  );

  updateImage(frameIndex + 1);

  // Check if it's time to load the next batch of images
  const framesLoaded = currentBatch * framesPerBatch;
  if (framesLoaded < frameCount && scrollFraction > 0.8) {
    lazyLoadImages();
  }
});

preloadImages(1, framesPerBatch);  // Preload the initial batch of images
