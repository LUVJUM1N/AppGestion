import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; // Importar Router y RouterModule

// Importar los iconos necesarios para la barra de navegación
import { addIcons } from 'ionicons';
import { 
  homeOutline, searchOutline, cartOutline, personOutline, // Iconos para la barra de navegación
  addCircleOutline, removeCircleOutline // Iconos existentes para cantidad
} from 'ionicons/icons';

// Registrar los iconos (esto está fuera del bloque de importaciones del componente)
addIcons({ 
  homeOutline, searchOutline, cartOutline, personOutline,
  addCircleOutline, removeCircleOutline // Asegúrate de registrar los iconos existentes también
});

import { 
  IonContent, //contenedor principal
  IonHeader, //cabecera
  IonTitle,  //titulo
  IonToolbar, //barra de herramientas
  IonButtons, // botones
  IonAvatar, // avatar imagen redonda
  IonList, // lista de elementos
  IonItem, // item de la lista
  IonThumbnail,  // miniatura de imagen
  IonTabs,       // 
  IonTabBar,     // 
  IonTabButton,  // 
  IonIcon,       // 
  IonButton,     // 
  IonLabel, 
  IonFooter,
  IonBadge // Importar IonBadge
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-shop',   // Nombre del componente
  templateUrl: './shop.page.html', // Ruta al archivo HTML
  styleUrls: ['./shop.page.scss'], // Ruta al archivo SCSS
  standalone: true,
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonButtons, // para poder usar botones
    IonAvatar,  // para poder usar avatar
    CommonModule, 
    FormsModule,  //formulario
    IonList,    // para poder usar listas
    IonItem,    // para poder usar items de la lista
    IonThumbnail,  // para poder usar miniaturas
    IonTabs,       // para poder usar tabs 
    IonTabBar,     // para poder usar tab bar
    IonTabButton,  // para poder usar tab button
    IonIcon,       // para poder usar iconos
    IonButton,     //  para poder usar botones
    IonLabel,       // para poder usar etiquetas
    IonFooter, // para poder usar pie de página
    IonBadge, // Añadir IonBadge aquí
    RouterModule // Añadir RouterModule aquí
  ]
})
export class ShopPage implements OnInit {

  // lista de productos en el carrito ejemplo
  items = [
    { name: 'Eje de acero', price: 101, image: 'assets/icon/eje acero.png', quantity: 3 },
    { name: 'Engranaje', price: 50, image: 'assets/icon/engranaje.png', quantity: 1 },
    { name: 'Motor eléctrico', price: 250, image: 'assets/icon/motor.png', quantity: 1 },
  ];

  // monto total del carrito
  totalAmount = 0;

  // Propiedades para la navegación inferior
  activeRoute: string = '/shop'; // Establece la ruta activa por defecto para esta página
  navItems = [
    { icon: 'home-outline', label: 'Inicio', route: '/menu' },
    { icon: 'search-outline', label: 'Buscar', route: '/search' },
    { icon: 'cart-outline', label: 'Carrito', route: '/shop', badge: 3 }, // badge de ejemplo
    { icon: 'person-outline', label: 'Perfil', route: '/perfil' }
  ];

  constructor(private router: Router) { } // Inyectar el Router

  ngOnInit() {
    this.calculateTotal();
    // Obtener la ruta actual para que el botón activo del footer coincida
    this.activeRoute = this.router.url; 
  }

  increaseQuantity(item: any) {
    item.quantity++;
    this.calculateTotal();
  }

  decreaseQuantity(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
      this.calculateTotal();
    }
  }

  calculateTotal() {
    this.totalAmount = this.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
  }

  goToPayment() {
    console.log('Ir a la página de pago');
    // Navegación real
    this.router.navigateByUrl('/payment'); 
  }

  // Método para la navegación de la barra inferior (con Router)
  navigate(route: string) {
    this.activeRoute = route;
    console.log('Navegando a:', route);
    this.router.navigateByUrl(route);
  }
}