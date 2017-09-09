bloclArr=[
    [1,1,1,1,1],
    [1,1,1,1,1],
    [1,1,1,1,1],

]
class Scene{
    constructor(con){
        this.scene=con;
        this.ctx = this.scene.getContext('2d');
        this.movingLeft=false;
        this.movingRight=false;
        this.ballFlying=true;
        this.keyBinding();
        this.gameing=false;
        this.blockArr=[...bloclArr]
        this.getBlocks()

    }
    getBlocks(){
        let img=new Image();
        img.src='./images/block.png';

        img.onload=()=>{
            this.blockArr.forEach((i,index)=>{
                i.forEach((k,kndex)=>{
                    this.blockArr[index][kndex]=new DrawTarget(this.ctx,{x:kndex*img.width+160,y:index*img.height+10},img,k);


                })
            })
        }

    }
    keyBinding(){
        window.addEventListener('keydown',(e)=>{
            if(e.key==='a'){
                this.movingLeft=true
            }
            if(e.key==='d'){
                this.movingRight=true
            }
            if(e.key==='f'){
                this.ballFlying=!this.ballFlying
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
    clearScene(){
        this.ctx.clearRect(0,0,this.scene.width,this.scene.height)
    }

    gameover(){
        clearInterval(this.timer)
        this.gameing=false
    }
    start(){
        if(this.gameing){
            return
        }
        this.gameing=true
        let plank=new DrawPlank(this.ctx,{x:200,y:280},'./images/paddle.png');
        let ball=new DrawBall(this.ctx,{x:210,y:270},'./images/ball.png');


        ball.debugMode(this.scene);

        this.timer=setInterval(()=>{

            this.clearScene();
            if(this.blockArr.every(i=>i.every(k=>k.life<=0))){
                this.gameover()
                alert('YOU WIN')
            }
            this.blockArr.forEach(i=>{
                i.forEach(k=>{

                    if(k.life>0){
                        let hit=k.hitCheck(ball)
                        if(hit){
                            k.life-=1;
                            ball.hitBorder(hit)
                        }
                        k.draw()
                    }

                })
            })
            if(this.movingLeft){
                plank.moveLeft()
            }
            if(this.movingRight){
                plank.moveRight()
            }
            if(!ball.fly(this.ballFlying)){
                this.gameover()
            }

            if(plank.hitCheck(ball)){
                ball.hitBorder('bottom')
            }

            plank.draw();
            ball.draw();

        },1000/60)
    }

}

class Draw{
    constructor(context,position,url){
        this.position=position;
        this.context=context;
        if(typeof url==='string'){
            let img=new Image();
            img.src=url;
            this.img=new Promise((resolve)=>{
                img.onload=()=>{
                    this.size={
                        w:img.width,
                        h:img.height
                    }
                    resolve(img)
                }
            })
        }else {
            this.img=url;
            this.size={
                w:url.width,
                h:url.height
            }
        }




    }
    draw(){
        let {x,y}=this.position;
        this.img.then((img)=>{
            this.context.drawImage(img,x,y)
        })
    }
    hitCheck(o2,o1=this){
        let {x:x2,y:y2}=o2.position,{w:w2,h:h2}=o2.size;
        let {x:x1,y:y1}=o1.position,{w:w1,h:h1}=o1.size;
        let o1center={
            x:w1/2+x1,
            y:h1/2+y1
        };
        let o2center={
            x:w2/2+x2,
            y:h2/2+y2
        };

        if(Math.abs(o1center.x-o2center.x)<=w1/2+w2/2){
            if(Math.abs(o1center.y-o2center.y)<=h1/2+h2/2){

                let crossX=x1+w1-x2>w1?x2+w2-x1:x1+w1-x2;
                let crossY=y1+h1-y2>h1?y2+h2-y1:y1+h1-y2;
                if(crossX>crossY){
                    if(y2>y1){
                        return 'top'
                    }else{
                        return 'bottom'
                    }

                }else{
                    if(x2>x1){
                        return 'right'
                    }else{
                        return 'left'
                    }

                }
            }
        }

    }
}
class DrawPlank extends Draw{
    constructor(context,position,url){
        super(context,position,url);
        this.stap=5;
    }
    moveLeft(){
        //this.clear();

        this.position.x-=this.stap
        if(this.position.x<=0){
            this.position.x=0
        }
    }
    moveRight(){
        //this.clear();
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
        this.angle=50;
        this.moveStap=5;
        this.stap={
            x:this.calcX(),
            y:0-this.calcY()
        };



    }
    debugMode(scene){
        let mouseMoveHandle=(e)=>{
            this.position={
                x:e.offsetX,
                y:e.offsetY
            }
        }
        scene.addEventListener('mousedown',(e)=>{
            let {x,y}=this.position,{w,h}=this.size
            if(e.offsetX>=x&&e.offsetX<=x+w&&e.offsetY>=y&&e.offsetY<=y+h){
                scene.addEventListener('mousemove',mouseMoveHandle)
            }
        })
        scene.addEventListener('mouseup',()=>{
            scene.removeEventListener('mousemove',mouseMoveHandle)
        })
    }
    calcX(angle=this.angle,stap=this.moveStap){
        console.log(angle)
        let x;
        x=Math.round(stap*Math.sin((90-angle)*Math.PI/180))
        return x

    }
    calcY(angle=this.angle,stap=this.moveStap){
        let y;
        y=Math.round(stap*Math.cos((90-angle)*Math.PI/180))
        return y
    }
    fly(isFly){
        if(!isFly){
            return true
        }
        let borderX=this.context.canvas.clientWidth,borderY=this.context.canvas.clientHeight;
        let w=this.size.w,h=this.size.h;
        let x=this.position.x,y=this.position.y;
        if(y+h>=borderY){

            alert('game over')
            return false
        }
        if(y<=0){
            this.hitBorder('top')
        }
        if(x+w>=borderX){
            this.hitBorder('right')
        }
        if(x<=0){
            this.hitBorder('left')
        }
        this.position.x+=this.stap.x;
        this.position.y+=this.stap.y

        return true

    }
    hitBorder(border){


        switch (border){
            case 'left':
                this.stap.x=0-this.stap.x;
                break
            case 'right':
                this.stap.x=0-this.stap.x;
                break
            case 'top':
                this.stap.y=0-this.stap.y;
                break
            case 'bottom':

                this.stap.y=0-this.calcY(Math.ceil(Math.random()*30)+30);
                debugger
                break

        }

    }

}

class DrawTarget extends Draw{
    constructor(context,position,url,life=1){

        super(context,position,url);
        this.life=life;

    }
    draw(){
        let {x,y}=this.position;
        if(this.life>0){
            this.context.drawImage(this.img,x,y)
        }

    }
}