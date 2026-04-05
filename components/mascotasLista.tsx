import axios from "axios";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Linking,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

// URLs según plataforma (Igual que en tu pantalla de publicación)
const API_BASE_URL_WEB = 'http://localhost:8000/api';
const API_BASE_URL_EXPO = 'http://192.168.1.4:8000/api';

// Definición de las Props
interface MascotasListaProps {
  filtroValor?: "Perdido" | "Encontrado" | "En Adopción";
}
interface Mascota {
  _id: string;
  title: string;
  description: string;
  categoria: "Perdido" | "Encontrado" | "En Adopción";
  localidad: string;
  image: string;
  usuarioTelefono: string;

}

export default function MascotasLista({ filtroValor }: MascotasListaProps) {
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [imgAmpliada, setImgAmpliada] = useState("");


  const getApiUrl = () => {
    return Platform.OS === "web" ? API_BASE_URL_WEB : API_BASE_URL_EXPO;
  };

  const fetchMascotas = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${getApiUrl()}/mascotas/public`);
      setMascotas(response.data);
    } catch (error) {
      console.error("Error al obtener mascotas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMascotas();
  }, []);

  // Lógica de filtrado

  const renderItem = ({ item }: { item: Mascota }) => (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => {
        setImgAmpliada(item.image);
        setModalVisible(true);
      }}>
        <Image
          source={{ uri: item.image || 'https://via.placeholder.com/150' }}
          style={styles.cardImage}
        />
      </TouchableOpacity>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.title}</Text>
        </View>
        <View style={[styles.badge,
        { backgroundColor: item.categoria === 'Perdido' ? '#f01250' : item.categoria === 'Encontrado' ? '#452790' : '#f7a423' }
        ]}>
          <Text style={styles.badgeText}>{item.categoria}</Text>
        </View>
        <Text style={styles.cardLocation}>📍 {item.localidad}</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>{item.description}</Text>
        <TouchableOpacity onPress={() => router.push('/mascota')}>
          <Text>ver mas..</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.selectButton,
            !item.usuarioTelefono && styles.disabledButton
          ]}
          onPress={() => handleContactPress(item.usuarioTelefono ?? null)}
          disabled={!item.usuarioTelefono}
        >
          <Text style={[styles.blanco, { fontSize: 12, letterSpacing: 0.5 }]}>CONTACTAR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // --- Función para abrir WhatsApp ---
  const handleContactPress = async (telefono: string | null) => {
    if (!telefono) {
      Alert.alert("Sin contacto", "El usuario no ha proporcionado un número de teléfono.");
      return;
    }

    const numeroLimpio = telefono.replace(/[\s-()]/g, '');
    const url = `whatsapp://send?phone=${numeroLimpio}`;

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", `No se puede abrir WhatsApp. Asegúrate de que esté instalado.`);
      }
    } catch (error) {
      console.error("Error al intentar abrir WhatsApp:", error);
      Alert.alert("Error", "Ocurrió un problema al intentar contactar por WhatsApp.");
    }
  };


  return (
    <View style={styles.container}>


      {loading ? (
        <ActivityIndicator size="large" color="#452790" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={
            filtroValor
              ? mascotas.filter((m) => {
                const normalizar = (str: string) =>
                  str
                    .trim()
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, ""); // Quita tildes

                return normalizar(m.categoria) === normalizar(filtroValor);
              })
              : mascotas
          }
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No hay mascotas publicadas en esta categoría.</Text>
          }
        />
      )}

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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    marginBottom: 60,
  },
  headerTitle: {
    marginTop: 70,
    fontSize: 24,
    fontWeight: "bold",
    color: "#452790",
    textAlign: "center",
  },
  filterBar: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    paddingVertical: 15,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
  },
  filterActive: {
    backgroundColor: "#f7a423",
  },
  filterText: {
    fontSize: 12,
    color: "#333",
  },
  filterTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: "row",
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardImage: {
    width: 130,
    height: 150,
  },
  cardContent: {
    flex: 1,
    padding: 10,
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  cardLocation: {
    fontSize: 12,
    color: "#666",
    marginVertical: 2,
  },
  cardDescription: {
    fontSize: 13,
    color: "#444",
  },
  badge: {
    position: "absolute", // Lo saca del flujo normal
    top: 0,               // Pegado arriba
    right: 0,             // Pegado a la derecha
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderBottomLeftRadius: 10, // Opcional: queda estético redondear solo la esquina interna
    zIndex: 1, // Asegura que quede por encima de la imagen o texto
  },
  badgeText: {
    color: "#fff",
    fontSize: 8,
    fontWeight: "bold",
  },

  emptyText: {
    textAlign: "center",
    marginTop: 50,
    color: "#999",
  },
  selectButton: {
    position: "absolute",
    right: 2,
    bottom: 6,
    backgroundColor: "#20b548",
    color: '#e1e1e1',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 40,
    marginBottom: 0,
    marginTop: 10,
    elevation: 6,           // Sombra para Android
    shadowColor: "#000",    // Sombra para iOS
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.69,
    shadowRadius: 4.65,
    paddingHorizontal: 10,
    height: 34,
    alignItems: "center", // Centra el texto horizontalmente
    justifyContent: "space-around", // Centra el texto verticalmente
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: '#a0a0a0', // Color grisáceo para deshabilitado
    opacity: 0.7,
  },
  blanco: {
    color: "#ffffff", paddingRight: 2, fontWeight: "bold"
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)', // Fondo negro con opacidad
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '95%',
    height: '80%',
  },
  cerrarTexto: {
    color: '#fff',
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: '#452790',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
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
  }
});