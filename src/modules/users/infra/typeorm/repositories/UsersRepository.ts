import { Repository, getRepository, Not } from 'typeorm';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import User from '@modules/users/infra/typeorm/entities/User';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async findAllProviders({
    except_user_id,
  }: IFindAllProvidersDTO): Promise<User[]> {
    let users: User[];

    if (except_user_id) {
      users = await this.ormRepository.find({
        where: { id: Not(except_user_id) },
      });
    } else {
      users = await this.ormRepository.find();
    }

    return users;
  }

  public async findById(id: string): Promise<User | undefined> {
    const foundUserById = await this.ormRepository.findOne(id);

    return foundUserById;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const foundUserByEmail = await this.ormRepository.findOne({
      where: { email },
    });

    return foundUserByEmail;
  }

  public async create({
    name,
    email,
    password,
  }: ICreateUserDTO): Promise<User> {
    const createUser = this.ormRepository.create({ name, email, password });

    const user = this.ormRepository.save(createUser);

    return user;
  }

  public async save(user: User): Promise<User> {
    const updatedUser = await this.ormRepository.save(user);

    return updatedUser;
  }
}

export default UsersRepository;
