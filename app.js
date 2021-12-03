//Дэлгэцтэй ажиллах контроллер
var uiController = (function(){

    var DOMstrings = {
        add__type :".add__type",
        add__description :".add__description",
        add__value :".add__value",
        add__btn :".add__btn",
        income__list :".income__list"
    };
    return {
        getInput: function(){
            return {
                type: document.querySelector(DOMstrings.add__type).value,
                description: document.querySelector(DOMstrings.add__description).value,
                value: document.querySelector(DOMstrings.add__value).value
            }
        },
       getDOMstrings: function(){
            return DOMstrings; 
        },
        addListItem: function(item,type){
            var html, list;
            if(type === 'inc'){
                list = '.income__list';
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%DESCRIPTIN%</div><div class="right clearfix"><div class="item__value">+ %VALUE%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }else{
                list = '.expenses__list';
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%DESCRIPTIN%</div><div class="right clearfix"><div class="item__value">- %VALUE%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
           var html = html.replace("%id%", item.id);
           var html = html.replace("%DESCRIPTIN%", item.desc);
           var html = html.replace("%VALUE%", item.value);

           document.querySelector(list).insertAdjacentHTML("beforeend",html);


        }
    };
})();
//Санхүүтэй ажиллах контроллер
var financeController = (function(){

    var Income = function(id,desc,value) {
        this.id = id;
        this.desc = desc;
        this.value = value;
    };
    var Expense = function(id,desc,value) {
        this.id = id;
        this.desc = desc;
        this.value = value;
        
    };
    var data = {
        items:{
            inc:[],
            exp:[]
        },
        totals: {
            inc:0,
            exp:0
        }
    };
    return {
        addItem: function(type, desc, val){
            var item, id;
            if(data.items[type].length === 0){id = 1;}else{
                id = data.items[type][data.items[type].length - 1].id + 1;
            }
            if(type === 'inc'){
                item = new Income(id,desc,val);
            }else{
                item = new Expense(id,desc,val);
            }
            
            data.items[type].push(item);
            return item;
        }
    };

})();
//Порограмын холбогч контроллер
var appController = (function(uiCtrllr, fnCtrllr){
    var ctrlAddItem = function(){
       var input = uiCtrllr.getInput();
       
       var item = fnCtrllr.addItem(input.type,input.description,input.value);
       
        uiCtrllr.addListItem(item,input.type);
    }

    var setupEventlisteners = function(){
        var DOM = uiCtrllr.getDOMstrings();
        document.querySelector(DOM.add__btn).addEventListener('click',function(){
            ctrlAddItem();
        });
        document.addEventListener('keypress', function(event){
            if(event.key === 'Enter' || event.key === 'NumpadEnter'){
                ctrlAddItem();
            }
        });
    }

    return{
        init: function(){
            setupEventlisteners();
        }
    }
})(uiController, financeController);

appController.init();

