import React from 'react';
import './App.css';
import Router from "./router";
import serviceConfig from "./data/service";
import { ServiceProvider } from "./HOC/withService";
import { WithHOCProvider } from "./HOC/withContext";

function App() {
  return (
    <ServiceProvider data={serviceConfig} env="DEV">
      <WithHOCProvider localize={true}>
        <Router />
      </WithHOCProvider>
    </ServiceProvider>
  );
}

export default App;
