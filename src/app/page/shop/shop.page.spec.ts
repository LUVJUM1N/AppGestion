import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShopPage } from './shop.page';

describe('ShopPage', () => {
  let component: ShopPage;
  let fixture: ComponentFixture<ShopPage>;

  beforeEach(() => {
    // Configuración para crear el componente. 
    // En un entorno real, se necesitarían 'imports' y 'providers' aquí.
    fixture = TestBed.createComponent(ShopPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    // Verifica que el componente se haya creado correctamente
    expect(component).toBeTruthy();
  });

  it('should calculate the total amount correctly on initialization', () => {
    // Verifica que el cálculo total inicial sea 603
    expect(component.totalAmount).toBe(603);
  });

  it('should increase item quantity and update total', () => {
    const item = component.items[1]; // Engranaje (price: 50, quantity: 1)
    component.increaseQuantity(item); // quantity becomes 2
    expect(item.quantity).toBe(2);
    expect(component.totalAmount).toBe(603 + 50); // 653
  });

  it('should decrease item quantity and update total', () => {
    const item = component.items[0]; // Eje de acero (price: 101, quantity: 3)
    component.decreaseQuantity(item); // quantity becomes 2
    expect(item.quantity).toBe(2);
    expect(component.totalAmount).toBe(603 - 101); // 502
  });

  it('should not decrease quantity below 1', () => {
    const item = component.items[1]; // Engranaje (price: 50, quantity: 1)
    component.decreaseQuantity(item); // quantity remains 1
    expect(item.quantity).toBe(1);
    expect(component.totalAmount).toBe(603); // Total no cambia
  });
});