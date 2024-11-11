import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Department } from '../../interfaces/department.interface';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
 
  private apiUrl = 'http://localhost:5001/api/departments'; // URL da sua API

  constructor(private http: HttpClient) {}

  // Método para buscar os departamentos
  getDepartments(): Observable<{ data: Department[] }> {
    return this.http.get<{ data: Department[] }>(this.apiUrl);
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
