$(document).ready(function() {
    
       
    $(".figure").on("click", function() {
        game.gamePlay($(this).attr("id"));
    });
     $("#attack").on("click", function() {
        game.attack();
       
    });
});

//When reset button is enabled, to capture on click.
$(document).on("click","#reset",function(){
    game.reset();
});


var game = {
    characters: [
        ['chewy',65,5], //name, health, fight power
        ['vader',145,16],
        ['leia',172,11],
        ['r2d2',190,18]
    ],
    enemySelected: false,
    gameStarted: false,
    myPlayer: [],
    currentEnemy: [],
    enemiesRem: [],
    myHp: '',
    enemyHp: '',
    message: '',
    initiate: function(character) {
        var charH3=$('<h3>');
        charH3.html("My Character");
        $('#myChar').append(charH3);
        var enemH3=$('<h3>');
        enemH3.html("Enemies");
        $('#enemies').append(enemH3);

        this.myPlayer.push(character);
        for(var i=0;i<this.characters.length; i++) {
            if(this.characters[i][0]===character) {
                $("#"+character).detach().appendTo("#myChar");
                this.myPlayer.push(this.characters[i][1]);
                this.myPlayer.push(this.characters[i][2]);
                this.myPlayer.push(this.characters[i][3]);
            } else {
                $("#"+this.characters[i][0]).detach().appendTo("#enemies");
                $("#"+this.characters[i][0]).addClass("figure-red");
                this.enemiesRem.push(this.characters[i][0]);
            }
        }
        this.updateData();
        this.gameStarted=true;
    },
    reset: function() {
        location.reload();
    }, 
    gamePlay: function(character) {
        if(!this.gameStarted) {
            this.initiate(character);
        } else if(this.gameStarted && !this.enemySelected) {
            this.message="";
            this.myHp="";
            this.enemyHp="";
            if(character===this.myPlayer){
                this.message="You can't fight yourself";
                return; 
            }
            this.currentEnemy = $.grep(this.characters, function(v) {
                
                return v[0] === character;
            });
            

            var charH3=$('<h3 id="currOp">');
            charH3.html("Current Opponent");
            $('#myChar').append(charH3);
            $("#"+character).detach().appendTo("#myChar");

            this.enemiesRem=jQuery.grep(this.enemiesRem, function(value) {
                return value != character;
            });
            this.enemySelected=true;
            $("#attack").removeClass("disabled");
            $("#attack").removeAttr("disabled");

            this.updateData();
        }
    },
    attack: function () {
        if(this.gameStarted && this.enemySelected) {
            console.log("attack");
            console.log("my player is "+this.myPlayer);
            console.log("current Enemy is "+this.currentEnemy);
            if(this.myPlayer[1] > 0)
            {
                this.currentEnemy[0][1] = this.currentEnemy[0][1]-this.myPlayer[2];
                this.myHp="You attacked "+this.currentEnemy[0][0]+" for "+this.myPlayer[2]+" damage.";

                this.myPlayer[2] = this.myPlayer[2] + 10;
                if (this.currentEnemy[0][1]>0) {
                    this.myPlayer[1] -= this.currentEnemy[0][2];
                    this.enemyHp=this.currentEnemy[0][0]+" attacked you for "+this.currentEnemy[0][2]+" damage.";
                    if(this.myPlayer[1]<=0) {
                        this.message="Game Over. You Lost!";
                        game.restart();
                    }
                } else {
                    this.message="You've won this round! Select another enemy";
                    $("#"+this.currentEnemy[0][0]).remove();
                    $("#currOp").remove();
                    this.enemySelected=false;
                }

            } else {
                this.message="Game Over. You Lost!";
                game.restart();
            }
            this.updateData();
            if(jQuery.isEmptyObject(this.enemiesRem) && !this.enemySelected){
                
                this.message="Game Over. You Won!";
                this.myHp="";
                this.enemyHp="";
                this.updateData();
                game.restart();
            }
        }
    },
    restart: function() {
        
        var data='<button id="reset"  class="btn btn-lg btn-default">\
                Reset\  </button>';
        $("#buttons").append(data);
        $("#attack").addClass("disabled");
        $("#attack").attr("disabled","disabled");
    },
    updateData: function() {
        if(this.gameStarted && this.enemySelected) {
            $("#"+this.myPlayer[0]+"-hp").html(this.myPlayer[1]);
            $("#"+this.currentEnemy[0][0]+"-hp").html(this.currentEnemy[0][1]);
        } else {
            $("#chewy-hp").html(this.characters[0][1]);
            $("#vader-hp").html(this.characters[1][1]);
            $("#leia-hp").html(this.characters[2][1]);
            $("#r2d2-hp").html(this.characters[3][1]);

        }
        $("#message").html(this.message);
        $("#hp").html(this.myHp);
        $("#enemyHp").html(this.enemyHp);
    }
}

