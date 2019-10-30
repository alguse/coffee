let items = [];
  
  function removeStock(ToBeRemoved){
    for(let i=0; i<ToBeRemoved.length; i++){
        items.ingredients.map(ingredient => {
            if (ToBeRemoved[i].ingredientID == ingredient.ingredientID) {
                ingredient.stock = ingredient.stock - ToBeRemoved[i].quantity;
            }
        });
    }
    renderIngredients();
  }

  function checkIngredients(drinkId, needed){
        let ToBeRemoved = [{error: "", missing:""}];
    let found = 0;

      for (let i = 0; i < needed.length; i++){
        found = items.ingredients.find(element => {
            return needed[i].ingredientID == element.ingredientID;
        });
    if (!found) {
        ToBeRemoved = [{ error: "Some ingredient are not available for this drink" }];
    break;
  }
        for (let j = 0; j < items.ingredients.length; j++){
          if(parseInt(items.ingredients[j].stock)<=0){
        let missing = items.ingredients[j].name;
            ToBeRemoved= [{error: "Not enough "+ missing}];
    break;
  }
              if (items.ingredients[j].ingredientID == needed[i].ingredientID) {
        found = 1;
    if (parseInt(items.ingredients[j].stock) >= parseInt(needed[i].units)) {
        let temp = {ingredientID: items.ingredients[j].ingredientID, quantity: needed[i].units }
    ToBeRemoved.push(temp);
                  } else {
        ToBeRemoved = [{ error: "Not enough " + items.ingredients[j].name }];
    }
              } else {
                  if (!found) {
        ToBeRemoved[0].error = "Some ingredient are not available for this drink";
    }
}
}
}
    if(ToBeRemoved.error!=""){
        removeStock(ToBeRemoved);
    }
    return ToBeRemoved;
  }

function prepare(drinkId){
        let pick = items.drinks.find(o => {
    if(o.drink == drinkId){
      return o;
  }
});

    document.getElementById('typed').innerHTML = "<div class='serving'>Serving " + pick.name + "</div>";
    let a = checkIngredients(drinkId, pick.ingredients);
    if (a[0].error === "") {
            document.getElementById('typed').innerHTML = "<div class='served'>Served " + pick.name +"</div>";
            document.getElementById('operation').innerHTML = "";
 }else{
        document.getElementById('typed').innerHTML = "Couldn't finish serving";
        document.getElementById('operation').innerHTML = a[0].error;
   }
  }
  
function renderIngredients(){
  var stockContainer  = document.getElementById('stock');
    stockContainer.innerHTML = "";
  items.ingredients.map(item =>{
    var newChild = '<div class="button s"> ' + item.name + '('+item.stock+')</div>';
    stockContainer.insertAdjacentHTML('beforeend', newChild);
  });
}

  function addDrink(parent, drink){
    var newChild = '<div class="button" onclick="prepare(' + drink.drink +')"> ' + drink.name + '</div>';
    parent.insertAdjacentHTML('beforeend', newChild);
}

async function init(){
  try {
        const call = await fetch('http://sergioalbarran.com/sag/back.js')
          .then(response => response.json())
          .then(items => console.log(items));
        items =
        {
            "ingredients": [
                {
                    "ingredientID": "1",
                    "cost": "0.75",
                    "name": "Coffee",
                    "stock": "10"
                },
                {
                    "ingredientID": "2",
                    "cost": "0.75",
                    "name": "Decaf Coffee",
                    "stock": "10"
                },
                {
                    "ingredientID": "3",
                    "cost": "0.25",
                    "name": "Sugar",
                    "stock": "10"
                },
                {
                    "ingredientID": "4",
                    "cost": "0.25",
                    "name": "Cream",
                    "stock": "10"
                },
                {
                    "ingredientID": "5",
                    "cost": "0.35",
                    "name": "Steamed Milk",
                    "stock": "10"
                }
            ],
            "drinks": [
                {
                    "drink": "1",
                    "name": "Coffee",
                    "status": "1",
                    "ingredients": [
                        {
                            "ingredientID": "1",
                            "units": "3"
                        },
                        {
                            "ingredientID": "4",
                            "units": "1"
                        },
                        {
                            "ingredientID": "5",
                            "units": "1"
                        }
                    ]
                },
                {
                    "drink": "2",
                    "name": "Decaf",
                    "status": "1",
                    "ingredients": [
                        {
                            "ingredientID": "2",
                            "units": "3"
                        },
                        {
                            "ingredientID": "4",
                            "units": "1"
                        },
                        {
                            "ingredientID": "5",
                            "units": "1"
                        }
                    ]
                },
                {
                    "drink": "3",
                    "name": "Late",
                    "status": "1",
                    "ingredients": [
                        {
                            "ingredientID": "1",
                            "units": "2"
                        },
                        {
                            "ingredientID": "6",
                            "units": "1"
                        }
                    ]

                },
                {
                    "drink": "4",
                    "name": "Americano",
                    "status": "1",
                    "ingredients": [
                        {
                            "ingredientID": "7",
                            "units": "3"
                        }
                    ]
                },
                {
                    "drink": "5",
                    "name": "Mocha",
                    "status": "1",
                    "ingredients": [
                        {
                            "ingredientID": "7",
                            "units": "1"
                        },
                        {
                            "ingredientID": "8",
                            "units": "1"
                        },
                        {
                            "ingredientID": "9",
                            "units": "1"
                        },
                        {
                            "ingredientID": "6",
                            "units": "1"
                        }
                    ]
                },
                {
                    "drink": "6",
                    "name": "Capuccino",
                    "status": "1",
                    "ingredients": [
                        {
                            "ingredientID": "1",
                            "units": "3"
                        },
                        {
                            "ingredientID": "6",
                            "units": "1"
                        },
                        {
                            "ingredientID": "10",
                            "units": "1"
                        }
                    ]
                }
            ]
        };

    var parent = document.getElementById('drinks');
    
items.drinks.map(drink =>{
        addDrink(parent, drink);
    })
    
    renderIngredients();
} catch (error) {
    }

}