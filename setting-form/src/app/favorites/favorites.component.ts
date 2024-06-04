import { FieldComponent } from './../fields/field/field.component';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { SectionsService } from '../sections.service';
import { DomainModel } from '../models/domain.model';
import { KeyStorage } from '../models/key-storage.enum';
import { StorageService } from '../storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, FieldComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss',
})
export class FavoritesComponent {
  @ViewChildren(FieldComponent) fieldComponent!: QueryList<FieldComponent>;
  constructor(
    private storage: StorageService,
    protected sectionService: SectionsService
  ) {}

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

  save() {
    if (this.sectionService.listDomains.length == 0) {
      alert('Debe registrar un formulario');
      return;
    }
    const result = JSON.stringify(this.sectionService.listDomains);
    this.storage.set(KeyStorage.listDomains, result);
    alert('SE ha guardado');
  }
  generate() {
    this.fieldComponent.forEach((component, index) => {
      component.generarAleatorioRegex(index);
    });
  }
}
