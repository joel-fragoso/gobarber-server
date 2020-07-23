import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListAvailabilityProviderMonthService from '@modules/appointments/services/ListAvailabilityProviderMonthService';

class ProviderMonthAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;

    const { month, year } = request.body;

    const listAvailabilityProviderMonthService = container.resolve(
      ListAvailabilityProviderMonthService,
    );

    const availability = await listAvailabilityProviderMonthService.execute({
      provider_id,
      month,
      year,
    });

    return response.json(availability);
  }
}

export default ProviderMonthAvailabilityController;
