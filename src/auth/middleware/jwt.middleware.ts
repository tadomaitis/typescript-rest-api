import { Request, Response, NextFunction } from 'express'
import crypto from 'crypto'
import usersService from '../../users/services/users.service'

// @ts-expect-error
const jwtSecret: string = process.env.JWT_SECRET

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

  async validRefreshNeeded(req: Request, res: Response, next: NextFunction) {
    const user: any = await usersService.getUserByEmailWithPassword(
      res.locals.jwt.email
    )
    const salt = crypto.createSecretKey(
      Buffer.from(res.locals.jwt.refreshKey.data)
    )
    const hash = crypto
      .createHmac('sha512', salt)
      .update(res.locals.jwt.userId + jwtSecret).digest('base64')
    if (hash === req.body.refreshToken) {
      req.body = {
        userId: user._id,
        email: user.email,
        permissionFlags: user.permissionFlags
      }
      return next()
    } else {
      return res.status(400).send({ errors: ['Invalid refreshToken']})
    }
  }

}

export default new JwtMiddleware()
