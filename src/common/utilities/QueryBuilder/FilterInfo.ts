import { ConditionGroup } from "./ConditionGroup";
import { Sort } from "./Sort";

export class FilterInfo {
    
    conditionGroup:ConditionGroup; // Where conditions
    groupBy?:string; //Group by
    sort: Array<Sort>|Sort; //Sort
   

    constructor(conditionGroup:ConditionGroup, sort?:Array<Sort>|Sort, groupBy?:string) {
        
        this.conditionGroup = conditionGroup;

        if(sort){
            this.sort = sort;
        }

        if(groupBy){
            this.groupBy = groupBy;
        }
    }
}