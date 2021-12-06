//Дэлгэцтэй ажиллах контроллер
var uiController = (function(){

    var DOMstrings = {
        add__type :".add__type",
        add__description :".add__description",
        add__value :".add__value",
        add__btn :".add__btn",
        income__list :".income__list",
        expenses__list :".expenses__list",
        budget__value :".budget__value",
        budget__income__value :".budget__income--value",
        budget__expenses__value :".budget__expenses--value",
        budget__expenses__percentage :".budget__expenses--percentage"
    };
    return {
        getInput: function(){
            return {
                type: document.querySelector(DOMstrings.add__type).value,
                description: document.querySelector(DOMstrings.add__description).value,
                value: parseInt(document.querySelector(DOMstrings.add__value).value)
            }
        },
       getDOMstrings: function(){
            return DOMstrings; 
        },

        clearFields: function(){
            var fields = document.querySelectorAll(DOMstrings.add__description + ", " + DOMstrings.add__value);

            var fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(el => {
                el.value = '';
            });
            fieldsArr[0].focus();
        },
        tusviigUzuuleh: function(tusuv){
            document.querySelector(DOMstrings.budget__value).textContent = tusuv.tusuv;
            document.querySelector(DOMstrings.budget__income__value).textContent = tusuv.totalInc;
            document.querySelector(DOMstrings.budget__expenses__value).textContent = tusuv.totalExp;
            document.querySelector(DOMstrings.budget__expenses__percentage).textContent = tusuv.huvi + "%";
        },

        addListItem: function(item,type){
            var html, list;
            if(type === 'inc'){
                list = DOMstrings.income__list;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%DESCRIPTIN%</div><div class="right clearfix"><div class="item__value">+ %VALUE%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }else{
                list = DOMstrings.expenses__list;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%DESCRIPTIN%</div><div class="right clearfix"><div class="item__value">- %VALUE%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
           var html = html.replace("%id%", item.id);
           var html = html.replace("%DESCRIPTIN%", item.desc);
           var html = html.replace("%VALUE%", item.value);

           document.querySelector(list).insertAdjacentHTML("beforeend",html);


        },
        // updateIncItem: function(){

        // }
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
    var calculatetotal = function(type){
        var sum = 0;
        data.items[type].forEach(el => {
            sum = sum + el.value;
        });
        data.totals[type] = sum;
    }
    var data = {
        items:{
            inc:[],
            exp:[]
        },
        totals: {
            inc:0,
            exp:0
        },
        tusuv: 0,

        huvi: 0
    };
    return {
        tusuvtootsooloh: function(){
            calculatetotal('inc');
            calculatetotal('exp');
            data.tusuv = data.totals.inc - data.totals.exp;

            data.huvi = Math.round((data.totals.exp / data.totals.inc) *100);
        },
        tusuvAvah: function(){
            return{
                tusuv: data.tusuv,
                huvi: data.huvi,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp
            }
        },
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
        },
        
    };

})();
//Порограмын холбогч контроллер
var appController = (function(uiCtrllr, fnCtrllr){
    var ctrlAddItem = function(){
       var input = uiCtrllr.getInput();
       if(input.description !== "" && input.value !== ""){
           var item = fnCtrllr.addItem(input.type,input.description,input.value);
       }
       
        uiCtrllr.addListItem(item,input.type);
        uiCtrllr.clearFields();

        fnCtrllr.tusuvtootsooloh();
        var tusuv = fnCtrllr.tusuvAvah();

        uiCtrllr.tusviigUzuuleh(tusuv);
        console.log(tusuv);

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
            uiCtrllr.tusviigUzuuleh({
                tusuv: 0,
                huvi: 0,
                totalInc: 0,
                totalExp: 0
            });
            setupEventlisteners();
        }
    }
})(uiController, financeController);

appController.init();

