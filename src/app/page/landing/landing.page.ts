import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar,
  IonImg, IonFabButton, IonFab,IonIcon, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    IonImg, IonFabButton, IonFab,IonIcon, IonButton
  ]
})
export class LandingPage {

  private router = inject(Router);
  irAPagina2() {
    this.router.navigate(['/login']); //cambiar al inicio de sesión
  }

}
