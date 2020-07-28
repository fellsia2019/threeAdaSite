$(function (){

    $('input[name=phone]').mask('+7 (999) 999-99-99');

    $('.menu-icon, .mob-close').on('click',function(e){
        e.preventDefault();
        $('.mob-menu').toggleClass('active');
    });
  
  
	// $('input[name=phone]').mask('+7 (999) 999-99-99');


    $('.insapp-slide').owlCarousel({
        loop:true,
        margin:0,
        nav:true,
        dots:true,
        center: false,
        smartSpeed:900,
        items:1,
        navText: ['<i class="fal fa-chevron-left"></i>','<i class="fal fa-chevron-right"></i>'],
        responsive:{
            0:{
                items:1,
                margin:10,
            },
            600:{
                items:1,
                margin:0,
            },
            1000:{
                items:1,
                margin:0,
            }
        }
    });

    $('.slide-block').owlCarousel({
        loop:true,
        margin:0,
        nav:false,
        dots:true,
        center: true,
        smartSpeed:900,
        items:1,
        navText: ['<i class="fal fa-chevron-left"></i>','<i class="fal fa-chevron-right"></i>'],
        responsive:{
            0:{
                items:1,
            },
            600:{
                items:1,
                margin:0,
            },
            1000:{
                items:1,
                margin:0,
            }
        }
    });


});

