import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EvaluationsService } from '../evaluations/services/evaluations.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent implements OnInit {
  userId: number | null = null;
  userEvaluations: any[] = [];
  leaderEvaluations: any[] = [];
  evaluation: { userEvaluations: any[]; leaderEvaluations: any[]; };

  constructor(
    private route: ActivatedRoute,
    private evaluationsService: EvaluationsService
  ) {}

  ngOnInit(): void {
    this.userId = +this.route.snapshot.paramMap.get('id')!;
    if (this.userId) {
      this.loadEvaluations();
    }
  }

  // loadEvaluations(): void {
  //   if (this.userId !== null) {
  //     this.evaluationsService.getUserEvaluationsById(this.userId).subscribe(
  //       ({ userEvaluations, leaderEvaluations }) => {
  //         this.userEvaluations = userEvaluations;
  //         this.leaderEvaluations = leaderEvaluations;
  //         console.log('User Evaluations:', this.userEvaluations);
  //         console.log('Leader Evaluations:', this.leaderEvaluations);
  //         console.log('User ID:', this.userId);

  //       },
  //       error => {
  //         console.error('Erro ao carregar avaliações do usuário:', error);
  //       }
  //     );
  //   } else {
  //     console.error('userId está indefinido.');
  //   }
  // }

  loadEvaluations(): void {
    if (this.userId !== null) {
      this.evaluationsService.getUserEvaluationsById(this.userId).subscribe(
        (evaluation) => {
          if (evaluation) {
            this.evaluation = evaluation; // Salva a avaliação única recebida
          }
        },
        error => {
          console.error('Erro ao carregar avaliação do usuário:', error);
        }
      );
    } else {
      console.log("userid está indefinido")
    }
    
}


}