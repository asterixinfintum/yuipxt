"use strict";

orderSchema.methods.buy = function (quantity, executionPrice) {
  this.side = 'Buy';
  this.quantity = quantity;
  this.executionPrice = executionPrice;
  this.filled = quantity; // Assuming the order gets fully filled at the given executionPrice
  this.status = 'Executed'; // Setting status to 'Executed' for this example

  return {
    status: this.status,
    executionPrice: this.executionPrice,
    filled: this.filled
  };
};

// Instance method to sell an asset
orderSchema.methods.sell = function (quantity, executionPrice) {
  this.side = 'Sell';
  this.quantity = quantity;
  this.executionPrice = executionPrice;
  this.filled = quantity; // Assuming the order gets fully filled at the given executionPrice
  this.status = 'Executed'; // Setting status to 'Executed' for this example

  return {
    status: this.status,
    executionPrice: this.executionPrice,
    filled: this.filled
  };
};
var Order = mongoose.model('Order', orderSchema);

// Usage:

var order = new Order();

// Buy 100 units at $10 each
var buyResult = order.buy(100, 10);
console.log(buyResult);

// Sell 50 units at $12 each
var sellResult = order.sell(50, 12);
console.log(sellResult);