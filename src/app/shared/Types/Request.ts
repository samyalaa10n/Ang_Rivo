import { RealItem } from "./RealItem";


export type RequestOrder = { ID: number, ROW_NUMBER: number, TOTAL?: number, TOTAL_AFTER_DEPOST?: number, CUSTOMER_NAME?: string, PAYMENT_NAME?: string, PAYMENT_TYPE: number, CUSTOMER: number, NOTS: string, DESCOUND_PERCENT: number, PRICE_AFTER_DESCOUND: number, DEPOST: number, SEND_DATE: Date, RESAVE_DATE: Date, ITEMS: Array<RealItem>, SELLER: string, CUSTOMER_BUY_NAME: string, PHONE: string, PLACE: number,PLACE_NAME?:string,ADDRESS:string,FILES:string,ISCANCELED?:Boolean,QR?:string,FROM_FACTORY:boolean,DILEVERY_CHARGE:number } 