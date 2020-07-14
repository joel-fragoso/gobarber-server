import { uuid } from 'uuidv4';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

import User from '@modules/users/infra/typeorm/entities/User';

class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async findById(id: string): Promise<User | undefined> {
    const foundUserById = this.users.find(user => user.id === id);

    return foundUserById;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const foundUserByEmail = this.users.find(user => user.email === email);

    return foundUserByEmail;
  }

  public async create({
    name,
    email,
    password,
  }: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, { id: uuid(), name, email, password });

    this.users.push(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    const findUserIndex = this.users.findIndex(
      findUser => findUser.id === user.id,
    );

    this.users[findUserIndex] = user;

    return user;
  }
}

export default FakeUsersRepository;
