require('dotenv').config();
const express = require('express');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const sharp = require('sharp');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
app.use(cookieParser());
app.use(express.static('public'));
app.use(cors());

const upload = multer({ dest: 'uploads/' });

const supabaseUrl = 'https://spujdflzaohvsnolwmnx.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const bucketName = 'emoji';
const supabase = createClient(supabaseUrl, supabaseKey);

app.post('/upload', upload.single('file'), async (req, res) => {
    const file = req.file;

    if (!file) {
        return res.status(400).send('No file uploaded.');
    }

    const resizedFilePath = `uploads/resized-${file.filename}${path.extname(file.originalname)}`;

    try {
        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(`public/${file.filename}${path.extname(file.originalname)}`, resizedFilePath);

        if (error) {
            console.error('Error uploading file to Supabase:', error);
            return res.status(500).send('Error uploading file to Supabase.');
        }

        const fileUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${file.filename}${path.extname(file.originalname)}`;
        res.json({ fileUrl });
    } catch (err) {
        console.error('Error processing file:', err);
        res.status(500).send('Internal Server Error');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
