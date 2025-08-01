export const stripExports = (code: string): string => {
  // Handle various export types
  return (
    code
      // Handle export function
      .replace(/export\s+function/g, 'function')
      // Handle export class
      .replace(/export\s+class/g, 'class')
      // Handle export interface
      .replace(/export\s+interface/g, 'interface')
      // Handle export type
      .replace(/export\s+type/g, 'type')
      // Handle export const
      .replace(/export\s+const/g, 'const')
      // Handle export let
      .replace(/export\s+let/g, 'let')
      // Handle export var
      .replace(/export\s+var/g, 'var')
      // Handle export enum
      .replace(/export\s+enum/g, 'enum')
      // Handle export namespace
      .replace(/export\s+namespace/g, 'namespace')
      // Handle export module
      .replace(/export\s+module/g, 'module')
  );
};
