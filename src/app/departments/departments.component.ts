import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table'; // Importe o MatTableModule
import { HomeDepartmentService } from '../home/services/home-departments/department.service';
import { DepartmentService } from './services/department.service';
import { MatDialogModule } from '@angular/material/dialog';

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


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private departmentService: DepartmentService,
    private homeDepartmentService: HomeDepartmentService
    
  ) {}

  ngOnInit(): void {
    // Obtém o ID do departamento da rota
    this.departmentId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.departmentId) {
      this.fetchDepartmentDetails(this.departmentId);
    }
  }

  fetchDepartmentDetails(departmentId: number): void {
    this.homeDepartmentService.getDepartmentDetails(departmentId).subscribe(
      (response: any) => {
        const departmentData = response.data;
        this.departmentName = departmentData.name;
        this.leaderId = departmentData.liderId;
        this.managerId = departmentData.gestorId;
        this.users = departmentData.users;
      },
      (error: any) => {
        console.error('Erro ao buscar detalhes do departamento:', error);
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
