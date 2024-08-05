import {
  MAX_REQUESTS_PER_MIN,
  MAX_REQUESTS_PER_DAY,
  ErrorMessages,
} from './data';

interface Requests {
  [key: string]: number;
}

const queue: (() => void)[] = [];
const requests: Requests = {};
let dailyRequests = 0;
let processingQueue = false;

function processQueue() {
  if (processingQueue) return;
  processingQueue = true;

  while (queue.length > 0) {
    const nextRequest = queue.shift();
    if (nextRequest) {
      nextRequest();
    }
  }

  processingQueue = false;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function rateLimit(fn: Function) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async function (...args: any[]) {
    const now = Date.now();
    const minuteStart = Math.floor(now / 60000) * 60000;
    const dayStart = Math.floor(now / 86400000) * 86400000;

    const minuteKey = minuteStart.toString();
    const dayKey = dayStart.toString();

    if (!requests[minuteKey]) {
      requests[minuteKey] = 0;
    }

    if (!requests[dayKey]) {
      requests[dayKey] = 0;
    }

    if (dailyRequests >= MAX_REQUESTS_PER_DAY) {
      throw new Error(ErrorMessages.DailyRateLimit);
    }

    if (requests[minuteKey] >= MAX_REQUESTS_PER_MIN) {
      return new Promise<void>((resolve, reject) => {
        queue.push(async () => {
          try {
            const result = await Promise.race([
              fn(...args),
              new Promise((_, reject) =>
                setTimeout(
                  () => reject(new Error(ErrorMessages.MinuteRateLimit)),
                  60000,
                ),
              ),
            ]);
            resolve(result);
          } catch (error) {
            reject(error);
          } finally {
            processQueue();
          }
        });
      });
    }

    requests[minuteKey]++;
    requests[dayKey]++;
    dailyRequests++;

    for (const timestamp in requests) {
      if (Number(timestamp) < now - 60000) {
        delete requests[timestamp];
      }
    }

    if (now - dayStart >= 86400000) {
      dailyRequests = 0;
    }

    const result = await fn(...args);
    processQueue();
    return result;
  };
}
