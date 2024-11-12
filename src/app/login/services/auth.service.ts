import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError, tap, of } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5001/api/users/login';
  private tokenKey = 'authToken';

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.put(this.apiUrl, credentials).pipe(
      tap((response: any) => {
        // Verifica se o usuário está deletado antes de salvar o token
        if (response.isDeleted) {
          throw new Error("Sua conta foi desativada. Entre em contato com o suporte para mais informações.");
        }

        const token = response.token;
        if (token) {
          this.saveToken(token);
        }
      }),
      catchError(this.handleError)
    );
  }

  private saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getRole(): string | null {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.decodeJWT(token);
      return decodedToken ? decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] : null;
    }
    return null;
  }

  getUserId(): number | null {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.decodeJWT(token);
      return decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    }
    return null;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  private decodeJWT(token: string): any {
    try {
      const payloadBase64 = token.split('.')[1];
      const decodedPayload = atob(payloadBase64);
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error('Erro ao decodificar o token JWT:', error);
      return null;
    }
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = "Ocorreu um erro inesperado. Por favor, tente novamente.";

    if (error.message.includes("desativada")) {
      errorMessage = error.message; // Usa a mensagem personalizada se o usuário estiver desativado
    }

    return throwError(() => new Error(errorMessage));
  }
}
