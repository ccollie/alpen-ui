import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const useNavigationUpdate = () => {
  const navigate = useNavigate();
  const location = useLocation();

  function updateNavigation(params: Record<string, any>, gotoUrl = false) {
    const newQuery = new URLSearchParams(location.search);

    let changed = false;
    for (const [key, value] of Object.entries(params)) {
      const val = `${value}`; // todo: proper serialization
      if (newQuery.get(key) !== val) {
        changed = true;
        newQuery.set(key, val);
      }
    }

    if (!changed) return;

    const uri = `${location.pathname}?${newQuery.toString()}`;

    if (gotoUrl) {
      navigate(uri);
      return;
    }

    navigate(uri, {
      replace: false,
      state: { ...params },
    });
  }

  return updateNavigation;
};
