import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { PaymentPage } from './payment.page';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton } from '@ionic/angular/standalone';

describe('PaymentPage', () => {
  let component: PaymentPage;
  let fixture: ComponentFixture<PaymentPage>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Creamos un "spy" para Router
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        IonContent,
        IonHeader,
        IonTitle,
        IonToolbar,
        IonButton
      ],
      providers: [
        { provide: Router, useValue: routerSpy } // Proveemos el router simulado
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentPage);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Detecta cambios iniciales
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to menu when goBackToMenu is called', () => {
    component.goBackToMenu();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/menu');
  });
});