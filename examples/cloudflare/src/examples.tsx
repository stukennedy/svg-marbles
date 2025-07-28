import { Context } from 'hono';
import { map, filter, delay, merge } from 'rxjs';
import { MarbleSVG } from './utils';
import { SVGTheme } from 'svg-marbles';
import { testWithCapture } from 'svg-marbles';

const darkTheme: Partial<SVGTheme> = {
  backgroundColor: 'transparent',
  lineColor: '#fff',
  valueColor: '#ff5722',
  textColor: '#fff',
  circleStrokeColor: '#fff',
  circleStrokeWidth: 3,
  circleRadius: 18,
  padding: 8
};

export const onRequestGet = (c: Context) => {
  // Simple input stream
  const inputStream = 'a--b--c--d--|';

  // Map operation: multiply each value by 2
  const mappedStream = testWithCapture(({ cold }) => cold(inputStream, { a: 1, b: 2, c: 3, d: 4 }).pipe(map((x) => x * 2)));

  // Filter operation: only even numbers
  const filteredStream = testWithCapture(({ cold }) => cold(inputStream, { a: 1, b: 2, c: 3, d: 4 }).pipe(filter((x) => x % 2 === 0)));

  // Delay operation: add 2 frame delay
  const delayedStream = testWithCapture(({ cold }) => cold(inputStream, { a: 1, b: 2, c: 3, d: 4 }).pipe(delay(2)));

  // Merge operation: combine two streams
  const stream1 = 'a--b--|';
  const stream2 = '--c--d--|';

  const mergedStream = testWithCapture(({ cold }) => merge(cold(stream1, { a: 1, b: 2 }), cold(stream2, { c: 3, d: 4 })));

  // Error handling example
  const errorStream = testWithCapture(({ cold }) => cold('a--#', { a: 1 }, new Error('Something went wrong')));

  return c.render(
    <div class="flex justify-center items-center pt-4">
      <div class="flex flex-col gap-4">
        <div class="px-6 py-4 bg-gray-800 rounded-lg">
          <h1 class="text-white font-bold text-3xl mb-4">RxJS Marble Diagrams</h1>
          <p class="text-gray-300 mb-4">Simple examples of RxJS operations visualized with marble diagrams.</p>

          <div class="grid grid-cols-1 gap-4">
            <div class="flex flex-col">
              <h2 class="text-white font-bold text-xl mb-2">Input Stream</h2>
              <div class="flex flex-col">
                <span class="text-white">Original: [1, 2, 3, 4]</span>
                <MarbleSVG diagram={inputStream} theme={darkTheme} color="#00bcd4" />
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <h2 class="text-white font-bold text-xl mb-2">Transformations</h2>
              <div class="flex flex-col">
                <span class="text-white">Map (×2): [2, 4, 6, 8]</span>
                <MarbleSVG diagram={mappedStream.marble} theme={darkTheme} color="#66bb6a" />
              </div>
              <div class="flex flex-col">
                <span class="text-white">Filter (even only): [2, 4]</span>
                <MarbleSVG diagram={filteredStream.marble} theme={darkTheme} color="#9c27b0" />
              </div>
              <div class="flex flex-col">
                <span class="text-white">Delay (2 frames)</span>
                <MarbleSVG diagram={delayedStream.marble} theme={darkTheme} color="#ff9800" />
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <h2 class="text-white font-bold text-xl mb-2">Combination</h2>
              <div class="flex flex-col">
                <span class="text-white">Stream 1: [1, 2]</span>
                <MarbleSVG diagram={stream1} theme={darkTheme} color="#e91e63" />
              </div>
              <div class="flex flex-col">
                <span class="text-white">Stream 2: [3, 4]</span>
                <MarbleSVG diagram={stream2} theme={darkTheme} color="#3f51b5" />
              </div>
              <div class="flex flex-col">
                <span class="text-white">Merged: [1, 3, 2, 4]</span>
                <MarbleSVG diagram={mergedStream.marble} theme={darkTheme} color="#00bcd4" />
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <h2 class="text-white font-bold text-xl mb-2">Error Handling</h2>
              <div class="flex flex-col">
                <span class="text-white">Error Stream</span>
                <MarbleSVG diagram={errorStream.marble} theme={darkTheme} color="#f44336" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
