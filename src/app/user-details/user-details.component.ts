import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  leaderId: number
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
  leaderEvaluations: EvaluationData[] = [];
  otherEvaluations: EvaluationData[] = [];
  expandedEvaluations: { [key: string]: boolean } = {};
  userId: number | undefined;
  user: User | undefined;

  constructor(private route: ActivatedRoute, 
    private http: HttpClient,
    private router: Router,

    
    ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.userId = Number(params.get('id'));
      if (this.userId) {
        this.fetchSelfEvaluations();
        this.fetchOtherEvaluations();
        this.fetchLeaderEvaluations();
        this.fetchUserInfo();
      }
    });
  }

  rollbackPage(): void {
    this.router.navigate(['/evaluations']);
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
          // Filtra para pegar as autoavaliações corretamente, considerando o caso de líder
          this.selfEvaluations = response.data.filter(evaluation => 
            evaluation.evaluatorId === evaluation.employeeId || evaluation.evaluatorId === evaluation.leaderId
          );
        }
      }, error => {
        console.error('Erro ao carregar as autoavaliações:', error);
      });
  }

  fetchLeaderEvaluations(): void {
    this.http.get<EvaluationResponse>(`http://localhost:5001/api/leaderAvaliations`)
      .subscribe(response => {
        if (response.isSuccess && response.data) {
          // Filtra as avaliações feitas pelos líderes, se necessário
          this.otherEvaluations = this.otherEvaluations.concat(response.data);
        }
      }, error => {
        console.error('Erro ao carregar as avaliações dos líderes:', error);
      });
  }
  


  fetchOtherEvaluations(): void {
  this.http.get<EvaluationResponse>(`http://localhost:5001/api/userAvaliations/others/${this.userId}`)
    .subscribe(response => {
      if (response.isSuccess && response.data) {
        // Filtra para pegar avaliações de outros, excluindo autoavaliações e avaliações do líder
        this.otherEvaluations = response.data.filter(evaluation => 
          evaluation.evaluatorId !== evaluation.employeeId && evaluation.evaluatorId !== evaluation.leaderId
        );
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

  printEvaluation(type: 'user' | 'leader'): void {
    const elementId = type === 'user' ? 'userEvaluation' : 'leaderEvaluation';
    const printContents = document.getElementById(elementId)?.innerHTML;

    if (printContents) {
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(`
          <html>
            <body onload="window.print(); window.close();">
              ${printContents}
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    } else {
      console.error('Elemento não encontrado para impressão.');
    }
  }


}