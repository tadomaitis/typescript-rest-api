import { Request, Response, NextFunction } from 'express'

class JwtMiddleware {
  verifyRefreshBodyField(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (req.body && req.body.refreshToken) {
      return next()
    } else {
      return res
            .status(400)
            .send({ errors: ['Missing required field: refreshToken'] })
    }
  }

}

export default new JwtMiddleware()
