import { uuidv7 } from 'uuidv7'
import { cassandraClient } from "./cassandra-client.js"

const chatService = {
  saveMessage: async ({ channelId, authorId, content }) => {
    const message = {
      id: uuidv7(),
      channelId,
      authorId,
      content,
      createdAt: new Date()
    }

    await cassandraClient.execute(
      'INSERT INTO messages (id, "channelId", "authorId", content, "createdAt") VALUES (?, ?, ?, ?, ?)',
      [message.id, message.channelId, message.authorId, message.content, message.createdAt],
      {
        prepare: true,
      }
    )

    return message
  },

  getUserChannelIds: async (userId) => {
    const userChannels = await cassandraClient.execute(
      'SELECT \"channelId\" FROM channel_users WHERE \"userId\" = ? ALLOW FILTERING',
      [userId],
      {
        prepare: true
      }
    )
  
    return userChannels.rows.map(channel => channel.channelId)
  },

  getChannelMessages: async (channelId, token, limit) => {
    let variables = [channelId, limit]
    let statement = 'SELECT * FROM messages WHERE \"channelId\" = ? ORDER BY id DESC LIMIT ?'

    if (token) {
      variables = [channelId, token, limit]
      statement = 'SELECT * FROM messages WHERE \"channelId\" = ? AND id < ? ORDER BY id DESC LIMIT ?'
    }

    const response = await cassandraClient.execute(
      statement,
      variables,
      {
        prepare: true
      }
    )

    return response.rows.reverse()
  },

  getUserChannels: async (userId) => {
    const channelIds = await chatService.getUserChannelIds(userId)
    const responseChannels = await cassandraClient.execute(
      `SELECT * 
         FROM channels
        WHERE id IN (${channelIds.join(',')})`,
    )

    const lastChannelMessages = await Promise.all(responseChannels.rows.map(row => cassandraClient.execute(
      `SELECT *
         FROM messages
        WHERE \"channelId\" = ?
     ORDER BY id DESC
        LIMIT 1`,
      [row.id.toString()],
      {
        prepare: true,
      }
    )))

    const channels = responseChannels.rows.map(row => {
      const lastMessage = lastChannelMessages.find(message => message.rows[0]?.channelId.toString() === row.id.toString())?.rows?.[0]

      return {
        id: row.id,
        name: row.name,
        lastMessage: lastMessage ? {
          content: lastMessage.content,
          createdAt: lastMessage.createdAt,
        } : undefined
      }
    }).sort((a, b) => {
      if (a.lastMessage && b.lastMessage) {
        return b.lastMessage.createdAt - a.lastMessage.createdAt
      }

      return 1
    })

    return channels
  }
}

export default chatService