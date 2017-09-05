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
        let squ=new Draw(this.ctx,{x:200,y:280},{w:50,h:10})
        let ball=new DrawBall(this.ctx,{x:210,y:270},{w:10,h:10})
        this.timer=setInterval(()=>{
            if(this.movingLeft){
                squ.moveLeft()
            }
            if(this.movingRight){
                squ.moveRight()
            }
            squ.draw();
            ball.fly();
            ball.draw()
        },1000/60)
    }

}

class Draw{
    constructor(context,position,size){
        context.fillStyle = "rgb(200,0,0)";


        this.position=position;
        this.size=size;
        this.context=context;
        this.stap=5;

    }
    draw(){

        let {x,y}=this.position,{w,h}=this.size;
        this.context.fillRect(x,y,w,h)
    }
    clear(){
        let {x,y}=this.position,{w,h}=this.size;
        this.context.clearRect(x, y, w, h)
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
        this.way={x:true,y:false}
    }
    fly(){
        this.clear();
        this.decide();
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

    }
    decide(){
        let borderX=this.context.canvas.clientWidth,borderY=this.context.canvas.clientHeight;
        let w=this.size.w,h=this.size.h;
        let x=this.position.x,y=this.position.y;
        if(y+h>=borderY){
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
    }
}