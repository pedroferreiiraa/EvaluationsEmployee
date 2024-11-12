import { Component, OnInit } from '@angular/core';
import { AuthService } from '../login/services/auth.service';
import { HomeDepartmentService } from './services/home-departments/department.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { UserService } from './services/user/user.service';
import { UserDetails } from './interfaces/user.interface';
import { Evaluation } from './interfaces/evaluation.interface';
import { Department } from './interfaces/department.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  userRole: string | null = null;
  allDepartments: Department[] = [];
  completedEvaluationsCount: number = 0;
  userDetails: { fullName?: string } = {}; // Inicialize userDetails como um objeto vazio


  constructor(
    private authService: AuthService,
    private userService: UserService,
    private departmentService: HomeDepartmentService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userRole = this.authService.getRole();
    this.fetchDepartments();
    const userId = this.authService.getUserId(); // Obtenha o userId do token
    if (userId) {
      this.fetchUserDetails(userId); // Passa o userId para buscar detalhes do usuário
    }
    if (this.userRole === 'RH') {
      this.fetchCompletedEvaluations();
    }
  }

  fetchDepartments(): void {
    this.departmentService.getDepartments().subscribe(
      (response: { data: Department[] }) => {
        this.allDepartments = response.data;
      },
      (error: any) => {
        console.error('Erro ao buscar departamentos:', error);
      }
    );
  }

  getUserId(): number {
    // Suponha que o userId esteja salvo no token ou no localStorage
    const userId = localStorage.getItem('nameIdentifier'); // Exemplo, ajuste conforme necessário
    return userId ? +userId : 0;
  }

  fetchUserDetails(userId: number): void {
    this.userService.getUsersDetails(userId).subscribe(
      (response: UserDetails) => {
        this.userDetails = response;
        console.log(response)
      },
      (error: any) => {
        console.error('Erro ao buscar detalhes do usuário:', error);
      }
    );
  }

  fetchCompletedEvaluations(): void {
    this.http.get<[Evaluation]>('http://localhost:5001/api/userAvaliations').subscribe(
      (evaluations) => {
        this.completedEvaluationsCount = evaluations.filter(evaluation => evaluation.status === 4).length;
      },
      (error) => {
        console.error('Erro ao buscar avaliações:', error);
      }
    );
  }

  goToDepartment(departmentId: number): void {
    this.router.navigate(['/departments', departmentId]);
  }

  goToEvaluations(): void {
    this.router.navigate(['/avaliacoes'])
  }

  hasRole(role: string): boolean {
    return this.userRole === role;
  }

}