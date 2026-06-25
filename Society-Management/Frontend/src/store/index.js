import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import residentReducer from './slices/residentSlice.js';
import visitorReducer from './slices/visitorSlice.js';
import complaintReducer from './slices/complaintSlice.js';
import billingReducer from './slices/billingSlice.js';
import bookingReducer from './slices/bookingSlice.js';
import noticeReducer from './slices/noticeSlice.js';
import pollReducer from './slices/pollSlice.js';
import notificationReducer from './slices/notificationSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    resident: residentReducer,
    visitor: visitorReducer,
    complaint: complaintReducer,
    billing: billingReducer,
    booking: bookingReducer,
    notice: noticeReducer,
    poll: pollReducer,
    notification: notificationReducer,
  },
});

export default store;
