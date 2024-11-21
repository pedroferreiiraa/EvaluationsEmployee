import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Department } from '../../interfaces/department.interface';

@Injectable({
  providedIn: 'root'
})
export class HomeDepartmentService {
  private apiUrl = 'http://localhost:5001/api/departments'; // URL da sua API

  constructor(private http: HttpClient) {}

  // Método para buscar os departamentos
  getDepartments(): Observable<{ data: Department[] }> {
    return this.http.get<{ data: Department[] }>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getAllDepartments(): Observable<any> {
    return this.http.get(`${this.apiUrl}`); // Substitua pelo endpoint correto
  }

  // Busca os detalhes do departamento e filtra usuários com isDeleted = false
  getDepartmentDetails(departmentId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${departmentId}`).pipe(
      map((response: any) => {
        // Filtra usuários com isDeleted = false
        response.data.users = response.data.users.filter((user: any) => !user.isDeleted);
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getDepartmentUsers(departmentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${departmentId}`).pipe(
      map((users: any[]) => users.filter(user => !user.isDeleted)),
      catchError(this.handleError)
    );
  }
  

  // Tratamento de erros
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Erro ao buscar departamentos:', error);
    return throwError(() => error);
  }
}
