# svg-marbles

A library for rendering RxJS marble diagrams as SVG with comprehensive theming support.

## Installation

```bash
npm install svg-marbles
```

## Quick Start

```typescript
import { render } from "svg-marbles";

// Simple marble diagram
const svg = render("--a--b--c--|");

// With custom theme
const themedSvg = render("--a--b--c--|", {
  theme: {
    backgroundColor: "#1e1e1e",
    valueColor: "#61dafb"
  }
});

// With named diagram
const namedSvg = render({
  name: "My Observable",
  diagram: "--a--b--c--|",
  frameTime: 20
});
```

## API Reference

### `render(diagram, options?)`

Renders a marble diagram to SVG string.

#### Parameters

- `diagram`: `string | MarbleDiagram` - The marble diagram string or object
- `options`: `MarbleToSVGOptions` - Optional configuration

#### Returns

- `string` - SVG markup as a string

### Types

#### `MarbleDiagram`

```typescript
interface MarbleDiagram {
  name?: string; // Optional name for the diagram
  diagram: string; // The marble diagram string
  frameTime?: number; // Frame time in ms (default: 10)
}
```

#### `MarbleToSVGOptions`

```typescript
interface MarbleToSVGOptions {
  theme?: Partial<SVGTheme>; // Custom theme
  frameTime?: number; // Frame time in ms
}
```

## Theming

The library provides extensive theming capabilities through the `SVGTheme` interface. You can customize colors, sizes, spacing, and visual elements.

### Theme Properties

#### Colors

| Property          | Type     | Default     | Description                                     |
| ----------------- | -------- | ----------- | ----------------------------------------------- |
| `backgroundColor` | `string` | `"#ffffff"` | Background color of the SVG                     |
| `lineColor`       | `string` | `"#333333"` | Color of the timeline and circle borders        |
| `valueColor`      | `string` | `"#4CAF50"` | Fill color of value circles                     |
| `errorColor`      | `string` | `"#f44336"` | Color of error indicators (X marks)             |
| `completeColor`   | `string` | `"#2196F3"` | Color of completion indicators (vertical lines) |
| `textColor`       | `string` | `"#000000"` | Color of text labels                            |

#### Sizing & Spacing

| Property       | Type     | Default | Description                          |
| -------------- | -------- | ------- | ------------------------------------ |
| `fontSize`     | `number` | `14`    | Font size in pixels                  |
| `lineWidth`    | `number` | `2`     | Width of lines in pixels             |
| `circleRadius` | `number` | `8`     | Radius of value circles in pixels    |
| `padding`      | `number` | `20`    | Padding around the diagram in pixels |
| `rowHeight`    | `number` | `60`    | Height of the diagram row in pixels  |
| `timeScale`    | `number` | `3`     | Scale factor for time representation |

#### Advanced Styling

| Property            | Type      | Default     | Description                                                 |
| ------------------- | --------- | ----------- | ----------------------------------------------------------- |
| `circleStrokeColor` | `string?` | `undefined` | Custom stroke color for circles (falls back to `lineColor`) |
| `circleStrokeWidth` | `number?` | `undefined` | Custom stroke width for circles (falls back to `lineWidth`) |

### Theme Examples

#### Dark Theme

```typescript
const darkTheme = {
  backgroundColor: "#1e1e1e",
  lineColor: "#404040",
  valueColor: "#61dafb",
  errorColor: "#ff6b6b",
  completeColor: "#4ecdc4",
  textColor: "#ffffff",
  fontSize: 16,
  circleRadius: 10
};

const svg = render("--a--b--c--|", { theme: darkTheme });
```

#### Material Design Theme

```typescript
const materialTheme = {
  backgroundColor: "#fafafa",
  lineColor: "#e0e0e0",
  valueColor: "#2196F3",
  errorColor: "#f44336",
  completeColor: "#4CAF50",
  textColor: "#212121",
  fontSize: 14,
  lineWidth: 1.5,
  circleRadius: 6,
  padding: 16,
  rowHeight: 48
};

const svg = render("--a--b--c--|", { theme: materialTheme });
```

#### Minimal Theme

