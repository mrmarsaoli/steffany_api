import { __prod__ } from '../constants'

export const Log = (message?: any, ...optionalParams: any[]) => {
  if (__prod__) {
    return
  }

  if (!message) {
    return
  }

  if (optionalParams.length === 0) {
    console.log(message)
    return
  }

  console.log(message, ...optionalParams)
}

export const LogError = (message?: any, ...optionalParams: any[]) => {
  if (__prod__) {
    return
  }

  if (!message) {
    return
  }

  if (optionalParams.length === 0) {
    console.error(message)
    return
  }

  console.error(message, ...optionalParams)
}
