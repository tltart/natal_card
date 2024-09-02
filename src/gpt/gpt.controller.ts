import { Controller } from '@nestjs/common';
import { GptService } from './gpt.service';
import { MessagePattern } from '@nestjs/microservices';
import {
  IGetPredictDto,
  IGetPersonAnalyzeDto,
  IGetCompatibilityDto,
  IGetProfessionDto,
  IGetFinanseDto,
  IGetHealthDto,
  IGetLifeCyclesDto,
} from './dto/messageDto';

@Controller()
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @MessagePattern('get-nat-card')
  handleMessageNatalCard(message: string) {
    return this.gptService.getNatalCard(message);
  }

  @MessagePattern('get-predict')
  handleMessagePredict(message: string) {
    const data = JSON.parse(message) as IGetPredictDto;
    return this.gptService.getPredict(data.natalCard, data.predictPeriod);
  }

  @MessagePattern('get-person-analyze')
  handleMessagePersonAnalyze(message: string) {
    const data = JSON.parse(message) as IGetPersonAnalyzeDto;
    return this.gptService.getPersonAnalyze(data.natalCard, data.reportType);
  }

  @MessagePattern('get-compatibility')
  handleMessageCompatibility(message: string) {
    const data = JSON.parse(message) as IGetCompatibilityDto;
    return this.gptService.getCompatibility(data.natalCard, data.reportType);
  }

  @MessagePattern('get-profession')
  handleMessageProfession(message: string) {
    const data = JSON.parse(message) as IGetProfessionDto;
    return this.gptService.getProfession(data.natalCard, data.reportType);
  }

  @MessagePattern('get-finanse')
  handleMessageFinanse(message: string) {
    const data = JSON.parse(message) as IGetFinanseDto;
    return this.gptService.getFinanse(data.natalCard, data.reportType);
  }

  @MessagePattern('get-health')
  handleMessageHealth(message: string) {
    const data = JSON.parse(message) as IGetHealthDto;
    return this.gptService.getHealth(data.natalCard, data.reportType);
  }

  @MessagePattern('get-life-cycles')
  handleMessageLifeCycles(message: string) {
    const data = JSON.parse(message) as IGetLifeCyclesDto;
    return this.gptService.getLifeCycles(data.natalCard, data.reportType);
  }

  @MessagePattern('get-person-evolution')
  handleMessagePersonEvolution(message: string) {
    const data = JSON.parse(message) as IGetLifeCyclesDto;
    return this.gptService.getPersonEvolution(data.natalCard, data.reportType);
  }
}
