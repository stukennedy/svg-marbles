import { raw } from 'hono/html';
import { render } from 'svg-marbles';
import { MarbleDiagram, SVGTheme } from 'svg-marbles';

// Define the interface locally since it's not exported
interface MarbleToSVGOptions {
  diagram: string | MarbleDiagram;
  theme?: Partial<SVGTheme>;
  color?: string;
  frameTime?: number;
  values?: Record<string, any>;
}

export function MarbleSVG({ diagram, theme, color, values }: MarbleToSVGOptions) {
  return raw(render(diagram, { theme: { ...theme, valueColor: color }, values } as any));
}
