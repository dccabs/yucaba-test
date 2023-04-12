import { Method } from 'axios'
import { MethodNotAllowed } from 'http-errors'

export const checkRequestMethod = (method: string | undefined) => {
  if (method !== 'POST') {
    throw new MethodNotAllowed(`${method} is not allowed`)
  }
}
