import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonAvatar,
  IonContent, IonButton, IonFooter, IonTabBar, IonTabButton,
  IonIcon, IonLabel, IonBadge
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonAvatar,
    IonContent, IonButton, IonFooter, IonTabBar, IonTabButton,
    IonIcon, IonLabel, IonBadge
  ]
})
export class PerfilPage implements OnInit {
  user: any = {
    name: 'Usuario',
    email: '',
    phone: '',
    avatar: 'assets/icon/perfil.png'
  };

  editing = false;
  navItems = [
    { icon: 'home-outline', route: '/menu', label: 'Inicio' },
    { icon: 'cart-outline', route: '/shop', label: 'Carrito' },
    { icon: 'person-outline', route: '/perfil', label: 'Perfil' }
  ];
  activeRoute = '/perfil';

  constructor(private router: Router) {}

  ngOnInit() {
    // cargar user guardado si existe
    try {
      const raw = localStorage.getItem('user_profile');
      if (raw) this.user = JSON.parse(raw);
    } catch (e) { console.warn('No se pudo leer user_profile', e); }

    this.activeRoute = this.router.url;
  }

  openProfile() {
    // ya estamos en perfil; puedes usar para abrir modal o detalles
    console.log('openProfile');
  }

  editProfile() {
    this.editing = true;
  }

  saveProfile() {
    this.editing = false;
    try {
      localStorage.setItem('user_profile', JSON.stringify(this.user));
    } catch (e) { console.warn('No se pudo guardar perfil', e); }
  }

  changePassword() {
    // navegar a pantalla de cambio de contraseña o abrir modal
    this.router.navigateByUrl('/change-password');
  }

  logout() {
    // limpiar datos de sesión y navegar al login/menu
    try { localStorage.removeItem('user_profile'); } catch (_) {}
    // opcional: limpiar carrito u otros datos
    this.router.navigateByUrl('/menu');
  }

  // llamado por <input type="file"> en la plantilla
  async onFileSelected(ev: any) {
    const file: File = ev.target?.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.user.avatar = String(reader.result);
      // guardar inmediatamente la nueva avatar
      try { localStorage.setItem('user_profile', JSON.stringify(this.user)); } catch (e) { console.warn(e); }
    };
    reader.readAsDataURL(file);
  }

  navigate(route: string) {
    if (!route) return;
    this.router.navigateByUrl(route);
  }
}