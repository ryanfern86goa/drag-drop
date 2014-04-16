/*global bookstrap: false */
define([
  'underscore',
  'Bookstrap.Page',
  'Bookstrap.PageCollection',
  'Bookstrap.DOMPage'
  ],
  function(_, BookstrapPage, BookstrapPageCollection, BookstrapDOMPage) {
    var NAV_ITEM_CLASS = 'book-spread',
        PAGE_ORIENTATION_PORTRAIT_CLASS = 'book-orientation-portrait',
        PAGE_ORIENTATION_LANDSCAPE_CLASS = 'book-orientation-landscape';

    var ReplicasPlugin = function(el, domPage) {
      _.bindAll(this);

      bookstrap.on('navloaded', this.onNavLoaded);
      bookstrap.on('resize', this.onPageResize);
      bookstrap.on('beforepageload', this.onBeforePageLoad);
      bookstrap.on('pagecache', this.onPageCache);
    };

    ReplicasPlugin.prototype = {
      setOrientation: function() {
        bookstrap.orientation = bookstrap.viewportContainer.width > bookstrap.viewportContainer.height ? 'landscape' : 'portrait';
        if (bookstrap.orientation == 'landscape') {
          bookstrap.viewport.$el.removeClass(PAGE_ORIENTATION_PORTRAIT_CLASS).addClass(PAGE_ORIENTATION_LANDSCAPE_CLASS);
        } else {
          bookstrap.viewport.$el.removeClass(PAGE_ORIENTATION_LANDSCAPE_CLASS).addClass(PAGE_ORIENTATION_PORTRAIT_CLASS);
        }
      },
      onNavLoaded: function() {
        var spreadIndex = 1;

        bookstrap.spreadPages = {
          portrait: new BookstrapPageCollection(bookstrap.viewport.$el),
          landscape: new BookstrapPageCollection(bookstrap.viewport.$el)
        };

        $.each(bookstrap.pages.pages, function(i, page){
          if (page.spread) {
            page.spreadIndex = spreadIndex++;
          }
          bookstrap.spreadPages['portrait'].push(page);

          if (!(page.spread && page.spreadIndex % 2 == 0)) {
            bookstrap.spreadPages['landscape'].push(page);
          }
        });

        bookstrap.pages = bookstrap.spreadPages['portrait'];

        bookstrap.pages.getNext = function(index) {
          var p = this.get(index),
              nextIndex = index + 1;

          var nextPage = this.get(nextIndex);
          if (bookstrap.orientation == 'landscape' && p.spreadIndex && p.spreadIndex %2 == 1 && nextPage.spreadIndex)
            nextPage = this.get(nextIndex + 1)

          return nextPage;
        };
        bookstrap.pages.getPrevious = function(index) {
          var p = this.get(index),
              previousIndex = index - 1;

          var previousPage = this.get(previousIndex);
          if (bookstrap.orientation == 'landscape' && p.spreadIndex && p.spreadIndex %2 == 1 && previousPage.spreadIndex)
            previousPage = this.get(previousIndex - 1)

          return previousPage;
        };

        this.setOrientation();
        bookstrap.domPages.pages = bookstrap.spreadPages[bookstrap.orientation];
      },
      onPageResize: function() {
        this.setOrientation();
        bookstrap.domPages.pages = bookstrap.spreadPages[bookstrap.orientation];
        if (bookstrap.domPages.current.page.spreadIndex) {
          if (bookstrap.orientation == 'landscape' && !(bookstrap.domPages.current.page.spreadIndex % 2)){
            bookstrap.movePrevious();
          }
          bookstrap.domPages.updateCache();
        }
      },
      onBeforePageLoad: function(domPage) {
        if (bookstrap.orientation == 'landscape' && domPage.page.spreadIndex && !(domPage.page.spreadIndex % 2)){
          bookstrap.movePrevious();
        }
      },
      onPageCache: function(domPage) {
        var spreadIndex = domPage.page.spreadIndex,
            imgSrc = domPage.page.spreadimage,
            imgElements = domPage.$el.find('article img');
        if (spreadIndex) {
          imgElements[0].src = imgSrc;
          if (imgElements[1] && spreadIndex % 2 != 0) {
            var nextPage = this.findNextSpreadPage(spreadIndex);
            if (nextPage)
              imgElements[1].src = nextPage.spreadimage;
            else
              imgElements[1].remove();
          }
        }
      },
      findNextSpreadPage: function(spreadIndex) {
        return _.find(bookstrap.pages.pages, function(page){
          return page.spreadIndex && page.spreadIndex === spreadIndex + 1;
        });
      }
    };
    return ReplicasPlugin;
});