import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { withAuthenticator } from '@aws-amplify/ui-react';
import Login from './Login';
import Meals from './Meals';
import CreateMeal from './CreateMeal';
import { Amplify } from 'aws-amplify';

import awsExports from './aws-exports';
Amplify.configure(awsExports);

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* <Route path="/meals" element={<Meals />} />
        <Route path="/create-meal" element={<CreateMeal />} /> */}
      </Routes>
    </Router>
  );
};

export default withAuthenticator(App);