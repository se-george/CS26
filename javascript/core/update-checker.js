import { GITHUB_USER, REPO_NAME } from './config.js';

// رقم الإصدار الحالي لتطبيقك (يمكنك تحديثه مع كل نسخة APK جديدة)
const CURRENT_VERSION = "v1.0.0"; 

export async function checkForUpdates() {
    const updateStatusEl = document.getElementById('update-status-text');
    if (updateStatusEl) updateStatusEl.textContent = 'جاري التحقق من وجود تحديثات...';

    try {
        // جلب أحدث Release من مستودع جيت هاب
        const response = `https://api.github.com/repos/${GITHUB_USER}/${REPO_NAME}/releases/latest`;
        const res = await fetch(response);
        
        if (!res.ok) {
            throw new Error('فشل الاتصال بخادم التحديثات');
        }

        const data = await res.json();
        const latestVersion = data.tag_name; // مثال: v1.0.1
        const downloadUrl = data.assets[0]?.browser_download_url; // رابط تحميل ملف الـ APK مباشرة

        console.log(`الإصدار الحالي: ${CURRENT_VERSION} | أحدث إصدار على جيت هاب: ${latestVersion}`);

        if (latestVersion !== CURRENT_VERSION) {
            // لو فيه تحديث جديد متاح
            if (updateStatusEl) updateStatusEl.textContent = `يتوفر تحديث جديد (${latestVersion})!`;
            
            // إظهار نافذة منبثقة أو تنبيه للمستخدم لتحميل التحديث
            showUpdateModal(latestVersion, downloadUrl, data.body);
        } else {
            // التطبيق محدث لأحدث نسخة
            if (updateStatusEl) updateStatusEl.textContent = 'تطبيقك محدث لأحدث إصدار ✅';
            alert('أنت تستخدم أحدث إصدار بالفعل!');
        }

    } catch (err) {
        console.error('❌ خطأ أثناء التحقق من التحديثات:', err);
        if (updateStatusEl) updateStatusEl.textContent = 'تعذر التحقق من التحديثات (تأكد من الاتصال بالإنترنت)';
    }
}

// نافذة منبثقة بسيطة تعرض تفاصيل التحديث ورابط التحميل
function showUpdateModal(version, url, releaseNotes) {
    const userConfirmed = confirm(`تحديث جديد متاح (${version})!\n\nالتفاصيل:\n${releaseNotes || 'تحسينات وإصلاح الأخطاء.'}\n\nهل تريد تحميل التحديث الآن؟`);
    
    if (userConfirmed && url) {
        // فتح رابط تحميل الـ APK مباشرة
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}
