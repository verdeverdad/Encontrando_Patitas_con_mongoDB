import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function ButtonPublicarMascota() {
    return (
        <><TouchableOpacity
            style={[styles.selectButtonModal, styles.fixedButton]}

            onPress={() => router.push('/publicarMascota')}
        >
            <Text style={styles.blanco}>PUBLICAR UNA MASCOTA</Text>
        </TouchableOpacity></>
    );
}

const styles = StyleSheet.create({
    blanco: {
        color: "#ffffff",
        textShadowColor: "#000",
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 10,
        fontSize: 16, // Reducir tamaño de fuente
        fontWeight: "bold",
        textAlign: "center", // Centrar texto
    },
    selectButtonModal: {
        borderWidth: 2,
        backgroundColor: "#452790",
        color: '#ffffff',
        borderColor: 'white',
        padding: 10,
        borderRadius: 10,
        boxShadow: '0 6px 6px rgba(0, 0, 0, 0.39)',
        width: 'auto',
    },
    fixedButton: {
        position: "absolute",
        bottom: 10,
        right: 20,
        left: 20,
        height: 80, // Aumentar altura
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 40,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
    },
});