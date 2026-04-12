
05-04-2026
## FILTRO MASCOTAS 

 **Sistema de filtrado  principal de mascotas**  05-04-2026  
  - Razón: filtrado precario montado para MVP, Solo se mostraban las mascotas que habia publicado el ususario autenticado. 
  - Técnico: * Se optimizó el filtrado para usuarios con y sin login. * Se creó ruta para usuarios sin login mascotas/public
  - Next: Filtrado por localidad y sexo

## UX/UI 

 **Lista de mascotas** 05-04-2026  

  - *Optimización de Interfaz general:* Se corrigió el espacio (margin) al final de la lista de mascotas. Ahora el botón flotante ya no tapa la última publicación, permitiendo una navegación completa sin obstáculos visuales.

   **Perfil** 05-04-2026  

  - *Mejora de presentación de perfil*: Se implamenta modal para amplificar la foto de perfil cuando el usuario toca la imagen. Se ordenan los inputs para que sea mas amigable la informacion
  
  - *Card mascotas en perfil*: se colocan las mascotas publicadas por el usuario en la sección del perfil exactamente iguales a las publicadas con el boton para eliminar y editar

  - *Modificación de botón de publicar mascotas*: Se ajustó (achicó) el tamaño del boton y el padding para mejorar el uso del espacio negativo

  - *Implementación de los ttulos de las diferentes pestañas*: Se optimizaron los titulos de las tres secciones que muestran las mascotas, se optó por incluir el titulo en formato amigable y consistente con la marca, se ajusto el tamaño y el color

## Perfil

  - Implementacion de funcionalidad para mostrar las mascotas que publico el usuario
  - implementación de funcionalidad para eliminar las mascotas publicadas
  - botton de editar mascota colocado falta implementar la funcionalidad

12-04-2026
## Perfil

  - Corrección de carga de lista de mascotas luego de que se publica una mascota, se cambio el useEffect por useFocusEffect para que se cargue los datos nuevos 

## BUGS PENDIENTES

- Editar perfil no se pueden editar los datos
- Editar mascotas funcionalidad
- gestionar contraseña como se edita
- implementar "Olvidó su contraseña"
- editar perfil: *boton de seleccionar imagen *imagen nueva no se muestra mientras esta en editPerfil
- ubicar el registro y el inicio de secion y recuperar contraseña

  