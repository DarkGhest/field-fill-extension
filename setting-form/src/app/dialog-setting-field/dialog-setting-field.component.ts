import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FieldModel } from '../models/domain.model';

@Component({
  selector: 'app-dialog-setting-field',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './dialog-setting-field.component.html',
  styleUrl: './dialog-setting-field.component.scss'
})
export class DialogSettingFieldComponent {
  fieldRegex = '';
  constructor(
    public dialogRef: DialogRef<string>,
    @Inject(DIALOG_DATA) public data: any,
  ) {}
  submit(){
    this.dialogRef.close(this.data.field.generateRegex)
  }
}
