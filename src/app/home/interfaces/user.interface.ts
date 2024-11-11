import { Department } from "./department.interface";
import { Evaluation } from "./evaluation.interface";

export interface User {
    id: number;
    fullName: string;
    email: string;
    role: string; // Exemplo: "Colaborador", "RH", etc.
    typeMo?: string; // Opcional, caso seja um campo específico da função
    codFuncionario?: number; // Código do funcionário
    departmentId: number;
    isDeleted: boolean;
  }
  
  export interface UserDetails {
    id: number;
    fullName: string;
    email: string;
    role: string;
    department: Department;
    evaluations: Evaluation[];
  }