import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { NavBar } from "../components/NavBar";
// Importar el esquema de validación, si también lo usas para la edición
import { registerSchema } from "../lib/auth.schemas";

// URLs según plataforma 
const API_BASE_URL = 'http://localhost:8000/api';
const API_BASE_URL_EXPO = 'http://192.168.1.4:8000/api';


// Interfaz para tipar los datos del usuario
interface UserProfile {
    id: string;
    username: string;
    email: string;
    phone: string;
}

export default function EditarPerfilScreen() {
    const router = useRouter();
    // Estados para los campos (inicialmente vacíos o cargando)
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); // Contraseña se maneja aparte

    const [initialLoading, setInitialLoading] = useState(true); // Carga inicial de datos
    const [updateLoading, setUpdateLoading] = useState(false); // Carga al guardar
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Seleccionar URL según plataforma
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

    // ==========================================================
    // PASO 1: CARGAR DATOS DEL USUARIO EXISTENTE
    // ==========================================================
    useEffect(() => {
        const fetchCurrentData = async () => {
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

            } catch (error) {
                console.error("Error al cargar datos iniciales:", error);
                Alert.alert("Error de Carga", "No se pudieron obtener los datos del perfil.");
            } finally {
                setInitialLoading(false);
            }
        };

        fetchCurrentData();
    }, []);

    // ==========================================================
    // PASO 2: MANEJAR LA ACTUALIZACIÓN
    // ==========================================================
    const handleUpdate = async () => {
        setUpdateLoading(true);
        setErrors({});

        try {
            const dataToUpdate = { username, phone, email, password: password || undefined };

            // Opcional: Validación en el frontend (puedes usar el mismo schema o uno modificado)
            // Nota: Zod te permite hacer validaciones parciales (para un PATCH)
            const validationResult = registerSchema.partial().safeParse(dataToUpdate);

            if (!validationResult.success) {
                const newErrors: { [key: string]: string } = {};
                validationResult.error.issues.forEach(issue => {
                    const field = issue.path[0] as string;
                    newErrors[field] = issue.message;
                });
                setErrors(newErrors);
                setUpdateLoading(false);
                return;
            }

            const token = await AsyncStorage.getItem('userToken');
            const API_URL = getApiUrl();
            // Envía la petición PUT/PATCH al servidor. Usamos PATCH para actualizar parcialmente.
            const response = await axios.put(`${API_URL}/profile`, validationResult.data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log("Actualización exitosa:", response.data);

            // Limpia la contraseña para seguridad
            setPassword('');
            setUpdateLoading(false);

            // usar la función que soporta web y mobile
            showAlertAndRedirect("Éxito", "¡Tu perfil ha sido actualizado correctamente!", "/perfil");
        

        } catch (error: any) {
            console.error("Error al actualizar perfil:", error.response?.data || error.message);

            let errorMessage = "Ocurrió un error al guardar los cambios.";
            if (error.response?.data?.message) {
                errorMessage = Array.isArray(error.response.data.message)
                    ? error.response.data.message.join('\n')
                    : error.response.data.message;
            }

            Alert.alert("Error de Actualización", errorMessage);

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

            <View style={[styles.card, { marginTop: 50 }]}>
                <Text style={styles.header}>Editar Perfil</Text>
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
    );
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
        color: '#ff0000',
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
});