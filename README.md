# Bemojify 😀
Emoji hosting, an attempt to learn storage.

![banner](https://i.imgur.com/DCD5plF.png)

---

## How to Use ❓
Go to [the Bemojify site.](https://codingkatty.github.io/bemojify)

1. Upload a square image by dragging it to the square or selecting it to browse your file explorer.
2. You should see a preview of it. Then, click the blue button to upload.
3. Wait for a few seconds, but if the server is down you may need to wait for it to restart. (≈50 secs)
4. Then, if should appear below. Click on it to copy!

## Idea 💡
I wanted to learn how to use 'storage' on Supabase, so I created this project. Users are able to upload their pictures as emojis, and they can copy the URL, HTML, or README. <img src="https://spujdflzaohvsnolwmnx.supabase.co/storage/v1/object/public/emoji/55d73b00a0bd271692ac692e1feed335.png" alt="emoji" width="28" height="28">

## Functions ⚙️
When it uploads, it sends it to my webservice hosted on Render. It is constantly pinged by UptimeRobot. There, the image is processed by resizing to 128x128 pixels. Then, it is saved Supabase. The filename is then returned so that it will be saved to cookies. The cookies allow easy access to already uploaded emojis. <img src="https://spujdflzaohvsnolwmnx.supabase.co/storage/v1/object/public/emoji/f5945142c1bfc70b0051e8bb7638ad42.png" alt="emoji" width="28" height="28">

## Tech Stack 💻
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

## Future Improvements 💖
The markdown copy thing to be better, as right now, if you copy the markdown it is not resized.
- More responsive
- Better resize features
- More pages (eg. Homepage/Discover)
