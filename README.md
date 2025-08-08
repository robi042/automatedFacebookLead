# automatedFacebookLead---

## 🧩 Facebook App Setup — Step by Step

### 🟠 1. Create a Facebook App

1. Go to: [https://developers.facebook.com/apps](https://developers.facebook.com/apps)
2. Click **Create App**
3. Select **Consumer** as the app type
4. Enter your app name (e.g., "Lead Capture App")
5. Skip Business Manager for now (unless required)
6. Click **Create App**

---

### 🟢 2. Add Webhook Product to App

1. Inside your App Dashboard → Left Sidebar → **Add Product**
2. Find **Webhooks**, click **Set Up**
3. Click **Add Callback URL**

#### ➕ Add Callback URL:

| Field              | Value                                  |
|-------------------|----------------------------------------|
| Callback URL       | `https://yourdomain.com/facebook/webhook` |
| Verify Token       | Same as `FB_VERIFY_TOKEN` in `.env` file |

4. Click **Verify and Save**

✅ If your GET `/facebook/webhook` route is implemented correctly, Facebook will hit your server to verify the token and show “Verified”.

---

### 🟣 3. Subscribe to `leadgen` Webhook Events

1. Still inside **Webhooks** settings
2. Under **Page** object → Click **Subscribe to Fields**
3. Select `leadgen` field and save

---

### 🟡 4. Generate & Use Page Access Token

1. Go to: [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Select your app from the dropdown
3. Click **Get Token** → **Get Page Access Token**
4. Choose your Page → Allow necessary permissions:
   - `pages_manage_ads`
   - `pages_read_engagement`
   - `leads_retrieval`

✅ Copy the generated token and paste into `.env`:
```env
FB_ACCESS_TOKEN=EAAB...

🔴 5. Connect Facebook Page to Your App
From your App Dashboard → Settings > Advanced

Under App Restrictions → Set to Public (if testing with other users)

Go to App Review → Permissions and Features

Request these permissions if deploying publicly:

pages_manage_ads

leads_retrieval

pages_read_engagement

For development/testing with your own Page, these may work without submission.

🟩 6. Make Your App Live
In the left sidebar, click App Review

Click the toggle on top to make your app Live

Confirm by clicking “Switch Mode”

🚨 Note: After going Live, only permitted users or reviewers can interact unless your app is approved through Facebook’s App Review process.

🔗 Summary of Key URLs
Step	URL
Facebook Developer	https://developers.facebook.com/
Graph API Explorer	https://developers.facebook.com/tools/explorer/
Webhook Callback	https://yourdomain.com/facebook/webhook
Ngrok (local test)	https://ngrok.com

### ✅ Final Tips

- Always use a **public HTTPS** URL for webhook. For local testing:  
  ```bash
  ngrok http 3000
Make sure your GET /facebook/webhook route returns the challenge when verification request comes in.

Facebook will retry failed webhooks several times, so handle errors properly.