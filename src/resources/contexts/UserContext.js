'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import apiRequest from '../lib/apiClient';

const UserContext = createContext(null);

export function UserContextProvider({ children, initialData }) {
  const [isAdmin, setIsAdmin] = useState(initialData?.isAdmin || false);
  const [impersonatedUser, setImpersonatedUser] = useState(null);
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    const storedImpersonation = sessionStorage.getItem('impersonatedUser');
    if (storedImpersonation) {
      try {
        setImpersonatedUserState(JSON.parse(storedImpersonation));
      } catch (err) {
        console.warn('Error al leer impersonatedUser de sessionStorage:', err);
      }
    }
  }, []);

  useEffect(() => {
		const storedImpersonation = sessionStorage.getItem('impersonatedUser');
		if (storedImpersonation) {
			try {
				setImpersonatedUser(JSON.parse(storedImpersonation)); 
			} catch (err) {
				console.warn('Error al leer impersonatedUser de sessionStorage:', err);
			}
		}
	}, []);

  const setImpersonatedUserFunction = (user) => {
    setImpersonatedUser(user);
    if (user) {
      sessionStorage.setItem('impersonatedUser', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('impersonatedUser');
    }
  };

  useEffect(() => {
    const storedAgents = sessionStorage.getItem('agentList');
    if (storedAgents) {
      setAgents(JSON.parse(storedAgents));
    } else if (isAdmin) {
      apiRequest({
        url: '/entities/get_agents/',
        method: 'GET',
      })
        .then((data) => {
          setAgents(data.data);
          sessionStorage.setItem('agentList', JSON.stringify(data.data));
        })
        .catch((err) => console.error('Error al obtener agentes:', err));
    }
  }, [isAdmin]);

  return (
    <UserContext.Provider
      value={{ isAdmin, agents, impersonatedUser, setImpersonatedUserFunction }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserContextProvider');
  }
  return context;
}
