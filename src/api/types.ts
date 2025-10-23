/**
 * Types for 4Devs API integration
 */

// Brazilian UF type
export type BrazilianUF = 'AC' | 'AL' | 'AP' | 'AM' | 'BA' | 'CE' | 'DF' | 'ES' | 'GO' | 'MA' | 'MS' | 'MT' | 'MG' | 'PA' | 'PB' | 'PR' | 'PE' | 'PI' | 'RJ' | 'RN' | 'RS' | 'RO' | 'RR' | 'SC' | 'SP' | 'SE' | 'TO';

// UF data structure
export interface UFData {
  code: BrazilianUF;
  name: string;
}

// API Request types
export interface GeradorPessoaRequest {
  acao: 'gerar_pessoa';
  sexo: 'H' | 'M' | 'I';
  pontuacao?: 'S' | 'N';
  idade?: number;
  cep_estado?: BrazilianUF;
  txt_qtde: number;
  cep_cidade?: number;
}

export interface CarregarCidadesRequest {
  acao: 'carregar_cidades';
  cep_estado: BrazilianUF;
}

export interface GeradorCertidaoRequest {
  acao: 'gerador_certidao';
  pontuacao?: 'S' | 'N';
  tipo_certidao?: 'nascimento' | 'casamento' | 'casamento_religioso' | 'obito' | 'Indiferente';
}

export interface GeradorCNHRequest {
  acao: 'gerar_cnh';
}

export interface GeradorPISRequest {
  acao: 'gerar_pis';
  pontuacao?: 'S' | 'N';
}

export interface GeradorTituloEleitorRequest {
  acao: 'gerar_titulo_eleitor';
  estado?: BrazilianUF;
}

// API Response types
export interface Pessoa {
  nome: string;
  idade: number;
  cpf: string;
  rg: string;
  data_nasc: string;
  sexo: string;
  signo: string;
  mae: string;
  pai: string;
  email: string;
  senha: string;
  cep: string;
  endereco: string;
  numero: number;
  bairro: string;
  cidade: string;
  estado: string;
  telefone_fixo: string;
  celular: string;
  altura: string;
  peso: number;
  tipo_sanguineo: string;
  cor: string;
}

export type GeradorPessoaResponse = Pessoa[];
export type CarregarCidadesResponse = string; // HTML string
export type GeradorCertidaoResponse = string;
export type GeradorCNHResponse = string;
export type GeradorPISResponse = string;
export type GeradorTituloEleitorResponse = string;

// Union types for all requests and responses
export type APIRequest = 
  | GeradorPessoaRequest 
  | CarregarCidadesRequest 
  | GeradorCertidaoRequest 
  | GeradorCNHRequest 
  | GeradorPISRequest 
  | GeradorTituloEleitorRequest;

export type APIResponse = 
  | GeradorPessoaResponse 
  | CarregarCidadesResponse 
  | GeradorCertidaoResponse 
  | GeradorCNHResponse 
  | GeradorPISResponse 
  | GeradorTituloEleitorResponse;