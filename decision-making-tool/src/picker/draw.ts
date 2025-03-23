import type { ColoredOption } from './picker';

export const drawCursor = (
  context: CanvasRenderingContext2D,
  Xc: number,
  cursorYpos: number
): void => {
  context.save();

  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;
  context.beginPath();

  context.moveTo(Xc, cursorYpos);
  context.lineTo(Xc + 15, cursorYpos - 30);
  context.lineTo(Xc, cursorYpos - 20);
  context.lineTo(Xc - 15, cursorYpos - 30);
  context.closePath();
  context.fillStyle = '#33a3a3';
  context.fill();
  context.stroke();
  context.restore();
};

export const drawInnerCircle = (
  context: CanvasRenderingContext2D,
  Xc: number,
  Yc: number,
  circleInnerRadius: number
): void => {
  context.save();
  context.shadowColor = 'black';

  context.shadowBlur = 20;

  context.beginPath();
  context.arc(Xc, Yc, circleInnerRadius, 0, Math.PI * 2);
  context.fillStyle = 'green';
  context.fill();
  context.strokeStyle = 'white';
  context.lineWidth = 2;
  context.stroke();
  context.restore();
};

export const drawOuterCircle = (
  context: CanvasRenderingContext2D,
  Xc: number,
  Yc: number,
  spinnerRadius: number
): void => {
  context.beginPath();
  context.arc(Xc, Yc, spinnerRadius, 0, Math.PI * 2);
  context.fillStyle = 'blue';
  context.fill();
  context.strokeStyle = 'white';
  context.lineWidth = 2;
  context.stroke();
};

export const drawAllSegments = (
  context: CanvasRenderingContext2D,
  Xc: number,
  Yc: number,
  spinnerRadius: number,
  rotation: number,
  startAngle: number,
  sum: number,
  easedT: number,
  coloredList: ColoredOption[]
): void => {
  for (const segment of coloredList) {
    if (segment.title && segment.weight) {
      const endAngle: number = startAngle + (segment.weight / sum) * 2 * Math.PI;

      const rotatedStartAngle = startAngle - rotation * easedT;
      const rotatedEndAngle = endAngle - rotation * easedT;

      drawSegment(
        context,
        Xc,
        Yc,
        spinnerRadius,
        rotatedStartAngle,
        rotatedEndAngle,
        segment.color
      );

      drawText(
        context,
        Xc,
        Yc,
        spinnerRadius,
        rotatedStartAngle,
        rotatedEndAngle,
        startAngle,
        endAngle,
        segment.title
      );

      startAngle = endAngle;
    }
  }
};

export const drawSegment = (
  context: CanvasRenderingContext2D,
  Xc: number,
  Yc: number,
  spinnerRadius: number,
  rotatedStartAngle: number,
  rotatedEndAngle: number,
  color: string
): void => {
  context.strokeStyle = 'white';
  context.beginPath();
  context.moveTo(Xc, Yc);
  context.arc(Xc, Yc, spinnerRadius, rotatedStartAngle, rotatedEndAngle);
  context.closePath();
  context.fillStyle = color;
  context.fill();
  context.stroke();
};

export const drawText = (
  context: CanvasRenderingContext2D,
  Xc: number,
  Yc: number,
  spinnerRadius: number,
  rotatedStartAngle: number,
  rotatedEndAngle: number,
  startAngle: number,
  endAngle: number,
  text: string
): void => {
  if (endAngle - startAngle >= 0.2) {
    const midAngle = (rotatedStartAngle + rotatedEndAngle) / 2;
    const x: number = Xc + spinnerRadius * 0.6 * Math.cos(midAngle);
    const y: number = Yc + spinnerRadius * 0.6 * Math.sin(midAngle);

    context.save();
    context.translate(x, y);
    context.rotate(midAngle);
    context.fillStyle = 'white';
    context.shadowColor = 'black';
    context.shadowBlur = 5;
    context.fillText(text.length > 9 ? `${text.slice(0, 10)}...` : text, 0, 0);
    context.restore();
  }
};

export const drawTextStyle = (context: CanvasRenderingContext2D): void => {
  if (context) {
    context.imageSmoothingEnabled = true;
    context.font = '20px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    context.shadowColor = 'black';
    context.shadowOffsetX = 2;
    context.shadowOffsetY = 2;
  }
};
