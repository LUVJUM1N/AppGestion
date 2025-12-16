import { Component, OnInit, inject, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonButtons, IonIcon, IonButton, IonFooter,
    IonAvatar, IonCard, IonCardContent,
    IonCardHeader, IonCardTitle, IonCardSubtitle,
    IonGrid, IonRow, IonCol, IonTabBar, IonTabButton,
    IonLabel, IonBadge, IonImg, IonInput, IonProgressBar,
    IonSegment, IonSegmentButton
} from '@ionic/angular/standalone';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { addIcons } from 'ionicons';
import {
    homeOutline, cartOutline, personOutline,
    logOutOutline, bagOutline, helpCircleOutline
} from 'ionicons/icons';

addIcons({ homeOutline, cartOutline, personOutline, logOutOutline, bagOutline, helpCircleOutline });

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
    IonLabel, IonBadge, IonImg, IonInput, IonProgressBar,
    IonSegment, IonSegmentButton
  ]
})
export class PerfilPage implements OnInit {
  private zone = inject(NgZone);
  private router = inject(Router);
  private authService = inject(AuthService);
  private toastController = inject(ToastController);
  private loadingController = inject(LoadingController);
  private alertController = inject(AlertController);
  private orderService = inject(OrderService);

  user = {
    name: 'Usuario',
    email: '',
    avatar: './assets/icon/perfil.png'
  };

  avatarUploading = false;
  newName: string = '';
  activeTab: 'orders' | 'about' | 'logout' = 'orders';
  orders: any[] = [];
  loadingOrders = false;

  navItems = [
    { icon: 'home-outline', label: 'Inicio', route: '/menu' },
    { icon: 'cart-outline', label: 'Carrito', route: '/shop' },
    { icon: 'person-outline', label: 'Perfil', route: '/perfil' }
  ];

  ngOnInit() {
    // Escuchamos el estado del usuario para recuperar el EMAIL
    this.authService.authState$.subscribe(u => {
      this.zone.run(() => {
        if (u) {
          this.user.email = u.email ?? '';
          this.user.name = u.displayName ?? (u.email ? u.email.split('@')[0] : 'Usuario');
          this.user.avatar = u.photoURL ?? './assets/icon/perfil.png';
          this.newName = this.user.name;
        }
      });
    });
    this.loadOrders();
  }

  async loadOrders() {
    this.loadingOrders = true;
    try {
      this.orders = await this.orderService.getOrders();
    } catch (e) {
      console.error(e);
    } finally {
      this.zone.run(() => { this.loadingOrders = false; });
    }
  }

  selectTab(tab: any) {
    this.activeTab = tab;
    if (tab === 'orders') this.loadOrders();
  }

  async onFileSelected(event: any) {
    const file: File = event.target?.files?.[0];
    if (!file) return;

    this.avatarUploading = true;
    try {
      const url = await this.authService.uploadAvatar(file);
      // Forzamos a Angular a reconocer el cambio de URL y cerrar el estado de subida
      this.zone.run(() => {
        this.user.avatar = url;
        this.avatarUploading = false;
        this.presentToast('Avatar actualizado', 'success');
      });
    } catch (err) {
      this.zone.run(() => {
        this.avatarUploading = false;
        this.presentToast('Error al subir imagen', 'danger');
      });
    }
  }

  async updateName() {
    const name = (this.newName || '').trim();
    if (!name) return;

    const loading = await this.loadingController.create({ message: 'Guardando...' });
    await loading.present();

    try {
      await this.authService.updateDisplayName(name);
      this.zone.run(async () => {
        this.user.name = name;
        await loading.dismiss();
        this.presentToast('Nombre guardado', 'success');
      });
    } catch (err) {
      this.zone.run(async () => {
        await loading.dismiss();
        this.presentToast('Error al guardar', 'danger');
      });
    }
  }

  async confirmLogout() {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Deseas cerrar sesión?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Cerrar sesión', role: 'destructive', handler: () => this.performLogout() }
      ]
    });
    await alert.present();
  }

  async performLogout() {
    await this.authService.signOut();
    this.router.navigate(['/login']);
  }

  totalItems(order: any) {
    return (order.items || []).reduce((acc: number, it: any) => acc + (it.quantity || 0), 0);
  }

  private async presentToast(message: string, color: string) {
    const t = await this.toastController.create({ message, duration: 2000, color: color as any });
    await t.present();
  }
}