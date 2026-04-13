import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, Linking, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NavBar } from "../components/NavBar";

const API_URL = Platform.OS === "web" ? 'http://localhost:8000/api' : 'http://192.168.1.4:8000/api';

export default function MascotaDetalle() {
  const { id } = useLocalSearchParams(); // Capturamos el ID de la mascota
  const router = useRouter();
  const [mascota, setMascota] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMascota = async () => {
      try {
        const response = await axios.get(`${API_URL}/mascotas/${id}`);
        setMascota(response.data);
      } catch (error) {
        console.error("Error al cargar detalle:", error);
        Alert.alert("Error", "No se pudo cargar la información de la mascota.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchMascota();
  }, [id]);

  const handleWhatsApp = () => {
    const tel = mascota.usuarioTelefono.replace(/[\s-()]/g, '');
    const url = `whatsapp://send?phone=${tel}&text=Hola! Vi a ${mascota.title} en Encontrando Patitas...`;
    Linking.openURL(url).catch(() => Alert.alert("Error", "Asegúrate de tener WhatsApp instalado"));
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#452790" /></View>;
  if (!mascota) return <View style={styles.center}><Text>No se encontró la mascota.</Text></View>;

  return (
    <View style={{ flex: 1 }}>
      <NavBar />
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        <Image source={{ uri: mascota.image }} style={styles.mainImage} resizeMode="cover" />
        
        <View style={styles.infoContainer}>
          <View style={[styles.badge, { backgroundColor: mascota.categoria === 'Perdido' ? '#f01250' : mascota.categoria === 'Encontrado' ? '#452790' : '#f7a423' }]}>
            <Text style={styles.badgeText}>{mascota.categoria}</Text>
          </View>

          <Text style={styles.title}>{mascota.title}</Text>
          <Text style={styles.location}>📍 {mascota.localidad}</Text>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descripción</Text>
            <Text style={styles.description}>{mascota.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contacto</Text>
            <Text style={styles.contactInfo}>Publicado por: {mascota.usuarioNombre || 'Usuario'}</Text>
          </View>

          <TouchableOpacity style={styles.btnWhatsapp} onPress={handleWhatsApp}>
            <Text style={styles.btnText}>CONTACTAR POR WHATSAPP</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnBack} onPress={() => router.back()}>
            <Text style={[styles.btnText, { color: '#452790' }]}>VOLVER</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', marginTop: 70 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  mainImage: { width: '100%', height: 350 },
  infoContainer: { padding: 20,  backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  location: { fontSize: 16, color: '#666', marginBottom: 15 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10, marginBottom: 10 },
  badgeText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  section: { marginVertical: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#452790', marginBottom: 5 },
  description: { fontSize: 16, color: '#444', lineHeight: 24 },
  contactInfo: { fontSize: 16, color: '#555' },
  btnWhatsapp: { backgroundColor: '#25D366', padding: 16, borderRadius: 15, alignItems: 'center', marginTop: 20 },
  btnBack: { padding: 16, borderRadius: 15, alignItems: 'center', marginTop: 10, borderWidth: 1, borderColor: '#452790' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});