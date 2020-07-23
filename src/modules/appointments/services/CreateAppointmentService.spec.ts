import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointmentService: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointmentService.execute({
      provider_id: 'uuid',
      user_id: 'uuid',
      date: new Date(),
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('uuid');
  });

  it('should not be able to create two appointments on the same time', async () => {
    const appointmentDate = new Date(2020, 6, 14, 10);

    await createAppointmentService.execute({
      provider_id: 'uuid',
      user_id: 'uuid',
      date: appointmentDate,
    });

    await expect(
      createAppointmentService.execute({
        provider_id: 'uuid',
        user_id: 'uuid',
        date: appointmentDate,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
