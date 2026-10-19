-- AlterTable
ALTER TABLE "avisos" ADD COLUMN "overdue_alert_message_id" TEXT,
ADD COLUMN "overdue_alert_sent_at" TIMESTAMP(3);
