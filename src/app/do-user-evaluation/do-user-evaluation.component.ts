import { Component, OnInit } from '@angular/core';
import { DoUserEvaluationService } from './services/do-user-evaluation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from '../login/services/auth.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-do-user-evaluation',
  standalone: true,
  templateUrl: './do-user-evaluation.component.html',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  styleUrls: ['./do-user-evaluation.component.scss']
})
export class DoUserEvaluationComponent implements OnInit {
  evaluationForm: FormGroup | any;

  questions: any[] = [];
  answers: { questionId: number; answerNumber: number }[] = [];
  userId: number = 0;
  status: number = 0;
  dateReference: string = '';

  constructor(
    private evaluationService: DoUserEvaluationService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private http: Router
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
  
    // Inicialize o evaluationForm primeiro
    this.evaluationForm = this.fb.group({
      answers: this.fb.array([]),
      improvePoints: ['', Validators.required],
      pdi: ['', Validators.required],
      goals: ['', Validators.required],
      sixMonthAlignment: [''],
      date: [''],
      planoAndamento: [''],
      justificativaPlano: [''],
      metasAndamento: [''],
      justificativaMetas: [''],
      resultadosSemestre: [''],
      consideracoesAnalise: ['']
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
  

  // Função para formatar a data no formato dd/mm/yyyy
  private formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0'); // Dia com dois dígitos
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Mês com dois dígitos
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Função para criar uma meta
  createMeta(): FormGroup {
    return this.fb.group({
      descricao: [''],
      prazo: [''],
      status: ['']
    });
  }

  // Função para adicionar uma nova meta
  adicionarMeta() {
    this.metas.push(this.createMeta());
  }

  // Getter para o FormArray de metas
  get metas(): FormArray {
    return this.evaluationForm.get('goals.metas') as FormArray;
  }

  loadQuestions(): void {
    this.evaluationService.getQuestions().subscribe(
      (response: any) => {
        this.questions = response.data;
        this.answers = this.questions.map(question => ({
          questionId: question.questionId,
          answerNumber: 0
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
      answers: this.answers,
      improvePoints: this.evaluationForm.get('improvePoints')?.value,
      pdi: this.evaluationForm.get('pdi')?.value,
      goals: this.evaluationForm.get('goals')?.value,
      sixMonthAlignment: this.evaluationForm.get('sixMonthAlignment')?.value
    };
  
    this.evaluationService.submitEvaluation(evaluationData).subscribe(
      (response: any) => {
        console.log('Avaliação enviada com sucesso!', response);
  
        // Ajuste aqui para extrair o ID corretamente
        const evaluationId = response.data; // Se o ID está em response.data
  
        // Verifique se evaluationId é válido
        if (evaluationId) {
          this.completeEvaluation(evaluationId);
          this.http.navigate(['/home'])
        } else {
          console.error('ID da avaliação não encontrado na resposta do backend.');
        }
      },
      error => {
        console.error('Erro ao enviar avaliação:', error);
      }
    );
  }
  
  
  completeEvaluation(evaluationId: number): void {
    this.evaluationService.completeEvaluation(evaluationId).subscribe(
      () => {
        console.log('Avaliação marcada como completa!');
      },
      error => {
        console.error('Erro ao marcar avaliação como completa:', error);
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
    }
  }

  private formatDateString(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
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
  
  
}
