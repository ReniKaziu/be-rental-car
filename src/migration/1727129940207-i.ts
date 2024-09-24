import {MigrationInterface, QueryRunner} from "typeorm";

export class i1727129940207 implements MigrationInterface {
    name = 'i1727129940207'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`example\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` bigint NOT NULL, \`updatedAt\` bigint NOT NULL, \`field\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`example\``);
    }

}
