class Scene{
    constructor(con){
        this.scene=con;
        this.ctx = this.scene.getContext('2d');
        this.movingLeft=false;
        this.movingRight=false;
        this.keyBinding();
    }
    keyBinding(){
        window.addEventListener('keydown',(e)=>{
            if(e.key==='a'){
                this.movingLeft=true
            }
            if(e.key==='d'){
                this.movingRight=true
            }
        })
        window.addEventListener('keyup',(e)=>{
            if(e.key==='a'){
                this.movingLeft=false
            }
            if(e.key==='d'){
                this.movingRight=false
            }
        })
    }
    start(){
        let squ=new DrawPlank(this.ctx,{x:200,y:280},{w:50,h:10})
        let ball=new DrawBall(this.ctx,{x:210,y:270},{w:10,h:10})
        let target=new DrawTarget(this.ctx,{x:50,y:10},{w:300,h:40})
        target.draw()
        this.timer=setInterval(()=>{
            if(this.movingLeft){
                squ.moveLeft()
            }
            if(this.movingRight){
                squ.moveRight()
            }
            squ.draw();

            let res=target.hit(ball.position,ball.size)
            if(res){
                debugger
                ball.way=res
            }
            if(!ball.fly(squ.position,squ.size)){
                clearInterval(this.timer)
            }
            ball.draw()

        },1000/60)
    }

}

class Draw{
    constructor(context,position,size,color='rgb(200,0,0)'){
        context.fillStyle = color;
        this.position=position;
        this.size=size;
        this.context=context;


    }
    draw(){

        let {x,y}=this.position,{w,h}=this.size;
        this.context.fillRect(x,y,w,h)
    }
    clear(position,size){
        //let {x,y}=this.position,{w,h}=this.size;
        let x,y,w,h;
        if(position){
            x=position.x;
            y=position.y;
        }else{
            x=this.position.x;
            y=this.position.y;
        }

        if(size){
            w=size.w;
            h=size.h;
        }else{
            w=this.size.w;
            h=this.size.h;
        }
        this.context.clearRect(x, y, w, h)
    }

}
class DrawPlank extends Draw{
    constructor(context,position,size){
        super(context,position,size);
        this.stap=5;
    }
    moveLeft(){
        this.clear();

        this.position.x-=this.stap
        if(this.position.x<=0){
            this.position.x=0
        }
    }
    moveRight(){
        this.clear();
        this.position.x+=this.stap;
        let w=this.context.canvas.clientWidth;
        if(this.position.x+this.size.w>=w){
            this.position.x=w-this.size.w
        }
    }
}

class DrawBall extends  Draw{
    constructor(context,position,size){
        super(context,position,size);
        this.stap=5;
        this.way={x:false,y:false}

    }
    fly(pPosition,pSize){
        this.clear();
        if(!this.decide(pPosition,pSize)){
            alert('game over');
            return false
        }
        if(this.way.x){
            this.position.x+=this.stap
        }else{
            this.position.x-=this.stap
        }
        if(this.way.y){
            this.position.y+=this.stap
        }else{
            this.position.y-=this.stap
        }
        return true

    }
    decide(pPosition,pSize){
        let borderX=this.context.canvas.clientWidth,borderY=this.context.canvas.clientHeight;
        let w=this.size.w,h=this.size.h;
        let x=this.position.x,y=this.position.y;
        if(y+h>=borderY){
            return false
        }
        //debugger
        if(y+h>=pPosition.y&&x>=pPosition.x&&x<=pPosition.x+pSize.w){
            this.way.y=false
        }
        if(y<=0){
            this.way.y=true
        }
        if(x+w>=borderX){
            this.way.x=false
        }
        if(x<=0){
            this.way.x=true
        }
        return true
    }
}

class DrawTarget extends Draw{
    constructor(context,position,size,color){

        super(context,position,size,color);
        this.unitsSize=10;

        const {w,h}=this.size,{x,y}=position
        let col=w/this.unitsSize,colUnitNum=h/this.unitsSize
        this.centerSpot={x:size.w/2+position.x,y:size.h/2+position.y}
        let dataMap=[];
        for(let i=0;i<col*colUnitNum;i++){
            let rowNum=Math.floor(i/col),colNum=i%col

            dataMap.push([x+colNum*this.unitsSize,y+rowNum*this.unitsSize])
        }
        this.dataMap=dataMap

    }
    hit(ballPosition,ballSize){
       // debugger
        let{x,y}=ballPosition,{w,h}=ballSize
        for(let i=0;i<this.dataMap.length;i++){
            // if(x>=this.dataMap[i][0]&&x<=this.dataMap[i][0]+this.unitsSize&&y>=this.dataMap[i][1]&&y<=this.dataMap[i][1]+this.unitsSize){
            //     debugger
            //     this.clear({x:this.dataMap[i][0],y:this.dataMap[i][1]},{w:this.unitsSize,h:this.unitsSize})
            //     this.dataMap.splice(i,1);
            //     return {
            //         x:x>this.centerSpot.x,
            //         y:y>this.centerSpot.y
            //     }
            //
            // }else if(x+w===this.dataMap[i][0]&&y>=this.dataMap[i][1]&&y<=this.dataMap[i][1]+this.unitsSize){
            //     this.clear({x:this.dataMap[i][0],y:this.dataMap[i][1]},{w:this.unitsSize,h:this.unitsSize})
            //     this.dataMap.splice(i,1);
            //     return {
            //         x:x>this.centerSpot.x,
            //         y:y>this.centerSpot.y
            //     }
            // }
            if((x+w===this.dataMap[i][0]||this.dataMap[i][0]+this.unitsSize===x)&&y>=this.dataMap[i][1]&&y<=this.dataMap[i][1]+this.unitsSize){
                this.clear({x:this.dataMap[i][0],y:this.dataMap[i][1]},{w:this.unitsSize,h:this.unitsSize});
                this.dataMap.splice(i,1);
                return {
                    x:x>this.centerSpot.x,
                    y:y>this.centerSpot.y
                }
            }else if((y+h===this.dataMap[i][1]||this.dataMap[i][1]+this.unitsSize===y)&&x>=this.dataMap[i][0]&&x<=this.dataMap[i][0]+this.unitsSize){
                this.clear({x:this.dataMap[i][0],y:this.dataMap[i][1]},{w:this.unitsSize,h:this.unitsSize});
                this.dataMap.splice(i,1);
                return {
                    x:x>this.centerSpot.x,
                    y:y>this.centerSpot.y
                }
            }
        }
        return false

    }
}