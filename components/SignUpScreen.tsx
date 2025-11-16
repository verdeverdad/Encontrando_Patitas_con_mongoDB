import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignUpScreen() {
    const [nombre, setNombre] = useState('');
    const [telefono, setTelefono] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    

    return (
        <View style={styles.container}>
            <View style={styles.containerInicioSesion}>
                <Text style={styles.tituloRegister}>Registrarse</Text>
                <TextInput style={styles.inputRegister} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
                <TextInput style={styles.inputRegister} placeholder="Correo Electrónico" value={emailAddress} onChangeText={setEmailAddress} />
                <TextInput style={styles.inputRegister} placeholder="Telefono" value={telefono} onChangeText={setTelefono} />
                <TextInput style={styles.inputRegister} placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />

                <TouchableOpacity style={styles.buttonsRegister}>
                    <Text style={styles.textButtons}>REGISTRARSE</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonsCancelar}>
                    <Text style={styles.textButtons}>CANCELAR</Text>
                </TouchableOpacity>

            </View>
        </View>


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
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        backgroundColor: "#eeebebff",


    },
    inputRegister: {
        width: 280,
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 15,
        paddingHorizontal: 10,
        backgroundColor: "#f7f3f3ff"

    },

    tituloRegister: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
        color: "#452790",
    },

    buttonsRegister: {
        backgroundColor: '#452790', // Color de fondo del botón
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginTop: 20, // Separa el botón de los inputs
        width: 280, // Mismo ancho que los inputs
        alignItems: "center", // Centra el texto horizontalmente
        justifyContent: "center", // Centra el texto verticalmente        
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 40,
        marginBottom: 10,
        boxShadow: '0 6px 6px rgba(0, 0, 0, 0.39)', // Sombra para el botón

    },
    buttonsCancelar: {
        backgroundColor: '#f01250', // Color de fondo del botón
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginTop: 20, // Separa el botón de los inputs
        width: 280, // Mismo ancho que los inputs
        alignItems: "center", // Centra el texto horizontalmente
        justifyContent: "center", // Centra el texto verticalmente        
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 40,
        marginBottom: 10,
        boxShadow: '0 6px 6px rgba(0, 0, 0, 0.39)', // Sombra para el botón

    },

    textButtons: {
        color: '#ffffff', // Color del texto del botón
        fontSize: 16,
        fontWeight: 'bold',
    },

    image: {
        width: 160, height: 160, marginVertical: 10, backgroundColor: "gray", borderRadius: 80, boxShadow: '0 6px 6px rgba(0, 0, 0, 0.29)', alignSelf: "center" // Sombra para el botón
    },
});