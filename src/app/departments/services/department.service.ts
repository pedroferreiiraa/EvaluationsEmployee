import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private apiUrl = 'http://localhost:5001/api/users';

  constructor(private http: HttpClient) {}

  deleteUser(userId: number): Observable<void> {
    const body = { id: userId }; // Inclua o ID no corpo da requisição

    alert("Deseja mesmo excluir este usuário?")
    return this.http.delete<void>(`${this.apiUrl}/${userId}`, {
      headers: { 'Content-Type': 'application/json' },
      body: body
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Erro ao fazer a requisição DELETE:', error);
        return throwError(() => new Error('Falha ao excluir usuário. Detalhes no console.'));
      })
    );
  }

  createEvaluation(evaluation: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/createEvaluation`, evaluation).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Erro ao criar avaliação:', error);
        return throwError(() => new Error('Erro ao criar avaliação.'));
      })
    );
  }
}
