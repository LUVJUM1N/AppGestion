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
  items: any[] = [
    { id: 1, name: 'Eje de acero', price: 101, image: 'assets/icon/eje acero.png', quantity: 3 },
    { id: 2, name: 'Engranaje', price: 50, image: 'assets/icon/engranaje.png', quantity: 2 },
    { id: 3, name: 'Motor eléctrico', price: 250, image: 'assets/icon/motor-electrico.png', quantity: 1 },
  ];

  // monto total del carrito
  totalAmount = 0;

  // Propiedades para la navegación inferior
  activeRoute: string = '/shop'; // Establece la ruta activa por defecto para esta página
  navItems = [
    { icon: 'home-outline', label: 'Inicio', route: '/menu' },
    { icon: 'search-outline', label: 'Buscar', route: '/search' },
    { icon: 'cart-outline', label: 'Carrito', route: '/shop.page', badge: 3 }, // badge de ejemplo
    { icon: 'person-outline', label: 'Perfil', route: '/profile' }
  ];

  constructor(private router: Router) { } // Inyectar el Router

  ngOnInit() {
    try {
      const raw = localStorage.getItem('cart');
      if (raw) {
        this.items = JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Error leyendo carrito de localStorage', e);
    }
    //this.calculateTotal();
    //this.activeRoute = this.router.url;
    const nav = (this.router.getCurrentNavigation?.() as any) ?? null;//entregar producto
    const added = nav?.extras?.state?.product ?? null;

    if (added) {
      const existing = this.items.find(i => (i.id && added.id && i.id === added.id) || i.name === added.name);
      const addQty = Number(added.quantity ?? 1);
      if (existing) {
        existing.quantity = (Number(existing.quantity) || 0) + addQty;
      } else {
        this.items.push({
          id: added.id ?? (this.items.length ? Math.max(...this.items.map(i => Number(i.id) || 0)) + 1 : 1),
          name: added.name,
          price: Number(added.price) || 0,
          image: added.image || 'assets/icon/default.png',
          quantity: addQty
        });
      }
      // guardar cambios en localStorage
      this.saveCart();
    }

    // calcular total y actualizar ruta activa
    this.calculateTotal();
    this.activeRoute = this.router.url;
  }

  increaseQuantity(item: any) {
    item.quantity = Number(item.quantity) + 1;
    this.calculateTotal();
    this.saveCart();
  }

  decreaseQuantity(item: any) {
    item.quantity = Math.max(1, Number(item.quantity) - 1);
    this.calculateTotal();
    this.saveCart();
  }

  calculateTotal() {
    this.totalAmount = this.items.reduce((acc, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.quantity) || 0;
      return acc + price * qty;
    }, 0);
    this.totalAmount = Math.round(this.totalAmount * 100) / 100; // Redondear a 2 decimales
  }
  saveCart() {
    try {
      localStorage.setItem('cart', JSON.stringify(this.items));
    } catch (e) {
      console.warn('No se pudo guardar el carrito', e);
    }
  }

  goToPayment() {
    console.log('Ir a la página de pago');
    // Navegación real
    this.router.navigateByUrl('/payment');
  }

  // Método para la navegación de la barra inferior 
  navigate(route: string) {
    this.activeRoute = route;
    console.log('Navegando a:', route);
    this.router.navigateByUrl(route);
  }
  goBackToMenu() {
    this.router.navigateByUrl('/menu');
  }

}