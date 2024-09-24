import { Column, Entity } from "typeorm";
import { Common } from "../common/entities/common";

@Entity("example")
export class Example extends Common {
  @Column({})
  public field: string;
}
