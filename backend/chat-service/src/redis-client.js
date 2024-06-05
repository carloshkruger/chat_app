import { createClient } from 'redis'

const REDIS_SERVER = "redis://localhost:6379";

export const redisClient = createClient(REDIS_SERVER)
redisClient.on('error', err => console.log('Redis Client Error', err))