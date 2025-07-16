import { RealItem } from "./RealItem";

export type OperationOrder = { ID: number, WAREHOUSE_ADDED_NAME?: string,WAREHOUSE_GET_NAME?:string, ROW_NUMBER: number, WAREHOUSE_ADDED_ID: number,WAREHOUSE_GET_ID:number, TYPE: number, NOTS: string, DATE_TIME: Date, ITEMS: Array<RealItem> } 
