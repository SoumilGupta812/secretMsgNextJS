import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";

export const apiLimiter = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  prefix: "api-rate-limit",
});

export const loginLimiter = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  prefix: "login-rate-limit",
});
