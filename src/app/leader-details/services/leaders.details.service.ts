import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeadersEvaluationsService {


  private apiUrl = 'http://192.168.16.194:5001/api/users';  // Base da URL

  constructor(private http: HttpClient) { }

  // Função para obter o usuário pelo ID
  getUserById(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;  // Construindo a URL com o ID
    return this.http.get<any>(url);  // Realizando o GET e retornando o Observable
  }

  

}
