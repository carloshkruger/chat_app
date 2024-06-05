#!/usr/bin/env bash

until printf "" 2>>/dev/null >>/dev/tcp/cassandra/9042; do 
    sleep 5;
    echo "Waiting for cassandra...";
done

echo "Creating keyspace"
cqlsh cassandra -u cassandra -p cassandra -e "CREATE KEYSPACE IF NOT EXISTS messages WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'};"


# echo "Deleting channels_table"
# cqlsh cassandra -u cassandra -p cassandra -e "DROP TABLE messages.channels;"

echo "Creating channels table"
cqlsh cassandra -u cassandra -p cassandra -e "CREATE TABLE IF NOT EXISTS messages.channels (id uuid, name text, \"createdAt\" timestamp, PRIMARY KEY (id));"

CHANNEL1_ID="d6f25600-0cf8-47a4-a2c2-dfbf3e414feb"
CHANNEL2_ID="2d64c7ae-8d30-44cd-ac90-f2e4989770c3"
USER1_ID="807c647c-d951-4f97-a03f-3bcbd45bd631"
USER2_ID="7a7658c8-32fd-4228-87fe-9c9a1c1e591a"

echo "Generating data for channels table"
cqlsh cassandra -u cassandra -p cassandra -e "INSERT INTO messages.channels (id, name, \"createdAt\") VALUES ($CHANNEL1_ID, 'general', toTimestamp(now()));"
cqlsh cassandra -u cassandra -p cassandra -e "INSERT INTO messages.channels (id, name, \"createdAt\") VALUES ($CHANNEL2_ID, 'random', toTimestamp(now()));"


# echo "Deleting channel_users table"
# cqlsh cassandra -u cassandra -p cassandra -e "DROP TABLE messages.channel_users;"

echo "Creating channel_users table"
cqlsh cassandra -u cassandra -p cassandra -e "CREATE TABLE IF NOT EXISTS messages.channel_users (\"channelId\" uuid, \"userId\" uuid, PRIMARY KEY (\"channelId\", \"userId\"));"

echo "Generating data for channel_users table"
cqlsh cassandra -u cassandra -p cassandra -e "INSERT INTO messages.channel_users (\"channelId\", \"userId\") VALUES ($CHANNEL1_ID, $USER1_ID);"
cqlsh cassandra -u cassandra -p cassandra -e "INSERT INTO messages.channel_users (\"channelId\", \"userId\") VALUES ($CHANNEL2_ID, $USER1_ID);"
cqlsh cassandra -u cassandra -p cassandra -e "INSERT INTO messages.channel_users (\"channelId\", \"userId\") VALUES ($CHANNEL1_ID, $USER2_ID);"


# echo "Deleting messages table"
# cqlsh cassandra -u cassandra -p cassandra -e "DROP TABLE messages.messages;"

echo "Creating messages table"
cqlsh cassandra -u cassandra -p cassandra -e "CREATE TABLE IF NOT EXISTS messages.messages (\"channelId\" UUID, id UUID, \"authorId\" UUID, content TEXT, \"createdAt\" TIMESTAMP, PRIMARY KEY (\"channelId\", id));"

echo "Generating data for messages table"
cqlsh cassandra -u cassandra -p cassandra -e "INSERT INTO messages.messages (\"channelId\", id, \"authorId\", content, \"createdAt\") VALUES ($CHANNEL1_ID, 018fe967-1355-7924-b70d-0e465ab448e3, $USER1_ID, 'test message', toTimestamp(now()));"