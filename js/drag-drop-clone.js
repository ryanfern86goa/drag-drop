//Author Ryan
(function($, undefined) {

  window.dragDropClone = function() {

    var domPage, currentPageId, pageHref, draggableEl, droppableEl, saveButton, constraintBoundary, debugMode, cloneObject, i = 0,
        deleteOnObject, clear, keyboardContainer, keyboardShowButton;
    var saveObj           = {};
    saveObj.top           = [];
    saveObj.left          = [];
    saveObj.width         = [];
    saveObj.height        = [];
    saveObj.class         = [];
    saveObj.postionType   = [];
    saveObj.contents      = [];
    var setWidth          = "50px";
    var setHeight         = "50px";


    function init(obj) {
      draggableEl         = obj.draggable;
      droppableEl         = obj.droppable;
      constraintBoundary  = obj.constraintBoundary;
      cloneObject         = obj.addClassToCloneObject || 'cloneDraggable';
      deleteOnObject      = obj.deleteOnObject || 'body';
      debugMode           = obj.debugMode || false;
      clear               = obj.clear;
      saveButton          = obj.save;
      keyboardShowButton  = obj.keyboardShowButton;
      keyboardContainer   = obj.keyboardContainer;
      pageHref            = obj.pageRef;
      currentPageId       = obj.currentPage;
      domPage             = obj.domPage;

 $(keyboardContainer).on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', 
  function() {
            if(!$(keyboardContainer).hasClass("wrapper_keyboard_hide")){
               $(keyboardContainer).addClass("hide"); 
              //$(keyboardContainer).css("height","0px");
              }
           
   });

      if (debugMode) {
        console.log("initialise");
        console.log("droppable=" + droppableEl);
        console.log("droggable=" + draggableEl);
        console.log("constr=" + constraintBoundary);
        console.log("cloneObhaddclass=" + cloneObject);
        console.log("deleteOnObject=" + deleteOnObject);
        console.log("href from inside 1= " + pageHref);
      }

    }

    var $body = $('body');



    var onClearClick = function() {
      clearAll();
      if (debugMode) {
        console.log("tapped clear");
        console.log("href from inside clearAll= " + pageHref);
      }
    };

       var onkeyboardShowButtonClick = function() {
      if (debugMode) {
              console.log("tapped keyboard");
            }
            showKeyboard();
    };

    var unbindEvents = function() {
      if (debugMode) {
           console.log("In unbinding events.......");
      }
      $body.off('touchstart', clear, onClearClick);
      $body.off('touchstart', keyboardShowButton, onkeyboardShowButtonClick);
      $body.off("touchstart", "#hideKeyboard",hideKeyboard);
    }


      function doMagic() {
   
        $(draggableEl).draggable({
          cursor: 'move',
          helper: 'clone',
          revert: 'invalid',
          start: dragStartHandler

        });

        $(droppableEl).droppable({
          greedy: true,
          accept: draggableEl,
          drop: handleDropEvent

        });


        $(deleteOnObject + ', ' + constraintBoundary).droppable({
          greedy: true,
          accept: "." + cloneObject,
          drop: removeElement

        });







        $body.on('touchstart', clear, onClearClick);

        if ($(keyboardShowButton).length > 0) {
          $body.on("touchstart", keyboardShowButton, onkeyboardShowButtonClick);

        }


      }

      function getLeftInPercentage(childLeft, ParentWidth) {
        var leftInPer = parseInt(childLeft) / parseFloat(ParentWidth);
        return Math.round(100 * leftInPer) + '%';
      }

      function getTopInPercentage(childTop, ParentHeight) {
        var topInPer = parseInt(childTop) / parseFloat(ParentHeight);
        return Math.round(100 * topInPer) + '%';
      }

      function handleDropEvent(event, ui) {

        var offsetXPos = parseInt(ui.offset.left - $(this).offset().left);
        var offsetYPos = parseInt(ui.offset.top - $(this).offset().top);

        if (debugMode) {

          console.log("left  of droppable box =" + (parseInt($(this).offset().left)));
          console.log("top of droppable box =" + parseInt($(this).offset().top));

          console.log("left  of draged box =" + (parseInt(ui.offset.left)));
          console.log("top of dragged box =" + parseInt(ui.offset.top));

          console.log("left relative of draged box =" + (parseInt(offsetXPos)));
          console.log("top of relative box =" + parseInt(offsetYPos));
        }

        var splitClass = draggableEl.split('');
        var removeClass = '';
        for (var x = 0; x < splitClass.length; x++) {
          if (x > 0) {
            removeClass += splitClass[x];
          }
        }

        if (debugMode) {
          console.log("split class=" + removeClass);
          console.log("called handle= ");
        }

        i++;
        var newClass = "cloneClass-" + i;


        var leftInPer = getLeftInPercentage(offsetXPos, parseFloat($(this).css('width')));
        var topInPer = getTopInPercentage(offsetYPos, parseFloat($(this).css('height')));

        if (debugMode) {
          console.log("left in per = " + leftInPer);
          console.log("top in per = " + topInPer);
          console.log("width of droppable = " + parseFloat($(this).css('width')));
        }

         var oldImgSrc = $(ui.helper).find('img').attr('src');
         console.log('old img = '+oldImgSrc);
         var oldImgSrcSplit = oldImgSrc.split("/");
         var newImgSrc = oldImgSrcSplit[0]+"/dropped-icons/"+oldImgSrcSplit[2];
         var newImg    = $("<img src='"+newImgSrc+"'/>");

         topInPer = parseInt(topInPer)+4.5;
         topInPer = topInPer+"%";
         leftInPer= parseInt(leftInPer)+2; 
         leftInPer= leftInPer+"%";

        $(this).append($(ui.helper)
          .clone()
          .empty()
          .append(newImg)
          .removeClass(removeClass)
          .css({
            left: leftInPer,
            top: topInPer,
            width: setWidth,
            height: setHeight
          })
          .addClass(cloneObject)
          .addClass(newClass)
          .draggable({
            containment: deleteOnObject,
            cursor: 'move',
            start: function(event){
                    bookstrap.disablePageSwipe = true;
                  },
            stop: function(event, ui) {
                    bookstrap.disablePageSwipe = false;
                  }

          }));

      }

      function dragStartHandler(event, ui){
     
        $(ui.helper).css({
            width: $(draggableEl).css('width'),
            height: $(draggableEl).css('height')
          })
      }

      function removeElement(event, ui) {

        if (debugMode) {
          console.log("called removeEl= ");
        }

        var CheckForRemoval = "#" + $(this).attr("id");
        if (CheckForRemoval == deleteOnObject) {
          $(ui.helper).remove();

        }

        var offsetXPos = parseInt(ui.offset.left - $(this).offset().left);
        var offsetYPos = parseInt(ui.offset.top - $(this).offset().top);
        var leftInPer = getLeftInPercentage(offsetXPos, parseFloat($(this).css('width')));
        var topInPer = getTopInPercentage(offsetYPos, parseFloat($(this).css('height')));
        $(ui.helper).css({
          left: leftInPer,
          top: topInPer
        });
      }

      function clearLocalStorage() {
        
        if(debugMode){
                console.log("in clearLocalStorage");
                console.log("href from inside clearLocalStorage 4 = " + pageHref);
              }


        if (localStorage[domPage.pageLoaded.href]) {
          console.log("in deleting localStorage = " + localStorage[domPage.pageLoaded.href]);
          localStorage.removeItem(domPage.pageLoaded.href);
          return;
        } else {
          console.log("in deleting localStorage = " + localStorage[domPage.pageLoaded.href]);
          console.log("in deleting localStorage no success = ");
        }



      }

      function clearAll() {

        console.log("in clearAll");

        if ($("." + cloneObject).length) {

          if (debugMode) {
            console.log("there are clones to clear");
          }

          $("." + cloneObject).each(function() {
            $(this).remove();
          })

          clearLocalStorage();

        } else {

          if (debugMode) {
            console.log("there are no clones to clear");
            return;
          }

        }
      }

      function clearNotes() {

        $("." + cloneObject).each(function() {
          $(this).remove();
        })

      }


      function hideKeyboard() {

        var splitId = keyboardShowButton.split('');
          var removeHash = '';
          for (var x = 0; x < splitId.length; x++) {
            if (x > 0) {
              removeHash += splitId[x];
            }
          }
       $("#hideKeyboard").removeAttr("id").attr("id", removeHash);
        $(keyboardContainer).removeAttr("class");
      }


      
      function showKeyboard() {
        
        if (debugMode) {
        console.log("tapped display = " + $(keyboardContainer).css("display"));
      }

     $(keyboardShowButton).removeAttr("id").attr("id", "hideKeyboard");
      $("body").on("touchstart", "#hideKeyboard",hideKeyboard);
      $(keyboardContainer).addClass("wrapper_keyboard_hide");
      $(keyboardContainer).removeClass( "hide" );
      }

      function restoreState() {

        if (typeof(Storage) !== "undefined") {

          if (localStorage[pageHref]) {
           
           if (debugMode) {
            console.log("in restoring el");
          }

            var getData = JSON.parse(localStorage[pageHref]);
            for (var i = 0; i < getData.top.length; i++) {
              var newEl = $("<div/>").addClass(getData.class[i])
                .css({
                  top: getData.top[i],
                  left: getData.left[i],
                  width: getData.width[i],
                  height: getData.height[i],
                  position: getData.postionType[i]
                })
               .append($(getData.contents[i]))
                .draggable({
                  containment: "#main_keyboard",
                  cursor: 'move',
                  start: function(event){
                    bookstrap.disablePageSwipe = true;
                  },
                  stop: function(event, ui) {
                    bookstrap.disablePageSwipe = false;
                  }
                });

              $(droppableEl).append(newEl);
            }

            $("#main_keyboard,#wrapper_body").droppable({
              greedy: true,
              accept: ".cloneDraggable",
              drop: function() {

                if (debugMode) {
                console.log("droppped from restore el = " + $(this).attr("id"));
              }

              }

            });
          }

        } else {
          console.log("your browser doesnt support localStorage");
        }

      }

      function save() {

        if (debugMode) {
          console.log("in save funct");
        }
        var el = 0;
        $("." + cloneObject).each(function() {
          var offsetXPos = parseInt($(this).offset().left - $(this).parent().offset().left);
          var offsetYPos = parseInt($(this).offset().top - $(this).parent().offset().top);
          var leftPos = getLeftInPercentage(offsetXPos, parseFloat($(this).parent().css('width')));
          var topPos = getTopInPercentage(offsetYPos, parseFloat($(this).parent().css('height')));
         
          var width = parseInt($(this).css("width"));
          var height = parseInt($(this).css("height"));
          var contents = $(this).html();
          var cloneClass = $(this).attr("class");
          var cloneId = $(this).attr("id");
          var clonepositionType = $(this).css("position");
          if (debugMode) {

            console.log("topPos " + el + "=" + topPos);
            console.log("leftPos " + el + "=" + leftPos);

            console.log("width " + el + "=" + width);
            console.log("height " + el + "=" + height);

            console.log("contents " + el + "=" + contents);
            console.log("cloneClass " + el + "=" + cloneClass);

            console.log("cloneId " + el + "=" + cloneId);
            console.log("clonepositionType " + el + "=" + clonepositionType);
          }
          saveObj.top.push(topPos);
          saveObj.left.push(leftPos);
          saveObj.width.push(width);
          saveObj.height.push(height);
          saveObj.contents.push(contents);
          saveObj.class.push(cloneClass);
          saveObj.postionType.push(clonepositionType);
          el++
        });
     
        if (typeof(Storage) !== "undefined") {

          localStorage.setItem(pageHref, JSON.stringify(saveObj));

        } else {

          if (debugMode) {
            console.log("local storage not supported");
          }

        }

      }

    return {
      init: init,
      doMagic: doMagic,
      clearNotes: clearNotes,
      hideKeyboard: hideKeyboard,
      unbindEvents: unbindEvents,
      save: save,
      restoreState: restoreState
    }

  }

}(jQuery));