import { parseMarbleDiagram } from "./marble-parser";
import { renderMarbleDiagramToSVG, SVGTheme } from "./svg-renderer";

export interface MarbleDiagram {
  name?: string;
  diagram: string;
  frameTime?: number;
}

export interface MarbleToSVGOptions {
  theme?: Partial<SVGTheme>;
  frameTime?: number;
}

export function render(
  diagram: string | MarbleDiagram,
  options: MarbleToSVGOptions = {}
): string {
  let marbleString: string;
  let name: string | undefined;
  let frameTime: number;

  if (typeof diagram === "string") {
    marbleString = diagram;
    frameTime = options.frameTime || 10;
  } else {
    marbleString = diagram.diagram;
    name = diagram.name;
    frameTime = diagram.frameTime || options.frameTime || 10;
  }

  const parsed = parseMarbleDiagram(marbleString, frameTime);

  return renderMarbleDiagramToSVG(parsed, {
    theme: options.theme,
    name
  });
}

export {
  parseMarbleDiagram,
  ParsedMarbleDiagram,
  MarbleEvent
} from "./marble-parser";
export { SVGTheme, defaultTheme } from "./svg-renderer";
export { testWithCapture, captureMarbles } from "./capture-observable";
