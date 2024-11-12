import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface User {
  fullName: string;
  password: string;
  email: string;
  role: string;
  departmentId: number;
  codFuncionario: number;
  typeMO: string;
}

@Injectable({
  providedIn: 'root'
})
export class AddUserService {
  private apiUrl = 'http://localhost:5001/api/users';

  constructor(
    private http: HttpClient
  ) { }

  postUser(user: User): Observable<void> {
    return this.http.post<void>(this.apiUrl, user);
  }
}
