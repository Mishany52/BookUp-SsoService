import { MigrationInterface, QueryRunner } from 'typeorm';

export class Auto1721122930050 implements MigrationInterface {
    name = 'Auto1721122930050';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TYPE "public"."accounts_role_enum" RENAME TO "accounts_role_enum_old"`,
        );
        await queryRunner.query(
            `CREATE TYPE "public"."accounts_role_enum" AS ENUM('owner', 'administrator', 'manager', 'employee', 'client')`,
        );
        await queryRunner.query(`ALTER TABLE "accounts" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(
            `ALTER TABLE "accounts" ALTER COLUMN "role" TYPE "public"."accounts_role_enum" USING "role"::"text"::"public"."accounts_role_enum"`,
        );
        await queryRunner.query(`ALTER TABLE "accounts" ALTER COLUMN "role" SET DEFAULT 'client'`);
        await queryRunner.query(`DROP TYPE "public"."accounts_role_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "public"."accounts_role_enum_old" AS ENUM('owner', 'administrator', 'manager', 'client')`,
        );
        await queryRunner.query(`ALTER TABLE "accounts" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(
            `ALTER TABLE "accounts" ALTER COLUMN "role" TYPE "public"."accounts_role_enum_old" USING "role"::"text"::"public"."accounts_role_enum_old"`,
        );
        await queryRunner.query(`ALTER TABLE "accounts" ALTER COLUMN "role" SET DEFAULT 'client'`);
        await queryRunner.query(`DROP TYPE "public"."accounts_role_enum"`);
        await queryRunner.query(
            `ALTER TYPE "public"."accounts_role_enum_old" RENAME TO "accounts_role_enum"`,
        );
    }
}
