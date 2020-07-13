import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import authConfig from '@config/auth';
import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository') private usersRepository: IUsersRepository,
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const foundUserByEmail = await this.usersRepository.findByEmail(email);

    if (!foundUserByEmail) {
      throw new AppError('Incorrect email/password combination', 401);
    }

    const passwordMatched = await compare(password, foundUserByEmail.password);

    if (!passwordMatched) {
      throw new AppError('Incorrect email/password combination', 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: foundUserByEmail.id,
      expiresIn,
    });

    return {
      user: foundUserByEmail,
      token,
    };
  }
}

export default AuthenticateUserService;
