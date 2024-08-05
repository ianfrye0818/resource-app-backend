import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { Injectable } from '@nestjs/common';
import { Models } from 'src/lib/types.';
import { env } from '../../env';

export interface AIModel {
  generateContent(prompts: string[]): Promise<string>;
}

@Injectable()
export class GoogleGeminiAiService implements AIModel {
  private model: GenerativeModel;

  constructor({ model = 'gemini-1.5-flash' }: { model?: string } = {}) {
    const genAi = new GoogleGenerativeAI(env.GOOGLE_API_KEY);
    this.model = genAi.getGenerativeModel({ model });
  }

  async generateContent(prompts: string[]): Promise<string> {
    const response = await this.model.generateContent(prompts);
    return response.response.text();
  }
}

@Injectable()
export class ClaudeAISonnetService implements AIModel {
  private model: Anthropic;

  constructor() {
    this.model = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
  }

  async generateContent(prompts: string[]): Promise<string> {
    const resp = await this.model.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompts[0] }],
    });

    return resp.content[0].type === 'text' ? resp.content[0].text : '';
  }
}

@Injectable()
export class OpenAI4oService implements AIModel {
  private model: OpenAI;
  private modelType: string;

  constructor({ model = 'gpt-4o-mini' }: { model?: string } = {}) {
    this.model = new OpenAI({ apiKey: env.OPENAI_API_KEY });
    this.modelType = model;
  }

  async generateContent(prompts: string[]): Promise<string> {
    const completion = await this.model.chat.completions.create({
      messages: [{ role: 'user', content: prompts[0] }],
      model: this.modelType,
    });

    return completion.choices[0].message.content || '';
  }
}

export function getAIModel(type: Models = Models.GEMINI): AIModel {
  switch (type) {
    case Models.GEMINI:
      return new GoogleGeminiAiService();
    case Models.CLAUDE:
      return new ClaudeAISonnetService();
    case Models.CHATGPT:
      return new OpenAI4oService();
    default:
      throw new Error('Invalid AI Model Type');
  }
}
