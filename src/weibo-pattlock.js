/**
 * 微博手势计算
 * 依赖 js-base64 模块
 * document监听'weibo-pattlock' 验证完毕
 */

/**
 1、【GET】https://login.sina.com.cn/sso/prelogin.php?checkpin=1&entry=mweibo&su=aHR5d29ya18wQHNpbmEuY29t&callback=jsonpcallback1523621527728
    判断是否需要验证码
    su：base64的用户名
    返回：showpin=1，需要验证码

 2、【GET】https://captcha.weibo.com/api/pattern/get?ver=1.0.0&source=ssologin&usrname=htywork_0@sina.com&line=160&side=100&radius=30&_rnd=0.053927914628985496&callback=pl_cb
    获取验证码
    返回：id：当前id，path_enc：验证码地址

 3、【GET】https://captcha.weibo.com/api/pattern/verify?ver=1.0.0&id=29218517fb4894ae45ec0d1c80f93d54b8c80f93d54b&usrname=htywork_0@sina.com&source=ssologin&path_enc=&data_enc=&callback=pl_cb
    验证验证码
    ver: 1.0.0
    id
    usrname: htywork_0@sina.com
    source: ssologin
    path_enc：路径和id的算法
    data_enc：路径坐标的算法
    返回：code："100000"，msg："验证成功"
         code："100001"，msg："验证码已过期"
         code："100002"，msg："验证错误"
         code："100004"，msg："轨迹验证错误"
 */

