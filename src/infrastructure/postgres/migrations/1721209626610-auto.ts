import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1721209626610 implements MigrationInterface {
    name = 'Auto1721209626610'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" DROP CONSTRAINT "UQ_132c9d5e51feaee0d92b484274a"`);
        await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD "password" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD CONSTRAINT "UQ_132c9d5e51feaee0d92b484274a" UNIQUE ("password")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" DROP CONSTRAINT "UQ_132c9d5e51feaee0d92b484274a"`);
        await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD "password" character varying(16) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD CONSTRAINT "UQ_132c9d5e51feaee0d92b484274a" UNIQUE ("password")`);
    }

}
