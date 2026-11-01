import { Filesystem, Directory } from '@capacitor/filesystem';
import { FileOpener } from '@capacitor-community/file-opener';

// دالة لتحميل الملف في مسار الجهاز ومزامنته وفتحه
export async function syncAndOpenFile(fileUrl, fileName) {
    try {
        // 1. تحميل الملف من جيت هاب أو المصدر
        const response = await fetch(fileUrl);
        const blob = await response.blob();
        
        // تحويل الـ Blob إلى Base64 عشان مكتبة الملفات تقدر تكتبه
        const base64Data = await convertBlobToBase64(blob);

        // 2. حفظ الملف في مجلد Documents أو Download المحلي للجهاز
        const savedFile = await Filesystem.writeFile({
            path: `CS26/${fileName}`,
            data: base64Data,
            directory: Directory.Documents, // أو ExternalStorage حسب رغبتك
            recursive: true
        });

        console.log('✅ تم حفظ الملف محلياً في:', savedFile.uri);

        // 3. فتح الملف باستخدام تطبيق الـ PDF الافتراضي في الموبايل وقائمة Open With
        await FileOpener.open({
            filePath: savedFile.uri,
            contentType: 'application/pdf',
            openWithIntent: true
        });

    } catch (e) {
        console.error('❌ خطأ في المزامنة أو فتح الملف:', e);
    }
}

// دالة مساعدة لتحويل الـ Blob لـ Base64
const convertBlobToBase64 = (blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(blob);
});
