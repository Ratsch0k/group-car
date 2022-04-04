import React from 'react';

export interface LazyWithPreload
  extends React.LazyExoticComponent<React.ComponentType<unknown>> {
  preload: () => Promise<{default: React.ComponentType}>;
}

export const lazyWithPreload = (
  factory: () => Promise<{default: React.ComponentType}>,
): LazyWithPreload => {
  const Component = React.lazy(factory);
  (Component as LazyWithPreload).preload = factory;
  return Component as LazyWithPreload;
};
