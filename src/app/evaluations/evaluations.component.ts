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
  
        // Filtra os usuários deletados, diferencia os líderes e ordena
        this.departments.forEach(department => {
          department.users = department.users
            .filter((user: any) => !user.isDeleted) // Exclui usuários deletados
            .map((user: any) => {
              user.isLeader = user.role === 'Lider'; // Adiciona flag para líderes
              return user;
            })
            .sort((a: any, b: any) => a.fullName.localeCompare(b.fullName)); // Ordena por nome
  
          // Inicializa o mapeamento de avaliações para os usuários restantes
          department.users.forEach((user: any) => {
            if (!this.evaluationsByUser[user.id]) {
              this.evaluationsByUser[user.id] = [];
            }
          });
  
          console.log(`Departamento ${department.id} (${department.name}):`, department.users); // Log dos usuários processados
        });
  
        // Busca as avaliações
        this.fetchEvaluations();
      },
      (error: any) => {
        console.error('Erro ao buscar departamentos:', error);
      }
    );
  }
  
  fetchEvaluations(): void {
    // Busca avaliações de usuários
    this.evaluationService.getUserEvaluations().subscribe(
      (userEvaluations: any[]) => {
        console.log('Avaliações de usuários recebidas:', userEvaluations);
        this.mapEvaluationsToUsers(userEvaluations);
  
        // Após buscar as avaliações de usuários, busca as avaliações dos líderes
        this.evaluationService.getLeaderEvaluations().subscribe(
          (leaderEvaluations: any[]) => {
            console.log('Avaliações de líderes recebidas:', leaderEvaluations);
            this.mapEvaluationsToUsers(leaderEvaluations);
  
            // Log consolidado das avaliações
            console.log('Avaliações por usuário:', this.evaluationsByUser);
          },
          (error: any) => {
            console.error('Erro ao buscar avaliações de líderes:', error);
          }
        );
      },
      (error: any) => {
        console.error('Erro ao buscar avaliações de usuários:', error);
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

  goToLeaderEvaluationDetails(userId: number): void {
    this.router.navigate([`/leader-details/${userId}`])
  }

  hasEvaluationsInDepartment(department: any): boolean {
    const hasEvaluations = department.users.some((user: any) => {
      const evaluations = this.evaluationsByUser[user.id] || [];
      console.log(`Usuário ${user.id} - Avaliações:`, evaluations);
      return evaluations.length > 0;
    });
  
    console.log(`Departamento ${department.id} tem avaliações?`, hasEvaluations);
    return hasEvaluations;
  }
  
  private mapEvaluationsToUsers(evaluations: any[]): void {
    evaluations.forEach(evaluation => {
      console.log('Avaliação recebida:', evaluation); // Log para depuração
      const userId = evaluation.employeeId || evaluation.leaderId; // Verificar qual ID deve ser usado
  
      if (!this.evaluationsByUser[userId]) {
        this.evaluationsByUser[userId] = [];
      }
  
      this.evaluationsByUser[userId].push(evaluation);
    });
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