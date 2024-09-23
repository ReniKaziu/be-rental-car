import {EntityRepository, SelectQueryBuilder} from "typeorm";
import { CommonRepository } from "../../common/repositories/common.repository";
import { RefreshToken } from "../entities/refresh.token.entity";
import { Join } from "../../common/utilities/QueryBuilder/Join";
import { FilterInfo } from "../../common/utilities/QueryBuilder/FilterInfo";
import { ConditionGroup } from "../../common/utilities/QueryBuilder/ConditionGroup";
import { Condition } from "../../common/utilities/QueryBuilder/Condition";
import { Functions } from "../../common/utilities/Functions";
import { User } from "../../user/entities/user.entity";
const UUID = require('uuid/v1');

@EntityRepository(RefreshToken)
export class RefreshTokenRepository extends CommonRepository<RefreshToken> {

    findRefreshToken (refreshToken:string): Promise<any> {

        const select = [
            'refresh_token.id',
            'user.id',
            'user.username',
            'user.role'
        ];

        const joins = [
            new Join('INNER', 'user', 'refresh_token.user_id=user.id', 'user')
        ];

        const filters = new FilterInfo(
            new ConditionGroup([
                new Condition('user.deleted = 0'),
                new Condition('refresh_token.refresh_token = :refreshToken', {refreshToken: refreshToken}),
                new Condition('refresh_token.ts_expiration > :nowDateTime', {nowDateTime: Functions.formatDate(Date.now())})
            ])
        );

        return this.getEntitySelect(select, joins, filters).getRawOne();
    }


    createRefreshToken(user: User, accessToken: string): Promise<RefreshToken> {

        const refreshToken = UUID();

        let refreshTokenRecord = new RefreshToken();
        refreshTokenRecord.refresh_token = refreshToken;
        refreshTokenRecord.access_token = accessToken;
        refreshTokenRecord.user = user;

        //Date after condifgured days
        const days = parseInt(process.env.REFRESH_TOKEN_LIFETIME_DAYS);
        const now = new Date();
        const res = now.setTime(now.getTime() + (days * 24 * 60 * 60 * 1000));
        refreshTokenRecord.ts_expiration = new Date(res);

        return this.save(refreshTokenRecord);
    }

    deleteByAccessToken(accessToken: string){
        return this.createQueryBuilder()
        .delete()
        .from(RefreshToken)
        .where("access_token = :accessToken", {accessToken: accessToken})
        .execute();
    }

    deleteByUserId(userId: number){
        return this.createQueryBuilder()
        .delete()
        .from(RefreshToken)
        .where("user_id = :userId", {userId: userId})
        .execute();
    }
}