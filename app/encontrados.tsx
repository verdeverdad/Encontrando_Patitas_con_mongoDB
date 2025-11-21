import ButtonPublicarMascota from "@/components/ButtonPublicarMascota";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { NavBar } from "../components/NavBar";

export default function Encontrados() {

  return <>
        <NavBar active="encontrados" />
        <ButtonPublicarMascota />
    <Text style={{ marginTop: 50, padding: 10, textAlign: "center", fontSize: 32 }}>ESTE ES EL ENCONTRADOS</Text> 
    <TouchableOpacity>
          <Text style={{ marginTop: 50, padding: 10, textAlign: "center", fontSize: 24, color: 'blue' }} onPress={() =>router.push('/login')}>VOLVER AL INICIO</Text>
    </TouchableOpacity>
    </>
  
}
