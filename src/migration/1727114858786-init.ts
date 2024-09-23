import {MigrationInterface, QueryRunner} from "typeorm";

export class init1727114858786 implements MigrationInterface {
    name = 'init1727114858786'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`attachments\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` bigint NOT NULL, \`updatedAt\` bigint NOT NULL, \`name\` varchar(256) NOT NULL, \`original_name\` varchar(256) NOT NULL, \`mime_type\` varchar(128) NOT NULL, \`extension\` varchar(128) NOT NULL, \`size_in_bytes\` int NOT NULL, \`path\` mediumtext NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` bigint NOT NULL, \`updatedAt\` bigint NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`refresh_token\` (\`id\` int NOT NULL AUTO_INCREMENT, \`access_token\` varchar(256) NOT NULL, \`refresh_token\` varchar(256) NOT NULL, \`ts_expiration\` timestamp NOT NULL, \`user_id\` int NULL, UNIQUE INDEX \`IDX_07ec1391b1de6e40fb0bfb07fa\` (\`refresh_token\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`refresh_token\` ADD CONSTRAINT \`FK_6bbe63d2fe75e7f0ba1710351d4\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`refresh_token\` DROP FOREIGN KEY \`FK_6bbe63d2fe75e7f0ba1710351d4\``);
        await queryRunner.query(`DROP INDEX \`IDX_07ec1391b1de6e40fb0bfb07fa\` ON \`refresh_token\``);
        await queryRunner.query(`DROP TABLE \`refresh_token\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`attachments\``);
    }

}
