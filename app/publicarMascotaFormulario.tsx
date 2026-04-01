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

export default function Register() {
  const router = useRouter();
  const [user, setUser] = useState('user');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [perfilImage, setPerfilImage] = useState<string | null>(null);
  const [image, setImage] = useState("");
  const [localidad, setLocalidad] = useState('');
  const [sexo, setSexo] = useState('No sabe'); // Valor por defecto
  const [categoria, setCategoria] = useState('Perdido'); // Valor por defecto
  const [telefono, setTelefono] = useState('');

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
      setPerfilImage(result.assets[0].uri);
      setImage(result.assets[0].uri);
    }
  };

  // Subir a Cloudinary
  const uploadImageToCloudinary = async (imageUri: any) => {
    const data = new FormData();

    if (Platform.OS === "web") {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      data.append("file", blob, "profile_upload.jpg");
    } else {
      // En mobile, el objeto debe ser exacto
      data.append("file", {
        uri: imageUri,
        type: "image/jpeg",
        name: "upload.jpg",
      } as any);
    }

    data.append("upload_preset", "Encontrando_Patitas");

    try {
      let res = await fetch("https://api.cloudinary.com/v1_1/dkn6snovy/image/upload", {
        method: "POST",
        body: data,
        // ¡BORRÁ EL HEADER CONTENT-TYPE! Dejá que el sistema lo ponga solo.
      });

      let json = await res.json();
      if (json.secure_url) {
        return json.secure_url;
      } else {
        console.log("Cloudinary Error JSON:", json);
        return null;
      }
    } catch (error) {
      console.log("Error Cloudinary:", error);
      return null;
    }
  };

  // Función de manejo de registro
  const handleRegister = async () => {
    setLoading(true);
    setErrors({});

    try {
      // 1. Validar
      const result = createMascotaSchema.safeParse({
        usuarioNombre: user,
        title,
        description,
        date,
        localidad,
        sexo,
        categoria,
        usuarioTelefono: telefono,
        
      });

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

      // 2. Subir imagen SOLO UNA VEZ
      let urlCloudinary = null;
      if (image) {
        urlCloudinary = await uploadImageToCloudinary(image);
        console.log("URL Cloudinary:", urlCloudinary);
      }

      const API_URL = getApiUrl();

      // 3. Registrar mascota con la URL de cloudinary
      const response = await axios.post(`${API_URL}/mascotas`, { // Ojo, pusiste /mascota (singular) y en el router es /mascotas (plural)
        title,
        description,
        localidad,
        categoria,
        sexo,
        usuarioNombre: user,
        usuarioTelefono: telefono,
        image: urlCloudinary, // La URL que te devolvió Cloudinary
        date: new Date(),
      });
      console.log("Registro exitoso de mascota:", response.data);

      // 4. Guardar token
      const token = response.data.token;
      if (token) {
        await AsyncStorage.setItem("userToken", token);
      }

      // 5. Limpiar
      setUser("");
      setDescription("");
      setDate("");
      setTitle("");
      setImage("");
      setPerfilImage(null);

      setLoading(false);

      showAlert("Registro Exitoso", "¡Tu cuenta ha sido creada!", "/encontrados");

    } catch (error: any) {
      console.error("Error de registro:", error.response?.data || error.message);
      setLoading(false);
      showAlert("Error", error.response?.data?.message || "Ocurrió un error.");
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
            placeholder="Nombre de Usuario"
            value={user}
            onChangeText={setUser}
            autoCapitalize="none"
          />
          {renderError('user')}

          <TextInput
            style={styles.inputRegister}
            placeholder="Fecha de publicación"
            value={date}
            onChangeText={setDate}
          />
          {renderError('date')}
          {/* Input de Localidad - CLAVE PARA URUGUAY */}
          <TextInput
            style={styles.inputRegister}
            placeholder="Localidad (Ej: Ciudad de la Costa)"
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
            !perfilImage &&
            <TouchableOpacity style={styles.buttonsSelectImage} onPress={pickImage}>
              <Text style={styles.blanco}>SELECCIONAR IMAGEN</Text>
            </TouchableOpacity>
          }

          {perfilImage && <Image source={{ uri: perfilImage }} style={styles.image} />}

          <TouchableOpacity
            style={styles.buttonsRegister}
            onPress={handleRegister}
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
    fontWeight: 'bold'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  miniButton: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: '#f7f7f7',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  activeButton: {
    backgroundColor: '#452790',
    borderColor: '#452790',
  },
  negro: {
    color: '#000'
  }
});

function dispatch(arg0: any) {
  throw new Error("Function not implemented.");
}
function updateProfileImage(url: any): any {
  throw new Error("Function not implemented.");
}

