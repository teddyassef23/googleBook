import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Auth from './utils/auth'; 

const client = new ApolloClient({
  uri: 'http://localhost:3001/graphql',
  cache: new InMemoryCache(),
  headers: {
    authorization: Auth.getToken() ? `Bearer ${Auth.getToken()}` : '', 
  },
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <Navbar />
        <Outlet />
      </div>
    </ApolloProvider>
  );
}

export default App;
