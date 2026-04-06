import ButtonPublicarMascota from "@/components/ButtonPublicarMascota";
import MascotasLista from "@/components/mascotasLista";
import React from "react";
import { StyleSheet, Text } from "react-native";
import { NavBar } from "../components/NavBar";

export default function Perdidos() {

  return <>
    <NavBar active="perdidos" />
    <Text style={styles.title}>PATITAS PERDIDAS</Text>
    <ButtonPublicarMascota />
    <MascotasLista filtroValor="Perdido" />
  </>
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