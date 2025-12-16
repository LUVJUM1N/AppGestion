import { addIcons } from 'ionicons'; // registrar iconos
import { star, starOutline, arrowBack, cart } from 'ionicons/icons';

// Registrar iconos locales para esta página
addIcons({ star, starOutline, arrowBack, cart });
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons,
  IonButton, IonIcon, IonImg
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router'; // Necesitas importar 'ActivatedRoute' 
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.page.html',
  styleUrls: ['./producto.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, CommonModule, FormsModule,
    IonButton, IonIcon, IonImg
  ]
})
export class ProductoPage implements OnInit {
  id: number | null = null;
  product: any = null;
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastController = inject(ToastController);

  ngOnInit() {
    //PRUEBA
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id = idParam ? Number(idParam) : null;
    const nav = (this.router.getCurrentNavigation?.() as any) ?? null;
    this.product = nav?.extras?.state?.product ?? { id: this.id, nombre: 'Producto demo',price:0 };
    console.log('Producto cargado:', this.product);
  }

  addToShop(product: any) {
    if (!product) return;

    try {
      const raw = localStorage.getItem('cart');
      const cart = raw ? JSON.parse(raw) : [];

      const toAdd = {
        id: product.id ?? null,
        name: product.name ?? product.nombre ?? 'Producto',
        price: Number(product.price) || 0,
        image: product.image ?? 'assets/icon/default.png',
        quantity: Number(product.quantity) || 1
      };

      // buscar por id o por name como fallback
      const existing = cart.find((p: any) => (p.id && toAdd.id && p.id === toAdd.id) || p.name === toAdd.name);
      if (existing) {
        existing.quantity = (Number(existing.quantity) || 0) + toAdd.quantity;
      } else {
        cart.push(toAdd);
      }

      localStorage.setItem('cart', JSON.stringify(cart));

      // Emitir evento para que otras páginas (Menu) actualicen badge si escuchan
      try { window.dispatchEvent(new CustomEvent('cart:updated', { detail: { cart } })); } catch (e) { /* ignore */ }

      // Mostrar toast de confirmación
      this.toastController.create({
        message: 'Producto añadido al carrito',
        duration: 2000,
        position: 'bottom'
      }).then(toast => toast.present());
    } catch (e) {
      console.warn('No se pudo guardar el carrito en localStorage', e);
      this.toastController.create({ message: 'Error al añadir al carrito', duration: 2000, color: 'danger', position: 'bottom' }).then(t => t.present());
    }

    this.router.navigate(['/shop']);
  }
  regresarMenu() {
    this.router.navigate(['/menu']);
  }
  irAlCarrito() {
    this.router.navigate(['/shop']);
  }


}