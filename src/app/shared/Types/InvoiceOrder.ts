import { RealItem } from "./RealItem";

export type InvoiceOrder = {
    ID: number,
    ROW_NUMBER: number,
    CUSTOMER_NAME: string,
    DATE_TIME: Date,
    CUSTOMER: number,
    FROM_WAREHOUSE_NAME: string,
    PRICE_AFTER_DESCOUND: number,
    FROM_WAREHOUSE: number,
    DESCOUND_PERCENT: number,
    PAYMENT: number,
    PAYMENT_TYPE: number,
    NOTS: string,
    TYPE: number,
    ITEMS: Array<RealItem>
}
