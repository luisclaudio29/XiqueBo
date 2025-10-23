import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { useState } from 'react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function HelpCenterScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const faqs: FAQItem[] = [
    {
      id: '1',
      question: 'Como solicitar uma corrida?',
      answer: 'Na tela inicial, toque em "Solicitar Corrida", informe o endereço de origem e destino, escolha o tipo de serviço e confirme.',
      category: 'Corridas',
    },
    {
      id: '2',
      question: 'Qual é a taxa de cancelamento?',
      answer: 'A taxa de cancelamento é de 1% do valor da corrida, que será adicionada à próxima viagem.',
      category: 'Cancelamento',
    },
    {
      id: '3',
      question: 'Como funciona o pagamento?',
      answer: 'Aceitamos pagamento via cartão de crédito/débito e PIX. O pagamento é processado automaticamente após a conclusão da corrida.',
      category: 'Pagamento',
    },
    {
      id: '4',
      question: 'Qual é a comissão da empresa?',
      answer: 'Para motoristas, a comissão é de apenas 2% por corrida realizada.',
      category: 'Motoristas',
    },
    {
      id: '5',
      question: 'Como me tornar um motorista?',
      answer: 'Baixe o app, escolha "Cadastro de Motorista", envie seus documentos (CNH, documento do veículo) e aguarde a aprovação.',
      category: 'Motoristas',
    },
    {
      id: '6',
      question: 'Como funciona o programa de indicação?',
      answer: 'Compartilhe seu código de indicação. Quando 5 pessoas se cadastrarem e completarem uma corrida, você ganha 5% de desconto. Os indicados ganham 12% na primeira corrida.',
      category: 'Indicações',
    },
    {
      id: '7',
      question: 'Qual é o valor mínimo para saque (motoristas)?',
      answer: 'O valor mínimo para saque é de R$ 127,00 via PIX.',
      category: 'Motoristas',
    },
    {
      id: '8',
      question: 'Posso transportar pets?',
      answer: 'Sim! Basta selecionar a opção "Com pet" ao solicitar a corrida.',
      category: 'Corridas',
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = [...new Set(faqs.map((faq) => faq.category))];

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const openWhatsApp = () => {
    Linking.openURL('whatsapp://send?phone=5571982633972&text=Olá, preciso de ajuda com o XiquêGo!');
  };

  const openEmail = () => {
    Linking.openURL('mailto:bastosa549@gmail.com');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Central de Ajuda</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar dúvidas..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Quick Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contato Rápido</Text>
          <View style={styles.contactButtons}>
            <TouchableOpacity style={styles.contactButton} onPress={openWhatsApp}>
              <Text style={styles.contactIcon}>💬</Text>
              <Text style={styles.contactButtonText}>WhatsApp</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactButton} onPress={openEmail}>
              <Text style={styles.contactIcon}>✉️</Text>
              <Text style={styles.contactButtonText}>E-mail</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Perguntas Frequentes</Text>
          
          {categories.map((category) => {
            const categoryFaqs = filteredFaqs.filter(
              (faq) => faq.category === category
            );
            
            if (categoryFaqs.length === 0) return null;

            return (
              <View key={category} style={styles.categorySection}>
                <Text style={styles.categoryTitle}>{category}</Text>
                
                {categoryFaqs.map((faq) => (
                  <TouchableOpacity
                    key={faq.id}
                    style={styles.faqCard}
                    onPress={() => toggleExpand(faq.id)}
                  >
                    <View style={styles.faqHeader}>
                      <Text style={styles.faqQuestion}>{faq.question}</Text>
                      <Text style={styles.faqIcon}>
                        {expandedId === faq.id ? '−' : '+'}
                      </Text>
                    </View>
                    
                    {expandedId === faq.id && (
                      <Text style={styles.faqAnswer}>{faq.answer}</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            );
          })}

          {filteredFaqs.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyText}>
                Nenhuma resposta encontrada para "{searchQuery}"
              </Text>
            </View>
          )}
        </View>

        {/* Need More Help */}
        <View style={styles.section}>
          <View style={styles.helpCard}>
            <Text style={styles.helpIcon}>💡</Text>
            <Text style={styles.helpTitle}>Ainda precisa de ajuda?</Text>
            <Text style={styles.helpText}>
              Nossa equipe está pronta para te atender
            </Text>
            <TouchableOpacity style={styles.helpButton} onPress={openWhatsApp}>
              <Text style={styles.helpButtonText}>Falar com Suporte</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 12,
    paddingHorizontal: 16,
    margin: 20,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    paddingVertical: 12,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  contactButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  contactButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  contactIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textLight,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  faqCard: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    paddingRight: 12,
  },
  faqIcon: {
    fontSize: 24,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  faqAnswer: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray,
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  helpCard: {
    backgroundColor: '#FFF9E6',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  helpIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 20,
  },
  helpButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  helpButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
});




