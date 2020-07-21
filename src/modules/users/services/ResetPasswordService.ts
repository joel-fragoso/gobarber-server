import { injectable, inject } from 'tsyringe';
import { isAfter, addHours } from 'date-fns';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  token: string;
  password: string;
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UsersRepository') private usersRepository: IUsersRepository,
    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
    @inject('HashProvider') private hashProvider: IHashProvider,
  ) {}

  public async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.userTokensRepository.findUserByToken(token);

    if (!userToken) {
      throw new AppError('User token does not exists');
    }

    const findUserById = await this.usersRepository.findById(userToken.user_id);

    if (!findUserById) {
      throw new AppError('User does not exists');
    }

    const userTokenCreatedAt = userToken.created_at;

    const compareDate = addHours(userTokenCreatedAt, 2);

    if (isAfter(Date.now(), compareDate)) {
      throw new AppError('Token expired');
    }

    findUserById.password = await this.hashProvider.generateHash(password);

    await this.usersRepository.save(findUserById);
  }
}

export default ResetPasswordService;
