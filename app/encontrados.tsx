import ButtonPublicarMascota from "@/components/ButtonPublicarMascota";
import MascotasLista from "@/components/mascotasLista";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { NavBar } from "../components/NavBar";

export default function Encontrados() {

return (
  <View style={{ flex: 1, backgroundColor: "#f7f7f7" }}>
    <NavBar active="encontrados" />
    <ButtonPublicarMascota />
    
    <Text style={{ marginTop: 50, padding: 10, textAlign: "center", fontSize: 32 }}>
      ESTE ES EL ENCONTRADOS
    </Text>

    <TouchableOpacity onPress={() => router.push('/')}>
      <Text style={{ padding: 10, textAlign: "center", fontSize: 18, color: 'blue' }}>
        VOLVER AL INICIO
      </Text>
    </TouchableOpacity>

    {/* La lista ahora tiene un padre con espacio definido */}
    <MascotasLista filtroValor="Encontrado" />
  </View>
);

}
