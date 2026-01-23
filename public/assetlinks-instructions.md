# Digital Asset Links Setup Instructions

## Overview
Digital Asset Links verify domain ownership for Trusted Web Activities (TWA), enabling a true app-like experience without browser UI on Android.

## Steps to Complete Setup

### 1. Generate Your Android App
Use [PWABuilder](https://www.pwabuilder.com/) to generate your Android app package:
- Visit https://www.pwabuilder.com/
- Enter your PWA URL
- Click "Build My PWA"
- Select Android platform
- Download the generated package

### 2. Get Your App's SHA-256 Fingerprint

#### Option A: From PWABuilder
PWABuilder will show your SHA-256 fingerprint in the download package.

#### Option B: Generate Manually
If you have your signing key, run:
```bash
keytool -list -v -keystore YOUR_KEYSTORE.keystore -alias YOUR_ALIAS
```

Look for the SHA-256 fingerprint in the output (format: AA:BB:CC:DD:...)

### 3. Update assetlinks.json

Replace the placeholders in `/public/.well-known/assetlinks.json`:

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.yourcompany.expensetracker",
      "sha256_cert_fingerprints": [
        "AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99"
      ]
    }
  }
]
```

**Replace:**
- `YOUR_PACKAGE_NAME` → Your Android package name (e.g., `com.yourcompany.expensetracker`)
- `YOUR_SHA256_FINGERPRINT` → Your actual SHA-256 fingerprint (with colons)

### 4. Deploy to Your Server

The `assetlinks.json` file MUST be accessible at:
```
https://yourdomain.com/.well-known/assetlinks.json
```

**Important:**
- File must be served over HTTPS
- Content-Type must be `application/json`
- File must be publicly accessible (no authentication)
- No redirects or caching headers that prevent access

### 5. Verify Your Setup

Test your Digital Asset Links:
1. Visit: https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://yourdomain.com&relation=delegate_permission/common.handle_all_urls

2. Or use the Statement List Generator:
   https://developers.google.com/digital-asset-links/tools/generator

### 6. Update Your Android App

In your Android app (from PWABuilder), ensure the following is in `AndroidManifest.xml`:

```xml
<intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="https"
          android:host="yourdomain.com" />
</intent-filter>
```

### 7. Testing

After deployment:
1. Install the Android app on your device
2. Clear Chrome's cache
3. Open the app - the address bar should no longer appear

## Troubleshooting

### Address bar still showing?
- Verify assetlinks.json is accessible at the correct URL
- Check that package name and fingerprint match exactly
- Wait a few minutes for Google to cache the verification
- Clear Chrome app data on Android

### File not accessible?
- Ensure `.well-known` directory is not blocked by server config
- Check CORS and HTTPS are properly configured
- Verify no authentication is required

## Additional Resources
- [Android App Links Documentation](https://developer.android.com/training/app-links/verify-android-applinks)
- [PWABuilder Documentation](https://docs.pwabuilder.com/)
- [Digital Asset Links Guide](https://developers.google.com/digital-asset-links/v1/getting-started)
