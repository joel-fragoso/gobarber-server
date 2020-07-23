// import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListAvailabilityProviderMonthService from './ListAvailabilityProviderMonthService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listAvailabilityProviderMonthService: ListAvailabilityProviderMonthService;

describe('ListAvailabilityProviderMonth', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    listAvailabilityProviderMonthService = new ListAvailabilityProviderMonthService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the availability of the provider in the month', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: 'uuid',
      user_id: 'uuid',
      date: new Date(2020, 6, 22, 8, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'uuid',
      user_id: 'uuid',
      date: new Date(2020, 6, 22, 9, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'uuid',
      user_id: 'uuid',
      date: new Date(2020, 6, 22, 10, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'uuid',
      user_id: 'uuid',
      date: new Date(2020, 6, 22, 11, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'uuid',
      user_id: 'uuid',
      date: new Date(2020, 6, 22, 12, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'uuid',
      user_id: 'uuid',
      date: new Date(2020, 6, 22, 13, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'uuid',
      user_id: 'uuid',
      date: new Date(2020, 6, 22, 14, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'uuid',
      user_id: 'uuid',
      date: new Date(2020, 6, 22, 15, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'uuid',
      user_id: 'uuid',
      date: new Date(2020, 6, 22, 16, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'uuid',
      user_id: 'uuid',
      date: new Date(2020, 6, 22, 17, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'uuid',
      user_id: 'uuid',
      date: new Date(2020, 6, 23, 8, 0, 0),
    });

    const availability = await listAvailabilityProviderMonthService.execute({
      provider_id: 'uuid',
      month: 7,
      year: 2020,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 21, available: true },
        { day: 22, available: false },
        { day: 23, available: true },
        { day: 24, available: true },
      ]),
    );
  });
});
