/**
* O3 video player
* @version 1.1.2
*
* Cross browser javascript video player
* Released under the MIT license
*
* @author Zoltan Fischer
* @project https://github.com/zoli-fischer/o3-video  
* @license https://github.com/zoli-fischer/o3-video/blob/master/LICENSE
*/

/** o3video static variable */
var o3video_defines = (function() {
	this.script_uri = (function() {
		         	var scripts = document.getElementsByTagName("script"),
		         		src = scripts[scripts.length - 1].src;		         	
		         	if ( src.match( /^(http.+\/)[^\/]+$/ ) && src.match( /^(http.+\/)[^\/]+$/ ).length > 0 )
		         		return src.match( /^(http.+\/)[^\/]+$/ )[1];		         					         	
		         	//fix. for iframes
         			return src.substring(0,src.lastIndexOf("/")+1);
		        })();

    //get the navigator language, default is english
	this.navigator_language = (function() {
						var lang = navigator.language || navigator.userLanguage;
						if ( lang )
							return lang.substring(0,2);
						return 'en';
					})();

	//default (English) interface language translations  
	this.default_translations = {
		no_support_msg: 'Your web browser does not support the video tag or missing the codec for this video file.<br><a href="//www.google.com/chrome/browser/" target="_blank">Click here to download Google Chrome.</a><br><br>Your web browser does not have Adobe Flash Player plugin.<br><a href="//get.adobe.com/flashplayer/" target="_blank">Click here to download Adobe Flash Player.</a>.',
		play_video: "Play video",
		pause_video: "Pause video",
		mute: "Mute",
		unmute: "Unmute",
		loop_video: "Loop video",
		dont_loop_video: "Don't loop video",
		show_controls: "Show controls",
		hide_controls: "Hide controls",
		save_video_as: "Save video as...",
		copy_video_url: "Copy video URL",
		open_video_in_new_tab: "Open video in new tab"
	};
	
	return this; 
})();

