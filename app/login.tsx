import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { loginSchema } from "../lib/auth.schemas";

const API_BASE_URL_WEB = 'http://localhost:8000/api';
const API_BASE_URL_EXPO = 'http://192.168.1.4:8000/api'; // reemplazar si cambia tu IP

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const getApiUrl = () => Platform.OS === 'web' ? API_BASE_URL_WEB : API_BASE_URL_EXPO;

  const showAlert = (title: string, message: string, path?: any) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n\n${message}`);
      if (path) setTimeout(() => router.push(path), 150);
      return;
    }
    Alert.alert(title, message, [{ text: 'OK', onPress: () => { if (path) router.push(path); } }], { cancelable: false });
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = loginSchema.safeParse({ email, password });
      if (!result.success) {
        const msg = result.error.issues.map(i => i.message).join('\n');
        showAlert('Error', msg);
        setLoading(false);
        return;
      }

      const API_URL = getApiUrl();
      const resp = await axios.post(`${API_URL}/login`, result.data);
      const token = resp.data?.token;
      if (!token) {
        showAlert('Error', 'No se recibió token del servidor');
        setLoading(false);
        return;
      }

      await AsyncStorage.setItem('userToken', token);
      showAlert('Bienvenido', 'Inicio de sesión correcto', '/perfil');

    } catch (err: any) {
      console.error('Error login:', err.response?.data || err.message);
      const msg = err.response?.data?.message || 'Error al iniciar sesión';
      showAlert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>INGRESAR</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20, justifyContent:'center' },
  title:{ fontSize:24, textAlign:'center', marginBottom:20 },
  input:{ height:48, borderWidth:1, borderColor:'#ccc', borderRadius:8, paddingHorizontal:12, marginBottom:12 },
  button:{ backgroundColor:'#452790', padding:12, borderRadius:8, alignItems:'center' },
  buttonText:{ color:'#fff', fontWeight:'bold' },
});