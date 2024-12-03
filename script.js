const STORAGE_BASE_URL = 'https://spujdflzaohvsnolwmnx.supabase.co/storage/v1/object/public/emoji/';

function getNextCookieNumber() {
    let maxNum = 0;
    document.cookie.split(';').forEach(cookie => {
        const match = cookie.trim().match(/fileUrl(\d+)=/);
        if (match) {
            maxNum = Math.max(maxNum, parseInt(match[1]));
        }
    });
    return maxNum + 1;
}

function storeEmoji(filename) {
    const nextNum = getNextCookieNumber();
    document.cookie = `fileUrl${nextNum}=${filename}; path=/; max-age=31536000`;
}

function loadPreviousEmojis() {
    const emojiGrid = document.getElementById('emoji-grid');
    emojiGrid.innerHTML = '';

    document.cookie.split(';').forEach(cookie => {
        const trimmedCookie = cookie.trim();
        if (trimmedCookie.startsWith('fileUrl')) {
            const filename = trimmedCookie.split('=')[1];
            if (filename) {
                const fullUrl = STORAGE_BASE_URL + filename;
                addEmojiToGrid(fullUrl);
            }
        }
    });
}

document.getElementById("uploadButton").addEventListener("click", async function () {
    const button = this; // Store button reference
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a file to upload.");
        return;
    }

    // Disable button and show loading state
    button.disabled = true;
    button.textContent = 'Uploading...';

    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch("https://bemojify.onrender.com/upload", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            const result = await response.json();
            const fileUrl = result.fileUrl;
            const filename = fileUrl.split('/').pop(); // Get just the filename
            storeEmoji(filename);
            addEmojiToGrid(fileUrl);
            resetUploadForm();
        } else {
            alert("Failed to upload file.");
        }
    } catch (error) {
        console.error("Error uploading file:", error);
        alert("Error uploading file.");
    } finally {
        button.textContent = 'Upload Emoji';
    }
});

const dropZone = document.getElementById("drop-zone");

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, unhighlight, false);
});

function highlight(e) {
    dropZone.classList.add('dragover');
}

function unhighlight(e) {
    dropZone.classList.remove('dragover');
}

dropZone.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
    const dt = e.dataTransfer;
    const file = dt.files[0];
    const fileInput = document.getElementById("fileInput");
    fileInput.files = dt.files;
    handlePreview(file);
}

document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    handlePreview(file);
});

function handlePreview(file) {
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('preview');
            preview.src = e.target.result;
            preview.style.display = 'block';
            document.getElementById('drop-text').style.display = 'none';
            document.getElementById('uploadButton').disabled = false;
        }
        reader.readAsDataURL(file);
    }
}

function showFormatPopup(fileUrl) {
    const popup = document.getElementById('format-popup');
    popup.style.display = 'flex';
    
    const buttons = popup.querySelectorAll('button');
    buttons.forEach(button => {
        button.onclick = () => {
            const format = button.dataset.format;
            let copyText;
            switch(format) {
                case '2':
                    copyText = `<img src="${fileUrl}" alt="emoji" width="24" height="24">`;
                    break;
                case '3':
                    copyText = `![emoji](${fileUrl})`;
                    break;
                default:
                    copyText = fileUrl;
            }
            navigator.clipboard.writeText(copyText);
            document.getElementById('copy-success').style.display = 'block';
            setTimeout(() => {
                popup.style.display = 'none';
                document.getElementById('copy-success').style.display = 'none';
            }, 1500);
        };
    });
}

function addEmojiToGrid(fileUrl) {
    const img = document.createElement('img');
    img.src = fileUrl;
    img.alt = 'emoji';
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => showFormatPopup(fileUrl));
    document.getElementById('emoji-grid').appendChild(img);
}

function resetUploadForm() {
    const preview = document.getElementById('preview');
    const dropText = document.getElementById('drop-text');
    const uploadButton = document.getElementById('uploadButton');
    const fileInput = document.getElementById('fileInput');

    preview.style.display = 'none';
    dropText.style.display = 'block';
    uploadButton.disabled = true;
    fileInput.value = '';
}

document.getElementById('format-popup').addEventListener('click', function(e) {
    if (e.target === this) {
        this.style.display = 'none';
    }
});

document.addEventListener('DOMContentLoaded', loadPreviousEmojis);
