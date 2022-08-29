/// <reference types="emscripten" />
interface LibavCore extends EmscriptenModule {
  NULL: number;
}
declare const LibavCoreFactory: EmscriptenModuleFactory<LibavCore>;
export default LibavCoreFactory;
