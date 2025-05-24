// Video hızını ayarla
function setVideoSpeed(speed) {
  // Tüm video elementlerini bul
  const videos = document.getElementsByTagName('video');
  
  for (let video of videos) {
    try {
      // Temel hız ayarı
      video.playbackRate = speed;
      video.defaultPlaybackRate = speed;

      // Bazı siteler için ek kontroller
      if (video.mozPreservesPitch !== undefined) {
        video.mozPreservesPitch = false;
      }
      if (video.webkitPreservesPitch !== undefined) {
        video.webkitPreservesPitch = false;
      }

      // Video hızı değişikliğini zorla
      video.dispatchEvent(new Event('ratechange'));
    } catch (e) {
      console.log('Video hızı ayarlanamadı:', e);
    }
  }

  // iframe içindeki videoları da kontrol et
  const iframes = document.getElementsByTagName('iframe');
  for (let iframe of iframes) {
    try {
      const iframeVideos = iframe.contentDocument.getElementsByTagName('video');
      for (let video of iframeVideos) {
        video.playbackRate = speed;
        video.defaultPlaybackRate = speed;
      }
    } catch (e) {
      // iframe erişim hatası olabilir, devam et
    }
  }
}

// Sayfa yüklendiğinde varsayılan hızı ayarla
function initializeSpeed() {
  chrome.storage.local.get(['speed'], function(result) {
    if (result.speed) {
      setVideoSpeed(result.speed);
    }
  });
}

// Sayfa yüklendiğinde başlat
document.addEventListener('DOMContentLoaded', initializeSpeed);
window.addEventListener('load', initializeSpeed);

// Her 1 saniyede bir kontrol et
setInterval(initializeSpeed, 1000);

// Yeni video elementleri için gözlemci
const observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.addedNodes) {
      mutation.addedNodes.forEach(function(node) {
        // Sadece element node'larda querySelector kullan
        if (node.nodeName === 'VIDEO' || (node.nodeType === 1 && node.querySelector('video'))) {
          chrome.storage.local.get(['speed'], function(result) {
            if (result.speed) {
              setVideoSpeed(result.speed);
            }
          });
        }
      });
    }
  });
});

// Tüm sayfadaki değişiklikleri izle
observer.observe(document.documentElement, {
  childList: true,
  subtree: true
});

// Popup'tan gelen mesajları dinle
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'setSpeed') {
    setVideoSpeed(request.speed);
    sendResponse({success: true});
  }
  return true;
}); 