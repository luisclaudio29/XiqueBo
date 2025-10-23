# 🗺️ Configuração do Google Maps - XIQUÊGO

## 📋 Passo a Passo Completo

### 1. 🔑 Obter API Key do Google Maps

#### **A) Acessar Google Cloud Console:**
1. Acesse: https://console.cloud.google.com/
2. Faça login com sua conta Google
3. Clique em **"Select a project"** (topo da página)
4. Clique em **"NEW PROJECT"**
5. Nome do projeto: **"XiquêGo Maps"**
6. Clique em **"CREATE"**

#### **B) Ativar APIs necessárias:**
1. No menu lateral, vá em: **APIs & Services** → **Library**
2. Pesquise e ative as seguintes APIs:
   - ✅ **Maps SDK for Android**
   - ✅ **Maps SDK for iOS**
   - ✅ **Geocoding API** (opcional, para busca de endereços)
   - ✅ **Directions API** (opcional, para rotas otimizadas)

#### **C) Criar API Key:**
1. No menu lateral: **APIs & Services** → **Credentials**
2. Clique em **"+ CREATE CREDENTIALS"**
3. Selecione **"API key"**
4. ✅ Sua API Key será gerada!
5. **Copie** a chave (algo como: `AIzaSyB...`)

#### **D) Restringir API Key (Recomendado):**
1. Clique no nome da API Key criada
2. Em **"API restrictions"**:
   - Selecione **"Restrict key"**
   - Marque apenas as APIs que ativou
3. Em **"Application restrictions"**:
   - Android: Adicione o package name do app
   - iOS: Adicione o Bundle ID
4. Clique em **"SAVE"**

---

### 2. 📱 Configurar no Projeto Expo

#### **A) Criar arquivo `.env`:**

Na raiz do projeto `XIQUEGO`, crie o arquivo `.env`:

```env
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyB...SuaChaveAqui...
```

> **Importante:** Substitua `AIzaSyB...` pela sua chave real!

#### **B) Atualizar `app.json`:**

Abra o arquivo `app.json` e adicione:

```json
{
  "expo": {
    "name": "XIQUÊGO",
    "slug": "xiquego",
    "version": "1.0.0",
    
    "android": {
      "package": "com.xiquego.app",
      "config": {
        "googleMaps": {
          "apiKey": "AIzaSyB...SuaChaveAqui..."
        }
      }
    },
    
    "ios": {
      "bundleIdentifier": "com.xiquego.app",
      "config": {
        "googleMapsApiKey": "AIzaSyB...SuaChaveAqui..."
      }
    },
    
    "plugins": [
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "Permitir que XIQUÊGO acesse sua localização."
        }
      ]
    ]
  }
}
```

#### **C) Instalar dependência (se ainda não instalou):**

```bash
npm install react-native-maps
```

---

### 3. 🧪 Testar a Configuração

#### **Método 1: Teste Simples**

Crie um arquivo de teste temporário `test-maps.tsx`:

```typescript
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { View, StyleSheet } from 'react-native';

export default function TestMaps() {
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: -10.8231,  // Xique-Xique
          longitude: -42.7289,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
```

#### **Método 2: Usar telas já criadas**

Navegue para a tela de solicitação de serviço:
```
/request-service
```

✅ Se o mapa carregar, está funcionando!  
❌ Se mostrar erro, verifique os passos abaixo.

---

### 4. 🐛 Solução de Problemas

#### **Problema: Mapa não carrega (cinza/branco)**

**Causa:** API Key inválida ou não configurada

**Solução:**
1. Verificar se a API Key está correta em `.env` e `app.json`
2. Verificar se as APIs estão ativadas no Google Cloud
3. Aguardar 5-10 minutos (propagação da chave)
4. Limpar cache e reiniciar:
   ```bash
   npx expo start --clear
   ```

#### **Problema: "API not enabled"**

**Causa:** APIs não ativadas no Google Cloud

**Solução:**
1. Acessar: https://console.cloud.google.com/
2. Ativar: Maps SDK for Android e Maps SDK for iOS
3. Aguardar alguns minutos

#### **Problema: GPS não funciona**

**Causa:** Permissões não concedidas

**Solução:**
1. No app, aceitar permissões de localização
2. Verificar configurações do dispositivo
3. Testar em dispositivo real (emulador pode não ter GPS)

#### **Problema: "Map failed to load"**

