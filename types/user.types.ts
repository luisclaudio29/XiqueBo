export type UserType = 'cliente' | 'motorista' | 'ambos';
export type Gender = 'masculino' | 'feminino' | 'outro' | 'prefiro-nao-informar';

export interface UserAddress {
  street: string;
  neighborhood: string;
  city: string;
  povoado?: string; // Povoado de Xique-Xique (opcional)
  state: string;
  zipCode: string;
  complement?: string;
  reference?: string; // Ponto de referência
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  
  // Informações pessoais
  age?: number;
  birthDate?: string;
  gender?: Gender;
  cpf?: string;
  
  // Endereço
  address?: UserAddress;
  
  // Tipo de usuário
  userType: UserType;
  hasClienteRegistration: boolean;
  hasMotoristaRegistration: boolean;
  
  // Dados de motorista (se aplicável)
  driverData?: {
    vehicleType: 'carro' | 'moto' | 'bicicleta';
    vehiclePlate?: string;
    vehicleModel?: string;
    vehicleColor?: string;
    cnh?: string;
    cnhExpiry?: string;
  };
  
  // Estatísticas
  stats?: {
    totalRides: number;
    rating: number;
    totalSpent?: number;
    totalEarned?: number;
  };
  
  // Preferências
  preferences?: {
    favoriteAddresses?: Array<{
      name: string;
      address: string;
    }>;
    emergencyContact?: {
      name: string;
      phone: string;
    };
  };
  
  // Metadata
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  name: string;
  email: string;
  phone: string;
  password: string;
  userType: 'cliente' | 'motorista';
  
  // Dados adicionais
  age?: number;
  birthDate?: string;
  gender?: Gender;
  address?: UserAddress;
}


