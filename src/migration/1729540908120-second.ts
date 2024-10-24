import {MigrationInterface, QueryRunner} from "typeorm";

export class second1729540908120 implements MigrationInterface {
    name = 'second1729540908120'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reservations\` CHANGE \`status\` \`status\` enum ('pending', 'approved', 'rejected', 'canceled') NOT NULL DEFAULT 'pending'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reservations\` CHANGE \`status\` \`status\` enum ('PENDING', 'APPROVED', 'REJECTED', 'CANCELED') NOT NULL DEFAULT 'PENDING'`);
    }

}
