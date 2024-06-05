import { Client } from 'cassandra-driver'

export const cassandraClient = new Client({
  contactPoints: ['localhost:9042', 'localhost:9043'],
  localDataCenter: 'datacenter1',
  keyspace: 'messages',
  credentials: {
    username: 'cassandra',
    password: 'cassandra'
  },
})