import { Repository, getRepository } from 'typeorm';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';

import UserToken from '@modules/users/infra/typeorm/entities/UserToken';

class UserTokensRepository implements IUserTokensRepository {
  private ormRepository: Repository<UserToken>;

  constructor() {
    this.ormRepository = getRepository(UserToken);
  }

  public async generate(user_id: string): Promise<UserToken> {
    const createUserToken = this.ormRepository.create({ user_id });

    const userToken = await this.ormRepository.save(createUserToken);

    return userToken;
  }

  public async findUserByToken(token: string): Promise<UserToken | undefined> {
    const userToken = await this.ormRepository.findOne({ where: { token } });

    return userToken;
  }
}

export default UserTokensRepository;
