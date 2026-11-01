// ============================================
// script.js - نقطة الدخول الرئيسية (ES Module)
// ============================================

import { initPreloadSystem } from './javascript/features/preload-game.js';
import { setupBackButton } from './javascript/core/navigation.js';
import { preventInteractionWhenHidden, initWoodUI, updateWelcomeMessages } from './javascript/ui/wood-interface.js';
import { initPDFViewer } from './javascript/ui/pdf-viewer.js';
import { initializeGroup, loadSelectedGroup } from './javascript/core/group-loader.js';
import { scan } from './javascript/features/svg-processor.js';
import { resetBrowserZoom } from './javascript/core/utils.js';
import { checkForUpdates } from './javascript/core/update-checker.js';

const updateBtn = document.getElementById('check-update-btn');
if (updateBtn) {
    updateBtn.addEventListener('click', () => {
        checkForUpdates();
    }); // ⬅️ قفلنا القوس هنا صح!
}

// ---------- تحميل آخر جروب تلقائياً ----------
function autoLoadLastGroup() {
    const preloadDone = localStorage.getItem('preload_done');

    if (!preloadDone) {
        console.log('⏭️ أول زيارة - تخطي التحميل التلقائي');
        return;
    }

    const savedGroup = localStorage.getItem('selectedGroup');

    if (savedGroup && /^[A-D]$/.test(savedGroup)) {
        console.log(`🚀 تحميل آخر جروب تلقائياً: ${savedGroup}`);
        const groupSelectionScreen = document.getElementById('group-selection-screen');
        if (groupSelectionScreen) {
            groupSelectionScreen.style.display = 'none';
        }
        initializeGroup(savedGroup);
    } else {
        console.log('📋 لا يوجد جروب محفوظ - عرض شاشة الاختيار');
    }
}


// ---------- مراقب تغيير Z-Index (إعادة تعيين التكبير) ----------
function observeZIndexChanges() {
    let zoomTimeout;
    const shouldTriggerReset = (el) => {
        if (!el || !el.style) return false;
        const zIndex = window.getComputedStyle(el).zIndex;
        const display = window.getComputedStyle(el).display;
        const visibility = window.getComputedStyle(el).visibility;
        const opacity = window.getComputedStyle(el).opacity;
        return (
            zIndex !== 'auto' &&
            parseInt(zIndex) >= 10 &&
            display !== 'none' &&
            visibility !== 'hidden' &&
            opacity !== '0'
        );
    };

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            const target = mutation.target;
            if (mutation.type === 'attributes') {
                if (mutation.attributeName === 'style' || mutation.attributeName === 'class') {
                    if (shouldTriggerReset(target)) {
                        clearTimeout(zoomTimeout);
                        zoomTimeout = setTimeout(() => {
                            console.log('🧠 تغيير z-index / ظهور شاشة → Reset Zoom');
                            resetBrowserZoom();
                        }, 80);
                        break;
                    }
                }
            }
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1 && shouldTriggerReset(node)) {
                        clearTimeout(zoomTimeout);
                        zoomTimeout = setTimeout(() => {
                            console.log('🧠 إضافة شاشة جديدة → Reset Zoom');
                            resetBrowserZoom();
                        }, 80);
                    }
                });
            }
        }
    });

    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['style', 'class'],
        childList: true,
        subtree: true
    });
    console.log('✅ مراقبة z-index وظهور/اختفاء الشاشات مفعّلة');
}

// ---------- التهيئة عند تحميل DOM ----------
document.addEventListener('DOMContentLoaded', () => {
    const preloadDone = localStorage.getItem('preload_done');

    if (!preloadDone) {
        // أول زيارة: نشغل نظام preload فقط (سيقوم بإخفاء باقي المحتوى)
        initPreloadSystem();
        // لا داعي لتهيئة باقي المكونات الآن، لأن preload سيعيد التحميل لاحقاً
    } else {
        // زيارة سابقة: نكمل التحميل الطبيعي
        autoLoadLastGroup();

        // تهيئة المكونات
        setupBackButton();
        preventInteractionWhenHidden();
        initWoodUI();
        initPDFViewer();
        observeZIndexChanges();

        // تحديث رسائل الترحيب
        updateWelcomeMessages();

        // منع القائمة اليمنى على الصور
        document.addEventListener('contextmenu', (e) => {
            const target = e.target;
            if (target.tagName === 'image' || 
                target.tagName === 'IMG' || 
                target.tagName === 'svg' ||
                target.tagName === 'rect' ||
                target.closest('svg')) {
                e.preventDefault();
                return false;
            }
        });
// ---------- التحكم في سويتش الـ Hover ----------
const hoverSwitch = document.getElementById('js-toggle');
if (hoverSwitch) {
    // استرجاع الحالة المحفوظة مسبقاً إن وجدت
    const savedHoverState = localStorage.getItem('disable_hover');
    if (savedHoverState === 'true') {
        hoverSwitch.checked = false;
        document.body.classList.add('disable-hover');
    }

    hoverSwitch.addEventListener('change', (e) => {
        if (e.target.checked) {
            document.body.classList.remove('disable-hover');
            localStorage.setItem('disable_hover', 'false');
            console.log('✨ تم تفعيل الـ Hover');
        } else {
            document.body.classList.add('disable-hover');
            localStorage.setItem('disable_hover', 'true');
            console.log('🚫 تم إيقاف الـ Hover');
        }
    });
}

    }

    console.log('✅ script.js تم تحميله بالكامل - جميع الوحدات جاهزة');
});

export { scan };
