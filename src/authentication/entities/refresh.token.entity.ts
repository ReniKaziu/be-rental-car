import {Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Index} from "typeorm";
import { User } from "../../user/entities/user.entity";

@Entity("refresh_token")
export class RefreshToken {

    @PrimaryGeneratedColumn({
        type: "int",
        name: "id",
        })
    public id: number;

    @Column("varchar", {
        nullable: false,
        length: 256,
        name: "access_token",
        })
    public access_token: string;

    @Index({ unique: true })
    @Column("varchar", {
        nullable: false,
        length: 256,
        name: "refresh_token"
        })
    public refresh_token: string;

    @Column("timestamp", {
        nullable: false,
        name: "ts_expiration",
        })
    public ts_expiration: Date;

    @ManyToOne(type => User)
    @JoinColumn({name : 'user_id'})
    public user: User;
}