document.addEventListener('DOMContentLoaded', function() {
  const speedSlider = document.getElementById('speedSlider');
  const speedValue = document.getElementById('speedValue');
  const presetButtons = document.querySelectorAll('.speed-btn');

  // Slider değeri değiştiğinde
  speedSlider.addEventListener('input', function() {
    const speed = parseFloat(this.value);
    speedValue.textContent = speed.toFixed(2);
    setSpeed(speed);
  });

  // Preset butonlarına tıklandığında
  presetButtons.forEach(button => {
    button.addEventListener('click', function() {
      const speed = parseFloat(this.dataset.speed);
      speedSlider.value = speed;
      speedValue.textContent = speed.toFixed(2);
      setSpeed(speed);
    });
  });

  // Hızı ayarla ve kaydet
  function setSpeed(speed) {
    chrome.storage.local.set({ speed: speed });
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'setSpeed',
        speed: speed
      });
    });
  }

  // Sayfa yüklendiğinde mevcut hızı al
  chrome.storage.local.get(['speed'], function(result) {
    if (result.speed) {
      speedSlider.value = result.speed;
      speedValue.textContent = result.speed.toFixed(2);
    }
  });
}); 