// Agregamos el tipo Documento
export interface Documento {
  id: string;
  nombre_archivo: string;
  tipo: 'pdf' | 'word' | 'excel' | 'img' | 'otro';
  fecha_carga: string;
}

export type TipoEvento = 'Audiencia' | 'Vencimiento' | 'Trámite' | 'Otro';

export interface Evento {
  id: string;
  titulo: string;
  fecha: string; // Viene como ISO string del backend
  tipo: TipoEvento;
  descripcion?: string;
}

export type CausaEstado = 
  | 'Inicio' 
  | 'Etapa Probatoria' 
  | 'Alegatos' 
  | 'Sentencia' 
  | 'Apelación' 
  | 'Archivada';

export interface Causa {
  id: string;
  caratula: string;
  nro_expediente: string;
  juzgado: string;
  fuero: string;
  estado: CausaEstado;
  observaciones?: string;
  telefono_cliente?: string;
  ultima_revision: string;
  updatedAt: string;
  // Agregamos la lista de documentos acá:
  documentos: Documento[]; 
  eventos: Evento[];
}