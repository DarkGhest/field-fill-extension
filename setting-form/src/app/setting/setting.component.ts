/// <reference types="chrome"/>
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../storage.service';
import { KeyStorage } from '../models/key-storage.enum';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.scss',
})
export class SettingComponent {
  path = './';
  listAttributes = 'select,input,textarea';
  user = '';
  password = '';
  constructor(private storage: StorageService, private http: HttpClient) {}
  GuardarListAttributes() {
    this.storage.set('listAttributes', this.listAttributes);
    alert('SE ha guardado lista de atributos');
  }
  import() {
    const value = prompt('ingresa import:');
    this.storage.set(KeyStorage.listDomains, String(value));
    alert('recarga la pagina.');
  }
  async export() {
    const data = await this.storage.get(KeyStorage.listDomains);
    if (data) {
      this.descargarArchivo(data, 'exp-fields-fill.txt');
    }
  }
  descargarArchivo(texto: string, nombreArchivo: string) {
    var elemento = document.createElement('a');
    elemento.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(texto)
    );
    elemento.setAttribute('download', nombreArchivo);
    elemento.style.display = 'none';
    document.body.appendChild(elemento);
    elemento.click();
    document.body.removeChild(elemento);
  }
  login() {
    this.http.post('http://198.58.97.35:3500/auth/login', {
      email: this.user,
      password: this.password,
    }).subscribe( (resp : any) => {
      console.log(resp);
      localStorage.setItem('token',resp.access_token)
    });
  }
}
