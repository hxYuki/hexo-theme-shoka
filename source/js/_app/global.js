var statics = CONFIG.statics.indexOf('//') > 0 ? CONFIG.statics : CONFIG.root
var scrollAction = { x: 'undefined', y: 'undefined' };
var diffY = 0;
var originTitle, titleTime;

const BODY = document.getElementsByTagName('body')[0];
const HTML = document.documentElement;
const Container = $('#container');
const loadCat = $('#loading');
const siteNav = $('#nav');
const siteNavHeight = siteNav.height();
const siteHeader = $('#header');
const menuToggle = siteNav.child('.toggle');
const quickBtn = $('#quick');
const toolBtn = $('#tool');
const toolPlayer = toolBtn.child('.player');
const backToTop = toolBtn.child('.back-to-top');
const goToComment = toolBtn.child('.chat');
const sideBar = $('#sidebar');
const siteBrand = $('#brand');
const siteSearch = $('#search');
const siteContent = $('#content');
const headerHight = $('#waves').top();
const headerHightInner = headerHight - siteNavHeight;

const Loader = {
  timer: null,
  lock: false,
  show: function() {
    clearTimeout(this.timer);
    document.body.removeClass('loaded');
    Velocity(loadCat, "fadeIn", {
      display: "flex",
      complete: function() {
        Loader.lock = false;
      }
    });
  },
  hide: function(sec) {
    this.timer = setTimeout(this.vanish, sec||3000);
  },
  vanish: function() {
    if(Loader.lock)
      return;
    Velocity(loadCat, "fadeOut");
    document.body.addClass('loaded');
    Loader.lock = true;
  }
}

const changeTheme = function(type) {
  if(type) {
    HTML.attr('data-theme', type);
  } else {
    HTML.attr('data-theme', null);
  }
}

const changeMetaTheme = function(color) {
  if(HTML.attr('data-theme') == 'dark')
    color = '#222'

  $('meta[name="theme-color"]').attr('content', color);
}

const themeColorListener = function () {
  window.matchMedia('(prefers-color-scheme: dark)').addListener(function(mediaQueryList) {
    if(mediaQueryList.matches){
      changeTheme('dark');
    } else {
      changeTheme();
    }
  });

  $('.theme').addEventListener('click', function(event) {
    var btn = event.currentTarget.child('.ic')
    if(btn.hasClass('i-sun')) {
      changeTheme('dark');
      btn.removeClass('i-sun')
      btn.addClass('i-moon')
    } else {
      changeTheme();
      btn.removeClass('i-moon')
      btn.addClass('i-sun')
    }
  });
}

const visibilityListener = function () {
  document.addEventListener('visibilitychange', function() {
    switch(document.visibilityState) {
      case 'hidden':
        $('[rel="icon"]').attr('href', statics + CONFIG.favicon.hidden);
        document.title = LOCAL.favicon.hide;
        Loader.show()
        clearTimeout(titleTime);
      break;
      case 'visible':
        $('[rel="icon"]').attr('href', statics + CONFIG.favicon.normal);
        document.title = LOCAL.favicon.show;
        Loader.hide(1000)
        titleTime = setTimeout(function () {
          document.title = originTitle;
        }, 2000);
      break;
    }
  });
}

const showtip = function(msg) {
  if(!msg)
    return

  var new_div = document.createElement('div');
  new_div.innerHTML = msg;
  new_div.addClass('tip');
  BODY.appendChild(new_div);

  window.setTimeout(function() {
      BODY.removeChild(new_div);
  }, 3000);
}

const resizeHandle = function (event) {
  var docHeight = getDocHeight();
  if (docHeight > document.body.offsetHeight) {
    quickBtn.display('flex');
    sideBar.child('.panels').height('100vh');
  } else {
    quickBtn.display('none');
  }
}

const scrollHandle = function (event) {
  var winHeight = window.innerHeight;
  var docHeight = getDocHeight();
  var contentVisibilityHeight = docHeight > winHeight ? docHeight - winHeight : document.body.scrollHeight - winHeight;
  var SHOW = window.pageYOffset > headerHight;
  var startScroll = window.pageYOffset > 0;

  if (SHOW) {
    changeMetaTheme('#FFF');
  } else {
    changeMetaTheme('#222');
  }

  siteNav.toggleClass('show', SHOW);
  toolBtn.toggleClass('affix', startScroll);
  siteBrand.toggleClass('affix', startScroll);
  sideBar.toggleClass('affix', SHOW && document.body.offsetWidth > 991);

  if (typeof scrollAction.y == 'undefined') {
    scrollAction.y = window.pageYOffset;
    //scrollAction.x = Container.scrollLeft;
    //scrollAction.y = Container.scrollTop;
  }
  //var diffX = scrollAction.x - Container.scrollLeft;
  diffY = scrollAction.y - window.pageYOffset;

  //if (diffX < 0) {
  // Scroll right
  //} else if (diffX > 0) {
  // Scroll left
  //} else
  if (diffY < 0) {
    // Scroll down
    siteNav.removeClass('up')
    siteNav.toggleClass('down', SHOW);
  } else if (diffY > 0) {
    // Scroll up
    siteNav.removeClass('down')
    siteNav.toggleClass('up', SHOW);
  } else {
    // First scroll event
  }
  //scrollAction.x = Container.scrollLeft;
  scrollAction.y = window.pageYOffset;

  var scrollPercent = Math.round(Math.min(100 * window.pageYOffset / contentVisibilityHeight, 100)) + '%';
  backToTop.child('span').innerText = scrollPercent;
  $('.percent').width(scrollPercent);
}
