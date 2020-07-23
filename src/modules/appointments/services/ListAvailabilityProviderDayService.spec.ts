// import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListAvailabilityProviderDayService from './ListAvailabilityProviderDayService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listAvailabilityProviderDayService: ListAvailabilityProviderDayService;

describe('ListAvailabilityProviderDay', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    listAvailabilityProviderDayService = new ListAvailabilityProviderDayService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the availability of the provider in day', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: '123',
      date: new Date(2020, 6, 22, 8, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: '123',
      date: new Date(2020, 6, 22, 10, 0, 0),
    });

    const availability = await listAvailabilityProviderDayService.execute({
      provider_id: '123',
      day: 22,
      month: 7,
      year: 2020,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: true },
        { hour: 10, available: false },
        { hour: 11, available: true },
      ]),
    );
  });
});
