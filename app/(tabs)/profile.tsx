import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { useState, useEffect } from 'react';
import AuthService from '@/services/auth.service';
import { UserData, Gender } from '@/types/user.types';
import * as ImagePicker from 'expo-image-picker';

type UserType = 'cliente' | 'motorista';

type UserRegistrations = {
  hasClienteRegistration: boolean;
  hasMotoristaRegistration: boolean;
};

export default function ProfileScreen() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userType, setUserType] = useState<UserType>('cliente');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<Gender>('prefiro-nao-informar');
  const [street, setStreet] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  
  const [registrations, setRegistrations] = useState<UserRegistrations>({
    hasClienteRegistration: false,
    hasMotoristaRegistration: false,
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const user = await AuthService.getCurrentUser();
      
      if (!user) {
        Alert.alert('Erro', 'Você precisa fazer login primeiro', [
          { text: 'OK', onPress: () => router.replace('/login') },
        ]);
        return;
      }
      
      setUserData(user);
      setName(user.name);
      setPhone(user.phone);
      setEmail(user.email);
      setAge(user.age ? user.age.toString() : '');
      setGender(user.gender || 'prefiro-nao-informar');
      setStreet(user.address?.street || '');
      setNeighborhood(user.address?.neighborhood || '');
      
      setUserType(user.hasMotoristaRegistration ? 'motorista' : 'cliente');
      setRegistrations({
        hasClienteRegistration: user.hasClienteRegistration,
        hasMotoristaRegistration: user.hasMotoristaRegistration,
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Não foi possível carregar seus dados');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await AuthService.updateCurrentUser({
        name,
        phone,
        email,
        age: age ? parseInt(age) : undefined,
        gender,
        address: street || neighborhood ? {
          street,
          neighborhood,
          city: 'Xique-Xique',
          state: 'BA',
          zipCode: '',
        } : undefined,
      });
      
      setIsEditing(false);
      Alert.alert('✅ Sucesso', 'Perfil atualizado com sucesso!');
      loadUserData();
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível salvar');
    }
  };

  const handleChoosePhoto = async () => {
    Alert.alert(
      '📸 Foto de Perfil',
      'Escolha uma opção:',
      [
        {
          text: 'Câmera',
          onPress: async () => {
            const permission = await ImagePicker.requestCameraPermissionsAsync();
            if (!permission.granted) {
              Alert.alert('Permissão negada', 'Precisamos de acesso à câmera');
              return;
            }
            
            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            });
            
            if (!result.canceled) {
              setProfileImage(result.assets[0].uri);
              Alert.alert('✅ Sucesso', 'Foto atualizada com sucesso!');
            }
          },
        },
        {
          text: 'Galeria',
          onPress: async () => {
            const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permission.granted) {
              Alert.alert('Permissão negada', 'Precisamos de acesso à galeria');
              return;
            }
            
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            });
            
            if (!result.canceled) {
              setProfileImage(result.assets[0].uri);
              Alert.alert('✅ Sucesso', 'Foto atualizada com sucesso!');
            }
          },
        },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  const handleLogout = async () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          onPress: async () => {
            await AuthService.logout();
            router.replace('/login');
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Carregando seus dados...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.avatarContainer} onPress={handleChoosePhoto}>
          <View style={styles.avatarCircle}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
            )}
          </View>
          <View style={styles.cameraButton}>
            <Text style={styles.cameraIcon}>📷</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.headerGreeting}>Olá, {name.split(' ')[0]}!</Text>
        <Text style={styles.headerSubtext}>Gerencie seu perfil</Text>
      </View>

      {/* User Type Selector - Only if has both registrations */}
      {registrations.hasClienteRegistration && registrations.hasMotoristaRegistration && (
        <View style={styles.userTypeSelectorContainer}>
          <Text style={styles.sectionTitle}>Você está como:</Text>
          <View style={styles.userTypeSelector}>
            <TouchableOpacity
              style={[
                styles.userTypeButton,
                userType === 'cliente' && styles.userTypeButtonActive,
              ]}
              onPress={() => setUserType('cliente')}
            >
              <Text
                style={[
                  styles.userTypeText,
                  userType === 'cliente' && styles.userTypeTextActive,
                ]}
              >
                👤 Cliente
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.userTypeButton,
                userType === 'motorista' && styles.userTypeButtonActive,
              ]}
              onPress={() => setUserType('motorista')}
            >
              <Text
                style={[
                  styles.userTypeText,
                  userType === 'motorista' && styles.userTypeTextActive,
                ]}
              >
                🛵 Motorista
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ScrollView style={styles.scrollView}>
        {/* Stats Section */}
        {userData?.stats && (
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{userData.stats.totalRides}</Text>
              <Text style={styles.statLabel}>Corridas</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{userData.stats.rating.toFixed(1)} ⭐</Text>
              <Text style={styles.statLabel}>Avaliação</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {userType === 'motorista' 
                  ? `R$ ${userData.stats.totalEarned?.toFixed(2) || '0.00'}`
                  : `R$ ${userData.stats.totalSpent?.toFixed(2) || '0.00'}`}
              </Text>
              <Text style={styles.statLabel}>
                {userType === 'motorista' ? 'Ganhos' : 'Gastos'}
              </Text>
            </View>
          </View>
        )}

        {/* Personal Info */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Informações Pessoais</Text>
            {!isEditing && (
              <TouchableOpacity onPress={() => setIsEditing(true)}>
                <Text style={styles.editButton}>Editar</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.infoGroup}>
            <Text style={styles.label}>Nome Completo</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Nome completo"
              />
            ) : (
              <Text style={styles.value}>{name}</Text>
            )}
          </View>

          <View style={styles.infoGroup}>
            <Text style={styles.label}>Telefone</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Telefone"
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={styles.value}>{phone}</Text>
            )}
          </View>

          <View style={styles.infoGroup}>
            <Text style={styles.label}>E-mail</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            ) : (
              <Text style={styles.value}>{email}</Text>
            )}
          </View>

          <View style={styles.infoGroup}>
            <Text style={styles.label}>Idade</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={age}
                onChangeText={setAge}
                placeholder="Idade"
                keyboardType="numeric"
              />
            ) : (
              <Text style={styles.value}>{age || 'Não informado'}</Text>
            )}
          </View>

          <View style={styles.infoGroup}>
            <Text style={styles.label}>Gênero</Text>
            {isEditing ? (
              <View style={styles.genderContainer}>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    gender === 'masculino' && styles.genderButtonActive,
                  ]}
                  onPress={() => setGender('masculino')}
                >
                  <Text
                    style={[
                      styles.genderButtonText,
                      gender === 'masculino' && styles.genderButtonTextActive,
                    ]}
                  >
                    M
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    gender === 'feminino' && styles.genderButtonActive,
                  ]}
                  onPress={() => setGender('feminino')}
                >
                  <Text
                    style={[
                      styles.genderButtonText,
                      gender === 'feminino' && styles.genderButtonTextActive,
                    ]}
                  >
                    F
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    gender === 'outro' && styles.genderButtonActive,
                  ]}
                  onPress={() => setGender('outro')}
                >
                  <Text
                    style={[
                      styles.genderButtonText,
                      gender === 'outro' && styles.genderButtonTextActive,
                    ]}
                  >
                    Outro
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={styles.value}>
                {gender === 'masculino' ? 'Masculino' :
                 gender === 'feminino' ? 'Feminino' :
                 gender === 'outro' ? 'Outro' : 'Não informado'}
              </Text>
            )}
          </View>
        </View>

        {/* Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Endereço</Text>

          <View style={styles.infoGroup}>
            <Text style={styles.label}>Rua</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={street}
                onChangeText={setStreet}
                placeholder="Rua"
              />
            ) : (
              <Text style={styles.value}>{street || 'Não informado'}</Text>
            )}
          </View>

          <View style={styles.infoGroup}>
            <Text style={styles.label}>Bairro</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={neighborhood}
                onChangeText={setNeighborhood}
                placeholder="Bairro"
              />
            ) : (
              <Text style={styles.value}>{neighborhood || 'Não informado'}</Text>
            )}
          </View>

          <View style={styles.infoGroup}>
            <Text style={styles.label}>Cidade</Text>
            <Text style={styles.value}>Xique-Xique, BA</Text>
          </View>
        </View>

        {isEditing && (
          <View style={styles.editButtons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                setIsEditing(false);
                loadUserData();
              }}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>🚪 Sair da Conta</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textLight,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: 24,
    paddingTop: 60,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.secondary,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    fontSize: 18,
  },
  headerGreeting: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginBottom: 6,
  },
  headerSubtext: {
    fontSize: 15,
    color: COLORS.secondary,
    opacity: 0.85,
  },
  userTypeSelectorContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  userTypeSelector: {
    flexDirection: 'row',
    backgroundColor: COLORS.gray,
    borderRadius: 12,
    padding: 4,
  },
  userTypeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  userTypeButtonActive: {
    backgroundColor: '#FFFFFF',
  },
  userTypeText: {
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  userTypeTextActive: {
    color: COLORS.text,
  },
  scrollView: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: '#FFFFFF',
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  editButton: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
  },
  infoGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  genderButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  genderButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFF9E6',
  },
  genderButtonText: {
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  genderButtonTextActive: {
    color: COLORS.secondary,
    fontWeight: 'bold',
  },
  editButtons: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: '#FFFFFF',
    marginTop: 8,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
