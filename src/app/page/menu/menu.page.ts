import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonButtons, IonIcon, IonButton, IonFooter,
    IonAvatar, IonSearchbar, IonCard, IonCardContent,
    IonCardHeader, IonCardTitle, IonCardSubtitle,
    IonGrid, IonRow, IonCol, IonTabBar, IonTabButton,
    IonLabel, IonBadge, IonImg
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
    searchOutline, personCircleOutline, appsOutline,
    constructOutline, cogOutline, layersOutline,
    addOutline, homeOutline, cartOutline, personOutline
} from 'ionicons/icons';

// Registrar íconos
addIcons({
    searchOutline, personCircleOutline, appsOutline,
    constructOutline, cogOutline, layersOutline,
    addOutline, homeOutline, cartOutline, personOutline
});

@Component({
    selector: 'app-menu',
    templateUrl: './menu.page.html',
    styleUrls: ['./menu.page.scss'],
    standalone: true,
    imports: [
        CommonModule, FormsModule, RouterModule,
        IonContent, IonHeader, IonTitle, IonToolbar,
        IonButtons, IonIcon, IonButton, IonFooter,
        IonAvatar, IonSearchbar, IonCard, IonCardContent,
        IonCardHeader, IonCardTitle, IonCardSubtitle,
        IonGrid, IonRow, IonCol, IonTabBar, IonTabButton,
        IonLabel, IonBadge, IonImg
    ]
})
export class MenuPage implements OnInit {

    id: number | string = '';
    selectedCategory: string = 'TODO';
    activeRoute: string = '/menu';
    searchTerm: string = '';

    categories = [
        { title: 'TODO', icon: 'apps-outline' },
        { title: 'PIEZAS INDUSTRIALES', icon: 'construct-outline' },
        { title: 'SISTEMA DE TRANSMISIÓN', icon: 'cog-outline' },
        { title: 'ACERO Y ESTRUCTURA', icon: 'layers-outline' }
    ];
    // PRODUCTOS EN CATEGORÍA TODO
    allPopularItems = [
        {
            id: 1,
            name: 'Eje de acero',
            price: 101,
            image: 'assets/icon/eje acero.png',
            category: 'PIEZAS INDUSTRIALES'
        },
        {
            id: 2,
            name: 'Engranajes',
            price: 50,
            image: 'assets/icon/engranaje.png',
            category: 'SISTEMA DE TRANSMISIÓN'
        },
        {
            id: 3,
            name: 'Viga IPN',
            price: 500,
            image: 'assets/icon/viga.png',
            category: 'ACERO Y ESTRUCTURA'
        },
        {
            id: 4,
            name: 'Rodamiento R1',
            price: 85,
            image: 'assets/icon/rodamiento.png',
            category: 'PIEZAS INDUSTRIALES'
        }
    ];
    // NAVEGAR POR CATEGORÍA
    navItems = [
        { icon: 'home-outline', label: 'Inicio', route: '/menu' },
        { icon: 'cart-outline', label: 'Carrito', route: '/shop', badge: 1 },
        { icon: 'person-outline', label: 'Perfil', route: '/perfil' }
    ];

    private router = inject(Router);

    ngOnInit() {
        this.activeRoute = this.router.url;
        addIcons({ addOutline });
    }

    selectCategory(categoryTitle: string) {
        this.selectedCategory = categoryTitle;
        console.log('Categoría seleccionada:', categoryTitle);
    }

    get filteredItems() {
        let items = this.allPopularItems;

        if (this.selectedCategory !== 'TODO') {
            items = items.filter(item => item.category === this.selectedCategory);
        }

        if (this.searchTerm) {
            items = items.filter(item =>
                item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
            );
        }

        return items;
    }

    onSearchChange(event: any) {
        this.searchTerm = event.detail.value || '';
    }

    openProfile() {
        console.log('Abrir perfil');
        this.router.navigate(['/perfil']);
    }

    openCustom() {
        console.log('Abrir sección de personalización');
    }

    addToCart(product: any) {
        console.log('Añadir al carrito:', product.name);
    }
    goToProduct() {
        // this.router.navigateByUrl('Ver producto'); 
        this.router.navigate(['/producto']);
    }
    openProduct(product: any) {
        const id = product?.id ?? product?.name ?? '';
        console.log('openProduct called, id=', id, ' product=', product);
        // navega con parámetro y con state para que ProductoPage reciba el objeto completo
        this.router.navigate(['/producto', id], { state: { product } });
    }

    navigate(route: string) {
        //this.activeRoute = route;
        if (!route) return;
        this.router.navigateByUrl(route);
    }
}
