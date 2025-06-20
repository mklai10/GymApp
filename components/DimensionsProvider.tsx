import React, { createContext, useContext } from "react";
import { Platform } from "react-native";
import { initialWindowMetrics } from "react-native-safe-area-context";

type DimensionsContextType = {
  SafeTopMargin: number | null;
};

const DimensionsContext = createContext<DimensionsContextType>({
  SafeTopMargin: null,
});

const windowMetric = () => {
    if (initialWindowMetrics) {
        return Platform.OS === "android" ? initialWindowMetrics.insets.top + 16 : initialWindowMetrics.insets.top;
    }
    return 0;
}

export const DimensionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <DimensionsContext.Provider
      value={{
        SafeTopMargin: 
            windowMetric(),
      }}
    >
      {children}
    </DimensionsContext.Provider>
  );
};

export const useDimensions = () => {
  const context = useContext(DimensionsContext);
  if (context === undefined) {
    throw new Error("useDimensions must be used within a DimensionsProvider");
  }
  return context;
};

export default DimensionsProvider;