import CubeTexture from './CubeTexture';

export default class LODNode {
  private texture: CubeTexture;
  private resolution: number;
  private id: number;
  private baseLOD: number;
  private isLoadStarted: boolean;
  private textureOffset: number;
  next: LODNode;

  constructor(
    id: number,
    resolution: number,
    baseLOD: number,
    textureOffset: number
  ) {
    this.id = id;
    this.resolution = resolution;
    this.baseLOD = baseLOD;
    this.isLoadStarted = false;
    this.textureOffset = textureOffset;

    this.texture = new CubeTexture(
      this.resolution,
      this.baseLOD,
      this.id,
      textureOffset
    );
  }

  public initialize = (gl: WebGLRenderingContext): void => {
    this.texture.initialize(gl);
  };

  public load = (imagePathRoot: string): Promise<any> => {
    if (!this.isLoadStarted) {
      this.isLoadStarted = true;
      return this.texture.load(imagePathRoot);
    }
  };

  public bind = (): void => {
    this.texture.bind();
  };

  public getTextureOffset = (): number => {
    return this.textureOffset;
  };

  public buffer = (): void => {
    this.texture.buffer();
  };

  public isBuffered = (): boolean => {
    return this.texture.isCompletelyBuffered();
  };
}
