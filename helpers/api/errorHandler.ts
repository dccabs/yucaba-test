import { NextApiResponse } from 'next'
import { isHttpError } from 'http-errors'
import { ZodError } from 'zod'

import { ErrorResponse } from '../common/types/errorResponse'

const errorHandler = <T>(
  err: unknown,
  res: NextApiResponse<T | ErrorResponse>,
) => {
  if (isHttpError(err) && err.expose) {
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
        name: err.name,
        status: err.statusCode,
      },
    })
  } else if (err instanceof ZodError) {
    for (const issue of err.issues) {
      switch (issue.code) {
        case 'invalid_type':
          return res.status(400).json({
            error: {
              message: `${issue.path[0]} is required`,
              name: 'Required',
              status: 400,
            },
          })
        case 'too_small':
          return res.status(400).json({
            error: {
              message: `${issue.path[0]} require at least ${issue.minimum} character(s)`,
              name: 'TooSmall',
              status: 400,
            },
          })

        default:
          break
      }
    }
  } else {
    return res.status(500).json({
      error: {
        message: 'Unhandled server error',
        name: 'Internal Server Error',
        status: 500,
      },
    })
  }
}

export default errorHandler
