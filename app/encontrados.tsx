import ButtonPublicarMascota from "@/components/ButtonPublicarMascota";
import MascotasLista from "@/components/mascotasLista";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavBar } from "../components/NavBar";

export default function Encontrados() {

  return (
    <View style={{ flex: 1, backgroundColor: "#f7f7f7" }}>
      <NavBar active="encontrados" />
      <ButtonPublicarMascota />

      <Text style={styles.title}>
        PATITAS ENCONTRADAS
      </Text>

      {/* La lista ahora tiene un padre con espacio definido */}
      <MascotasLista filtroValor="Encontrado" />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: 50,
    padding: 10,
    textAlign: "center",
    fontSize: 26,
    color: "#452790"
  },
})
