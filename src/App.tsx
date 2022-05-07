import React from 'react';
import './App.css';
import Router from "./router";
import serviceConfig from "./data/service";
import { ServiceProvider } from "./HOC/withService";
import { WithHOCProvider } from "./HOC/withContext";
import { DataStore } from './components/DataStore';

function App() {
  return (
    <DataStore>
      <ServiceProvider data={serviceConfig} env="DEV">
        <WithHOCProvider localize={true}>
          <Router />
        </WithHOCProvider>
      </ServiceProvider>
    </DataStore>
  );
}

export default App;
