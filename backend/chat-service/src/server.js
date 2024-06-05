import { redisClient } from './redis-client.js';
import { cassandraClient } from './cassandra-client.js';
import { wsServer } from './ws-server.js';
import { sendWsMessage } from './utils.js';
import chatService from './chat.service.js'

await cassandraClient.connect()
console.log('Cassandra client connected')

const redisSubscriber = redisClient.duplicate();
await redisSubscriber.connect();
console.log('Redis subscriber connected')

const redisPublisher = redisClient.duplicate();
await redisPublisher.connect();
console.log('Redis publisher connected')

const REDIS_NOTIFICATIONS_TOPIC_PREFIX = 'app:notifications'

wsServer.on('connection', async function connection(ws, req) {
  const urlSearchParams = new URLSearchParams(req.url.replace('/', ''))
  const userId = req.headers.userid || urlSearchParams.get('userId')

  console.log(`User ${userId} connected`)

  const userChannelIds = await chatService.getUserChannelIds(userId)
  const topicsToSubscribe = userChannelIds.map(channel => `${REDIS_NOTIFICATIONS_TOPIC_PREFIX}:${channel}`)

  await redisSubscriber.subscribe(topicsToSubscribe, (message, channel) => {
    console.log(`User ${userId} received a message on channel ${channel}`)
    sendWsMessage(ws, message)
  })

  ws.on('close', async () => {
    console.log(`User ${userId} disconnected`)
    await redisSubscriber.unsubscribe(topicsToSubscribe)
  })

  ws.on('error', async (error) => {
    console.log(`Error: ${error}`)
    await redisSubscriber.unsubscribe(topicsToSubscribe)
  })

  ws.on('message', async wsMessageBuffer => {
    const data = JSON.parse(wsMessageBuffer)

    if (data.type === 'load_messages') {
      const limit = 20
      const channelMessages = await chatService.getChannelMessages(data.payload.channelId, data.payload.token, limit)

      sendWsMessage(ws, JSON.stringify({
        type: "load_messages",
        payload: {
          hasMore: channelMessages.length === limit,
          channelId: data.payload.channelId,
          messages: channelMessages
        }
      }));

      return
    }

    if (data.type === 'load_channels') {
      const channels = await chatService.getUserChannels(userId)

      sendWsMessage(ws, JSON.stringify({
        type: "load_channels",
        payload: {
          channels
        }
      }));

      return
    }

    if (data.type === 'chat_message') {
      const message = await chatService.saveMessage({
        channelId: data.payload.channelId,
        authorId: userId,
        content: data.payload.content
      })
  
      const wsMessage = {
        type: 'chat_message',
        payload: message
      }
  
      const recipientTopic = `${REDIS_NOTIFICATIONS_TOPIC_PREFIX}:${message.channelId}`
      await redisPublisher.publish(recipientTopic, JSON.stringify(wsMessage))

      return
    }
  })
});