'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import normalizeItem from '../lib/normalizeItem';
import apiRequest from '../lib/apiClient';

const QuoteContext = createContext();

export function QuoteProvider({ id, quotationRequestId, quoteName, initialItems = [], children }) {
  const storageKey = `cotizacion-${id}`;
  const [items, setItems] = useState(initialItems);
  const saveQuote = useCallback(async (useKeepAlive = false) => {

    const services = items.map((item) => ({
      object_id: item.id,
      service_type: item.type,
      quotation: id,
      content_type: item.contentType || 0,
    }));

    const payload = {
      name: quoteName || 'Cotización sin nombre',
      services,
      status: 'NEW',
      notes: '',
      quotation_request: quotationRequestId,
      price: totalPrice,
    };

    try {
      await apiRequest({
        url: `/quotationrequests/update_quotation/${id}/`,
        method: 'PUT',
        data: payload,
        keepalive: useKeepAlive,
      });
      
      const grouped = {};
      items.forEach((item) => {
        let type = item.type;
        if (type === 'transport') type = 'Transportes';
        else if (type === 'accommodation') type = 'Alojamientos';
        else if (type === 'activity') type = 'Actividades';
        else if (type === 'transfer') type = 'Traslados';
        else if (type === 'rental') type = 'Arriendos';
        if (!grouped[type]) grouped[type] = [];
        grouped[type].push(item.id);
      });
      console.log('Payload a assign_services_to_quotation:', grouped);
      await apiRequest({
        url: `/quotationrequests/assign_services_to_quotation/${id}/`,
        method: 'POST',
        data: grouped,
      });

    } catch (error) {
      console.error('❌ Error al guardar cotización:', error);
      throw error; 
    }
    console.log('saveQuote: items actuales:', items);
  });

  // Cargar desde localStorage al iniciar, o usar initialItems si no hay nada guardado
  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const parsed = JSON.parse(stored);
      const normalized = parsed.map(normalizeItem);
      setItems(normalized);
    } else if (initialItems && initialItems.length > 0) {
      setItems(initialItems);
    }
  }, []);

  // Guardar en localStorage cuando cambian los items
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, storageKey]);

  // Guardar automáticamente al cerrar la pestaña
  useEffect(() => {
    const handleUnload = () => {
      saveQuote(true);
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [saveQuote]);

  // Agregar item (evita duplicados por ID)
  const addItem = (item) => {
    const normalized = normalizeItem(item);
    if (!items.find((i) => i.id === normalized.id && normalizeItem(i).type === normalized.type)) {
      setItems((prev) => [...prev, normalized]);
    }
  };

  // Eliminar por índice o por ID
  const removeItem = (item) => {
    const normalized = normalizeItem(item);
    setItems((prev) => prev.filter((i) => i.id !== normalized.id || normalizeItem(i).type !== normalized.type));
  };

  const removeById = (itemId) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearItems = () => setItems([]);

  const totalPrice = items.reduce((sum, item) => sum + (item?.price || 0), 0);

  return (
    <QuoteContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        removeById,
        clearItems,
        totalPrice,
        saveQuote,
      }}
    >
      {children}
    </QuoteContext.Provider>
  );
}

export function useQuote() {
  return useContext(QuoteContext);
}
