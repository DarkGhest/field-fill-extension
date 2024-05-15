import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingComponent } from './setting/setting.component';
import { SectionsComponent } from './sections/sections.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,SettingComponent,SectionsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  constructor(){}
  ngOnInit(): void {
  }
}