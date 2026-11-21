# 💌 The Ultimate "I'm Sorry" Apology Website (Snapchat Edition) 👻💛

A cute, interactive, heartfelt apology website designed to win back your girlfriend's heart after leaving her Snap messages unanswered.

---

## ✨ Features

- **🚨 Snapchat Style Priority Alert**: Playful and funny "Case #69" notification banner.
- **👻 Cute Animated Snapchat Mascot**: Floating ghost holding a sweet flower with animated teardrops and beating heart.
- **💌 Interactive Envelope & Letter**: Tap to open a genuine apology letter with a wax seal animation and promises.
- **🎮 The Runaway "No" Button Game**: She literally cannot click "No" — it playfully teleports away while the "YES" button gets bigger and bigger!
- **🎉 Grand Confetti Explosion & Celebration**: Fireworks and victory modal when she clicks "YES".
- **🎟️ 4 Redeemable Peace Offering Coupons**:
  - TeaPost Date
  - Unlimited Cuddles & Massages
  - Dinner at Lord's
  - "I Was Right All Along" Trump Card
- **🎵 Built-in Cute Audio Synthesizer**: Delightful sound effects using the Web Audio API (100% standalone, no external audio files that could fail to load).
- **💖 Customizable via URL**: Simply add `?her=Name&him=YourName` to customize the names on the fly without touching any code!

---

## 🚀 How to Host on GitHub Pages (Takes 2 Minutes)

### Option 1: Using GitHub Desktop or the GitHub Website (Easiest)

1. Go to [GitHub.com](https://github.com) and log in.
2. Click the **`+`** (plus icon) at the top right and select **New repository**.
3. Name your repository (e.g., `sorry-baby` or `for-you`).
4. Set it to **Public** and click **Create repository**.
5. Click **"uploading an existing file"** on the quick setup page.
6. Drag and drop all the files from this folder (`index.html`, `style.css`, `script.js`, `README.md`) and click **Commit changes**.
7. Go to **Settings** > **Pages** (on the left sidebar).
8. Under **Branch**, select `main` (or `master`) and folder `/ (root)`, then click **Save**.
9. In about 30 seconds, your site will be live at:
   ```
   https://<your-username>.github.io/<your-repo-name>/
   ```
10. Send her the link! (You can even append her name: `https://<your-username>.github.io/<your-repo-name>/?her=Sara&him=Alex`)

---

### Option 2: Using the Command Line (Git)

In your terminal / PowerShell in this directory:

```bash
# 1. Initialize git if not already done
git init
git add .
git commit -m "Forgive me please 🥺"
git branch -M main

# 2. Add your GitHub remote (replace with your repo URL)
git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git

# 3. Push to GitHub
git push -u origin main
```

Then in your GitHub repo settings:
- Go to **Settings** > **Pages**
- Source: Deploy from branch `main` / `root`
- Click **Save**

---

Made with love to fix the snap streak! 👻💛
