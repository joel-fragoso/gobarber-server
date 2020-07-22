import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeHashProvider: FakeHashProvider;
let fakeUsersRepository: FakeUsersRepository;
let updateProfileService: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    fakeHashProvider = new FakeHashProvider();

    updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the user profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'secret',
    });

    const updateUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Joel Fragoso',
      email: 'joelfragoso85@icloud.com',
    });

    expect(updateUser.name).toBe('Joel Fragoso');
    expect(updateUser.email).toBe('joelfragoso85@icloud.com');
  });

  it('should not be able to update the user profile if the passed email already exists', async () => {
    await fakeUsersRepository.create({
      name: 'Joel Fragoso',
      email: 'joelfragoso85@icloud.com',
      password: 'secret',
    });

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'secret',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Joel Fragoso',
        email: 'joelfragoso85@icloud.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the user password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'secret',
    });

    const updateUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Joel Fragoso',
      email: 'joelfragoso85@icloud.com',
      old_password: 'secret',
      password: 'secret2',
    });

    expect(updateUser.password).toBe('secret2');
  });

  it('should not be able to update the user password if does not passed a old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'secret',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Joel Fragoso',
        email: 'joelfragoso85@icloud.com',
        password: 'secret2',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the user password if the old password was incorrect', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'secret',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Joel Fragoso',
        email: 'joelfragoso85@icloud.com',
        old_password: 'incorrect-old-password',
        password: 'secret2',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
