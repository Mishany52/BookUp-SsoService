import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1721727672580 implements MigrationInterface {
    name = 'Auto1721727672580'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" ADD "active" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "active"`);
    }

}
