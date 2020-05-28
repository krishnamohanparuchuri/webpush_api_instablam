const publicVapidKey =
    'BCmvMP2Pj5h95J6yVnVghsvYz87cx-TvCvnLlSi96Ba_nTf3U9ZQBMeSXKD6g8DolPo1xOHbb55LpzrkL6OOnwY';

//Check for service workers

if ('serviceWorker' in navigator) {
    send().catch(err => console.error(err))
}

// Register service worker, Register push , send push
async function send() {

    //registering the service worker
    console.log('registering service worker...')

    const register = await navigator.serviceWorker.register('serviceworker.js', {
        scope: '/'
    })

    console.log('service worker is registered')

    //register push
    console.log('Registering Push ...')

    const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    })
    console.log('Push Registered...')

    //send push Notification
    console.log('Sending Notification...')

    await fetch('/subscribe', {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    console.log('Push sent....')
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

// Mediaqueries using getUsermedia

let constarintobj = {
    audio: false,
    video: {
        facingmode: 'user',
        width: { max: 400 },
        height: { max: 300 }
    }
}

if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
    navigator.mediaDevices.getUserMedia = function(constarintobj) {
        let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        if (!getUserMedia) {
            return Promise.reject(new Error('getUserMedia is not implemented in this browser'))
        }
        return new Promise(function(resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject)
        })
    }
} else {
    navigator.mediaDevices.enumerateDevices()
        .then(devices => {
            console.log(devices)
            devices.forEach(device => {
                console.log(device.kind.toUpperCase(), device.label);
            })
        })
        .catch(err => {
            console.log(err.name, err.message)
        })
}

navigator.mediaDevices.getUserMedia(constarintobj)
    .then(function(mediaStreamObj) {
        console.log(mediaStreamObj)
        let video = document.querySelector('video');
        if ('srcObject' in video) {
            video.srcObject = mediaStreamObj;
        } else {
            video.src = window.URL.createObjectURL(mediaStreamObj);
        }
        video.onloadedmetadata = function(ev) {
            video.play();
        }

        let start = document.getElementById('btnStart');
        let stop = document.getElementById('btnStop');
        let vidsave = document.getElementById('vid2');
        let capture = document.getElementById('btnCapture')
        let mediaRecorder = new MediaRecorder(mediaStreamObj);
        // let mediaTracks = mediaStreamObj.getVideoTracks();
        // console.log(mediaTracks);
        // console.log(mediaRecorder.mimeType)
        let chunks = [];

        start.addEventListener('click', (ev) => {
            ev.preventDefault();
            mediaRecorder.start();
            console.log(mediaRecorder.state)
        })

        stop.addEventListener('click', (ev) => {
            ev.preventDefault();
            mediaRecorder.stop();
            console.log(mediaRecorder.state)
        })

        capture.addEventListener('click', (ev) => {
            ev.preventDefault();
            captureImage(mediaStreamObj)
        })

        mediaRecorder.ondataavailable = function(ev) {
            chunks.push(ev.data)
        }

        mediaRecorder.onstop = (ev) => {
            let blob = new Blob(chunks, { 'type': 'video/mp4;' });
            console.log(blob);
            chunks = [];
            let videoURL = window.URL.createObjectURL(blob);
            console.log(videoURL);
            vidsave.src = videoURL;
        }
    })
    .catch(function(err) {
        console.log(err.name, err.message)
    })

//capture image function

let imgNew = '';
let canvas = document.querySelector('canvas');


async function captureImage(mediaStreamObj) {
    const mediaTrack = mediaStreamObj.getVideoTracks()[0];
    console.log(mediaTrack);
    const captureImage = new ImageCapture(mediaTrack)
    const photo = await captureImage.takePhoto();
    console.log(photo);
    const imgUrl = URL.createObjectURL(photo);
    console.log(imgUrl)
    imgNew = imgUrl;
    Caman('#photo', imgUrl, function() {
            this.render();
        })
        // let '#photo' = document.querySelector('#photo');

    // applyFilters('#photo', imgUrl)
    // '#photo'.src = imgUrl;

}

