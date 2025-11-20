import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { NavBar } from "../components/NavBar";
import { registerSchema } from "../lib/auth.schemas";

// URLs según plataforma
const API_BASE_URL_WEB = 'http://localhost:8000/api';
const API_BASE_URL_EXPO = 'http://192.168.1.4:8000/api'; //  IP local de la red LAN.

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  // Seleccionar URL según plataforma
  const getApiUrl = () => {
    if (Platform.OS === "web") {
      return API_BASE_URL_WEB;
    }
    return API_BASE_URL_EXPO;
  };

  // Función para mostrar alertas
  const showAlert = (title: string, message: string, navigateTo?: any) => {
    if (Platform.OS === "web") {
      window.alert(`${title}\n\n${message}`);
      if (navigateTo) router.push("/perfil");
      return;
    }
    Alert.alert(
      title,
      message,
      [
        {
          text: "OK",
          onPress: () => {
            if (navigateTo) router.push(navigateTo);
          }
        }
      ],
      { cancelable: false }
    );
  };

  // Función de manejo de registro
  const handleRegister = async () => {
    setLoading(true);
    setErrors({});

    try {
      // Validación con Zod
      const result = registerSchema.safeParse({ username, phone, email, password });

      if (!result.success) {
        const newErrors: { [key: string]: string } = {};
        result.error.issues.forEach(issue => {
          const field = issue.path[0] as string;
          newErrors[field] = issue.message;
        });
        setErrors(newErrors);
        setLoading(false);
        return;
      }

      const API_URL = getApiUrl();
      console.log('Enviando POST a:', `${API_URL}/register`, 'payload:', result.data);

      // Llamada a la API
      const response = await axios.post(`${API_URL}/register`, result.data);
      console.log("Registro exitoso:", response.data);

      // Guardar token
      const token = response.data.token;
      if (token) {
        await AsyncStorage.setItem('userToken', token);
        console.log("Token guardado en AsyncStorage");
      }

      // Limpiar campos
      setUsername('');
      setEmail('');
      setPassword('');
      setPhone('');
      setLoading(false);

      // Mostrar alerta y navegar al perfil
      showAlert("Registro Exitoso", "¡Tu cuenta ha sido creada!", "/perfil");

    } catch (error: any) {
      console.error("Error de registro:", error.response?.data || error.message);
      setLoading(false);
      const apiMessage = error.response?.data?.message || "Ocurrió un error en el servidor.";
      showAlert("Error", apiMessage);
    }
  };

  // Función para mostrar errores
  const renderError = (field: string) => {
    if (errors[field]) {
      return <Text style={styles.errorText}>{errors[field]}</Text>;
    }
    return null;
  };

  return (
    <>
      <NavBar />
      <Text style={{ marginTop: 50, padding: 10, textAlign: "center", fontSize: 32 }}>REGISTRARSE</Text>

      <View style={styles.container}>
        <View style={styles.containerInicioSesion}>
          <Text style={styles.tituloRegister}>Registrarse</Text>

          <TextInput
            style={styles.inputRegister}
            placeholder="Nombre de Usuario"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          {renderError('username')}

          <TextInput
            style={styles.inputRegister}
            placeholder="Correo Electrónico"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {renderError('email')}

          <TextInput
            style={styles.inputRegister}
            placeholder="Telefono"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          {renderError('phone')}

          <TextInput
            style={styles.inputRegister}
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {renderError('password')}

          <TouchableOpacity
            style={styles.buttonsRegister}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.textButtons}>REGISTRARSE</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonsCancelar}
            onPress={() => router.back()}
          >
            <Text style={styles.textButtons}>CANCELAR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  containerInicioSesion: {
    marginHorizontal: 15,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: "#452790",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#eeebebff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  inputRegister: {
    width: 280,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 15,
    paddingHorizontal: 10,
    backgroundColor: "#f7f3f3ff",
  },
  tituloRegister: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#452790",
  },
  errorText: {
    color: '#ff0000',
    fontSize: 12,
    alignSelf: 'flex-start',
    marginHorizontal: 20,
    marginTop: 2,
  },
  buttonsRegister: {
    backgroundColor: '#452790',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
    width: 280,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 40,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.39,
    shadowRadius: 4.65,
    elevation: 6,
  },
  buttonsCancelar: {
    backgroundColor: '#f01250',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
    width: 280,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 40,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.39,
    shadowRadius: 4.65,
    elevation: 6,
  },
  textButtons: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});