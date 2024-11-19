import { Component, OnInit } from '@angular/core';
import { EvaluationsService } from './services/evaluations.service';
import { HomeDepartmentService } from '../home/services/home-departments/department.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../login/services/auth.service';

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
    private route: ActivatedRoute,  
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchDepartmentsAndUsers();

    const userId = this.authService.getUserId()
    
  }

  fetchDepartmentsAndUsers(): void {
    this.departmentService.getDepartments().subscribe(
      (response: any) => {
        console.log('Departamentos recebidos:', response); // Log dos dados recebidos
        this.departments = response.data;
  
        // Filtra os usuários deletados
        this.departments.forEach(department => {
          department.users = department.users.filter((user: any) => !user.isDeleted);
  
          console.log(`Departamento ${department.id} (${department.name}):`, department.users); // Log dos usuários filtrados
  
          // Inicializa `evaluationsByUser` para os usuários restantes
          department.users.forEach((user: any) => {
            if (!this.evaluationsByUser[user.id]) {
              this.evaluationsByUser[user.id] = [];
            }
          });
        });
  
        this.fetchEvaluations(); // Busca as avaliações após ajustar os departamentos
      },
      (error: any) => {
        console.error('Erro ao buscar departamentos:', error);
      }
    );
  }
  
  
  

  fetchEvaluations(): void {
    this.evaluationService.getUserEvaluations().subscribe(
      (evaluations: any[]) => {
        console.log('Avaliações recebidas:', evaluations); // Log das avaliações recebidas
  
        evaluations.forEach(evaluation => {
          const userId = evaluation.employeeId;
  
          if (!this.evaluationsByUser[userId]) {
            this.evaluationsByUser[userId] = [];
          }
  
          this.evaluationsByUser[userId].push(evaluation);
        });
  
        console.log('Avaliações por usuário:', this.evaluationsByUser); // Log do mapeamento das avaliações por usuário
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

  goToEvaluationDetails(userId: number): void {
    this.router.navigate([`/user-details/${userId}`] );
  }

  hasEvaluationsInDepartment(department: any): boolean {
    const hasEvaluations = department.users.some((user: any) => {
      const evaluations = this.evaluationsByUser[user.id] || [];
      console.log(`Usuário ${user.id} - Avaliações:`, evaluations); // Log das avaliações de cada usuário
      return evaluations.length > 0;
    });
  
    console.log(`Departamento ${department.id} tem avaliações?`, hasEvaluations); // Log do resultado
    return hasEvaluations;
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

  goToUserDetails(userId: number): void {
    this.router.navigate(['/user-details', userId]);
  }

}