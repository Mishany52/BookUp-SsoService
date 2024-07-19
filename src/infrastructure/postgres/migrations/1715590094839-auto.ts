import { MigrationInterface, QueryRunner } from 'typeorm';

export class Auto1715590094839 implements MigrationInterface {
    name = 'Auto1715590094839';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" RENAME COLUMN "imgUlr" TO "imgUrl"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" RENAME COLUMN "imgUrl" TO "imgUlr"`);
    }
}