o3video = function( opts, container ) {

	var self = this;

	//for compatibility mode 
	var $ = jQuery;
	
	//options
	self.opts = $.extend( {
		playButtonImage: 'data:image/png;base64,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',
		language: o3video_defines.navigator_language
	}, opts );	

	//load interface language
	self.translations = self.load_translations( self.opts.language );	

	//container
	self.$container = $(container); 
	self.container = self.$container.get(0);

	//check for container	
	if ( self.$container.length != 1 || !self.$container.get(0) )
		return console.log('Container must not be empty!') || false;

	//check for valid video container	
	if ( self.$container.prop("tagName").toString().toUpperCase() != 'VIDEO' )
		return console.log("Container's tagname is not video.") || false;

	//type of video player
	self.type = ''; // html5, flash

	//jQuery obj of iframe contaier
	self.$iframe = null;

	//iframe container document
	self.iframe_doc = null;
	
	//iframe container window
	self.iframe_wnd = null;

	//jQuery obj of iframe video
	self.$iframe_vid = null;

	//jQuery obj of iframe main
	self.$iframe_main = null;

	//jQuery obj of iframe overlay play button
	self.$playbtn = null;

	//jQuery obj of iframe no supported codec or player message
	self.$no_support_msg = null;

	//list of sources from original video
	self.source = new Array(); 

	//true if a codec was found for at least one source 
	self.codec_exists = false;

	//true if a flash player is installed 
	self.flash_exists = false;

	//name of the flash object, used for get reference to it
	self.flash_name = '';

	//source file for flash (mp4) 
	self.flash_src = '';

	//store original video attributes
	self.origin = { /*autoplay: self.get_attr( self.$container, "autoplay", false ),*/
					//check for muted, webkit dosn't supports the muted attribute, we need to check in the HTML code, @todo: regexp need to improved
					autoplay: / autoplay/i.test(self.$container.get(0).outerHTML), 
					volume: self.get_attr( self.$container, "volume", '100' ),
					controls: / controls/i.test(self.$container.get(0).outerHTML), 
					//controls: self.get_attr( self.$container, "controls", false ),
					height: self.get_attr( self.$container, "height", 'auto' ),
					//loop: self.get_prop( self.$container, "loop", false ),
					loop: / loop/i.test(self.$container.get(0).outerHTML), 
					//check for muted, webkit dosn't supports the muted attribute, we need to check in the HTML code, @todo: regexp need to improved
					muted: / muted/i.test(self.$container.get(0).outerHTML), 
					poster: self.get_attr( self.$container, "poster", '' ),
					preload: self.get_attr( self.$container, "preload", false ),
					src: self.get_attr( self.$container, "src", '' ),
					width: self.get_attr( self.$container, "width", 'auto' ),
					height: self.get_attr( self.$container, "height", 'auto' ),
					innerHTML: self.get_attr( self.$container, "innerHTML", '' ) };			

	/** Constructor */
	self.constructor__ = function() {
 
		//create iframe
		self.$iframe = $('<iframe frameborder="0" allowTransparency="true"></iframe>').insertAfter(self.$container).attr({
			id: self.$container.attr("id"),
			src: "about:blank",
			ref: self.$container.attr("ref"),
			width: self.origin.width,
			height: self.origin.height,
			allowfullscreen: true,
			style: self.$container.attr("style"),
			'class': self.$container.attr("class")		
		}).css('overflow','hidden');
		self.$iframe.get(0).o3video = self;

		//get source
		if ( jQuery.trim(self.origin.src).length > 0 ) {						

			//only store the source if src and type is valid  
			if ( self.ext2mime(self.origin.src) != '' ) {
				var has_codec = self.is_codec_video(self.ext2mime(self.origin.src));
				self.source.push( { src: self.origin.src, type: self.ext2mime(self.origin.src), has_codec: has_codec, media: '' } );
				//update codec was found for source  
				if ( has_codec )
					self.codec_exists = true;
			};

			//set as flash src if is a mp4 file
			if ( self.ext2mime(self.origin.src) == 'video/mp4' && self.flash_src == '' )
				self.flash_src = self.origin.src;
		};		

		//get sources
		self.$container.find('source').each(function(){

			//get source's src + type, if no mime type defined try to get from the src 
			var src = self.get_attr( $(this), 'src', '' ),
				type = self.get_attr( $(this), 'type', self.ext2mime(src) ),
				has_codec = self.is_codec_video(type),
				media = self.get_attr( $(this), 'media', '' );

			//update codec was found for source  
			if ( has_codec )
				self.codec_exists = true;

			//only store the source if src and type is valid  
			if ( src != '' && type != '' )
				self.source.push( { src: src, type: type, has_codec: has_codec, media: media } );

			//remove source from DOM
			$(this).attr( 'src', '' ); 
			$(this).remove();			
			
			//set as flash src if is a mp4 file
			if ( type == 'video/mp4' && self.flash_src == '' )
				self.flash_src = src;						
				
		});

		//get message for browsers that do not support the <video> element
		var no_support_msg = self.get_attr( self.$container, "innerHTML", '' );
		no_support_msg = $.trim(no_support_msg).length == 0 ? self.translations.no_support_msg : no_support_msg;

		//web browser without video tag support, so we need to remove the video sibling by sibling from DOM
		if ( /*!this.supports_video()*/ /MSIE/i.test(navigator.userAgent) && parseFloat((navigator.userAgent.toLowerCase().match(/.*(?:rv|ie)[\/: ](.+?)([ \);]|$)/) || [])[1]) <= 9 ) {			
			var old_obj = self.$container.get(0),
				rem_list = [];	
			//get elements from inside the video
			while ( old_obj.nextSibling && old_obj.nextSibling.tagName != '/VIDEO' )	{								
				old_obj = old_obj.nextSibling;
				//get flash source for ie8
				if ( old_obj.tagName == 'SOURCE' ) {					
					if ( self.ext2mime(old_obj.src) == 'video/mp4' && self.flash_src == '' )
						self.flash_src = old_obj.src;										
				};
				if ( old_obj.tagName != 'IFRAME' )
					rem_list.push( old_obj );
			};
			//get the video closeing element
			old_obj = old_obj.nextSibling;
			if ( old_obj.tagName == '/VIDEO' )
				rem_list.push( old_obj );
			//remove from DOM
			for ( var i = 0 ; i < rem_list.length; i++ )
				$(rem_list[i]).remove();
		};

		if ( !(/^(?:[a-z]+:)?\/\//i.test(self.flash_src)) ) {
			//if the src is relative we need to convert to absolute
			var url = window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/") + 1);
			self.flash_src = window.location.protocol+'//'+window.location.hostname+( self.flash_src.charAt(0) == '/' ? '' : url )+self.flash_src;
		};

		setTimeout( function() {

				if ( self.container.pause )
					self.container.pause();

				//stop loading the original video and remove it from DOM
				self.container.src = '';

				//remove video tag from DOM
				self.$container.remove();
			}, 200 );				

		//create iframe content
		var myContent = '<!DOCTYPE html>'
		    + '<html><head>'
		    + '<meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge">'
		    + '<style type="text/css">'
		    + 'body,html { padding: 0px; margin: 0px; overflow: hidden; background:transparent; }'
		    + '.transition { -moz-transition: all 0.3s linear; -webkit-transition: all 0.3s linear; -o-transition: all 0.3s linear; transition: all 0.3s linear; } '
		    + '.fill_wnd { display: block; position: absolute; left: 0px; top: 0px; width: 100%; height: 100%; overflow: hidden; } '		    
		    + '.playbtn { opacity: 1; visibility: visible; z-index: 10; pointer: cursor; position: absolute; left: 50%; right: 50%; top: 50%; bottom: 50%; margin-left: -46px; margin-top: -46px;  width: 93px; height: 94px; display: block; background-image: url('+self.opts.playButtonImage+'); background-position: center; background-repeat: no-repeat; -moz-transition: all 0.2s ease-in; -webkit-transition: all 0.2s ease-in; -o-transition: all 0.2s ease-in; transition: all 0.2s ease-in; border-radius: 45px; -webkit-border-radius: 45px; -moz-border-radius: 45px; }'
		    + '.playbtn:hover { opacity: 0.6 }'
		    + '.playbtn_hide { visibility: hidden; opacity: 0; -ms-transform: scale(2,2); -webkit-transform: scale(2,2); transform: scale(2,2); }'
		    + '.no_support_msg { display: none; font-size: 14px; color: #000000; font-family: sans-serif; background: #FFFFFF; text-align: center; padding: 20px 0px 0px 0px; }'
		    + '.no_support_msg A { color: #000000; text-decoration: underline; }'
		    + '</style>'
		    + '</head><body><div id="main" class="fill_wnd"><a href="javascript:{}" class="playbtn transition"></a><div class="no_support_msg transition fill_wnd">'+no_support_msg+'</div></div></body></html>';

		//store iframe container window		    
		self.iframe_wnd = self.$iframe.get(0).contentWindow;

		//store iframe container document and write in it	
		self.iframe_doc = self.iframe_wnd.document;
		self.iframe_doc.open('text/html', 'replace');
		self.iframe_doc.write(myContent);
		self.iframe_doc.close();

		//store iframe main 
		self.$iframe_main = $(self.iframe_doc).find('#main');

		//get overlay play btn
		self.$playbtn = $(self.iframe_doc).find('.playbtn');
		
		//get no support message holder
		self.$no_support_msg = $(self.iframe_doc).find('.no_support_msg');	

		//create overlay play btn
		self.create_playbtn();			

		//create HTML5 video tag only if supported or codec available
		if ( self.codec_exists ) {	

			//create video tag
			self.create_video();			

		} else {			

			//hide the overlay play button
			this.$playbtn.css('display','none');

			//check for flash player version
			self.flash_exists = self.get_flash_version().split(',').shift();			

			//if flash player ver min. 9 exists and mp4 source exists show flash player
			if ( self.flash_exists >= 9 && self.flash_src != '' ) {

				//create flash object
				self.create_flash();

			} else {
				
				//show not support msg
				self.$no_support_msg.css('display','block');
				
			};						
		
		};

	};

	//run constructor
	self.constructor__();
};


