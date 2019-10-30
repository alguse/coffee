let items = [];

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

function checkIngredients(drinkId, needed) {
    let ToBeRemoved = [{ error: "", missing: "" }];
    let found = 0;

    for (let i = 0; i < needed.length; i++) {
        found = items.ingredients.find(element => {
            return needed[i].ingredientID == element.ingredientID;
        });
        if (!found) {
            ToBeRemoved = [{ error: "Some ingredient are not available for this drink" }];
            break;
        }
        for (let j = 0; j < items.ingredients.length; j++) {
            if (parseInt(items.ingredients[j].stock) <= 0) {
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

function renderIngredients() {
    var stockContainer = document.getElementById('stock');
    stockContainer.innerHTML = "";
    items.ingredients.map(item => {
        var newChild = '<div class="button s"> ' + item.name + '(' + item.stock + ')</div>';
        stockContainer.insertAdjacentHTML('beforeend', newChild);
    });
}

async function reStock() {
    await fetch('https://raw.githubusercontent.com/alguse/coffee/master/data.json')
        .then(response => response.json())
        .then(data => items = data);
    renderIngredients();
}

function addDrink(parent, drink) {
    var newChild = '<div class="button" onclick="prepare(' + drink.drink + ')"> ' + drink.name + '</div>';
    parent.insertAdjacentHTML('beforeend', newChild);
}

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
    }
}