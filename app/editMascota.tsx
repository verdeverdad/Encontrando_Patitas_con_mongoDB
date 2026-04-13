import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, Alert, Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { NavBar } from "../components/NavBar";

const API_URL = Platform.OS === "web" ? 'http://localhost:8000/api' : 'http://192.168.1.4:8000/api';

export default function EditMascotaScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    // Estados del formulario
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [localidad, setLocalidad] = useState('');
    const [categoria, setCategoria] = useState('');
    const [image, setImage] = useState(''); // URL actual
    const [newImage, setNewImage] = useState<string | null>(null); // URI local nueva

    const [initialLoading, setInitialLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Cargar datos iniciales
    const fetchMascota = useCallback(async () => {
        try {
            const response = await axios.get(`${API_URL}/mascotas/${id}`);
            const m = response.data;
            setTitle(m.title);
            setDescription(m.description);
            setLocalidad(m.localidad);
            setCategoria(m.categoria);
            setImage(m.image);
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "No se pudieron cargar los datos.");
        } finally {
            setInitialLoading(false);
        }
    }, [id]);

    useFocusEffect(
        useCallback(() => {
            if (initialLoading) fetchMascota();
        }, [initialLoading, fetchMascota])
    );

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) {
            setNewImage(result.assets[0].uri);
        }
    };

    const uploadImage = async (uri: string) => {
        const data = new FormData();
        if (Platform.OS === "web") {
            const res = await fetch(uri);
            const blob = await res.blob();
            data.append("file", blob, "mascota.jpg");
        } else {
            data.append("file", { uri, name: "mascota.jpg", type: "image/jpeg" } as any);
        }
        data.append("upload_preset", "Encontrando_Patitas");
        
        const response = await fetch("https://api.cloudinary.com/v1_1/dkn6snovy/image/upload", {
            method: "POST",
            body: data,
        });
        const json = await response.json();
        return json.secure_url;
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            let finalImageUrl = image;

            if (newImage) {
                finalImageUrl = await uploadImage(newImage);
            }

            await axios.put(`${API_URL}/mascotas/${id}`, {
                title, description, localidad, categoria, image: finalImageUrl
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            Alert.alert("Éxito", "Publicación actualizada");
            router.replace('/perfil'); // Volvemos al perfil para ver los cambios
        } catch (error) {
            Alert.alert("Error", "No se pudo actualizar");
        } finally {
            setSaving(false);
        }
    };

    if (initialLoading) return <View style={styles.center}><ActivityIndicator size="large" color="#452790" /></View>;

    return (
        <View style={{ flex: 1 }}>
            <NavBar />
            <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: 80, paddingBottom: 40 }}>
                <Text style={styles.header}>EDITAR PUBLICACIÓN</Text>
                
                <View style={styles.card}>
                    <TouchableOpacity onPress={pickImage} style={styles.imagePlaceholder}>
                        <Image source={{ uri: newImage || image }} style={styles.img} />
                        <Text style={styles.changeImgText}>Cambiar Foto</Text>
                    </TouchableOpacity>

                    <Text style={styles.label}>Título</Text>
                    <TextInput style={styles.input} value={title} onChangeText={setTitle} />

                    <Text style={styles.label}>Localidad</Text>
                    <TextInput style={styles.input} value={localidad} onChangeText={setLocalidad} />

                    <Text style={styles.label}>Descripción</Text>
                    <TextInput 
                        style={[styles.input, { height: 80 }]} 
                        value={description} 
                        onChangeText={setDescription} 
                        multiline 
                    />

                    <TouchableOpacity 
                        style={[styles.btn, { backgroundColor: '#452790' }]} 
                        onPress={handleSave} 
                        disabled={saving}
                    >
                        {saving ? <ActivityIndicator color="white" /> : <Text style={styles.btnText}>GUARDAR CAMBIOS</Text>}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.btnCancel} onPress={() => router.back()}>
                        <Text style={styles.btnCancelText}>CANCELAR</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { fontSize: 24, fontWeight: 'bold', color: '#452790', textAlign: 'center', marginBottom: 20 },
    card: { backgroundColor: 'white', marginHorizontal: 20, padding: 20, borderRadius: 20, elevation: 5 },
    imagePlaceholder: { alignItems: 'center', marginBottom: 20 },
    img: { width: '100%', height: 200, borderRadius: 10 },
    changeImgText: { color: '#452790', fontWeight: 'bold', marginTop: 10 },
    label: { fontWeight: 'bold', color: '#666', marginBottom: 5 },
    input: { borderBottomWidth: 1, borderBottomColor: '#ddd', marginBottom: 20, paddingVertical: 5, fontSize: 16 },
    btn: { padding: 15, borderRadius: 25, alignItems: 'center', marginTop: 10 },
    btnText: { color: 'white', fontWeight: 'bold' },
    btnCancel: { padding: 15, alignItems: 'center' },
    btnCancelText: { color: '#f01250', fontWeight: 'bold' }
});