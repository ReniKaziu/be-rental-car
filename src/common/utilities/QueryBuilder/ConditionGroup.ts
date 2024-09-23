import { Condition } from "./Condition";

export class ConditionGroup {
    
    type:string = "AND"; // Condition concatenation logic with AND or OR
    conditions:Condition[];

    constructor(conditions, or:boolean = false) {
        
        this.conditions = conditions;

        if(or){
            this.type = 'OR';
        }
    }

    public addCondition(condition:Condition){
        this.conditions.push(condition);
    }
}