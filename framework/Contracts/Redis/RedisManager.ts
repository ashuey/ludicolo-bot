import { RedisClient } from "redis";

export interface RedisManagerBase {}

type RedisManager = RedisManagerBase & RedisClient;

export default RedisManager;