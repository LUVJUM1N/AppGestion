import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
//import { SearchbarComponent } from './searchbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss'],
  standalone:true,
  imports:[CommonModule,IonicModule]
})
// @NgModule({
//   declarations:[SearchbarComponent],
//   imports:[CommonModule,IonicModule],
//   exports:[],
//   providers:[],
// })

export class SearchbarComponent {

}
