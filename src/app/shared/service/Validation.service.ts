import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Validation {

  constructor() { }
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
  isNumbers(text: any): boolean {
    return !(/^[0-9]+$/.test(text));
  }
  isEmpty(text: any): boolean {
    return text == undefined || text == null || text == "";
  }
  isEmail(email: any): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !regex.test(email);
  }
}
