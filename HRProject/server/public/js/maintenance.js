$(document).ready(function() {
    // When a card is clicked, redirect to the page specified in the 'data-link' attribute
    $('.card').on('click', function() {
      const link = $(this).data('link');
      window.location.href = link;
    });
  
    // Optional: Make sure the card links are properly clicked on 'Go to' button
    $('.btn-primary').on('click', function(e) {
      e.stopPropagation(); // Prevent the card click from being triggered
      const link = $(this).closest('.card').data('link');
      window.location.href = link;
    });
  });
  