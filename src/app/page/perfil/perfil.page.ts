import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonButtons, IonIcon, IonButton, IonFooter,
    IonAvatar, IonCard, IonCardContent,
    IonCardHeader, IonCardTitle, IonCardSubtitle,
    IonGrid, IonRow, IonCol, IonTabBar, IonTabButton,
    IonLabel, IonBadge, IonImg
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
    searchOutline, personCircleOutline, appsOutline,
    constructOutline, cogOutline, layersOutline,
    addOutline, homeOutline, cartOutline, personOutline,
    settingsOutline, helpCircleOutline, logOutOutline, bagOutline,
    chevronForwardOutline
} from 'ionicons/icons';

// Registrar íconos
addIcons({
    searchOutline, personCircleOutline, appsOutline,
    constructOutline, cogOutline, layersOutline,
    addOutline, homeOutline, cartOutline, personOutline,
    settingsOutline, helpCircleOutline, logOutOutline, bagOutline,
    chevronForwardOutline
});

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonButtons, IonIcon, IonButton, IonFooter,
    IonAvatar, IonCard, IonCardContent,
    IonCardHeader, IonCardTitle, IonCardSubtitle,
    IonGrid, IonRow, IonCol, IonTabBar, IonTabButton,
    IonLabel, IonBadge, IonImg
  ]
})
export class PerfilPage implements OnInit {

  activeRoute: string = '/perfil';

  user = {
    name: 'Juan Pérez',
    email: 'juan.perez@example.com',
    avatar: './assets/icon/perfil.png'
  };

  profileOptions = [
    { title: 'Mis Pedidos', icon: 'bag-outline', route: 'orders' },
    { title: 'Configuración', icon: 'settings-outline', action: 'settings' },
    { title: 'Ayuda', icon: 'help-circle-outline', action: 'help' },
    { title: 'Cerrar Sesión', icon: 'log-out-outline', action: 'logout' }
  ];

  navItems = [
    { icon: 'home-outline', label: 'Inicio', route: '/menu' },
    { icon: 'cart-outline', label: 'Carrito', route: '/shop', badge: 1 },
    { icon: 'person-outline', label: 'Perfil', route: '/perfil' }
  ];

  constructor(private router: Router) { }

  ngOnInit() {
    this.activeRoute = this.router.url;
  }

  navigate(route: string) {
    if (!route) return;
    this.router.navigateByUrl(route);
  }

  handleOption(action: string) {
    switch (action) {
      case 'orders':
        console.log('Abrir mis pedidos');
        break;
      case 'settings':
        console.log('Abrir configuración');
        break;
      case 'help':
        console.log('Abrir ayuda');
        break;
      case 'logout':
        console.log('Cerrar sesión');
        this.router.navigate(['/login']);
        break;
    }
  }
}
