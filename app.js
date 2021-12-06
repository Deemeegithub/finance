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
        budget__expenses__percentage :".budget__expenses--percentage",
        container :".container",
        item__percentage: ".item__percentage",
        budget__title__month: ".budget__title--month"
    };

    var nodelistForeach = function(list,callback){
        for(i = 0; i < list.length; i++){
            callback(list[i],i);
        }
    }

    var formatter = new Intl.NumberFormat('mn-MN', {
        style: 'currency',
        currency: 'MNT',
      
        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
      });

    return {
        changeType : function(){
            var fields = document.querySelectorAll(DOMstrings.add__description + "," + DOMstrings.add__value);
            nodelistForeach(fields,function(el){
                el.classList.toggle("red-focus");
            });
            document.querySelector(DOMstrings.add__btn).classList.toggle("red");
        },
        displayDate: function(){
            var unuudur = new Date();
            document.querySelector(DOMstrings.budget__title__month).textContent = unuudur.getFullYear() + " Оны " + unuudur.getMonth() +" Сарын ";
        },
        getInput: function(){
            return {
                type: document.querySelector(DOMstrings.add__type).value,
                description: document.querySelector(DOMstrings.add__description).value,
                value: parseInt(document.querySelector(DOMstrings.add__value).value)
            }
        },

        displayPercentage: function(allPercentages){
            var el = document.querySelectorAll(DOMstrings.item__percentage);
            nodelistForeach(el,function(el,index){
                el.textContent = allPercentages[index]+"%";
            });
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
            document.querySelector(DOMstrings.budget__value).textContent = formatter.format(tusuv.tusuv);
            document.querySelector(DOMstrings.budget__income__value).textContent = formatter.format(tusuv.totalInc);
            document.querySelector(DOMstrings.budget__expenses__value).textContent = formatter.format(tusuv.totalExp);
            var huvitemdeg = "0%"; if(parseInt(tusuv.huvi)>0 && parseInt(tusuv.huvi)<=100){huvitemdeg=tusuv.huvi+"%";}
            document.querySelector(DOMstrings.budget__expenses__percentage).textContent =  huvitemdeg;
        },

        addListItem: function(item,type){
            var html, list;
            if(type === 'inc'){
                list = DOMstrings.income__list;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%DESCRIPTIN%</div><div class="right clearfix"><div class="item__value">+ %VALUE%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }else{
                list = DOMstrings.expenses__list;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%DESCRIPTIN%</div><div class="right clearfix"><div class="item__value">- %VALUE%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
           var html = html.replace("%id%", item.id);
           var html = html.replace("%DESCRIPTIN%", item.desc);
           var html = html.replace("%VALUE%", formatter.format(item.value));

           document.querySelector(list).insertAdjacentHTML("beforeend",html);

        },
       deleteListItem: function(id){
           var el = document.getElementById(id);
           el.parentNode.removeChild(el);

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
        this.percentage = -1;
        
    };
    Expense.prototype.calcPercentage = function(totalInc){
        
        if(totalInc > 0){
            this.percentage = Math.round((this.value / totalInc) * 100);
        }else{this.percentage = 0;}
    };
    Expense.prototype.getPercentage = function(){
        return this.percentage;
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
            if(data.totals.inc > 0){
                data.huvi = Math.round((data.totals.exp / data.totals.inc) * 100);
            }else{data.huvi = 0;}
        },
        calculatePercentages: function(){
            data.items.exp.forEach(el => {
                el.calcPercentage(data.totals.inc);
            });
        },
        getPercentages: function(){
            allPercentages = data.items.exp.map(function(el){
                return el.getPercentage();
            });
            return allPercentages;
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
        deleteItem: function(type, id){
            ids = data.items[type].map(function(el){
                return el.id;
            });
            index = ids.indexOf(id);
            if(index !== -1){
                data.items[type].splice(index,1);
            }
        }
    };

})();
//Порограмын холбогч контроллер
var appController = (function(uiCtrllr, fnCtrllr){
    var ctrlAddItem = function(){
       var input = uiCtrllr.getInput();
       if((input.description !== "" && input.value !== "")&&parseInt(input.value)>0){
           var item = fnCtrllr.addItem(input.type,input.description,input.value);
           uiCtrllr.addListItem(item,input.type);
       }
       
        uiCtrllr.clearFields();

        updateTusuv();
    }

    updateTusuv = function(){
        fnCtrllr.tusuvtootsooloh();
        var tusuv = fnCtrllr.tusuvAvah();
        uiCtrllr.tusviigUzuuleh(tusuv);

        fnCtrllr.calculatePercentages();
        var allPercentages = fnCtrllr.getPercentages();
        uiCtrllr.displayPercentage(allPercentages);
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
        document.querySelector(DOM.container).addEventListener('click', function(event){
           var clid = event.target.parentNode.parentNode.parentNode.parentNode.id;
           arr = clid.split("-");
           var type = arr[0];
           var itemId = parseInt(arr[1]);
           if(type === 'inc' || type === 'exp'){
               fnCtrllr.deleteItem(type,itemId);
               uiCtrllr.deleteListItem(clid);

               updateTusuv();
           }
        });

        document.querySelector(DOM.add__type).addEventListener('change', uiCtrllr.changeType);
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
            uiCtrllr.displayDate();
        }
    }
})(uiController, financeController);

appController.init();

