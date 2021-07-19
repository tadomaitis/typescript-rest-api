import { CommonRoutesConfig } from '../common/common.routes.config'
import UsersController from './controllers/users.controller'
import UsersMiddleware from './middleware/users.middleware'
import { Application } from 'express'

export class UsersRoutes extends CommonRoutesConfig {
  constructor (app: Application) {
    super(app, 'UserRoutes')
  }

  configureRoutes (): Application {
    this.app
      .route('/users')
      .get(UsersController.listUsers)
      .post(
        UsersMiddleware.validateRequiredUserBodyFields,
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
      UsersMiddleware.validateRequiredUserBodyFields,
      UsersMiddleware.validateSameEmailBelongToSameUser,
      UsersController.put
    ])

    this.app.patch('/users/:userId', [
      UsersMiddleware.validatePatchEmail,
      UsersController.patch
    ])

    return this.app
  }
}
