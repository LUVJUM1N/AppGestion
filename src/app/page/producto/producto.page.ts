
import { addIcons } from 'ionicons'; // registrar iconos
import { star, starOutline } from 'ionicons/icons';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonButton, IonIcon, IonImg
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router'; // Necesitas importar 'ActivatedRoute'

@Component({
  selector: 'app-producto',
  templateUrl: './producto.page.html',
  styleUrls: ['./producto.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    IonButton, IonIcon, IonImg
  ]
})
export class ProductoPage implements OnInit {
  id: number | null = null;
  product: any = null;
  constructor(private router: Router, private route: ActivatedRoute) {
  }

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
    //this.router.navigate(['/shop'], { state: { product } });

    try {
      const raw = localStorage.getItem('cart');
      const cart = raw ? JSON.parse(raw) : [];
      // buscar por id o por name como fallback
      const existing = cart.find((p: any) => (p.id && product.id && p.id === product.id) || p.name === product.name);
      if (existing) {
        existing.quantity = (Number(existing.quantity) || 0) + (Number(product.quantity) || 1);
      } else {
        cart.push({ ...product, quantity: Number(product.quantity) || 1 });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('No se pudo guardar el carrito en localStorage', e);
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