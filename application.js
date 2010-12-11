// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

var Order = function(number, name){
	this._db_table = "orders";
	Order.superclass.constructor.call(this);
	
	this.number = number;
	this.name = name;
	
	this.init();
};

Romper.romperfy(Order);


var OrderItem = function(number){
	this._db_table = "order_items";
	OrderItem.superclass.constructor.call(this);
	this.number = number;
};

Romper.romperfy(OrderItem);

var o = new Order('5678', 'Tara');
