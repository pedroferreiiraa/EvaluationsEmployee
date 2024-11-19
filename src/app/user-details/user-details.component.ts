import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { UserDetailsService } from './services/users.details.service';
import { User } from '../home/interfaces/user.interface';

interface AnswerData {
  answerId: number;
  questionId: number;
  answerNumber: number;
}

interface TopicAverage {
  topic: string;
  average: number;
}


interface EvaluationData {
  avaliationId: number;
  evaluatorId: number;
  employeeId: number;
  dateReference: string;
  improvePoints: string | null;
  pdi: string | null;
  goals: string | null;
  sixMonthAlignment: string | null;
  status: number;
  completedAt: string;
  answers: AnswerData[];
  topicAverages: TopicAverage[];
}

interface EvaluationResponse {
  data: EvaluationData[];
  additionalData?: any;
  isSuccess?: boolean;
  message?: string;
}

@Component({
  selector: 'app-user-evaluations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserEvaluationsComponent implements OnInit {
  selfEvaluations: EvaluationData[] = [];
  otherEvaluations: EvaluationData[] = [];
  expandedEvaluations: { [key: string]: boolean } = {};

  userId: number | undefined;
  user: User | undefined;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.userId = Number(params.get('id'));
      if (this.userId) {
        this.fetchSelfEvaluations();
        this.fetchOtherEvaluations();
        this.fetchUserInfo();
      }
    });


  }
  fetchUserInfo(): void {
    this.http.get<User>(`http://localhost:5001/api/users/${this.userId}`).subscribe(user => {
      this.user = user;
    });
  }

  toggleEvaluation(type: 'self' | 'other', id: number): void {
    const key = `${type}-${id}`;
    this.expandedEvaluations[key] = !this.expandedEvaluations[key];
  }
  
  isEvaluationExpanded(type: 'self' | 'other', id: number): boolean {
    return !!this.expandedEvaluations[`${type}-${id}`];
  }

  fetchSelfEvaluations(): void {
    this.http.get<EvaluationResponse>(`http://localhost:5001/api/userAvaliations/self/${this.userId}`)
      .subscribe(response => {
        if (response.isSuccess && response.data) {
          this.selfEvaluations = response.data;
        }
      }, error => {
        console.error('Erro ao carregar as autoavaliações:', error);
      });
  }

  fetchOtherEvaluations(): void {
    this.http.get<EvaluationResponse>(`http://localhost:5001/api/userAvaliations/others/${this.userId}`)
      .subscribe(response => {
        if (response.isSuccess && response.data) {
          this.otherEvaluations = response.data;
        }
      }, error => {
        console.error('Erro ao carregar as avaliações de outros:', error);
      });
  }

  

}
