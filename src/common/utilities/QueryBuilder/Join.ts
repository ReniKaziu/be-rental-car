import { ObjectLiteral } from "typeorm";

export class Join {
    
    type:"INNER"|"LEFT";
    table: string; 
    alias: string; //Table alias, be default will be the same with table name
    condition: string; //Join conidtion ex: user.role_id=role.id
    params: ObjectLiteral

    constructor(type: "INNER"|"LEFT", table:string, condition:string, alias:string = null, params?: ObjectLiteral) {
        
        this.type = type;
        this.table = table;
        this.alias = table;
        this.condition = condition;  
        
        if(alias){
            this.alias = alias;
        }
        
        if(params){
            this.params = params;
        }
    }
}