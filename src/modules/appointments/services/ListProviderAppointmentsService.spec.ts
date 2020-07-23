// import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointmentsService: ListProviderAppointmentsService;

describe('ListProviderAppointments', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    listProviderAppointmentsService = new ListProviderAppointmentsService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the appointments on a specific day', async () => {
    const appointment1 = await fakeAppointmentsRepository.create({
      provider_id: 'uuid_provider',
      user_id: 'uuid_user',
      date: new Date(2020, 6, 23, 8, 0, 0),
    });

    const appointment2 = await fakeAppointmentsRepository.create({
      provider_id: 'uuid_provider',
      user_id: 'uuid_user',
      date: new Date(2020, 6, 23, 10, 0, 0),
    });

    const appointments = await listProviderAppointmentsService.execute({
      provider_id: 'uuid_provider',
      day: 23,
      month: 7,
      year: 2020,
    });

    expect(appointments).toEqual([appointment1, appointment2]);
  });
});
