import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  avatarFileName: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository') private usersRepository: IUsersRepository,
    @inject('StorageProvider') private storageProvider: IStorageProvider,
  ) {}

  public async execute({ user_id, avatarFileName }: IRequest): Promise<User> {
    const foundUserById = await this.usersRepository.findById(user_id);

    if (!foundUserById) {
      throw new AppError('Only authenticated users can change avatar', 401);
    }

    if (foundUserById.avatar) {
      await this.storageProvider.deleteFile(foundUserById.avatar);
    }

    const newAvatar = await this.storageProvider.saveFile(avatarFileName);

    foundUserById.avatar = newAvatar;

    const updatedUser = await this.usersRepository.save(foundUserById);

    return updatedUser;
  }
}

export default UpdateUserAvatarService;
