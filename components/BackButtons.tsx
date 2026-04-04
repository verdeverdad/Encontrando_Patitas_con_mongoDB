import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const BackButton = () => {
  const router = useRouter();

  const volver = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      {/* Verificamos si hay historia para volver */}
      {router.canGoBack() && (
        <TouchableOpacity style={styles.button} onPress={volver}>
          <Text style={styles.text}>Volver</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: 20,
    marginTop: 10, // Un poco de aire arriba
  },
  button: {
    backgroundColor: '#452790', 
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  text: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  }
});