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
      date: new Date(2020, 6, 22, 13, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: '123',
      date: new Date(2020, 6, 22, 15, 0, 0),
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 6, 22, 11, 0, 0).getTime();
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
        { hour: 9, available: false },
        { hour: 10, available: false },
        { hour: 11, available: false },
        { hour: 12, available: true },
        { hour: 13, available: false },
        { hour: 14, available: true },
        { hour: 15, available: false },
        { hour: 16, available: true },
        { hour: 17, available: true },
      ]),
    );
  });
});
