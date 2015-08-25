/*
 * author NTTDoCoMo
 * leju_vote v0.1
 */
(function($){
	$.fn.lejuVote = function(option){
		var defaultOption ={},
		options = $.extend(defaultOption,option);
		return this.each(function(){
			var $this = $(this),params={};
			for (var i=options.param.length -1;i>=0;i--){
				params[options.param[i]] = $this.attr("data-" + options.param[i]);
			}
			$this.bind("click",function(){
				$.getJSON(options.api + $.param(params)+"&callback=?",function(data){
					options.callback(data);
				})
			});
		});
	}
})(jQuery);