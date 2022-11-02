import React, { createContext, useReducer } from "react";

export const Context = createContext<any>(null);

function reducer(state: any, action: { type: any; value: any }) {
  switch (action.type) {
    case "SET_SHOW_DRAWER":
      return { ...state, showDrawer: action.value };
    case "SET_SHOW_REGISTRATION_MODAL":
      return { ...state, showRegistrationModal: action.value };
    case "SET_REGISTRATION_SUMMARY":
      return { ...state, registrationSummary: action.value };
    case "SET_ENTRY_SUMMARY":
      return { ...state, entrySummary: action.value };
    case "SET_SHOW_MOBILE_VERIFICATION_MODAL":
      return { ...state, showMobileVerificationModal: action.value };
    case "SET_SHOW_VALIDATION_MODAL":
      return { ...state, showValidationModal: action.value };
    case "SET_VALIDATION_MODAL_PROPS":
      return { ...state, validationModalProps: action.value };
    case "SET_SHOW_IMAGE_VIEWER_MODAL":
      return { ...state, showImageViewerModal: action.value };
    case "SET_IMAGE_VIEWER_MODAL_PROPS":
      return { ...state, imageViewerModalProps: action.value };
    case "SET_MOBILE_VERIFICATION_PROPS":
      return { ...state, mobileVerificationProps: action.value };
    case "SET_PROMO":
      return { ...state, promo: action.value };
    default:
      return state;
  }
}

const initialState = {
  showDrawer: false,
  showRegistrationModal: false,
  showMobileVerificationModal: false,
  showValidationModal: false,
  showImageViewerModal: false,
  promo: "",
  imageViewerModalProps: {},
  validationModalProps: {},
  registrationSummary: {},
  entrySumamry: {},
  mobileVerificationProps: {},
};

export default function AppProvider({ children, ...rest }: any) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialDispatch = {
    setShowDrawer: (value: any) => {
      dispatch({ type: "SET_SHOW_DRAWER", value });
    },
    setShowRegistrationModal: (value: any) => {
      dispatch({ type: "SET_SHOW_REGISTRATION_MODAL", value });
    },
    setRegistrationSummary: (value: any) => {
      dispatch({ type: "SET_REGISTRATION_SUMMARY", value });
    },
    setEntrySummary: (value: any) => {
      dispatch({ type: "SET_ENTRY_SUMMARY", value });
    },
    setShowMobileVerificationModal: (value: any) => {
      dispatch({ type: "SET_SHOW_MOBILE_VERIFICATION_MODAL", value });
    },
    setShowValidationModal: (value: any) => {
      dispatch({ type: "SET_SHOW_VALIDATION_MODAL", value });
    },
    setValidationModalProps: (value: any) => {
      dispatch({ type: "SET_VALIDATION_MODAL_PROPS", value });
    },
    setShowImageViewerModal: (value: any) => {
      dispatch({ type: "SET_SHOW_IMAGE_VIEWER_MODAL", value });
    },
    setImageViewerModalProps: (value: any) => {
      dispatch({ type: "SET_IMAGE_VIEWER_MODAL_PROPS", value });
    },
    setMobileVerificationProps: (value: any) => {
      dispatch({ type: "SET_MOBILE_VERIFICATION_PROPS", value });
    },
    setPromo: (value: any) => {
      dispatch({ type: "SET_PROMO", value });
    },
  };

  const value = {
    ...state,
    ...initialDispatch,
    ...rest,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
