// src/features/projects/projectsSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProjects, createProject, type Project } from "../../api/projectApi";

interface ProjectsState {
  items: Project[];
  loading: boolean;
}

const initialState: ProjectsState = {
  items: [],
  loading: false,
};

export const fetchProjects = createAsyncThunk("projects/fetchAll", async () => {
  return await getProjects();
});

export const addProject = createAsyncThunk(
  "projects/create",
  async (data: { name: string; description?: string }) => {
    return await createProject(data);
  }
);

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchProjects.rejected, (state) => {
        state.loading = false;
      })
      .addCase(addProject.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  },
});

export default projectsSlice.reducer;