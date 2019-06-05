import LODNode from './LODNode';

export default class LODManager {
  private isPreloaded: boolean;
  private lod: LODNode;

  private gl: WebGLRenderingContext;

  constructor(id: number) {
    this.lod = new LODNode(id, 512, 0, 5);
    this.lod.next = new LODNode(id, 1024, 1, 5);
  }

  public initialize = (gl: WebGLRenderingContext): void => {
    this.gl = gl;
    this.lod.initialize(gl);
    this.lod.next.initialize(gl);
  };

  public update = (): void => {
    if (this.lod.next && this.lod.next.isBuffered()) {
      this.lod = this.lod.next;
    }
  };

  public isCompletelyBuffered = (): boolean => {
    return !this.lod.next && this.lod.isBuffered();
  };

  public buffer = (): void => {
    const oldTexture = this.gl.getParameter(this.gl.TEXTURE_BINDING_2D);
    const oldActive = this.gl.getParameter(this.gl.ACTIVE_TEXTURE);

    this.lod.buffer();
    if (this.lod.isBuffered() && this.lod.next) {
      this.lod.next.buffer();
    }

    if (oldTexture) {
      this.gl.activeTexture(oldActive);
      this.gl.bindTexture(this.gl.TEXTURE_2D, oldTexture);
    }
  };

  public bind = (): void => {
    const oldTexture = this.gl.getParameter(this.gl.TEXTURE_BINDING_2D);
    const oldActive = this.gl.getParameter(this.gl.ACTIVE_TEXTURE);

    this.lod.bind();

    if (oldTexture) {
      this.gl.activeTexture(oldActive);
      //this.gl.bindTexture(this.gl.TEXTURE_2D, oldTexture);
    }
  };

  public preload = (imagePathRoot: string): Promise<any> => {
    if (!this.isPreloaded) {
      this.isPreloaded = true;
      return this.lod.load(imagePathRoot);
    } else {
    }
    return new Promise((resolve, reject) => {
      resolve();
    });
  };

  public getBestTexture = (): number => {
    return this.lod.getTextureOffset();
  };

  public load = (imagePathRoot: string): Promise<any> => {
    let current = this.lod;

    const promises: Promise<any>[] = [];

    while (current !== null && current !== undefined) {
      promises.push(current.load(imagePathRoot));

      current = current.next;
    }

    return Promise.all(promises);
  };
}
