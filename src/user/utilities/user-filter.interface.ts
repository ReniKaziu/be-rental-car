import { ParsedQs } from "qs";

export interface IUserFilter {
    name?: string | ParsedQs | string[] | ParsedQs[];
}
