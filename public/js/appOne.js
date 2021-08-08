
//slide gallery
$(document).ready(function(){
    // Highlight bottom nav links
    var clickEvent = false;
    $("#myCarousel").on("click", ".nav a", function(){
     clickEvent = true;
     $(this).parent().siblings().removeClass("active");
     $(this).parent().addClass("active");  
    }).on("slid.bs.carousel", function(e){
     if(!clickEvent){
      itemIndex = $(e.relatedTarget).index();
      targetNavItem = $(".nav li[data-slide-to='" + itemIndex + "']");
      $(".nav li").not(targetNavItem).removeClass("active");
      targetNavItem.addClass("active");
     }
     clickEvent = false;
    });
   });

// Navbar //
$(document).ready(function () {
    $('.navbar-expand-lg .dmenu').hover(function () {
            $(this).find('.sm-menu').first().stop(true, true).slideDown(150);
        }, function () {
            $(this).find('.sm-menu').first().stop(true, true).slideUp(105)
        });
});
// Panel sidebar
$(document).ready(function () {
    $('.js-dropdown').on('click', function(event){
        event.preventDefault();
        event.stopPropagation();
        $child = $(this).children('i');
        $child.toggleClass('fas fa-angle-down').toggleClass('fas fa-angle-up');
        $('.sub-list').toggle('fast');
    })
});
$(document).ready(function () {
    $('.js-dropdown2').on('click', function(event){
        event.preventDefault();
        event.stopPropagation();
        $child = $(this).children('i');
        $child.toggleClass('fas fa-angle-down').toggleClass('fas fa-angle-up');
        $('.sub-list2').toggle('fast');
    })
});
$(document).ready(function () {
    $('.js-dropdown3').on('click', function(event){
        event.preventDefault();
        event.stopPropagation();
        $child = $(this).children('i');
        $child.toggleClass('fas fa-angle-down').toggleClass('fas fa-angle-up');
        $('.sub-list3').toggle('fast');
    })
});

// selector Slider
$("#slider-range").slider({
    range: true, 
    min: 0,
    value: 50,
    max: 39,
    step: 1 ,
    slide: function( event, ui ) {
      $( "#min-price").html(ui.values[ 0 ] + '00,000');
      
      console.log(ui.values[0])
      
      suffix = '000,000';
      if (ui.values[ 1 ] == $( "#max-price").data('max') ){
         suffix = ' +';
      }
      $( "#max-price").html(ui.values[ 1 ] + suffix);      
    }
  })
//img-file
function readURL(input) {
    if (input.files && input.files[0]) {
  
      var reader = new FileReader();
  
      reader.onload = function(e) {
        $('.image-upload-wrap').hide();
  
        $('.file-upload-image').attr('src', e.target.result);
        $('.file-upload-content').show();
  
        $('.image-title').html(input.files[0].name);
      };
  
      reader.readAsDataURL(input.files[0]);
  
    } else {
      removeUpload();
    }
  }
  
  function removeUpload() {
    $('.file-upload-input').replaceWith($('.file-upload-input').clone());
    $('.file-upload-content').hide();
    $('.image-upload-wrap').show();
  }
  $('.image-upload-wrap').bind('dragover', function () {
          $('.image-upload-wrap').addClass('image-dropping');
      });
      $('.image-upload-wrap').bind('dragleave', function () {
          $('.image-upload-wrap').removeClass('image-dropping');
  });

// Pagination
$('.pagination-inner a').on('click', function() {
    $(this).siblings().removeClass('pagination-active');
    $(this).addClass('pagination-active');
})
  
  


