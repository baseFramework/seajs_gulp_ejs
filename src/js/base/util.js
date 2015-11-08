define(function (require, exports, module) {

    exports.API = {

        on: function (element, type, handler) {

            return element.addEventListener ? element.addEventListener(type, handler, false) : element.attachEvent('on' + type, handler)

        },

        bind: function (object, handler) {

            return function () {

                return handler.apply(object, arguments)

            }

        },

        pageX: function (El) {

            var left = 0;

            do {

                left += El.offsetLeft;

            } while (El.offsetParent && (El = El.offsetParent).nodeName.toUpperCase() != 'BODY');

            return left;
        },

        pageY: function (El) {

            var top = 0;

            do {

                top += El.offsetTop;

            } while (El.offsetParent && (El = El.offsetParent).nodeName.toUpperCase() != 'BODY');

            return top;
        },

        hasClass: function (element, className) {
            return element.className.indexOf(className) > -1 ? true : false;
        },

        attr: function (element, attr, value) {

            if (arguments.length == 2) {

                return element.attributes[attr] ? element.attributes[attr].nodeValue : undefined;
            }

            else if (arguments.length == 3) {

                element.setAttribute(attr, value)

            }

        },

        isLocalStorage: function () {
            return 'localStorage' in window && window['localStorage'] !== null;
        },

        setcookie: function (name, value) {
            var Days = 30;
            var exp = new Date();
            exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
            document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
        },

        getcookie: function (name) {
            var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
            if (arr != null) {
                return (arr[2]);
            } else {
                return "";
            }
        },

        delcookie: function (name) {
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            var cval = getCookie(name);
            if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
        },
    }
    /**

     * 计时器

     * @param {Date} endTime 结束时间

     * @param {object} showObj 显示的文档节点

     * @param {object} setObj 填充内容的文档节点

     * @param {Function} successFn 倒计时回调(非必填)

     * @param {Function} timeoutFn 时间结束后的回调(非必填)

     * @param {Number} type 显示格式(0 or 1 非必填)

     */
    exports.timer = function (endTime, successFn, timeoutFn, index) {
        // 时间参数
        var param = {
            now: 0,
            ts: parseInt(endTime),
            dd: null,
            hh: null,
            mm: null,
            ss: null
        }

        // 检查位数
        var checkTime = function (i) {
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        }

        var countdown = function () {
            // param.now = new Date().getTime();
            // param.ts = new Date(endTime.replace(/\-/g,'\/')).getTime() - param.now;
            // console.log(endTime)
            param.ts -= 1;
            param.dd = parseInt(param.ts / 60 / 60 / 24, 10); // 计算剩余的天数
            param.hh = parseInt(param.ts / 60 / 60 % 24, 10); // 计算剩余的小时数
            param.mm = parseInt(param.ts / 60 % 60, 10); // 计算剩余的分钟数
            param.ss = parseInt(param.ts % 60, 10);// 计算剩余的秒数
            // alert('time: ' + new Date('2015/11/3 12:40:00').getTime())
            // alert('time: ' + new Date(endTime))
            // 检查位数
            param.hh = checkTime(param.hh);
            param.mm = checkTime(param.mm);
            param.ss = checkTime(param.ss);

            // 时效判断
            if (param.ts <= 0) {
                if (typeof timeoutFn === 'function') {
                    timeoutFn(index);
                } else {
                    console.log('timer timeoutFn undefined');
                }
                return false;
            } else {
                if (typeof successFn == 'function') {
                    successFn(param, index);
                } else {
                    console.log('timer successFn undefined');
                }

            }

            setTimeout(countdown, 1000)

        }

        setTimeout(countdown, 1000);


        // console.log(param);
        // setTimeout(countdown, 1000);
    };

    // 返回头部
    exports.backToTop = function (domNode, scrollTop, isShow) {
        var bodyH = $('body').height(),
            btnToTop = domNode;

        if (!isShow) {
            $(document).scroll(function () {
                if (btnToTop.offset().top > bodyH) btnToTop.show();
                else btnToTop.hide();
            });
        }

        btnToTop.on('touchstart', function () {
            document.body.scrollTop = scrollTop;
        });
    };

    // 获取浏览器尺寸可见区域尺寸
    exports.getWinSize = function () {
        if (window.innerWidth) {
            winWidth = window.innerWidth;
        } else if ((document.body) && (document.body.clientWidth)) {
            winWidth = document.body.clientWidth;
        }
        if (window.innerHeight) {
            winHeight = window.innerHeight;
        } else if ((document.body) && (document.body.clientHeight)) {
            winHeight = document.body.clientHeight;
        }
        if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
            winHeight = document.documentElement.clientHeight;
            winWidth = document.documentElement.clientWidth;
        }
        return {height: winHeight, width: winWidth}
    }

    //获取URL参数
    exports.getQueryString = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = (window.location.search || window.location.hash).substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return "";
    }

    // 公用方法
    exports.common = {
        // 上拉加载
        pullUpDomRefresh: function (fn, time) {
            var startY = 0,
                endY = 0,
                domH = 0,
                winH = 0,
                scrollT = 0,
                isCtrl = false,
                time = time || 2,
                callback = fn || function () {
                        console.log('pullUp callback undefined')
                    },
                touch;
            $(document).off('refresh').on({
                'touchstart.refresh': function (e) {
                    touch = e.touches[0];
                    startY = touch.pageY;
                },
                'touchmove.refresh': function (e) {
                    touch = e.changedTouches[0];
                    endY = touch.pageY;

                    if (startY > endY) {
                        scrollT = document.documentElement.scrollTop || document.body.scrollTop;
                        domH = document.documentElement.offsetHeight || document.body.offsetHeight;
                        scrollH = document.documentElement.scrollHeight || document.body.scrollHeight;
                        // console.log('scrollT: ' + scrollT);
                        // console.log('domH: ' + domH);
                        // console.log('winH: ' + scrollH);
                        console.log('pageYOffset: ' + window.pageYOffset);
                        console.log('scrollHeight: ' + document.body.scrollHeight);
                        console.log('availHeight: ' + window.screen.availHeight);
                        if (window.pageYOffset >= (parseInt(document.body.scrollHeight - window.screen.availHeight))) {
                            callback();
                        }
                        // if(domH + scrollT >= Math.floor(scrollH / time)) {
                        //     callback();
                        // }
                    }

                }
            });
        },
        /**

         * 单击事件

         * @param {object} $obj jq对象

         * @param {Function} callback touchend回调方法

         * @param {bool} isStopPropagation 阻止冒泡和浏览器默认动作

         * @param {string} hClass 绑定对象的hover效果class

         */
        singleTap: function ($obj, callback, isStopPropagation, hClass) {
            var isCtrl = false,
                $this = $obj,
                isStop = isStopPropagation || false,
                onClass = hClass || null,
                index = null;
            // console.log(isStopPropagation)
            $this.off().on({
                touchstart: function (e) {
                    // if(isStop) {
                    // 	e.preventDefault();
                    // 	e.stopPropagation();
                    // }
                    isCtrl = true;
                    if (onClass) {
                        this.addClass(onClass)
                    }
                },
                touchmove: function (e) {
                    isCtrl = false;
                    if (isStop) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    if (onClass) {
                        this.removeClass(onClass);
                    }
                },
                touchend: function (e) {
                    if ($this.length == 1) {
                        index = 0;
                    } else {
                        index = $this.index(this);
                    }
                    if (isStop) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    if (onClass) {
                        this.removeClass(onClass);
                    }
                    if (isCtrl) {
                        isCtrl = false;
                        if (callback) {
                            if (typeof index != 'number') {
                                index = 'undefined';
                            }
                            callback(this, index);
                        } else {
                            console.log('error callback to bind at dom');
                        }
                    }
                }
            });
        }
    }

});
