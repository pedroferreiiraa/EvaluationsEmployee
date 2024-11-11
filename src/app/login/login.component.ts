import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})


export class LoginComponent {
    loginForm: FormGroup;
    errorMessage: string | null = null;
  
    constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
      this.loginForm = this.fb.group({
        email: ['', [Validators.required]],
        password: ['', [Validators.required]]
      });
    }
  
    onSubmit() {
      if (this.loginForm.valid) {
        this.authService.login(this.loginForm.value).subscribe(
          response => {
            console.log('Login bem-sucedido:', response);
            // Redirecione para a página inicial ou dashboard
            this.router.navigate(['/home'])
           
          },
          error => {
            console.error('Erro no login:', error);
            this.errorMessage = this.getErrorMessage(error);
          }
        );
      }
    }
  
    private getErrorMessage(error: any): string {
      if (error.status === 0) {
        return 'Erro de conexão. Verifique sua internet.';
      }
      if (error.status === 401) {
        return 'Credenciais inválidas. Tente novamente.';
      }
      return 'Ocorreu um erro inesperado. Por favor, tente mais tarde.';
    }
  }