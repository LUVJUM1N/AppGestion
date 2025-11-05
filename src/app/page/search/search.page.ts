import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonSearchbar, 
  IonButtons, 
  IonBackButton,
  IonFooter, IonTabBar, IonTabButton, IonIcon, IonLabel, IonBadge 
} from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';



@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonSearchbar,
    IonButtons,
    IonBackButton,
    IonFooter, IonTabBar, IonTabButton, RouterLink, IonIcon, IonLabel, IonBadge
  ]
})

export class SearchPage {
  constructor(private router: Router) {}

  // Propiedades para la navegación inferior (Iconos)
  activeRoute: string = '/search'; 
  navItems = [
    { icon: 'home-outline', label: 'Inicio', route: '/menu' },
    { icon: 'search-outline', label: 'Buscar', route: '/search' },
    { icon: 'cart-outline', label: 'Carrito', route: '/shop', badge: 3 }, 
    { icon: 'person-outline', label: 'Perfil', route: '/perfil' }
  ]; 

  navigate(route: string) {
    this.activeRoute = route;
    console.log('Navegando a:', route);
    this.router.navigateByUrl(route);
  }
}
