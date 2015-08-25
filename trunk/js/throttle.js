/**
 * @author Adam
 */
jQuery.extend({
	throttle : function (fn, delay){//http://remysharp.com/2010/07/21/throttling-function-calls/
        var timer = null;
        return function(){
            var context = this, args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function(){
                fn.apply(context, args);
            }, delay);
        };
    }
});