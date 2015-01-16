angular.module("app", ["app.templates", "services", "directives", "ui.router", "uuid4"])
    .run(function($window, uuid4){
    	var localStorage = $window.localStorage,
    	JSON = $window.JSON;
    	if (localStorage.getItem('shopItems') === null || localStorage.getItem('shopItems') === "[]") {
    		localStorage.setItem('shopItems', JSON.stringify([
    			{
    				id: uuid4.generate(),
    				name: 'A',
    				description: 'lorem ipsum',
    				price: 1.50
    			},
    			{
    				id: uuid4.generate(),
    				name: 'B',
    				description: 'lorem ipsum',
    				price: 2.50
    			},
    			{
    				id: uuid4.generate(),
    				name: 'C',
    				description: 'lorem ipsum',
    				price: 3.30
    			},
    			{
    				id: uuid4.generate(),
    				name: 'D',
    				description: 'lorem ipsum',
    				price: 10
    			},
    			{
    				id: uuid4.generate(),
    				name: 'E',
    				description: 'lorem ipsum',
    				price: 59.99
    			},
    			{
    				id: uuid4.generate(),
    				name: 'F',
    				description: 'lorem ipsum',
    				price: 100
    			},
    			{
    				id: uuid4.generate(),
    				name: 'G',
    				description: 'lorem ipsum',
    				price: 79
    			},
    			{
    				id: uuid4.generate(),
    				name: 'H',
    				description: 'lorem ipsum',
    				price: 88.88
    			},
    			{
    				id: uuid4.generate(),
    				name: 'I',
    				description: 'lorem ipsum',
    				price: 0.01
    			},
    			{
    				id: uuid4.generate(),
    				name: 'J',
    				description: 'lorem ipsum',
    				price: 10
    			},
    			{
    				id: uuid4.generate(),
    				name: 'K',
    				description: 'lorem ipsum',
    				price: 11
    			},
    			{
    				id: uuid4.generate(),
    				name: 'L',
    				description: 'lorem ipsum',
    				price: 12
    			}
    		]));
		}
    });
