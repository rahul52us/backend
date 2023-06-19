import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as serviceAccount from './firebase_service_file.json';
import { PrismaService } from 'src/services/prisma.service';

const serviceAccountObject = serviceAccount as admin.ServiceAccount;
admin.initializeApp({ credential: admin.credential.cert(serviceAccountObject) });
const messaging = admin.messaging();

@Injectable()
export class NotificationService {
  constructor(private readonly prismaService: PrismaService) {}

  async saveNotificationToken(data: any) {
    const registrationTokens = [data.token]; // Replace with your device registration tokens

    const message: admin.messaging.MessagingPayload = {
      notification: {
        title: 'New Message',
        body: 'You have a new message',
      },
    };

    messaging
      .sendToDevice(registrationTokens, message)
      .then((response) => {
        console.log('Push notification sent successfully:', response);
      })
      .catch((error) => {
        console.error('Error sending push notification:', error);
      });
  }
}
