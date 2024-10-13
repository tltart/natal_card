import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createCanvas, loadImage, registerFont, CanvasRenderingContext2D, Canvas } from 'canvas';
import path from 'node:path';

@Injectable()
export class LunarService implements OnModuleInit {
  private readonly paddingLeft = 25;

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    console.log('Moon init service');
  }

  async createCanvas(bgImagePath: string) {
    registerFont(path.resolve(__dirname, '../..' , 'static/Candara.ttf'), { family: 'Candara' });
    const image = await loadImage(bgImagePath);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, image.width, image.height);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return { canvas, ctx, imageHeight: image.height };
  }

  addText({
    ctx,
    canvas,
    fontSize,
    text,
    x,
    y,
    color,
    align,
  }: {
    ctx: CanvasRenderingContext2D;
    canvas: Canvas;
    fontSize: number;
    text: string;
    x: number;
    y: number;
    color: string;
    align?: 'right' | 'left' | 'center';
  }) {
    ctx.font = `${fontSize}px "Candara"`;
    ctx.fillStyle = color;
    if (align === 'center') {
      ctx.textAlign = align;
      ctx.fillText(text, canvas.width / 2, canvas.height - y);
      return;
    } else if (align === 'left') {
      ctx.textAlign = align;
      ctx.fillText(text, this.paddingLeft, canvas.height - y);
      return;
    }
    ctx.fillText(text, x, canvas.height - y);
  }

  async addImage({
    ctx,
    canvas,
    path,
    x,
    y,
    size,
    shaddow,
  }: {
    ctx: CanvasRenderingContext2D;
    canvas: Canvas;
    x: number;
    y: number;
    path: string;
    size: number;
    shaddow?: boolean;
  }) {
    if (shaddow) {
      ctx.fillStyle = 'rgba(255, 0, 251, 0.8)';
      ctx.beginPath();
      ctx.arc(x + size / 2, canvas.height - y + size / 2, size / 2 + 3, 0, Math.PI * 2, false);
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
    }
    const image = await loadImage(path);
    ctx.drawImage(image, x, canvas.height - y, size, size);
  }

  async getImage() {
    const canvas = await this.createImage();
    return canvas.toBuffer('image/png');
  }

  async createImage() {
    const date = new Date();
    //   date.setHours(date.getHours() - 24);

    let data = (await this.prisma.findLunarPhaseByWeek(date)) as any;

    data.sort((a, b) => {
      if (a.day > b.day) return 1;
      else if (a.day < b.day) return -1;
      return 0;
    });
    data = data.slice(0, 7);
    const dayData = data.filter((el) => el.day.getDate() === date.getDate())[0] as any;

    let lastPositionText = 0;
    const moonSize = 45;
    const leftPadding = 15;

    const { canvas, ctx, imageHeight } = await this.createCanvas(path.resolve(__dirname, '../..', 'static/source_img/bg.png'));

    const headerSize = 25;
    this.addText({
      canvas,
      ctx,
      text: `${date.getDate()} ${date.toLocaleString('ru-RU', { month: 'long' }).slice(0, -1) + 'я'} ${date.getFullYear()} года`,
      x: leftPadding,
      y: imageHeight - headerSize - headerSize,
      color: 'white',
      fontSize: headerSize,
      align: 'center',
    });

    lastPositionText += imageHeight - headerSize - headerSize - headerSize;

    const phaseMoonTextSize = 18;
    this.addText({
      canvas,
      ctx,
      text: dayData.text.moonPhase.phase,
      x: leftPadding,
      y: lastPositionText - 14,
      color: 'white',
      fontSize: phaseMoonTextSize,
      align: 'center',
    });

    lastPositionText += -14;

    const lastMoonPosition = { x: leftPadding, y: lastPositionText - 75 };

    const daysOfWeek = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

    await Promise.all(
      data.map((el, idx) => {
        const phaseMap = {
          Растущая: 'right',
          Убывающая: 'left',
          Полнолуние: '100',
          Новолуние: '0',
        };

        const match = el.text.moonPhase.phase.match(/Растущая|Убывающая|Полнолуние|Новолуние/);
        const phase = match ? phaseMap[match[0]] : null;

        let imgName = '';
        if (phase == phaseMap.Новолуние || Math.round(parseInt(el.text.moonVisibility.percentage) / 10) * 10 === 0) {
          imgName = phaseMap.Новолуние;
        } else if (phase === phaseMap.Полнолуние || Math.round(parseInt(el.text.moonVisibility.percentage) / 10) * 10 === 100) {
          imgName = phaseMap.Полнолуние;
        } else if (phase === phaseMap.Растущая) {
          imgName = `${Math.round(parseInt(el.text.moonVisibility.percentage) / 10) * 10}_${phaseMap.Растущая}`;
        } else if (phase === phaseMap.Убывающая) {
          imgName = `${Math.round(parseInt(el.text.moonVisibility.percentage) / 10) * 10}_${phaseMap.Убывающая}`;
        }

        if (idx !== 0) lastMoonPosition.x = lastMoonPosition.x + moonSize;

        const startText = lastMoonPosition.x;

        const padding = 3;

        this.addText({
          canvas,
          ctx,
          text: daysOfWeek[idx],
          x: startText + padding + moonSize / 2,
          y: lastMoonPosition.y + 10,
          color: 'white',
          fontSize: 18,
        });

        this.addText({
          canvas,
          ctx,
          text: el.text.moonVisibility.percentage,
          x: startText + padding + moonSize / 2,
          y: lastMoonPosition.y - moonSize - 20,
          color: 'white',
          fontSize: 18,
        });

        lastPositionText = lastMoonPosition.y - moonSize - 20;

        return this.addImage({
          canvas,
          ctx,
          path: path.resolve(__dirname, '../..', `static/source_img/${imgName}.png`),
          x: lastMoonPosition.x + padding,
          y: lastMoonPosition.y,
          size: moonSize,
          shaddow: date.getDate() === el.day.getDate() && date.getMonth() === el.day.getMonth() && date.getFullYear() === el.day.getFullYear(),
        });
      }),
    );

    const lunarDayFontSize = 18;
    const lunarDayPadding = 70;

    if (dayData.text.lunarDay.current) {
      let text = '';
      text += dayData.text.lunarDay.current.day;
      text += ' луные сутки';
      if (dayData.text.lunarDay.current.until) text += ` до ${dayData.text.lunarDay.current.until}`;
      this.addText({
        canvas,
        ctx,
        text,
        x: leftPadding,
        y: lastPositionText - lunarDayPadding,
        color: 'white',
        fontSize: lunarDayFontSize,
        align: 'left',
      });
      lastPositionText -= lunarDayFontSize;
    }
    if (dayData.text.lunarDay.next) {
      let text = '';
      text += dayData.text.lunarDay.next.day;
      text += ' луные сутки';
      if (dayData.text.lunarDay.next.from) text += ` с ${dayData.text.lunarDay.next.from}`;
      if (dayData.text.lunarDay.next.until) text += ` до ${dayData.text.lunarDay.next.until}`;
      this.addText({
        canvas,
        ctx,
        text,
        x: leftPadding,
        y: lastPositionText - lunarDayPadding - 15,
        color: 'white',
        fontSize: lunarDayFontSize,
        align: 'left',
      });
      lastPositionText -= lunarDayPadding + lunarDayFontSize + 15;
    }
    if (dayData.text.lunarDay.afterNext) {
      let text = '';
      text += dayData.lunarDay.afterNext.day;
      text += ' луные сутки';
      if (dayData.text.lunarDay.afterNext.from) text += ` с ${dayData.text.lunarDay.afterNext.from}`;
      this.addText({
        canvas,
        ctx,
        text,
        x: leftPadding,
        y: lastPositionText - lunarDayPadding,
        color: 'white',
        fontSize: lunarDayFontSize,
        align: 'center',
      });
      lastPositionText -= lunarDayPadding - lunarDayFontSize;
    }

    if (dayData.text.moonInSign?.currentSign?.sign) {
      let text = '';
      text += `Луна в знаке ${dayData.text.moonInSign.currentSign.sign}`;
      if (dayData.text.moonInSign.currentSign.until) text += ` до ${dayData.text.moonInSign.currentSign.until}`;
      this.addText({
        canvas,
        ctx,
        text,
        x: leftPadding,
        y: lastPositionText - 35,
        color: 'white',
        align: 'left',
        fontSize: lunarDayFontSize,
      });
      lastPositionText -= lunarDayFontSize + 35;
    }
    if (dayData.text.moonInSign?.nextSign?.sign) {
      let text = '';
      text += `Луна в знаке ${dayData.text.moonInSign.nextSign.sign}`;
      if (dayData.text.moonInSign.currentSign.until) text += ` с ${dayData.text.moonInSign.currentSign.until}`;
      this.addText({
        canvas,
        ctx,
        text,
        x: leftPadding,
        y: lastPositionText - 15,
        color: 'white',
        align: 'left',
        fontSize: lunarDayFontSize,
      });
      lastPositionText -= lunarDayFontSize + 15;
    }

    if (dayData.text.moonRise) {
      const text = `Всоход в ${dayData.text.moonRise}`;

      this.addText({
        canvas,
        ctx,
        text,
        x: leftPadding,
        y: lastPositionText - 35,
        color: 'white',
        align: 'left',
        fontSize: lunarDayFontSize,
      });
      lastPositionText -= lunarDayFontSize + 35;
    }
    if (dayData.text.moonSet) {
      const text = `Закат в ${dayData.text.moonSet}`;

      this.addText({
        canvas,
        ctx,
        text,
        x: leftPadding,
        y: lastPositionText - 15,
        color: 'white',
        align: 'left',
        fontSize: lunarDayFontSize,
      });
      lastPositionText -= lunarDayFontSize + 15;
    }

    return canvas;
  }
  // writeWile(path) {
  //   fs.writeFileSync(path, this.canvas.toBuffer('image/png'));
  // }
}
