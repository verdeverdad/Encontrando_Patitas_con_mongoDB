import { BackButton } from "@/components/BackButtons";
import { store } from "@/redux/store";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router/tabs";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Text, View } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { Provider } from "react-redux";

export default function RootLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Provider store={store}>
      <SafeAreaProvider style={{ backgroundColor: "#e1e1e1" }}>
        <StatusBar
          style="light" // Estilo por defecto para toda la app
          backgroundColor="#f01250" // Color de fondo por defecto (solo Android)
        />

        <View 
        style={{
          paddingTop: insets.top, //Añade el padding superior basado en los insets de seguridad usando hook useSafeAreaInsets()
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          backgroundColor: "#452790",
        }}>
          <MaterialIcons name={"pets"}
            color="white"
            size={30} />
          <Text
            style={{
              fontSize: 16,
              padding: 10,
              fontWeight: "bold",
              letterSpacing: 2,
              backgroundColor: "#452790",
              color: "#e1e1e1",
              textShadowColor: "#000", textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 10,
            }}
          >ENCONTRANDO PATITAS
          </Text>
          <MaterialIcons name={"pets"}
            color="white"
            size={30} />
        </View>
      
        <Tabs
          initialRouteName="index"
          backBehavior="history"
          screenOptions={{ headerLeft: () => <BackButton />, 
            headerShown: false,
             tabBarActiveTintColor: '#fff',
            headerShadowVisible: false,
            headerTintColor: '#fff',
            tabBarStyle: {
            backgroundColor: '#f01250',
            },
          }}
        >
          <Tabs.Screen name="index" options={{
          title: "INICIO",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              color={color}
              size={30}
            />
          ),
        }}/>
          <Tabs.Screen name="perfil" options={{
          title: "PERFIL",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={
                focused ? "person-circle" : "person-circle-outline"
              }
              color={color}
              size={33}
            />
          ),
        }}/>
          <Tabs.Screen
            name="perdidos"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="encontrados"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="enAdopcion"
            options={{
              href: null,
            }}
          />
           <Tabs.Screen
            name="login"
            options={{
              href: null,
            }}
          />
           <Tabs.Screen
            name="register"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="mascota"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="publicarMascota"
            options={{
              href: null,
            }}
          />
             <Tabs.Screen
            name="editMascota"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="editPerfil"
            options={{
              href: null,
            }}
          />
        </Tabs>
      </SafeAreaProvider>
    </Provider>
  );
}