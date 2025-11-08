import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from "react-native";

type NavBarOption = "perdidos" | "encontrados" | "enAdopcion";

export const NavBar = ({ active }: { active?: NavBarOption }) => {  //define comportamiento de active, puede ser opcional? pero si le pasan dato es del tipo NavBarOption
  return (
    <View style={styles.navbar}>
      <Link href="./perdidos" style={active === "perdidos" && styles.active}>
        <Text style={styles.texto}>PERDIDOS</Text>
      </Link>
      <Link href="/encontrados" style={active === "encontrados" && styles.active}>
        <Text style={styles.texto}>ENCONTRADOS</Text>
      </Link>
      <Link href="/enAdopcion" style={active === "enAdopcion" && styles.active}>
        <Text style={styles.texto}>EN ADOPCIÓN</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  active: {
    fontWeight: "bold",
    fontSize: 16,
    textShadowColor: "#440a39ff",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10
  },

  navbar: {
    backgroundColor: "#f01250",
    flexDirection: 'row', // Alinea los elementos horizontalmente
    alignItems: "center",
    justifyContent: 'space-around', // Distribuye el espacio entre los elementos
    height: 60,
    position: 'absolute', // Hace que el elemento se posicione con respecto a su contenedor
    paddingVertical: 10,
    top: 0, // Lo fija al borde superior
    left: 0, // Lo fija al borde izquierdo
    right: 0, // Asegura que se extienda por todo el ancho
    zIndex: 100, // Asegura que se muestre por encima de otros elementos
  },
  texto: {
    paddingRight: 5,
    fontWeight: "bold",
    fontSize: 14, color: "#e1e1e1",

  }

});