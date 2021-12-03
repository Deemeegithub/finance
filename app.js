//Дэлгэцтэй ажиллах контроллер
var uiController = (function(){

    return {
        publicAdd: function(){

        }
    };
})();
//Санхүүтэй ажиллах контроллер
var financeController = (function(){

    return {
        publicAdd: function(){

        }
    };
})();
//Порограмын холбогч контроллер
var appController = (function(uiCtrllr, fnCtrllr){
    
    var ctrlAddItem = function(){
        alert("sf");
    }

    document.querySelector('.add__btn').addEventListener('click',function(){
        
    });
    document.addEventListener('keypress', function(event){
        if(event.code === 'Enter'){
            ctrlAddItem();
        }
    });
})(uiController, financeController);