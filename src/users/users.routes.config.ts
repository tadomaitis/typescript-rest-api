import { CommonRoutesConfig } from '../common/common.routes.config'
import UsersController from './controllers/users.controller'
import UsersMiddleware from './middleware/users.middleware'
import { Application } from 'express'
import BodyValidationMiddleware from '../common/middlware/body.validation.middleware'
import { body } from 'express-validator'

export class UsersRoutes extends CommonRoutesConfig {
  constructor (app: Application) {
    super(app, 'UserRoutes')
  }

  configureRoutes (): Application {
    this.app
      .route('/users')
      .get(UsersController.listUsers)
      .post(
        body('email').isEmail(),
        body('password')
          .isLength({ min: 5 })
          .withMessage('Must include password (5+ characters'),
        BodyValidationMiddleware.verifyBodyFielsErrors,
        UsersMiddleware.validateSameEmailDoesntExist,
        UsersController.createUser
      )

    this.app.param('userId', UsersMiddleware.extractUserId)

    this.app
      .route('/users/:userId')
      .all(UsersMiddleware.validadeUserExists)
      .get(UsersController.getUserById)
      .delete(UsersController.removeUser)

    this.app.put('/users/:userId', [
      body('email').isEmail(),
      body('password')
        .isLength({ min: 5 })
        .withMessage('Must include password (5+ characters)'),
      body('firstName').isString(),
      body('lastName').isString(),
      body('permissionFlags').isInt(),
      BodyValidationMiddleware.verifyBodyFielsErrors,
      UsersMiddleware.validateSameEmailBelongToSameUser,
      UsersController.put
    ])

    this.app.patch('/users/:userId', [
      body('email')
        .isEmail()
        .optional(),
      body('password')
        .isLength({ min: 5 })
        .withMessage('Password must be 5+ characters')
        .optional(),
      body('firstName')
        .isString()
        .optional(),
      body('lastName')
        .isString()
        .optional(),
      body('permissionFlags')
        .isInt()
        .optional(),
      BodyValidationMiddleware.verifyBodyFielsErrors,
      UsersMiddleware.validatePatchEmail,
      UsersController.patch
    ])

    return this.app
  }
}
