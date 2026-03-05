# Juvelle — Deployment Guide

**Backend** → [Vercel](https://vercel.com) (serverless Node.js, always-on)
**Frontend** → [Vercel](https://vercel.com) (static Vite/React)
**Images** → [Cloudinary](https://cloudinary.com) _(to be set up separately)_

---

## Prerequisites

- A [Vercel account](https://vercel.com/signup) (free tier)
- Project pushed to a **GitHub repository**
- MongoDB Atlas cluster running

---

## Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin <repo_git_url>
git push -u origin main
```

> `.env` files are in `.gitignore`. Never commit secrets.

---

## Part A — Deploy the Backend on Vercel

### Step 2 — Add `vercel.json` to the backend

Create `backend/vercel.json`:

```json
{
  "version": 2,
  "builds": [{ "src": "server.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "server.js" }]
}
```

Commit and push:

```bash
git add backend/vercel.json
git commit -m "add vercel config for backend"
git push
```

### Step 3 — Import the backend on Vercel

1. Go to [vercel.com/new](https://vercel.com/new) → **Import Git Repository**
2. Select your `juvelle` repository
3. Set **Root Directory** to `backend`
4. Framework Preset: **Other**
5. Build Command: _(leave blank)_
6. Output Directory: _(leave blank)_
7. Before clicking Deploy, go to **Environment Variables** and add:

| Variable        | Value                                                              |
| --------------- | ------------------------------------------------------------------ |
| `MONGODB_URI`   | your full Atlas connection string                                  |
| `JWT_SECRET`    | your secret key                                                    |
| `NODE_ENV`      | `production`                                                       |
| `CLIENT_ORIGIN` | _(your frontend Vercel URL — add after Step 6, no trailing slash)_ |

8. Click **Deploy**

### Step 4 — Note your Backend URL

Copy the URL from your Vercel backend project dashboard:

```
https://juvelle-backend.vercel.app
```

You will need this in Step 6.

---

## Part B — Deploy the Frontend on Vercel

### Step 5 — Add `vercel.json` for SPA routing

Without this, refreshing any route (e.g. `/store`) returns a 404.

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

### Step 6 — Import the frontend on Vercel

1. Go to [vercel.com/new](https://vercel.com/new) → import the same repo again
2. Set **Root Directory** to `frontend`
3. Framework Preset: **Vite** (auto-detected)
4. Before clicking Deploy, add **Environment Variables**:

| Variable       | Value                                                                 |
| -------------- | --------------------------------------------------------------------- |
| `VITE_API_URL` | `https://juvelle-backend.vercel.app` (from Step 4, no trailing slash) |

5. Click **Deploy**

### Step 7 — Update `CLIENT_ORIGIN` on the Backend

Go to your **backend** Vercel project → **Settings → Environment Variables** and set:

| Variable        | Value                                                                       |
| --------------- | --------------------------------------------------------------------------- |
| `CLIENT_ORIGIN` | `https://juvellestore.vercel.app` _(exact frontend URL, no trailing slash)_ |

Then go to **Deployments → Redeploy** (uncheck "Use existing Build Cache").

---

## MongoDB Atlas — Allow All IPs

Vercel's serverless IPs change constantly, so allow all connections:

1. Atlas → **Network Access** → **Add IP Address**
2. Select **"Allow Access from Anywhere"** (`0.0.0.0/0`)

---

## ⚠️ Image Uploads — Cloudinary Required

Vercel is stateless — files saved to disk (`/uploads`) are lost after each function call. You **must** use Cloudinary for product image storage. See the Cloudinary setup guide when ready.

---

## Final Checklist

- [ ] `backend/vercel.json` created and pushed
- [ ] `frontend/vercel.json` created and pushed
- [ ] Backend deployed on Vercel with all env vars set
- [ ] Frontend deployed on Vercel with `VITE_API_URL` pointing to backend
- [ ] `CLIENT_ORIGIN` on backend updated to frontend URL (**no trailing slash**)
- [ ] Atlas Network Access set to `0.0.0.0/0`
- [ ] _(Later)_ Cloudinary set up for image uploads
