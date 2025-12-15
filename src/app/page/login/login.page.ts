import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserCredential } from 'firebase/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  mensaje: string = '';
  success: string = '';
  email: string = '';
  password: string = '';

  private router = inject(Router);
  private authService = inject(AuthService);

  login(email: string, password: string): void {
    this.mensaje = '';
    this.success = '';

    if (!email || !password) {
      this.mensaje = 'Completa ambos campos';
      return;
    }

    this.authService.login(email, password)
      .then((res: UserCredential) => { 
        this.success = 'Autenticado';
        console.log('Usuario logueado:', res.user);
        this.router.navigate(['/menu']);
      })
      .catch((err: unknown) => {
        if (err instanceof Error) {
          console.error('Error de login:', err.message);
        } else {
          console.error('Error desconocido de login:', err);
        }
        this.mensaje = 'Credenciales inválidas o usuario no existe';
      });
  }
}
