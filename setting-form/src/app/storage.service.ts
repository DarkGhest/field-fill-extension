/// <reference types="chrome"/>
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  set(key: string, value: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.isChromeExtension()) {
        chrome.storage.local.set({ [key]: value }, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      }else{
        localStorage.setItem(key,value);
      }
    });
  }

  get(key: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      if(this.isChromeExtension()){
        chrome.storage.local.get(key, (result) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(result[key]);
          }
        });
      }else{
        const value = localStorage.getItem(key);
        resolve(value);
      }
    });
  }
  private isChromeExtension() {
    return typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id;
  }
}