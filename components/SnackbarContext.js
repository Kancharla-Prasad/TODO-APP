import React, { createContext, useState } from "react";
import { Snackbar } from "react-native-paper";

export const SnackbarContext = createContext();

export const SnackbarProvider = ({ children }) => {
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  return (
    <SnackbarContext.Provider value={{ setSnackbarMessage, setSnackbarVisible }}>
      {children}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: "OK",
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
