import { createSlice } from "@reduxjs/toolkit";

const defaultSelectedClass = "All Classes";

const generalInfoSlice = createSlice({
  name: "generalInfo",
  initialState: {
    selectedClass: defaultSelectedClass,
  },
  reducers: {
    updateSelectedClass: (state, action) => {
      let selectedClass = action.payload?.payload
        ? action.payload.payload
        : action.payload;
      state.selectedClass = selectedClass;
    },
  },
});

export const { updateSelectedClass } = generalInfoSlice.actions;

export default generalInfoSlice.reducer;
