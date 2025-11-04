import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

type NavBarOption = "perdidos" | "encontrados" | "enAdopcion";

export const NavBar = ({ active }: { active?: NavBarOption }) => {  //define comportamiento de active, puede ser opcional? pero si le pasan dato es del tipo NavBarOption
    return (
        <SafeAreaView style={styles.navbar}>
          <Link href="./perdidos" style={active === "perdidos" && styles.active}>
              <Text style={styles.texto}>PERDIDOS</Text>
          </Link>
          <Link href="/encontrados" style={active === "encontrados" && styles.active}>
              <Text style={styles.texto}>ENCONTRADOS</Text>
          </Link>
          <Link href="/enAdopcion" style={active === "enAdopcion" && styles.active}>
              <Text style={styles.texto}>EN ADOPCIÓN</Text>
          </Link>
        </SafeAreaView>
      );
    }

const styles = StyleSheet.create({
  active: { fontWeight: "bold", fontSize: 16, textShadowColor: "#000", textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 10},

    navbar: {
        backgroundColor: "#f01250",
        flexDirection: 'row', // Alinea los elementos horizontalmente
        alignItems: "center",
        justifyContent: 'space-around', // Distribuye el espacio entre los elementos
        paddingVertical: -20,
    },
    texto: {
      paddingRight: 5, fontWeight: "bold", fontSize: 14, color: "#e1e1e1", textShadowColor: "#0000002f", textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 10
    }

});