import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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

interface Mascota {
  _id: string;
  title: string;
  description: string;
  categoria: string;
  localidad: string;
  image: string;
}

export default function PerfilScreen() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [imgAmpliada, setImgAmpliada] = useState("");

  const getApiUrl = () => {
    return Platform.OS === "web" ? API_BASE_URL : API_BASE_URL_EXPO;
  };

  const fetchUserMascotas = useCallback(async (token: string) => {
    try {
      const API_URL = getApiUrl();
      const response = await axios.get<Mascota[]>(`${API_URL}/mascotas`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setMascotas(response.data);
    } catch (error) {
      console.error("Error obteniendo mascotas:", error);
    }
  }, []);

  const fetchUserProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = await AsyncStorage.getItem('userToken');

      if (!token) {
        setError("Token no encontrado. Por favor, inicia sesión.");
        setLoading(false);
        return;
      }

      const API_URL = getApiUrl();
      const response = await axios.get<UserProfile>(`${API_URL}/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setUser(response.data);
      await fetchUserMascotas(token);
      setLoading(false);
    } catch (err: any) {
      let errorMessage = "No se pudo cargar el perfil.";
      if (err.response?.status === 401) {
        errorMessage = "Sesión expirada. Por favor, vuelve a iniciar sesión.";
      } else if (err.message.includes('Network')) {
        errorMessage = "Error de conexión. Verifica el servidor.";
      }
      setError(errorMessage);
      setLoading(false);
    }
  }, [fetchUserMascotas]);

  const handleDeleteMascota = useCallback(async () => {
    if (!mascotaToDelete) return;

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      const API_URL = getApiUrl();
      await axios.delete(`${API_URL}/mascotas/${mascotaToDelete._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setDeleteModalVisible(false);
      setMascotaToDelete(null);
      await fetchUserMascotas(token);
    } catch (error) {
      console.error("Error eliminando mascota:", error);
      setDeleteModalVisible(false);
      setMascotaToDelete(null);
    }
  }, [mascotaToDelete, fetchUserMascotas]);
const confirmarEliminacion = (mascota: Mascota) => {
  Alert.alert(
    "Eliminar Publicación",
    `¿Estás seguro de que quieres eliminar a "${mascota.title}"? Esta acción no se puede deshacer.`,
    [
      {
        text: "Cancelar",
        style: "cancel", // Esto le da el diseño gris/secundario
      },
      {
        text: "Eliminar",
        style: "destructive", // En iOS sale en rojo automáticamente
        onPress: () => handleDeleteMascota(mascota._id),
      },
    ],
    { cancelable: true } // Permite cerrar la alerta tocando afuera
  );
};
  useFocusEffect(
    useCallback(() => {
      fetchUserProfile();
    }, [fetchUserProfile])
  );

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    setUser(null);
    router.replace('/login');
  };

  const handleEditProfile = () => {
    router.push('/editPerfil');
  };

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

  return (
    <View style={{ flex: 1, backgroundColor: '#f8f8f8' }}>
      <NavBar />
      <ScrollView style={styles.container}>
        {/* Card datos del usuario */}
        <View style={styles.card}>
          <TouchableOpacity onPress={() => { setImgAmpliada(user.perfilImage); setModalVisible(true); }}>
            <Image source={{ uri: user.perfilImage || 'https://via.placeholder.com/150' }} style={styles.imageFlat} />
          </TouchableOpacity>
          <Text style={styles.nombre}>{user.username}</Text>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value} numberOfLines={1}>{user.email}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Teléfono:</Text>
            <Text style={styles.value} numberOfLines={1}>{user.phone}</Text>
          </View>
          <View style={styles.separator} />
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Text style={styles.textButtons}>EDITAR PERFIL</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.textButtons}>CERRAR SESIÓN</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.titulo}>Mis publicaciones</Text>

        <View style={styles.mascotasSection}>
          {mascotas.length === 0 ? (
            <Text style={styles.noMascotasText}>No has publicado ninguna mascota aún.</Text>
          ) : (
            mascotas.map((mascota) => (
              <View key={mascota._id} style={styles.mascotaCard}>
                <TouchableOpacity onPress={() => { setImgAmpliada(mascota.image); setModalVisible(true); }}>
                  <Image source={{ uri: mascota.image || 'https://via.placeholder.com/150' }} style={styles.mascotaImage} resizeMode="cover" />
                </TouchableOpacity>
                <View style={styles.mascotaInfo}>
                  <Text style={styles.mascotaTitle}>{mascota.title}</Text>
                  <View style={[styles.badge, { backgroundColor: mascota.categoria === 'Perdido' ? '#f01250' : mascota.categoria === 'Encontrado' ? '#452790' : '#f7a423' }]}>
                    <Text style={styles.badgeText}>{mascota.categoria}</Text>
                  </View>
                  <Text style={styles.mascotaLocalidad}>📍 {mascota.localidad}</Text>
                  <Text style={styles.mascotaDescription} numberOfLines={2}>{mascota.description}</Text>
                  <View style={styles.mascotaActions}>
                    <TouchableOpacity style={[styles.actionButton, styles.editAction]} onPress={() => router.push(`/editMascota?id=${mascota._id}`)}>
                      <Text style={styles.actionText}>✏️ Editar</Text>
                    </TouchableOpacity>
                   <TouchableOpacity
                      style={[styles.actionButton, styles.deleteAction]}
                      onPress={() => confirmarEliminacion(mascota)}
>
  <Text style={styles.actionText}>🗑️ Eliminar</Text>
</TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* --- MODALES AL FINAL (FUERA DEL SCROLLVIEW) --- */}
      
      {/* 1. Modal de Imagen */}
      <Modal visible={modalVisible} transparent={true} animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalFull}>
          <TouchableOpacity activeOpacity={1} style={styles.modalCerrarArea} onPress={() => setModalVisible(false)}>
            <Image source={{ uri: imgAmpliada }} style={styles.imageFull} resizeMode="contain" />
            <View style={styles.textoCerrar}><Text style={{ color: 'white', fontWeight: 'bold' }}>Cerrar</Text></View>
          </TouchableOpacity>
        </View>
      </Modal>

     
    </View>
  );
}