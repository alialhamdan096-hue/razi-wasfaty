# صيدلية الرازي — Netlify Forms + إشعار بريد + داشبورد

## ماذا تفعل هذه الحزمة؟
- `index.html` نموذج يرسل إلى **Netlify Forms** (مركزي).
- **Netlify Form Notifications**: فعّل بريد إشعار لكل طلب جديد.
- `admin.html` داشبورد خاص يسحب الطلبات من **Function** ويحدَّث كل 10 ثوانٍ مع **صوت** عند وصول جديد.
- `netlify/functions/list-submissions.js` دالة تستدعي **Netlify API** لإرجاع الطلبات بشكل آمن (التوكن محفوظ كسري).
- `netlify.toml` يعرّف مسار الدوال.

## النشر (Netlify Drop أو ربط GitHub)
1) ارفع المجلد كامل إلى Netlify (Drop أو من GitHub).
2) بعد أول نشر، ادخل Site settings:
   - **Forms →** تأكد ظهور نموذج باسم `orders`. (docs: Forms setup) 
   - **Forms → Notifications →** أضف بريدك لإشعارات فورية.
   - **Site settings → General → Site details → API ID** وانسخ **Site ID**.
   - **Site settings → Environment variables**:
     - `NETLIFY_ACCESS_TOKEN` (أنشئه من حسابك: Applications → Personal access tokens).
     - `NETLIFY_SITE_ID` (الـ API ID الذي نسخته).
     - (اختياري) `FORM_NAME` = `orders`.
   - أعد النشر (Deploy) ليقرأ المتغيرات.

3) الروابط:
   - الصفحة العامة: `/` (index.html)
   - الداشبورد الخاص: `/admin.html` (لا تربطه علنًا)

## ملاحظات
- البريد يُفعّل من **Forms → Notifications** (Email/Webhook/Slack).
- الداشبورد لا يظهر أي شيء حتى تأتي أول **Submission** ويُنشأ النموذج تلقائيًا.