/** 
* hide/show overlay play button) 
* @param boolean hide (optional) Default: true 
*/
o3video.prototype.hideOverlayPlayBtn = function( hide ) {
	hide = typeof hide == 'undefined' ? true : hide; 
	
	if ( hide ) {
		var btn = this.$playbtn.addClass('playbtn_hide');
		setTimeout(function(){ btn.css('display','none'); },300);
	} else {
		this.$playbtn.css('display','block').removeClass('playbtn_hide');		
	};
};

/** start/seek the video player */
o3video.prototype.play = function() {
	if ( this.type == 'html5' ) {
		this.$iframe_vid.get(0).play();
	} else {
		this.get_flash_ref().js_play();
	};	
};

/** start/seek the video player */
o3video.prototype.pause = function() {
	if ( this.type == 'html5' ) {
		this.$iframe_vid.get(0).pause();
	} else {
		this.get_flash_ref().js_pause();
	};
};

/** create and add overlay play button to the iframe */
o3video.prototype.create_playbtn = function() {
	//don show overlay button if no supported codec or player, the autoplay attr is set or for some browsers has they own overlay play button.
	if ( this.origin.autoplay || /firefox/i.test(navigator.userAgent) || 
		 /Nintendo/i.test(navigator.userAgent) || /iPod/i.test(navigator.userAgent) || /iPad/i.test(navigator.userAgent) || /iPhone/i.test(navigator.userAgent) || 
		 /Windows Phone/i.test(navigator.userAgent) || /Android/i.test(navigator.userAgent) ) {
		//show play overlay btn
		this.$playbtn.css('display','none');
	} else { 
		//show play overlay btn
		this.$playbtn.css('display','block');
	};	
		
	var self = this;
	//play the video on click on overlay play button 
	this.$playbtn.click(function(){ 
		self.play(); 
	});
};

