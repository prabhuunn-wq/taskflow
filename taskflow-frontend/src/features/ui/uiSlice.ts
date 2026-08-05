// src/features/ui/uiSlice.ts
import { createSlice } from "@reduxjs/toolkit";

interface UiState {
  mobileSidebarOpen: boolean;
}

const initialState: UiState = {
  mobileSidebarOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleMobileSidebar: (state) => {
      state.mobileSidebarOpen = !state.mobileSidebarOpen;
    },
    closeMobileSidebar: (state) => {
      state.mobileSidebarOpen = false;
    },
  },
});

export const { toggleMobileSidebar, closeMobileSidebar } = uiSlice.actions;
export default uiSlice.reducer;