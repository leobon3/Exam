// DOM elements
const instructionPage = document.getElementById('instructionPage');
const namePage = document.getElementById('namePage');
const recordingPage = document.getElementById('recordingPage');
const nextToNameBtn = document.getElementById('nextToNameBtn');
const startRecordingBtn = document.getElementById('startRecordingBtn');
const stopRecordingBtn = document.getElementById('stopRecordingBtn');
const userNameInput = document.getElementById('userName');
const countdownElement = document.getElementById('countdown');
const recordingResult = document.getElementById('recordingResult');
const progressBar = document.getElementById('progressBar');
const recordingStatusText = document.getElementById('recordingStatusText');
const downloadLink = document.getElementById('downloadLink');

// Variables
let mediaRecorder;
let audioChunks = [];
let countdown;
let timeLeft = 60;
const totalTime = 60;

// Navigation
nextToNameBtn.addEventListener('click', () => {
    instructionPage.classList.remove('active');
    namePage.classList.add('active');
});

startRecordingBtn.addEventListener('click', () => {
    if (!userNameInput.value.trim()) {
        alert('Please enter your name');
        return;
    }
    
    namePage.classList.remove('active');
    recordingPage.classList.add('active');
    
    // Start recording automatically when page loads
    setTimeout(startRecording, 500);
});

// Stop recording button
stopRecordingBtn.addEventListener('click', () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        clearInterval(countdown);
        recordingStatusText.textContent = 'Recording stopped';
        document.querySelector('.recording-indicator').style.animation = 'none';
        document.querySelector('.recording-indicator').style.backgroundColor = '#6c757d';
    }
});

// Recording functions
async function startRecording() {
    try {
        audioChunks = []; // Reset chunks
        timeLeft = totalTime; // Reset timer
        countdownElement.textContent = timeLeft;
        progressBar.style.width = '0%';
        recordingResult.style.display = 'none';
        downloadLink.style.display = 'none';
        
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        
        mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
        };
        
        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            saveRecording(audioBlob);
            stream.getTracks().forEach(track => track.stop());
        };
        
        mediaRecorder.start();
        startCountdown();
    } catch (error) {
        recordingResult.innerHTML = `<p>Error: ${error.message}</p>`;
        recordingResult.style.display = 'block';
        console.error('Recording error:', error);
    }
}

function startCountdown() {
    countdown = setInterval(() => {
        timeLeft--;
        countdownElement.textContent = timeLeft;
        
        // Update progress bar
        const progressPercentage = ((totalTime - timeLeft) / totalTime) * 100;
        progressBar.style.width = `${progressPercentage}%`;
        
        if (timeLeft <= 0) {
            clearInterval(countdown);
            mediaRecorder.stop();
            recordingStatusText.textContent = 'Recording completed';
            document.querySelector('.recording-indicator').style.animation = 'none';
            document.querySelector('.recording-indicator').style.backgroundColor = '#4cc9f0';
        }
    }, 1000);
}

function saveRecording(audioBlob) {
    const fileName = `${userNameInput.value.trim().replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 19)}.wav`;
    
    // For demo purposes, create a download link
    const audioUrl = URL.createObjectURL(audioBlob);
    downloadLink.href = audioUrl;
    downloadLink.download = fileName;
    
    recordingResult.style.display = 'block';
    downloadLink.style.display = 'inline';
    
    console.log('Simulated upload to Google Drive:', {
        fileName: fileName,
        size: (audioBlob.size / 1024 / 1024).toFixed(2) + ' MB',
        type: audioBlob.type
    });
    
    // In a real implementation, you would upload to Google Drive here
    // uploadToDrive(audioBlob, fileName);
}
// Add this to your existing DOM elements selection
const homeBtn = document.getElementById('homeBtn');

// Add this function to handle home button click
function goHome() {
    // Stop any ongoing recording
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        clearInterval(countdown);
    }
    
    // Hide all pages
    instructionPage.classList.remove('active');
    namePage.classList.remove('active');
    recordingPage.classList.remove('active');
    
    // Show instruction page
    instructionPage.classList.add('active');
    
    // Hide home button on home page
    homeBtn.style.display = 'none';
    
    // Reset form
    userNameInput.value = '';
}

// Add event listener for home button
homeBtn.addEventListener('click', goHome);

// Modify your existing navigation functions to show home button when leaving instruction page
nextToNameBtn.addEventListener('click', () => {
    instructionPage.classList.remove('active');
    namePage.classList.add('active');
    homeBtn.style.display = 'flex'; // Show home button
});

startRecordingBtn.addEventListener('click', () => {
    if (!userNameInput.value.trim()) {
        alert('Please enter your name');
        return;
    }
    
    namePage.classList.remove('active');
    recordingPage.classList.add('active');
    homeBtn.style.display = 'flex'; // Keep home button visible
    
    setTimeout(startRecording, 500);
});