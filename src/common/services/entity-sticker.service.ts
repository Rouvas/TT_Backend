import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';
import * as PDFDocument from 'pdfkit';
import { PassThrough } from 'stream';
import * as path from 'node:path';

export interface GenerateCardOptions {
  productId: string;
  brand: string;
  model: string;
  param1?: string;
  param2?: string;
  param3?: string;
  param4?: string;
}

@Injectable()
export class EntityStickerService {
  async generateCard(options: GenerateCardOptions): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      try {
        // Функция для конвертации мм в точки
        const mmToPoints = (mm: number) => mm * 2.8346;

        const height = mmToPoints(120); // 120 мм
        const width = mmToPoints(75); // 75 мм

        const doc = new PDFDocument({
          size: [width, height], // Размер в точках
          margin: mmToPoints(2), // Отступы в точках
          autoFirstPage: false, // Создаем страницу вручную
        });

        const buffers: Uint8Array[] = [];
        const stream = new PassThrough();

        doc.pipe(stream);

        // Регистрация пользовательского шрифта
        const fontPath = path.join(
          __dirname,
          '..',
          '..',
          '..',
          'assets',
          'fonts',
          'dejavu',
          'DejaVuSans.ttf',
        );
        const boldFontPath = path.join(
          __dirname,
          '..',
          '..',
          '..',
          'assets',
          'fonts',
          'dejavu',
          'DejaVuSans-Bold.ttf',
        );
        doc.registerFont('DejaVuSans', fontPath);
        doc.registerFont('DejaVuSans-Bold', boldFontPath);

        // Добавление новой страницы
        doc.addPage();

        // Настройка шрифтов
        doc.font('DejaVuSans-Bold');

        // 1. Добавление названия магазина "ТехноТитан" жирным шрифтом
        doc
          .font('DejaVuSans-Bold') // Используем жирный вариант шрифта
          .fontSize(14)
          .text('ТехноТитан', mmToPoints(2), mmToPoints(10), {
            align: 'center',
          });

        // 2. Добавление строки "Бренд: Название Бренда"
        doc
          .font('DejaVuSans-Bold')
          .fontSize(12)
          .text('Бренд:', mmToPoints(5), mmToPoints(25), {
            continued: true,
            baseline: 'middle',
          });
        doc.font('DejaVuSans').text(` ${options.brand}`, {
          align: 'left',
        });

        // 3. Добавление строки "Модель: Название модели"
        doc
          .font('DejaVuSans-Bold')
          .text('Модель:', mmToPoints(5), mmToPoints(32), {
            continued: true,
            baseline: 'middle',
          });
        doc.font('DejaVuSans').text(` ${options.model}`, {
          align: 'left',
        });

        // 4. Добавление горизонтальной линии толщиной 1px
        const lineY = mmToPoints(40);
        doc
          .moveTo(mmToPoints(5), lineY)
          .lineTo(width - mmToPoints(5), lineY)
          .stroke();

        // 5. Добавление четырех дополнительных параметров
        const startY = lineY + mmToPoints(10);
        let currentY = startY;
        const lineHeight = 14;

        const addParamLine = (label: string, value: string, y: number) => {
          doc.font('DejaVuSans-Bold').text(`${label}:`, mmToPoints(5), y, {
            continued: true,
            baseline: 'middle',
          });
          doc.font('DejaVuSans').text(` ${value}`, {
            align: 'left',
          });
        };

        const additionalParams = [
          { label: 'CPU', value: options.param1 },
          { label: 'RAM', value: options.param2 },
          { label: 'GPU', value: options.param3 },
          { label: 'SSD', value: options.param4 },
        ];

        additionalParams.forEach((param) => {
          if (param.value) {
            addParamLine(param.label, param.value, currentY);
            currentY += lineHeight;
          }
        });

        // 6. Добавление второй горизонтальной линии толщиной 1px
        const secondLineY = currentY + mmToPoints(5);
        doc
          .moveTo(mmToPoints(5), secondLineY)
          .lineTo(width - mmToPoints(5), secondLineY)
          .stroke();

        // 7. Генерация QR-кода как Data URL
        // const qrDataUrl = await QRCode.toDataURL(options.productId);
        const qrDataUrl = await QRCode.toDataURL('https://tehnotitan.ru');

        // Извлечение буфера из Data URL
        const qrImage = qrDataUrl.replace(/^data:image\/png;base64,/, '');
        const qrBuffer = Buffer.from(qrImage, 'base64');

        // 8. Добавление QR-кода в нижнюю часть карточки
        const qrSize = mmToPoints(30); // 20 мм
        const qrX = width - mmToPoints(22) - qrSize;
        const qrYPosition = height - mmToPoints(42); // Немного выше нижнего отступа для размещения сайта

        doc.image(qrBuffer, qrX, qrYPosition, {
          width: qrSize,
          height: qrSize,
        });

        // 9. Добавление сайта магазина под QR-кодом
        const siteY = qrYPosition + qrSize + mmToPoints(2); // 2 мм от QR-кода
        doc
          .font('DejaVuSans')
          .fontSize(10)
          .text('tehnotitan.ru', mmToPoints(4), siteY, {
            align: 'center',
          });

        doc.end();

        stream.on('data', (chunk) => buffers.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(buffers)));
        stream.on('error', (err) => reject(err));
      } catch (error) {
        reject(error);
      }
    });
  }
}
