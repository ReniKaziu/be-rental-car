import {MigrationInterface, QueryRunner} from "typeorm";

export class second1728858642760 implements MigrationInterface {
    name = 'second1728858642760'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`cars\` ADD \`locationId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`cars\` CHANGE \`relevantScore\` \`relevantScore\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`cars\` ADD CONSTRAINT \`FK_f9bfb1a08cd066359a652150aea\` FOREIGN KEY (\`locationId\`) REFERENCES \`locations\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`cars\` DROP FOREIGN KEY \`FK_f9bfb1a08cd066359a652150aea\``);
        await queryRunner.query(`ALTER TABLE \`cars\` CHANGE \`relevantScore\` \`relevantScore\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`cars\` DROP COLUMN \`locationId\``);
    }

}
