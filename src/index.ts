import { Canvas, CanvasKit, CanvasKitInit, Color, Surface } from "canvaskit-wasm";
console.log('Hello World from your main file!');
const cki_fn = require('canvaskit-wasm/bin/full/canvaskit.js')

var canvasEl:HTMLCanvasElement = null;
var CanvasKit:CanvasKit = null;
var surface :Surface = null;

class LineInfo {
    x1 : number;
    x2 : number;
    y1 : number;
    y2 : number;
    color: Color;
    w: number;
    constructor(w:number,h:number,a:number) {
        this.x1 = Math.random() * w;
        this.y1 = Math.random() * h;
        const l = (Math.random() - 0.5) * w;
        this.x2 = this.x1 + l * Math.cos(a);
        this.y2 = this.y1 + l * Math.sin(a);
        this.color = CanvasKit?.Color4f(Math.random(),Math.random(),Math.random(),Math.random());
        this.w = 1.0 + Math.random() * 20;
    }
}

var lines: Array<LineInfo> = null;

function makeLines(count:number):Array<LineInfo>{
    var r = new Array<LineInfo>();
    
    for (let index = 0; index < count; index++) {
        r.push(new LineInfo(canvasEl!.width,canvasEl!.height,Math.PI * 0.25));
    }

    return r;
}

function Draw(){
    if(CanvasKit == null || surface == null){
        return;
    }

    const w = surface.width();
    const h = surface.height();

    const time = Date.now();
    
    
    const paint = new CanvasKit.Paint();
    paint.setColor(CanvasKit.Color4f(1, 0, 0, 1.0));
    paint.setStyle(CanvasKit.PaintStyle.Stroke);
    paint.setAntiAlias(true);
    paint.setStrokeWidth(2.0)
    paint.setStrokeCap(CanvasKit.StrokeCap.Round);
    
    function draw(canvas:Canvas) {
      canvas.clear(CanvasKit.WHITE);

      for (const l of lines) {
          paint.setColor(l.color);
          paint.setStrokeWidth(l.w);
          canvas.drawLine(l.x1,l.y1,l.x2,l.y2,paint);
      }
    }
    draw(surface.getCanvas());
    surface.flush();
    //(surface as any).drawOnce(draw);

    console.log(Date.now() - time);

    surface.delete();
}

cki_fn({
    locateFile: (file:string) => file
}).then((ck:CanvasKit)=>{
    CanvasKit = ck;
    canvasEl =  document.getElementById("foo") as HTMLCanvasElement;
    resizeCanvas();
    lines = makeLines(100000);
    Draw();
});



function resizeCanvas(){
    if(canvasEl == null)
        return;

    canvasEl!.width = window.innerWidth;
    canvasEl!.height = window.innerHeight;
    if(surface){
        surface.delete();
    }
    // gpu
    surface = CanvasKit.MakeCanvasSurface('foo');
    // cpu
    // surface = CanvasKit.MakeSurface(canvasEl!.width,canvasEl!.height);
}

window.addEventListener('resize',  ()=>{
    resizeCanvas();
    Draw();
});
window.addEventListener('load',()=>{
    resizeCanvas();
    Draw();
})
