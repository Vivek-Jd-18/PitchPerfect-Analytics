import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RosterFilterState {
  pitchCondition: string;
  contractGrade: 'ALL' | 'A' | 'B' | 'C';
  searchQuery: string;
}

const initialState: RosterFilterState = {
  pitchCondition: 'NEUTRAL',
  contractGrade: 'ALL',
  searchQuery: '',
};

export const rosterFilterSlice = createSlice({
  name: 'rosterFilter',
  initialState,
  reducers: {
    setPitchCondition: (state, action: PayloadAction<string>) => {
      state.pitchCondition = action.payload;
    },
    setContractGrade: (state, action: PayloadAction<'ALL' | 'A' | 'B' | 'C'>) => {
      state.contractGrade = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    resetFilters: (state) => {
      state.pitchCondition = 'NEUTRAL';
      state.contractGrade = 'ALL';
      state.searchQuery = '';
    },
  },
});

export const { setPitchCondition, setContractGrade, setSearchQuery, resetFilters } = rosterFilterSlice.actions;
export default rosterFilterSlice.reducer;
