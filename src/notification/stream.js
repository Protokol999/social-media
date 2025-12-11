import { NotificationServiceClient } from './proto/notification_grpc_web_pb';
import { StreamRequest } from './proto/notification_pb';

const HOST = process.env.REACT_APP_GRPC_URL || 'http://192.168.1.5:8081';

const client = new NotificationServiceClient(HOST);

export function createNotificationStream({ onMessage, onError }) {
  const req = new StreamRequest();
  req.setUserId(localStorage.getItem('userId') || '');

  const metadata = {
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    'x-grpc-web': '1',
    'Content-Type': 'application/grpc-web+proto'
  };

  console.log('📡 Connecting to:', HOST);

  const stream = client.streamNotifications(req, metadata);

  stream.on('data', notif => {
    const msg = notif.toObject();
    console.log('🔥 [STREAM DATA]:', msg);
    onMessage(msg);
  });

  stream.on('error', err => {
    console.error('❌ STREAM ERROR:', err);
    onError?.(err);
  });

  stream.on('end', () => {
    console.log('ℹ️ STREAM CLOSED');
  });

  return () => stream.cancel();
}
