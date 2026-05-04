'use client';

import { Provider } from 'react-redux';
import { store } from '../store/store';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'http://localhost:5000/graphql',
});

const authLink = setContext((_, { headers }) => {
  // In a real app, you'd get the token from cookies or RTK state.
  // Using localStorage for simplicity in this boilerplate.
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        {children}
      </ApolloProvider>
    </Provider>
  );
}
