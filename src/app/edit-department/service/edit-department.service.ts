import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EditDepartmentService {
  private apiUrl = 'http://192.168.16.194:5001/api'


  constructor(
    private http: HttpClient
  ) { }

  getDepartmentById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/departments/${id}`);
  }

  updateDepartment(id: number, data: { liderId: number; gestorId: number }): Observable<void> {
    const body = {
      id: id,
      liderId: data.liderId,
      gestorId: data.gestorId
    };
    return this.http.put<void>(`${this.apiUrl}/departments/${id}`, body);
  }

  getAllUsers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users`);
  }
  
}
