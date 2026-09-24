-- AlterTable
ALTER TABLE "boards" ADD COLUMN     "background" JSONB,
ADD COLUMN     "is_favorite" BOOLEAN NOT NULL DEFAULT false;
