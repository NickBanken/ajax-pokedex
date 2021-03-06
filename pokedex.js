console.log("connected")

let pokeReq = '';
let ul=document.getElementById('ul #moveList');
let evol = "";
let currentId = 0;


$("#yellowBox2" ).click(function( event ) {
    //get the value that was filled in the form
    pokeReq = $('#pokemon').val().toLowerCase();
    event.preventDefault();
    getAll();
  });

  $("#leftcross").click(function() {
    if (currentId !=1){
        currentId = currentId-1;
        pokeReq = currentId;
        getAll();
    }else{
        pokeReq = 802;
        getAll();
    }  
  });

  $("#rightcross").click(function() {
    if (currentId !=1){
        currentId = currentId+1;
        pokeReq = currentId;
        getAll();
    }else{
        pokeReq = 802;
        getAll();
    }  
  });


  


$('form input').keydown(function (e) {
    if (e.keyCode == 13) {
        e.preventDefault();
        $("#yellowBox2").click();
        return false;
    }
});

function getAll(){
    //connect to the server. request is send.
    $.ajax({url: "https://pokeapi.co/api/v2/pokemon/"+pokeReq+'/', success: function(poke){

    //functions that will be executed.
    clearAll();
    movesGen(poke);
    getID(poke);
    getImg(poke);
    getEvo(poke)
    $('#pokemon').val("");
    }});
}

function clearAll(){
    $("#evoText").html("");
    $("li").remove();
    $('#pokeImg').removeAttr('src');
    $('#prevImg').removeAttr('src');
    evol = "";
}

function movesGen(move){
    $('#moveText').html("<strong>Move: </strong>");
    
    let pokeMove = move.moves;
    /* console.log(pokeMove); */
    if(pokeMove.length >=4){
        for(i=0; i<4; i++){
            
            $("ul").append("<li>"+pokeMove[i].move.name+"</li>");
        } 
    }
    else{
        for(i=0; i<pokeMove.length; i++){
            $("ul").append("<li>"+pokeMove[i].move.name+"</li>");
        }   
    }
}

function getImg(img){
    $("#pokeImg").attr("src",img.sprites.front_default)
}

function getEvo(img){
    evol = img.species.url;
    
    $.ajax({url: evol, success: function(chain){

        if(chain.evolves_from_species !== null){
            chain = chain.evolves_from_species.name;
        $("#evoText").html("Evolution of: ");
        
        $.ajax({url: `https://pokeapi.co/api/v2/pokemon/`+chain, success: function(prevEvo){
            $("#prevImg").attr("src",prevEvo.sprites.front_default) 
        }})
    
        }
    }})  
}

function getID(id){
    /* let pokeName = $(this).val($(this).val()) */
    currentId = id.id;
    $("#name").html("<strong>Name: </strong> "+id.name.toUpperCase());
    $("#ids").html("<strong>ID: </strong> #"+id.id);
}


/* var mousePointer = document.getElementById('pokedex')

document.addEventListener('mousemove', function(e){
    var x = e.pageX / window.innerHeight;
        x = x * 5;
    mousePointer.style.webkitTransform = 'translateX(' + x + '%)';
    mousePointer.style.transform = 'translateX(' + x + '%)';
  }) */

