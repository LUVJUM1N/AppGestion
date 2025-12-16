import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardContent, IonList, IonItem } from '@ionic/angular/standalone';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardContent, IonList, IonItem]
})
export class OrdersPage implements OnInit {
  orders: any[] = [];
  private orderService = inject(OrderService);

  ngOnInit() {
    this.loadOrders();
  }

  async loadOrders() {
    try {
      this.orders = await this.orderService.getOrders();
    } catch (e) {
      console.error('Error cargando órdenes', e);
      this.orders = [];
    }
  }

  totalItems(order: any) {
    return (order.items || []).reduce((acc: number, it: any) => acc + (Number(it.quantity) || 0), 0);
  }
}
