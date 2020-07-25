import AppError from '@shared/errors/AppError';

import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;
let createAppointmentService: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    fakeNotificationsRepository = new FakeNotificationsRepository();

    fakeCacheProvider = new FakeCacheProvider();

    createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 6, 23, 12).getTime();
    });

    const appointment = await createAppointmentService.execute({
      provider_id: 'uuid_provider',
      user_id: 'uuid_user',
      date: new Date(2020, 6, 23, 13),
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('uuid_provider');
  });

  it('should not be able to create two appointments on the same time', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 6, 23, 12).getTime();
    });

    const appointmentDate = new Date(2020, 6, 23, 13);

    await createAppointmentService.execute({
      provider_id: 'uuid_provider',
      user_id: 'uuid_user',
      date: appointmentDate,
    });

    await expect(
      createAppointmentService.execute({
        provider_id: 'uuid_provider',
        user_id: 'uuid_user',
        date: appointmentDate,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 7, 23, 11).getTime();
    });

    await expect(
      createAppointmentService.execute({
        provider_id: 'uuid_provider',
        user_id: 'uuid_user',
        date: new Date(2020, 7, 23, 10),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 7, 23, 11).getTime();
    });

    await expect(
      createAppointmentService.execute({
        provider_id: 'uuid',
        user_id: 'uuid',
        date: new Date(2020, 7, 23, 12),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment before 8am and after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 7, 23, 11).getTime();
    });

    await expect(
      createAppointmentService.execute({
        provider_id: 'uuid_provider',
        user_id: 'uuid_user',
        date: new Date(2020, 7, 23, 18),
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointmentService.execute({
        provider_id: 'uuid_provider',
        user_id: 'uuid_user',
        date: new Date(2020, 7, 24, 7),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
