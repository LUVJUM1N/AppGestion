import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonButton } from '@ionic/angular/standalone';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonButtons, 
  IonAvatar, 
  IonFooter, 
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonBadge,
  
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [
  CommonModule,
  FormsModule,
  RouterModule,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonAvatar,
  IonFooter,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonBadge,
  IonButton 
]

})
export class PerfilPage implements OnInit {
   
  user = {
    name: 'Angelica Delegada',
    email: 'Delegada@example.com',
    phone: '+51 987654321',
    avatar: './assets/icon/perfil.png'
  };

  // para la barra de navegación inferior
   navItems = [
        { icon: 'home-outline', label: 'Inicio', route: '/menu' },
        { icon: 'search-outline', label: 'Buscar', route: '/search' },
        { icon: 'cart-outline', label: 'Carrito', route: '/cart', badge: 1 },
        { icon: 'person-outline', label: 'Perfil', route: '/profile' }
    ];


  activeRoute = '/profile';

  constructor() { }

  ngOnInit() { }

  openProfile() {
    console.log('Abrir perfil');
  }

  navigate(route: string) {
    console.log('Navegando a', route);
    this.activeRoute = route; // Marca la ruta activa
  }

    editProfile() {
    console.log('Editar Perfil');
    // Lógica para abrir formulario de edición
  }

  changePassword() {
    console.log('Cambiar Contraseña');
    // Lógica para cambiar contraseña
  }

  logout() {
    console.log('Cerrar Sesión');
    // Lógica para cerrar sesión
  }

}
