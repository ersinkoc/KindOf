import { createPlugin } from '../plugin-system';
import type { TypeChecker } from '../types';

// Node.js specific type checkers
const isReadableStream: TypeChecker = (value: unknown): boolean => {
  return value !== null &&
    typeof value === 'object' &&
    'readable' in value &&
    'read' in value &&
    typeof (value as any).read === 'function' &&
    '_readableState' in value;
};

const isWritableStream: TypeChecker = (value: unknown): boolean => {
  return value !== null &&
    typeof value === 'object' &&
    'writable' in value &&
    'write' in value &&
    typeof (value as any).write === 'function' &&
    '_writableState' in value;
};

const isDuplexStream: TypeChecker = (value: unknown): boolean => {
  return isReadableStream(value) && isWritableStream(value);
};

const isTransformStream: TypeChecker = (value: unknown): boolean => {
  return isDuplexStream(value) &&
    value !== null &&
    typeof value === 'object' &&
    '_transform' in value &&
    typeof (value as any)._transform === 'function';
};

const isServer: TypeChecker = (value: unknown): boolean => {
  return value !== null &&
    typeof value === 'object' &&
    'listen' in value &&
    'close' in value &&
    'address' in value &&
    typeof (value as any).listen === 'function';
};

const isIncomingMessage: TypeChecker = (value: unknown): boolean => {
  return value !== null &&
    typeof value === 'object' &&
    'headers' in value &&
    'method' in value &&
    'url' in value &&
    isReadableStream(value);
};

const isServerResponse: TypeChecker = (value: unknown): boolean => {
  return value !== null &&
    typeof value === 'object' &&
    'statusCode' in value &&
    'setHeader' in value &&
    'writeHead' in value &&
    isWritableStream(value);
};

const isChildProcess: TypeChecker = (value: unknown): boolean => {
  return value !== null &&
    typeof value === 'object' &&
    'pid' in value &&
    'kill' in value &&
    'stdin' in value &&
    'stdout' in value &&
    'stderr' in value &&
    typeof (value as any).kill === 'function';
};

const isWorker: TypeChecker = (value: unknown): boolean => {
  return value !== null &&
    typeof value === 'object' &&
    'threadId' in value &&
    'postMessage' in value &&
    'terminate' in value &&
    typeof (value as any).postMessage === 'function';
};

const isMessagePort: TypeChecker = (value: unknown): boolean => {
  return value !== null &&
    typeof value === 'object' &&
    'postMessage' in value &&
    'start' in value &&
    'close' in value &&
    typeof (value as any).postMessage === 'function';
};

const isURL: TypeChecker = (value: unknown): boolean => {
  return value !== null &&
    typeof value === 'object' &&
    'href' in value &&
    'protocol' in value &&
    'hostname' in value &&
    'pathname' in value &&
    'search' in value &&
    'hash' in value &&
    value.constructor?.name === 'URL';
};

const isURLSearchParams: TypeChecker = (value: unknown): boolean => {
  return value !== null &&
    typeof value === 'object' &&
    'append' in value &&
    'get' in value &&
    'set' in value &&
    'delete' in value &&
    typeof (value as any).append === 'function' &&
    value.constructor?.name === 'URLSearchParams';
};

const isTextEncoder: TypeChecker = (value: unknown): boolean => {
  return value !== null &&
    typeof value === 'object' &&
    'encode' in value &&
    typeof (value as any).encode === 'function' &&
    value.constructor?.name === 'TextEncoder';
};

const isTextDecoder: TypeChecker = (value: unknown): boolean => {
  return value !== null &&
    typeof value === 'object' &&
    'decode' in value &&
    typeof (value as any).decode === 'function' &&
    value.constructor?.name === 'TextDecoder';
};

const isAbortController: TypeChecker = (value: unknown): boolean => {
  return value !== null &&
    typeof value === 'object' &&
    'signal' in value &&
    'abort' in value &&
    typeof (value as any).abort === 'function' &&
    value.constructor?.name === 'AbortController';
};

const isAbortSignal: TypeChecker = (value: unknown): boolean => {
  return value !== null &&
    typeof value === 'object' &&
    'aborted' in value &&
    typeof (value as any).aborted === 'boolean' &&
    value.constructor?.name === 'AbortSignal';
};

const isPerformanceObserver: TypeChecker = (value: unknown): boolean => {
  return value !== null &&
    typeof value === 'object' &&
    'observe' in value &&
    'disconnect' in value &&
    typeof (value as any).observe === 'function' &&
    value.constructor?.name === 'PerformanceObserver';
};

const isPerformanceEntry: TypeChecker = (value: unknown): boolean => {
  return value !== null &&
    typeof value === 'object' &&
    'name' in value &&
    'entryType' in value &&
    'startTime' in value &&
    'duration' in value &&
    value.constructor?.name?.includes('Performance');
};

export const nodePlugin = createPlugin({
  name: 'node',
  version: '1.0.0',
  types: {
    'node.readablestream': isReadableStream,
    'node.writablestream': isWritableStream,
    'node.duplexstream': isDuplexStream,
    'node.transformstream': isTransformStream,
    'node.server': isServer,
    'node.incomingmessage': isIncomingMessage,
    'node.serverresponse': isServerResponse,
    'node.childprocess': isChildProcess,
    'node.worker': isWorker,
    'node.messageport': isMessagePort,
    'node.url': isURL,
    'node.urlsearchparams': isURLSearchParams,
    'node.textencoder': isTextEncoder,
    'node.textdecoder': isTextDecoder,
    'node.abortcontroller': isAbortController,
    'node.abortsignal': isAbortSignal,
    'node.performanceobserver': isPerformanceObserver,
    'node.performanceentry': isPerformanceEntry,
  },
});