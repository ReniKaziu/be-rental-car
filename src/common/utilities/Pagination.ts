
export class Pagination {
    
    private paging = false;
    private size = 10;
    private page = 0;
    private orderBy = "id";
    private orderDirection: "DESC" | "ASC" = "DESC";
    private orderByArray = [];

    constructor(params) {
        if (params != null) {
            this.paging = params.paging as boolean;
            this.size = params.size == null ? this.size : params.size;
            this.page = params.page == null ? this.page : params.page;

            if (params.orderBy != null && params.orderDirection != null) {
                this.orderBy = params.orderBy;
                this.orderDirection = params.orderDirection;
            }
            this.orderByArray = this.generateOrderArray();
        }
    }

    public hasPaging() {
        return this.paging;
    }

    public getSize() {
        return this.hasPaging() ? this.size : null;
    }

    public getPage() {
        return this.hasPaging() ? this.page : null;
    }

    public getOffset() {
        const offset = this.hasPaging() ? this.getSize() * (this.getPage()) : 0;
        return offset;
    }

    public getOrderArray() {
        return this.orderByArray;
    }

    public getOrderBy(orderBy = null) {
        this.orderBy == null ? orderBy : this.orderBy;
        return this.orderBy;
    }

    public getOrderDirection() {
        return this.orderDirection;
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
