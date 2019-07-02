
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

    head: ["Product Id", "Product Description", "Cost"],
    colWidths: [12, 50, 8],
    colAligns: ["center", "left", "right"],
    style: {
        head: ["aqua"],
        compact: true
    }
  });

  for (var i = 0; i < res.length; i++){
      table.push([res[i].item_id, res[i].product_name, res[i].price]);
  }

  console.log(table.toString());
  console.log("");

});

};

//prompting buyer to sell item 
var shopping = function() {
    inquirer
        .prompt({
            name: "productToBuy",
            type: "input",
            message: "Please enter the Product Id of the item you wish to purchase."
        })
        .then(function(answer1) {

            var selection = answer1.productToBuy;
            connection.query("SELECT * FROM products WHERE item_id=?", selection, function(
                err, 
                res) {

                if (err) throw err;
                if (res.length === 0) {
                    console.log("That Product doesn't exist. Please eneter a Product Id from the list above.")
                
                shopping();
                } else {
                console.log("ok");
            }
        
        });
    });
};

display();
