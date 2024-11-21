import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoLeaderEvaluationService {
  private apiUrl = 'http://localhost:5001/api';

  constructor(private http: HttpClient) { }

  // Método para buscar todas as questões
  getQuestions(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/leaderQuestions`);
  }

  // Método para enviar a avaliação
  submitEvaluation(data: {
    leaderId: number;
    evaluatorId: number;
    status: number;
    dateReference: string;
    leaderAnswers: { questionId: number; answerNumber: number }[];
  }): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/leaderAvaliations`, data);
  }

  completeEvaluation(evaluationId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/leaderAvaliations/${evaluationId}/complete`, {});
  }

}

