import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EvaluationsService {
  private apiUrl = 'http://localhost:5001/api/userAvaliations'

  constructor(private http: HttpClient) { }

  getUserEvaluations(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }
  
  getUserEvaluationsById(userId: number): Observable<{ userEvaluations: any[], leaderEvaluations: any[] }> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`).pipe(
      map((response: any) => {
        console.log('Resposta da API:', response); // Inspecione a resposta para verificar a estrutura
  
        // Corrige para acessar o array dentro de response.data
        const evaluations = Array.isArray(response.data) ? response.data : [];
  
        const userEvaluations = evaluations.filter((evaluation: any) => evaluation.employeeId === evaluation.evaluatorId);
        const leaderEvaluations = evaluations.filter((evaluation: any) => evaluation.employeeId === userId && evaluation.employeeId !== evaluation.evaluatorId);
  
        return { userEvaluations, leaderEvaluations };
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Erro ao buscar avaliações do usuário:', error);
        return throwError(() => new Error('Erro ao buscar avaliações do usuário.'));
      })
    );
  }
  

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Erro ao buscar departamentos:', error);
    return throwError(() => error);
  }

}
