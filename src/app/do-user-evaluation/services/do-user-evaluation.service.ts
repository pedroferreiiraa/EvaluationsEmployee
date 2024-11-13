import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoUserEvaluationService {
  private apiUrl = 'http://localhost:5001/api';

  constructor(private http: HttpClient) { }

  // Método para buscar todas as questões
  getQuestions(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/questions`);
  }

  // Método para enviar a avaliação
  submitEvaluation(data: {
    employeeId: number;
    evaluatorId: number;
    status: number;
    dateReference: string;
    answers: { questionId: number; answerNumber: number }[];
  }): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/userAvaliations`, data);
  }

  completeEvaluation(evaluationId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/userAvaliations/${evaluationId}/complete`, {});
  }

}

