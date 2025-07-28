import { ParsedMarbleDiagram } from './marble-parser';

export interface SVGTheme {
  backgroundColor: string;
  lineColor: string;
  valueColor: string;
  errorColor: string;
  completeColor: string;
  textColor: string;
  fontSize: number;
  lineWidth: number;
  circleRadius: number;
  circleStrokeColor?: string;
  circleStrokeWidth?: number;
  padding: number; // Vertical padding only - horizontal padding is calculated automatically
  rowHeight: number;
  timeScale: number;
}

export const defaultTheme: SVGTheme = {
  backgroundColor: '#ffffff',
  lineColor: '#333333',
  valueColor: '#4CAF50',
  errorColor: '#f44336',
  completeColor: '#2196F3',
  textColor: '#000000',
  fontSize: 14,
  lineWidth: 2,
  circleRadius: 8,
  padding: 25, // Increased to provide better default spacing
  rowHeight: 60,
  timeScale: 3
};

export interface RenderOptions {
  theme?: Partial<SVGTheme>;
  name?: string;
}

export function renderMarbleDiagramToSVG(diagram: ParsedMarbleDiagram, options: RenderOptions = {}): string {
  const theme = { ...defaultTheme, ...options.theme };
  const { padding, rowHeight, timeScale, lineWidth, circleRadius, fontSize } = theme;

  // Calculate horizontal padding automatically to prevent marble truncation
  const strokeWidth = theme.circleStrokeWidth || lineWidth;
  const maxMarbleRadius = circleRadius + strokeWidth;
  const textWidth = fontSize * 0.6; // Approximate width of single character
  const horizontalPadding = maxMarbleRadius + textWidth + 5; // Add 5px buffer for safety

  const width = diagram.duration * timeScale + horizontalPadding * 2;
  const height = rowHeight + padding * 2;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
  svg += `<rect width="${width}" height="${height}" fill="${theme.backgroundColor}"/>`;

  const y = padding + rowHeight / 2;
  const startX = horizontalPadding;
  const endX = startX + diagram.duration * timeScale;

  svg += `<line x1="${startX}" y1="${y}" x2="${endX}" y2="${y}" stroke="${theme.lineColor}" stroke-width="${lineWidth}"/>`;

  if (options.name) {
    svg += `<text x="${horizontalPadding}" y="${padding - 5}" font-family="Arial, sans-serif" font-size="${fontSize}" fill="${theme.textColor}">${options.name}</text>`;
  }

  diagram.events.forEach((event) => {
    const x = startX + event.time * timeScale;

    switch (event.type) {
      case 'next':
        const strokeColor = theme.circleStrokeColor || theme.lineColor;
        const strokeWidth = theme.circleStrokeWidth || lineWidth;
        svg += `<circle cx="${x}" cy="${y}" r="${circleRadius}" fill="${theme.valueColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}" />`;
        if (event.value) {
          svg += `<text x="${x}" y="${y + 5}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${fontSize}" fill="${theme.textColor}">${event.value}</text>`;
        }
        break;

      case 'error':
        svg += `<line x1="${x - circleRadius}" y1="${y - circleRadius}" x2="${x + circleRadius}" y2="${y + circleRadius}" stroke="${theme.errorColor}" stroke-width="${
          lineWidth * 1.5
        }"/>`;
        svg += `<line x1="${x - circleRadius}" y1="${y + circleRadius}" x2="${x + circleRadius}" y2="${y - circleRadius}" stroke="${theme.errorColor}" stroke-width="${
          lineWidth * 1.5
        }"/>`;
        break;

      case 'complete':
        svg += `<line x1="${x}" y1="${y - circleRadius * 1.5}" x2="${x}" y2="${y + circleRadius * 1.5}" stroke="${theme.completeColor}" stroke-width="${lineWidth * 2}"/>`;
        break;
    }
  });

  svg += '</svg>';

  return svg;
}
