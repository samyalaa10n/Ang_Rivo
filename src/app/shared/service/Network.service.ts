import { Injectable } from '@angular/core';

import { LoadingComponent } from '../components/Loading/Loading.component';
import { ToasterComponent } from "../components/Toaster/Toaster.component";
import _ from 'lodash';
import { Router } from "@angular/router";
import * as signalR from '@microsoft/signalr';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class Network {
  public hubConnection: signalR.HubConnection | undefined;
  // baseUrl: string = "https://aspnetclusters-200150-0.cloudclusters.net"
  //baseUrl: string = "https://rivo.it.com:262"
  baseUrl: string = "https://localhost:44327"
  baseUrlApi: string = `${this.baseUrl}/api/`
  constructor(public _httpClient: HttpClient, public _router: Router) { }
  Loading!: LoadingComponent
  _LoginName: string = ""
  Toaster!: ToasterComponent
  // Start the SignalR connection
  public startConnection(UserData: string): void {
    this.hubConnection = new signalR.HubConnectionBuilder().withUrl(`${this.baseUrl}/Connect?UserData=${UserData}`, {
      withCredentials: true // لتأكيد إرسال الـ cookies إذا كان يستخدم
    }).build();
    this.Loading.startLoading();
    this.hubConnection.start()
      .then(() => {
        console.log('SignalR Connection Established')
      })
      .catch(err => {
        this.Loading.stopLoading();
        console.log(err)
      });
    this.hubConnection.on("OnConnectedData", (response) => {
      this.Loading.stopLoading();
      if (response.success) {
        this._LoginName = response.useR_NAME;
        localStorage.setItem("logInfo", JSON.stringify(response))
        this._router.navigate(['Main', 'Home'])
      }
      else {
        this.hubConnection?.stop();
        this.Toaster.showError(response.message)
        console.log(response)
        if (response.logOut) {
          localStorage.removeItem("logInfo")
          this._router.navigate(['Login'])
        }
      }
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
          this.Toaster.showError(response.MESSAGE)
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
  public async putAsync<T>(url: string, data: any, filterHeader: string = ""): Promise<T | undefined> {
    try {
      this.Loading.startLoading();
      let response = await this._httpClient.put<T>(this.baseUrlApi + url, data, { headers: { "filter": filterHeader } }).toPromise() as any;
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
}
