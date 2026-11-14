import { RAW_CONTENT_BASE, REPO_NAME, GITHUB_USER, TREE_API_URL, NAV_STATE } from './config.js';
import { getDisplayName, debounce, resetBrowserZoom } from './utils.js';
import { pushNavigationState, goToWood } from './navigation.js';
import { setCurrentGroup, setCurrentFolder, setGlobalFileTree, globalFileTree, currentGroup, currentFolder } from './state.js';

// ✅ توليد SVG من البيانات (بدلاً من fetch لملف SVG)
import { generateGroupSVG } from './svg-generator.js';
import { GROUP_DATA } from './groups-data.js';

// ------------slot--------------
const DEFAULT_SLOT_CLASS = 'o';
function getSlotAttrs(item) {
  if (item == null) {
    return { cls: DEFAULT_SLOT_CLASS, href: '' };
  }
  if (typeof item === 'string') {
    return { cls: item || DEFAULT_SLOT_CLASS, href: '' };
  }
  return {
    cls: item.cls || DEFAULT_SLOT_CLASS,
    href: item.href || '',
  };
}

/** يرسم rect واحدة، ويلفّها بـ <a> لو فيه href */
export function rect(x, y, w, h, cls, href) {
  const r = `<rect x="${x}" y="${y}" width="${w}" height="${h}" class="${cls}"/>`;
  return href ? `<a href="${href}" target="_blank">${r}</a>` : r;
}
export function renderSlot(slot, item) {
  // ----- حالة التقسيم: مصفوفة أجزاء -----
  if (Array.isArray(item)) {
    const n = item.length;
    if (n === 0) {
      // مصفوفة فاضية → نرسم slot الافتراضية
      return rect(slot.x, slot.y, slot.w, slot.h, DEFAULT_SLOT_CLASS, '');
    }
    return item.map((part, i) => {
      const { cls, href } = getSlotAttrs(part);
      const h = slot.h / n;
      const y = slot.y + i * h;
      return rect(slot.x, y, slot.w, h, cls, href);
    }).join('');
  }

  // ----- حالة slot واحدة -----
  const { cls, href } = getSlotAttrs(item);
  return rect(slot.x, slot.y, slot.w, slot.h, cls, href);
}

(fetchGlobalTree, showLoadingScreen, loadGroupSVG )
// ---------- متغيرات داخلية للتحميل ----------
let imageUrlsToLoad = [];
let loadingProgress = {
    totalSteps: 0,
    completedSteps: 0,
    currentPercentage: 0
};

// ---------- شجرة الملفات ----------
export async function fetchGlobalTree() {
    if (globalFileTree.length > 0) return;
    try {
        const response = await fetch(TREE_API_URL);
        const data = await response.json();
        setGlobalFileTree(data.tree || []);
        console.log("✅ تم تحميل شجرة الملفات:", globalFileTree.length);
    } catch (err) {
        console.error("❌ خطأ في الاتصال بـ GitHub:", err);
    }
}

//--------------تقيسم-----------------
function renderSlot(slot, item) {
  // الحالة العادية: 'o' أو 'x' أو {cls, href}
  if (!Array.isArray(item)) {
    const cls  = (item && item.cls)  || '';
    const href = (item && item.href) || '';
    return rect(slot.x, slot.y, slot.w, slot.h, cls, href);
  }

  // الحالة المقسمة: مصفوفة أجزاء
  const n = item.length;
  return item.map((part, i) => {
    // قسّم رأسياً (فوق بعض) — لو عايز أفقياً بدّل h/w
    const h = slot.h / n;
    const y = slot.y + i * h;
    return rect(slot.x, y, slot.w, h, part.cls, part.href);
  }).join('');
}

// helper
function rect(x, y, w, h, cls, href) {
  const r = `<rect x="${x}" y="${y}" width="${w}" height="${h}" class="${cls}"/>`;
  return href ? `<a href="${href}" target="_blank">${r}</a>` : r;
}

// ---------- حفظ وتحميل المجموعة ----------
export function saveSelectedGroup(group) {
    setCurrentGroup(group);
}

export function loadSelectedGroup() {
    const saved = localStorage.getItem('selectedGroup');
    if (saved) {
        setCurrentGroup(saved);
        return true;
    }
    return false;
}

