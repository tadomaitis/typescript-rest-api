import { CreateUserDto } from '../dto/create.user.dto'
import { PuteUserDto } from '../dto/put.user.dto'
import { PatchUserDto } from '../dto/patch.user.dto'

import shortid from 'shortid'
import debug from 'debug'

const log: debug.IDebugger = debug('app:in-memory-dao')

class UsersDao {
  users: Array<CreateUserDto> = []

  constructor () {
    log('Created new instance of UsersDao')
  }

  async addUser (user: CreateUserDto) {
    user.id = shortid.generate()
    this.users.push(user)
    return user.id
  }

  async getUsers () {
    return this.users
  }

  async getUserById (userId: string) {
    return this.users.find((user: { id: string }) => user.id === userId)
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
