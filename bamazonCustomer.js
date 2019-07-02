
//connect to database
var mysql = require("mysql");
var inquirer = ("inquirer");
var Table = require("cli-table2");

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Minnie12345!",
    database: "bamazon_db",
    port: 3306
})

connection.connect();


//display on commandline 
var display = function() {
  connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      console.log("-----------------------------");
      console.log("    WELCOME TO BAMAZON     ");
      console.log("-------------------------------");
      console.log("");
      console.log("Find your Procuct");
      console.log("");
  

  var table = new Table({

    head: ["Product Id", "Product Description", "Department", "Cost"],
    colWidths: [12, 30, 30, 8],
    colAligns: ["center", "left", "right"],
    style: {
        head: ["aqua"],
        compact: true
    }
  });

  for (var i = 0; i < res.length; i++){
      table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price]);
  }

  console.log(table.toString());
  console.log("");

});

};

//prompting buyer to sell item 
var shopping = function() {
    inquirer.prompt({
            name: "productToBuy",
            type: "input",
            message: "Please enter the Product Id of the item you wish to purchase."
        })
        .then(function(answer1) {

            var selection = answer1.productToBuy;
            connection.query("SELECT * FROM products WHERE item_id = ?", selection, function(
                err, 
                res) {

                if (err) throw err;
                if (res.length === 0) {
                    console.log("That Product doesn't exist. Please eneter a Product Id from the list above.")
                
                shopping();
                } else {
                console.log("ok");
                inquirer.prompt({
                    name: "quantity",
                    type: "input",
                    message: "How many would you like to buy?"
                }).then(function(answer2){

                    var quantity = answer2.quantity;
                    if (quantity > res[0].stock_quantity){
                        console.log("Sorry, we only have" + res[0].stock_quantity + " items of the product selected")
                        shopping();
                    } else {
                        console.log("");
                        console.log(res[0].product_name + " purchased");
                        console.log(quantity + " qty @ $" + res[0].price);

                        //update stock quantity after purchase
                        var newQuantity = res[0].stock_quantity - quantity;
                        connection.query(
                            "UPDATE products SET stock_quantity = " + newQuantity + "WHERE item_id = " + res[0].id, function(err, resUpdate) {
                                if (err) throw err;
                                console.log("");
                                console.log("Your Order has been Processed");
                                console.log("Thanks for shopping.");
                                console.log("");
                            }
                        )
                    }

                })
            }
        
        });
    });
};

display();
// shopping();