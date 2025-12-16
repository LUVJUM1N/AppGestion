import { Component, EventEmitter, Input, OnInit, Output, OnDestroy, inject } from '@angular/core';
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
import { AuthService } from '../../services/auth.service';
import { addIcons } from 'ionicons';
import { ToastController } from '@ionic/angular';
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
    private authService = inject(AuthService);
    private toastController = inject(ToastController);

    avatarUrl: string = './assets/icon/perfil.png';

    ngOnInit() {
        this.activeRoute = this.router.url;
        addIcons({ addOutline });
        this.updateCartBadge();

        this.authService.authState$.subscribe(user => {
            if (user) {
                this.avatarUrl = user.photoURL ?? './assets/icon/perfil.png';
            } else {
                this.avatarUrl = './assets/icon/perfil.png';
            }
        });

        // Escuchar eventos de actualización de carrito (desde ProductoPage u otras partes)
        window.addEventListener('cart:updated', this._cartUpdateHandler);
    }

    ngOnDestroy() {
        window.removeEventListener('cart:updated', this._cartUpdateHandler);
    }

    private _cartUpdateHandler = (_: any) => {
        // Recalcular badge cuando recibe evento
        this.updateCartBadge();
    };

    // Ionic lifecycle: actualizar badge cuando se vuelve a la página
    ionViewWillEnter() {
        this.updateCartBadge();
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

    private updateCartBadge() {
        try {
            const raw = localStorage.getItem('cart');
            const cart = raw ? JSON.parse(raw) : [];
            const totalCount = cart.reduce((acc: number, item: any) => acc + (Number(item.quantity) || 0), 0);
            const cartNav = this.navItems.find(i => i.route === '/shop' || i.icon === 'cart-outline');
            if (cartNav) {
                cartNav.badge = totalCount || undefined;
            }
            this.navItems = [...this.navItems];
        } catch (e) {
            console.warn('Error actualizando badge del carrito', e);
        }
    }

    addToCart(product: any) {
        if (!product) return;

        const toAdd = {
            id: product.id ?? null,
            name: product.name ?? product.nombre ?? 'Producto',
            price: Number(product.price) || 0,
            image: product.image ?? 'assets/icon/default.png',
            quantity: 1
        };

        console.log('Añadiendo al carrito desde Menu:', toAdd);

        try {
            const raw = localStorage.getItem('cart');
            const cart = raw ? JSON.parse(raw) : [];
            const existing = cart.find((p: any) => (p.id && toAdd.id && p.id === toAdd.id) || p.name === toAdd.name);
            if (existing) {
                existing.quantity = (Number(existing.quantity) || 0) + toAdd.quantity;
            } else {
                cart.push(toAdd);
            }
            localStorage.setItem('cart', JSON.stringify(cart));

            // Actualizar badge del nav (suma de cantidades)
            const totalCount = cart.reduce((acc: number, item: any) => acc + (Number(item.quantity) || 0), 0);
            const cartNav = this.navItems.find(i => i.route === '/shop' || i.icon === 'cart-outline');
            if (cartNav) {
                cartNav.badge = totalCount || undefined;
            }
            // Forzar actualización de la vista
            this.navItems = [...this.navItems];

            // Mostrar toast de confirmación
            this.toastController.create({
                message: 'Producto añadido al carrito',
                duration: 2000,
                position: 'bottom'
            }).then(toast => toast.present());
        } catch (e) {
            console.warn('No se pudo guardar el carrito desde Menu', e);
        }
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
