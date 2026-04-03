import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, Alert, Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { NavBar } from "../components/NavBar";
// Importar el esquema de validación, si también lo usas para la edición
import * as ImagePicker from "expo-image-picker";

// URLs según plataforma 
const API_BASE_URL = 'http://localhost:8000/api';
const API_BASE_URL_EXPO = 'http://192.168.1.4:8000/api';


// Interfaz para tipar los datos del usuario
interface UserProfile {
    id: string;
    username: string;
    email: string;
    phone: string;
    perfilImage?: string;
}

export default function EditarPerfilScreen() {
    const router = useRouter();
    // Estados para los campos (inicialmente vacíos o cargando)
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); // Contraseña se maneja aparte
    const [perfilImage, setPerfilImage] = useState<string | null>(null);
    const [initialLoading, setInitialLoading] = useState(true); // Carga inicial de datos
    const [updateLoading, setUpdateLoading] = useState(false); // Carga al guardar
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [image, setImage] = useState("");    // Seleccionar URL según plataforma
    const [newImage, setNewImage] = useState('')

    const getApiUrl = () => {
        if (Platform.OS === "web") {
            return API_BASE_URL;
        }
        return API_BASE_URL_EXPO;
    };

    // Función de utilidad para mostrar alertas y navegar
    const showAlertAndRedirect = (title: string, message: string, path?: any) => {
        if (Platform.OS === 'web') {
            // window.alert es sin callback; navegar después de que se cierre
            window.alert(`${title}\n\n${message}`);
            if (path) {
                // pequeño delay para asegurar que la alerta se cierre antes de navegar
                setTimeout(() => router.push(path), 100);
            }
            return;
        }
        // En mobile usamos Alert.alert con callback
        Alert.alert(
            title,
            message,
            [{ text: "OK", onPress: () => { if (path) router.push(path); } }],
            { cancelable: false }
        );
    };
    // Selección de imagen
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            const localURI = result.assets[0].uri;

            console.log("Imagen seleccionada:", localURI);
            // Guardar imagen local para subirla al guardar cambios
            setNewImage(localURI);
            // 👇 ESTO es lo que hace que se vea al instante
            setPerfilImage(localURI);


        }
    };


    // Subir a Cloudinary
    const uploadImageToCloudinary = async (imageUri: any) => {
        const data = new FormData();
        if (Platform.OS === "web") {
            // 1. Usamos fetch(imageUri) para cargar el archivo en la memoria del navegador como un Blob.
            const response = await fetch(imageUri);
            const blob = await response.blob();
            // 2. Adjuntamos el Blob al FormData con un nombre de archivo.
            data.append("file", blob, "profile_upload.jpg");
        } else {
            data.append("file", {
                uri: imageUri,
                type: "image/jpeg",
                name: "profile.jpg",
            } as any);
        }
        data.append("upload_preset", "Encontrando_Patitas");
        data.append("cloud_name", "dkn6snovy");

        try {
            let res = await fetch("https://api.cloudinary.com/v1_1/dkn6snovy/image/upload", {
                method: "POST",
                body: data,
                headers: { "Content-Type": "multipart/form-data" },
            });

            let json = await res.json();
            return json.secure_url;

        } catch (error) {
            console.log("Error Cloudinary:", error);
            return null;
        }
    };

    // ==========================================================
    // PASO 1: CARGAR DATOS DEL USUARIO EXISTENTE
    // ==========================================================
    const fetchCurrentData = useCallback(async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                showAlertAndRedirect("Error", "Sesión no iniciada.", "/login");
                return;
            }
            const API_URL = getApiUrl();
            const response = await axios.get<UserProfile>(`${API_URL}/profile`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // Pre-cargar los estados con los datos existentes
            const userData = response.data;
            setUsername(userData.username);
            setEmail(userData.email);
            setPhone(userData.phone);
            setPerfilImage(userData.perfilImage || null);

        } catch (error) {
            console.error("Error al cargar datos iniciales:", error);
            Alert.alert("Error de Carga", "No se pudieron obtener los datos del perfil.");
        } finally {
            setInitialLoading(false);
        }
    },

        [getApiUrl]);




    useFocusEffect(
        useCallback(() => {
            fetchCurrentData();
        }, [fetchCurrentData])
    );
    // ==========================================================
    // PASO 2: MANEJAR LA ACTUALIZACIÓN
    // ==========================================================
    const handleUpdate = async () => {
        setUpdateLoading(true);

        try {
            let urlCloudinary = perfilImage; // valor actual por defecto

            // SI SELECCIONÓ IMAGEN NUEVA → subir a Cloudinary
            if (newImage) {
                const uploadedUrl = await uploadImageToCloudinary(newImage);
                if (!uploadedUrl) {
                    return showAlertAndRedirect("Error de Imagen", "No se pudo subir la imagen.");
                }
                urlCloudinary = uploadedUrl;
                
            }

            const token = await AsyncStorage.getItem("userToken");
            const API_URL = getApiUrl();

            const dataToUpdate = {
                username,
                phone,
                email,
                password: password || undefined,
                perfilImage: urlCloudinary,  
            };

            const response = await axios.put(`${API_URL}/profile`, dataToUpdate, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("Perfil actualizado:", response.data);

            showAlertAndRedirect("Éxito", "Perfil actualizado correctamente", "/perfil");

        } catch (error) {
            console.error("Error:", error);
            Alert.alert("Error", "No se pudo actualizar tu perfil.");
        } finally {
            setUpdateLoading(false);
        }
    };

    // Función para mostrar el error específico de un campo
    const renderError = (field: string) => {
        if (errors[field]) {
            return <Text style={styles.errorText}>{errors[field]}</Text>;
        }
        return null;
    };

    if (initialLoading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#452790" />
                <Text style={styles.loadingText}>Cargando datos actuales...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <NavBar />
            <Text style={{ marginTop: 60, padding: 10, textAlign: "center", fontSize: 32, color: '#452790' }}>EDITAR PERFIL</Text>

            <View style={styles.card}>
                <Text style={styles.subtitle}>Modifica los campos que desees actualizar.</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Nombre de Usuario"
                    value={username}
                    onChangeText={setUsername}
                />
                {renderError('username')}

                <TextInput
                    style={styles.input}
                    placeholder="Correo Electrónico"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                {renderError('email')}

                <TextInput
                    style={styles.input}
                    placeholder="Telefono"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                />
                {renderError('phone')}

                {/* Campo de contraseña es opcional para actualizar */}
                <TextInput
                    style={styles.input}
                    placeholder="Contraseña (dejar vacío si no quieres cambiar)"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                {renderError('password')}


                {perfilImage && <Image source={{ uri: perfilImage }} style={styles.image} />}

                <TextInput style={[styles.input, { display: "none" }]} placeholder="Ingrese URL de la imagen" value={image} onChangeText={setImage} />

                <TouchableOpacity style={[styles.buttonsInicio, styles.amarilloBg, { marginTop: 15 }]} onPress={pickImage}>
                    <Text style={styles.blanco}>SELECCIONAR IMAGEN</Text>
                </TouchableOpacity>


                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleUpdate}
                    disabled={updateLoading}
                >
                    {updateLoading ? (
                        <ActivityIndicator color="#ffffff" />
                    ) : (
                        <Text style={styles.textButton}>GUARDAR CAMBIOS</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => router.back()} // Vuelve a la pantalla anterior (PerfilScreen)
                >
                    <Text style={styles.textButton}>CANCELAR</Text>
                </TouchableOpacity>

            </View>
        </ScrollView>
    )

}



const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f8f8' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 10, fontSize: 16, color: '#452790' },
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
        marginBottom: 5,
        color: '#452790',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        height: 45,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        marginTop: 15,
        paddingHorizontal: 15,
        backgroundColor: '#f7f7f7',
    },
    errorText: {
        color: '#f01250',
        fontSize: 12,
        alignSelf: 'flex-start',
        marginTop: 4,
        marginLeft: 5,
    },
    saveButton: {
        backgroundColor: '#452790',
        paddingVertical: 12,
        marginTop: 30,
        borderRadius: 40,
        alignItems: "center",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 6,
    },
    cancelButton: {
        backgroundColor: '#f01250',
        paddingVertical: 12,
        marginTop: 15,
        borderRadius: 40,
        alignItems: "center",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 6,
    },
    textButton: {
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
    blanco: {
        color: "#ffffff"
    },
    amarilloBg: {
        backgroundColor: "#f7a423"
    },
    buttonsInicio: {
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
});