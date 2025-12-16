import { Component, inject, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton,
  IonButtons, IonAvatar
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    ReactiveFormsModule,
    IonButton,
    IonButtons, 
    IonAvatar
  ]
})
export class PaymentPage implements OnInit {
  private zone = inject(NgZone);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private toastController = inject(ToastController);
  private loadingController = inject(LoadingController);
  private alertController = inject(AlertController);
  private orderService = inject(OrderService);

  processing: boolean = false;
  paymentForm: FormGroup;
  totalAmount: number = 0;
  items: any[] = [];

  constructor() {
    this.paymentForm = this.formBuilder.group({
      cardholderName: ['', [Validators.required, Validators.minLength(3)]],
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      expiryDate: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$')]],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]],
      saveData: [true]
    });
  }

  ngOnInit() {
    this.loadCart();
  }

  async onSubmit() {
    if (!this.paymentForm.valid) {
      this.presentToast('Por favor, completa el formulario correctamente', 'warning');
      return;
    }
    if (this.processing) return;

    this.processing = true;
    const loading = await this.loadingController.create({
      message: 'Procesando pago...',
      backdropDismiss: false
    });
    await loading.present();

    let success = false;
    try {
      // simular retardo de pasarela
      await new Promise(res => setTimeout(res, 800));

      await this.orderService.saveOrder({ items: this.items, total: this.totalAmount });

      // limpiar carrito y notificar al resto de la app
      localStorage.removeItem('cart');
      try { window.dispatchEvent(new CustomEvent('cart:updated', { detail: { cart: [] } })); } catch (e) {}

      success = true;

    } catch (e) {
      console.error('Error al procesar pago:', e);
      await this.presentToast('Error al procesar el pago', 'danger');
    } finally {
      // Asegurar que el loading se cierre siempre
      try { await loading.dismiss(); } catch (e) { /* ignore */ }
      this.processing = false;
    }

    if (success) {
      // Mostrar diálogo de pago exitoso con acciones
      const alert = await this.alertController.create({
        header: 'Pago exitoso',
        message: 'Tu pago se procesó correctamente.',
        buttons: [
          {
            text: 'Ver pedidos',
            handler: () => this.router.navigateByUrl('/orders')
          },
          {
            text: 'Aceptar',
            role: 'cancel'
          }
        ]
      });
      await alert.present();
    }
  }

  goBackToMenu() {
    this.router.navigateByUrl('/menu');
  }

  openProfile() {
    this.router.navigateByUrl('/perfil');
  }

  private loadCart() {
    try {
      const raw = localStorage.getItem('cart');
      const list = raw ? JSON.parse(raw) : [];
      this.items = list;
      this.totalAmount = this.items.reduce((acc, it) => acc + (Number(it.price) || 0) * (Number(it.quantity) || 0), 0);
      this.totalAmount = Math.round(this.totalAmount * 100) / 100;
    } catch (e) {
      console.warn('No se pudo cargar carrito', e);
      this.items = [];
      this.totalAmount = 0;
    }
  }

  async presentToast(message: string, color: string) {
    const t = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    await t.present();
  }
}