export class DomainModel {
  name = '';
  enabled: boolean = true;
  editName?: boolean = false;
  displayForms?: boolean = false;
  listForms: FormModel[] = [];
}
export class FormModel {
  name = '';
  editName?: boolean = false;
  enabled: boolean = true;
  displayForms?: boolean = false;
  listFields: FieldModel[] = [];
}
export class FieldModel {
  generateRegex?: string = '';
  name: string = '';
  value: string = '';
  query: string = '';
  type: 'text' | 'click' | 'date' | 'select' | 'radio' | 'checkbox' | 'sleep' | 'number' =
    'text';
}
