/// <reference types="chrome"/>
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
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
      } else {
        localStorage.setItem(key, value);
      }
    });
  }

  get(key: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      if (this.isChromeExtension()) {
        chrome.storage.local.get(key, (result) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(result[key]);
          }
        });
      } else {
        const value = localStorage.getItem(key);
        resolve(value);
      }
    });
  }
  private isChromeExtension() {
    return typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id;
  }

  test() {
    // Ejemplo de uso
    let contenido = 'Este es el contenido del archivo a guardar.';
    this.saveFile(contenido);
  }
  // Función para guardar el archivo
  saveFile(content: string) {
    const chro = chrome as any;
    chro.fileSystem.chooseEntry(
      {
        type: 'saveFile',
        suggestedName: 'mi_archivo.txt',
      },
       (fileEntry: any) => {
        if (!fileEntry) {
          console.log('No se seleccionó ningún archivo');
          return;
        }

        fileEntry.createWriter(function (fileWriter: any) {
          fileWriter.onwriteend = function (e: any) {
            console.log('Archivo guardado correctamente');
          };

          fileWriter.onerror = function (e: any) {
            console.error('Error al guardar el archivo:', e);
          };

          var blob = new Blob([content], { type: 'text/plain' });
          fileWriter.write(blob);
        });
      }
    );
  }
}
