import { CreateUserDto } from '../dto/create.user.dto'
import { PutUserDto } from '../dto/put.user.dto'
import { PatchUserDto } from '../dto/patch.user.dto'
import mongooseService from '../../common/services/mongoose.service'
import { PermissionFlag } from '../../common/middleware/common.permissionflag.enum'

import shortid from 'shortid'
import debug from 'debug'

const log: debug.IDebugger = debug('app:in-memory-dao')

class UsersDao {
  Schema = mongooseService.getMongoose().Schema

  userSchema = new this.Schema(
    {
      _id: String,
      email: String,
      password: { type: String, select: false },
      firstName: String,
      lastName: String,
      permissionFlags: Number
    },
    { id: false }
  )

  // the 'select: false' option in password fiel will hide this field whenever
  // we get a user or lsit all users

  // user schema probably looks familiar because it’s similar to our DTO
  // entities. The main difference is that we are defining which fields should
  // exist in our MongoDB collection called Users, while the DTO entities
  // defines which fields to accept in an HTTP request.

  User = mongooseService.getMongoose().model('Users', this.userSchema)

  constructor () {
    log('Created new instance of UsersDao')
  }

  async addUser (userFields: CreateUserDto) {
    const userId = shortid.generate()
    const user = new this.User({
      _id: userId,
      ...userFields,
      permissionFlags: PermissionFlag.FREE_PERMISSION
    })
    await user.save()
    return userId
  }

  async getUserByEmail (email: string) {
    return this.User.findOne({ email: email }).exec()
  }

  async getUserById (userId: string) {
    return this.User.findOne({ _id: userId })
      .populate('User')
      .exec()
  }

  async getUsers (limit = 25, page = 0) {
    return this.User.find()
      .limit(limit)
      .skip(limit * page)
      .exec()
  }

  async updateUserById (userId: string, userFields: PatchUserDto | PutUserDto) {
    const existingUser = await this.User.findOneAndUpdate(
      { _id: userId },
      { $set: userFields },
      { new: true }
    ).exec()

    return existingUser
  }

  async removeUserById (userId: string) {
    return this.User.deleteOne({ _id: userId }).exec()
  }

  async getUserByEmailWithPassword(email: string)  {
    return this.User.findOne({ email: email })
      .select('_id email permissionFlags +password')
      .exec()
  }
}

export default new UsersDao()

// Using the singleton pattern, this class will always
// provide the same instance—and, critically, the same users
// array—when we import it in other files. That’s because Node.js
// caches this file wherever it’s imported, and all the imports
// happen on startup. That is, any file referring to users.dao.ts
// will be handed a reference to the same new UsersDao() that gets
// exported the first time Node.js processes this file.

// Note: An oft-cited disadvantage to singletons is that they’re hard
// to write unit tests for. In the case of many of our classes, this
// disadvantage won’t apply, since there aren’t any class member variables
// that would need resetting. But for those where it would, we leave it
// as an exercise for the reader to consider approaching this problem with
// the use of dependency injection.
