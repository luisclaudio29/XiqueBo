# 🗺️ Configuração do Mapa - XiquêGo

## 📋 Pré-requisitos

O aplicativo já está configurado para usar mapas! As dependências foram instaladas:
- ✅ `react-native-maps`
- ✅ `expo-location`

## ⚙️ Configuração Necessária

### 1. **Permissões de Localização**

Adicione ao `app.json`:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "Permitir que $(PRODUCT_NAME) use sua localização para encontrar motoristas próximos."
        }
      ]
    ],
    "android": {
      "permissions": [
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION"
      ],
      "config": {
        "googleMaps": {
          "apiKey": "SUA_GOOGLE_MAPS_API_KEY_AQUI"
        }
      }
    },
    "ios": {
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "XiquêGo precisa da sua localização para mostrar motoristas próximos e calcular rotas.",
        "NSLocationAlwaysUsageDescription": "XiquêGo precisa da sua localização para rastrear sua corrida em tempo real."
      },
      "config": {
        "googleMapsApiKey": "SUA_GOOGLE_MAPS_API_KEY_AQUI"
      }
    }
  }
}
```

### 2. **Obter Google Maps API Key** (Produção)

Para usar mapas em produção, você precisa de uma chave da API do Google:

1. Acesse: https://console.cloud.google.com/
2. Crie um novo projeto "XiquêGo"
3. Ative as APIs:
   - Maps SDK for Android
   - Maps SDK for iOS
   - Geocoding API
   - Distance Matrix API
4. Crie credenciais → Chave da API
5. Copie a chave e adicione no `app.json`

### 3. **Atualizar app.json Completo**

Aqui está o `app.json` completo configurado:

```json
{
  "expo": {
    "name": "XiquêGo",
    "slug": "xiquego",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "xiquego",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/images/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#FFC529"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.xiquego.app",
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "XiquêGo precisa da sua localização para mostrar motoristas próximos e calcular rotas.",
        "NSLocationAlwaysUsageDescription": "XiquêGo precisa da sua localização para rastrear sua corrida em tempo real.",
        "NSLocationAlwaysAndWhenInUseUsageDescription": "XiquêGo precisa da sua localização para fornecer o melhor serviço."
      },
      "config": {
        "googleMapsApiKey": "SUA_GOOGLE_MAPS_API_KEY_AQUI"
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/android-icon-foreground.png",
        "backgroundColor": "#FFC529",
        "monochromeImage": "./assets/images/android-icon-monochrome.png"
      },
      "permissions": [
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION",
        "FOREGROUND_SERVICE",
        "ACCESS_BACKGROUND_LOCATION"
      ],
      "package": "com.xiquego.app",
      "config": {
        "googleMaps": {
          "apiKey": "SUA_GOOGLE_MAPS_API_KEY_AQUI"
        }
      }
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "Permitir que $(PRODUCT_NAME) use sua localização."
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

## 🚀 Para Testar no Desenvolvimento

### Modo Desenvolvimento (sem API Key):

O app funciona em modo de desenvolvimento sem API Key! 

```bash
cd XIQUEGO
npm start
```

O mapa mostrará:
- Região de Xique-Xique por padrão
- Sua localização (se você permitir)
- Marcadores personalizados

### Testando Localização:

**Android Emulator:**
```
- Abra o emulador
- Menu ... → Location
- Digite coordenadas de Xique-Xique:
  Lat: -10.8236
  Lon: -42.7273
```

**iOS Simulator:**
```
- Features → Location → Custom Location
- Latitude: -10.8236
- Longitude: -42.7273
```

## 🌍 Coordenadas de Xique-Xique e Região

```javascript
const LOCATIONS = {
  xique_xique: {
    latitude: -10.8236,
    longitude: -42.7273,
    name: 'Xique-Xique'
  },
  perto_velha: {
    latitude: -10.7500,
    longitude: -42.7000,
    name: 'Perto Velha'
  },
  iguira: {
    latitude: -10.8500,
    longitude: -42.6500,
    name: 'Iguira'
  },
  nova_iguira: {
    latitude: -10.8700,
    longitude: -42.6200,
    name: 'Nova Iguira'
  },
  rumo: {
    latitude: -10.9000,
    longitude: -42.7500,
    name: 'Rumo'
  },
  mato_grosso: {
    latitude: -10.7800,
    longitude: -42.8000,
    name: 'Mato Grosso'
  },
  vicente: {
    latitude: -10.8500,
    longitude: -42.8500,
    name: 'Vicente'
  }
};
```

## 📱 Funcionalidades do Mapa

### Implementadas:
- ✅ Visualização da região de Xique-Xique
- ✅ Localização do usuário em tempo real
- ✅ Marcadores personalizados
- ✅ Botão para centralizar no usuário
- ✅ Info card com cobertura
- ✅ Permissões de localização

### Para Implementar (próxima fase):
- [ ] Geocoding (endereço → coordenadas)
- [ ] Reverse Geocoding (coordenadas → endereço)
- [ ] Cálculo de rota real
- [ ] Distância real entre pontos
- [ ] Tempo estimado real
- [ ] Rastreamento em tempo real
- [ ] Múltiplos marcadores (motoristas)
- [ ] Polyline (linha da rota)

## 🔧 Solução de Problemas

### Mapa não aparece?

1. **Verifique as permissões:**
```bash
# Android
adb shell pm grant com.xiquego.app android.permission.ACCESS_FINE_LOCATION

# iOS
Vá em Configurações → XiquêGo → Localização → Sempre
```

2. **Verifique o console:**
```bash
npm start
```
Procure por erros relacionados a `expo-location` ou `react-native-maps`

3. **Reinstale as dependências:**
```bash
rm -rf node_modules
npm install
```

### Localização não funciona?

1. Verifique se deu permissão quando solicitado
2. No emulador, defina uma localização customizada
3. Certifique-se de estar com internet conectada

### Erro de API Key?

No desenvolvimento, não precisa de API Key! 
Só será necessário ao fazer build para produção.

## 📚 Próximos Passos

### Fase 1 - GPS Real:
1. Obter Google Maps API Key
2. Implementar Geocoding API
3. Implementar Distance Matrix API
4. Calcular rotas reais

### Fase 2 - Rastreamento:
1. WebSocket para tempo real
2. Atualizar localização do motorista
3. Mostrar rota na tela
4. Notificações de proximidade

### Fase 3 - Otimizações:
1. Cache de locais frequentes
2. Modo offline (mapas salvos)
3. Economia de bateria
4. Precisão melhorada

## 💡 Dicas

1. **Desenvolvimento:** Teste sem API Key primeiro
2. **Produção:** Configure API Key antes do build
3. **Performance:** Use marcadores com moderação
4. **Bateria:** Atualize localização apenas quando necessário
5. **Offline:** Implemente fallback para modo sem internet

## 🎯 Links Úteis

- [Expo Location](https://docs.expo.dev/versions/latest/sdk/location/)
- [React Native Maps](https://github.com/react-native-maps/react-native-maps)
- [Google Maps Platform](https://console.cloud.google.com/)
- [Google Geocoding API](https://developers.google.com/maps/documentation/geocoding)
- [Distance Matrix API](https://developers.google.com/maps/documentation/distance-matrix)

---

## ✅ Checklist de Configuração

- [ ] `react-native-maps` instalado
- [ ] `expo-location` instalado
- [ ] Permissões adicionadas ao `app.json`
- [ ] Testado no emulador/device
- [ ] Localização funcionando
- [ ] Mapa renderizando
- [ ] Marcadores visíveis
- [ ] Botão de localização funcionando

---

**Qualquer dúvida, consulte a documentação oficial do Expo!** 📖





