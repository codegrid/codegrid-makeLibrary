(function() {

  if (window.console == null) {
    window.console = {
      log: $.noop
    };
  }

  $(function() {
    var $delay, $form, $growl, $imgs, $options, $pipesize, $usechain, cleanGrowl, notify, randomSrcs, refresh;
    $imgs = $('#imgs');
    $growl = $('#growl');
    $form = $('form').on('submit', function(e) {
      e.preventDefault();
      return refresh();
    });
    $usechain = $('[name=usechain]', $form);
    $options = $('.options', $form);
    $pipesize = $('[name=pipesize]', $form);
    $delay = $('[name=delay]', $form);
    $usechain.filter('[value=yes]').click(function() {
      $options.css('opacity', 1);
      $pipesize.prop('disabled', false);
      return $delay.prop('disabled', false);
    });
    $usechain.filter('[value=no]').click(function() {
      $options.css('opacity', 0.5);
      $pipesize.prop('disabled', true);
      return $delay.prop('disabled', true);
    });
    cleanGrowl = function() {
      var $items;
      $items = $growl.find('div');
      if ($items.size() > 30) {
        return $($items.get().pop()).remove();
      }
    };
    notify = function(msg) {
      var $item;
      msg = msg.replace(/\?.+/, '');
      $item = $("<div>" + msg + "</div>");
      $item.prependTo($growl);
      console.log(msg);
      return cleanGrowl();
    };
    randomSrcs = function() {
      var i, random, srcs, _i;
      srcs = [];
      random = $.now();
      for (i = _i = 1; _i <= 50; i = ++_i) {
        srcs.push("../imgs/" + i + ".jpg?" + random);
      }
      return srcs;
    };
    return refresh = function() {
      var delay, loader, options, pipesize, usechain;
      $imgs.empty();
      if ($usechain.filter(':checked').val() === 'yes') {
        usechain = true;
      }
      pipesize = $pipesize.val() * 1;
      delay = $delay.val() * 1;
      if (usechain) {
        options = {
          pipesize: pipesize,
          delay: delay
        };
      } else {
        options = {};
      }
      options.srcs = randomSrcs();
      loader = new $.ImgLoader(options);
      loader.on('progress', function(progressInfo) {
        return notify("progress fired: " + (Math.floor(progressInfo.loadedRatio * 1000) / 10) + "%");
      });
      loader.on('itemload', function($img) {
        $imgs.append($img);
        notify("itemload fired: " + ($img.attr('src')));
        return setTimeout((function() {
          return $img.css('opacity', 1);
        }), 1);
      });
      loader.on('allload', function() {
        return notify('allload fired');
      });
      return loader.load();
    };
  });

}).call(this);
