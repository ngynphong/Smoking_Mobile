import React, { createContext, useState } from 'react';

export const TabBarContext = createContext();

export const TabBarProvider = ({ children }) => {
  const [tabBarVisible, setTabBarVisible] = useState(true);

  return (
    <TabBarContext.Provider value={{ tabBarVisible, setTabBarVisible }}>
      {children}
    </TabBarContext.Provider>
  );
};