// ---------- شاشة التحميل ----------
export function showLoadingScreen(groupLetter) {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (!loadingOverlay) return;

    const splashImage = document.getElementById('splash-image');
    if (splashImage) {
        splashImage.style.display = 'none';
        let textElement = document.getElementById('group-text-display');
        if (!textElement) {
            textElement = document.createElement('div');
            textElement.id = 'group-text-display';
            textElement.style.cssText = `
                font-size: 120px;
                font-weight: bold;
                color: #ffca28;
                text-shadow: 
                    0 0 30px rgba(255,202,40,0.8),
                    0 0 60px rgba(255,202,40,0.5),
                    0 0 90px rgba(255,202,40,0.3);
                font-family: 'Arial Black', sans-serif;
                letter-spacing: 15px;
                animation: pulse 2s ease-in-out infinite;
                text-align: center;
                margin: 20px 0;
            `;
            splashImage.parentNode.insertBefore(textElement, splashImage);
        }
        textElement.textContent = `Group ${groupLetter}`;
        textElement.style.display = 'block';
    }

    loadingProgress = {
        totalSteps: 0,
        completedSteps: 0,
        currentPercentage: 0
    };

    document.querySelectorAll('.light-bulb').forEach(bulb => bulb.classList.remove('on'));
    loadingOverlay.classList.add('active');
    console.log(`🔦 شاشة التحميل نشطة: Group ${groupLetter}`);

    import('../ui/wood-interface.js').then(({ updateWelcomeMessages }) => {
        updateWelcomeMessages();
    });
}

export function hideLoadingScreen() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (!loadingOverlay) return;
    loadingOverlay.classList.remove('active');

    const splashImage = document.getElementById('splash-image');
    if (splashImage) {
        splashImage.style.display = '';
    }
    const textElement = document.getElementById('group-text-display');
    if (textElement) {
        textElement.style.display = 'none';
    }
    console.log('✅ تم إخفاء شاشة التحميل');
}

export function updateLoadProgress() {
    if (loadingProgress.totalSteps === 0) {
        console.warn('⚠️ totalSteps = 0');
        return;
    }
    const progress = (loadingProgress.completedSteps / loadingProgress.totalSteps) * 100;
    loadingProgress.currentPercentage = Math.min(100, Math.round(progress));
    console.log(`📊 التقدم: ${loadingProgress.currentPercentage}% (${loadingProgress.completedSteps}/${loadingProgress.totalSteps})`);

    const percentage = loadingProgress.currentPercentage;
    if (percentage >= 20) document.getElementById('bulb-4')?.classList.add('on');
    if (percentage >= 40) document.getElementById('bulb-3')?.classList.add('on');
    if (percentage >= 60) document.getElementById('bulb-2')?.classList.add('on');
    if (percentage >= 80) document.getElementById('bulb-1')?.classList.add('on');
}

// ---------- تحميل SVG الخاص بالمجموعة (مولَّد من البيانات) ----------
export async function loadGroupSVG(groupLetter) {
    const groupContainer = document.getElementById('group-specific-content');
    if (!groupContainer) return;
    groupContainer.innerHTML = '';

    const group = GROUP_DATA[groupLetter];

    // ✅ لو المجموعة مش جاهزة → رسالة واضحة
    if (!group || !group.template) {
        console.warn(`⚠️ المجموعة ${groupLetter} مش جاهزة بعد`);
        groupContainer.innerHTML = `
            <g transform="translate(0,0)">
                <rect x="0" y="0" width="1024" height="2454" fill="#111"/>
                <text x="512" y="800" text-anchor="middle" fill="#ffcc00"
                      font-size="80" font-weight="bold" font-family="Arial">
                    Group ${groupLetter}
                </text>
                <text x="512" y="950" text-anchor="middle" fill="#888"
                      font-size="50" font-family="Arial">
                    قريباً...
                </text>
                <text x="512" y="1050" text-anchor="middle" fill="#555"
                      font-size="35" font-family="Arial">
                    Coming Soon
                </text>
            </g>
        `;
        loadingProgress.totalSteps = 1;
        loadingProgress.completedSteps = 1;
        updateLoadProgress();
        return;
    }

    try {
        groupContainer.innerHTML = generateGroupSVG(groupLetter, group);
        console.log(`✅ توليد ${groupLetter}: ${groupContainer.children.length} عنصر`);

        const injectedImages = groupContainer.querySelectorAll('image[data-src]');
        imageUrlsToLoad = ['image/wood.webp', 'image/Upper_wood.webp'];
        injectedImages.forEach(img => {
            const src = img.getAttribute('data-src');
            if (src && !imageUrlsToLoad.includes(src)) {
                const isGroupImage = src.includes(`image/${groupLetter}/`) ||
                    src.includes(`logo-${groupLetter}`) ||
                    src.includes(`logo-wood-${groupLetter}`);
                if (isGroupImage) imageUrlsToLoad.push(src);
            }
        });

        loadingProgress.totalSteps = 1 + imageUrlsToLoad.length;
        loadingProgress.completedSteps = 1;
        updateLoadProgress();
    } catch (err) {
        console.error(`❌ خطأ في loadGroupSVG:`, err);
        loadingProgress.totalSteps = 1;
        loadingProgress.completedSteps = 1;
        updateLoadProgress();
    }
}

