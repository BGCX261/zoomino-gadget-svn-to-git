(function(){
	var interceptors = {};
	$.intercept = function(name, func){
		var parts = name.split('.');
		var owner = window;
		for (var i = 0; i < parts.length - 1; i++){
			owner = owner[parts[i]];
			if (!owner) break;
		}
		if (owner){
			var funcName = parts[parts.length - 1];
			var target = owner[funcName];
		}
		if (!(owner && target)){
			interceptors[name] = func;
			return;
		}
		owner[funcName] = function(){
			this.__invocation__ = target;
			func.apply(this, arguments)
		}
	}
	
	$._ = function(name, func, scope, args){
		var interceptor = interceptors[name];
		if (interceptor){
			scope = scope || window;
			scope.__invocation__ = func;
			return interceptor.apply(scope, args || []);
		}
		else {
			return func.apply(scope, args || []);
		}
	}
})()