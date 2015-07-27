if(Meteor.isClient) {
	$(window).load(function(){	
		$('#preloader').fadeOut(800, function() {
			$('body').css('overflow', 'visible');
			
			//trigger css3 animations
			$('.animated').each(function() {
				var elem = $(this);
				var animation = elem.data('animation');
				if (!elem.hasClass('visible') && elem.attr('data-animation') !== undefined) {
					if (elem.attr('data-animation-delay') !== undefined) {
						var timeout = elem.data('animation-delay');
						setTimeout(function() {
							elem.addClass(animation + " visible");
						}, timeout);
					} else {
						elem.addClass(elem.data('animation') + " visible");
					}
				}
			});
		}); 

		$("#menu-toggle").on("click", function(e) {
			e.preventDefault();      
			if($("#menu-toggle").hasClass("bt-menu-open")){
				$(this).removeClass("bt-menu-open").addClass("bt-menu-close");
				$("#sidebar-wrapper").removeClass("active");
			}else{
				$(this).removeClass("bt-menu-close").addClass("bt-menu-open");
				$("#sidebar-wrapper").addClass("active");
			}     
		});

		$(".show-modal").on("click", function(){
			showModal(this);
		});
		
		$("#modal .bt-modal-close").on("click", function() {
			$("#modal").removeClass("active");
			$("#modal").slideUp("slow", function() {
				$("#menu-toggle").show();
				$("#menu-toggle").removeClass("bt-menu-open").addClass("bt-menu-close");
			});
		});
	}); 
	
	showModal = function(e) {
		var modalView = $(e).attr("data-modal");
		console.log(modalView);
		$("article").hide();
		$("article#modal-"+modalView).show();
		if($("#modal").is(":visible")){
					
		}else{
			$("#sidebar-wrapper").removeClass("active");
			$("#modal").slideDown("slow");
			$("#modal").addClass("active");
			$("#menu-toggle").hide();
		}
	}
}