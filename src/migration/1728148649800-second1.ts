import {MigrationInterface, QueryRunner} from "typeorm";

export class second11728148649800 implements MigrationInterface {
    name = 'second11728148649800'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`logs\` DROP COLUMN \`message\``);
        await queryRunner.query(`ALTER TABLE \`logs\` ADD \`message\` text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`logs\` DROP COLUMN \`message\``);
        await queryRunner.query(`ALTER TABLE \`logs\` ADD \`message\` varchar(10) NOT NULL`);
    }

}
