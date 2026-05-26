// Ambient declaration for the deep-import path used in optimize-images.ts.
// The script intentionally imports via the deep path and narrows the runtime
// shape with its own minimal SharpInstance/SharpLoader types — sharp's full
// type definitions are deliberately avoided.
declare module 'sharp/lib/index.js' {
  const sharp: unknown;
  export default sharp;
}
