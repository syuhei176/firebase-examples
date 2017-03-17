function initMilkcocoa() {
	function uuid(prefix) {
		var myuuid = localStorage.getItem(prefix+'myuuid');
		if(myuuid) {
			return myuuid
		}else{
			myuuid = new Date().getTime() + Math.floor(Math.random()*100);
			localStorage.setItem(prefix+'myuuid', myuuid);
			return myuuid;
		}
	}

    //1.ミルクココアインスタンスを作成
    var milkcocoa = new Milkcocoa({
    	/*
        uuid: 'client1',
    	host: 'localhost',
    	port: 8000,
    	useSSL: false,
    	appId: 'rkk7Xci9g',
    	apiKey: '9aZUNbC0W75U5AnwQdTK4WeQKiiOvPKfGtD96uRD'
    	*/
    	uuid: uuid('send'),
    	appId: 'ryQ_rnoql',
    	apiKey: 'sVr9NsVchL5TXQgfDJ7gaPLluqZFwmPIoJb_zd_D'
    });
    var channel = location.hash.substr(1) || 'root';
    var ds = milkcocoa.dataStore('video/' + channel);
    milkcocoa.on('open', function() {
        console.log('open!!');
    });
    milkcocoa.on('close', function() {
    	alert('unexpected closed')
    });
    // handle imageupdate event
	$(window).bind("imageupdate", function(e, data){
		// カメラ画像をWebSocketで送信する
		ds.push({d:data});
	});
}

(function(){
	window.VideoCapture = VideoCapture;
	var video = null;

	function VideoCapture(){
		video = document.getElementsByTagName('video')[0];

		navigator.mediaDevices = navigator.mediaDevices || ((navigator.mozGetUserMedia || navigator.webkitGetUserMedia) ? {
		   getUserMedia: function(c) {
		     return new Promise(function(y, n) {
		       (navigator.mozGetUserMedia ||
		        navigator.webkitGetUserMedia).call(navigator, c, y, n);
		     });
		   }
		} : null);
		
		if (navigator.mediaDevices) {
		    var userMedia = navigator.mediaDevices.getUserMedia({ video: { width: 120, height: 200 } }, _startCapture, _error);
			userMedia.then(_startCapture);
			userMedia.catch(_error);
		} else {
		    alert("not support getUserMedia");
		}
	}


	
	var timer = null;

	// start video capture
	function _startCapture(stream){
		video.src = window.URL.createObjectURL(stream);

		timer = setInterval(function(){
			try {
				//draw to canvas
				var cvs = document.createElement('canvas');
				cvs.width = video.width;
				cvs.height = video.height;
				var ctx = cvs.getContext('2d');
				ctx.drawImage(video, 0, 0, 240, 400, 0, 0, video.width, video.height);
				// dataURL
				var data = cvs.toDataURL('image/jpeg');
				$(window).trigger("imageupdate", data);
			} catch(e) {
				_error(e);
			}
		}, 100);
	}	
	
    function _error(error){
        alert("Error: [CODE " + error.code + "]");
		if(timer)
			clearInterval(timer);
    }
})();

$(function(){
	VideoCapture();
	initMilkcocoa();
});


