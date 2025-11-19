import axios from "axios";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { NavBar } from "../components/NavBar";
// Importar Zod y la función de validación
import AsyncStorage from "@react-native-async-storage/async-storage";
import { registerSchema } from "../lib/auth.schemas";
const API_BASE_URL = 'http://localhost:8000/api'; // cambiar segun donde desplegas la app web expoGo etc



export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({}); // Para manejar errores de validación de Zod
  const [loading, setLoading] = useState(false); // Estado de carga para la API

  // Función reutilizable para mostrar alertas y opcionalmente navegar
  const showAlert = (title: string, message: string, navigateTo?: any) => {
    if (Platform.OS === "web") {
      // En web usamos window.alert (sin soporte para onPress), luego navegamos
      window.alert(`${title}\n\n${message}`);
      if (navigateTo) router.push(navigateTo);
      return;
    }
    // En native usamos Alert.alert con botón OK y onPress
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
    setErrors({}); // Limpiar errores anteriores

    try {
      // 1. Validación con Zod (Frontend Validation)
      // Usamos safeParse para que no lance un error, sino que nos dé una respuesta estructurada
      const result = registerSchema.safeParse({ username, phone, email, password });

      if (!result.success) {
        // Mapear errores de Zod al estado de errores
        const newErrors: { [key: string]: string } = {};
        result.error.issues.forEach(issue => {
          // Asumiendo que el campo 'path' es ['nombre'], ['email'], etc.
          const field = issue.path[0] as string;
          newErrors[field] = issue.message;
        });
        setErrors(newErrors);
        setLoading(false);
        return; // Detener la ejecución si hay errores de validación
      }

      console.log('Enviando POST a:', `${API_BASE_URL}/register`, 'payload:', result.data);


      // 2. Si la validación pasa, enviar datos al Backend
      //Esta parte solo se ejecuta si la validación del frontend fue exitosa.
      const response = await axios.post(`${API_BASE_URL}/register`, result.data); //result.data ason los dtos ya validados por Zod, listos para ser enviados.
      //guardar token después del axios.post exitoso:
      const token = response.data.token; // El token debe venir en la respuesta
      if (token) {
        await AsyncStorage.setItem('userToken', token);
      }// <--- DEBES HACER ESTO
      console.log("Registro exitoso. Datos del usuario:", response.data);
      // 3. Manejo de éxito
      // Limpiar campos después del registro exitoso
      setUsername('');
      setEmail('');
      setPassword('');
      setPhone('');
      showAlert("Registro Exitoso", "¡Tu cuenta ha sido creada!", "/login");

    } catch (error: any) {
      console.error("Error de registro:", error.response?.data || error.message);
      setLoading(false);
      const apiMessage = error.response?.data?.message || "Ocurrió un error en el servidor.";
      showAlert("Error", apiMessage);
    } finally {
      setLoading(false);
    }
  };

  // Función para mostrar el error específico de un campo
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

      < View style={styles.container}>
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

          {/* Usamos onPress para llamar a handleRegister */}
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
  // ... (otros estilos)
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

    // Sombra para iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    // Sombra para Android
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
  // Estilo de texto para errores
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

    // Sombra para iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.39,
    shadowRadius: 4.65,
    // Sombra para Android
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

    // Sombra para iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.39,
    shadowRadius: 4.65,
    // Sombra para Android
    elevation: 6,
  },
  textButtons: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});