// src/features/tasks/tasksSlice.ts
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  getTasksByProject,
  updateTask as updateTaskApi,
  createTask as createTaskApi,
  type Task,
} from "../../api/taskApi";

interface TasksState {
  items: Task[];
  loading: boolean;
}

const initialState: TasksState = {
  items: [],
  loading: false,
};

export const fetchTasks = createAsyncThunk(
  "tasks/fetchByProject",
  async (projectId: string) => {
    return await getTasksByProject(projectId);
  },
);

export const createTaskThunk = createAsyncThunk(
  "tasks/create",
  async (data: { project: string; title: string }) => {
    return await createTaskApi(data);
  },
);

export const updateTaskThunk = createAsyncThunk(
  "tasks/update",
  async ({ id, data }: { id: string; data: Partial<Task> }) => {
    return await updateTaskApi(id, data);
  },
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    // Optimistic update — used for drag-and-drop before backend confirms
    setTaskStatusOptimistic: (
      state,
      action: PayloadAction<{ id: string; status: Task["status"] }>,
    ) => {
      const task = state.items.find((t) => t._id === action.payload.id);
      if (task) task.status = action.payload.status;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchTasks.rejected, (state) => {
        state.loading = false;
      })
      .addCase(createTaskThunk.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateTaskThunk.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (t) => t._id === action.payload._id,
        );
        if (index !== -1) state.items[index] = action.payload;
      });
  },
});

export const { setTaskStatusOptimistic } = tasksSlice.actions;
export default tasksSlice.reducer;
