import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NavBar } from "../components/NavBar"; // Asumo que tienes tu NavBar

// Importación simulada de almacenamiento seguro para el token
// En un proyecto real de Expo/React Native usarías 'expo-secure-store' o 'AsyncStorage'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";

// Ajusta la URL base. Asumo que el endpoint de perfil es /auth/me
const API_BASE_URL = 'http://localhost:8000/api'; 

// Interfaz para tipar la respuesta de la API del perfil
interface UserProfile {
  id: string;
  username: string;
  email: string;
  phone: string;
  // Puedes añadir más campos aquí, como createdAt, role, etc.
}

export default function PerfilScreen() {
  const router = useRouter(); 
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener el token y cargar los datos del usuario
  const fetchUserProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Obtener el token (Simulación)
      // En una aplicación real, este token se guardaría después del login/registro
      const token = await AsyncStorage.getItem('userToken'); 
      
      if (!token) {
        setError("Token no encontrado. Por favor, inicia sesión.");
        setLoading(false);
        // Opcional: Redirigir si no hay token
        // router.replace('/login'); 
        return;
      }

      // 2. Llamada a la API con el token
      const response = await axios.get<UserProfile>(`${API_BASE_URL}/profile`, {
        headers: {
          // *** El token DEBE ir en el encabezado de autorización ***
          'Authorization': `Bearer ${token}` 
        }
      });

      // 3. Almacenar los datos del usuario
      setUser(response.data);

    } catch (err: any) {
      console.error("Error al obtener perfil:", err.response?.data || err.message);
      
      let errorMessage = "No se pudo cargar el perfil.";
      if (err.response?.status === 401) {
        errorMessage = "Sesión expirada. Por favor, vuelve a iniciar sesión.";
      } else if (err.message.includes('Network')) {
        errorMessage = "Error de conexión. Verifica el servidor.";
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Cargar el perfil al montar el componente
  useEffect(() => {
    fetchUserProfile();
  }, []); 

  // Función para cerrar sesión (simulado)
  const handleLogout = async () => {
    // 1. Limpiar el token del almacenamiento
    await AsyncStorage.removeItem('userToken');
    // 2. Limpiar el estado del usuario
    setUser(null);
    // 3. Redirigir a la pantalla de login/inicio
    router.replace('/login');
  };


  // --- Renderizado ---

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#452790" />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchUserProfile}>
          <Text style={styles.retryText}>Intentar de Nuevo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.textButtons}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!user) {
      return (
        <View style={[styles.container, styles.center]}>
            <Text style={styles.errorText}>No hay datos de usuario para mostrar.</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.textButtons}>Ir a Iniciar Sesión</Text>
            </TouchableOpacity>
        </View>
      );
  }

  // Si todo es exitoso, mostrar el perfil
  return (
    <ScrollView style={styles.container}>
      <NavBar />
      
      <View style={styles.card}>
        <Text style={styles.header}>Perfil del Usuario</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.label}>ID de Usuario:</Text>
          <Text style={styles.value}>{user.id}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.label}>Nombre:</Text>
          <Text style={styles.value}>{user.username}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{user.email}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Teléfono:</Text>
          <Text style={styles.value}>{user.phone}</Text>
        </View>
        
        <View style={styles.separator} />

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.textButtons}>CERRAR SESIÓN</Text>
        </TouchableOpacity>
        
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  card: {
    margin: 20,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#452790',
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  value: {
    fontSize: 16,
    color: '#666',
    maxWidth: '60%',
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#452790',
  },
  errorText: {
    fontSize: 18,
    color: '#f01250',
    textAlign: 'center',
    marginBottom: 15,
  },
  logoutButton: {
    backgroundColor: '#f01250', 
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 20, 
    borderRadius: 40,
    alignItems: "center",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  textButtons: {
    color: '#ffffff', 
    fontSize: 16,
    fontWeight: 'bold',
  },
  retryButton: {
    backgroundColor: '#452790', 
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10, 
    borderRadius: 40,
    alignItems: "center",
  },
  retryText: {
    color: '#ffffff', 
    fontSize: 14,
    fontWeight: 'bold',
  }
});