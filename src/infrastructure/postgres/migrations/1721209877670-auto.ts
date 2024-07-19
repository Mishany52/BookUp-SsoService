import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1721209877670 implements MigrationInterface {
    name = 'Auto1721209877670'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" DROP CONSTRAINT "UQ_41704a57004fc60242d7996bd85"`);
        await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD "phone" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD CONSTRAINT "UQ_41704a57004fc60242d7996bd85" UNIQUE ("phone")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" DROP CONSTRAINT "UQ_41704a57004fc60242d7996bd85"`);
        await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD "phone" character varying(11) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD CONSTRAINT "UQ_41704a57004fc60242d7996bd85" UNIQUE ("phone")`);
    }

}
