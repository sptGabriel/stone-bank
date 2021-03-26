import { Logger } from '~/infrastructure/logger/logger'

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

interface retry {
  fn: any
  retries: number
  interval: number
  retryMsg?: string
}

export const retryPromise = async <T>(opts: retry): Promise<T> => {
  const { fn, interval, retryMsg } = opts
  try {
    return await fn
  } catch (error) {
    await wait(interval)
    if (opts.retries === 0) throw new Error(error)
    Logger.log(`info`, `${retryMsg}: ${opts.retries}`, error)
    return await retryPromise({
      fn,
      retries: --opts.retries,
      interval,
      retryMsg,
    })
  }
}
