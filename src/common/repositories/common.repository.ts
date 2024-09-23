import { Repository, SelectQueryBuilder, Brackets, WhereExpression, ObjectLiteral } from "typeorm";
import { FilterInfo } from "../utilities/QueryBuilder/FilterInfo";
import { ConditionGroup } from "../utilities/QueryBuilder/ConditionGroup";
import { Condition } from "../utilities/QueryBuilder/Condition";
import { Sort } from "../utilities/QueryBuilder/Sort";
import { Join } from "../utilities/QueryBuilder/Join";
import { QueryStringProcessor } from "../utilities/QueryStringProcessor";

// tslint:disable-next-line:no-shadowed-variable
export abstract class CommonRepository<Entity> extends Repository<Entity> {

    protected searchColumns = [];

    public entitySelect(select: string[], joins: Join[], filters: FilterInfo, offset: number = 0, limit: number = 0, orderBy: string = null, orderDirection: "DESC" | "ASC" = null) {

        const qb = this.getEntitySelect(select, joins, filters, offset, limit, orderBy, orderDirection);
        return qb.getRawMany();
    }

    public getEntitySelect(select: string[], joins: Join[], filters: FilterInfo, offset: number = 0, limit: number = 0, orderBy = null, orderDirection = null): SelectQueryBuilder<Entity> {

        const qb = this.createQueryBuilder(this.metadata.tableName)
            .select(select);

        if (joins.length) {

            for (const join of joins) {

                if (join.type === "INNER") {

                    qb.innerJoin(join.table, join.alias, join.condition, join.params);

                } else {

                    qb.leftJoin(join.table, join.alias, join.condition, join.params);
                }
            }
        }

        if (filters) {
            this.buildFilters(qb, filters);
        }

        if (offset) {
            qb.offset(offset);
        }

        if (limit) {
            qb.limit(limit);
        }

        if (orderBy) {
            qb.orderBy(orderBy, orderDirection);
        }

        return qb;
    }

    // Handle soft delete
    public findById(id: string | number): Promise<Entity | undefined> {
        return this.findOne({
            where: {
                deleted: 0,
                id
            }
        });
    }

    public getSearchConditionGroup(tableAlias: string, searchString: string): ConditionGroup {

        const conditions = [];

        for (const searchColumn of this.searchColumns) {

            const paramName = `${searchColumn}Param`;
            const params = {};
            params[paramName] = `%${searchString}%`;

            conditions.push(new Condition(`${tableAlias}.${searchColumn} LIKE :${paramName}`, params));
        }

        return new ConditionGroup(conditions, true);
    }

    // Form select columns match if order by is equal to a column or alias
    public getSortObject(selectColumns: string[], queryStringProcessor: QueryStringProcessor): Sort | undefined {

        const orderBy = queryStringProcessor.getOrderBy();

        let sort: Sort;

        for (const selectColumn of selectColumns) {

            // if (this.isOrderableColumn(selectColumn)) {

            const columnParts = selectColumn.split(" ");
            const lastPart = columnParts[columnParts.length - 1];

            if (orderBy === lastPart) {

                const orderByDir = queryStringProcessor.getOrderDirection();
                sort = new Sort(orderBy, orderByDir);
                break;
            }
            // }
        }

        return sort;
    }

    public getById(id: number | string, relations?: string[]) {

        return this.findOne({
            where: {
                id,
                deleted: 0
            }
        });
    }

    public optionList(select: string[], isSoftDelete: boolean = true) {

        const queryConditions = [];

        if (isSoftDelete) {
            queryConditions.push(
                new Condition("deleted = 0")
            );
        }

        const filterInfo = new FilterInfo(
            new ConditionGroup(queryConditions)
        );

        return this.entitySelect(select, [], filterInfo);
    }

    public findEnrichedRecord(where: ObjectLiteral, relations: string[] = []) {

        where.deleted = 0;

        return this.findOne({
            where,
            relations
        });
    }

    public async executeCounterQuery(query, params = []) {

        const result = await this.manager.query(query, params);
        return (result.length) ? result[0] : null;
    }

    private buildFilters(qb: SelectQueryBuilder<Entity>, filters: FilterInfo): void {

        if (filters.conditionGroup) {
            this.buildConditionGroup(qb, filters.conditionGroup);
        }

        if (filters.groupBy) {
            qb.groupBy(filters.groupBy);
        }

        if (filters.sort) {
            this.buildSort(qb, filters.sort);
        }
    }

    private buildConditionGroup(qb: WhereExpression, conditionGroup: ConditionGroup): void {

        const type = conditionGroup.type;

        if (conditionGroup.conditions && conditionGroup.conditions.length) {

            for (let i = 0; i < conditionGroup.conditions.length; i++) {

                const condidition = conditionGroup.conditions[i];

                if (condidition.conditionGroup) {
                    if (type === "OR") {

                        qb.orWhere(new Brackets(sqb => {
                            this.buildConditionGroup(sqb, condidition.conditionGroup);
                        }));

                    } else {

                        qb.andWhere(new Brackets(sqb => {
                            this.buildConditionGroup(sqb, condidition.conditionGroup);
                        }));
                    }
                } else {
                    this.buildFilter(qb, condidition, i, type);
                }
            }
        }
    }

    private buildFilter(qb: WhereExpression, condition: Condition, index: number, type: string): void {

        if (index === 0) {
            qb.where(condition.string, condition.parameter);
        } else {

            if (type === "OR") {
                qb.orWhere(condition.string, condition.parameter);
            } else {
                qb.andWhere(condition.string, condition.parameter);
            }
        }
    }

    private buildSort(qb: SelectQueryBuilder<Entity>, sort: Sort[] | Sort): void {

        if (sort) {

            if (Array.isArray(sort)) {
                sort.map(singleSort => {
                    qb.addOrderBy(singleSort.name, singleSort.dir);
                });
            } else {
                qb.addOrderBy(sort.name, sort.dir);
            }
        }
    }

    // If column is users.id this will not be matched with orderBy = id, it should be users.id AS id
    private isOrderableColumn(selectColumn: string) {

        if (selectColumn.includes(".")) {
            return selectColumn.includes(" AS ");
        } else {
            return true;
        }
    }
}
