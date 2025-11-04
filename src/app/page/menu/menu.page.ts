import { Component, OnInit } from '@angular/core';
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

    selectedCategory: string = 'TODO';
    activeRoute: string = '/menu';

    categories = [
        { title: 'TODO', icon: 'apps-outline' },
        { title: 'PIEZAS INDUSTRIALES', icon: 'construct-outline' },
        { title: 'SISTEMA DE TRANSMISIÓN', icon: 'cog-outline' },
        { title: 'ACERO Y ESTRUCTURA', icon: 'layers-outline' }
    ];

    allPopularItems = [
        {
            name: 'Eje de acero',
            price: 101,
            image: 'assets/icon/eje acero.png',
            category: 'PIEZAS INDUSTRIALES'
        },
        {
            name: 'Engranajes',
            price: 50,
            image: 'assets/icon/engranaje.png',
            category: 'SISTEMA DE TRANSMISIÓN'
        },
        {
            name: 'Viga IPN',
            price: 500,
            image: 'assets/icon/viga.png',
            category: 'ACERO Y ESTRUCTURA'
        },
        {
            name: 'Rodamiento R1',
            price: 85,
            image: 'assets/icon/rodamiento.png',
            category: 'PIEZAS INDUSTRIALES'
        }
    ];

    navItems = [
        { icon: 'home-outline', label: 'Inicio', route: '/menu' },
        { icon: 'search-outline', label: 'Buscar', route: '/search' },
        { icon: 'cart-outline', label: 'Carrito', route: '/cart', badge: 1 },
        { icon: 'person-outline', label: 'Perfil', route: '/profile' }
    ];

    constructor(private router: Router) { }

    ngOnInit() {
        this.activeRoute = this.router.url;
    }

    selectCategory(categoryTitle: string) {
        this.selectedCategory = categoryTitle;
        console.log('Categoría seleccionada:', categoryTitle);
    }

    get filteredItems() {
        if (this.selectedCategory === 'TODO') {
            return this.allPopularItems;
        } else {
            return this.allPopularItems.filter(item => item.category === this.selectedCategory);
        }
    }

    openProfile() {
        console.log('Abrir perfil');
    }

    openCustom() {
        console.log('Abrir sección de personalización');
    }

    addToCart(product: any) {
        console.log('Añadir al carrito:', product.name);
    }

    navigate(route: string) {
        this.activeRoute = route;
        this.router.navigateByUrl(route); // ✅ ahora navega realmente
    }
}
