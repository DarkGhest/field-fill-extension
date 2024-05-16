import { Component, Input, OnInit } from '@angular/core';
import { StorageService } from '../storage.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FieldModel, FormModel } from '../models/domain.model';
import { faker } from '@faker-js/faker';
import {CdkDragDrop, DragDropModule, moveItemInArray} from '@angular/cdk/drag-drop';
import {Dialog, DialogModule} from '@angular/cdk/dialog';
import { DialogSettingFieldComponent } from '../dialog-setting-field/dialog-setting-field.component';
@Component({
  selector: 'app-fields',
  standalone: true,
  imports: [FormsModule,CommonModule,DragDropModule,DialogModule],
  templateUrl: './fields.component.html',
  styleUrl: './fields.component.scss'
})
export class FieldsComponent implements OnInit{
  @Input() formModel!: FormModel;
  @Input() iForm!: number;
  displayForm = false;
  nameForm = '';
  @Input() listForms: FormModel[] = [];
  types = [
    {name: 'text', value: 'text'},
    {name: 'click', value: 'click'},
    {name: 'date', value: 'date'},
    {name: 'select', value: 'select'},
    {name: 'radio', value: 'radio'},
    {name: 'checkbox', value: 'checkbox'},
    {name: 'sleep', value: 'sleep'},
  ]
  errorForm = false;
  constructor(private storage: StorageService,public dialog: Dialog){}
  ngOnInit(): void {
  }
  saveForm(){
    if(!this.nameForm){
      this.errorForm = true;
      return;
    }
    const formModel = new FormModel();
    formModel.name = this.nameForm;
    this.listForms.push(formModel);
    this.displayForm = false;
    this.nameForm = '';
    this.errorForm = false;
  }
  addField(formModel: FormModel){
    formModel.listFields.push({
      query: '',
      value: '',
      type: 'text',
      name: 'campo-'+ (formModel.listFields.length + 1),
    })
  }
  deleteField(formModel: FormModel, index: number){
    formModel.listFields.splice( index, 1)
  }
  deleteFields(formModel: FormModel){
    formModel.listFields = [];
  }
  openDialogField(field: FieldModel): void {
    const dialogRef = this.dialog.open<string>(DialogSettingFieldComponent, {
      width: '250px',
      data: { field},
    });

    dialogRef.closed.subscribe(result => {
      if(result){
        field.generateRegex = result;
      }
    });
  }
  importForm(index: number,formModel: FormModel){
    const value = prompt('ingresa import:');
    const result: any[] = JSON.parse(String(value));
    for(const field of result){
      this.listForms[index].listFields.push({
        name: field.name,
        query: field.query,
        type: field.type,
        value: field.value
      })
    }
    formModel.displayForms = true;
  }
  update(index: number){
    const value = prompt('ingresa import:');
    const result: any[] = JSON.parse(String(value));
    for(let indexField = 0; indexField < this.listForms[index].listFields.length; indexField++ ){
      this.listForms[index].listFields[indexField].query = result[indexField].query
    }
  }
  generarAleatorioRegex(index: number, indexForm: number){
    const regex =  this.listForms[indexForm].listFields[index].generateRegex!;
    console.log(regex);
    const result = faker.helpers.fromRegExp(regex);
    this.listForms[indexForm].listFields[index].value = result;
  }
  generarAleatorio($event: Event, index: number, indexForm: number){
    const inputElement = $event.target as HTMLInputElement;
    const inputValue = inputElement.value.toLowerCase();
    let result = '';
    switch(inputValue){
      case 'generar_nombre':{
        result = faker.person.firstName();
        break;
      }
      case 'generar_apellido':{
        result = faker.person.lastName();
        break;
      }
      case 'generar_correo':{
        result = faker.internet.email();
        break;
      }
      case 'generar_telefono':{
        result = faker.phone.number('##########');
        break;
      }
    }
    if(result){
      this.listForms[indexForm].listFields[index].value = result;
    }
  }
  descargarArchivo(texto: string, nombreArchivo: string) {
    let elemento = document.createElement('a');
    elemento.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(texto));
    elemento.setAttribute('download', nombreArchivo);
    elemento.style.display = 'none';
    document.body.appendChild(elemento);
    elemento.click();
    document.body.removeChild(elemento);
  }
  export(index: number) {
    const result = JSON.stringify(this.listForms[index].listFields)
    this.descargarArchivo(result,'exp-form-'+this.listForms[index].name+'.txt')
  }
  duplicarForm(index: number){
    this.listForms.splice( index + 1, 0,{
      name: 'form_'+index + 1,
      enabled: true,
      listFields: []
    })
  }
  duplicar(formModel: FormModel, index: number, field: any){
    formModel.listFields.splice( index + 1, 0,{
      query: '',
      value: '',
      type: 'text',
      name: 'campo-'+ (formModel.listFields.length + 1),
    })
  }
  deleteForm(index: number){
    this.listForms.splice(index, 1);
  }
  changeOptionValue(item: any, value: any){
    item.type = value;
  }
  dropField(event: CdkDragDrop<string[]>,array: any[]) {
    moveItemInArray(array, event.previousIndex, event.currentIndex);
  }
}