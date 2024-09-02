import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { faker } from '@faker-js/faker';
import { DialogSettingFieldComponent } from '../../dialog-setting-field/dialog-setting-field.component';
import { FormModel, FieldModel } from '../../models/domain.model';
import { SectionsService } from '../../sections.service';
import { StorageService } from '../../storage.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-field',
  standalone: true,
  imports: [FormsModule, CommonModule, DragDropModule, DialogModule, HttpClientModule],
  templateUrl: './field.component.html',
  styleUrl: './field.component.scss'
})
export class FieldComponent {
  @Input() formModel!: FormModel;
  @Input() field!: FieldModel;
  @Input() iForm!: number;
  @Input() i!: number;
  @Input() iSection!: number;
  displayForm = false;
  nameForm = '';
  @Input() listForms: FormModel[] = [];
  types = [
    { name: 'text', value: 'text' },
    { name: 'file', value: 'file' },
    { name: 'click', value: 'click' },
    { name: 'date', value: 'date' },
    { name: 'select', value: 'select' },
    { name: 'radio', value: 'radio' },
    { name: 'checkbox', value: 'checkbox' },
    { name: 'sleep', value: 'sleep' },
  ];
  errorForm = false;
  constructor(private storage: StorageService, public dialog: Dialog, private sectionsService: SectionsService, private http: HttpClient) {}

  ngOnInit(): void {}
  addField(formModel: FormModel) {
    formModel.listFields.push({
      query: '',
      value: '',
      favorite: false,
      type: 'text',
      name: 'campo-' + (formModel.listFields.length + 1),
    });
  }
  deleteField(formModel: FormModel, index: number) {
    formModel.listFields.splice(index, 1);
  }
  deleteFields(formModel: FormModel) {
    formModel.listFields = [];
  }
  uploadFile($event: any, field: FieldModel){
    console.log(field,$event.target.files[0]);
    const file = $event.target.files[0];
    const formData = new FormData();
    formData.append('file',file);
    const token = localStorage.getItem('token');
    this.http.post('http://198.58.97.35:3500/uploader-file',formData,{
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }).subscribe( (resp: any) => {
      console.log(resp);
      field.value = JSON.stringify({
        id: resp.id,
        originalName: resp.originalName
      });
    })
  }
  openDialogField(field: FieldModel): void {
    const dialogRef = this.dialog.open<string>(DialogSettingFieldComponent, {
      width: '250px',
      data: { field },
    });

    dialogRef.closed.subscribe((result) => {
      if (result) {
        field.generateRegex = result;
      }
    });
  }
  importForm(index: number, formModel: FormModel) {
    const value = prompt('ingresa import:');
    const result: any[] = JSON.parse(String(value));
    for (const field of result) {
      this.listForms[index].listFields.push({
        name: field.name,
        query: field.query,
        favorite: false,
        type: field.type,
        value: field.value,
      });
    }
    formModel.displayForms = true;
  }
  update(index: number) {
    const value = prompt('ingresa import:');
    const result: any[] = JSON.parse(String(value));
    for (
      let indexField = 0;
      indexField < this.listForms[index].listFields.length;
      indexField++
    ) {
      this.listForms[index].listFields[indexField].query =
        result[indexField].query;
    }
  }
  verificarSubstring(valor: string) {
    const positionStart = valor.search('<-s');
    const positionEnd = valor.search('s->');
    if(positionStart == -1) return valor;
    if(positionEnd == -1) return valor;
    const result = valor.substring(positionStart + 3, positionEnd);
    const array = result.split('|');
    const getValue = this.sectionsService.listDomains[Number(array[0])].listForms[Number(array[1])].listFields[Number(array[2])].value.substring(Number(array[3]),Number(array[4]));
    valor = valor.replace('<-s'+result+'s->',getValue);
    return valor;
  }
  generarAleatorioRegex(index: number) {
    let regex = this.field.generateRegex!;
    regex = this.verificarSubstring(regex);
    const result = faker.helpers.fromRegExp(regex);
    this.field.value = result;
  }
  generarAleatorio($event: Event, index: number, indexForm: number) {
    const inputElement = $event.target as HTMLInputElement;
    const inputValue = inputElement.value.toLowerCase();
    let result = '';
    switch (inputValue) {
      case 'generar_nombre': {
        result = faker.person.firstName();
        break;
      }
      case 'generar_apellido': {
        result = faker.person.lastName();
        break;
      }
      case 'generar_correo': {
        result = faker.internet.email();
        break;
      }
      case 'generar_telefono': {
        result = faker.phone.number('##########');
        break;
      }
    }
    if (result) {
      this.listForms[indexForm].listFields[index].value = result;
    }
  }
  descargarArchivo(texto: string, nombreArchivo: string) {
    let elemento = document.createElement('a');
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
  export(index: number) {
    const result = JSON.stringify(this.listForms[index].listFields);
    this.descargarArchivo(
      result,
      'exp-form-' + this.listForms[index].name + '.txt'
    );
  }
  duplicarForm(index: number) {
    this.listForms.splice(index + 1, 0, {
      name: 'form_' + index + 1,
      enabled: true,
      listFields: [],
    });
  }
  duplicar(formModel: FormModel, index: number, field: any) {
    formModel.listFields.splice(index + 1, 0, {
      query: '',
      value: '',
      favorite: false,
      type: 'text',
      name: 'campo-' + (formModel.listFields.length + 1),
    });
  }
  deleteForm(index: number) {
    this.listForms.splice(index, 1);
  }
  changeOptionValue(item: any, value: any) {
    item.type = value;
  }
  dropField(event: CdkDragDrop<string[]>, array: any[]) {
    moveItemInArray(array, event.previousIndex, event.currentIndex);
  }
}
