import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';


export default function SignUpScreen() {
    const [nombre, setNombre] = useState('');

    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');


    return (
       
            <View style={styles.container}>
                <View style={styles.containerInicioSesion}>
                    <Text style={styles.titulo}>Registrarse</Text>
                    <TextInput style={styles.inputInicio} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
                    <TextInput style={styles.inputInicio} placeholder="Correo Electrónico" value={emailAddress} onChangeText={setEmailAddress} />
                    <TextInput style={styles.inputInicio} placeholder="Telefono" value={'telefono'} />
                    <TextInput style={styles.inputInicio} placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
                    <TextInput style={[styles.inputInicio, { display: "none" }]} placeholder="Ingrese URL de la imagen" value={'image'} />

                    <TouchableOpacity style={[styles.buttonsInicio, styles.celesteBg]}>
                        <Text style={styles.blanco}>REGISTRARME</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.buttonsInicio, styles.rojoBg]} >
                        <Text style={styles.blanco}>CANCELAR</Text>
                    </TouchableOpacity>

                </View>
            </View>
       

    );

}

const styles = StyleSheet.create({
    listContentContainer: { // Estilo opcional para añadir padding al contenido de la lista
        paddingHorizontal: 0, // Ejemplo: añade padding horizontal
        paddingBottom: 0, // Ejemplo: añade espacio al final
    },
    datosContainer: { // Estilo opcional para los botones en el footer
        margin: 10, // Ejemplo: añade espacio sobre los botones
        padding: 15, // Ejemplo: alinea con el padding general si es necesario
        alignItems: "center",
        borderRadius: 5,
        backgroundColor: "#e1e1e1",
    },
    container: {
        flex: 1,
        padding: 5,

    },
    containerInicioSesion: {
        marginHorizontal: 15,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputInicio: {
        height: 40,
        width: 280,
        borderColor: "gray",
        borderWidth: 1,
        marginTop: 15,
        paddingHorizontal: 10,
    },
    buttonsInicio: {
        borderWidth: 2,
        color: '#ffffff',
        borderColor: 'white',
        borderRadius: 40,
        marginBottom: 20,
        boxShadow: '0 6px 6px rgba(0, 0, 0, 0.39)', // Sombra para el botón
        width: 240,
        fontSize: 15,
        height: 50,
        alignItems: "center", // Centra el texto horizontalmente
        justifyContent: "center", // Centra el texto verticalmente
    },
    buttonsList: {
        borderWidth: 2,
        color: '#ffffff',
        borderColor: 'white',
        borderRadius: 40,
        marginBottom: 20,
        boxShadow: '0 6px 6px rgba(0, 0, 0, 0.39)', // Sombra para el botón
        width: 140,
        fontSize: 15,
        height: 50,
        alignItems: "center", // Centra el texto horizontalmente
        justifyContent: "center", // Centra el texto verticalmente
    },
    titulo: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
        color: "#452790",
    },
    titulo2: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#452790",
    },
    tituloPublicaciones: {
        fontSize: 24,
        fontWeight: "bold",
        marginVertical: 15,
        textAlign: "center",
        color: "#452790",
    },
    input: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        margin: 10,
        paddingHorizontal: 10,
    },


    safeArea: { flex: 1 },
    details: { flex: 1, margin: 15 },
    edad: { fontSize: 14, color: "gray", paddingBottom: 5 },
    correo: { fontSize: 18, color: "#452790", paddingBottom: 5 },
    sexo: { fontSize: 14, color: "gray" },
    localidad: { fontSize: 14, color: "gray" },
    estado: { fontSize: 16, color: "#f01250", fontWeight: "bold", textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 5, },
    image: {
        width: 160, height: 160, marginVertical: 10, backgroundColor: "gray", borderRadius: 80, boxShadow: '0 6px 6px rgba(0, 0, 0, 0.29)', alignSelf: "center" // Sombra para el botón
    },
    imageFlat: {
        width: 160, height: 260, marginBottom: 10, backgroundColor: "gray", borderRadius: 10, boxShadow: '0 6px 6px rgba(0, 0, 0, 0.39)', // Sombra para el botón
    },
    picker: { height: 60, width: "100%", marginTop: 0 },
    label: {
        paddingVertical: 5,
        marginHorizontal: 10,
    },

    selectButton: {
        borderWidth: 2,
        backgroundColor: "#f01250",
        color: '#ffffff',
        borderColor: 'white',
        borderRadius: 20,
        marginBottom: 10,
        boxShadow: '0 6px 6px rgba(0, 0, 0, 0.39)', // Sombra para el botón
        width: 'auto',
        fontSize: 16,
        height: 40,
        alignItems: "center", // Centra el texto horizontalmente
        justifyContent: "center", // Centra el texto verticalmente
    },

    item: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#452790',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.29)', // Sombra para el botón

    },

    buttons: {
        borderWidth: 2,
        backgroundColor: "#018cae",
        color: '#ffffff',
        borderColor: 'white',
        borderRadius: 40,
        marginBottom: 10,
        marginTop: 10,
        boxShadow: '0 6px 6px rgba(0, 0, 0, 0.39)', // Sombra para el botón
        width: 240,
        fontSize: 15,
        height: 50,
        alignItems: "center", // Centra el texto horizontalmente
        justifyContent: "center", // Centra el texto verticalmente
    },

    buttons2: {
        borderWidth: 2,
        backgroundColor: "#f7a423",
        color: '#ffffff',
        borderColor: 'white',
        borderRadius: 40,
        marginBottom: 10,
        boxShadow: '0 6px 6px rgba(0, 0, 0, 0.39)', // Sombra para el botón
        width: 240,
        fontSize: 15,
        height: 50,
        alignItems: "center", // Centra el texto horizontalmente
        justifyContent: "center", // Centra el texto verticalmente
    },
    buttons3: {
        borderWidth: 2,
        backgroundColor: "#f01250",
        color: '#ffffff',
        borderColor: 'white',
        borderRadius: 40,
        marginBottom: 10,
        boxShadow: '0 6px 6px rgba(0, 0, 0, 0.39)', // Sombra para el botón
        width: 240,
        fontSize: 15,
        height: 50,
        alignItems: "center", // Centra el texto horizontalmente
        justifyContent: "center", // Centra el texto verticalmente
    },
    rojo: {
        color: "#f01250"
    },

    violeta: {
        color: "#a31288"
    },
    celeste: {
        color: "#018cae"
    },
    verde: {
        color: "#28cf54"
    },
    amarillo: {
        color: "#f7a423"
    },
    azulado: {
        color: "#452790"
    },
    blanco: {
        color: "#ffffff"
    },
    rojoBg: {
        backgroundColor: "#f01250"
    },

    violetaBg: {
        backgroundColor: "#a31288"
    },
    celesteBg: {
        backgroundColor: "#018cae"
    },
    verdeBg: {
        backgroundColor: "#28cf54"
    },
    amarilloBg: {
        backgroundColor: "#f7a423"
    },
    azuladoBg: {
        backgroundColor: "#452790"
    },
    blancoBg: {
        backgroundColor: "#ffffff"
    },
});