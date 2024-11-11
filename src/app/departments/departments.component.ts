import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DepartmentService } from '../home/services/departments/department.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table'; // Importe o MatTableModule
@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.scss'
})

export class DepartmentDetailComponent implements OnInit {
  departmentId: number | null = null;
  departmentName: string = '';
  leaderId: number | null = null;
  managerId: number | null = null;
  users: any[] = [];
  displayedColumns: string[] = ['fullName', 'role', 'typeMo', 'codFuncionario'];

  constructor(
    private route: ActivatedRoute,
    private departmentService: DepartmentService
  ) {}

  ngOnInit(): void {
    // Obtém o ID do departamento da rota
    this.departmentId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.departmentId) {
      this.fetchDepartmentDetails(this.departmentId);
    }
  }

  fetchDepartmentDetails(departmentId: number): void {
    this.departmentService.getDepartmentDetails(departmentId).subscribe(
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
}
