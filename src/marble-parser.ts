export interface MarbleEvent {
  time: number;
  value?: string;
  type: 'next' | 'error' | 'complete';
}

export interface ParsedMarbleDiagram {
  events: MarbleEvent[];
  duration: number;
}

export function parseMarbleDiagram(marble: string, frameTime: number = 10): ParsedMarbleDiagram {
  const events: MarbleEvent[] = [];
  let currentTime = 0;

  for (let i = 0; i < marble.length; i++) {
    const char = marble[i];

    switch (char) {
      case '-':
        currentTime += frameTime;
        break;
      
      case '|':
        events.push({ time: currentTime, type: 'complete' });
        break;
      
      case '#':
        events.push({ time: currentTime, type: 'error' });
        break;
      
      case '(':
        const closeIndex = marble.indexOf(')', i);
        if (closeIndex === -1) {
          throw new Error('Unclosed group in marble diagram');
        }
        const groupContent = marble.substring(i + 1, closeIndex);
        for (const groupChar of groupContent) {
          if (groupChar !== '-') {
            events.push({ time: currentTime, value: groupChar, type: 'next' });
          }
        }
        i = closeIndex;
        currentTime += frameTime;
        break;
      
      case ')':
        throw new Error('Unexpected closing parenthesis');
      
      case ' ':
        break;
      
      default:
        events.push({ time: currentTime, value: char, type: 'next' });
        currentTime += frameTime;
        break;
    }
  }

  return {
    events,
    duration: currentTime
  };
}