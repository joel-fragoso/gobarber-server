import { ObjectId } from 'mongodb';

import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import Notification from '@modules/notifications/infra/typeorm/schemas/Notification';
import INotificationsRepository from '../INotificationsRepository';

class FakeNotificationsRepository implements INotificationsRepository {
  private notifications: Notification[] = [];

  public async create({
    content,
    recipient_id,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = new Notification();

    const createNotification = Object.assign(notification, {
      id: new ObjectId(),
      content,
      recipient_id,
    });

    this.notifications.push(createNotification);

    return createNotification;
  }
}

export default FakeNotificationsRepository;
