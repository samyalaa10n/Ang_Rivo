import { RealItem } from "./RealItem";

export type InvoiceOrder = {
    ID: number,
    ROW_NUMBER: number,
    CUSTOMER_NAME: string,
    DATE_TIME: Date,
    CUSTOMER: number,
    WAREHOUSE_NAME: string,
    PRICE_AFTER_DESCOUND: number,
    WAREHOUSE: number,
    DESCOUND_PERCENT: number,
    PAYMENT: number,
    PAYMENT_TYPE: number,
    NOTS: string,
    TYPE: number,
    TOTAL?: number,
    TOTAL_AFTER_PAYMENT?: number,
    ITEMS: Array<RealItem>
    PAYMENT_NAME?:string,
    QRImage?:string,
}
