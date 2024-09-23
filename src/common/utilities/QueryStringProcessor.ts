
export class QueryStringProcessor {

    private limit = 10;
    private page: number = 1;
    private orderBy = "id";
    private orderDirection: "DESC" | "ASC" = "DESC";
    private orderByArray = [];
    private search = null;

    constructor(params) {

        this.limit = (params.limit && params.limit > 0) ? parseInt(params.limit) : this.limit;
        this.page = (params.page && params.page > 0) ? parseInt(params.page) : this.page;

        if (params.orderBy != null && params.orderDir != null) {
            this.orderBy = params.orderBy.trim();
            const orderDir = params.orderDir.trim();
            this.orderDirection = (orderDir === "ASC" || orderDir === "DESC") ? orderDir : "DESC";
        }
        this.orderByArray = this.generateOrderArray();

        this.search = (params.search) ? params.search : null;
    }

    public setLimit(limit: number) {
        this.limit = limit;
    }

    public getLimit() {
        return this.limit;
    }

    public getPage() {
        return this.page;
    }

    public getOffset() {
        return (this.page - 1) * this.limit;
    }

    public getOrderArray() {
        return this.orderByArray;
    }

    public getOrderBy(orderBy = null) {
        return this.orderBy;
    }

    public getOrderDirection() {
        return this.orderDirection;
    }

    public getSearch() {
        return this.search;
    }

    public getPaginationResponse(totalCount: number) {

        const maxPage = Math.ceil(totalCount / this.limit);

        return {
            current_page: this.page,
            limit: this.limit,
            max_page: maxPage,
            total_count: totalCount
        };
    }

    private generateOrderArray() {
        if (!this.orderBy) {
            return [];
        }
        const response = [];
        const fields = this.orderBy.split(",");
        const directions = this.orderDirection.split(",");
        for (let i = 0; i < fields.length; i++) {
            const order = {orderBy: fields[i], orderDirection: directions[i]};
            response.push(order);
        }
        return response;
    }
}
