import QRCode from "qrcode";

/**
 * QR-код как SVG со скруглёнными модулями — чтобы формы внутри кода
 * рифмовались со скруглениями карточки и кнопок на сайте.
 * Три «глаза» (finder patterns) рисуются отдельно цельными
 * скруглёнными квадратами, остальные модули — маленькими скруглёнными
 * квадратиками.
 */
export function qrSvg(text: string): string {
  const qr = QRCode.create(text, { errorCorrectionLevel: "M" });
  const size = qr.modules.size;
  const data = qr.modules.data;
  const isDark = (row: number, col: number) => Boolean(data[row * size + col]);

  const inFinder = (row: number, col: number) =>
    (row < 7 && col < 7) || (row < 7 && col >= size - 7) || (row >= size - 7 && col < 7);

  const parts: string[] = [];

  // Обычные модули: квадрат 1×1 с радиусом 0.3.
  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      if (!isDark(row, col) || inFinder(row, col)) continue;
      parts.push(`<rect x="${col}" y="${row}" width="1" height="1" rx="0.3"/>`);
    }
  }

  // Глаза: внешнее кольцо 7×7 и внутренний квадрат 3×3, оба скруглённые.
  const eye = (x: number, y: number) => {
    parts.push(
      `<path fill-rule="evenodd" d="M${x + 1.6},${y}h3.8a1.6,1.6 0 0 1 1.6,1.6v3.8a1.6,1.6 0 0 1 -1.6,1.6h-3.8a1.6,1.6 0 0 1 -1.6,-1.6v-3.8a1.6,1.6 0 0 1 1.6,-1.6z` +
        `M${x + 1.8},${y + 1}h3.4a0.8,0.8 0 0 1 0.8,0.8v3.4a0.8,0.8 0 0 1 -0.8,0.8h-3.4a0.8,0.8 0 0 1 -0.8,-0.8v-3.4a0.8,0.8 0 0 1 0.8,-0.8z"/>`
    );
    parts.push(`<rect x="${x + 2}" y="${y + 2}" width="3" height="3" rx="0.8"/>`);
  };
  eye(0, 0);
  eye(size - 7, 0);
  eye(0, size - 7);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" shape-rendering="geometricPrecision" fill="#111111">${parts.join("")}</svg>`;
}
