import { randomUUID } from 'node:crypto';
import { setTimeout as sleep } from 'node:timers/promises'
import { WebSocket } from 'ws';
import { cassandraClient } from './src/cassandra-client.js';

function getIntegerInRange(min, max) {  
  return Math.floor(
    Math.random() * (max - min) + min
  )
}

const NUMBER_OF_WS_CLIENTS = 4_000
const NUMBER_OF_MESSAGES_SENT_PER_WS_CLIENT = 10

// This channelId is created when the cassandra docker container is created
const channelId = 'd6f25600-0cf8-47a4-a2c2-dfbf3e414feb'

for (let i = 1; i <= NUMBER_OF_WS_CLIENTS; i++) {
  const userId = randomUUID()
  await cassandraClient.execute('INSERT INTO channel_users (\"channelId\", \"userId\") VALUES (?, ?)', [channelId, userId])

  const wsClient = new WebSocket('ws://localhost:300'+getIntegerInRange(0,2), 'ws', {
    headers: {
      userId
    }
  })

  wsClient.on('open', async () => {
    for (let j = 0; j < NUMBER_OF_MESSAGES_SENT_PER_WS_CLIENT; j++) {
      // With 10k users sending messages at the same time, Cassandra will not be able to handle
      // this quantity of requests (it is possible to add more nodes to the cluster) thats why we sleep for 1 sec
      await sleep(1000)
      wsClient.send(JSON.stringify({
        type: "chat_message",
        payload: {
          channelId,
          content: `test message from user ${userId}`
        }
      }))
    }
  })
}