import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('UpdateUserAvatar', () => {
  it('should be able to update the user avatar', async () => {
    const fakeUsersRepository = new FakeUsersRepository();

    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const createdUser = await fakeUsersRepository.create({
      name: 'Joel Fragoso',
      email: 'joelfragoso85@icloud.com',
      password: 'secret',
    });

    const updatedAvatarUser = await updateUserAvatarService.execute({
      user_id: createdUser.id,
      avatarFileName: 'avatar.png',
    });

    expect(updatedAvatarUser.avatar).toEqual('avatar.png');
  });

  it('should not be able to avatar from non existing user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();

    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    expect(
      updateUserAvatarService.execute({
        user_id: 'non-user',
        avatarFileName: 'avatar.png',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to delete old user avatar when updating new one', async () => {
    const fakeUsersRepository = new FakeUsersRepository();

    const fakeStorageProvider = new FakeStorageProvider();

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const createdUser = await fakeUsersRepository.create({
      name: 'Joel Fragoso',
      email: 'joelfragoso85@icloud.com',
      password: 'secret',
    });

    await updateUserAvatarService.execute({
      user_id: createdUser.id,
      avatarFileName: 'avatar.png',
    });

    const updatedAvatarUser = await updateUserAvatarService.execute({
      user_id: createdUser.id,
      avatarFileName: 'avatar2.png',
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar.png');
    expect(updatedAvatarUser.avatar).toEqual('avatar2.png');
  });
});
