import { Injectable } from '@angular/core';

import { LoadingComponent } from '../components/Loading/Loading.component';
import { ToasterComponent } from "../components/Toaster/Toaster.component";
import _ from 'lodash';
import { Router } from "@angular/router";
import * as signalR from '@microsoft/signalr';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class Network {
  public hubConnection: signalR.HubConnection | undefined;
  // baseUrl: string = "https://aspnetclusters-200150-0.cloudclusters.net"
  //baseUrl: string = "https://rivo.it.com:262"s
  baseUrl: string = "https://localhost:44327"
 //baseUrl: string = "https://rivo.it.com:444"
  baseUrlApi: string = `${this.baseUrl}/api/`
  constructor(public _httpClient: HttpClient, public _router: Router) { }
  Loading!: LoadingComponent
  _LoginName: string = ""
  Toaster!: ToasterComponent
  // Start the SignalR connection
  public startConnection(UserData: string = ""): void {
    this.hubConnection = new signalR.HubConnectionBuilder().withUrl(`${this.baseUrl}/Connect?UserData=${UserData}`, {
      withCredentials: true // لتأكيد إرسال الـ cookies إذا كان يستخدم
    }).build();
    this.hubConnection.start()
      .then(() => {
        console.log('Connection Established')
      })
      .catch(err => {
        this.Loading.stopLoading();
        console.log(err)
      });
  }
  // Send a message
  public sendMessage(mestod: string, user: string, message: string): void {
    if (this.hubConnection) {
      this.hubConnection.invoke(mestod, user, message)
        .catch(err => console.error(err));
    }
  }

  // Add a listener for receiving messages
  public addMessageListener(on: string, callback: (user: string, message: string) => void): void {
    if (this.hubConnection) {
      this.hubConnection.on(on, callback);
    }
  }
  public async getAsync<T>(url: string): Promise<T | undefined> {
    try {
      this.Loading.startLoading();
      let response = await this._httpClient.get<T>(this.baseUrlApi + url).toPromise() as any;
      this.Loading.stopLoading();
      if (response != null) {
        if (response.SUCCESS == true) {
          response = response.DATA;
        }
        else {
          this.Loading.stopLoading();
          this.Toaster.showError(response.MESSAGE)
          return [] as any;
        }
      }
      return response
    }
    catch (ex: any) {
      console.log(ex)
      this.Loading.stopLoading();
      //   this.Toaster?.showErrorAlert(ex.error.title, ex.error.detail)
      return undefined;
    }
  }
  public async postAsync<T>(url: string, data: any): Promise<T | undefined> {
    try {
      this.Loading.startLoading();
      let response = await this._httpClient.post<T>(this.baseUrlApi + url, data).toPromise() as any;
      this.Loading.stopLoading();
      if (response.SUCCESS == true) {
        response = response.DATA;
      }
      else {
        this.Toaster.showError(response.MESSAGE)
      }
      return response
    }
    catch (ex: any) {
      console.log(ex)
      this.Loading.stopLoading();
      //   this.Toaster?.showErrorAlert(ex.error.title, ex.error.detail)
      return undefined;
    }
  }
  public async putAsync<T>(url: string, data: any, filterHeader: string = "", headers: any = null): Promise<T | undefined> {
    try {
      this.Loading.startLoading();
      let response = await this._httpClient.put<T>(this.baseUrlApi + url, data, { headers: headers == null ? { "filter": filterHeader } : headers }).toPromise() as any;
      this.Loading.stopLoading();
      if (response.SUCCESS == true) {
        response = response.DATA;
      }
      else {
        this.Toaster.showError(response.MESSAGE)
      }
      return response
    }
    catch (ex: any) {
      console.log(ex)
      this.Loading.stopLoading();
      //   this.Toaster?.showErrorAlert(ex.error.title, ex.error.detail)
      return undefined;
    }
  }
  public async deleteAsync<T>(url: string, data: any = null): Promise<T | undefined> {
    try {
      this.Loading.startLoading();
      let response = await this._httpClient.delete<T>(this.baseUrlApi + url, { body: data }).toPromise() as any;
      this.Loading.stopLoading();
      if (response.SUCCESS == true) {
        response = response.DATA;
      }
      else {
        this.Toaster.showError(response.MESSAGE)
      }
      return response
    }
    catch (ex: any) {
      console.log(ex)
      this.Loading.stopLoading();
      //   this.Toaster?.showErrorAlert(ex.error.title, ex.error.detail)
      return undefined;
    }
  }

  downloadExcel(url: string, data: any = null): Promise<Blob | undefined> {
    return this._httpClient.post(
      `${this.baseUrlApi}${url}`,
      data,
      {
        responseType: 'blob'
      }
    ).toPromise() ?? Promise.reject('Failed to download');
  }
}
