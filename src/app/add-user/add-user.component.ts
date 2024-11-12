import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AddUserService } from './services/add-user.service';
import { HomeDepartmentService } from '../home/services/home-departments/department.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserComponent implements OnInit {
  user = {
    fullName: '',
    password: '',
    email: '',
    role: '',
    departmentId: 0,
    codFuncionario: 0,
    typeMO: ''
  };

  departments: { id: number; name: string }[] = [];

  constructor(
    private addUserService: AddUserService,
    private homeDepartmentService: HomeDepartmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
   this.fetchDepartments();
  }

  addUser() {
    this.addUserService.postUser(this.user).subscribe(() => {
      console.log('User added successfully');
      // Opcional: adicionar lógica para limpar o formulário ou exibir uma mensagem de sucesso.
      this.router.navigate(['/home'])
    }, error => {
      console.error('Error adding user', error);
    });
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
}