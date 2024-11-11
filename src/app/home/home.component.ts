import { Component, OnInit } from '@angular/core';
import { AuthService } from '../login/services/auth.service';
import { CommonModule } from '@angular/common';
import { DepartmentService } from './services/departments/department.service';
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
  departmentUsers: any;
  allDepartments: { id: number, name: string }[] = [];

  constructor(
    private authService: AuthService,
    private departmentService: DepartmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userRole = this.authService.getRole();
    this.fetchDepartments();
  }

  shouldShowItemForRole(requiredRole: string): boolean {
    return this.userRole === requiredRole;
  }

  fetchDepartments(): void {
    this.departmentService.getDepartments().subscribe(
      (response: any) => {
        this.allDepartments = response.data.map((department: any) => ({
          id: department.id,
          name: department.name
        }));
      },
      (error: any) => {
        console.error('Erro ao buscar departamentos:', error);
      }
    );
  }

  goToDepartment(departmentId: number): void {
    this.router.navigate(['/departments', departmentId]);
  }
}
