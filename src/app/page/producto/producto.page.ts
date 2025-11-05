// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { IonContent, IonHeader, IonTitle, IonToolbar,
//   IonButtons, IonButton, IonRouterLink
//  } from '@ionic/angular/standalone';
// import { ActivatedRoute } from '@angular/router';

// @Component({
//   selector: 'app-producto',
//   templateUrl: './producto.page.html',
//   styleUrls: ['./producto.page.scss'],
//   standalone: true,
//   imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
//     IonButtons, IonButton, IonRouterLink
//   ]
// })
// export class ProductoPage implements OnInit {
//   id:number;

//   constructor(private activatedRoute: ActivatedRoute) {
//     this.id=+this.activatedRoute.snapshot.paramMap.get('id');
//    }

//   ngOnInit() {
//   }

// }
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,
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
  constructor(private router:Router,private activatedRoute: ActivatedRoute) {
    
  }

  ngOnInit() {
    // 1. Crear Observable paramMap
    this.activatedRoute.paramMap.subscribe(params => {
      const idString = params.get('id');
      
      if (idString) {
        // 2. Convertir a número 
        this.id = parseInt(idString, 10); 
        console.log('ID del producto cargado:', this.id);        
        // Llamar servicio: this.productService.getProductById(this.id).subscribe(data => { ... });
      } else {
        this.id = null;
        console.error('Error: No se encontró el parámetro ID en la ruta.');
      }
    });
  }

  regresarMenu(){
    this.router.navigate(['/menu']);
  }
  irAlCarrito(){
    this.router.navigate(['/menu']);
  }
}