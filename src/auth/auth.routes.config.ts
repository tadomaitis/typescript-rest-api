import {CommonRoutesConfig} from '../common/common.routes.config'
import authController from './controller/auth.controller'
import authMiddleware from './middleware/auth.middleware'
import jwtMiddleware from './middleware/jwt.middleware'
import { Application } from 'express'
import BodyValidationMiddleware from '../common/middlware/body.validation.middleware'
import { body } from 'express-validator'

export class AuthRoutes extends CommonRoutesConfig {
  constructor(app: Application) {
    super(app, 'AuthRoutes')
  }

  configureRoutes(): Application {
    this.app.post('/auth', [
      body('email').isEmail(),
      body('password').isString(),
      BodyValidationMiddleware.verifyBodyFielsErrors,
      authMiddleware.verifyUserPassword,
      authController.createJWT      
    ])
    this.app.post('/auth/refresh-token', [
      jwtMiddleware.validJWTNeeded,
      jwtMiddleware.verifyRefreshBodyField,
      jwtMiddleware.validRefreshNeeded,
      authController.createJWT
    ])

    return this.app
  }
}
