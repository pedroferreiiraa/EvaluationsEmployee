import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table'; // Importe o MatTableModule
import { HomeDepartmentService } from '../home/services/home-departments/department.service';
import { DepartmentService } from './services/department.service';
import { MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../login/services/auth.service';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatDialogModule],
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.scss'
})

export class DepartmentDetailComponent implements OnInit {
  departmentId: number | null = null;
  departmentName: string = '';
  leaderId: number | null = null;
  managerId: number | null = null;
  users: any[] = [];
  displayedColumns: string[] = ['fullName', 'role', 'typeMo', 'codFuncionario', 'actions'];
  isLeader: boolean = false;
  isRh: boolean = false;
  leaderUserId: number | null = null;



  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private departmentService: DepartmentService,
    private homeDepartmentService: HomeDepartmentService,
    private authService: AuthService // Inject AuthService
    
  ) {}

  ngOnInit(): void {
    this.departmentId = Number(this.route.snapshot.paramMap.get('id'));
    this.isLeader = this.authService.getRole() === 'Lider';
    this.isRh = this.authService.getRole() === 'RH';
    this.leaderUserId = this.authService.getUserId(); // Obtém o userId do líder logado

    if (this.departmentId) {
      this.fetchDepartmentDetails(this.departmentId);
    }
  }

  fetchDepartmentDetails(departmentId: number): void {
    this.homeDepartmentService.getDepartmentDetails(departmentId).subscribe(
      (response: any) => {
        const departmentData = response.data;
  
        // Filtra usuários não deletados
        const filteredUsers = departmentData.users.filter((user: any) => !user.isDeleted);
  
        this.departmentName = departmentData.name;
        this.leaderId = departmentData.liderId;
        this.managerId = departmentData.gestorId;
  
        // Mapeia apenas os usuários não deletados
        this.users = filteredUsers.map((user: { evaluationDate: any; }) => ({
          ...user,
          isEvaluated: !!user.evaluationDate, // Suponha que evaluationDate indica se já foi avaliado
          evaluationDate: user.evaluationDate || null
        }));
      },
      (error: any) => {
        console.error('Erro ao buscar detalhes do departamento:', error);
      }
    );
  }

  
  goToUserEvaluation(employeeId: number): void {
    console.log('Redirecionando para avaliação:', { evaluatorId: this.leaderUserId, employeeId });
  
    // Redireciona para o componente de avaliação com evaluatorId e employeeId
    this.router.navigate(['/do-user-evaluation'], { 
      queryParams: { evaluatorId: this.leaderUserId, employeeId }
    });
  }

  evaluateUser(userId: number): void {
    const evaluation = {
      employeeId: userId,
      evaluatorId: this.leaderUserId,
      status: 'pending',
      dateReference: new Date(),
      answers: []
    };

    this.departmentService.createEvaluation(evaluation).subscribe(
      (response: any) => {
        console.log('Avaliação enviada:', response);
        // Atualize a lista ou exiba uma notificação de sucesso
      },
      (error: any) => {
        console.error('Erro ao enviar avaliação:', error);
      }
    );
  }


  

  editUser(userId: number): void {
    this.router.navigate(['/edit-user', userId]);
  }

  rollbackPage(): void {
    this.router.navigate(['/home']);
  }

  // Função para excluir o usuário
  deleteUser(userId: number): void {
    this.departmentService.deleteUser(userId).subscribe(
      () => {
        // Atualiza a lista de usuários após a exclusão
        this.users = this.users.filter(user => user.id !== userId);
      },
      (error: any) => {
        console.error('Erro ao excluir o usuário:', error.message || error);
      }
    );
  }


  
}
