import { createCanvas, loadImage, registerFont } from 'canvas';
import path from 'node:path';

export const textOnImage = async (text: string) => {
  text = formatTextBrake(text);
  registerFont(path.resolve(__dirname, '../..', 'static/Z003-MediumItalic.otf'), { family: 'CustomFont' });
  const dirPath = path.resolve(__dirname, '../..', 'static/bg.jpg');
  const image = await loadImage(dirPath);

  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext('2d');

  ctx.drawImage(image, 0, 0, image.width, image.height);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let fontSize = 72;
  ctx.font = `${fontSize}px CustomFont`;

  const measureTextWidth = (text: string) => ctx.measureText(text).width;

  const formatText = (str: string, maxWidth: number) => {
    const lines = [];
    const paragraphs = str.split('\n');

    paragraphs.forEach(paragraph => {
      const words = paragraph.split(' ');
      let currentLine = '';

      words.forEach(word => {
        const testLine = currentLine + word + ' ';
        const testWidth = measureTextWidth(testLine);

        if (testWidth > maxWidth && currentLine !== '') {
          lines.push(currentLine.trim());
          currentLine = word + ' ';
        } else {
          currentLine = testLine;
        }
      });

      if (currentLine) {
        lines.push(currentLine.trim());
      }
    });

    return lines;
  };

  const maxWidth = canvas.width - 30;
  while (measureTextWidth(text) > maxWidth) {
    fontSize -= 1;
    ctx.font = `${fontSize}px CustomFont`;
  }

  const lines = formatText(text, maxWidth);
  const lineHeight = fontSize * 2;

  const totalTextHeight = lines.length * lineHeight;
  let y = (canvas.height - totalTextHeight) / 2;

  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  lines.forEach((line) => {
    const words = line.split(' ');
    const totalWidth = measureTextWidth(line);
    const spaceBetweenWords = (maxWidth - totalWidth) / (words.length - 1 || 1);

    let currentX = 20;
    const gradient = ctx.createLinearGradient(currentX, y, maxWidth + currentX, y);
    gradient.addColorStop(0, 'Aqua');
    gradient.addColorStop(0.25, 'GreenYellow');
    gradient.addColorStop(0.5, 'Gold');
    gradient.addColorStop(0.75, 'orange');
    gradient.addColorStop(1, 'Aqua');

    ctx.fillStyle = gradient;
    words.forEach((word: string) => {
      ctx.fillText(word, currentX, y);
      currentX += measureTextWidth(word) + spaceBetweenWords;
    });

    y += lineHeight;
  });

  const buffer = canvas.toBuffer('image/png');
  return buffer;
};



const formatTextBrake = (str: string) => {
  const maxL = 40;

  let result = '';
  let temp = '';

  for (let i = 0; i < str.length; i++) {
      if (str[i] === ' ') {
          if (temp.length > maxL) {
              const arr = temp.split(' ');
              temp = arr.pop();
              result += arr.join(' ') + '\n';
          }
      }
      temp += str[i];
      if (i === str.length - 1) {
        result += temp;
    }
  }
  return result;
}