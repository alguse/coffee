let items = [];

/*
 * Function to remove used items for drink being served 
 * ToBeRemoved: array of items to be removed {ingredientID, quantity to remove}
 */
function removeStock(ToBeRemoved) {
    for (let i = 0; i < ToBeRemoved.length; i++) {
        items.ingredients.map(ingredient => {
            if (ToBeRemoved[i].ingredientID == ingredient.ingredientID) {
                ingredient.stock = ingredient.stock - ToBeRemoved[i].quantity;
            }
        });
    }
    renderIngredients();
}

/*
 * Function to check ingredient availability
 * needed: Ingredients needed to make a drink
 * Returns if all items are available
 */
function checkIngredients(drinkId, needed) {
    let ToBeRemoved = [{ error: "", missing: "" }];
    let found = 0;

    for (let i = 0; i < needed.length; i++) {
        //If an ingredient is missing
        found = items.ingredients.find(element => {
            return needed[i].ingredientID == element.ingredientID;
        });
        if (!found) {
            ToBeRemoved = [{ error: "Some ingredient are not available for this drink" }];
            break;
        }
        for (let j = 0; j < items.ingredients.length; j++) {
            if (parseInt(items.ingredients[j].stock) <= 0) {
                //If not enough ingredients
                let missing = items.ingredients[j].name;
                ToBeRemoved = [{ error: "Not enough " + missing }];
                break;
            }
            if (items.ingredients[j].ingredientID == needed[i].ingredientID) {
                found = 1;
                if (parseInt(items.ingredients[j].stock) >= parseInt(needed[i].units)) {
                    let temp = { ingredientID: items.ingredients[j].ingredientID, quantity: needed[i].units }
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
    if (ToBeRemoved.error != "") {
        removeStock(ToBeRemoved);
    }
    return ToBeRemoved;
}

/*
 * Function to prepare a drink updating screen caption
 * drinkId: Id of the drink to be served
 */
function prepare(drinkId) {
    let pick = items.drinks.find(o => {
        if (o.drink == drinkId) {
            return o;
        }
    });

    document.getElementById('typed').innerHTML = "<div class='serving'>Serving " + pick.name + "</div>";
    let a = checkIngredients(drinkId, pick.ingredients);
    if (a[0].error === "") {
        document.getElementById('typed').innerHTML = "<div class='served'>Served " + pick.name + "</div>";
        document.getElementById('operation').innerHTML = "";
    } else {
        document.getElementById('typed').innerHTML = "Couldn't finish serving";
        document.getElementById('operation').innerHTML = a[0].error;
    }
}

/*
 * Function render Ingredient table
 */
function renderIngredients() {
    var stockContainer = document.getElementById('stock');
    stockContainer.innerHTML = "";
    items.ingredients.map(item => {
        var newChild = '<div class="button s"> ' + item.name + '(' + item.stock + ')</div>';
        stockContainer.insertAdjacentHTML('beforeend', newChild);
    });
}

/*
 * Function to update stock 
 */
async function reStock() {
    await fetch('https://raw.githubusercontent.com/alguse/coffee/master/data.json')
        .then(response => response.json())
        .then(data => items = data);
    renderIngredients();
}

/*
 * Function to add drinks to the table
 * parent: div container for drinks, drink: item to be added to the table
 */
function addDrink(parent, drink) {
    var newChild = '<div class="button" onclick="prepare(' + drink.drink + ')"> ' + drink.name + '</div>';
    parent.insertAdjacentHTML('beforeend', newChild);
}

/*
 * Function to init coffee maching
 */
async function init() {
    document.getElementById("restock").addEventListener("click", reStock);

    try {
        await fetch('https://raw.githubusercontent.com/alguse/coffee/master/data.json')
            .then(response => response.json())
            .then(data => items = data);

        var parent = document.getElementById('drinks');

        items.drinks.map(drink => {
            addDrink(parent, drink);
        })

        renderIngredients();
    } catch (error) {
        return error;
    }
}
