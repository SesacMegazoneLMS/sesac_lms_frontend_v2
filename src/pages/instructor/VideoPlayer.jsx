import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

const VideoPlayer = ({ src }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    let hls;

    if (videoRef.current) {
      if (Hls.isSupported()) {
        hls = new Hls({
          debug: true,
          xhrSetup: function (xhr) {
            xhr.withCredentials = false;
          }
        });

        hls.loadSource(src);
        hls.attachMedia(videoRef.current);

        hls.on(Hls.Events.ERROR, function (event, data) {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.log('네트워크 에러:', data);
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.log('미디어 에러:', data);
                hls.recoverMediaError();
                break;
              default:
                console.log('치명적인 에러:', data);
                hls.destroy();
                break;
            }
          }
        });

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log('매니페스트 파싱 완료');
          videoRef.current.play().catch(error => {
            console.log("재생 실패:", error);
          });
        });
      }
      // Safari 대응
      else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        videoRef.current.src = src;
      }
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [src]);

  return (
    <div>
      <video
        ref={videoRef}
        controls
        style={{ width: '100%', maxWidth: '800px' }}
        playsInline
        crossOrigin="anonymous"
      />
    </div>
  );
};

export default VideoPlayer;