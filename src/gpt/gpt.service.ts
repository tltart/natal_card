import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { promts } from './messages';

interface IMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

@Injectable()
export class GptService {
  constructor(private readonly configServise: ConfigService) {}

  private gptSend: axios.AxiosInstance;

  private readonly gptUrl = 'https://api.openai.com/v1/chat/completions';

  private readonly gptModel = 'gpt-4o';

  private readonly headersAuth = {
    Authorization: `Bearer ${this.configServise.get('GPT_TOKEN')}`,
  };

  async onModuleInit() {
    const proxyUrl = `http://${this.configServise.get('PROXY_HOST')}:${this.configServise.get('PROXY_PORT')}`;
    const proxyAgent = new HttpsProxyAgent(proxyUrl);

    this.gptSend = axios.create({ httpsAgent: proxyAgent });
    await this.gptInit();
  }

  async gptInit() {
    console.log('Init gpt service');
  }

  async gptRequest(messages: IMessage[]) {
    try {
      const response = await this.gptSend.post(
        this.gptUrl,
        {
          model: this.gptModel,
          messages,
        },
        {
          headers: this.headersAuth,
        },
      );
      return response.data.choices[0].message.content;
    } catch (error) {
      throw new Error(`Error response from gpt: ${error}`);
    }
  }

  async getNatalCard(userData: string) {
    const messages: IMessage[] = [
      {
        role: 'system',
        content: promts.type.createNatalCard.role.system.content,
      },
      {
        role: 'user',
        content: `${promts.type.createNatalCard.role.user.content} ${userData}`,
      },
    ];
    return this.gptRequest(messages);
  }

  async getPredict(natalCardText: string, predictPeriod: string) {
    const messages: IMessage[] = [
      {
        role: 'system',
        content: `${promts.type.createNatalCard.role.system.content} Текуцщее время: ${new Date().toISOString()}`,
      },
      {
        role: 'assistant',
        content: `${promts.type.default.role.assistant.content} ${natalCardText}`,
      },
      {
        role: 'user',
        content: `${promts.type.default.role.user.content} ${predictPeriod}`,
      },
    ];

    return this.gptRequest(messages);
  }

  async getPersonAnalyze(natalCardText: string, reportType: string) {
    const messages: IMessage[] = [
      {
        role: 'system',
        content: `${promts.type.createNatalCard.role.system.content} Текуцщее время: ${new Date().toISOString()}`,
      },
      {
        role: 'assistant',
        content: `${promts.type.default.role.assistant.content} ${natalCardText}`,
      },
      {
        role: 'user',
        content: `${promts.type.default.role.user.content} ${reportType}`,
      },
    ];

    return this.gptRequest(messages);
  }

  async getCompatibility(natalCardText: string, reportType: string) {
    const messages: IMessage[] = [
      {
        role: 'system',
        content: `${promts.type.createNatalCard.role.system.content} Текуцщее время: ${new Date().toISOString()}`,
      },
      {
        role: 'assistant',
        content: `${promts.type.default.role.assistant.content} ${natalCardText}`,
      },
      {
        role: 'user',
        content: `${promts.type.default.role.user.content} ${reportType}`,
      },
    ];

    return this.gptRequest(messages);
  }

  async getProfession(natalCardText: string, reportType: string) {
    const messages: IMessage[] = [
      {
        role: 'system',
        content: `${promts.type.createNatalCard.role.system.content} Текуцщее время: ${new Date().toISOString()}`,
      },
      {
        role: 'assistant',
        content: `${promts.type.default.role.assistant.content} ${natalCardText}`,
      },
      {
        role: 'user',
        content: `${promts.type.default.role.user.content} ${reportType}`,
      },
    ];

    return this.gptRequest(messages);
  }

  async getFinanse(natalCardText: string, reportType: string) {
    const messages: IMessage[] = [
      {
        role: 'system',
        content: `${promts.type.createNatalCard.role.system.content} Текуцщее время: ${new Date().toISOString()}`,
      },
      {
        role: 'assistant',
        content: `${promts.type.default.role.assistant.content} ${natalCardText}`,
      },
      {
        role: 'user',
        content: `${promts.type.default.role.user.content} ${reportType}`,
      },
    ];

    return this.gptRequest(messages);
  }

  async getHealth(natalCardText: string, reportType: string) {
    const messages: IMessage[] = [
      {
        role: 'system',
        content: `${promts.type.createNatalCard.role.system.content} Текуцщее время: ${new Date().toISOString()}`,
      },
      {
        role: 'assistant',
        content: `${promts.type.default.role.assistant.content} ${natalCardText}`,
      },
      {
        role: 'user',
        content: `${promts.type.default.role.user.content} ${reportType}`,
      },
    ];

    return this.gptRequest(messages);
  }

  async getLifeCycles(natalCardText: string, reportType: string) {
    const messages: IMessage[] = [
      {
        role: 'system',
        content: `${promts.type.createNatalCard.role.system.content} Текуцщее время: ${new Date().toISOString()}`,
      },
      {
        role: 'assistant',
        content: `${promts.type.default.role.assistant.content} ${natalCardText}`,
      },
      {
        role: 'user',
        content: `${promts.type.default.role.user.content} ${reportType}`,
      },
    ];

    return this.gptRequest(messages);
  }

  async getPersonEvolution(natalCardText: string, reportType: string) {
    const messages: IMessage[] = [
      {
        role: 'system',
        content: `${promts.type.createNatalCard.role.system.content} Текуцщее время: ${new Date().toISOString()}`,
      },
      {
        role: 'assistant',
        content: `${promts.type.default.role.assistant.content} ${natalCardText}`,
      },
      {
        role: 'user',
        content: `${promts.type.default.role.user.content} ${reportType}`,
      },
    ];

    return this.gptRequest(messages);
  }
}
