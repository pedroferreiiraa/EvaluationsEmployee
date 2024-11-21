import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EditUserService } from './services/edit.user.service';
import { HomeDepartmentService } from '../home/services/home-departments/department.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  user = {
    id: 0,
    fullName: '',
    role: '',
    typeMo: '',
    departmentId: 0,
  };

  departments: { id: number; name: string }[] = [];

  constructor(
    private route: ActivatedRoute,
    private editUserService: EditUserService,
    private homeDepartmentService: HomeDepartmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = Number(this.route.snapshot.paramMap.get('id'));
    if (userId) {
      this.loadUser(userId);
    }
    
    this.fetchDepartments();
  }

  loadUser(userId: number): void {
    this.editUserService.getUserById(userId).subscribe(
      (data) => {
        this.user = data;
      },
      (error) => {
        console.error('Erro ao carregar dados do usuário:', error);
      }
    );
  }

  fetchDepartments(): void {
    this.homeDepartmentService.getDepartments().subscribe(
      (response: any) => {
        this.departments = response.data.map((dept: any) => ({ id: dept.id, name: dept.name }));
      },
      (error) => {
        console.error('Erro ao buscar departamentos:', error);
      }
    );
  }

  onSubmit(): void {
    this.editUserService.updateUser(this.user.id, this.user).subscribe(
      () => {
        console.log('Usuário atualizado com sucesso');
        // Redireciona para a página do departamento específico
        this.router.navigate(['/departments', this.user.departmentId]);
      },
      (error) => {
        console.error('Erro ao atualizar usuário:', error);
      }
    );
  }


  rollbackPage(): void {
    this.router.navigate(['/departments', this.user.departmentId]);
  }


}
