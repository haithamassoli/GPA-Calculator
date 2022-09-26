import { createContext, useEffect, useState } from "react";
import { getDataFromStorage, storeDataToStorage } from "@Utils/helper";

export const ThemeContext = createContext({
  theme: "dark",
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const getTheme = async () => {
      const theme = await getDataFromStorage("theme");
      if (theme) {
        setTheme(theme);
      }
    };
    getTheme();
  }, []);
  const toggleTheme = async () => {
    await storeDataToStorage("theme", theme === "dark" ? "light" : "dark");
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
