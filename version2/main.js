var Mod_util = (function(){

	var hasClass= function(el, cls){
		return el.className && new RegExp("(^|\\s)" + cls + "(\\s|$)").test(el.className);
	};
	var addClass= function(el, cls){
		if(!hasClass(el, cls)){
			el.className += " "+cls+" ";
		}
	};
	var removeClass= function(el, cls){
		var reg;
		if(hasClass(el, cls)){
			reg = new RegExp("(^|\\s)" + cls + "(\\s|$)", 'gi');
			el.className = el.className.replace(reg, '');
		}
	};
	var toggleClass = function(el, cls){
		if(hasClass(el, cls)){
			removeClass(el, cls);
		}else{
			addClass(el, cls);
		}
	};

	var publicApi = {
		hasClass: hasClass,
		addClass: addClass,
		removeClass: removeClass,
		toggleClass: toggleClass,
	};

	return publicApi;


}());



var Mod_popup = (function(){
 
    var doc = document;
 
    function mainElm(action){
        var main = doc.querySelector('body');
        if(action === "add"){
            Mod_util.addClass(main, "stopOverflow");
        }else if(action === "remove"){
            Mod_util.removeClass(main, "stopOverflow");
        }
 
        return false;
    }
 
    function popupElm(){
 
        var frag = doc.createDocumentFragment();
        var div = doc.createElement("div");
        var span = doc.createElement("span");
        var body = doc.body;
 
        mainElm("add");
        div.className = 'popup';
 
        function removeElem(){
            doc.body.removeChild(div);
            mainElm("remove");
            span.removeEventListener("click", removeElem, false);
        }
 
        span.addEventListener("click", removeElem, false);
 
        div.appendChild(span);
        frag.appendChild(div);
 
        body.appendChild(frag);
 
        return div;
    }
 
    function closePopup(el){
        doc.body.className = "";
        doc.body.removeChild(el);
    }
 
 
    var publicApi = {
        init: popupElm
    };
 
    return publicApi;
 
}());



document.addEventListener("DOMContentLoaded", function(){


	var doc = document;
	var html = doc.querySelector('html');
	var bd = doc.body;
	var header = doc.querySelector('.main_header');
	var hd = doc.querySelector('.simple_header');
	var side_nav = doc.querySelector('.sidebar_container');
	var screenshots = doc.querySelector('.screenshots');
	var demoToggleNav = doc.querySelector('.navToggleBtn');
	var scrollEl;

	header = header || hd;

	header.addEventListener('click', function(e){
		var target = e.target;
		if(target.tagName.toLowerCase() === 'nav'){
			if(side_nav && Mod_util.hasClass(side_nav, 'open')){
				side_nav.click();
			}
			Mod_util.toggleClass(target, 'open');
		}
	}, false);

	if(side_nav){
		side_nav.addEventListener('click', function(e){
			var target = e.target;
			
			if(target.tagName.toLowerCase() === 'nav'){
				Mod_util.toggleClass(target, 'open');
			}
		}, false);
	}

	if(hd){

		window.addEventListener('scroll', function(e){

			scrollEl = bd.scrollTop === 0 ? html : bd;

			if(scrollEl.scrollTop > hd.offsetHeight){
				Mod_util.addClass(side_nav, 'sticky');
                                side_nav.style.top = 0;
			}else if(scrollEl.scrollTop < (hd.offsetHeight)){
				Mod_util.removeClass(side_nav, 'sticky');
				side_nav.style = '';
                                side_nav.style.top = (hd.offsetHeight - scrollEl.scrollTop) + 'px';
			}

		}, false);
	}

	if(demoToggleNav){
		demoToggleNav.addEventListener('click', function(e){
			e.preventDefault();
			Mod_util.toggleClass(side_nav, 'show');
			if(Mod_util.hasClass(side_nav, 'show')){
				Mod_util.removeClass(side_nav, 'hide');
			}else{
				Mod_util.addClass(side_nav, 'hide');
			}
		}, false);
	}
});// JavaScript Document