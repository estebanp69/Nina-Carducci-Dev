
(function($) {
    $.fn.mauGallery = function(options) {
        var options = $.extend({}, $.fn.mauGallery.defaults, options);
        var tagsCollection = [];

        return this.each(function() {
            $.fn.mauGallery.methods.createRowWrapper($(this));

            if (options.lightBox) {
                $.fn.mauGallery.methods.createLightBox(
                    $(this),
                    options.lightboxId,
                    options.navigation
                );
            }

            $.fn.mauGallery.listeners(options);

            $(this)
                .children(".gallery-item")
                .each(function() {
                    $.fn.mauGallery.methods.responsiveImageItem($(this));
                    $.fn.mauGallery.methods.moveItemInRowWrapper($(this));
                    $.fn.mauGallery.methods.wrapItemInColumn(
                        $(this),
                        options.columns
                    );

                    var theTag = $(this).data("gallery-tag");

                    if (
                        options.showTags &&
                        theTag !== undefined &&
                        tagsCollection.indexOf(theTag) === -1
                    ) {
                        tagsCollection.push(theTag);
                    }
                });

            if (options.showTags) {
                $.fn.mauGallery.methods.showItemTags(
                    $(this),
                    options.tagsPosition,
                    tagsCollection
                );
            }

            $(this).fadeIn(500);
        });
    };

    $.fn.mauGallery.defaults = {
        columns: 3,
        lightBox: true,
        lightboxId: null,
        showTags: true,
        tagsPosition: "bottom",
        navigation: true
    };

    $.fn.mauGallery.listeners = function(options) {

        $(".gallery-item").on("click", function() {
            if (options.lightBox && $(this).prop("tagName") === "IMG") {
                $.fn.mauGallery.methods.openLightBox(
                    $(this),
                    options.lightboxId
                );
            }
        });

        $(".gallery").on(
            "click",
            ".nav-link",
            $.fn.mauGallery.methods.filterByTag
        );

        $(".gallery").on("click", ".mg-prev", function(e) {
            e.preventDefault();
            e.stopPropagation();

            $.fn.mauGallery.methods.prevImage(options.lightboxId);
        });

        $(".gallery").on("click", ".mg-next", function(e) {
            e.preventDefault();
            e.stopPropagation();

            $.fn.mauGallery.methods.nextImage(options.lightboxId);
        });
    };

    $.fn.mauGallery.methods = {

        createRowWrapper(element) {
            if (
                !element.children().first().hasClass("row")
            ) {
                element.append(
                    '<div class="gallery-items-row row"></div>'
                );
            }
        },

        wrapItemInColumn(element, columns) {
            if (columns.constructor === Number) {
                element.wrap(
                    `<div class='item-column mb-4 col-${Math.ceil(12 / columns)}'></div>`
                );
            } else if (columns.constructor === Object) {
                var columnClasses = "";

                if (columns.xs) {
                    columnClasses += ` col-${Math.ceil(12 / columns.xs)}`;
                }

                if (columns.sm) {
                    columnClasses += ` col-sm-${Math.ceil(12 / columns.sm)}`;
                }

                if (columns.md) {
                    columnClasses += ` col-md-${Math.ceil(12 / columns.md)}`;
                }

                if (columns.lg) {
                    columnClasses += ` col-lg-${Math.ceil(12 / columns.lg)}`;
                }

                if (columns.xl) {
                    columnClasses += ` col-xl-${Math.ceil(12 / columns.xl)}`;
                }

                element.wrap(
                    `<div class='item-column mb-4${columnClasses}'></div>`
                );
            } else {
                console.error(
                    "Columns should be defined as numbers or objects."
                );
            }
        },

        moveItemInRowWrapper(element) {
            element.appendTo(".gallery-items-row");
        },

        responsiveImageItem(element) {
            if (element.prop("tagName") === "IMG") {
                element.addClass("img-fluid");
            }
        },

        openLightBox(element, lightboxId) {
            const fullImage =
                element.attr("data-full-src") || element.attr("src");

            const id = lightboxId || "galleryLightbox";

            $("#" + id)
                .find(".lightboxImage")
                .attr("src", fullImage);

            $("#" + id).modal("show");
        },

        // IMAGE PRECEDENTE
        prevImage(lightboxId) {
            const id = lightboxId || "galleryLightbox";
            const lightbox = $("#" + id).find(".lightboxImage");
            const currentSrc = lightbox.attr("src");

            const activeTag = $("#" + id)
                .closest(".gallery")
                .find(".tags-bar .active-tag")
                .data("images-toggle");

            const imagesCollection = $("#" + id)
                .closest(".gallery")
                .find(".gallery-item")
                .filter(function() {
                    const tag = $(this).data("gallery-tag");

                    return activeTag === "all" || tag === activeTag;
                });

            if (!imagesCollection.length) return;

            let currentIndex = imagesCollection.index(
                imagesCollection.filter(function() {
                    const fullSrc =
                        $(this).attr("data-full-src") ||
                        $(this).attr("src");

                    return fullSrc === currentSrc;
                })
            );

            if (currentIndex === -1) {
                currentIndex = 0;
            }

            const previousIndex =
                (currentIndex - 1 + imagesCollection.length) %
                imagesCollection.length;

            const previousImage = imagesCollection.eq(previousIndex);

            const previousSrc =
                previousImage.attr("data-full-src") ||
                previousImage.attr("src");

            lightbox.attr("src", previousSrc);
        },

        // IMAGE SUIVANTE
        nextImage(lightboxId) {
            const id = lightboxId || "galleryLightbox";
            const lightbox = $("#" + id).find(".lightboxImage");
            const currentSrc = lightbox.attr("src");

            const activeTag = $("#" + id)
                .closest(".gallery")
                .find(".tags-bar .active-tag")
                .data("images-toggle");

            const imagesCollection = $("#" + id)
                .closest(".gallery")
                .find(".gallery-item")
                .filter(function() {
                    const tag = $(this).data("gallery-tag");

                    return activeTag === "all" || tag === activeTag;
                });

            if (!imagesCollection.length) return;

            let currentIndex = imagesCollection.index(
                imagesCollection.filter(function() {
                    const fullSrc =
                        $(this).attr("data-full-src") ||
                        $(this).attr("src");

                    return fullSrc === currentSrc;
                })
            );

            if (currentIndex === -1) {
                currentIndex = 0;
            }

            const nextIndex =
                (currentIndex + 1) % imagesCollection.length;

            const nextImage = imagesCollection.eq(nextIndex);

            const nextSrc =
                nextImage.attr("data-full-src") ||
                nextImage.attr("src");

            lightbox.attr("src", nextSrc);
        },

        // CREATION DE LA LIGHTBOX
        createLightBox(gallery, lightboxId, navigation) {
            const id = lightboxId || "galleryLightbox";

            gallery.append(`
                <div class="modal fade"
                     id="${id}"
                     tabindex="-1"
                     role="dialog"
                     aria-hidden="true">

                    <div class="modal-dialog modal-dialog-centered"
                         role="document">

                        <div class="modal-content">

                            <div class="modal-body position-relative">

                                ${
                                    navigation
                                    ? '<button type="button" class="mg-prev" aria-label="Image précédente">&lsaquo;</button>'
                                    : ""
                                }

                                <img
                                    class="lightboxImage img-fluid"
                                    alt="Image agrandie de la galerie"
                                >

                                ${
                                    navigation
                                    ? '<button type="button" class="mg-next" aria-label="Image suivante">&rsaquo;</button>'
                                    : ""
                                }

                            </div>
                        </div>
                    </div>
                </div>
            `);
        },

        // CREATION DES FILTRES
        showItemTags(gallery, position, tags) {
            var tagItems =
                '<li class="nav-item">' +
                '<span class="nav-link active active-tag" data-images-toggle="all">Tous</span>' +
                '</li>';

            $.each(tags, function(index, value) {
                tagItems += `
                    <li class="nav-item">
                        <span class="nav-link"
                              data-images-toggle="${value}">
                            ${value}
                        </span>
                    </li>
                `;
            });

            var tagsRow = `
                <ul class="my-4 tags-bar nav nav-pills">
                    ${tagItems}
                </ul>
            `;

            if (position === "bottom") {
                gallery.append(tagsRow);
            } else if (position === "top") {
                gallery.prepend(tagsRow);
            } else {
                console.error("Unknown tags position: " + position);
            }
        },

        // FILTRAGE DES IMAGES
        filterByTag() {
            if ($(this).hasClass("active-tag")) {
                return;
            }

            $(".tags-bar .active-tag")
                .removeClass("active active-tag");

            $(this).addClass("active active-tag");

            var tag = $(this).data("images-toggle");

            $(".gallery-item").each(function() {
                const column = $(this).closest(".item-column");

                if (
                    tag === "all" ||
                    $(this).data("gallery-tag") === tag
                ) {
                    column.show(300);
                } else {
                    column.hide(300);
                }
            });
        }
    };

})(jQuery);
