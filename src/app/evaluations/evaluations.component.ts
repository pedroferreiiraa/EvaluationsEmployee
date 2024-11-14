import { Component, OnInit } from '@angular/core';
import { EvaluationsService } from './services/evaluations.service';
import { HomeDepartmentService } from '../home/services/home-departments/department.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-evaluations',
  templateUrl: './evaluations.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./evaluations.component.scss']
})
export class EvaluationsComponent implements OnInit {
  departments: any[] = [];
  evaluationsByUser: { [userId: number]: any[] } = {}; // inicialização garantida
  expandedDepartments: Set<number> = new Set();
  expandedUsers: Set<number> = new Set();
  

  constructor(
    private evaluationService: EvaluationsService,
    private departmentService: HomeDepartmentService,
    private route: ActivatedRoute,  // Adicione o ActivatedRoute
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchDepartmentsAndUsers();

    
  }

  fetchDepartmentsAndUsers(): void {
    this.departmentService.getDepartments().subscribe(
      (response: any) => {
        this.departments = response.data;
        
        // Inicializar `evaluationsByUser` para todos os usuários para evitar `undefined`
        this.departments.forEach(department => {
          department.users.forEach((user: any) => {
            if (!this.evaluationsByUser[user.id]) {
              this.evaluationsByUser[user.id] = []; // inicialização com array vazio
            }
          });
        });

        this.fetchEvaluations();
      },
      (error: any) => {
        console.error('Erro ao buscar departamentos:', error);
      }
    );
  }

  fetchEvaluations(): void {
    this.evaluationService.getUserEvaluations().subscribe(
      (evaluations: any[]) => {
        evaluations.forEach(evaluation => {
          const userId = evaluation.employeeId;
          if (!this.evaluationsByUser[userId]) {
            this.evaluationsByUser[userId] = [];
          }
          this.evaluationsByUser[userId].push(evaluation);
        });
      },
      (error: any) => {
        console.error('Erro ao buscar avaliações:', error);
      }
    );
  }

  toggleDepartment(departmentId: number): void {
    if (this.expandedDepartments.has(departmentId)) {
      this.expandedDepartments.delete(departmentId);
    } else {
      this.expandedDepartments.add(departmentId);
    }
  }

  isExpanded(departmentId: number): boolean {
    return this.expandedDepartments.has(departmentId);
  }

  goToEvaluationDetails(evaluationId: number): void {
    this.router.navigate(['/evaluation-details', evaluationId]);
  }

  hasEvaluationsInDepartment(department: any): boolean {
    return department.users.some((user: any) => this.evaluationsByUser[user.id]?.length > 0);
  }

  rollbackPage(): void {
    this.router.navigate(['/home']);
  }

  toggleUserEvaluations(userId: number): void {
    if (this.expandedUsers.has(userId)) {
      this.expandedUsers.delete(userId);
    } else {
      this.expandedUsers.add(userId);
    }
  }

  isUserExpanded(userId: number): boolean {
    return this.expandedUsers.has(userId);
  }

  getCompletedEvaluationsCount(userId: number): number {
    return this.evaluationsByUser[userId]?.filter(evaluation => evaluation.status === 4).length || 0;
  }

}