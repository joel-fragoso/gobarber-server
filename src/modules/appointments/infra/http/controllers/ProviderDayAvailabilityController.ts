import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListAvailabilityProviderDayService from '@modules/appointments/services/ListAvailabilityProviderDayService';

class ProviderDayAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;

    const { day, month, year } = request.query;

    const listAvailabilityProviderDayService = container.resolve(
      ListAvailabilityProviderDayService,
    );

    const availability = await listAvailabilityProviderDayService.execute({
      provider_id,
      day: Number(day),
      month: Number(month),
      year: Number(year),
    });

    return response.json(availability);
  }
}

export default ProviderDayAvailabilityController;
