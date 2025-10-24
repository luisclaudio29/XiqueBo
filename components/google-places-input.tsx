/**
 * Componente de busca de endereços com Google Places Autocomplete
 */

import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { COLORS } from '@/constants/colors';

interface GooglePlacesInputProps {
  placeholder: string;
  onPlaceSelected: (data: any, details: any) => void;
  defaultValue?: string;
}

export function GooglePlacesInput({ placeholder, onPlaceSelected, defaultValue }: GooglePlacesInputProps) {
  const ref = useRef<any>(null);
  
  // Pega a chave da API do ambiente
  const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        ref={ref}
        placeholder={placeholder}
        minLength={2}
        fetchDetails={true}
        onPress={(data, details = null) => {
          onPlaceSelected(data, details);
        }}
        query={{
          key: GOOGLE_MAPS_API_KEY,
          language: 'pt-BR',
          components: 'country:br', // Foca no Brasil
        }}
        textInputProps={{
          placeholderTextColor: '#999',
          defaultValue: defaultValue,
          style: styles.textInput,
        }}
        styles={{
          container: styles.autocompleteContainer,
          listView: styles.listView,
          row: styles.row,
          description: styles.description,
          poweredContainer: styles.poweredContainer,
        }}
        enablePoweredByContainer={false}
        nearbyPlacesAPI="GooglePlacesSearch"
        debounce={300}
        renderRow={(rowData: any) => {
          const title = rowData.structured_formatting.main_text;
          const address = rowData.structured_formatting.secondary_text;
          
          return (
            <View style={styles.suggestionRow}>
              <View style={styles.iconContainer}>
                <View style={styles.iconCircle}>
                  <View style={styles.iconDot} />
                </View>
              </View>
              <View style={styles.suggestionText}>
                <View style={styles.titleText}>{title}</View>
                <View style={styles.addressText}>{address}</View>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 16,
  },
  autocompleteContainer: {
    flex: 0,
  },
  textInput: {
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#000',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  listView: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginTop: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  row: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  description: {
    fontSize: 15,
    color: '#000',
  },
  poweredContainer: {
    display: 'none',
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  iconContainer: {
    marginRight: 12,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  suggestionText: {
    flex: 1,
  },
  titleText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 13,
    color: '#666',
  },
});