// Vendor code for image panning
  (function($){
    
    $(document).ready(function(){
      //call imagePanning fn when DOM is ready
      $(".content img").imagePanning();
    });
    
    //imagePanning fn
    $.fn.imagePanning=function(){
      var init="center",
        speed=800, //animation/tween speed
        //custom js tween
        _tweenTo=function(el,prop,to,duration,easing,overwrite){
          if(!el._mTween){el._mTween={top:{},left:{}};}
          var startTime=_getTime(),_delay,progress=0,from=el.offsetTop,elStyle=el.style,_request,tobj=el._mTween[prop];
          if(prop==="left"){from=el.offsetLeft;}
          var diff=to-from;
          if(overwrite!=="none"){_cancelTween();}
          _startTween();
          function _step(){
            progress=_getTime()-startTime;
            _tween();
            if(progress>=tobj.time){
              tobj.time=(progress>tobj.time) ? progress+_delay-(progress-tobj.time) : progress+_delay-1;
              if(tobj.time<progress+1){tobj.time=progress+1;}
            }
            if(tobj.time<duration){tobj.id=_request(_step);}
          }
          function _tween(){
            if(duration>0){
              tobj.currVal=_ease(tobj.time,from,diff,duration,easing);
              elStyle[prop]=Math.round(tobj.currVal)+"px";
            }else{
              elStyle[prop]=to+"px";
            }
          }
          function _startTween(){
            _delay=1000/60;
            tobj.time=progress+_delay;
            _request=(!window.requestAnimationFrame) ? function(f){_tween(); return setTimeout(f,0.01);} : window.requestAnimationFrame;
            tobj.id=_request(_step);
          }
          function _cancelTween(){
            if(tobj.id==null){return;}
            if(!window.requestAnimationFrame){clearTimeout(tobj.id);
            }else{window.cancelAnimationFrame(tobj.id);}
            tobj.id=null;
          }
          function _ease(t,b,c,d,type){
            var ts=(t/=d)*t,tc=ts*t;
            return b+c*(0.499999999999997*tc*ts + -2.5*ts*ts + 5.5*tc + -6.5*ts + 4*t);
          }
          function _getTime(){
            if(window.performance && window.performance.now){
              return window.performance.now();
            }else{
              if(window.performance && window.performance.webkitNow){
                return window.performance.webkitNow();
              }else{
                if(Date.now){return Date.now();}else{return new Date().getTime();}
              }
            }
          }
        };
      return this.each(function(){
        var $this=$(this),timer,dest;
        if($this.data("imagePanning")) return;
        $this.data("imagePanning",1)
          //create markup
          .wrap("<div class='img-pan-container' />")
          .after("<div class='resize' style='position:absolute; width:auto; height:auto; top:0; right:0; bottom:0; left:0; margin:0; padding:0; overflow:hidden; visibility:hidden; z-index:-1'><iframe style='width:100%; height:0; border:0; visibility:visible; margin:0' /><iframe style='width:0; height:100%; border:0; visibility:visible; margin:0' /></div>")
          //image loaded fn
          .one("load",function(){
            setTimeout(function(){ $this.addClass("loaded").trigger("mousemove",1); },1);
          }).each(function(){ //run load fn even if cached
            if(this.complete) $(this).load();
          })
          //panning fn
          .parent().on("mousemove touchmove MSPointerMove pointermove",function(e,p){
            var cont=$(this);
            e.preventDefault();
            var contH=cont.height(),contW=cont.width(),
              isTouch=e.type.indexOf("touch")!==-1,isPointer=e.type.indexOf("pointer")!==-1,
              evt=isPointer ? e.originalEvent : isTouch ? e.originalEvent.touches[0] || e.originalEvent.changedTouches[0] : e,
              coords=[
                !p ? evt.pageY-cont.offset().top : init==="center" ? contH/2 : 0,
                !p ? evt.pageX-cont.offset().left : init==="center" ? contW/2 : 0
              ];
            dest=[Math.round(($this.outerHeight(true)-contH)*(coords[0]/contH)),Math.round(($this.outerWidth(true)-contW)*(coords[1]/contW))];
          })
          //resize fn
          .find(".resize iframe").each(function(){
            $(this.contentWindow || this).on("resize",function(){
              $this.trigger("mousemove",1);
            });
          });
        //panning animation 60FPS
        if(timer) clearInterval(timer);
        timer=setInterval(function(){
          _tweenTo($this[0],"top",-dest[0],speed);
          _tweenTo($this[0],"left",-dest[1],speed);
        },16.6);
      });
    }
    
  })(jQuery);

  