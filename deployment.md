# Juvelle — Deployment Guide

**Backend** → [Render](https://render.com) (persistent Node.js server) and
**Frontend** → [Vercel](https://vercel.com) (static Vite/React)

---

## Prerequisites

- A [Render account](https://render.com) (free tier works)
- A [Vercel account](https://vercel.com/signup) (free tier works)
- The project pushed to a **GitHub repository**
- Your MongoDB Atlas cluster already running

---

## Step 1 — Push to GitHub

```bash
# From the root juvelle/ folder
git init
git add .
git commit -m "initial commit"
git remote add origin <repo_git_url>
git push -u origin main
```

> `.env` files are already in `.gitignore`. Never commit secrets.

---

## Part A — Deploy the Backend on Render

Render runs your Express server as a persistent process, which means file uploads and long-running connections work as expected.

### Step 2 — Create a New Web Service on Render

1. Go to [dashboard.render.com](https://dashboard.render.com) → **New +** → **Web Service**
2. Connect your GitHub account and select the `juvelle` repository
3. Configure the service:

| Setting            | Value                           |
| ------------------ | ------------------------------- |
| **Name**           | `juvelle-backend` (or any name) |
| **Root Directory** | `backend`                       |
| **Runtime**        | `Node`                          |
| **Build Command**  | `npm install`                   |
| **Start Command**  | `npm start`                     |
| **Instance Type**  | Free                            |

4. Click **Create Web Service**

### Step 3 — Set Backend Environment Variables on Render

On the service page, go to **Environment** and add:

| Variable        | Value                                           |
| --------------- | ----------------------------------------------- |
| `MONGODB_URI`   | `mongodb+srv://:...` (your full Atlas URI)      |
| `JWT_SECRET`    | `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`              |
| `NODE_ENV`      | `production`                                    |
| `CLIENT_ORIGIN` | _(your frontend Vercel URL — add after Step 7)_ |

Render will automatically redeploy when you save env vars.

### Step 4 — Note your Backend URL

After the deploy succeeds, copy the URL from the top of the service page. It will look like:

```
https://juvelle-backend.onrender.com
```

You will need this in Step 6.

> **Free tier note**: Render's free plan spins down the service after 15 minutes of inactivity. The first request after sleep takes ~30 seconds to wake up. Upgrade to a paid plan to avoid this.

---

## Part B — Deploy the Frontend on Vercel

### Step 5 — Add `vercel.json` for SPA Routing

Without this, refreshing any page (e.g. `/store`, `/product/123`) returns a 404 because Vercel doesn't know to serve `index.html` for client-side routes.

Create `frontend/vercel.json`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Commit and push:

```bash
git add frontend/vercel.json
git commit -m "add vercel SPA rewrite for frontend"
git push
```

### Step 6 — Import the Frontend on Vercel

1. Go to [vercel.com/new](https://vercel.com/new) → **Import Git Repository**
2. Select your `juvelle` repository
3. Set the **Root Directory** to `frontend`
4. Framework Preset: **Vite** (auto-detected)
5. Build Command: `npm run build` _(auto-filled)_
6. Output Directory: `dist` _(auto-filled)_
7. Before clicking Deploy, go to **Environment Variables** and add:

| Variable       | Value                                                                 |
| -------------- | --------------------------------------------------------------------- |
| `VITE_API_URL` | `https://juvelle-backend.onrender.com` (your backend URL from Step 4) |

> Variable names **must** start with `VITE_` to be exposed by Vite at build time.

8. Click **Deploy**

### Step 7 — Update `CLIENT_ORIGIN` on Render

Now that the frontend URL is known, go back to your **Render** service → **Environment** and update:

| Variable        | Value                                                     |
| --------------- | --------------------------------------------------------- |
| `CLIENT_ORIGIN` | `https://juvelle.vercel.app` _(your actual frontend URL)_ |

Render will redeploy automatically so CORS allows requests from your frontend.

---

## MongoDB Atlas — Allow All IPs

Since Render's IPs can change, allow connections from anywhere in Atlas:

1. Go to Atlas → **Network Access** → **Add IP Address**
2. Select **"Allow Access from Anywhere"** (`0.0.0.0/0`)

---

## Final Checklist

- Project pushed to GitHub
- `frontend/vercel.json` created and pushed
- Backend deployed on Render with all env vars set
- Frontend deployed on Vercel with `VITE_API_URL` pointing to Render backend
- `CLIENT_ORIGIN` on Render updated to frontend Vercel URL
- Atlas Network Access set to `0.0.0.0/0`
