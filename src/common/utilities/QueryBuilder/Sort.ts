export class Sort {
    
    name:string; // sort column
    dir: "ASC" | "DESC" = "ASC"; //sort direction
   

    constructor(name:string, dir?: "ASC" | "DESC") {
        
        this.name = name;
        this.dir = dir;
    }
}