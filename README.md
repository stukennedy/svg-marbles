# svg-marbles

A library for rendering RxJS marble diagrams as SVG with comprehensive theming support.

## Installation

```bash
npm install svg-marbles
```

## Quick Start

```typescript
import { render } from 'svg-marbles';

// Simple marble diagram
const svg = render('--a--b--c--|');

// With custom theme
const themedSvg = render('--a--b--c--|', {
  theme: {
    backgroundColor: '#1e1e1e',
    valueColor: '#61dafb'
  }
});

// With named diagram
const namedSvg = render({
  name: 'My Observable',
  diagram: '--a--b--c--|',
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

**Note**: Horizontal padding is automatically calculated to prevent marble truncation and cannot be overridden by users. Only vertical padding can be customized.

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

| Property       | Type     | Default | Description                                                                                                                 |
| -------------- | -------- | ------- | --------------------------------------------------------------------------------------------------------------------------- |
| `fontSize`     | `number` | `14`    | Font size in pixels                                                                                                         |
| `lineWidth`    | `number` | `2`     | Width of lines in pixels                                                                                                    |
| `circleRadius` | `number` | `8`     | Radius of value circles in pixels                                                                                           |
| `padding`      | `number` | `25`    | Vertical padding around the diagram in pixels (horizontal padding is calculated automatically to prevent marble truncation) |
| `rowHeight`    | `number` | `60`    | Height of the diagram row in pixels                                                                                         |
| `timeScale`    | `number` | `3`     | Scale factor for time representation                                                                                        |

#### Advanced Styling

| Property            | Type      | Default     | Description                                                 |
| ------------------- | --------- | ----------- | ----------------------------------------------------------- |
| `circleStrokeColor` | `string?` | `undefined` | Custom stroke color for circles (falls back to `lineColor`) |
| `circleStrokeWidth` | `number?` | `undefined` | Custom stroke width for circles (falls back to `lineWidth`) |

### Theme Examples

#### Dark Theme

```typescript
const darkTheme = {
  backgroundColor: '#1e1e1e',
  lineColor: '#404040',
  valueColor: '#61dafb',
  errorColor: '#ff6b6b',
  completeColor: '#4ecdc4',
  textColor: '#ffffff',
  fontSize: 16,
  circleRadius: 10
};

const svg = render('--a--b--c--|', { theme: darkTheme });
```

#### Material Design Theme

```typescript
const materialTheme = {
  backgroundColor: '#fafafa',
  lineColor: '#e0e0e0',
  valueColor: '#2196F3',
  errorColor: '#f44336',
  completeColor: '#4CAF50',
  textColor: '#212121',
  fontSize: 14,
  lineWidth: 1.5,
  circleRadius: 6,
  padding: 16,
  rowHeight: 48
};

const svg = render('--a--b--c--|', { theme: materialTheme });
```

#### Minimal Theme

```typescript
const minimalTheme = {
  backgroundColor: '#ffffff',
  lineColor: '#e1e1e1',
  valueColor: '#000000',
  errorColor: '#ff0000',
  completeColor: '#000000',
  textColor: '#666666',
  fontSize: 12,
  lineWidth: 1,
  circleRadius: 4,
  padding: 12,
  rowHeight: 40,
  timeScale: 2
};

const svg = render('--a--b--c--|', { theme: minimalTheme });
```

#### Custom Circle Styling

```typescript
const customCircles = {
  valueColor: '#ff6b9d',
  circleStrokeColor: '#ff4757',
  circleStrokeWidth: 3,
  circleRadius: 12
};

const svg = render('--a--b--c--|', { theme: customCircles });
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
render('--a--b--c--|');

// Stream with error
render('--a--b--#');

// Stream with subscription points
render('^--a--b--!');

// Multiple values at same time
render('--(abc)--d--|');
```

### Complex Scenarios

```typescript
// Multiple observables with names
const source = render({
  name: 'Source',
  diagram: '--a--b--c--|',
  frameTime: 20
});

const mapped = render({
  name: 'Mapped',
  diagram: '----A----B----C--|',
  frameTime: 20
});

// Error handling
const errorStream = render(
  {
    name: 'Error Stream',
    diagram: '--a--#',
    frameTime: 15
  },
  {
    theme: {
      errorColor: '#ff4757',
      valueColor: '#2ed573'
    }
  }
);
```

### Advanced Theming

```typescript
// Custom theme for different diagram types
const successTheme = {
  backgroundColor: '#f8fff9',
  valueColor: '#00b894',
  completeColor: '#00b894',
  lineColor: '#ddd'
};

