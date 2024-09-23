import { ConditionGroup } from "./ConditionGroup";

export class Condition {
    
    string:string; // where conidtion ex: user.name = :username
    parameter?: object; //parameter value ex: {username: 'TestUser'}, is optional you may not add if you do not have a paramter
    conditionGroup?:ConditionGroup; //Represents a subgrup of conidtions to achieve where nestrng
   

    constructor(conditionString:string, parameter?:object)
    constructor(conditionGroup:ConditionGroup)
    constructor(conditionGroupOrString:ConditionGroup|string, parameter?:object) {
        
        if(typeof conditionGroupOrString == 'string'){
            this.string = conditionGroupOrString;
            if(parameter){
                this.parameter = parameter;
            }
        } else {
            this.conditionGroup = conditionGroupOrString;
        }
    }
}