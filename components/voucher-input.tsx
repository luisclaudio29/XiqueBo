/**
 * Componente: Campo de Voucher/Cupom
 */

import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { VoucherService } from '../services/voucher.service';
import type { AppliedVoucher } from '../types/voucher.types';

interface VoucherInputProps {
  amount: number;
  userId: string;
  isFirstRide?: boolean;
  onVoucherApplied: (voucher: AppliedVoucher | null) => void;
}

export function VoucherInput({ 
  amount, 
  userId, 
  isFirstRide = false,
  onVoucherApplied 
}: VoucherInputProps) {
  const [voucherCode, setVoucherCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState<AppliedVoucher | null>(null);
  const [error, setError] = useState('');

  const voucherService = VoucherService.getInstance();

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) {
      setError('Digite um código de voucher');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const validation = await voucherService.validateVoucher(
        voucherCode,
        amount,
        userId,
        isFirstRide
      );

      if (validation.isValid) {
        const applied = await voucherService.applyVoucher(
          voucherCode,
          amount,
          userId
        );

        if (applied) {
          setAppliedVoucher(applied);
          onVoucherApplied(applied);
          setError('');
        }
      } else {
        setError(validation.message);
        setAppliedVoucher(null);
        onVoucherApplied(null);
      }
    } catch (err) {
      setError('Erro ao validar voucher');
      setAppliedVoucher(null);
      onVoucherApplied(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveVoucher = () => {
    setVoucherCode('');
    setAppliedVoucher(null);
    setError('');
    onVoucherApplied(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cupom de Desconto</Text>

      {!appliedVoucher ? (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={voucherCode}
            onChangeText={(text) => {
              setVoucherCode(text.toUpperCase());
              setError('');
            }}
            placeholder="Digite o código"
            placeholderTextColor="#999"
            autoCapitalize="characters"
            maxLength={20}
          />
          <TouchableOpacity
            style={[styles.applyButton, loading && styles.applyButtonDisabled]}
            onPress={handleApplyVoucher}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.applyButtonText}>Aplicar</Text>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.appliedContainer}>
          <View style={styles.appliedInfo}>
            <Text style={styles.appliedIcon}>🎫</Text>
            <View style={styles.appliedDetails}>
              <Text style={styles.appliedCode}>{appliedVoucher.voucher.code}</Text>
              <Text style={styles.appliedDiscount}>
                -R$ {appliedVoucher.discountAmount.toFixed(2)}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={handleRemoveVoucher}
          >
            <Text style={styles.removeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      {error && !appliedVoucher && (
        <Text style={styles.errorText}>⚠️ {error}</Text>
      )}

      {appliedVoucher && (
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Valor original:</Text>
            <Text style={styles.summaryValue}>
              R$ {appliedVoucher.originalAmount.toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Desconto:</Text>
            <Text style={[styles.summaryValue, styles.discountValue]}>
              -R$ {appliedVoucher.discountAmount.toFixed(2)}
            </Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total a pagar:</Text>
            <Text style={styles.totalValue}>
              R$ {appliedVoucher.finalAmount.toFixed(2)}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  applyButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  applyButtonDisabled: {
    opacity: 0.6,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  appliedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  appliedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  appliedIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  appliedDetails: {
    flex: 1,
  },
  appliedCode: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2e7d32',
  },
  appliedDiscount: {
    fontSize: 12,
    color: '#388e3c',
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 12,
    color: '#d32f2f',
    marginTop: 8,
  },
  summary: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#666',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  discountValue: {
    color: '#4CAF50',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    marginTop: 8,
    paddingTop: 8,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});




