import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
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
  filtroValor?: "Perdido" | "Encontrado" | "En Adopción" | "Todos";
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

export default function MascotasLista({ filtroValor = "Todos" }: MascotasListaProps) {
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estado interno por si queremos cambiar el filtro dentro de la misma pantalla
  const [filtroInterno, setFiltroInterno] = useState(filtroValor);

  const getApiUrl = () => {
    return Platform.OS === "web" ? API_BASE_URL_WEB : API_BASE_URL_EXPO;
  };

  const fetchMascotas = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${getApiUrl()}/mascotas`);
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

  // Sincronizar el filtro interno si la prop cambia
  useEffect(() => {
    setFiltroInterno(filtroValor);
  }, [filtroValor]);
// Lógica de filtrado
  const mascotasFiltradas = filtroInterno === "Todos" 
    ? mascotas 
    : mascotas.filter(m => m.categoria.toLowerCase() === filtroInterno.toLowerCase());

  const renderItem = ({ item }: { item: Mascota }) => (
    <View style={styles.card}>
      <Image 
        source={{ uri: item.image || 'https://via.placeholder.com/150' }} 
        style={styles.cardImage} 
      />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <View style={[
            styles.badge, 
            { backgroundColor: item.categoria === 'Perdido' ? '#f01250' :  '#f7a423' }
          ]}>
            <Text style={styles.badgeText}>{item.categoria}</Text>
          </View>
        </View>
        <Text style={styles.cardLocation}>📍 {item.localidad}</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Solo mostramos la barra de filtros si no se especificó un filtro fijo o si es "Todos" */}
      {filtroValor === "Todos" && (
        <View style={styles.filterBar}>
          {["Todos", "Perdido", "Encontrado", "En Adopción"].map((opcion) => (
            <TouchableOpacity
              key={opcion}
              style={[styles.filterButton, filtroInterno === opcion && styles.filterActive]}
              onPress={() => setFiltroInterno(opcion as any)}
            >
              <Text style={[styles.filterText, filtroInterno === opcion && styles.filterTextActive]}>
                {opcion}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#452790" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={mascotasFiltradas}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No hay mascotas publicadas en esta categoría.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
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
    borderRadius: 15,
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
    width: 120,
    height: 120,
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
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 5,
    marginVertical: 5,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 13,
    color: "#444",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    color: "#999",
  }
});