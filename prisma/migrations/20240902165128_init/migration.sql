-- CreateTable
CREATE TABLE "Chat" (
    "id" SERIAL NOT NULL,
    "chatId" INTEGER NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Target" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "birthDate" TEXT NOT NULL,
    "birthTime" TEXT NOT NULL,
    "birthPlace" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chatId" INTEGER NOT NULL,

    CONSTRAINT "Target_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NatalCards" (
    "id" SERIAL NOT NULL,
    "chatId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "targetId" INTEGER NOT NULL,

    CONSTRAINT "NatalCards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CountReports" (
    "id" SERIAL NOT NULL,
    "chatId" INTEGER NOT NULL,
    "countReportDay" INTEGER NOT NULL,
    "dayLimit" INTEGER NOT NULL,
    "payedLimit" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CountReports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NatalCards_targetId_key" ON "NatalCards"("targetId");

-- CreateIndex
CREATE UNIQUE INDEX "CountReports_chatId_key" ON "CountReports"("chatId");

-- AddForeignKey
ALTER TABLE "Target" ADD CONSTRAINT "Target_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NatalCards" ADD CONSTRAINT "NatalCards_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NatalCards" ADD CONSTRAINT "NatalCards_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "Target"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CountReports" ADD CONSTRAINT "CountReports_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
