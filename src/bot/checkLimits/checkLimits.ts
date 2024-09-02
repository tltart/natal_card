import { ErrorsEnum } from 'src/errors/errorsEnum';
import { PrismaService } from 'src/prisma/prisma.service';

export const checkLimits = async ({
  prisma,
  chatIdDb,
}: {
  prisma: PrismaService;
  chatIdDb: number;
}) => {
  const limit = await prisma.findCountReportByChatId(chatIdDb);
  if (limit.payedLimit === 0 && limit.dayLimit - limit.countReportDay <= 0) {
    throw new Error(ErrorsEnum.LIMIT_REPORTS);
  }
};
