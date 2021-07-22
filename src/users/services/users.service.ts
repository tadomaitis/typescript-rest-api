import UsersDao from '../daos/users.daos'
import { CRUD } from '../../common/interfaces/crud.interfaces'
import { CreateUserDto } from '../dto/create.user.dto'
import { PutUserDto } from '../dto/put.user.dto'
import { PatchUserDto } from '../dto/patch.user.dto'

class UsersService implements CRUD {
  async create (resource: CreateUserDto) {
    return UsersDao.addUser(resource)
  }

  async deleteById (id: string) {
    return UsersDao.removeUserById(id)
  }

  async list (limit: number, page: number) {
    return UsersDao.getUsers(limit, page)
  }

  async patchById (id: string, resource: PatchUserDto) {
    return UsersDao.updateUserById(id, resource)
  }

  async readById (id: string) {
    return UsersDao.getUserById(id)
  }

  async putById (id: string, resource: PutUserDto) {
    return UsersDao.updateUserById(id, resource)
  }

  async getUserByEmail (email: string) {
    return UsersDao.getUserByEmail(email)
  }
}

export default new UsersService()