```typescript
const minimalTheme = {
  backgroundColor: "#ffffff",
  lineColor: "#e1e1e1",
  valueColor: "#000000",
  errorColor: "#ff0000",
  completeColor: "#000000",
  textColor: "#666666",
  fontSize: 12,
  lineWidth: 1,
  circleRadius: 4,
  padding: 12,
  rowHeight: 40,
  timeScale: 2
};

const svg = render("--a--b--c--|", { theme: minimalTheme });
```

#### Custom Circle Styling

```typescript
const customCircles = {
  valueColor: "#ff6b9d",
  circleStrokeColor: "#ff4757",
  circleStrokeWidth: 3,
  circleRadius: 12
};

const svg = render("--a--b--c--|", { theme: customCircles });
```

## Marble Syntax

The library supports standard RxJS marble diagram syntax:

| Symbol              | Description          | Example                                           |
| ------------------- | -------------------- | ------------------------------------------------- | ------ | ---------------------------- |
| `-`                 | Frame (time unit)    | `--a--` (2 frames, then value 'a', then 2 frames) |
| `a-z`, `A-Z`, `0-9` | Values               | `a`, `B`, `1`                                     |
| `                   | `                    | Complete                                          | `--a-- | ` (complete after value 'a') |
| `#`                 | Error                | `--a--#` (error after value 'a')                  |
| `^`                 | Subscription point   | `^--a--` (subscription at start)                  |
| `!`                 | Unsubscription point | `--a--!` (unsubscription after value 'a')         |
| `()`                | Grouped values       | `--(ab)--` (values 'a' and 'b' at same time)      |
| ` ` (space)         | Ignored              | `-- a --` (spaces are ignored)                    |

## Examples

### Basic Streams

```typescript
// Simple stream with completion
render("--a--b--c--|");

// Stream with error
render("--a--b--#");

// Stream with subscription points
render("^--a--b--!");

// Multiple values at same time
render("--(abc)--d--|");
```

### Complex Scenarios

```typescript
// Multiple observables with names
const source = render({
  name: "Source",
  diagram: "--a--b--c--|",
  frameTime: 20
});

const mapped = render({
  name: "Mapped",
  diagram: "----A----B----C--|",
  frameTime: 20
});

// Error handling
const errorStream = render(
  {
    name: "Error Stream",
    diagram: "--a--#",
    frameTime: 15
  },
  {
    theme: {
      errorColor: "#ff4757",
      valueColor: "#2ed573"
    }
  }
);
```

### Advanced Theming

```typescript
// Custom theme for different diagram types
const successTheme = {
  backgroundColor: "#f8fff9",
  valueColor: "#00b894",
  completeColor: "#00b894",
  lineColor: "#ddd"
};

const errorTheme = {
  backgroundColor: "#fff8f8",
  valueColor: "#e17055",
  errorColor: "#d63031",
  lineColor: "#ddd"
};

// Success stream
render("--a--b--c--|", { theme: successTheme });

// Error stream
render("--a--b--#", { theme: errorTheme });
```

## Advanced Usage

### Custom Frame Times

```typescript
// Different frame times for different diagrams
const fastStream = render("--a--b--|", { frameTime: 5 });
const slowStream = render("--a--b--|", { frameTime: 50 });
```

### Programmatic Theme Generation

```typescript
function createTheme(baseColor: string) {
  return {
    backgroundColor: "#ffffff",
    lineColor: "#e0e0e0",
    valueColor: baseColor,
    errorColor: "#f44336",
    completeColor: baseColor,
    textColor: "#212121"
  };
}

// Use different colors for different streams
const blueStream = render("--a--b--|", { theme: createTheme("#2196F3") });
const greenStream = render("--a--b--|", { theme: createTheme("#4CAF50") });
```

## Exported Types and Functions

The library also exports additional types and functions for advanced usage:

```typescript
import {
  render,
  SVGTheme,
  defaultTheme,
  parseMarbleDiagram,
  ParsedMarbleDiagram,
  MarbleEvent
} from "svg-marbles";

// Use the default theme as a starting point
const myTheme = { ...defaultTheme, valueColor: "#ff6b9d" };

// Parse marble diagrams programmatically
const parsed = parseMarbleDiagram("--a--b--c--|", 10);
```

## License

MIT