// ---------- تحديث شعار الخشب ----------
export function updateWoodLogo(groupLetter) {
    const dynamicGroup = document.getElementById('dynamic-links-group');
    if (!dynamicGroup) return;

    const oldBanner = dynamicGroup.querySelector('.wood-banner-animation');
    if (oldBanner) oldBanner.remove();

    if (currentFolder !== "") return;

    const banner = document.createElementNS("http://www.w3.org/2000/svg", "image");
    banner.setAttribute("href", `image/logo-wood-${groupLetter}.webp`);
    banner.setAttribute("x", "197.20201666994924");
    banner.setAttribute("y", "2074.3139768463334");
    banner.setAttribute("width", "629.8946370139159");
    banner.setAttribute("height", "275.78922917259797");
    banner.setAttribute("class", "wood-banner-animation");
    banner.style.mixBlendMode = "multiply";
    banner.style.opacity = "0.9";
    banner.style.pointerEvents = "auto";

    banner.onclick = (e) => {
        e.stopPropagation();
        resetBrowserZoom();
        const groupSelectionScreen = document.getElementById('group-selection-screen');
        if (groupSelectionScreen) {
            groupSelectionScreen.classList.remove('hidden');
            groupSelectionScreen.style.display = 'flex';
        }
        goToWood();
        pushNavigationState(NAV_STATE.GROUP_SELECTION);
    };

    dynamicGroup.appendChild(banner);
}

// ---------- تهيئة المجموعة ----------
export async function initializeGroup(groupLetter) {
    console.log(`🚀 تهيئة المجموعة: ${groupLetter}`);

    const previousGroup = localStorage.getItem('selectedGroup');

    if (previousGroup && previousGroup !== groupLetter) {
        console.log(`🔄 تم تغيير الجروب من ${previousGroup} إلى ${groupLetter} - مسح الكاش القديم`);
        const cacheNames = await caches.keys();
        for (const cacheName of cacheNames) {
            if (cacheName.includes(`group-${previousGroup}`)) {
                await caches.delete(cacheName);
                console.log(`🗑️ تم مسح: ${cacheName}`);
            }
        }
    }

    saveSelectedGroup(groupLetter);

    const toggleContainer = document.getElementById('js-toggle-container');
    const scrollContainer = document.getElementById('scroll-container');
    const groupSelectionScreen = document.getElementById('group-selection-screen');

    if (toggleContainer) {
        toggleContainer.classList.remove('fully-hidden');
        toggleContainer.style.display = 'flex';
    }
    if (scrollContainer) scrollContainer.style.display = 'block';
    if (groupSelectionScreen) {
        groupSelectionScreen.classList.add('hidden');
        groupSelectionScreen.style.display = 'none';
    }

    pushNavigationState(NAV_STATE.WOOD_VIEW, { group: groupLetter });

    showLoadingScreen(groupLetter);
    await Promise.all([fetchGlobalTree(), loadGroupSVG(groupLetter)]);

    updateDynamicSizes();
    await loadImages();
}

