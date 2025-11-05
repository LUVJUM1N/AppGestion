
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
    this.product = nav?.extras?.state?.product ?? { id: this.id, nombre: 'Producto demo' };
  }
  regresarMenu() {
    this.router.navigate(['/menu']);
  }
  irAlCarrito() {
    this.router.navigate(['/shop']);
  }


}