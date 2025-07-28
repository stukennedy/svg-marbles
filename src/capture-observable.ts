import { TestScheduler } from 'rxjs/testing';
import { Observable } from 'rxjs';

interface MarbleCapture {
  marble: string;
  values: Record<string, any>;
}

/**
 * Captures the actual marble output of an observable within TestScheduler
 */
export function captureMarbles(
  scheduler: TestScheduler,
  setup: (helpers: { cold: TestScheduler['createColdObservable']; hot: TestScheduler['createHotObservable'] }) => Observable<any>
): MarbleCapture {
  let capturedMarble = '';
  let capturedValues: Record<string, any> = {};

  scheduler.run((helpers) => {
    const observable = setup(helpers);

    // Create a subscriber to capture emissions
    const messages: any[] = [];
    let subscription: any;

    scheduler.schedule(() => {
      subscription = observable.subscribe({
        next: (value) => {
          messages.push({
            frame: scheduler.frame,
            notification: { kind: 'N', value, hasValue: true }
          });
        },
        error: (error) => {
          messages.push({
            frame: scheduler.frame,
            notification: {
              kind: 'E',
              value: undefined,
              error,
              hasValue: false
            }
          });
        },
        complete: () => {
          messages.push({
            frame: scheduler.frame,
            notification: { kind: 'C', value: undefined, hasValue: false }
          });
        }
      });
    }, 0);

    // Run the scheduler
    scheduler.flush();

    // Convert messages to marble notation
    const result = messagesToMarbles(messages);
    capturedMarble = result.marble;
    capturedValues = result.values;
  });

  return { marble: capturedMarble, values: capturedValues };
}

function messagesToMarbles(messages: any[]): MarbleCapture {
  if (messages.length === 0) {
    return { marble: '', values: {} };
  }

  let marble = '';
  const values: Record<string, any> = {};
  let currentFrame = 0;
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const valueToChar = new Map<string, string>();
  const usedChars = new Set<string>();
  let charIndex = 0;

  // Sort messages by frame
  messages.sort((a, b) => a.frame - b.frame);

  for (const message of messages) {
    // Add dashes for time gaps
    while (currentFrame < message.frame) {
      marble += '-';
      currentFrame++;
    }

    const { notification } = message;

    if (notification.kind === 'N') {
      // Next value
      const value = notification.value;
      const valueStr = JSON.stringify(value);
      let char = valueToChar.get(valueStr);

      if (!char) {
        // Always assign a new character for each unique value
        char = getNextAvailableChar(alphabet, charIndex, usedChars);
        charIndex++;

        valueToChar.set(valueStr, char);
        usedChars.add(char);
        values[char] = value;
      }

      marble += char;
    } else if (notification.kind === 'E') {
      // Error
      marble += '#';
    } else if (notification.kind === 'C') {
      // Complete
      marble += '|';
    }

    currentFrame++;
  }

  return { marble, values };
}

function getNextAvailableChar(alphabet: string, startIndex: number, usedChars: Set<string>): string {
  let index = startIndex;
  let char = '';

  do {
    if (index < alphabet.length) {
      char = alphabet[index];
    } else {
      // Use double letters: aa, ab, ac...
      const letterIndex = index % alphabet.length;
      const suffix = Math.floor(index / alphabet.length);
      char = alphabet[letterIndex] + suffix;
    }
    index++;
  } while (usedChars.has(char));

  return char;
}

/**
 * Helper to capture marbles from a test scenario
 */
export function testWithCapture(setup: (helpers: { cold: TestScheduler['createColdObservable']; hot: TestScheduler['createHotObservable'] }) => Observable<any>): MarbleCapture {
  const scheduler = new TestScheduler(() => true);
  return captureMarbles(scheduler, setup);
}
