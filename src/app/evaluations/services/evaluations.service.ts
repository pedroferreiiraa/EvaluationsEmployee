import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EvaluationsService {
  private apiUrl = 'http://localhost:5001/api/userAvaliations'
  private leaderUrl = 'http://localhost:5001/api/leaderAvaliations'

  constructor(private http: HttpClient) { }

  getUserEvaluations(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }
  
  getLeaderEvaluations(): Observable<any[]> {
    return this.http.get<any[]>(this.leaderUrl).pipe(
      catchError(this.handleError)
    );
  }
  
  

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Erro ao buscar departamentos:', error);
    return throwError(() => error);
  }

}
