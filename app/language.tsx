import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { useState } from 'react';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export default function LanguageScreen() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState('pt-BR');

  const languages: Language[] = [
    { code: 'pt-BR', name: 'Portuguese (Brazil)', nativeName: 'Português (Brasil)', flag: '🇧🇷' },
    { code: 'en-US', name: 'English (US)', nativeName: 'English', flag: '🇺🇸' },
    { code: 'es-ES', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
    { code: 'fr-FR', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  ];

  const handleLanguageSelect = (code: string) => {
    setSelectedLanguage(code);
    // Aqui seria implementada a lógica de mudança de idioma
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Idioma</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.description}>
          Selecione o idioma de sua preferência para o aplicativo
        </Text>

        {languages.map((language) => (
          <TouchableOpacity
            key={language.code}
            style={[
              styles.languageCard,
              selectedLanguage === language.code && styles.languageCardSelected,
            ]}
            onPress={() => handleLanguageSelect(language.code)}
          >
            <Text style={styles.flag}>{language.flag}</Text>
            <View style={styles.languageInfo}>
              <Text style={styles.languageName}>{language.nativeName}</Text>
              <Text style={styles.languageSubtext}>{language.name}</Text>
            </View>
            {selectedLanguage === language.code && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 32,
    color: COLORS.secondary,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  description: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 20,
    lineHeight: 20,
  },
  languageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.gray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  languageCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFF9E6',
  },
  flag: {
    fontSize: 32,
    marginRight: 16,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 2,
  },
  languageSubtext: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  checkmark: {
    fontSize: 24,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});




