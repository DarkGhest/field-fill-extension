/// <reference types="chrome"/>
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from './storage.service';
import { DomainModel } from './models/domain.model';
import { KeyStorage } from './models/key-storage.enum';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  listDomains: any[] = [];
  constructor(private storage: StorageService){
    
  }
  ngOnInit(): void {
    this.getData();

    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
      // Verificar si el mensaje es desde el contenido
      if (message.data) {
        console.log("Mensaje recibido en el popup:", message.data);
        // Hacer algo con la información recibida
        navigator.clipboard.writeText(message.data)
          .then(() => {
            console.log('Texto copiado al portapapeles')
            alert('Se ha pegado en el portapales, acceda a modificar formulario para importar lo copiado');
          })
          .catch(err => {
            console.error('Error al copiar al portapapeles:', err)
            alert('Error al copiar al portapapeles');
          })
      }
    });
  }
  async getData(){
    const data = await this.storage.get(KeyStorage.listDomains);
    console.log(data);
    if(data){
      const result: DomainModel[] = JSON.parse(data);
      this.listDomains = result;
      console.log(this.listDomains);
    }

  }
  goModificarFormulario(){
    chrome.tabs.query({ url: 'chrome-extension://*/index.html' }, function (tabs: any) {
        if (tabs.length > 0) {
          // Si la pestaña ya está abierta, selecciona la primera pestaña encontrada
          chrome.tabs.update(tabs[0].id, { active: true });
        } else {
          // Si la pestaña no está abierta, crea una nueva pestaña
          chrome.tabs.create({ url: 'index.html' });
        }
      });
  }
  obtenerCampos(){
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0] as any;
      chrome.tabs.sendMessage(activeTab.id, { action: "obtener-inputs" });
    });
  }
  llenarCampos(){
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0] as any;
      chrome.tabs.sendMessage(activeTab.id, { action: "llenar-campos" });
    });
  }
  sendPage(jsonInput: any) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var activeTab = tabs[0] as any;
      chrome.tabs.sendMessage(activeTab.id, { action: "ejecutarAccion", data: jsonInput });
    });
  }
}
