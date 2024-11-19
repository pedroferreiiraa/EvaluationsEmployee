import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
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

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

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
          this.selfEvaluations = response.data.filter(evaluation => evaluation.evaluatorId === evaluation.employeeId);
        }
      }, error => {
        console.error('Erro ao carregar as autoavaliações:', error);
      });
  }

  fetchOtherEvaluations(): void {
    this.http.get<EvaluationResponse>(`http://localhost:5001/api/userAvaliations/others/${this.userId}`)
      .subscribe(response => {
        if (response.isSuccess && response.data) {
          this.otherEvaluations = response.data.filter(evaluation => evaluation.evaluatorId !== evaluation.employeeId);
        }
      }, error => {
        console.error('Erro ao carregar as avaliações de outros:', error);
      });
  }

  processSixMonthAlignment(text: string) {
    const regex = /Data:\s*(.*)\s*Plano de melhoria traçado está em andamento\?\s*(.*)\s*Justificativa:\s*(.*)\s*Metas estabelecidas estão em andamento\?\s*(.*)\s*Justifique:\s*(.*)\s*Resultados do Semestre considerados:\s*(.*)\s*Considerações sobre a análise e alinhamentos:\s*(.*)/;
    
    const matches = text.match(regex);

    if (matches) {
      return {
        date: matches[1],
        improvementPlanStatus: matches[2],
        justification: matches[3],
        goalsStatus: matches[4],
        goalsJustification: matches[5],
        semesterResults: matches[6],
        alignmentConsiderations: matches[7]
      };
    } else {
      return null;
    }
  }
}