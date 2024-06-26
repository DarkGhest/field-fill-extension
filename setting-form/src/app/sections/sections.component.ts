import { Component, DoCheck, OnChanges, OnInit } from '@angular/core';
import { StorageService } from '../storage.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DomainModel } from '../models/domain.model';
import { KeyStorage } from '../models/key-storage.enum';
import { FormsComponent } from '../forms/forms.component';
import { SectionsService } from '../sections.service';

@Component({
  selector: 'app-sections',
  standalone: true,
  imports: [FormsModule, CommonModule, FormsComponent],
  templateUrl: './sections.component.html',
  styleUrl: './sections.component.scss',
})
export class SectionsComponent implements OnInit, OnChanges {
  displayForm = false;
  nameForm = '';
  errorForm = false;
  constructor(
    private storage: StorageService,
    protected sectionService: SectionsService
  ) {}

  ngOnInit(): void {
    this.getData();
  }
  ngOnChanges(changes: any) {
    if (changes.listDomains) {
      console.log('El arreglo ha cambiado');
    }
  }
  async getData() {
    const data = await this.storage.get(KeyStorage.listDomains);
    if (data) {
      const result: DomainModel[] = JSON.parse(data);
      this.sectionService.listDomains = result.map((row) => {
        row.editName = false;
        //row.displayForms = false;
        return row;
      });
    }
  }
  displaySection(section: DomainModel) {
    section.displayForms = !section.displayForms;
  }
  import(index: number) {
    const value = prompt('ingresa import:');
    this.sectionService.listDomains[index].listForms = JSON.parse(
      String(value)
    );
  }
  export(index: number) {
    const result = JSON.stringify(this.sectionService.listDomains[index]);
    this.descargarArchivo(
      result,
      'exp-seccion-' + this.sectionService.listDomains[index].name + '.txt'
    );
  }
  saveForm() {
    if (!this.nameForm) {
      this.errorForm = true;
      return;
    }
    const formModel = new DomainModel();
    formModel.name = this.nameForm;
    this.sectionService.listDomains.push(formModel);
    this.displayForm = false;
    this.nameForm = '';
    this.errorForm = false;
  }
  duplicarForm(index: number) {
    const formModel = new DomainModel();
    formModel.name = 'dominio-' + (index + 1);
    this.sectionService.listDomains.splice(index + 1, 0, formModel);
  }
  deleteForm(index: number) {
    this.sectionService.listDomains.splice(index, 1);
  }
  changeOptionValue(item: any, value: any) {
    item.type = value;
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
  save() {
    if (this.sectionService.listDomains.length == 0) {
      alert('Debe registrar un formulario');
      return;
    }
    const result = JSON.stringify(this.sectionService.listDomains);
    this.storage.set(KeyStorage.listDomains, result);
    alert('SE ha guardado');
  }
}
