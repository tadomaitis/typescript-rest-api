import { Request, Response, NextFunction } from 'express'
import usersService from '../../users/services/users.service'
import * as argon2 from 'argon2'

class AuthMiddleware {
  async verifyUserPassword(
    req: Request, res:Response, next: NextFunction
  ) {
    const user: any = await usersService.getUserByEmailWithPassword(req.body.email)
    if (user) {
      const passwordHash = user.password
      if (await argon2.verify(passwordHash, req.body.password)) {
        req.body = {
          userId: user._id,
          email: user.email,
          permissionFlags: user.permissionFlags
        }
        return next()
      }
    }
    // Giving the same message in both case
    // helps protec agains cracking attempts:
    res.status(400).send({ errors: ['Invalid email and/or password'] })
  }
}
