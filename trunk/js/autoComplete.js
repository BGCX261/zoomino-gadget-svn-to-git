/*
 * author NTTDoCoMo
 * autocomplete v0.1.1
 */

jQuery.fn.extend({
	suggest : function(option){
	    var defaultOption = {
	        requestDelay: 2000,
	        closeDelay: 4000
	    }, options = $.extend(defaultOption, option);
	    options.cache = {};
	    return this.each(function(){
	        var $this = $(this).attr('autocomplete', 'off'), prevValue = '', requestDelay = defaultOption.requestDelay, closeDelay = defaultOption.closeDelay, $form = $this.parent(), items, itemIndex = -1, itemLength, closeTimer, checkHide, isEmptyString = false, isEmptyResult = false, valueChangeEvent = $.browser.msie ? 'keyup' : 'input',//use input and propertychange event for opera bug
	$ul = $('<ul>').attr({
	            id: 'autoSuggest'
	        }).bind('click', function(e){//创建容器并绑定事件
	            e = e || window.event;
	            var target = e.target || e.srcElement, text = target.innerText || target.textContent;
	            if (target.nodeName.toLowerCase() !== 'li' || isEmptyResult) 
	                return;
	            $form.submit();
	            $(this).hide();
	            itemIndex = -1;
	        }).bind('mouseover', function(e){
	            clearTimeout(closeTimer);
	            e = e || window.event;
	            var target = e.target || e.srcElement, $target = $(target), text = target.innerText || target.textContent;
	            if (target.nodeName.toLowerCase() === 'li' && !$target.hasClass('hover') && !isEmptyResult) {
	                items.removeClass('hover');
	                $target.addClass('hover');
	                itemIndex = items.index($target);
	                _setValue(items.eq(itemIndex).text());
	            };
	                        }).bind('mouseout', function(){
	            closeTimer = setTimeout(function(){
	                $ul.hide();
	                itemIndex = -1;
	            }, closeDelay);
	        }).hide().appendTo($('body'));
	        $this.bind(valueChangeEvent, $.throttle(function(e){
	            var inputText = $.trim($this.val());
	            if (inputText === '') {
	                isEmptyString = true;
	                $ul.hide();
	                itemIndex = -1;
	                return;
	            };
	            if (!/27$|38$|40$/.test(e.keyCode)) {
	                isEmptyString = false;
	                _getData(inputText);
	            }
	        }, 250)).blur(function(){
	            setTimeout(_hideList, 100);
	        }).keydown(function(e){
	            e = e || window.event;
	            if (isEmptyResult) 
	                return;
	            switch (e.keyCode) {
	                case 40:
	                    _selectResult(true);
	                    break;
	                case 38:
	                    _selectResult(false);
	                    break;
	                case 13:
	                    $form.submit();
	                    break;
	            }
	        });
	        function _setValue(value){
	            if (value != prevValue && !isEmptyResult) {
	                $this.val(value);
	                prevValue = value;
	                return true;
	            };
	            return false;
	        };
	        function _getData(val){
	            if (options.cache[val] && !isEmptyString) {//判断是否存在于cache里
	                _showTips(options.cache[val], val);
	            }
	            else {
	                options.param.q = encodeURIComponent(val), queryUrl = decodeURIComponent(options.api + $.param(options.param, false));
	                $.ajaxSetup({
	                    scriptCharset: "utf-8",
	                    contentType: "text/javascript; charset=utf-8"
	                });//设定charset，避免乱码
	                $.getJSON(queryUrl, function(results){
	                    options.cache[val] = results;
	                    if (!isEmptyString) {
	                        _showTips(results, val);
	                    }
	                });
	            }
	        }
	        function _showTips(results, text){//处理结果
	            clearTimeout(closeTimer);
	            if (typeof(results) === 'string' || !results.length) {
	                isEmptyResult = true;
	                list = ['<li>\u6CA1\u6709\u7ED3\u679C</li>'];
	            }
	            else {
	                isEmptyResult = false;
	                var len = results.length, list = [];
	                itemLength = len;
	                for (var i = len - 1; i >= 0; i--) {
	                    var value = results[i].name, index = value.toLowerCase().indexOf(text), str = ['<li>', value, '</li>'];
	                    if (index > -1) {
	                        before = value.substr(0, index), highLightKw = value.substring(index, index + text.length), after = value.substr(index + text.length), hlText = ['<span style="font-weight:bold;">', highLightKw, '</span>'].join('');
	                        str = ['<li>', before, hlText, after, '</li>']
	                    }
	                    //console.log('text is:' + text + ';index is:' + index + 'before is' + before + ';after is:' + after);
	                    list = str.concat(list);
	                };
	                                };
	            var offset = $this.offset(), inputWidth = $this.outerWidth() - 2, offsetTop = offset.top + $this.outerHeight(), offsetLeft = offset.left;
	            $ul.css({
	                top: offsetTop + 'px',
	                left: offsetLeft + 'px',
	                width: inputWidth + 'px'
	            }).html(list.join('')).show();
	            items = $ul.find('li');
	            closeTimer = setTimeout(_hideList, closeDelay);
	            checkHide = setInterval(function(){
	                if ($this.is(":hidden ")) {
	                    _hideList();
	                }
	            }, 100);
	        };
	        function _selectResult(toNext){
	            clearTimeout(closeTimer);
	            items.eq(itemIndex).removeClass('hover');
	            if (toNext) {
	                itemIndex = itemIndex == itemLength - 1 ? 0 : itemIndex + 1;
	            }
	            else {
	                itemIndex = itemIndex == 0 ? itemLength - 1 : itemIndex - 1;
	            }
	            items.eq(itemIndex).addClass('hover');
	            _setValue(items.eq(itemIndex).text());
	        }
	        function _hideList(){
	            $ul.hide();
	            itemIndex = -1;
	            clearInterval(checkHide);
	        }
	    });
	}
});
