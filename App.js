import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  ImageBackground,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';

// 🔗 Map weather condition → local background image
const bgImages = {
  Clear: require('./assets/sunny.jpg'),
  Clouds: require('./assets/cloudy.jpg'),
  Rain: require('./assets/rain.jpg'),
  Drizzle: require('./assets/rain.jpg'),
  Thunderstorm: require('./assets/storm.jpg'),
  Snow: require('./assets/snow.jpg'),
  Mist: require('./assets/fog.jpg'),
  Haze: require('./assets/fog.jpg'),
  Default: require('./assets/default.jpg'),
};

export default function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [isDark, setIsDark] = useState(false);

  const getWeather = async () => {
    if (!city.trim()) {
      setError('Please enter a city name');
      setWeather(null);
      return;
    }
    try {
      const apiKey = '125ff1586826566b9f044eb3efe5ab31';
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
      const res = await axios.get(url);
      setWeather(res.data);
      setError(null);
      Keyboard.dismiss();
    } catch (err) {
      setError('City not found');
      setWeather(null);
    }
  };

  // pick background
  const bgSource =
    weather && bgImages[weather.weather[0].main]
      ? bgImages[weather.weather[0].main]
      : bgImages.Default;

  // theme‑aware colours
  const theme = {
    text: isDark ? '#f4f4f4' : '#222',
    cardBg: isDark ? '#000000cc' : '#ffffffdd',
    grad: isDark ? ['#2c3e50', '#000000'] : ['#89f7fe', '#66a6ff'],
    button: isDark ? '#1e90ff' : '#0066cc',
  };

  return (
    <ImageBackground source={bgSource} style={styles.bg} resizeMode="cover">
      <LinearGradient colors={theme.grad} style={styles.overlay}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.inner}
          >
            {/* Header with title + dark‑mode switch */}
            <View style={styles.header}>
              <Text style={[styles.title, { color: theme.text }]}>Weather App</Text>
              <Switch
                value={isDark}
                onValueChange={setIsDark}
                thumbColor={isDark ? '#fff' : '#fff'}
                trackColor={{ false: '#888', true: '#444' }}
              />
            </View>

            {/* Input */}
            <TextInput
              style={[
                styles.input,
                { backgroundColor: theme.cardBg, color: theme.text },
              ]}
              placeholder="Enter city name"
              placeholderTextColor={isDark ? '#aaa' : '#666'}
              value={city}
              onChangeText={setCity}
              onSubmitEditing={getWeather}
            />

            {/* Button */}
            <View style={styles.button}>
              <Button title="Get Weather" color={theme.button} onPress={getWeather} />
            </View>

            {/* Error */}
            {error && <Text style={styles.error}>{error}</Text>}

            {/* Weather card */}
            {weather && (
              <View
                style={[
                  styles.card,
                  { backgroundColor: theme.cardBg, shadowColor: '#000' },
                ]}
              >
                <Text style={[styles.city, { color: theme.text }]}>
                  {weather.name}
                </Text>
                <Text style={[styles.temp, { color: theme.button }]}>
                  {weather.main.temp}°C
                </Text>
                <Text style={[styles.desc, { color: theme.text }]}>
                  {weather.weather[0].description}
                </Text>
                <Image
                  style={styles.icon}
                  source={{
                    uri: `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
                  }}
                />
              </View>
            )}

            {/* Footer */}
            <Text style={[styles.footer, { color: theme.text }]}>© 2025 Jayant</Text>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  overlay: { flex: 1 },
  inner: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: 14,
    fontSize: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  button: {
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  error: { color: 'red', marginTop: 10 },
  card: {
    marginTop: 28,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    width: '100%',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  city: { fontSize: 24, fontWeight: '600' },
  temp: { fontSize: 50, fontWeight: 'bold', marginVertical: 6 },
  desc: { fontSize: 18, textTransform: 'capitalize', marginBottom: 10 },
  icon: { width: 100, height: 100 },
  footer: { position: 'absolute', bottom: 20, textAlign: 'center', fontSize: 14 },
});