// ---------- تحميل الصور ----------
export async function loadImages() {
    const mainSvg = document.getElementById('main-svg');
    if (!mainSvg) return;

    console.log(`🖼️ بدء تحميل ${imageUrlsToLoad.length} صورة...`);
    if (imageUrlsToLoad.length === 0) {
        console.warn('⚠️ لا توجد صور للتحميل!');
        finishLoading();
        return;
    }

    const MAX_CONCURRENT = 3;
    let currentIndex = 0;

    async function loadNextBatch() {
        while (currentIndex < imageUrlsToLoad.length &&
            currentIndex < (loadingProgress.completedSteps - 1) + MAX_CONCURRENT) {
            const url = imageUrlsToLoad[currentIndex];
            currentIndex++;

            try {
                const cache = await caches.open('semester-3-cache-v1');
                const cachedImg = await cache.match(url);
                if (cachedImg) {
                    console.log(`✅ الصورة موجودة في الكاش: ${url.split('/').pop()}`);
                    const blob = await cachedImg.blob();
                    const imgUrl = URL.createObjectURL(blob);
                    const allImages = [
                        ...mainSvg.querySelectorAll('image'),
                        ...(document.getElementById('files-list-container')?.querySelectorAll('image') || [])
                    ];
                    allImages.forEach(si => {
                        const dataSrc = si.getAttribute('data-src');
                        if (dataSrc === url) {
                            si.setAttribute('href', imgUrl);
                        }
                    });
                    loadingProgress.completedSteps++;
                    updateLoadProgress();
                    if (loadingProgress.completedSteps >= loadingProgress.totalSteps) {
                        finishLoading();
                    } else {
                        loadNextBatch();
                    }
                    continue;
                }
            } catch (cacheError) {
                console.warn(`⚠️ خطأ في الوصول للكاش: ${cacheError}`);
            }

            const img = new Image();
            img.onload = async function () {
                const allImages = [
                    ...mainSvg.querySelectorAll('image'),
                    ...(document.getElementById('files-list-container')?.querySelectorAll('image') || [])
                ];
                allImages.forEach(si => {
                    const dataSrc = si.getAttribute('data-src');
                    if (dataSrc === url) {
                        si.setAttribute('href', this.src);
                        console.log(`✅ تم تحديث الصورة: ${url.split('/').pop()}`);
                    }
                });

                try {
                    const cache = await caches.open('semester-3-cache-v1');
                    const imgResponse = await fetch(url);
                    if (imgResponse.ok) {
                        await cache.put(url, imgResponse);
                        console.log(`💾 تم حفظ الصورة في الكاش: ${url.split('/').pop()}`);
                    }
                } catch (cacheError) {
                    console.warn(`⚠️ فشل حفظ الصورة في الكاش: ${cacheError}`);
                }

                loadingProgress.completedSteps++;
                updateLoadProgress();
                if (loadingProgress.completedSteps >= loadingProgress.totalSteps) {
                    finishLoading();
                } else {
                    loadNextBatch();
                }
            };

            img.onerror = function () {
                console.error(`❌ خطأ في تحميل ${url}`);
                loadingProgress.completedSteps++;
                updateLoadProgress();
                if (loadingProgress.completedSteps >= loadingProgress.totalSteps) {
                    finishLoading();
                } else {
                    loadNextBatch();
                }
            };

            img.src = url;
        }
    }

    loadNextBatch();
}

// ---------- إنهاء التحميل ----------
async function finishLoading() {
    loadingProgress.completedSteps = loadingProgress.totalSteps;
    loadingProgress.currentPercentage = 100;
    updateLoadProgress();
    console.log('✅ التحميل اكتمل 100% - جاري عرض المحتوى...');

    const { scan } = await import('../features/svg-processor.js');
    const { updateWoodInterface } = await import('../ui/wood-interface.js');

    updateDynamicSizes();
    scan();
    updateWoodInterface();
    goToWood();

    const mainSvg = document.getElementById('main-svg');
    if (mainSvg) {
        mainSvg.style.opacity = '1';
        mainSvg.style.visibility = 'visible';
        mainSvg.classList.add('loaded');
    }

    hideLoadingScreen();
    console.log('🎉 اكتمل التحميل والعرض');
}

// ---------- تحديث أحجام SVG ديناميكياً ----------
export function updateDynamicSizes() {
    const mainSvg = document.getElementById('main-svg');
    if (!mainSvg) return;

    const allImages = mainSvg.querySelectorAll('image[width][height]');
    if (allImages.length === 0) return;

    let maxX = 0, maxY = 0;

    allImages.forEach(img => {
        let tx = 0, ty = 0;
        let el = img.parentElement;
        while (el && el !== mainSvg) {
            const t = el.getAttribute && el.getAttribute('transform');
            if (t) {
                const m = t.match(/translate\s*\(\s*([\d.eE+-]+)(?:[ ,]+([\d.eE+-]+))?\s*\)/);
                if (m) {
                    tx += parseFloat(m[1]) || 0;
                    ty += parseFloat(m[2]) || 0;
                }
            }
            el = el.parentElement;
        }

        const w = parseFloat(img.getAttribute('width'))  || 0;
        const h = parseFloat(img.getAttribute('height')) || 0;
        const x = parseFloat(img.getAttribute('x'))      || 0;
        const y = parseFloat(img.getAttribute('y'))      || 0;

        const right  = tx + x + w;
        const bottom = ty + y + h;
        if (right  > maxX) maxX = right;
        if (bottom > maxY) maxY = bottom;
    });

    mainSvg.setAttribute('viewBox', `0 0 ${maxX} ${maxY}`);
    console.log(`✅ viewBox: 0 0 ${maxX} ${maxY}`);
}