/**
* Load language translations
* @param string(2) language Language to load 
*/
o3video.prototype.load_translations = function( language ) {
	if ( language != 'en' ) {
		//load translations file if needed
		var json_data = null;
		jQuery.ajax({
			url: o3video_defines.script_uri+"languages/"+language+".json.js",
			async: false,
			dataType: 'json',
			success: function ( data ) {
				json_data = data[0];
			}
		});
		//if translation file was not loaded ignore data
		if ( json_data != null )
			return json_data;
	};
	return default_translations;
};

/**
* @param string name Name of the object 
*/
o3video.prototype.get_flash_ref = function() {
	var obj = typeof(this.iframe_doc[this.flash_name+'_obj']) != undefined ? this.iframe_doc[this.flash_name+'_obj'] : this.iframe_wnd[this.flash_name+'_obj'],
		embed = typeof(this.iframe_doc[this.flash_name+'_embed']) != undefined ? this.iframe_doc[this.flash_name+'_embed'] : this.iframe_wnd[this.flash_name+'_embed'];		  
	return embed ? embed : obj;
};

/** 
* Create and add flash object to the iframe 
*/
o3video.prototype.create_flash = function() {
	this.type = 'flash';
	var t_ = this.translations,
		flashvars = 'src='+this.flash_src
					+'&autoplay='+( this.origin.autoplay ? 'true' : 'false' )
					+'&loop='+( this.origin.loop ? 'true' : 'false' )
					+'&muted='+( this.origin.muted ? 'true' : 'false' )
					+'&soundVolume='+( this.origin.volume ? this.origin.volume / 100 : 1 )
					+'&controls='+( this.origin.controls ? 'true' : 'false' )				   
					+'&poster='+( this.origin.poster.replace(/\+/g,'%2B') )
					+'&playButtonImage='+this.opts.playButtonImage.replace(/\+/g,'%2B')
					+( t_.play_video ? '&l_plyv='+escape(t_.play_video) : '' )
					+( t_.pause_video ? '&l_pasv='+escape(t_.pause_video) : '' )
					+( t_.mute ? '&l_mute='+escape(t_.mute) : '' )
					+( t_.unmute ? '&l_umute='+escape(t_.unmute) : '' )
					+( t_.loop_video ? '&l_lopv='+escape(t_.loop_video) : '' )
					+( t_.dont_loop_video ? '&l_nlpv='+escape(t_.dont_loop_video) : '' )
					+( t_.show_controls ? '&l_sctr='+escape(t_.show_controls) : '' )
					+( t_.hide_controls ? '&l_hctr='+escape(t_.hide_controls) : '' )
					+( t_.save_video_as ? '&l_savv='+escape(t_.save_video_as) : '' )
					+( t_.copy_video_url ? '&l_cpyu='+escape(t_.copy_video_url) : '' )
					+( t_.open_video_in_new_tab ? '&l_opnn='+escape(t_.open_video_in_new_tab) : '' );
	

	//create flash object name
	this.flash_name = 'o3f'+Math.random().toString().replace('.','');	

	var embed = '<embed name="'+this.flash_name+'_embed" id="'+this.flash_name+'_embed"  src="'+o3video_defines.script_uri+'o3-video.flash.swf?'+Math.random()+'" type="application/x-shockwave-flash" allowscriptaccess="always"\
				wmode="transparent" menu="true" quality="high" allowfullscreen="true" width="100%" height="100%" flashvars="'+flashvars+'"></embed>',
		object = '<object name="'+this.flash_name+'_obj" id="'+this.flash_name+'_obj" height="100%" width="100%" '+( /MSIE/i.test(navigator.userAgent) ? ' classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" ' : '' )+'>\
				 <param name="movie" value="'+o3video_defines.script_uri+'o3-video.flash.swf?'+Math.random()+'"></param>\
				 <param name="flashvars" value="'+flashvars+'"></param>\
				 <param name="allowFullScreen" value="true"></param>\
				 <param name="allowscriptaccess" value="always"></param>\
				 <param name="quality" value="hight"></param>\
				 <param name="wmode" value="transparent"></param>\
				 <param name="menu" value="true"></param>'
				 + embed
				 +'</object>';

	//add only embed code on Miscrosoft IE
	jQuery( object ).appendTo(this.$iframe_main);
};

