import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })
export class Location {
    getCurrentLocation(): Promise<GeolocationPosition> {
        return new Promise((resolve, reject) => {
            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            } else {
                reject('Geolocation is not available');
            }
        });
    }
}