const errorTheme = {
  backgroundColor: '#fff8f8',
  valueColor: '#e17055',
  errorColor: '#d63031',
  lineColor: '#ddd'
};

// Success stream
render('--a--b--c--|', { theme: successTheme });

// Error stream
render('--a--b--#', { theme: errorTheme });
```

## Advanced Usage

### Custom Frame Times

```typescript
// Different frame times for different diagrams
const fastStream = render('--a--b--|', { frameTime: 5 });
const slowStream = render('--a--b--|', { frameTime: 50 });
```

### Programmatic Theme Generation

```typescript
function createTheme(baseColor: string) {
  return {
    backgroundColor: '#ffffff',
    lineColor: '#e0e0e0',
    valueColor: baseColor,
    errorColor: '#f44336',
    completeColor: baseColor,
    textColor: '#212121'
  };
}

// Use different colors for different streams
const blueStream = render('--a--b--|', { theme: createTheme('#2196F3') });
const greenStream = render('--a--b--|', { theme: createTheme('#4CAF50') });
```

## Testing and Observable Capture

The library provides utilities for capturing the actual marble output of RxJS observables during testing, which is useful for generating marble diagrams from real observable streams.

### `testWithCapture(setup)`

Captures the marble output of an observable within a TestScheduler environment.

#### Parameters

- `setup`: `(helpers: { cold: TestScheduler['createColdObservable'], hot: TestScheduler['createHotObservable'] }) => Observable<any>` - Function that creates and returns an observable using the provided test helpers

#### Returns

- `MarbleCapture` - Object containing the marble string and value mappings

#### MarbleCapture

```typescript
interface MarbleCapture {
  marble: string; // The marble diagram string
  values: Record<string, any>; // Mapping of characters to actual values
}
```

### `captureMarbles(scheduler, setup)`

Lower-level function that captures marbles using a provided TestScheduler instance.

#### Parameters

- `scheduler`: `TestScheduler` - The test scheduler to use for capturing
- `setup`: `(helpers: { cold: TestScheduler['createColdObservable'], hot: TestScheduler['createHotObservable'] }) => Observable<any>` - Function that creates and returns an observable

#### Returns

- `MarbleCapture` - Object containing the marble string and value mappings

### Examples

#### Basic Observable Capture

```typescript
import { testWithCapture } from 'svg-marbles';
import { of, map, delay } from 'rxjs';

// Capture a simple observable
const result = testWithCapture(({ cold }) => {
  return cold('--a--b--c--|', { a: 1, b: 2, c: 3 });
});

console.log(result.marble); // "--a--b--c--|"
console.log(result.values); // { a: 1, b: 2, c: 3 }
```

#### Complex Observable with Transformations

```typescript
import { testWithCapture } from 'svg-marbles';
import { of, map, delay, mergeMap } from 'rxjs';

const result = testWithCapture(({ cold }) => {
  const source = cold('--a--b--|', { a: 1, b: 2 });
  return source.pipe(
    map((x) => x * 2),
    delay(10)
  );
});

console.log(result.marble); // "----A----B--|"
console.log(result.values); // { A: 2, B: 4 }
```

#### Hot Observable Capture

```typescript
import { testWithCapture } from 'svg-marbles';

const result = testWithCapture(({ hot }) => {
  return hot('^--a--b--c--|', { a: 'hello', b: 'world', c: '!' });
});

console.log(result.marble); // "^--a--b--c--|"
console.log(result.values); // { a: 'hello', b: 'world', c: '!' }
```

#### Error Handling

```typescript
import { testWithCapture } from 'svg-marbles';

const result = testWithCapture(({ cold }) => {
  return cold('--a--#', { a: 1 }, new Error('Something went wrong'));
});

console.log(result.marble); // "--a--#"
console.log(result.values); // { a: 1 }
```

#### Complex Values and Auto-Assignment

```typescript
import { testWithCapture } from 'svg-marbles';

const result = testWithCapture(({ cold }) => {
  return cold('--a--b--c--|', {
    a: { id: 1, name: 'Alice' },
    b: { id: 2, name: 'Bob' },
    c: { id: 3, name: 'Charlie' }
  });
});

console.log(result.marble); // "--a--b--c--|"
console.log(result.values);
// {
//   a: { id: 1, name: 'Alice' },
//   b: { id: 2, name: 'Bob' },
//   c: { id: 3, name: 'Charlie' }
// }
```

### Integration with Rendering

You can combine observable capture with SVG rendering to generate diagrams from real observables:

```typescript
import { testWithCapture, render } from 'svg-marbles';
import { of, map, delay } from 'rxjs';

