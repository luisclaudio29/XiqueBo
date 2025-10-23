import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserData, LoginCredentials, SignUpData } from '@/types/user.types';

const USERS_STORAGE_KEY = '@xiquego:users';
const CURRENT_USER_KEY = '@xiquego:currentUser';

class AuthService {
  async signUp(data: SignUpData): Promise<UserData> {
    try {
      const users = await this.getAllUsers();
      
      const emailExists = users.some(user => user.email === data.email);
      if (emailExists) {
        throw new Error('Email já cadastrado');
      }
      
      const newUser: UserData = {
        id: Date.now().toString(),
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        age: data.age,
        birthDate: data.birthDate,
        gender: data.gender,
        address: data.address,
        userType: data.userType,
        hasClienteRegistration: data.userType === 'cliente',
        hasMotoristaRegistration: data.userType === 'motorista',
        stats: {
          totalRides: 0,
          rating: 5.0,
          totalSpent: 0,
          totalEarned: 0,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      users.push(newUser);
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      await this.setCurrentUser(newUser);
      
      return newUser;
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      throw error;
    }
  }
  
  async login(credentials: LoginCredentials): Promise<UserData> {
    try {
      const users = await this.getAllUsers();
      
      const user = users.find(
        u => u.email === credentials.email && u.password === credentials.password
      );
      
      if (!user) {
        throw new Error('Email ou senha incorretos');
      }
      
      await this.setCurrentUser(user);
      return user;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  }
  
  async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  }
  
  async getCurrentUser(): Promise<UserData | null> {
    try {
      const userData = await AsyncStorage.getItem(CURRENT_USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Erro ao buscar usuário atual:', error);
      return null;
    }
  }
  
  async updateCurrentUser(updates: Partial<UserData>): Promise<UserData> {
    try {
      const currentUser = await this.getCurrentUser();
      if (!currentUser) {
        throw new Error('Nenhum usuário logado');
      }
      
      const updatedUser: UserData = {
        ...currentUser,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      
      await this.setCurrentUser(updatedUser);
      
      const users = await this.getAllUsers();
      const userIndex = users.findIndex(u => u.id === updatedUser.id);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      }
      
      return updatedUser;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  }
  
  private async getAllUsers(): Promise<UserData[]> {
    try {
      const usersData = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      return usersData ? JSON.parse(usersData) : [];
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      return [];
    }
  }
  
  private async setCurrentUser(user: UserData): Promise<void> {
    try {
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Erro ao salvar usuário atual:', error);
      throw error;
    }
  }
  
  async isLoggedIn(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user !== null;
  }
  
  async updatePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      const currentUser = await this.getCurrentUser();
      if (!currentUser) {
        throw new Error('Nenhum usuário logado');
      }
      
      if (currentUser.password !== currentPassword) {
        throw new Error('Senha atual incorreta');
      }
      
      await this.updateCurrentUser({ password: newPassword });
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      throw error;
    }
  }
}

export default new AuthService();


