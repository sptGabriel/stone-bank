import { LoggerProvider } from "~presentation/protocols/index";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
interface retryOptions {
  fn: any;
  retries: number;
  interval: number;
}
interface retry {
  fn: any;
  retries: number;
  interval: number;
  retryMsg?: string;
  logger: LoggerProvider;
}

export const retryPromise = async <T>(opts: retry): Promise<T> => {
  const { fn, interval, retryMsg, logger } = opts;
  try {
    return await fn;
  } catch (error) {
    await wait(interval);
    if (opts.retries === 0) throw new Error(error);
    logger.log(`info`, `${retryMsg}: ${opts.retries}`, error);
    return await retryPromise({
      fn,
      retries: --opts.retries,
      interval,
      retryMsg,
			logger
    });
  }
};