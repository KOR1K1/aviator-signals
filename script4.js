import { getHash, getFlightResult2 } from './local-api.js';

document.addEventListener('DOMContentLoaded', () => {
  const isConsideredMobile = () => {
    let check = false;
    (function(a){
        if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|rim)|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n203|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|71|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))
        check = true;
    })(navigator.userAgent||navigator.vendor||window.opera);

    if (!check && /ipad/i.test(navigator.userAgent)) {
        check = true;
    }
    return check;
  };

  const preloader = document.getElementById('preloader');
  const preloaderImage = preloader ? preloader.querySelector('.preloader-image') : null;
  const mainGameContent = document.getElementById('mainGameContent');
  
  const ballContainerElement = document.getElementById("ballContainer");
  const startButtonElement = document.getElementById("startButton"); 
  const backButtonElement = document.getElementById("backButton");

  const preloaderHashDisplayElement = document.getElementById('preloaderHashDisplay');
  const siteHashDisplayElement = document.getElementById('siteSessionHashDisplay'); 

  const statusLoaderOverlay = document.getElementById('statusLoaderOverlay');
  const statusLoaderTitle = document.getElementById('statusLoaderTitle');
  const statusLoaderLogs = document.getElementById('statusLoaderLogs');
  const analysisDisplay = document.getElementById('analysisDisplay'); 
  const statusLoaderMessage = document.getElementById('statusLoaderMessage');
  const statusLoaderCloseButton = document.getElementById('statusLoaderCloseButton');

  const aviaDecorativeImage = document.getElementById('aviaDecorativeImage');
  let aviaInitialLeft = '10px'; 
  let aviaInitialOpacity = '0.8'; 

  if (aviaDecorativeImage) {
      const styles = window.getComputedStyle(aviaDecorativeImage);
      aviaInitialLeft = styles.left;
      aviaInitialOpacity = styles.opacity;
      
      aviaDecorativeImage.style.setProperty('--avia-initial-left', aviaInitialLeft);
      aviaDecorativeImage.style.setProperty('--avia-initial-opacity', aviaInitialOpacity);
  }

  const flightAnalysisSection = document.getElementById('flightAnalysisSection');
  const flightAnalysisTextElement = document.getElementById('flightAnalysisText');
  const flightProgressBarFillElement = document.getElementById('flightProgressBarFill');
  let analysisDotsIntervalId = null;
  let analysisDotCount = 0;

  async function fetchHashFromServer() {
    return getHash();
  }

  function easeInOutQuad(t) { 
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  let generatedHash = "";

  (async () => {
  generatedHash = await fetchHashFromServer();

  if (preloaderHashDisplayElement) {
    preloaderHashDisplayElement.textContent = generatedHash;
  }
  if (siteHashDisplayElement) {
    siteHashDisplayElement.textContent = generatedHash;
  }

  setTimeout(() => {
    if (preloader) {
      if (mainGameContent) mainGameContent.style.display = 'flex';
      if (preloaderImage) { 
        const clonedLogo = preloaderImage.cloneNode(true);
        clonedLogo.id = 'gameLogo';
        clonedLogo.classList.remove('preloader-image');
        const preloaderImgStyles = window.getComputedStyle(preloaderImage);
        clonedLogo.style.width = preloaderImgStyles.width;
        clonedLogo.style.height = preloaderImgStyles.height;
        document.body.appendChild(clonedLogo); 
        clonedLogo.addEventListener('animationend', () => {
          if (ballContainerElement) { 
            ballContainerElement.style.opacity = '1'; 
            ballContainerElement.classList.add('visible'); 
          }
          if (startButtonElement) { 
            startButtonElement.style.display = 'block'; 
            requestAnimationFrame(() => startButtonElement.classList.add('visible'));
          }
          if (backButtonElement) {
            backButtonElement.style.display = 'block';
            requestAnimationFrame(() => backButtonElement.classList.add('visible'));
          }
          if (siteHashDisplayElement) siteHashDisplayElement.classList.add('visible');
        }, { once: true });
        requestAnimationFrame(() => requestAnimationFrame(() => clonedLogo.classList.add('flying')));
      } else { 
        if (siteHashDisplayElement) siteHashDisplayElement.classList.add('visible');
      }
      preloader.style.opacity = '0';
      setTimeout(() => { 
          preloader.classList.add('hidden'); 
          if (!preloaderImage && siteHashDisplayElement && !siteHashDisplayElement.classList.contains('visible')) {
            siteHashDisplayElement.classList.add('visible');
          }
      }, preloaderFadeOutTime);
    } else { 
      if (mainGameContent) mainGameContent.style.display = 'flex';
      if (ballContainerElement) { 
         ballContainerElement.style.opacity = '1';
         ballContainerElement.classList.add('visible');
      }
      if (startButtonElement) {
          startButtonElement.style.display = 'block';
          startButtonElement.classList.add('visible');
      }
      if (backButtonElement) {
          backButtonElement.style.display = 'block';
          backButtonElement.classList.add('visible');
      }
      if (siteHashDisplayElement) siteHashDisplayElement.classList.add('visible');
    }
  }, preloaderDuration);

  })();

  if (preloaderHashDisplayElement) {
    preloaderHashDisplayElement.textContent = generatedHash;
  }
  if (siteHashDisplayElement) {
    siteHashDisplayElement.textContent = generatedHash;
  }
  
  const preloaderDuration = 2500; 
  const preloaderFadeOutTime = 500; 


  const bettingPanel = document.getElementById("bettingPanel");
  const confirmButton = document.getElementById("confirmButton");
  const betDisplay = document.getElementById("betDisplay"); 
  const ballImage = document.getElementById("ball"); 
  const accountIdInput = document.getElementById("accountIdInput"); 
  const idErrorMessage = document.getElementById("idErrorMessage"); 
  
  let accountId = ""; 
  let gameAnimationId = null; 

  function hideFlightAnalysis() {
    if (analysisDotsIntervalId) {
      clearInterval(analysisDotsIntervalId);
      analysisDotsIntervalId = null;
    }
    if (flightAnalysisSection) {
      flightAnalysisSection.classList.remove('visible');
      setTimeout(() => {
        if (flightAnalysisSection && !flightAnalysisSection.classList.contains('visible')) {
          flightAnalysisSection.style.display = 'none';
        }
      }, 400);
    }
    if (flightProgressBarFillElement) flightProgressBarFillElement.style.width = '0%';
    if (flightAnalysisTextElement) flightAnalysisTextElement.textContent = 'Analysis';
  }


  if (startButtonElement) { 
    startButtonElement.addEventListener("click", () => {
      if (bettingPanel) {
        bettingPanel.style.display = "flex";
        setTimeout(() => bettingPanel.classList.add("visible"), 10); 
      }
      startButtonElement.classList.remove('visible'); 
      setTimeout(() => { if (startButtonElement && !startButtonElement.classList.contains('visible')) startButtonElement.style.display = "none"; }, 500); 
      if (backButtonElement) {
        backButtonElement.classList.remove('visible');
        setTimeout(() => { if (backButtonElement && !backButtonElement.classList.contains('visible')) backButtonElement.style.display = "none"; }, 500);
      }
      if (accountIdInput) accountIdInput.value = ""; 
      if (idErrorMessage) { idErrorMessage.style.display = "none"; idErrorMessage.textContent = ""; }
      if (ballContainerElement) ballContainerElement.classList.remove('visible'); 
      if (statusLoaderOverlay) { 
        statusLoaderOverlay.classList.remove('visible');
        setTimeout(() => { if(statusLoaderOverlay && !statusLoaderOverlay.classList.contains('visible')) statusLoaderOverlay.style.display = "none"; }, 300);
      }
      if (aviaDecorativeImage) {
          aviaDecorativeImage.classList.remove('is-flying-away');
          aviaDecorativeImage.style.left = aviaInitialLeft;
          aviaDecorativeImage.style.opacity = aviaInitialOpacity;
      }
      hideFlightAnalysis();
      updateConfirmButtonState();
    });
  }

  function updateConfirmButtonState() {
    if (!accountIdInput || !confirmButton || !idErrorMessage) return; 
    const idValue = accountIdInput.value.trim();
    const onlyFigures = /^\d+$/;
    let isValid = true;
    const genericErrorMessage = "Enter the correct amount"; 
    if (idValue === "") { confirmButton.disabled = true; idErrorMessage.style.display = "none"; idErrorMessage.textContent = ""; return; }
    if (!onlyFigures.test(idValue) || idValue.length < 1 || idValue.length > 9) isValid = false;
    if (isValid) { confirmButton.disabled = false; idErrorMessage.style.display = "none"; idErrorMessage.textContent = ""; }
    else { confirmButton.disabled = true; idErrorMessage.textContent = genericErrorMessage; idErrorMessage.style.display = "block"; }
  }
  
  if (accountIdInput) accountIdInput.addEventListener("input", updateConfirmButtonState); 

  if (confirmButton) { 
    confirmButton.addEventListener("click", async () => { 
      if (confirmButton.disabled) return; 
      if (accountIdInput) accountId = accountIdInput.value.trim(); 
      if (betDisplay) betDisplay.style.opacity = 0; 
      if (bettingPanel) {
        bettingPanel.classList.remove("visible");
        bettingPanel.classList.add("hiding");
        setTimeout(() => { if (bettingPanel) { bettingPanel.style.display = "none"; bettingPanel.classList.remove("hiding");} }, 400); 
      }
      if (startButtonElement) { startButtonElement.classList.remove('visible'); startButtonElement.style.display = 'none'; }
      window.scrollTo(0, 0); 
      
      hideFlightAnalysis();
      await runPreFlightSync(); 
      startGameAnimation(); 
    });
  }

  const MAX_RETRIES = 2; 
  const SUCCESS_CHANCE = 0.75; 

  function quickLog(message, type = "info") {
    if (!statusLoaderLogs) return;
    const p = document.createElement('p');
    p.textContent = message;
    p.className = `log-${type}`;
    statusLoaderLogs.appendChild(p);
    statusLoaderLogs.scrollTop = statusLoaderLogs.scrollHeight;
  }
  
  async function attemptConnection(serviceName) {
    quickLog(`Attempting to connect to ${serviceName}...`, "process");
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300)); 

    for (let i = 0; i <= MAX_RETRIES; i++) {
      if (Math.random() < SUCCESS_CHANCE || i === MAX_RETRIES) { 
        quickLog(`${serviceName}: Connection established.`, "success");
        return true;
      } else {
        quickLog(`${serviceName}: Connection error (attempted ${i + 1})...`, "error");
        if (i < MAX_RETRIES) {
          quickLog(`Reconnecting to ${serviceName}...`, "warning");
          await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 400));
        }
      }
    }
    return false; 
  }

  async function runPreFlightSync() {
    if (!statusLoaderOverlay || !statusLoaderLogs || !statusLoaderMessage || !statusLoaderTitle || !analysisDisplay) return;

    if (statusLoaderTitle) statusLoaderTitle.textContent = "DATA SYNCHRONIZATION";
    statusLoaderLogs.innerHTML = ''; 
    analysisDisplay.innerHTML = ''; 
    statusLoaderMessage.innerHTML = ''; 
    if(statusLoaderCloseButton) statusLoaderCloseButton.style.display = 'none';
    statusLoaderOverlay.style.display = 'flex';
    requestAnimationFrame(() => statusLoaderOverlay.classList.add('visible'));

    quickLog("Module Initialization...", "info");
    await new Promise(resolve => setTimeout(resolve, 300));

    await attemptConnection("BGAMING API");
    await new Promise(resolve => setTimeout(resolve, 100)); 

    await attemptConnection("ai servers GambingGPT");
    await new Promise(resolve => setTimeout(resolve, 100));

    await attemptConnection("AVIAMASTER Gateway");
    await new Promise(resolve => setTimeout(resolve, 300));
    
    quickLog("All systems are synchronized.", "success");
    await new Promise(resolve => setTimeout(resolve, 800)); 

    statusLoaderOverlay.classList.remove('visible');
    await new Promise(resolve => setTimeout(() => {
        if (statusLoaderOverlay && !statusLoaderOverlay.classList.contains('visible')) { 
            statusLoaderOverlay.style.display = "none";
        }
        resolve();
    }, 200)); 
  }

  async function runPostFlightStatus() {
    if (!statusLoaderOverlay || !statusLoaderLogs || !statusLoaderMessage || !statusLoaderTitle || !statusLoaderCloseButton || !analysisDisplay) return;

    if (statusLoaderTitle) statusLoaderTitle.textContent = "FLYING IS OVER";
    statusLoaderLogs.innerHTML = ''; 
    analysisDisplay.innerHTML = ''; 
    statusLoaderMessage.innerHTML = ''; 
    if(statusLoaderCloseButton) statusLoaderCloseButton.style.display = 'none';
    statusLoaderOverlay.style.display = 'flex';
    requestAnimationFrame(() => statusLoaderOverlay.classList.add('visible'));
    
    if (aviaDecorativeImage) {
        aviaDecorativeImage.classList.remove('is-flying-away'); 
        aviaDecorativeImage.style.left = aviaInitialLeft;
        aviaDecorativeImage.style.opacity = aviaInitialOpacity;
    }

    analysisDisplay.textContent = 'Analysis...'; 
    await new Promise(resolve => setTimeout(resolve, 1500)); 

    async function fetchFlightResult(bet) {
      return getFlightResult2(bet).message;
    }
    
    const finalResultMessageText = await fetchFlightResult(accountId || "0");
    statusLoaderMessage.textContent = finalResultMessageText;
    
    if (statusLoaderCloseButton) {
        statusLoaderCloseButton.style.display = 'block'; 
    }
  }

  function animateAnalysisTextDots() {
    analysisDotCount = (analysisDotCount + 1) % 4;
    let dots = "";
    for (let i = 0; i < analysisDotCount; i++) {
      dots += ".";
    }
    if (flightAnalysisTextElement) flightAnalysisTextElement.textContent = "Analysis" + dots;
  }

  function startGameAnimation() {
    if (ballContainerElement && !ballContainerElement.classList.contains('visible')) {
        ballContainerElement.style.opacity = '1'; 
        ballContainerElement.classList.add('visible');
    }
    
    if (aviaDecorativeImage) {
        aviaDecorativeImage.classList.remove('is-flying-away');
        aviaDecorativeImage.style.left = aviaInitialLeft;
        aviaDecorativeImage.style.opacity = aviaInitialOpacity;
        void aviaDecorativeImage.offsetWidth; 
        aviaDecorativeImage.classList.add('is-flying-away');
    }

    if (flightAnalysisSection) {
      flightAnalysisSection.style.display = 'flex';
      requestAnimationFrame(() => flightAnalysisSection.classList.add('visible'));
    }
    if (flightProgressBarFillElement) flightProgressBarFillElement.style.width = '0%';
    if (flightAnalysisTextElement) flightAnalysisTextElement.textContent = 'Analysis';
    analysisDotCount = 0;
    if (analysisDotsIntervalId) clearInterval(analysisDotsIntervalId);
    analysisDotsIntervalId = setInterval(animateAnalysisTextDots, 500);

    let startTime = null;
    const duration = 7000; 
    const amplitudeY = 20; 
    const frequencyY = 0.002; 
    const amplitudeRotate = 5; 
    const frequencyRotate = 0.003; 
    const verticalLiftTarget = -60; 
    const takeOffDuration = 1200;

    function animateFrame(currentTime) {
      if (!startTime) startTime = currentTime;
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      if (elapsedTime < duration) {
        const oscillationY = Math.sin(elapsedTime * frequencyY) * amplitudeY;
        const rotation = Math.sin(elapsedTime * frequencyRotate) * amplitudeRotate;
        
        let currentBaseY;
        if (elapsedTime < takeOffDuration) {
          const takeOffProgress = elapsedTime / takeOffDuration;
          const easedProgress = easeInOutQuad(takeOffProgress); 
          currentBaseY = easedProgress * verticalLiftTarget;
        } else {
          currentBaseY = verticalLiftTarget;
        }
        const finalY = currentBaseY + oscillationY;

        if (ballImage) ballImage.style.transform = `translateY(${finalY}px) rotate(${rotation}deg)`;
        
        if (flightProgressBarFillElement) {
          flightProgressBarFillElement.style.width = `${progress * 100}%`;
        }

        gameAnimationId = requestAnimationFrame(animateFrame);
      } else { 
        if (ballImage) ballImage.style.transform = 'translateY(0px) rotate(0deg)'; 
        if (ballContainerElement) ballContainerElement.classList.remove('visible'); 
        
        if (flightProgressBarFillElement) flightProgressBarFillElement.style.width = '100%';
        if (analysisDotsIntervalId) {
          clearInterval(analysisDotsIntervalId);
          analysisDotsIntervalId = null;
        }
        hideFlightAnalysis(); 
        
        runPostFlightStatus(); 
      }
    }
    gameAnimationId = requestAnimationFrame(animateFrame);
  }

  if (statusLoaderCloseButton) {
    statusLoaderCloseButton.addEventListener("click", () => {
        if (gameAnimationId) {
          cancelAnimationFrame(gameAnimationId);
          gameAnimationId = null;
        }
        
        hideFlightAnalysis();

        if (statusLoaderOverlay) {
            statusLoaderOverlay.classList.remove('visible');
            setTimeout(() => {
                if (statusLoaderOverlay && !statusLoaderOverlay.classList.contains('visible')) { 
                    statusLoaderOverlay.style.display = "none";
                    if (statusLoaderCloseButton) statusLoaderCloseButton.style.display = 'none'; 
                }
            }, 200); 
        }

        if (startButtonElement) {
            startButtonElement.style.display = "block";
            requestAnimationFrame(() => startButtonElement.classList.add('visible'));
        }

        if (backButtonElement) {
          backButtonElement.style.display = "block";
          requestAnimationFrame(() => backButtonElement.classList.add('visible'));
        }

        if (bettingPanel) bettingPanel.style.display = "none";
        if (idErrorMessage) { idErrorMessage.style.display = "none"; idErrorMessage.textContent = ""; }

        if (ballContainerElement) {
            ballContainerElement.style.opacity = '1';
            ballContainerElement.classList.add('visible');
            if (ballImage) ballImage.style.transform = 'translateY(0px) rotate(0deg)';
        }

        if (aviaDecorativeImage) {
            aviaDecorativeImage.classList.remove('is-flying-away');
            aviaDecorativeImage.style.left = aviaInitialLeft;
            aviaDecorativeImage.style.opacity = aviaInitialOpacity;
        }

        accountId = "";
        if (confirmButton) confirmButton.disabled = true;
        if (accountIdInput) accountIdInput.value = ""; 
        if (analysisDisplay) analysisDisplay.innerHTML = ''; 
        if (statusLoaderMessage) statusLoaderMessage.innerHTML = ''; 
    });
  }
});
