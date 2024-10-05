import {MigrationInterface, QueryRunner} from "typeorm";

export class init1728157470482 implements MigrationInterface {
    name = 'init1728157470482'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`logs\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` bigint NOT NULL, \`updatedAt\` bigint NOT NULL, \`message\` text NOT NULL, \`level\` enum ('error', 'info') NULL, \`userId\` int NULL, \`ipAddress\` varchar(45) NULL, \`stackTrace\` text NULL, \`source\` varchar(255) NULL, \`additionalInfo\` text NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`number\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`birthday\` bigint NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`phone\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`displayName\` \`displayName\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`email\` \`email\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`confirmationCode\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`confirmationCode\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`role\` \`role\` enum ('client', 'owner') NOT NULL DEFAULT 'client'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`licenseNumber\` \`licenseNumber\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`licenseNumber\` \`licenseNumber\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`role\` \`role\` enum ('client', 'owner') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`confirmationCode\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`confirmationCode\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`email\` \`email\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`displayName\` \`displayName\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`phone\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`birthday\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`number\` varchar(255) NOT NULL`);
        await queryRunner.query(`DROP TABLE \`logs\``);
    }

}
