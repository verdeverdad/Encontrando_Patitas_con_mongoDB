import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { NavBar } from "../components/NavBar";
import { createMascotaSchema } from "../server/schemas/mascotas.schemas";

// URLs según plataforma
const API_BASE_URL_WEB = 'http://localhost:8000/api';
const API_BASE_URL_EXPO = 'http://192.168.1.4:8000/api'; //  IP local de la red LAN.

export default function PublicarMascota() {
  const router = useRouter();
  const [user, setUser] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [mascotaImagen, setMascotaImagen] = useState<string | null>(null);
  const [image, setImage] = useState("");
  const [localidad, setLocalidad] = useState('');
  const [sexo, setSexo] = useState('No sabe'); // Valor por defecto
  const [categoria, setCategoria] = useState('Perdido'); // Valor por defecto
  const [telefono, setTelefono] = useState('');
  const [userToken, setUserToken] = useState<string | null>(null);

  // Obtener token y usuario al cargar el componente
  React.useEffect(() => {
    const getTokenAndUser = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const username = await AsyncStorage.getItem('username');
        
        setUserToken(token);
        
        if (username) {
          setUser(username);
          console.log("Usuario encontrado:", username);
        } else {
          console.warn("No hay usuario guardado. Por favor, inicia sesión.");
          router.push("/login");
        }
        
        if (token) {
          console.log("Token obtenido exitosamente");
        }
      } catch (error) {
        console.error("Error obteniendo datos:", error);
      }
    };
    getTokenAndUser();
  }, []);


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

  // Función para seleccionar imagen de perfil
  // Selección de imagen
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setMascotaImagen(result.assets[0].uri);
      setImage(result.assets[0].uri);
    }
  };

  // Subir a Cloudinary
  const uploadImageToCloudinary = async (imageUri: any) => {
    const data = new FormData();

   try {
      if (Platform.OS === "web") {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        data.append("file", blob);
      } else {
        // En mobile, el objeto debe tener esta estructura exacta
        // Extraemos la extensión del archivo para el tipo
        const uriParts = imageUri.split('.');
        const fileType = uriParts[uriParts.length - 1];

        data.append("file", {
          uri: imageUri,
          name: `photo.${fileType}`,
          type: `image/${fileType}`,
        } as any);
      }

      data.append("upload_preset", "Encontrando_Patitas");

      const res = await fetch("https://api.cloudinary.com/v1_1/dkn6snovy/image/upload", {
        method: "POST",
        body: data,
        // IMPORTANTE: No pongas Content-Type header aquí, 
        // el navegador/entorno lo hace automáticamente con el boundary correcto
      });

      const json = await res.json();
      
      if (!res.ok) {
        console.error("Error Cloudinary:", json);
        return null;
      }

      return json.secure_url;
    } catch (error) {
      console.error("Error en fetch Cloudinary:", error);
      return null;
    }
  };

  // Función de manejo de registro de mascota
  const handlePublicarMascota = async () => {
    setLoading(true);
    setErrors({});

    try {
      // 1. Validar con Zod (Asegúrate que los nombres coincidan con mascotas.schemas.js)
      const validationData = {
        title,
        description,
        localidad,
        sexo,
        categoria,
        usuarioNombre: user,
        usuarioTelefono: telefono,
      };

      const result = createMascotaSchema.safeParse(validationData);

      if (!result.success) {
        const newErrors: { [key: string]: string } = {};
        result.error.issues.forEach((issue: any) => {
          const field = issue.path[0] as string;
          newErrors[field] = issue.message;
        });
        setErrors(newErrors);
        setLoading(false);
        return;
      }

      // 2. Subir imagen
      let urlCloudinary = "";
      if (image) {
        const uploadedUrl = await uploadImageToCloudinary(image);
        if (!uploadedUrl) {
          setLoading(false);
          showAlert("Error", "No se pudo subir la imagen.");
          return;
        }
        urlCloudinary = uploadedUrl;
      }

      // 3. Enviar al Backend
      if (!userToken) {
        setLoading(false);
        showAlert("Error", "Sesión expirada. Inicia sesión nuevamente.");
        return;
      }

      const API_URL = getApiUrl();
      const payload = {
        ...validationData,
        image: urlCloudinary, // Aquí pasas la URL final
        date: new Date().toISOString(), // Formato estándar
      };

      const response = await axios.post(`${API_URL}/mascotas`, payload, {
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        }
      });

      showAlert("¡Éxito!", "Mascota publicada correctamente", "/encontrados");
      
      // Limpiar campos
      setTitle("");
      setDescription("");
      setImage("");
      setMascotaImagen(null);

    } catch (error: any) {
      console.error("Error completo:", error.response?.data || error.message);
      showAlert("Error", error.response?.data?.message || "Error al conectar con el servidor.");
    } finally {
      setLoading(false);
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
      <Text style={{ marginTop: 60, padding: 10, textAlign: "center", fontSize: 32, color: '#452790' }}>PUBLICAR MASCOTA</Text>

      <ScrollView style={styles.container}>
        <View style={styles.containerInicioSesion}>
          <Text style={styles.subtitle}>Por favor completa los datos de la mascota.</Text>
           <Text style={styles.label}>Título de la Publicación:</Text>
          <TextInput
            style={styles.inputRegister}
            placeholder="Título de la Publicación"
            value={title}
            onChangeText={setTitle}
          />
          {renderError('title')}

          <TextInput
            style={styles.inputRegister}
            placeholder="Descripción"
            value={description}
            onChangeText={setDescription}
            autoCapitalize="none"
          />
          {renderError('description')}
         
          <TextInput
            style={styles.inputRegister}
            placeholder="Localidad"
            value={localidad}
            onChangeText={setLocalidad}
          />
          {renderError('localidad')}

          {/* Input de Teléfono de contacto */}
          <TextInput
            style={styles.inputRegister}
            placeholder="Tu teléfono de contacto"
            value={telefono}
            onChangeText={setTelefono}
            keyboardType="phone-pad"
          />
          {renderError('usuarioTelefono')}

          {/* Selector simple para Categoría (Podés usar botones o un Picker) */}
          <View style={styles.selectorContainer}>
            <Text style={styles.label}>Estado de la mascota:</Text>
            <View style={styles.row}>
              {['Perdido', 'Encontrado', 'En Adopción'].map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[styles.miniButton, categoria === item && styles.activeButton]}
                  onPress={() => setCategoria(item)}
                >
                  <Text style={categoria === item ? styles.blanco : styles.negro}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
            { // se guarda la url de la imagen en este input 
            }
          <TextInput style={[styles.inputInicio, { display: "none" }]} placeholder="Ingrese URL de la imagen" value={image} onChangeText={setImage} />
          {
            !mascotaImagen &&
            <TouchableOpacity style={styles.buttonsSelectImage} onPress={pickImage}>
              <Text style={styles.blanco}>SELECCIONAR IMAGEN</Text>
            </TouchableOpacity>
          }

          {mascotaImagen && <Image source={{ uri: mascotaImagen }} style={styles.image} />}

          <TouchableOpacity
            style={styles.buttonsRegister}
            onPress={handlePublicarMascota}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.textButtons} >PUBLICAR MASCOTA</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonsCancelar}
            onPress={() => router.back()}
          >
            <Text style={styles.textButtons}>CANCELAR</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    borderColor: "#ffffff",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#FFFFFF",
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
    backgroundColor: "#f7f7f7",
  },
  tituloRegister: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#452790",
  },
  errorText: {
    color: '#fb3737',
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
    marginBottom: 0,
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
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  textButtons: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  image: {
    width: 160,
    height: 160,
    marginVertical: 10,
    backgroundColor: "gray",
    borderRadius: 80, boxShadow: '0 6px 6px rgba(0, 0, 0, 0.29)',
    alignSelf: "center" // Sombra para el botón
  },

  buttonsSelectImage: {
    backgroundColor: '#f7a423',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
    width: 280,
    alignItems: "center",
    justifyContent: "center",
    fontSize: 6,
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
  inputInicio: {
    height: 40,
    width: 280,
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 15,
    paddingHorizontal: 10,
  },
  blanco: {
    color: "#ffffff"
  },
  amarilloBg: {
    backgroundColor: "#f7a423"
  },
  selectorContainer: {
    marginTop: 15,
    width: 280,
  },
  label: {
    fontSize: 14,
    color: '#452790',
    marginBottom: 5,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    paddingVertical: 5,
    gap: 4,
  },
  miniButton: {
   paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
  },
  activeButton: {
    backgroundColor: '#452790',
    borderColor: '#452790',
  },
  negro: {
    color: '#000'
  }
});


