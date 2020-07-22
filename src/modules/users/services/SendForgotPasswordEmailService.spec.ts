import AppError from '@shared/errors/AppError';

import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotPasswordEmailService: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    fakeMailProvider = new FakeMailProvider();

    fakeUserTokensRepository = new FakeUserTokensRepository();

    sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );
  });

  it('should be able to recovery password using the email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUsersRepository.create({
      name: 'Joel Fragoso',
      email: 'joelfragoso85@icloud.com',
      password: 'secret',
    });

    await sendForgotPasswordEmailService.execute({
      email: 'joelfragoso85@icloud.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to recovery a non-existing email', async () => {
    await expect(
      sendForgotPasswordEmailService.execute({
        email: 'joelfragoso85@icloud.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to recovery password using the email', async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUsersRepository.create({
      name: 'Joel Fragoso',
      email: 'joelfragoso85@icloud.com',
      password: 'secret',
    });

    await sendForgotPasswordEmailService.execute({
      email: 'joelfragoso85@icloud.com',
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
