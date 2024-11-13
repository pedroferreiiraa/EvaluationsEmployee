import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EditDepartmentService } from './service/edit-department.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-department',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-department.component.html',
  styleUrl: './edit-department.component.scss'
})
export class EditDepartmentComponent implements OnInit {

  departmentId: number | null = null;
  departmentData = {
    liderId: 0,
    gestorId: 0
  };

  availableLeaders: { id: number; fullName: string }[] = [];
  availableManagers: { id: number; fullName: string }[] = [];


  constructor(
    private editDepartmentService: EditDepartmentService,
    private route: ActivatedRoute,
    private router: Router

  ) {}

  ngOnInit(): void {
    this.departmentId = +this.route.snapshot.paramMap.get('id')!;
    this.fetchDepartmentData();
    this.fetchAvailableUsers();
  }

  fetchDepartmentData(): void {
    if (this.departmentId !== null) {
      this.editDepartmentService.getDepartmentById(this.departmentId).subscribe(
        (response: any) => {
          this.departmentData.liderId = response.data.liderId;
          this.departmentData.gestorId = response.data.gestorId;
        },
        (error) => {
          console.error('Erro ao buscar dados do departamento:', error);
        }
      );
    }
  }

  updateDepartment(): void {
    if (this.departmentId !== null) {
      this.editDepartmentService.updateDepartment(this.departmentId, this.departmentData).subscribe(
        () => {
          console.log('Departamento atualizado com sucesso!');
          this.router.navigate(['/home'])
        },
        (error) => {
          console.error('Erro ao atualizar departamento:', error);
        }
      );
    }
  }

  fetchAvailableUsers(): void {
    this.editDepartmentService.getAllUsers().subscribe(
      (response: any) => {
        const users = response.data.filter((user: any) => !user.isDeleted);
        this.availableLeaders = users
          .filter((user: any) => user.role === 'Lider')
          .map((user: any) => ({ id: user.id, fullName: user.fullName }));
        this.availableManagers = users
          .filter((user: any) => user.role === 'Gestor')
          .map((user: any) => ({ id: user.id, fullName: user.fullName }));
      },
      (error) => {
        console.error('Erro ao buscar usuários disponíveis:', error);
      }
    );
  }

  rollbackPage(): void {
    this.router.navigate(['/home']);
  }

}
