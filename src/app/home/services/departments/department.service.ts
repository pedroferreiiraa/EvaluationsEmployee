import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
 
  private apiUrl = 'http://localhost:5001/api/departments'; // URL da sua API

  constructor(private http: HttpClient) {}

  // Método para buscar os departamentos
  getDepartments(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getDepartmentDetails(departmentId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${departmentId}`);
  }


  getDepartmentUsers(departmentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${departmentId}`);
  }

  // Tratamento de erros
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Erro ao buscar departamentos:', error);
    return throwError(() => error);
  }
}
