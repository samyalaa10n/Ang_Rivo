import { RealItem } from "./RealItem";

export type OperationOrder = { ID: number, WAREHOUSE_ADDED_NAME?: string,WAREHOUSE_GET_NAME?:string, ROW_NUMBER: number, WAREHOUSE_1: number,WAREHOUSE_2:number, TYPE: number, NOTS: string, DATE_TIME: Date, ITEMS: Array<RealItem> } 
