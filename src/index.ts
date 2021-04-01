import { Canvas, CanvasKit, CanvasKitInit, Color, Surface } from "canvaskit-wasm";
console.log('Hello World from your main file!');
const cki_fn = require('canvaskit-wasm/bin/full/canvaskit.js') as typeof CanvasKitInit

var canvaskitElement:HTMLCanvasElement = null;
var canvas2dElement:HTMLCanvasElement = null;
var CanvasKit:CanvasKit = null;
var surface :Surface = null;

class LineInfo {
    x1 : number;
    x2 : number;
    y1 : number;
    y2 : number;
    color: Color;
    colorText:string;
    w: number;
    constructor(w:number,h:number,angle:number) {
        this.x1 = Math.random() * w;
        this.y1 = Math.random() * h;
        const l = (Math.random() - 0.5) * w;
        this.x2 = this.x1 + l * Math.cos(angle);
        this.y2 = this.y1 + l * Math.sin(angle);
        const r = Math.random();
        const g = Math.random();
        const b = Math.random();
        const a = Math.random();
        this.color = CanvasKit?.Color4f( r,g,b,a);
        this.colorText = this.toRGBAColorText(r,g,b,a);

        
        this.w = 1.0 + Math.random() * 20;
    }

    toRGBAColorText(r:number,g:number,b:number,a:number){
        const i = (n:number) => Math.round(n *255);
        return `rgba(${i(r)},${i(g)},${i(b)},${a})`
    }
    

    toColorText(n:number){
        return Math.round((n * 255)).toString(16).substr(0,2);
    }

}

var lines: Array<LineInfo> = null;

function makeLines(count:number):Array<LineInfo>{
    const time = Date.now();

    var r = new Array<LineInfo>();
    
    for (let index = 0; index < count; index++) {
        r.push(new LineInfo(canvaskitElement!.width,canvaskitElement!.height,Math.PI * 0.25));
    }
    console.log("Make lines:" + (Date.now() - time));
    return r;
    
}

function CanvasKitDraw(){
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
    console.log("CanvasKit Command:" + (Date.now() - time));

    //(surface as any).drawOnce(draw);
    surface.flush();

    console.log("CanvasKit Flush:" + (Date.now() - time));

}

function Canvas2dDraw() {
    if(!canvas2dElement)
        return;
    var context = canvas2dElement?.getContext("2d");
    
    context.fillStyle = "#FFFFFFFF";
    context.fillRect(0,0,canvas2dElement?.width,canvas2dElement?.height);
    context.lineCap = "round";
    
    const time = Date.now();

    for (const l of lines) {
        context.lineWidth = l.w;
        context.strokeStyle = l.colorText;
        context.beginPath();
        context.moveTo(l.x1,l.y1);
        context.lineTo(l.x2,l.y2);
        context.stroke();
    }
    canvas2dElement?.toDataURL();
    console.log("Canvas2D:" + (Date.now() - time));
    
}
function stringDownload(content:string, filename:string) {
    // 创建隐藏的可下载链接
    var eleLink = document.createElement('a');
    eleLink.download = filename;
    eleLink.style.display = 'none';
    // 字符内容转变成blob地址
    var blob = new Blob([content]);
    eleLink.href = URL.createObjectURL(blob);
    // 触发点击
    document.body.appendChild(eleLink);
    eleLink.click();
    // 然后移除
    document.body.removeChild(eleLink);
};

cki_fn({
    locateFile: (file:string) => file
}).then((ck:CanvasKit)=>{
    CanvasKit = ck;
    canvaskitElement =  document.getElementById("canvaskit") as HTMLCanvasElement;
    canvas2dElement = document.getElementById("canvas2d") as HTMLCanvasElement;
    resizeCanvas();
    lines = makeLines(100000);
    // stringDownload(JSON.stringify(lines),"lines.json")
    CanvasKitDraw();
    Canvas2dDraw();
});



function resizeCanvas(){
    if(canvaskitElement == null)
        return;

    canvaskitElement!.width = window.innerWidth;
    canvaskitElement!.height = window.innerHeight / 2;
    canvas2dElement!.width = window.innerWidth;
    canvas2dElement!.height = window.innerHeight / 2;
    
    if(surface){
        surface.delete();
    }
    // gpu
    surface = CanvasKit.MakeCanvasSurface(canvaskitElement);
    // cpu
    // surface = CanvasKit.MakeSurface(canvasEl!.width,canvasEl!.height);
}

window.addEventListener('resize',  ()=>{
    resizeCanvas();
    CanvasKitDraw();
    Canvas2dDraw();
});
window.addEventListener('load',()=>{
    resizeCanvas();
    CanvasKitDraw();
    Canvas2dDraw();
})


