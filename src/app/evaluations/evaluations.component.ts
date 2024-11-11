import { Component, OnInit } from '@angular/core';
import { EvaluationsService } from './services/evaluations.service';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-evaluations',
  standalone: true,
  imports: [MatTableModule],
  templateUrl: './evaluations.component.html',
  styleUrl: './evaluations.component.scss'
})
export class EvaluationsComponent implements OnInit {
  questionId: number | null = null;
  text: string = '';
  topic: string = '';
  evaluations: any[] = [];


  constructor(private evaluationService: EvaluationsService) {
  
  }

  ngOnInit(): void {
  }

  fetchUserEvaluations(): void {
    this.evaluationService.getUserEvaluations().subscribe(
      (response: any) => {
        const userEvaluationData = response.data;
        this.questionId = userEvaluationData.questionId;
        this.text = userEvaluationData.text;
        this.topic = userEvaluationData.topic;
        this.evaluations = userEvaluationData.evaluations;
      },
      (error: any) => {
        console.error('Erro ao buscar avaliações:', error);
      }
    );
  }


}
