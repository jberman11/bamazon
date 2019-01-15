var mysql = require("mysql");
var inquirer = require("inquirer")

var connection = mysql.createConnection({
  host: "localhost",

  
  port: 8889,

 
  user: "root",

  
  password: "root",
  database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    ;
    
  });


inquirer.prompt({
    type: "input",
    name: "product",
    message:"What is the Product ID?"
}).then(function(answer){
    inquirer.prompt({
        type: "input",
        name: "quantity",
        message:"How much would you like to purchase?"
    }).then(function(ans){
        answer.quantity = ans.quantity
        
        quantityCheck(answer)
        

    })
})

function priceTotal(answer) {
    var query = "SELECT price FROM products WHERE ?";
    connection.query(query, { item_id: answer.product }, function(err, res){
        console.log("You owe: $"+(res[0].price * answer.quantity))
    });
  }

function quantityCheck(answer){
    var query = "SELECT stock FROM products WHERE ?";
    connection.query(query, { item_id: answer.product }, function(err, res){
        answer.stock = res[0].stock
        if(answer.stock < answer.quantity){
            console.log("Sorry, we only have "+answer.stock+" in stock.")
            connection.end()
            return
        }else {
            priceTotal(answer)
            updateProduct(answer)
            
            connection.end()
        }

    });
}

function updateProduct(answer) {
    var query = connection.query(
      "UPDATE products SET ? WHERE ?",
      [
        {
          stock: answer.stock - answer.quantity
        },
        {
          item_id: answer.product
        }
      ],
      function(err, res) {
            console.log("Enjoy Your Purchase!");
      }
    )}