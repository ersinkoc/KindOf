import { createPlugin } from '../plugin-system';
import type { TypeChecker } from '../types';

// React type checkers
const isReactElement: TypeChecker = (value: unknown): boolean => {
  return value !== null &&
    typeof value === 'object' &&
    '$$typeof' in value &&
    'type' in value &&
    'props' in value;
};

const isReactComponent: TypeChecker = (value: unknown): boolean => {
  if (typeof value !== 'function') return false;
  
  // Check for React component patterns
  const fn = value;
  const prototype = fn.prototype;
  
  // Class component check
  if (prototype && prototype.isReactComponent) {
    return true;
  }
  
  // Function component check (heuristic)
  if (fn.name && /^[A-Z]/.test(fn.name)) {
    return true;
  }
  
  return false;
};

const isReactMemo: TypeChecker = (value: unknown): boolean => {
  return value !== null &&
    typeof value === 'object' &&
    '$$typeof' in value &&
    'type' in value &&
    (value as any).$$typeof?.toString?.() === 'Symbol(react.memo)';
};

const isReactForwardRef: TypeChecker = (value: unknown): boolean => {
  return value !== null &&
    typeof value === 'object' &&
    '$$typeof' in value &&
    'render' in value &&
    (value as any).$$typeof?.toString?.() === 'Symbol(react.forward_ref)';
};

const isReactLazy: TypeChecker = (value: unknown): boolean => {
  return value !== null &&
    typeof value === 'object' &&
    '$$typeof' in value &&
    '_payload' in value &&
    '_init' in value &&
    (value as any).$$typeof?.toString?.() === 'Symbol(react.lazy)';
};

const isReactContext: TypeChecker = (value: unknown): boolean => {
  return value !== null &&
    typeof value === 'object' &&
    '$$typeof' in value &&
    '_currentValue' in value &&
    'Provider' in value &&
    'Consumer' in value;
};

const isReactProvider: TypeChecker = (value: unknown): boolean => {
  return value !== null &&
    typeof value === 'object' &&
    '$$typeof' in value &&
    '_context' in value &&
    (value as any).$$typeof?.toString?.() === 'Symbol(react.provider)';
};

const isReactConsumer: TypeChecker = (value: unknown): boolean => {
  return value !== null &&
    typeof value === 'object' &&
    '$$typeof' in value &&
    '_context' in value &&
    (value as any).$$typeof?.toString?.() === 'Symbol(react.consumer)';
};

const isReactFragment: TypeChecker = (value: unknown): boolean => {
  return value !== null &&
    typeof value === 'object' &&
    '$$typeof' in value &&
    'type' in value &&
    (value as any).type?.toString?.() === 'Symbol(react.fragment)';
};

const isReactPortal: TypeChecker = (value: unknown): boolean => {
  return value !== null &&
    typeof value === 'object' &&
    '$$typeof' in value &&
    'children' in value &&
    'containerInfo' in value &&
    (value as any).$$typeof?.toString?.() === 'Symbol(react.portal)';
};

const isReactSuspense: TypeChecker = (value: unknown): boolean => {
  return value !== null &&
    typeof value === 'object' &&
    '$$typeof' in value &&
    'type' in value &&
    (value as any).type?.toString?.() === 'Symbol(react.suspense)';
};

const isReactProfiler: TypeChecker = (value: unknown): boolean => {
  return value !== null &&
    typeof value === 'object' &&
    '$$typeof' in value &&
    'type' in value &&
    (value as any).type?.toString?.() === 'Symbol(react.profiler)';
};

const isReactStrictMode: TypeChecker = (value: unknown): boolean => {
  return value !== null &&
    typeof value === 'object' &&
    '$$typeof' in value &&
    'type' in value &&
    (value as any).type?.toString?.() === 'Symbol(react.strict_mode)';
};

export const reactPlugin = createPlugin({
  name: 'react',
  version: '1.0.0',
  types: {
    'react.element': isReactElement,
    'react.component': isReactComponent,
    'react.memo': isReactMemo,
    'react.forwardref': isReactForwardRef,
    'react.lazy': isReactLazy,
    'react.context': isReactContext,
    'react.provider': isReactProvider,
    'react.consumer': isReactConsumer,
    'react.fragment': isReactFragment,
    'react.portal': isReactPortal,
    'react.suspense': isReactSuspense,
    'react.profiler': isReactProfiler,
    'react.strictmode': isReactStrictMode,
  },
});