// Capture the observable
const capture = testWithCapture(({ cold }) => {
  return cold('--a--b--c--|', { a: 1, b: 2, c: 3 });
});

// Render the captured marble as SVG
const svg = render(capture.marble, {
  theme: {
    valueColor: '#2196F3',
    backgroundColor: '#f5f5f5'
  }
});

console.log(svg); // SVG markup string
```

### Advanced Usage with Custom Scheduler

```typescript
import { captureMarbles } from 'svg-marbles';
import { TestScheduler } from 'rxjs/testing';

const scheduler = new TestScheduler((actual, expected) => {
  // Custom assertion logic
  expect(actual).toEqual(expected);
});

const result = captureMarbles(scheduler, ({ cold }) => {
  return cold('--a--b--|', { a: 'x', b: 'y' });
});

console.log(result.marble); // "--a--b--|"
```

## Exported Types and Functions

The library also exports additional types and functions for advanced usage:

```typescript
import { render, SVGTheme, defaultTheme, parseMarbleDiagram, ParsedMarbleDiagram, MarbleEvent, testWithCapture, captureMarbles, MarbleCapture } from 'svg-marbles';

// Use the default theme as a starting point
const myTheme = { ...defaultTheme, valueColor: '#ff6b9d' };

// Parse marble diagrams programmatically
const parsed = parseMarbleDiagram('--a--b--c--|', 10);

// Capture observable marbles
const capture = testWithCapture(({ cold }) => cold('--a--b--|', { a: 1, b: 2 }));
```

## Examples

### Cloudflare Workers Example

The library includes a complete Cloudflare Workers example that demonstrates basic RxJS operations with marble diagram generation.

#### Features Demonstrated

- **Real-time marble diagram generation** from RxJS observables
- **Basic RxJS operators** like `map`, `filter`, `delay`, and `merge`
- **Custom theming** with dark mode and transparent backgrounds
- **Web deployment** using Cloudflare Workers and Hono
- **Educational visualization** of common reactive patterns

#### Getting Started

```bash
# From the project root
cd examples/cloudflare
bun install
bun dev
```

**Note**: This example uses the parent library directly via `file:../../` dependency, so any changes to the main library will be immediately reflected in the example.

#### What It Shows

The example demonstrates fundamental RxJS operations with clear visual feedback:

1. **Input Stream**: Simple sequence `[1, 2, 3, 4]`
2. **Transformations**: Map (×2), filter (even numbers), delay (2 frames)
3. **Combination**: Merging two streams with different timing
4. **Error Handling**: Visualizing error scenarios

#### Key Implementation Details

```typescript
// Map operation: multiply each value by 2
const mappedStream = testWithCapture(({ cold }) => cold('a--b--c--d--|', { a: 1, b: 2, c: 3, d: 4 }).pipe(map((x) => x * 2)));

// Filter operation: only even numbers
const filteredStream = testWithCapture(({ cold }) => cold('a--b--c--d--|', { a: 1, b: 2, c: 3, d: 4 }).pipe(filter((x) => x % 2 === 0)));

// Merge operation: combine two streams
const mergedStream = testWithCapture(({ cold }) => merge(cold('a--b--|', { a: 1, b: 2 }), cold('--c--d--|', { c: 3, d: 4 })));

// Custom dark theme for web display
const darkTheme: Partial<SVGTheme> = {
  backgroundColor: 'transparent',
  lineColor: '#fff',
  valueColor: '#ff5722',
  textColor: '#fff',
  circleStrokeColor: '#fff',
  circleStrokeWidth: 3,
  circleRadius: 18,
  padding: 4
};
```

#### Technologies Used

- **Cloudflare Workers** for serverless deployment
- **Hono** for web framework
- **RxJS** for reactive programming
- **Tailwind CSS** for styling
- **Bun** for fast development

This example is perfect for learning RxJS concepts and understanding how marble diagrams represent observable streams.

## Development

### Working with Examples

The examples in this repository are configured to use the parent library directly, making them perfect for development and testing:

```bash
# Build the main library
npm run build

# Run the Cloudflare example
cd examples/cloudflare
bun install
bun dev
```

Any changes to the main library will be immediately reflected in the examples after rebuilding.

### Adding New Examples

To add a new example:

1. Create a new directory in `examples/`
2. Set up your project with `"svg-marbles": "file:../../"` in package.json
3. Import and use the library as normal
4. Document the example in this README

## License

MIT
