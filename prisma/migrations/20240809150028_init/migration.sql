-- CreateEnum
CREATE TYPE "ChatPadRole" AS ENUM ('SYSTEM', 'ASSISTANT', 'USER');

-- CreateTable
CREATE TABLE "ChatpPadChats" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "totalTokens" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ChatpPadChats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatPadMessage" (
    "id" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "role" "ChatPadRole" NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatPadMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatPadPrompt" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatPadPrompt_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ChatpPadChats" ADD CONSTRAINT "ChatpPadChats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatPadMessage" ADD CONSTRAINT "ChatPadMessage_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "ChatpPadChats"("id") ON DELETE CASCADE ON UPDATE CASCADE;
