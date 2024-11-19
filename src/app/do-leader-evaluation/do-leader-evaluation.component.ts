import { CommonModule } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../login/services/auth.service';
import { DoLeaderEvaluationService } from './services/do-leader-evaluation.service';

@Component({
  selector: 'app-do-leader-evaluation',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './do-leader-evaluation.component.html',
  styleUrl: './do-leader-evaluation.component.scss'
})
export class DoLeaderEvaluationComponent implements OnInit{
  evaluationForm: FormGroup | any;

  questions: any[] = [];
  answers: { questionId: number; answerNumber: number }[] = [];
  userId: number = 0;
  status: number = 0;
  dateReference: string = '';
  evaluatorId: number | null = null;
  employeeId: number | null = null;

  constructor(
    private evaluationService: DoLeaderEvaluationService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private http: Router
  ) {}


  ngOnInit(): void {
    this.userId = this.authService.getUserId();
  
    this.route.queryParams.subscribe(params => {
      this.evaluatorId = +params['evaluatorId'] || null;
      this.employeeId = +params['employeeId'] || null;
      
      console.log('Parâmetros recebidos:', { evaluatorId: this.evaluatorId, employeeId: this.employeeId });
    });

    // Inicialize o evaluationForm primeiro
    this.evaluationForm = this.fb.group({
      improvePoints: ['', Validators.required],
      pdi: ['', Validators.required],
      goals: ['', Validators.required],
      sixMonthAlignment: ['', Validators.required],
      date: ['', Validators.required],
      planoAndamento: ['', Validators.required],
      justificativaPlano: ['', Validators.required],
      metasAndamento: ['', Validators.required],
      justificativaMetas: ['', Validators.required],
      resultadosSemestre: ['', Validators.required],
      consideracoesAnalise: ['', Validators.required],
      answers: this.fb.array([], Validators.required)
    });
    
  
    // Agora você pode se inscrever em valueChanges
    this.evaluationForm.valueChanges.subscribe(() => {
      this.updateSixMonthAlignment();
    });
  
    this.loadQuestions();
  
    // Calcula a data de hoje e a data de seis meses a partir de hoje
    const today = new Date();
    const sixMonthsFromToday = new Date();
    sixMonthsFromToday.setMonth(sixMonthsFromToday.getMonth() + 6);
  
    this.dateReference = `${this.formatDate(today)} até ${this.formatDate(sixMonthsFromToday)}`;
  }

  private formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0'); // Dia com dois dígitos
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Mês com dois dígitos
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  loadQuestions(): void {
    this.evaluationService.getQuestions().subscribe(
      (response: any) => {
        this.questions = response.data;

        const answersFormArray = this.evaluationForm.get('answers') as FormArray;
        answersFormArray.clear();

        this.questions.forEach(() => {
          answersFormArray.push(this.fb.control('', Validators.required));
        });
      },
      error => {
        console.error('Erro ao carregar questões:', error)
      }
    );
  }

  submitEvaluation(): void {
    if (this.evaluationForm.invalid) {
      this.evaluationForm.markAllAsTouched();
      return;
    }

    const employeeId = this.employeeId ?? this.userId;
    const evaluatorId = this.evaluatorId ?? this.userId;

    if(employeeId === null || evaluatorId === null) {
      console.error('EmployeeID ou EvaluatorID estão indefinidos');
      return;
    }

    const answersFormArray = this.evaluationForm.get('answers') as FormArray;
    const answers = this.questions.map((question, index) => ({
      questionId: question.questionId,
      answerNumber: answersFormArray.at(index).value
    }));
  
    const evaluationData = {
      employeeId: employeeId,
      evaluatorId: evaluatorId,
      status: this.status,
      dateReference: this.dateReference,
      answers: answers,
      improvePoints: this.evaluationForm.get('improvePoints').value,
      pdi: this.evaluationForm.get('pdi').value,
      goals: this.evaluationForm.get('goals').value,
      sixMonthAlignment: this.evaluationForm.get('sixMonthAlignment').value
    };

    this.evaluationService.submitEvaluation(evaluationData).subscribe(
      (response: any) => {
        console.log('Avaliação enviada com sucesso!', response);
        const evaluationId = response.data;

        if (evaluationId) {
          this.completeEvaluation(evaluationId);
          this.http.navigate(['/home']);
        } else {
          console.error('ID Da avaliação não encontrada na resposta do backend');
        }
      },
      error => {
        console.error('Erro ao enviar avaliação', error);
      }
    );
  }

  completeEvaluation(evaluationId: number): void {
    this.evaluationService.completeEvaluation(evaluationId).subscribe (
      () => {
        console.log('Avaliação marcada como completa!');
      },
      error => {
        console.error('Erro ao marcar avaliação como completa', error);
      }
    );
  }

  updateAnswer(index: number, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
  
    if (value === '') return;
  
    const answerNumber = Number(value);
  
    if (index > -1 && index < this.answers.length) {
      this.answers[index].answerNumber = answerNumber;
    } else {
      console.error('Índice de resposta inválido:', index);
    }
  }
  updateSixMonthAlignment() {
    const alignmentData = this.evaluationForm.value;
  
    const sixMonthAlignmentValue = `
  ALINHAMENTO SEMESTRAL (Considerações)
  
  Data: ${this.formatDateString(alignmentData.date)}
  
  Plano de melhoria traçado está em andamento? ${alignmentData.planoAndamento}
  Justificativa:
  ${alignmentData.justificativaPlano}
  
  Metas estabelecidas estão em andamento? ${alignmentData.metasAndamento}
  Justifique:
  ${alignmentData.justificativaMetas}
  
  Resultados do Semestre considerados: ${alignmentData.resultadosSemestre}
  
  Considerações sobre a análise e alinhamentos:
  ${alignmentData.consideracoesAnalise}
    `;
  
    this.evaluationForm.get('sixMonthAlignment').setValue(sixMonthAlignmentValue, { emitEvent: false });
  }

  private formatDateString(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

}
