import { Component, OnInit } from '@angular/core';
import { DoUserEvaluationService } from './services/do-user-evaluation.service';
import { ActivatedRoute } from '@angular/router';
import {  FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../login/services/auth.service';

@Component({
  selector: 'app-do-user-evaluation',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './do-user-evaluation.component.html',
  styleUrl: './do-user-evaluation.component.scss'
})
export class DoUserEvaluationComponent implements OnInit {
  evaluationForm: FormGroup | any;

  questions: {
    questionId: any; id: number; text: string; topic: string;
}[] = [];

  answers: { questionId: number; answerNumber: number }[] = [];
  userId: number = 0
  status: number = 0; 
  dateReference: string = new Date().toISOString().slice(0, 10); 

  constructor(
    private evaluationService: DoUserEvaluationService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId(); // Obtém o userId do AuthService
    this.loadQuestions();

    this.evaluationForm = this.fb.group({
      answers: this.fb.array([]),
      improvePoints: ['', Validators.required],
      pdi: ['', Validators.required],
      goals: ['', Validators.required],
      sixMonthAlignment: ['', Validators.required]
    });
  }

  loadQuestions(): void {
    this.evaluationService.getQuestions().subscribe(
      (response: any) => {
        this.questions = response.data;
        console.log(this.questions);
        this.answers = this.questions.map(question => ({
          questionId: question.questionId, // Use o questionId da resposta da API
          answerNumber: 0 // Resposta padrão inicial
        }));
      },
      error => {
        console.error('Erro ao carregar questões:', error);
      }
    );
  }

  submitEvaluation(): void {
    const evaluationData = {
      employeeId: this.userId,
      evaluatorId: this.userId,
      status: this.status,
      dateReference: this.dateReference,
      answers: this.answers, // Assumindo que answers ainda seja gerenciado separadamente
      improvePoints: this.evaluationForm.get('improvePoints')?.value,
      pdi: this.evaluationForm.get('pdi')?.value,
      goals: this.evaluationForm.get('goals')?.value,
      sixMonthAlignment: this.evaluationForm.get('sixMonthAlignment')?.value
    };

    this.evaluationService.submitEvaluation(evaluationData).subscribe(
      () => {
        console.log('Avaliação enviada com sucesso!', evaluationData);
      },
      error => {
        console.error('Erro ao enviar avaliação:', error);
      }
    );
  }

  updateAnswer(index: number, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
  
    // Ignora a atualização se o valor for vazio
    if (value === '') return;
  
    const answerNumber = Number(value);
  
    // Atualize a resposta no índice correspondente
    if (index > -1 && index < this.answers.length) {
      this.answers[index].answerNumber = answerNumber;
    }
  }
  

  // Função auxiliar para obter a resposta para uma questão
  getAnswerValue(questionId: number): number {
    return this.answers.find(a => a.questionId === questionId)?.answerNumber || 0;
  }
  

}