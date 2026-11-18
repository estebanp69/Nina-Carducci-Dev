document.addEventListener('DOMContentLoaded', function() {
    $('.gallery').mauGallery({
        columns: {
            xs: 2,  // Smartphone : 2 photos par ligne
            sm: 3,  // Grand smartphone : 3 photos par ligne
            md: 4,  // Tablette : 4 photos par ligne
            lg: 3,  // Ordinateur : 3 photos par ligne
            xl: 3   // Grand écran : 3 photos par ligne
        },
        lightBox: true,
        lightboxId: 'myAwesomeLightbox',
        showTags: true,
        tagsPosition: 'top'
    });
});