export type ErrorParams = {
  name?: string
  message?: string
  statusCode?: number
  errors?: any[]
}

export abstract class ApplicationError extends Error implements ErrorParams {
  public statusCode = 500
  abstract serialize(): any
  constructor(message?: string) {
    super(message)
    this.message = message || this.name
    this.name = 'Default application error'
  }
}
