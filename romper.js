/**
 * JavaScript library that acts as an ORM wrapper to the HTML5 client-side Web Storage interface.
 * 
 * @author Jim McGaw
 */
var Romper = {};  //set up namespace for this module

// database configuration values
// replace these value with your own
Romper.Settings = {
	shortName: 'RomperTest',
	version: '1.0',
	displayName: 'RomperTest',
	maxSize: 65536
};

// add 'supplant' method to the built-in string object.
// code and example available at: http://javascript.crockford.com/remedial.html
if (!String.prototype.supplant) {
    String.prototype.supplant = function (o) {
        return this.replace(/{([^{}]*)}/g,
            function (a, b) {
                var r = o[b];
                return typeof r === 'string' || typeof r === 'number' ? r : a;
            }
        );
    };
}

Romper.openDatabase = function(){
	var db = openDatabase(Romper.Settings.shortName, 
						Romper.Settings.version, 
						Romper.Settings.displayName, 
						Romper.Settings.maxSize);
	return db;
}

Romper.transactionError = function(e){
	alert("error! " + e.toString());
};

Romper.transactionSuccess = function(){
	alert("success!");
};

Romper.executeSql = function(sql){
	var db = Romper.openDatabase();
	db.transaction(
		function(transaction){
			
		},
		Romper.transactionError,
		Romper.transactionSuccess
	);
};

// base class for 
Romper.Model = function() { };

Romper.Model.prototype = {
	init: function(){
		this.createTable();
	},
	
	createTable: function(){
		var properties = this.getProperties();
		var sql = '';
		sql += 'CREATE TABLE IF NOT EXISTS ' + this._db_table + ' (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,';
		for (var i = 0, len = properties.length; i < len; i = i + 1){
			sql += properties[i] + ' TEXT NOT NULL';
			if ((i+2) == len){
				sql += ','
			}
		}
		sql += ');';
		alert(sql);
		
		var db = Romper.openDatabase();
		db.transaction(
			function(t){
				t.executeSql(sql);
			}
		);
	},
	
	save: function(){
		
		var properties = this.getProperties();
		
		var sql = '';
		sql += 'INSERT INTO ' + this._db_table + '(' + properties.toString() + ') ';
		sql += 'VALUES (';
		for (var i = 0, len = properties.length; i < len; i = i + 1){
			sql += '"{' + properties[i] + '}"';
			if ((i+2) == len){
				sql += ','
			}
		}
		sql += ');'
		sql = sql.supplant(this);
		alert(sql);
		
		var db = Romper.openDatabase();
		db.transaction(
			function(t){
				t.executeSql(sql);
			}
		);
	},
	
	update: function(){
		for(var i = 0, len = arguments.length; i < len; i++){
			alert(arguments[i]);
		}
	},
	
	remove: function(){
		// remove object from localStorage
	},
	getDbTable: function(){
		return this._db_table;
	},
	getProperties: function(){
		var properties = [];
		for (var prop in this){
			if (this.hasOwnProperty(prop) && !prop.match('^_')){
				properties.push(prop); // shouldn't return private methods starting with '_'
			}
		}
		return properties;
	}
}

/* Extend function */
function extend(subClass, superClass) {
	var F = function(){};
	F.prototype = superClass.prototype;
	subClass.prototype = new F();
	subClass.prototype.constructor = subClass;
	
	subClass.superclass = superClass.prototype;
	if(superClass.prototype.constructor == Object.prototype.constructor){
		superClass.prototype.constructor = superClass;
	}
};

// method that forces a class to inherit from Romper.Model
Romper.romperfy = function(subClass){
	extend(subClass, Romper.Model);
};
