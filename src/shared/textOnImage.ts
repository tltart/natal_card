import { createCanvas, loadImage, registerFont } from 'canvas';
import path from 'node:path';

export const textOnImage = async (text: string) => {
  const date = new Date();
  const { preparedText, stringCount } = formatTextBrake(text);
  registerFont(path.resolve(__dirname, '../..', 'static/Candara.ttf'), { family: 'Candara' });
  const dirPath = path.resolve(__dirname, '../..', 'static/source_img/bg.png');
  const image = await loadImage(dirPath);

  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, image.width, image.height);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const fontSize = 20;

  ctx.font = `${fontSize}px Candara`;
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';

  ctx.fillText(
    `${date.getDate()} ${date.toLocaleString('ru-RU', { month: 'long' }).slice(0, -1) + 'я'} ${date.getFullYear()} года`,
    canvas.width / 2,
    fontSize * 2,
  );

  ctx.fillText(
    'Гороскоп',
    canvas.width / 2,
    fontSize * 4,
  );
  ctx.fillText(preparedText, canvas.width / 2, canvas.height / 2 - Math.round(stringCount / 2) * fontSize);
  const buffer = canvas.toBuffer('image/png');
  return buffer;
};

const formatTextBrake = (str: string) => {
  const maxL = 28;

  let preparedText = '';
  let stringCount = 0;

  const src = str.split(' ');
  const tmp = [];
  src.forEach((el) => {
    if (!tmp[stringCount]) {
      tmp[stringCount] = [];
      tmp[stringCount].push(` ${el}`);
      return;
    }
    if (tmp[stringCount].join(' ').length + el.length < maxL) {
      tmp[stringCount].push(el);
    } else {
      tmp[stringCount].push('\n');
      stringCount += 1;
      tmp[stringCount] = [];
      tmp[stringCount].push(el);
    }
  });

  preparedText = tmp.flat().join(' ');

  return { preparedText, stringCount };
};
