export class CanvasRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error("Could not get 2D context");
    this.ctx = context;
  }

  public resize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.parentElement?.getBoundingClientRect();
    if (!rect) return;

    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;
  }

  public draw(img: HTMLImageElement) {
    if (!img) return;

    // Horizontal crop factor: fraction to remove from each side (e.g. 0.12 = 12% cropped per side)
    const cropX = 0.12;
    const sx = img.naturalWidth * cropX;
    const sw = img.naturalWidth * (1 - cropX * 2);
    const sh = img.naturalHeight;
    const sy = 0;

    // Effective aspect ratio of cropped source
    const croppedIr = sw / sh;

    const canvasW = this.canvas.width / window.devicePixelRatio;
    const canvasH = this.canvas.height / window.devicePixelRatio;
    const cr = canvasW / canvasH;

    let dw: number;
    let dh: number;

    // Object-fit cover logic using cropped source ratio
    if (cr > croppedIr) {
      dw = canvasW;
      dh = dw / croppedIr;
    } else {
      dh = canvasH;
      dw = dh * croppedIr;
    }

    const ox = (canvasW - dw) / 2;
    const oy = (canvasH - dh) / 2;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(img, sx, sy, sw, sh, ox, oy, dw, dh);
  }
}
