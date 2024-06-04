import { Injectable } from '@angular/core';
import { DomainModel } from './models/domain.model';

@Injectable({
  providedIn: 'root'
})
export class SectionsService {
  public listDomains: DomainModel[] = [];
  constructor() { }
}
