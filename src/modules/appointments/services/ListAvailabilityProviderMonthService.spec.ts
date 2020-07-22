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
      provider_id: '123',
      date: new Date(2020, 5, 22, 8, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: '123',
      date: new Date(2020, 6, 22, 8, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: '123',
      date: new Date(2020, 6, 22, 10, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: '123',
      date: new Date(2020, 6, 23, 8, 0, 0),
    });

    const availability = await listAvailabilityProviderMonthService.execute({
      provider_id: '123',
      month: 7,
      year: 2020,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 21, available: true },
        { day: 22, available: false },
        { day: 23, available: false },
        { day: 24, available: true },
      ]),
    );
  });
});
