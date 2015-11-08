define(function (require, exports, module) {

	var util = require('./util');

	function lazyload(obj) {

			this.lazy = typeof obj === 'string' ? document.getElementById(obj) : document.getElementsByTagName('body')[0];

			this.aImg = this.lazy.getElementsByTagName('img');

			this.fnLoad = util.API.bind(this, this.load);

			this.load();

			util.API.on(window, 'scroll', this.fnLoad);

			util.API.on(window, 'resize', this.fnLoad);

		}

	lazyload.prototype = {

		load: function() {

			var iScrollTop = this.lazy.scrollTop;

			var iClientHeight = this.lazy.clientHeight + iScrollTop;

			var iScrollHeight = this.lazy.scrollHeight;

			var i = 0;

			var aParent = [];

			var oParent = null;

			var iTop = 0;

			var iBottom = 0;

			var aNotLoaded = this.loaded(0);

			if (this.loaded(1).length != this.aImg.length) {

				var notLoadedLen = aNotLoaded.length;

				for (i = 0; i < notLoadedLen; i++) {
					
					iTop = util.API.pageY(aNotLoaded[i]);

					iBottom = util.API.pageY(aNotLoaded[i]) + aNotLoaded[i].offsetHeight;

					var isTopArea = (iTop > iScrollTop && iTop < iClientHeight) ? true : false;

					var isBottomArea = (iBottom > iScrollTop && iBottom < iClientHeight) ? true : false;

					if (isTopArea || isBottomArea) {

						// °ÑÔ¤´æÔÚ×Ô¶¨ÒåÊôÐÔÖÐµÄÕæÊµÍ¼Æ¬µØÖ·¸³¸øsrc

						aNotLoaded[i].src = util.API.attr(aNotLoaded[i], 'data-src') || aNotLoaded[i].src;
						// alert(aNotLoaded[i].src)
						if (!util.API.hasClass(aNotLoaded[i], 'loaded')) {

							if ('' != aNotLoaded[i].className) {

								aNotLoaded[i].className = aNotLoaded[i].className.concat(" loaded");
							}

							else {

								aNotLoaded[i].className = 'loaded';

							}

						}

					}

				}

			}

		},

		/**

		 * ÒÑ¼ÓÔØ»òÕßÎ´¼ÓÔØµÄÍ¼Æ¬Êý×é

		 * @param {Number} status Í¼Æ¬ÊÇ·ñÒÑ¼ÓÔØµÄ×´Ì¬£¬0´ú±íÎ´¼ÓÔØ£¬1´ú±íÒÑ¼ÓÔØ

		 * @return Array ·µ»ØÒÑ¼ÓÔØ»òÕßÎ´¼ÓÔØµÄÍ¼Æ¬Êý×é

		 */

		loaded: function(status) {

			var array = [];

			var i = 0;

			for (i = 0; i < this.aImg.length; i++) {

				var hasClass = util.API.hasClass(this.aImg[i], 'loaded');

				if (!status) {

					if (!hasClass)

						array.push(this.aImg[i])

				}

				if (status) {

					if (hasClass)

						array.push(this.aImg[i])

				}

			}

			return array;

		}

	}

	module.exports = {
		lazyload: lazyload
	}

});