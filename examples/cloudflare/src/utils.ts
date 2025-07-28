import { raw } from "hono/html";
import { render } from "svg-marbles";
import { MarbleDiagram, SVGTheme } from "svg-marbles";

export function MarbleSVG({
  diagram,
  theme,
  color
}: {
  diagram: string | MarbleDiagram;
  theme?: Partial<SVGTheme>;
  color?: string;
}) {
  return raw(render(diagram, { theme: { ...theme, valueColor: color } }));
}
