import { Injectable, inject, NgZone } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, collection, addDoc, query, where, getDocs, orderBy } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private zone = inject(NgZone);

  async saveOrder(order: any) {
    const user = this.auth.currentUser;
    const payload = {
      ...order,
      userId: user?.uid ?? null,
      createdAt: order.createdAt ?? new Date().toISOString()
    };

    if (user) {
      // MODIFICACIÓN: Envolvemos TODA la promesa de Firebase en zone.run
      return await this.zone.run(async () => {
        try {
          const col = collection(this.firestore, 'orders');
          const docRef = await addDoc(col, payload);
          console.log('Orden guardada exitosamente en Firestore');
          return { id: docRef.id, ...payload };
        } catch (e) {
          console.error('Error en Firestore, intentando local...', e);
          return this.saveToLocal(payload);
        }
      });
    }

    return this.saveToLocal(payload);
  }

  // Función auxiliar para no repetir código de localStorage
  private saveToLocal(payload: any) {
    return this.zone.run(() => {
      try {
        const raw = localStorage.getItem('orders');
        const list = raw ? JSON.parse(raw) : [];
        const id = `local-${Date.now()}`;
        const item = { id, ...payload };
        list.push(item);
        localStorage.setItem('orders', JSON.stringify(list));
        return item;
      } catch (e) {
        console.error('Error en localStorage', e);
        throw e;
      }
    });
  }

  async getOrders() {
    const user = this.auth.currentUser;
    if (user) {
      // MODIFICACIÓN: Envolvemos la consulta para evitar el warning amarillo
      return await this.zone.run(async () => {
        try {
          const q = query(
            collection(this.firestore, 'orders'), 
            where('userId', '==', user.uid), 
            orderBy('createdAt', 'desc')
          );
          const snap = await getDocs(q);
          return snap.docs.map(d => ({ id: d.id, ...d.data() }));
        } catch (e) {
          console.error('Error recuperando órdenes', e);
          return this.getLocalOrders();
        }
      });
    }
    return this.getLocalOrders();
  }

  private getLocalOrders() {
    return this.zone.run(() => {
      const raw = localStorage.getItem('orders');
      return raw ? JSON.parse(raw) : [];
    });
  }
}