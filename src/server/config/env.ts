import { z } from "zod/v4";

const envSchema = z.object({
  WEEX_API_KEY: z.string().min(1),
  WEEX_SECRET_KEY: z.string().min(1),
  WEEX_PASSPHRASE: z.string().min(1),
});

const groqEnvSchema = z.object({
  GROQ_API_KEY: z.string().min(1),
});

export function getWeexConfig() {
  const parsed = envSchema.safeParse({
    WEEX_API_KEY: process.env.WEEX_API_KEY,
    WEEX_SECRET_KEY: process.env.WEEX_SECRET_KEY,
    WEEX_PASSPHRASE: process.env.WEEX_PASSPHRASE,
  });

  if (!parsed.success) {
    throw new Error("Missing WEEX API credentials in environment variables");
  }

  return {
    apiKey: parsed.data.WEEX_API_KEY,
    secretKey: parsed.data.WEEX_SECRET_KEY,
    passphrase: parsed.data.WEEX_PASSPHRASE,
  };
}

export function getGroqConfig(): { apiKey: string } | null {
  const parsed = groqEnvSchema.safeParse({
    GROQ_API_KEY: process.env.GROQ_API_KEY,
  });

  if (!parsed.success) {
    return null;
  }

  return { apiKey: parsed.data.GROQ_API_KEY };
}

export function isGroqConfigured(): boolean {
  return getGroqConfig() !== null;
}
