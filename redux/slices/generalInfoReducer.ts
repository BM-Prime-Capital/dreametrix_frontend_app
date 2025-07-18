import { classSubject } from "@/constants/global";
import { createSlice } from "@reduxjs/toolkit";

const defaultSelectedClass = "All Classes";
const initialClasses = [
  {
    subject: classSubject.MATH,
    grade: "3",
    name: "Class 3 - Math",
  },
  {
    subject: classSubject.MATH,
    grade: "4",
    name: "Class 4 - Math",
  },

  {
    subject: classSubject.LANGUAGE,
    grade: "3",
    name: "Class 3 - Language",
  },
  {
    subject: classSubject.LANGUAGE,
    grade: "4",
    name: "Class 4 - Language",
  },
];

const generalInfoSlice = createSlice({
  name: "generalInfo",
  initialState: {
    selectedClass: defaultSelectedClass,
    allClasses: initialClasses,
  },
  reducers: {
    updateSelectedClass: (state, action) => {
      const selectedClass = action.payload?.payload
        ? action.payload.payload
        : action.payload;
      state.selectedClass = selectedClass;
    },
    updateClassesList: (state, action) => {
      const newClassesList = action.payload?.payload
        ? action.payload.payload
        : action.payload;
      state.allClasses = newClassesList;
    },
  },
});

export const { updateSelectedClass, updateClassesList } =
  generalInfoSlice.actions;

export default generalInfoSlice.reducer;
