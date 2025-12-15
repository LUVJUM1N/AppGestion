import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule],
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  mensaje = '';
  success = '';
  email: string = '';
  password: string = '';

  private router = inject(Router);
  private authService = inject(AuthService);

  register(email: string, password: string) {
    this.mensaje = '';
    this.success = '';

    if (!email || !password) {
      this.mensaje = 'Completa ambos campos';
      return;
    }

    this.authService.register(email, password)
      .then(res => {
        this.success = 'Usuario registrado correctamente';
        console.log('Usuario registrado:', res.user);
        this.router.navigate(['/login']); // Redirige al login
      })
      .catch(err => {
        console.error(err);
        this.mensaje = 'Error al registrar usuario: ' + err.message;
      });
  }
}