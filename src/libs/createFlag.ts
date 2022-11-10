import { createCanvas, loadImage } from 'canvas';
import { existsSync, writeFileSync } from 'fs';
import { Gif } from 'make-a-gif';

export default async function createFlag(country_code: string) {
  const path = `${process.cwd()}/public/assets/images/trails/${country_code}.gif`;

  if (existsSync(path)) {
    return;
  }

  const parts = 6;
  const repeat = 2;

  const gif = new Gif(16 * parts, 33);

  const flag = await loadImage(`https://flagcdn.com/w80/${country_code.toLowerCase()}.jpg`);

  for (let i = 0; i < parts; i++) {
    const canvas = createCanvas(gif.width, gif.height);
    const context = canvas.getContext('2d');

    for (let j = 0; j < parts; j++) {
      context.drawImage(
        flag,
        (flag.width / (parts / repeat)) * ((i + j) % (parts / repeat)), 0,
        flag.width / (parts / repeat), flag.height,
        (canvas.width / parts) * j, (((i + j) % 2)) ? 0 : canvas.height * 0.07,
        canvas.width / parts, canvas.height * 0.93,
      );
    }

    await gif.addFrame({
      src: new Uint8Array(canvas.toBuffer('image/png')),
      duration: 300,
    });
  }

  writeFileSync(path, await gif.encode());
}
