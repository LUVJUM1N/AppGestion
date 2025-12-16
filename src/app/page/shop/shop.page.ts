import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; // Importar Router y RouterModule

// Importar los iconos necesarios para la barra de navegación
import { addIcons } from 'ionicons';
import {
  homeOutline, searchOutline, cartOutline, personOutline, // Iconos para la barra de navegación
  addCircleOutline, removeCircleOutline, closeCircle // Iconos existentes para cantidad
} from 'ionicons/icons';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

// Registrar los iconos (esto está fuera del bloque de importaciones del componente)
addIcons({
  homeOutline, searchOutline, cartOutline, personOutline,
  addCircleOutline, removeCircleOutline, closeCircle // Asegúrate de registrar los iconos existentes también
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
        { icon: 'cart-outline', label: 'Carrito', route: '/shop', badge: 1 },
        { icon: 'person-outline', label: 'Perfil', route: '/perfil' }
    ];

  private router = inject(Router);
  private toastController = inject(ToastController);
  private authService = inject(AuthService);

  avatarUrl: string = './assets/icon/perfil.png';

  ngOnInit() {
    try {
      const raw = localStorage.getItem('cart');
      if (raw) {
        this.items = JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Error leyendo carrito de localStorage', e);
    }

    // Manejo del producto añadido por navegación
    const nav = (this.router.getCurrentNavigation?.() as any) ?? null;
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

    // Actualizar badge del carrito
    this.updateCartBadge();

    // Suscribirse a cambios de usuario para mostrar avatar
    this.authService.authState$.subscribe(user => {
      if (user) {
        this.avatarUrl = user.photoURL ?? './assets/icon/perfil.png';
      } else {
        this.avatarUrl = './assets/icon/perfil.png';
      }
    });
  }

  increaseQuantity(item: any) {
    item.quantity = Number(item.quantity) + 1;
    this.calculateTotal();
    this.saveCart();

    this.toastController.create({ message: 'Cantidad actualizada', duration: 1200, position: 'bottom' }).then(t => t.present());
    this.updateCartBadge();
  }

  decreaseQuantity(item: any) {
    item.quantity = Math.max(1, Number(item.quantity) - 1);
    this.calculateTotal();
    this.saveCart();

    this.toastController.create({ message: 'Cantidad actualizada', duration: 1200, position: 'bottom' }).then(t => t.present());
    this.updateCartBadge();
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

  removeItem(item: any) {
    const idx = this.items.findIndex(i => (i.id && item.id && i.id === item.id) || i.name === item.name);
    if (idx > -1) {
      this.items.splice(idx, 1);
      this.calculateTotal();
      this.saveCart(); // si ya tienes saveCart para persistencia
      this.toastController.create({ message: 'Producto eliminado', duration: 1400, position: 'bottom' }).then(t => t.present());
      this.updateCartBadge();
    }
  }

  private updateCartBadge() {
    try {
      const raw = localStorage.getItem('cart');
      const cart = raw ? JSON.parse(raw) : [];
      const totalCount = cart.reduce((acc: number, item: any) => acc + (Number(item.quantity) || 0), 0);
      const cartNav = this.navItems.find(i => i.route === '/shop' || i.icon === 'cart-outline');
      if (cartNav) {
        cartNav.badge = totalCount || undefined;
      }
      this.navItems = [...this.navItems];
    } catch (e) {
      console.warn('Error actualizando badge del carrito', e);
    }
  }

  async goToPayment() {
    if (this.totalAmount <= 0) {
      await this.toastController.create({ message: 'El carrito está vacío', duration: 1600, color: 'warning', position: 'bottom' }).then(t => t.present());
      return;
    }
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

  openProfile() {
    this.router.navigateByUrl('/perfil');
  }

}