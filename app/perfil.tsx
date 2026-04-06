import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { useFocusEffect, useRouter } from "expo-router"; // Agregar useFocusEffect
import React, { useCallback, useState } from "react"; // Agregar useCallback
import { ActivityIndicator, Image, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NavBar } from "../components/NavBar";

const API_BASE_URL = 'http://localhost:8000/api';
const API_BASE_URL_EXPO = 'http://192.168.1.4:8000/api';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  phone: string;
  perfilImage: string;
}

export default function PerfilScreen() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [imgAmpliada, setImgAmpliada] = useState("");

  const getApiUrl = () => {
    if (Platform.OS === "web") {
      return API_BASE_URL;
    }
    return API_BASE_URL_EXPO;
  };

  // Función para obtener el perfil (reutilizable)
  const fetchUserProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = await AsyncStorage.getItem('userToken');
      console.log("Token obtenido:", token);

      if (!token) {
        setError("Token no encontrado. Por favor, inicia sesión.");
        setLoading(false);
        return;
      }

      const API_URL = getApiUrl();
      console.log('Llamando a:', `${API_URL}/profile`);

      const response = await axios.get<UserProfile>(`${API_URL}/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log("Perfil obtenido:", response.data);
      setUser(response.data);
      setLoading(false);

    } catch (err: any) {
      console.error("Error al obtener perfil:", err.response?.data || err.message);

      let errorMessage = "No se pudo cargar el perfil.";
      if (err.response?.status === 401) {
        errorMessage = "Sesión expirada. Por favor, vuelve a iniciar sesión.";
      } else if (err.message.includes('Network')) {
        errorMessage = "Error de conexión. Verifica el servidor.";
      }
      setError(errorMessage);
      setLoading(false);
    }
  }, []);

  // Cargar perfil CADA VEZ que la pantalla se enfoca
  useFocusEffect(
    useCallback(() => {
      console.log("📲 Pantalla perfil enfocada, recargando datos...");
      fetchUserProfile();
    }, [fetchUserProfile])
  );

  // Función para cerrar sesión
  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    setUser(null);
    router.replace('/login');
  };

  // Función para navegar a editar perfil
  const handleEditProfile = () => {
    router.push('/editPerfil');
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

  return (<>
    <NavBar />
    <ScrollView style={styles.container}>
      {/* Card datos del usuario */}
      <View style={styles.card}>
        <TouchableOpacity onPress={() => {
          setImgAmpliada(user.perfilImage);
          setModalVisible(true);
        }}>
          <Image
            source={{ uri: user.perfilImage || 'https://via.placeholder.com/150' }}
            style={styles.imageFlat}
          />
        </TouchableOpacity>
        <View >
          <Text style={styles.nombre}>{user.username}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value} numberOfLines={1} ellipsizeMode="tail">{user.email}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Teléfono:</Text>
          <Text style={styles.value} numberOfLines={1} ellipsizeMode="tail">{user.phone}</Text>
        </View>

        <View style={styles.separator} />

        {/* Botón para editar perfil */}
        <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
          <Text style={styles.textButtons}>EDITAR PERFIL</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.textButtons}>CERRAR SESIÓN</Text>
        </TouchableOpacity>

        {/* Modal para ver la imagen ampliada */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalFull}>
            <TouchableOpacity
              activeOpacity={1} // Evita que la imagen parpadee al tocarla
              style={styles.modalCerrarArea}
              onPress={() => setModalVisible(false)}
            >
              <Image
                source={{ uri: imgAmpliada }}
                style={styles.imageFull}
                resizeMode="contain" // Esto es vital para que no se corte ni se vea minúscula
              />
              <View style={styles.textoCerrar}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Cerrar</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>

      </View>
<Text style={styles.titulo}>Mis publicaciones</Text>
      {/* Card datos demascotas publicadas por el usuario */}
      <View style={styles.cardMascotas}>
        <TouchableOpacity onPress={() => {
          setImgAmpliada(user.perfilImage);
          setModalVisible(true);
        }}>
          <Image
            source={{ uri: user.perfilImage || 'https://via.placeholder.com/150' }}
            style={styles.imageFlat}
          />
        </TouchableOpacity>
        <View >
          <Text style={styles.nombre}>{user.username}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value} numberOfLines={1} ellipsizeMode="tail">{user.email}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Teléfono:</Text>
          <Text style={styles.value} numberOfLines={1} ellipsizeMode="tail">{user.phone}</Text>
        </View>

        <View style={styles.separator} />

        {/* Botón para editar perfil */}
        <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
          <Text style={styles.textButtons}>EDITAR PERFIL</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.textButtons}>CERRAR SESIÓN</Text>
        </TouchableOpacity>

        {/* Modal para ver la imagen ampliada */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalFull}>
            <TouchableOpacity
              activeOpacity={1} // Evita que la imagen parpadee al tocarla
              style={styles.modalCerrarArea}
              onPress={() => setModalVisible(false)}
            >
              <Image
                source={{ uri: imgAmpliada }}
                style={styles.imageFull}
                resizeMode="contain" // Esto es vital para que no se corte ni se vea minúscula
              />
              <View style={styles.textoCerrar}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Cerrar</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>

      </View>
    </ScrollView>
  </>
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
    marginTop: 70,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
  },
  cardMascotas: {
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
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  nombre: {
    fontSize: 22,
    fontWeight: '800',
    color: '#422790',
    textAlign: "center"
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 10,
  },
  value: {
    fontSize: 16,
    flex: 1,
    minWidth: 0,
    color: '#666',
    textAlign: 'right',
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
  editButton: {
    backgroundColor: '#452790',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderRadius: 40,
    alignItems: "center",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  logoutButton: {
    backgroundColor: '#f01250',
    paddingVertical: 12,
    paddingHorizontal: 20,
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
  },
  imageFlat: {
    width: 160, height: 160, marginVertical: 10, backgroundColor: "gray", borderRadius: 80, boxShadow: '0 6px 6px rgba(0, 0, 0, 0.29)', alignSelf: "center" // Sombra para el botón
  },
  modalFull: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)', // Fondo oscuro
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCerrarArea: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageFull: {
    width: '90%',
    height: '70%',
  },
  textoCerrar: {
    color: 'white',
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: '#452790',
    padding: 10,
    borderRadius: 20
  },
  titulo: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: "#452790",
    
  }
});