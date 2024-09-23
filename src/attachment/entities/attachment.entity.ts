import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Common } from "../../common/entities/common";

@Entity("attachments")
export class Attachment extends Common {

    @PrimaryGeneratedColumn({
        type: "int",
        name: "id",
    })
    public id: number;

    @Column("varchar", {
        nullable: false,
        length: 256,
        name: "name",
    })
    public name: string;

    @Column("varchar", {
        nullable: false,
        length: 256,
        name: "original_name",
    })
    public originalName: string;

    @Column("varchar", {
        nullable: false,
        length: 128,
        name: "mime_type",
    })
    public mimeType: string;

    @Column("varchar", {
        nullable: false,
        length: 128,
        name: "extension",
    })
    public extension: string;

    @Column("int", {
        nullable: false,
        name: "size_in_bytes",
    })
    public sizeInBytes: number;

    @Column("mediumtext", {
        nullable: true,
        name: "path",
    })
    public path: string;

}