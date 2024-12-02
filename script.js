document.getElementById("uploadButton").addEventListener("click", async function () {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a file to upload.");
        return;
    }

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
            document.cookie = `fileUrl=${fileUrl}; path=/; max-age=31536000`; // 1 year expiry
            addEmojiToGrid(fileUrl);
            resetUploadForm();
        } else {
            alert("Failed to upload file.");
        }
    } catch (error) {
        console.error("Error uploading file:", error);
        alert("Error uploading file.");
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

function loadPreviousEmojis() {
    const cookies = document.cookie.split(';');
    const emojiGrid = document.getElementById('emoji-grid');
    emojiGrid.innerHTML = '';
    
    cookies.forEach(cookie => {
        if (cookie.trim().startsWith('fileUrl=')) {
            const fileUrl = cookie.split('=')[1];
            addEmojiToGrid(fileUrl);
        }
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
    document.getElementById('preview').style.display = 'none';
    document.getElementById('drop-text').style.display = 'block';
    document.getElementById('uploadButton').disabled = true;
    document.getElementById('fileInput').value = '';
}

document.getElementById('format-popup').addEventListener('click', function(e) {
    if (e.target === this) {
        this.style.display = 'none';
    }
});

document.addEventListener('DOMContentLoaded', loadPreviousEmojis);
