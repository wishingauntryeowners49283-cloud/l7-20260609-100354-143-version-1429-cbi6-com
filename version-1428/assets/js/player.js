(function(){
  window.initPlayer=function(streamUrl){
    var video=document.getElementById('video-player');
    if(!video||!streamUrl)return;
    if(video.canPlayType('application/vnd.apple.mpegurl')){
      video.src=streamUrl;
    }else if(window.Hls&&window.Hls.isSupported()){
      var hls=new window.Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
    }
  };
})();