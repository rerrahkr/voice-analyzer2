export const WIDTH_PIXEL_RATE = 1000;

export function drawPlaybackPositionLayer(
  canvas: HTMLCanvasElement,
  scrollOffset: number,
  transportTime: number
) {
  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);

  // Draw transport line.
  const resolutionStyleRate =
    canvas.width / canvas.getBoundingClientRect().width;
  const multiplier = resolutionStyleRate / WIDTH_PIXEL_RATE;
  const timeLeft = scrollOffset * multiplier;
  const timeRight = (scrollOffset + canvas.width) * multiplier;

  if (timeLeft <= transportTime && transportTime <= timeRight) {
    context.strokeStyle = "black";

    context.beginPath();
    const x = (transportTime - timeLeft) * WIDTH_PIXEL_RATE;
    context.moveTo(x, 0);
    context.lineTo(x, canvas.height);
    context.stroke();
  }
}

export function drawGrid(canvas: HTMLCanvasElement, scrollOffset: number) {
  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);

  const centerY = canvas.height / 2;

  // Draw zero-line.
  context.strokeStyle = "grey";
  context.lineWidth = 1;

  context.beginPath();
  context.moveTo(0, centerY);
  context.lineTo(canvas.width, centerY);
  context.stroke();

  // Draw time lines.
  const canvasLeft =
    (scrollOffset * canvas.width) / canvas.getBoundingClientRect().width;
  const timeLeft = canvasLeft / WIDTH_PIXEL_RATE;

  const canvasRight =
    ((scrollOffset + canvas.getBoundingClientRect().width) * canvas.width) /
    canvas.getBoundingClientRect().width;
  const timeRight = canvasRight / WIDTH_PIXEL_RATE;

  context.textBaseline = "top";
  context.font = `0.8em ${getComputedStyle(canvas).fontFamily}`;
  context.fillStyle = "grey";

  const GRID_TIME = 0.1;
  for (
    let count = Math.ceil(timeLeft / GRID_TIME), time = count * GRID_TIME;
    time <= timeRight;
    time = ++count * GRID_TIME
  ) {
    if (count % 10 === 0) {
      context.strokeStyle = "grey";
    } else if (count % 5 === 0) {
      context.strokeStyle = "lightgrey";
    } else {
      context.strokeStyle = "whitesmoke";
    }

    const x = Math.round((time - timeLeft) * WIDTH_PIXEL_RATE);
    context.fillText(time.toFixed(3), x + 4, 4);

    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, canvas.height);
    context.stroke();
  }
}

export function drawWaveLayer(
  canvas: HTMLCanvasElement,
  audio: AudioBuffer | undefined,
  scrollOffset: number
) {
  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);

  // Draw samples.
  if (!audio) {
    return;
  }

  const samples = audio.getChannelData(0);

  const centerY = canvas.height / 2;
  const MAX_HEIGHT_PIXEL = 800;
  const maxDrawableHeight = Math.min(canvas.height, MAX_HEIGHT_PIXEL);

  context.strokeStyle = "red";

  context.beginPath();

  if (WIDTH_PIXEL_RATE < audio.sampleRate) {
    // Selection drawing.
    const xOffset = Math.round(
      (scrollOffset * canvas.width) / canvas.getBoundingClientRect().width
    );
    context.moveTo(
      0,
      centerY -
        maxDrawableHeight *
          samples[Math.round((audio.sampleRate * xOffset) / WIDTH_PIXEL_RATE)]
    );

    for (let x = 0; x < canvas.width; x++) {
      context.lineTo(
        x,
        centerY -
          maxDrawableHeight *
            samples[
              Math.round((audio.sampleRate * (xOffset + x)) / WIDTH_PIXEL_RATE)
            ]
      );
    }
  } else {
    // Draw all samples.
    const canvasOffset =
      (scrollOffset * canvas.width) / canvas.getBoundingClientRect().width;
    const firstDrawableIndex = (() => {
      const timeOffset = canvasOffset / WIDTH_PIXEL_RATE;
      return Math.floor(timeOffset * audio.sampleRate);
    })();
    const lastDrawableIndex = (() => {
      const canvasRight =
        ((scrollOffset + canvas.getBoundingClientRect().width) * canvas.width) /
        canvas.getBoundingClientRect().width;
      const timeRight = canvasRight / WIDTH_PIXEL_RATE;
      return Math.min(
        Math.ceil(timeRight * audio.sampleRate),
        audio.length - 1
      );
    })();

    context.moveTo(
      (WIDTH_PIXEL_RATE * firstDrawableIndex) / audio.sampleRate,
      centerY - maxDrawableHeight * samples[firstDrawableIndex]
    );

    for (let i = firstDrawableIndex; i <= lastDrawableIndex; i++) {
      context.lineTo(
        (WIDTH_PIXEL_RATE * i) / audio.sampleRate,
        centerY - maxDrawableHeight * samples[i]
      );
    }
  }

  context.stroke();
}
