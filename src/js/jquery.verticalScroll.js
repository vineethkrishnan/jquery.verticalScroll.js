/*!
 * jquery.verticalScroll.js -http://vineethkrishnan.in
 * Version - 1.1.0
 * Licensed under the MIT license - http://opensource.org/licenses/MIT
 *
 * Copyright (c) 2016 Vineeth Krishnan
 */
 (function($){

 	"use strict";

 	$.fn.verticalScroll = function(options){
 		var settings = $.extend({
 			selector: 'div',
 			paginate: true
 		}, options);
 		return this.each(function() {
 			var that = $(this);
 			var visible = false;
 			var positions = [];
 			var check = setInterval(function(e){
 				if(that.css('display') != 'none'){
 					visible = true;
 					clearInterval(check);
 					$.each(that.children(settings.selector), function(i,v){
 						// var target = that.children(settings.selector)[i];
 						positions.push(Math.abs($(v).position().top) + that.scrollTop());
 					});
 					console.log(positions);
 				}
 			},500);
 			$(this).css({
 				'overflow':'hidden'
 			});
 			if(settings.paginate){
 				var html = '<ul class="vs-paginate">';
 				var active = '';
 				$.each($(this).find(settings.selector), function(i ,v){
 					active = (i == 0)?'vs-active':'';
 					html +='<li><a href="#"  class="'+active+'">&nbsp;</a></li>';
 				});
 				html += "</ul>";
 				$(this).prepend(html);	
 			}

			// cache all position in advance and move to that position on click

			$('.vs-paginate li a').on('click', function(e){
				e.preventDefault();
				$(this).closest('ul').find('a').removeClass('vs-active');
				$(this).addClass('vs-active');
				var position = $(this).parent().index();
				that.stop().animate({ 
					scrollTop: positions[position]
				}, 2000);
			});
		});
}
}(jQuery))