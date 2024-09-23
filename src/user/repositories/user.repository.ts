import { EntityRepository } from "typeorm";
import { User } from "../entities/user.entity";
import { CommonRepository } from "../../common/repositories/common.repository";
import { QueryStringProcessor } from "../../common/utilities/QueryStringProcessor";
import { IUserFilter } from "../utilities/user-filter.interface";
import { FilterInfo } from "../../common/utilities/QueryBuilder/FilterInfo";
import { ConditionGroup } from "../../common/utilities/QueryBuilder/ConditionGroup";
import { Condition } from "../../common/utilities/QueryBuilder/Condition";
import { Helper } from "../../common/utilities/Helper";

@EntityRepository(User)
export class UserRepository extends CommonRepository<User> {
  public list = async (
    queryStringProcessor: QueryStringProcessor,
    filter: IUserFilter
  ) => {
    const select = [
      "id",
      "name",
      "surname",
      "email",
      "role",
      "profile_picture",
    ];

    const joins = [];

    const queryConditions = [new Condition("users.deleted = 0")];

    if (queryStringProcessor.getSearch()) {
      const conditionGroup = this.getSearchConditionGroup(
        "users",
        queryStringProcessor.getSearch()
      );

      queryConditions.push(new Condition(conditionGroup));
    }

    const filterInfo = new FilterInfo(new ConditionGroup(queryConditions));

    const countSelect = ["COUNT(users.id) AS total"];
    const { total } = await this.getEntitySelect(
      countSelect,
      joins,
      filterInfo
    ).getRawOne();

    const paginationResult = queryStringProcessor.getPaginationResponse(
      parseInt(total)
    );

    const sort = this.getSortObject(select, queryStringProcessor);

    if (Helper.isDefined(sort)) {
      filterInfo.sort = sort;
    }

    const results = await this.entitySelect(
      select,
      joins,
      filterInfo,
      queryStringProcessor.getOffset(),
      queryStringProcessor.getLimit()
    );

    return {
      pagination: paginationResult,
      page: results,
    };
  };

  public deleteById(id: number) {
    return (
      this.createQueryBuilder()
        .update(User)
        // .set({ deleted: true })
        .where("id = :id", { id })
        .execute()
    );
  }
}
