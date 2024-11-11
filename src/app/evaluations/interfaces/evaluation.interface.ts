export interface Evaluation {
    evaluationId: number;
    employeeId: number;
    evaluatorId: number;
    dateReference: string;
    status: number; // Considerando que 4 representa avaliação completa
    completedAt: string;
    questions?: any[];
    answers: Answer[];
  }
  
  // Interface para Respostas da Avaliação
  export interface Answer {
    answerId: number;
    questionId: number;
    answerNumber: number;
  }