(function(_document, _window){

  /* =========================== 计算data_enc path_enc =========================== */
  var p = {
    decode:function(a,b){var c=function(b){for(var c,d=a,e=(b[0],b[1]),f=8,g=3;f>4;f--,g--)c=e[g]%f,d=d.substr(0,c)+d.substr(c+1);return d}(function(a){for(var c,d=[],e=[],f=a,g=0;4>g;g++)c=b.charAt(f),e.push(f),d.push(c),f=c.charCodeAt(0)%32;return[d,e]}(3));return function(a){for(var b=[],c=+(!+[]+!0+!0+!0+!0+!0+!0+!0+!0+[]+(!+[]+!0+!0+!0+!0+!0+!0+[])),d=0;d<a.length;d++)b.push(a[d].charCodeAt(0)-c);return b.join("")}(c)},
    encode:function(a,b){for(var c=b.length-2,d=b.slice(c),e=[],f=0;f<d.length;f++){var g=d.charCodeAt(f);e[f]=g>57?g-87:g-48}d=c*e[0]+e[1];var h,i=parseInt(a)+d,j=b.slice(0,c),k=[20,50,200,500],l=[],m={},n=0;f=0;for(var o in k)l.push([]);for(var p=j.length;p>f;f++)h=j.charAt(f),m[h]||(m[h]=1,l[n].push(h),n++,n==l.length&&(n=0));for(var q,r=i,s="",t=k.length-1;r>0&&!(0>t);)r-k[t]>=0?(q=parseInt(Math.random()*l[t].length),s+=l[t][q],r-=k[t]):t-=1;return s}
  };

  var q = {
    seed:"()*,-./0123456789:?@ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnop~$^!|",
    numberTransfer:function(a){for(var b=this.seed,c=b.substr(0,b.length-3),d=c.length,e=b.substr(-2,1),f=b.substr(-3,1),g=0>a?f:"",a=Math.abs(a),h=parseInt(a/d),i=[a%d];h;)g+=e,i.push(h%d),h=parseInt(h/d);for(var j=i.length-1;j>=0;j--)g+=0==j?c.charAt(i[j]):c.charAt(i[j]-1);return 0>a&&(g=f+g),g},
    arrTransfer:function(a){for(var b=[a[0]],c=0;c<a.length-1;c++){for(var d=[],e=0;e<a[c].length;e++)d.push(a[c+1][e]-a[c][e]);b.push(d)}return b},
    encode:function(a){for(var b=this.seed.substr(-1),c=this.arrTransfer(a),d=[],e=[],f=[],g=0;g<c.length;g++)d.push(this.numberTransfer(c[g][0])),e.push(this.numberTransfer(c[g][1])),f.push(this.numberTransfer(c[g][2]));return d.join("")+b+e.join("")+b+f.join("")}
  };
  /* =========================== 计算data_enc path_enc =========================== */

  /* 初始化css样式 */
  function initStyle(){
    var style = '.pattern-dialog { position: fixed; z-index: 9999; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, .7); }\n'
              + '.pattern-father, .pattern { width: 160px; height: 160px; background-color: #fff; }\n'
              + '.pattern-father { position: absolute; top: 50%; left: 50%; margin: -80px 0 0 -80px; }\n'
              + '.pattern:after { content: \'\\200B\'; display: block; height: 0; clear: both; }\n'
              + '.pattern-children { float: left; width: 32px; height: 32px; }\n'
              + '.pattern-canvas { position: absolute; z-index: 1; top: 0; left: 0; width: 100%; height: 100%; }'
              + '.pattern-close { position: absolute; top: 20px; right: 20px; width: 50px; height: 50px; border: none; border-radius: 200px; background-color: #fff; -webkit-appearance: none; font-size: 14px; cursor: pointer; }'
              + '.pattern-svg { margin: 5px 0 0; opacity: .6; }';
    var styleElement = _document.createElement('style');
    styleElement.innerHTML = style;
    styleElement.setAttribute('data-pattlock', new Date().getTime());
    _document.head.appendChild(styleElement);
    styleElement = null;
  }

  /* 创建dom */
  function initDom(){
    var divElement = _document.createElement('div');
    divElement.innerHTML = '<div class="pattern-father" id="pattern-father">'
                         + '  <div class="pattern" id="pattern"></div>'
                         + '  <canvas class="pattern-canvas" id="pattern-canvas" width="160" height="160"></canvas>'
                         + '</div>'
                         + '<button class="pattern-close" id="pattern-close" type="button">'
                         + '<svg class="pattern-svg" width="32" height="32" viewBox="0 0 32 32">'
                         + '  <path d="M31.708 25.708c-0-0-0-0-0-0l-9.708-9.708 9.708-9.708c0-0 0-0 0-0 0.105-0.105 0.18-0.227 0.229-0.357 0.133-0.356 0.057-0.771-0.229-1.057l-4.586-4.586c-0.286-0.286-0.702-0.361-1.057-0.229-0.13 0.048-0.252 0.124-0.357 0.228 0 0-0 0-0 0l-9.708 9.708-9.708-9.708c-0-0-0-0-0-0-0.105-0.104-0.227-0.18-0.357-0.228-0.356-0.133-0.771-0.057-1.057 0.229l-4.586 4.586c-0.286 0.286-0.361 0.702-0.229 1.057 0.049 0.13 0.124 0.252 0.229 0.357 0 0 0 0 0 0l9.708 9.708-9.708 9.708c-0 0-0 0-0 0-0.104 0.105-0.18 0.227-0.229 0.357-0.133 0.355-0.057 0.771 0.229 1.057l4.586 4.586c0.286 0.286 0.702 0.361 1.057 0.229 0.13-0.049 0.252-0.124 0.357-0.229 0-0 0-0 0-0l9.708-9.708 9.708 9.708c0 0 0 0 0 0 0.105 0.105 0.227 0.18 0.357 0.229 0.356 0.133 0.771 0.057 1.057-0.229l4.586-4.586c0.286-0.286 0.362-0.702 0.229-1.057-0.049-0.13-0.124-0.252-0.229-0.357z"></path>'
                         + '</svg>'
                         + '</button>';
    divElement.className = 'pattern-dialog';
    divElement.id = 'pattern-dialog';
    _document.body.appendChild(divElement);
    divElement = null;
  }

  /* 初始化各种对象 */
  var START = 'ontouchstart' in _document ? 'touchstart' : 'mousedown';
  var MOVE = 'ontouchmove' in _document ? 'touchmove' : 'mousemove';
  var END = 'ontouchend' in _document ? 'touchend' : 'mouseup';

  var father = null;
  var fobj = null;
  var canvas = null;
  var ctx = null;

  function initArgv(){
    father =_document.getElementById('pattern-father');
    fobj = father.getBoundingClientRect();
    canvas = _document.getElementById('pattern-canvas');
    ctx = canvas.getContext('2d');
  }

  function initCanvas(){
    var x = [ [30, 30], [130, 30], [30, 130], [130, 130] ];
    ctx.strokeStyle = '#b3b3b3';
    ctx.lineWidth = 3;
    var i = 0, j = x.length;
    while(i < j){
      ctx.beginPath();
      ctx.arc(x[i][0], x[i][1], 20, 0, 2 * Math.PI);
      ctx.stroke();
      i += 1;
    }
    ctx.strokeStyle='#ff7f00';
    ctx.lineWidth = 5;
  }

  /* 计算坐标相关 */
  var codeId = null;
  var trace = [];
  var startTime = null;
  var old = null;
  var zuobiao = [];

  /* 坐标范围 */
  function zuobiaofanwei(x, y){
    if(y >= 0 && y <= 60){
      if(x >= 0 && x <= 60){
        return '1';
      }else if(x >= 100 <= 160){
        return '2';
      }else{
        return null;
      }
    }else if(y >= 100 && y <= 160){
      if(x >= 0 && x <= 60){
        return '3';
      }else if(x >= 100 <= 160){
        return '4';
      }else{
        return null;
      }
    }else{
      return null;
    }
  }

  /* 事件 */
  function onStart(event){
    event.preventDefault();
    startTime = new Date().getTime();
    var x = event.pageX || event.changedTouches && event.changedTouches[0].pageX;
    var y = event.pageY || event.changedTouches && event.changedTouches[0].pageY;
    var sx = Math.round(x - fobj.left);
    var sy = Math.round(y - fobj.top);
    trace.push([sx, sy, 0]);
    //
    var z = zuobiaofanwei(sx, sy);
    if(z !== null && zuobiao.indexOf(z) < 0) zuobiao.push(z);
    //
    old = [sx, sy];
    canvas.addEventListener(MOVE, onMove, false);
    canvas.addEventListener(END, onEnd, false);
  }

  function onMove(event){
    event.preventDefault();
    var x = event.pageX || event.changedTouches && event.changedTouches[0].pageX;
    var y = event.pageY || event.changedTouches && event.changedTouches[0].pageY;
    var t = new Date().getTime();
    var sx = Math.round(x - fobj.left);
    var sy = Math.round(y - fobj.top);
    trace.push([sx, sy, t - startTime]);
    //
    var z = zuobiaofanwei(sx, sy);
    if(z !== null && zuobiao.indexOf(z) < 0) zuobiao.push(z);
    //
    ctx.beginPath();
    ctx.moveTo(old[0], old[1]);
    ctx.lineTo(sx, sy);
    ctx.stroke();
    old = [sx, sy];
  }

  function onEnd(event){
    event.preventDefault();
    var x = event.pageX || event.changedTouches && event.changedTouches[0].pageX;
    var y = event.pageY || event.changedTouches && event.changedTouches[0].pageY;
    var t = new Date().getTime();
    var sx = Math.round(x - fobj.left);
    var sy = Math.round(y - fobj.top);
    trace.push([sx, sy, t - startTime]);
    canvas.removeEventListener(MOVE, onMove);
    canvas.removeEventListener(END, onEnd);
    //
    var z = zuobiaofanwei(sx, sy);
    if(z !== null && zuobiao.indexOf(z) < 0) zuobiao.push(z);
    //
    ctx.beginPath();
    ctx.moveTo(old[0], old[1]);
    ctx.lineTo(sx, sy);
    ctx.stroke();
    old = null;

    var event2 = new Event('weibo-pattlock');
    event2.data = {
      path_enc: p.encode(zuobiao.join(''), codeId),
      data_enc: q.encode(trace)
    };
    _document.dispatchEvent(event2);
    onReset();
  }

  function onReset(event){
    canvas.removeEventListener(START, onStart);
    _document.getElementById('pattern-close').removeEventListener('click', onReset);
    father = null;
    fobj = null;
    canvas = null;
    ctx = null;
    _document.body.removeChild(_document.getElementById('pattern-dialog'));
  }

  function initFunction(){
    codeId = null;
    trace = [];
    startTime = null;
    old = null;
    zuobiao = [];
    canvas.addEventListener(START, onStart, false);
    _document.getElementById('pattern-close').addEventListener('click', onReset, false);
  }

  /**
   * 计算图片位置
   * @param { string } bgUrl: 图片地址
   * @param { Array<string> } lock
   */
  function recombineShadow(bgUrl, lock){
    var html = '';
    for(var e, f, g, h = lock[0], i = lock[1], j = lock.slice(2), l = 160, m = 160, n = 0; n < j.length; n++){
      e = l / h;
      f = m / i;
      g = '-' + j[n] % h * e + 'px -' + parseInt(j[n] / h) * f + 'px';
      html += '<div class="pattern-children" style="background-image: ' + bgUrl + '; background-position: ' + g + ';"></div>';
    }
    _document.getElementById('pattern').innerHTML = html;
  }

  /**
   * 初始化图片地址
   * @param { string } imageUrl: base64图片|token
   * @param { string } id      : id
   */
  function hint(imageUrl, id){
    initDom();
    initArgv();
    initCanvas();
    initFunction();
    codeId = id;
    if(imageUrl){
      const u = imageUrl.split('|');
      const bg = 'url(' + u[0] + ')';
      const lock = atob(u[1]).split('_');
      recombineShadow(bg, lock);
    }
  }

  /* 初始化函数 */
  initStyle();
  _window.hint = hint;
})(document, window);