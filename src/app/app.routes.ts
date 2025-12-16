import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./page/login/login.page').then( m => m.LoginPage)
  },
    {
    path: 'menu',
    loadComponent: () => import('./page/menu/menu.page').then( m => m.MenuPage)
  },
  { path: 'producto/:id',
    loadComponent: () => import('./page/producto/producto.page').then(m => m.ProductoPage)
  }, 
  {
    path: 'producto',
    loadComponent: () => import('./page/producto/producto.page').then( m => m.ProductoPage)
  },
  {
    path: 'shop',
    loadComponent: () => import('./page/shop/shop.page').then( m => m.ShopPage)
  },
  { 
    path: 'cart',
    loadComponent: () => import('./page/shop/shop.page').then( m => m.ShopPage)
  },
  
  {
    path: 'payment',
    loadComponent: () => import('./page/payment/payment.page').then( m => m.PaymentPage)
  },
  {
    path: 'orders',
    loadComponent: () => import('./page/orders/orders.page').then( m => m.OrdersPage)
  },
  {
    path: 'landing',
    loadComponent: () => import('./page/landing/landing.page').then( m => m.LandingPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./page/register/register.page').then( m => m.RegisterPage)
  },
  
   {
    path: 'perfil',
    loadComponent: () => import('./page/perfil/perfil.page').then( m => m.PerfilPage)
  },



];
