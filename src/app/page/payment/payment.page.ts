import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, 
  IonButtons, IonAvatar } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    CommonModule, 
    ReactiveFormsModule,
    IonButton,
    IonButtons, IonAvatar
  ]
})
export class PaymentPage implements OnInit {
  paymentForm: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.paymentForm = this.formBuilder.group({
      cardholderName: ['', [Validators.required, Validators.minLength(3)]],
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      expiryDate: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$')]],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]],
      saveData: [true]
    });
  }

  ngOnInit() {
  }

  onSubmit() {
    if (this.paymentForm.valid) {
      console.log('Formulario válido:', this.paymentForm.value);
      // Aquí puedes agregar la lógica para procesar el pago
      this.router.navigateByUrl('/menu');
    } else {
      console.log('Formulario inválido');
      Object.keys(this.paymentForm.controls).forEach(key => {
        const control = this.paymentForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  goBackToMenu() {
    console.log('Regresar al menú');
    this.router.navigateByUrl('/menu');
  }
  openProfile() {
        console.log('Abrir perfil');
  }

}