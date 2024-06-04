import { SectionsService } from './../sections.service';
import {
  Component,
  DoCheck,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { StorageService } from '../storage.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FieldModel, FormModel } from '../models/domain.model';
import { faker } from '@faker-js/faker';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { DialogSettingFieldComponent } from '../dialog-setting-field/dialog-setting-field.component';
import { FieldComponent } from './field/field.component';
@Component({
  selector: 'app-fields',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    DragDropModule,
    DialogModule,
    FieldComponent,
  ],
  templateUrl: './fields.component.html',
  styleUrl: './fields.component.scss',
})
export class FieldsComponent implements OnInit {
  @Input() formModel!: FormModel;
  @Input() iForm!: number;
  @Input() iSection!: number;
  @Input() listForms: FormModel[] = [];
  constructor() {}

  ngOnInit(): void {}
}
