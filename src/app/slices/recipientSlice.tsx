import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UpdateRecipientAction } from "../../types/redux/recipient";

export interface RecipientDetails {
  first_name: string;
  last_name: string;
  address: {
    adl1: string;
    adl2: string;
    city: string;
    state: string;
    postal: string;
    country: string;
  };
  email: string;
  phone: string;
  shipping_rate: string;
}

const initialState: {
  recipient_info: RecipientDetails | null;
  first_name: string;
  last_name: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  country: string;
  postal: string;
  email: string;
  phone: string;
  shipping: string;
} = {
  recipient_info: null,
  first_name: "",
  last_name: "",
  address_line1: "",
  address_line2: "",
  city: "",
  state: "",
  country: "",
  postal: "",
  email: "",
  phone: "",
  shipping: "",
};

export const recipientSlice = createSlice({
  name: UpdateRecipientAction,
  initialState,
  reducers: {
    setRecipientInfo: (state, action: PayloadAction<RecipientDetails>) => {},
    setFirstName: (state, action: PayloadAction<string>) => {
      state.first_name = action.payload;
    },
    setLastName: (state, action: PayloadAction<string>) => {
      state.last_name = action.payload;
    },
    setAddressLine1: (state, action: PayloadAction<string>) => {
      state.address_line1 = action.payload;
    },
    setAddressLine2: (state, action: PayloadAction<string>) => {
      state.address_line2 = action.payload;
    },
    setCity: (state, action: PayloadAction<string>) => {
      state.city = action.payload;
    },
    setState: (state, action: PayloadAction<string>) => {
      state.state = action.payload;
    },
    setCountry: (state, action: PayloadAction<string>) => {
      state.country = action.payload;
    },
    setPostal: (state, action: PayloadAction<string>) => {
      state.postal = action.payload;
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setPhone: (state, action: PayloadAction<string>) => {
      state.phone = action.payload;
    },
    setShipping: (state, action: PayloadAction<string>) => {
      state.shipping = action.payload;
    },
    resetInfo: (state) => {
      state.first_name = "";
      state.last_name = "";
      state.address_line1 = "";
      state.address_line2 = "";
      state.city = "";
      state.state = "";
      state.country = "";
      state.postal = "";
      state.email = "";
      state.phone = "";
      state.shipping = "";
    },
  },
});

export const {
  setRecipientInfo,
  setFirstName,
  setLastName,
  setAddressLine1,
  setAddressLine2,
  setCity,
  setState,
  setCountry,
  setPostal,
  setEmail,
  setPhone,
  setShipping,
  resetInfo,
} = recipientSlice.actions;

export default recipientSlice.reducer;
