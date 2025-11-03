import { createSlice } from "@reduxjs/toolkit";


const mascotasSlice = createSlice({
  name: "mascotas",
  initialState: {
    data: [] as {
      id: number;
      titulo: string;
      estado?: string;
      sexo?: string;
      edad?: string;
      localidad?: string;
      traslado?: string;
      image?: string;
      fechaPublicacion?: string,
      descripcion?: string,

      
}[], // Store list of todos
  },
  reducers: {
    setMascotas: (state, action) => {
      state.data = action.payload;
    },
    addMascotas: (state, action) => {
      state.data.push({
        id: Date.now(),
         estado: "",
        titulo: "",
        edad: undefined
      });
    },
    updateMascotas: (state, action) => {
      const { id, newText } = action.payload;
      const todo = state.data.find((todo) => todo.id === id);
      if (todo) {
        todo.titulo = newText;
      }
    },
    deleteMascotas: (state, action) => {
      state.data = state.data.filter((Perdidos) => Perdidos.id !== action.payload);
    },
  },
});

export const { setMascotas, addMascotas, updateMascotas, deleteMascotas } = mascotasSlice.actions;
export default mascotasSlice.reducer;