//Caman js code
let reset = document.getElementById('resetBtn');
let save = document.getElementById('saveBtn');
let brightnessInc = document.getElementById('brightness-inc')
let brightnessDec = document.getElementById('brightness-dec')
let contrastInc = document.getElementById('contrast-inc')
let contrastDec = document.getElementById('contrast-dec')
let noiseInc = document.getElementById('noise-inc')
let noiseDec = document.getElementById('noise-dec')
let hueInc = document.getElementById('hue-inc')
let hueDec = document.getElementById('hue-dec')
let sepiaInc = document.getElementById('sepia-inc')
let sepiaDec = document.getElementById('sepia-dec')

// async function applyFilters('#photo', imgUrl) {

//     let img = new Image;
//     img.crossOrigin = '';
//     img.src = imgUrl;



// if there is a change in the value of filters

//  document.getElementsByTagName('input[type=range]').change(changeValues);

//  function changeValues() {
//      let hue = parseInt(document.getElementById('#hue').val());
//      let cntrst = parseInt(document.getElementById('#contrast').val());
//      let vibr = parseInt(document.getElementById('#vibrance').val());
//      let sep = parseInt(document.getElementById('#sepia').val());

//      Caman('#photo', img, function() {
//          this.revert(false);
//          this.hue(hue).contrast(cntrst).vibrance(vibr).sepia(sep).render();
//      });
//  }

brightnessInc.addEventListener("click", function(e) {
    console.log('brightnessinc')
    e.preventDefault();
    Caman("#photo", function() {
        this.brightness(10);
        this.render();
        console.log("new brightness");
    });
});

brightnessDec.addEventListener("click", function(e) {
    e.preventDefault();
    Caman('#photo', function() {
        this.brightness(-10).render();
    });
});

contrastInc.addEventListener("click", function(e) {
    e.preventDefault();
    Caman('#photo', function() {
        this.contrast(10).render();
    });
});

contrastDec.addEventListener("click", function(e) {
    e.preventDefault();
    Caman('#photo', function() {
        this.contrast(-10).render();
    });
});


noiseInc.addEventListener("click", function(e) {
    e.preventDefault();
    Caman('#photo', function() {
        this.noise(10).render();
    });
});

noiseDec.addEventListener("click", function(e) {
    e.preventDefault();
    Caman('#photo', function() {
        this.noise(-10).render();
    });
});



sepiaInc.addEventListener("click", function(e) {
    e.preventDefault();
    Caman('#photo', function() {
        this.sepia(20).render();
    });
});

sepiaDec.addEventListener("click", function(e) {
    e.preventDefault();
    Caman('#photo', function() {
        this.sepia(-20).render();
    });
});

hueInc.addEventListener("click", function(e) {
    e.preventDefault();
    Caman('#photo', function() {
        this.hue(10).render();
    });
});

hueDec.addEventListener("click", function(e) {
    e.preventDefault();
    Caman('#photo', function() {
        this.hue(-10).render();
    });
});

// save.addEventListener('click', function(e) {
//     e.preventDefault();
//     Caman('#photo', function() {
//         this.render(function() {
//             this.save('png');
//         });
//     });
// });

save.addEventListener('click', downloadFile)


//Create donwload link if user is online.
function downloadFile() {
    save.href = canvas
        .toDataURL("image/jpeg")
        .replace("image/jpeg", "image/octet-stream");
    if (!navigator.onLine) {
        save.href = "#filters";
        save.removeAttribute("download");
        console.log("Disable download");
    } else {
        save.download = "image.png";
        console.log("Enable download");
    }
}

//  document.getElementById("#blur-inc").addEventListener("click", function(e) {
//      Caman('#photo', img, function() {
//          this.stackBlur(5).render();
//      });
//  });

//  document.getElementById("#gamma-inc").addEventListener("click", function(e) {
//      Caman('#photo', img, function() {
//          this.gamma(0.1).render();
//      });
//  });

//  document.getElementById("#clip-inc").addEventListener("click", function(e) {
//      Caman('#photo', img, function() {
//          this.clip(10).render();
//      });
//  });

// }