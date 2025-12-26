/**
 * Adds standard extraReducers for async thunks
 * @param {object} builder - Redux Toolkit builder
 * @param {object[]} thunks - Array of thunks to add
 * @param {object} options - Optional handlers { onPending, onFulfilled, onRejected }
 */
export const addAsyncThunkCases = (builder, thunks, options = {}) => {
  thunks.forEach((thunk) => {
    builder
      // Pending
      .addCase(thunk.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        if (options.onPending) options.onPending(state, action);
      })
      // Fulfilled
      .addCase(thunk.fulfilled, (state, action) => {
        state.loading = false;
        if (options.onFulfilled) {
          options.onFulfilled(state, action);
        }
      })
      // Rejected
      .addCase(thunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Something went wrong';
        if (options.onRejected) options.onRejected(state, action);
      });
  });
};