**Causa:** Sem conexão com internet ou API Key restrita demais

**Solução:**
1. Verificar conexão com internet
2. Revisar restrições da API Key
3. Remover restrições temporariamente para testar

---

### 5. 📊 Custos do Google Maps

#### **Plano Gratuito:**
- ✅ **$200 de crédito grátis por mês**
- ✅ Maps SDK: ~28.000 carregamentos/mês grátis
- ✅ Geocoding: ~40.000 requisições/mês grátis
- ✅ Directions: ~40.000 requisições/mês grátis

#### **Para um app iniciante:**
- ✅ **Uso gratuito** para até ~1.000 usuários/dia
- ✅ Sem cobranças enquanto dentro do limite

#### **Monitorar Uso:**
1. Acessar: https://console.cloud.google.com/
2. Menu: **Billing** → **Reports**
3. Ver gráficos de uso

---

### 6. 🔒 Segurança da API Key

#### **⚠️ NUNCA:**
- ❌ Compartilhar a API Key publicamente
- ❌ Commit no Git sem `.gitignore`
- ❌ Deixar sem restrições em produção

#### **✅ SEMPRE:**
- ✅ Usar `.env` para desenvolvimento
- ✅ Adicionar `.env` no `.gitignore`
- ✅ Restringir APIs usadas
- ✅ Restringir por package/bundle ID
- ✅ Monitorar uso regularmente

#### **Arquivo `.gitignore`:**
```
# Variáveis de ambiente
.env
.env.local
.env.production

# Chaves sensíveis
google-services.json
GoogleService-Info.plist
```

---

### 7. 🚀 Build para Produção

#### **Android:**

1. Adicionar no `google-services.json`:
```json
{
  "project_info": {
    "project_number": "...",
    "project_id": "xiquego-maps"
  }
}
```

2. Build:
```bash
eas build --platform android
```

#### **iOS:**

1. Adicionar no `GoogleService-Info.plist`
2. Build:
```bash
eas build --platform ios
```

---

### 8. 📱 Teste em Dispositivo Real

#### **Android:**
1. Instalar Expo Go
2. Escanear QR Code
3. Aceitar permissões de localização
4. ✅ Mapa deve carregar com sua localização

#### **iOS:**
1. Instalar Expo Go
2. Escanear QR Code ou usar link
3. Aceitar permissões de localização
4. ✅ Mapa deve carregar com sua localização

---

### 9. ✅ Checklist Final

Antes de lançar o app, verificar:

- [ ] API Key criada no Google Cloud
- [ ] APIs ativadas (Maps SDK Android e iOS)
- [ ] API Key configurada em `.env`
- [ ] API Key configurada em `app.json`
- [ ] `.env` adicionado ao `.gitignore`
- [ ] Permissões de localização configuradas
- [ ] Testado em dispositivo Android
- [ ] Testado em dispositivo iOS
- [ ] Restrições de API configuradas
- [ ] Uso monitorado no Google Cloud

---

### 10. 📚 Recursos Úteis

#### **Documentação:**
- [Expo Location](https://docs.expo.dev/versions/latest/sdk/location/)
- [React Native Maps](https://github.com/react-native-maps/react-native-maps)
- [Google Maps Platform](https://developers.google.com/maps)
- [Expo Google Maps](https://docs.expo.dev/versions/latest/sdk/map-view/)

#### **Suporte:**
- [Stack Overflow - React Native Maps](https://stackoverflow.com/questions/tagged/react-native-maps)
- [Expo Forums](https://forums.expo.dev/)
- [Google Maps Support](https://support.google.com/maps/)

---

### 11. 🎯 Exemplo Completo

Aqui está um exemplo funcional completo:

```typescript
import { useState, useEffect } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { View, StyleSheet, Alert } from 'react-native';

export default function MapScreen() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Erro', 'Permissão de localização negada');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    })();
  }, []);

  if (!location) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={location}
        showsUserLocation
        showsMyLocationButton
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="Você está aqui"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
```

---

## 🎉 Pronto!

Agora o Google Maps está configurado e funcionando no seu app XIQUÊGO!

**Próximo passo:** Testar todas as funcionalidades usando o [GUIA_TESTE_RAPIDO.md](./GUIA_TESTE_RAPIDO.md)

---

**Dúvidas?** Consulte a documentação oficial do Expo e Google Maps.  
**Status:** ✅ Configuração Completa

