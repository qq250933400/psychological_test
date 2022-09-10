import "./globalVars";
import React from 'react';
import { render, screen } from '@testing-library/react';
import serviceConfig from "./data/service";
import { ServiceProvider } from "./HOC/withService";

const App = () => {
  return (<ServiceProvider data={serviceConfig} env="DEV">
    <button>Send Request</button>
  </ServiceProvider>);
};

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Send Request/i);
  expect(linkElement).toBeInTheDocument();
});

// eslint-disable-next-line import/no-anonymous-default-export
export default {};