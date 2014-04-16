/*global bookstrap: false */
define([
  'underscore'],
  function(_) {
    var THUMBNAIL_WIDTH = 120,
        THUMBNAIL_HEIGHT = 160,
        THUMBNAIL_MARGIN_WIDTH = 5;

    var DrawerThumbsPlugin = function(drawer) {
      this.nav = $('.book-drawer-content section nav');
      this.links = null;
      this.lastScrollLeft = 0;
      this.thumbnailWidth = THUMBNAIL_WIDTH;
      this.thumbnailHeight = THUMBNAIL_HEIGHT;
      this.queue = [];
      this.queueLimit = 10;
      this.queueLoading = 0;
      
      _.bindAll(this);
      bookstrap.on('navigationcached', this.onNavigationCached);
      bookstrap.on('pageload', this.onPageLoad);
      
      this.nav.on('scroll', this.onScroll);

      this.nav.on('dragstart', 'img', function(){
        return false;
      });
    };

    DrawerThumbsPlugin.prototype = {
      onNavigationCached: function(){
        this.links = this.nav.find('li');

        this.loadByScroll(this.lastScrollLeft);
        this.scrollToThumbnail(bookstrap.domPages.current.page);
      },
      onPageLoad: function(domPage) {
        this.scrollToThumbnail(domPage.page);
      },
      onScroll: function(e) {
        this.loadByScroll(e.target.scrollLeft);
      },
      loadByScroll: function(scrollPos) {
        var self = this,
            firstVisibleIndex = Math.ceil(scrollPos / (this.thumbnailWidth + THUMBNAIL_MARGIN_WIDTH) );

        var toCache = this.links.slice(Math.max(0, firstVisibleIndex - 10), Math.max(0, firstVisibleIndex + 20));
        toCache.each(function(i, el){
          var $link = $(el).find('a:not(.loaded)');
          if ($link.length){
            self.queue.push($link);
          }
        })
        this.updateQueue();
      },
      updateQueue: function() {
        // never load more than "limit" images at once
        var currentLimit = Math.min(this.queue.length, this.queueLimit - this.queueLoading);
        for (var i = 0 ; i < currentLimit ; i++) {
          var $link = this.queue.shift(),
              title = $link.text();

          if ($link.is('.loaded') || !title.length) {
            this.updateQueue();
            return;
          }

          var page = bookstrap.pages.findByURL($link.attr('href'));
          $link.data('title', title);
          var thumb = new Image();
          thumb.src = page.thumbnail;
          this.queueLoading++;
          $(thumb).on('load', _.bind(this.onThumbLoad, this, $link));

          if (page.spread) {
            var spreadSide = page.spreadIndex % 2 == 0 ? 'even' : 'odd';
            $link.parent().addClass('book-spread-page-' + spreadSide);
          }
        }
      },
      onThumbLoad: function($link, event) {
        var $img = $(event.target);
        $img.attr('alt', $link.text())
        $link.html($img);
        $link.parent('li').css({
          width: $img.width(),
          height: $img.height()
        })
        $link.addClass('loaded');

        this.queueLoading--;
        if (this.queue.length >0) {
          this.updateQueue();
        }
      },
      scrollToThumbnail: function(page) {
        var currentIndex = bookstrap.pages.pages.indexOf(page),
            scrollTo = (this.thumbnailWidth + THUMBNAIL_MARGIN_WIDTH) * (currentIndex + 1) - bookstrap.viewportContainer.width/2;

        this.nav.prop('scrollLeft', scrollTo);        
      },
      setDrawerWidth: function() {
        this.nav.find('ol').width( this.links.size() * (this.thumbnailWidth + THUMBNAIL_MARGIN_WIDTH));
      }
    };
    return DrawerThumbsPlugin;
});