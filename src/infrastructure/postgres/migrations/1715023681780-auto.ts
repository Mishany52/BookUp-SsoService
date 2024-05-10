import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1715023681780 implements MigrationInterface {
    name = 'Auto1715023681780'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "refreshToken" character varying NOT NULL, "expiresAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_3001e89ada36263dabf1fb6210a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."accounts_role_enum" AS ENUM('owner', 'administrator', 'manager', 'client')`);
        await queryRunner.query(`CREATE TABLE "accounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(100) NOT NULL, "password" character varying NOT NULL, "phone" character varying(18) NOT NULL, "imgUrl" text, "role" "public"."accounts_role_enum" NOT NULL DEFAULT 'client', CONSTRAINT "UQ_ee66de6cdc53993296d1ceb8aa0" UNIQUE ("email"), CONSTRAINT "UQ_41704a57004fc60242d7996bd85" UNIQUE ("phone"), CONSTRAINT "PK_5a7a02c20412299d198e097a8fe" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "accounts"`);
        await queryRunner.query(`DROP TYPE "public"."accounts_role_enum"`);
        await queryRunner.query(`DROP TABLE "tokens"`);
    }

}
