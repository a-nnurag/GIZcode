import 'dotenv/config';
import path from 'node:path';

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const config = {
  port: Number(process.env.PORT ?? 8787),
  sessionSecret: required('SESSION_SECRET'),
  allowedOrigins: required('ALLOWED_ORIGINS')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  dataDir: path.resolve(__dirname, '..', 'data'),
  tilesDir: path.resolve(__dirname, '..', 'tiles'),
  knowledgeDir: path.resolve(__dirname, '..', 'knowledge'),
  groqApiKey: required('GROQ_API_KEY'),
  chatModel: process.env.CHAT_MODEL ?? 'openai/gpt-oss-120b',
  upstashVectorUrl: required('UPSTASH_VECTOR_REST_URL'),
  upstashVectorToken: required('UPSTASH_VECTOR_REST_TOKEN'),
};