/** 
* Create and add HTML5 video tag to the iframe 
*/
o3video.prototype.create_video = function() {
	var self = this,
		sources = '';
	this.type = 'html5';	

	for (var i = 0; i < self.source.length ; i++ ) {
		var source = self.source[i]; 
		
		//fix for chrome
		//chrome player becomeing broken if the source is allready was loaded in a video tag before or in another iframe/tab
		//only in chrome we add random to same sources
		if ( /Chrome/i.test(navigator.userAgent) && source.src != '' )
			source.src += (source.src.split('?')[1] ? '&' : '?' )+Math.random();
		sources += '<source src="'+source.src+'" type="'+source.type+'" media="'+source.media+'"></source>';
	};

	//create iframe video object and copy original video properties
	this.$iframe_vid = jQuery('<video id="video" width="100%" height="100%"'
						/*+ ( this.origin.autoplay ? ' autoplay ' : '' )*/
						+ ( this.origin.controls ? ' controls ' : '' )
						+ ( this.origin.loop ? ' loop ' : '' )
						+ ( this.origin.muted ? ' muted ' : '' )
						+ ( this.origin.poster ? ' poster="'+this.origin.poster+'" ' : '' )
						+ ( this.origin.preload ? ' preload="'+this.origin.preload+'" ' : '' )
						+ ' >'+sources/*this.origin.innerHTML*/+'</video>').appendTo(this.$iframe_main);			
	var vid = this.$iframe_vid.get(0);

	//bugfix for chrome, force to reload the file
	if ( typeof vid.load == 'function' )
		vid.load();
	
	if ( this.origin.poster ) {
		vid.poster = '';
		vid.poster = this.origin.poster;
	};

	//ff fix
	if ( this.origin.muted && this.origin.muted === true )
		vid.muted = true;

	//set volume
	if ( this.origin.volume && !this.origin.muted ) {		
		vid.volume = this.origin.volume / 100;
	};

	//chrome fix. Handle autoplay
	if ( this.origin.autoplay )
		vid.play();

	//on playing hide overlay play btn
	this.$iframe_vid.bind('playing',function(){ self.hideOverlayPlayBtn(); });

};

