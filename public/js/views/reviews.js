// var View = require('./base');
// var template = require('../../templates/product.hbs');


// module.exports = View.extend({

// 	events: {
// 		'click #.list-group-item':'updatePositive'
// 		'submit #add-positive':'updatePositive'
// 	},

// 	template:template,

// 	initialize: function(options){
// 		console.log(data);
// 	},

// 	updatePositive: function(e) {
//     var self = this;
//     e.preventDefault();
//     text = this.$el.find('#positive-input').val();
//     console.log(text);
//     var textArr = [text];
//     if(text === !text[0]){
// 	    $.ajax({
// 	        type: 'POST',
// 	        url: '/reviews',
// 	        data: {
// 	            text:text,
// 	            count: 1,
// 	            type: "positive",
// 	            product: this.model.get('id')
// 	        },
// 	        success: function(data){
// 	            console.log('working....');
// 	        },
// 	        error: function(data){
// 	            console.log(data);
// 	        }
// 	    })
// 	}else{
// 		$.ajax({
// 	        type: 'POST',
// 	        url: '/reviews',
// 	        data: {
// 	            text:text,
// 	            count: ++1,
// 	            type: "positive",
// 	            product: this.model.get('id')
// 	        },
// 	        success: function(data){
// 	            console.log('working....');
// 	        },
// 	        error: function(data){
// 	            console.log(data);
// 	        }
// 	    })
// 	}

})
