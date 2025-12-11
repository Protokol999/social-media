import { ChatServiceClient } from './proto/chat_grpc_web_pb';
import { SubscribeRequest } from './proto/chat_pb';

const HOST =
  process.env.REACT_APP_GRPC_URL || 'https://89075c70faee.ngrok-free.app';

const client = new ChatServiceClient(HOST, null, null);

export function createChatStream(chatId, { onMessage, onError }) {
  const req = new SubscribeRequest();
  req.setChatIdsList([String(chatId)]);

  const stream = client.subscribeMessages(req, {});

  stream.on('data', msg => {
    onMessage({
      id: msg.getId(),
      chatId: msg.getChatId(),
      senderId: msg.getSenderId(),
      text: msg.getContent(),
      createdAt: msg.getCreatedAt(),
      read: msg.getRead()
    });
  });

  stream.on('error', err => {
    console.error('❌ Chat stream error:', err);
    onError?.(err);
  });

  stream.on('end', () => {
    console.log('🔌 Chat stream ended');
  });

  return () => stream.cancel();
}
