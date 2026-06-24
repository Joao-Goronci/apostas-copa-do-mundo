export interface Usuario {
  id: string;
  nome: string;
  email: string;
  papel: 'usuario' | 'admin';
  pontuacaoTotal?: number;
}

export interface RespostaAutenticacao {
  mensagem: string;
  token: string;
  usuario: Usuario;
}
