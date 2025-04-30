import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ToasterComponent } from "../components/Toaster/Toaster.component";
import _ from 'lodash';
import { Router } from "@angular/router";
import { DatePipe } from "@angular/common";
import { LoadingComponent } from "../components/Loading/Loading.component";

@Injectable({
  providedIn: 'root'
})
export class Tools {
  tempData:any=null
  baseUrl: string = "https://localhost:44327/api/"
  Toaster!: ToasterComponent
  Loading!: LoadingComponent
  _dateFormat!: DatePipe;
  _LoginName:string=""
  constructor(public _httpClient: HttpClient, public _router: Router) {
    console.log(this.EditData(new Date("12/1/2024")).getFullYear())
  }
  waitExecuteFunction(delay: number, func: any) {
    let timer = setTimeout(() => {
      func();
      clearTimeout(timer);
    }, delay)
  }
  cloneObject(object: any): any {
    return _.cloneDeep(object)
  }
  public async getAsync<T>(url: string): Promise<T | undefined> {
    try {
      this.Loading.startLoading();
      let response = await this._httpClient.get<T>(this.baseUrl + url).toPromise();
      this.Loading.stopLoading();
      return response
    }
    catch (ex: any) {
      this.Loading.stopLoading();
      //   this.Toaster?.showErrorAlert(ex.error.title, ex.error.detail)
      return undefined;
    }
  }
  public async postAsync<T>(url: string, data: any): Promise<T | undefined> {
    try {
      this.Loading.startLoading();
      let response = await this._httpClient.post<T>(this.baseUrl + url, data).toPromise();
      this.Loading.stopLoading();
      return response
    }
    catch (ex: any) {
      this.Loading.stopLoading();
      //   this.Toaster?.showErrorAlert(ex.error.title, ex.error.detail)
      return undefined;
    }
  }
  public async putAsync<T>(url: string, data: any,filterHeader:string=""): Promise<T | undefined> {
    try {
      this.Loading.startLoading();
      let response = await this._httpClient.put<T>(this.baseUrl + url, data,{headers:{"filter":filterHeader}}).toPromise();
      this.Loading.stopLoading();
      return response
    }
    catch (ex: any) {
      this.Loading.stopLoading();
      //   this.Toaster?.showErrorAlert(ex.error.title, ex.error.detail)
      return undefined;
    }
  }
  public async deleteAsync<T>(url: string, data: any = null): Promise<T | undefined> {
    try {
      this.Loading.startLoading();
      let response = await this._httpClient.delete<T>(this.baseUrl + url, { body: data }).toPromise();
      this.Loading.stopLoading();
      return response
    }
    catch (ex: any) {
      this.Loading.stopLoading();
      //   this.Toaster?.showErrorAlert(ex.error.title, ex.error.detail)
      return undefined;
    }
  }
  EditData(dateTime: Date): Date {
    if (dateTime instanceof Date) return new Date(dateTime.toLocaleDateString("en") + ' GMT')
    else if (typeof dateTime == "string") return new Date(dateTime + ' GMT')
    return new Date()
  }
  EditFormateData(dateTime: any, format: string) {
    if (dateTime != null && dateTime != "") {
      return this._dateFormat.transform(dateTime, format)
    }
    return dateTime;
  }
  GetNumberOfMonth(): number {
    return this.EditData(new Date()).getMonth() + 1;
  }
  GetNumberOfYear(): number {
    return this.EditData(new Date()).getFullYear();
  }
  IsEqual(object1: any, object2: any): boolean {
    if (object1 == undefined || object2 == undefined) {
      return true
    }
    let words1 = JSON.stringify(object1).split("").sort()
    let words2 = JSON.stringify(object2).split("").sort()
    for (let index = 0; index < words1.length; index++) {
      const word1 = words1[index];
      const word2 = words2[index];
      if (word1 != word2) {
        return false
      }
    }
    return true
  }
}
