import {MigrationInterface, QueryRunner} from "typeorm";

export class isShuttleReservation1729720866304 implements MigrationInterface {
    name = 'isShuttleReservation1729720866304'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reservations\` ADD \`isShuttle\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reservations\` DROP COLUMN \`isShuttle\``);
    }

}