/** 
* Check if codecs available to play mime type 
* @param string mime Mime type
* @return boolean
*/
o3video.prototype.is_codec_video = function( mime ) {
	//check for html5 video support
	if ( this.supports_video() ) {
		var video = document.createElement("video");
		switch ( mime ) {
			case 'video/mp4':
				return video.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
			case 'video/webm':
				return video.canPlayType('video/webm; codecs="vp8.0, vorbis"');
			case 'video/ogg':
				return video.canPlayType('video/ogg; codecs="theora, vorbis"');
		};
	};
	return false;
};

/** 
* Check if browser supports video tag
* @return boolean
*/
o3video.prototype.supports_video = function() {
  return !!document.createElement('video').canPlayType;
};

/** 
* Check flash version in the current web browser
* @return false if no flash installed else the version
*/
o3video.prototype.get_flash_version = function() {			
  // ie
  try {
    try {
      // avoid fp6 minor version lookup issues
      // see: http://blog.deconcept.com/2006/01/11/getvariable-setvariable-crash-internet-explorer-flash-6/
      var axo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash.6');
      try { 
      	axo.AllowScriptAccess = 'always'; 
      } catch(e) { 
      	return '6,0,0'; 
      };
    } catch(e) {};
    return new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version').replace(/\D+/g, ',').match(/^,?(.+),?$/)[1];
  // other browsers
  } catch(e) {
    try {
      if(navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin){
        return (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]).description.replace(/\D+/g, ",").match(/^,?(.+),?$/)[1];
      };
    } catch(e) {};
  };
  return '0,0,0';
};


/** 
* Check jQuery object for property, if not exists return value
* @param string filename Filename
* @return mixed
*/
o3video.prototype.ext2mime = function( filename ) {
	var ext = /(?:\.([^./]+))?$/.exec(filename)[1]; //get file's extension
	ext = typeof ext != 'undefined' ? ext.toLowerCase() : false;
	return ( ext && ext.indexOf( [ 'mp4', 'webm', 'ogg' ] ) ) ? 'video/'+ext : false;
};

/** 
* Check jQuery object for property, if not exists return value
* @param object $ jQuery object
* @param string prop_name Name of the property to search for
* @param mixed value If property not found return this value
* @return mixed
*/
o3video.prototype.get_prop = function( $, prop_name, value ) {
	return $.prop(prop_name) ? $.prop(prop_name) : value;
};	

/** 
* Check jQuery object for attribute, if not exists return value
* @param object $ jQuery object
* @param string attr_name Name of the attribute to search for
* @param mixed value If attribute not found return this value
* @return mixed
*/
o3video.prototype.get_attr = function( $, attr_name, value ) {
	return $.attr(attr_name) ? $.attr(attr_name) : value;
};	
 
//create console if not exist
console = typeof console != 'undefined' ? console : { log: function(){} };

/**
* Chainable jQuery function
*/
if ( typeof jQuery != 'undefined' ) {
	jQuery.fn.o3video = function( opts ) {
		
		//check for containers	
		if ( jQuery(this).length == 0 )
			return console.log('O3 Video: Container must not be empty!') || false;

		//return object with list of o3videos
		var o3video_array = {
			o3videos: new Array(),
			play: function() {
				for (var i = 0;i<this.o3videos.length;i++)
					this.o3videos[i].play();
			},
			pause: function() {
				for (var i = 0;i<this.o3videos.length;i++)
					this.o3videos[i].pause();	
			}
		};

		//create objects
		jQuery(this).each( function() {
			if ( typeof jQuery(this).get(0).o3video == 'undefined' )
				jQuery(this).get(0).o3video = new o3video( opts, this );
			o3video_array.o3videos.push( jQuery(this).get(0).o3video );
		});	
		
		return o3video_array;
	};
} else {
	console.log('O3 Video: jQuery missing!');
};