import fs from 'fs';
import path from 'path';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import updateConfig from '@config/upload';
import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  avatarFileName: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository') private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id, avatarFileName }: IRequest): Promise<User> {
    const foundUserById = await this.usersRepository.findById(user_id);

    if (!foundUserById) {
      throw new AppError('Only authenticated users can change avatar', 401);
    }

    if (foundUserById.avatar) {
      const userAvatarFilePath = path.join(
        updateConfig.directory,
        foundUserById.avatar,
      );

      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    foundUserById.avatar = avatarFileName;

    const updatedUser = await this.usersRepository.save(foundUserById);

    return updatedUser;
  }
}

export default UpdateUserAvatarService;
