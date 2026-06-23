document.addEventListener('click', function(e){
  const btn = e.target.closest('.btn');
  if(!btn) return;
  const action = btn.dataset.action;
  // placeholder behavior: يمكنك تعديل هذه الدوال لاحقاً
  switch(action){
    default:
      // عرض رسالة مؤقتة لتوضيح أن الزر يعمل (يقرأ نص الـ .label)
      const labelEl = btn.querySelector('.label');
      const labelText = labelEl ? labelEl.textContent.trim() : btn.textContent.trim();
      showToast(`تم الضغط على ${labelText} (${action})`);
  }
});

// Menu toggle logic
const menuBtn = document.getElementById('menuBtn');
const channelPanel = document.getElementById('channelPanel');
// closePanel removed (panel uses only channel info)
const joinChannel = document.getElementById('joinChannel');
const overlay = document.getElementById('overlay');

if(menuBtn && channelPanel){
  menuBtn.addEventListener('click', ()=>{
    channelPanel.classList.toggle('open');
    const isOpen = channelPanel.classList.contains('open');
    channelPanel.setAttribute('aria-hidden', !isOpen);
    if(overlay){
      overlay.classList.toggle('visible', isOpen);
      overlay.setAttribute('aria-hidden', !isOpen);
    }
  });
}
// click on overlay closes the panel
if(overlay){
  overlay.addEventListener('click', ()=>{
    channelPanel.classList.remove('open');
    channelPanel.setAttribute('aria-hidden','true');
    overlay.classList.remove('visible');
    overlay.setAttribute('aria-hidden','true');
  });
}
if(joinChannel){
  joinChannel.addEventListener('click', (e)=>{
    e.preventDefault();
    const channelUrl = 'https://t.me/اسم_القناة_هنا';
    window.open(channelUrl, '_blank');
    showToast('فتح رابط القناة');
  });
}

function showToast(msg, duration=1500){
  let t = document.createElement('div');
  t.textContent = msg;
  t.style.position = 'fixed';
  t.style.bottom = '24px';
  t.style.left = '50%';
  t.style.transform = 'translateX(-50%)';
  t.style.background = 'rgba(0,0,0,0.6)';
  t.style.color = '#fff';
  t.style.padding = '10px 14px';
  t.style.borderRadius = '8px';
  t.style.zIndex = 9999;
  document.body.appendChild(t);
  setTimeout(()=>t.remove(), duration);
}

// Utility: set labels programmatically
function setButtonLabel(action, label){
  const btn = document.querySelector(`.btn[data-action="${action}"]`);
  if(!btn) return;
  const labelEl = btn.querySelector('.label');
  if(labelEl) labelEl.textContent = label;
  // keep original text in data-label for searching
  btn.dataset.label = label;
}

// Search/filter functionality
function escapeHtml(s){
  return s.replace(/[&<>"']/g, function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
  });
}

function filterButtons(query){
  const q = (query||'').trim().toLowerCase();
  const buttons = document.querySelectorAll('.buttons-grid .btn');
  let visible = 0;
  buttons.forEach(btn => {
    const original = (btn.dataset.label || (btn.querySelector('.label')||{textContent:''}).textContent).toLowerCase();
    if(!q){
      btn.classList.remove('hidden','match');
      const labelEl = btn.querySelector('.label');
      if(labelEl) labelEl.innerHTML = escapeHtml(labelEl.textContent);
      btn.style.display = '';
      visible++;
      return;
    }
    if(original.indexOf(q) !== -1){
      // highlight match
      const labelEl = btn.querySelector('.label');
      if(labelEl){
        const raw = labelEl.textContent;
        const idx = raw.toLowerCase().indexOf(q);
        if(idx !== -1){
          const before = escapeHtml(raw.slice(0, idx));
          const match = escapeHtml(raw.slice(idx, idx+q.length));
          const after = escapeHtml(raw.slice(idx+q.length));
          labelEl.innerHTML = `${before}<mark>${match}</mark>${after}`;
        } else {
          labelEl.innerHTML = escapeHtml(raw);
        }
      }
      btn.classList.remove('hidden');
      btn.classList.add('match');
      btn.style.display = '';
      visible++;
    } else {
      btn.classList.add('hidden');
      btn.classList.remove('match');
      btn.style.display = 'none';
    }
  });
  // show a no-results toast if nothing found
  if(visible === 0){
    showToast('لا توجد نتائج');
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  // initialize data-label on buttons
  document.querySelectorAll('.buttons-grid .btn').forEach(btn=>{
    const labelEl = btn.querySelector('.label');
    const text = labelEl ? labelEl.textContent.trim() : btn.textContent.trim();
    btn.dataset.label = text;
  });

  const searchInput = document.getElementById('searchInput');
  if(searchInput){
    searchInput.addEventListener('input', (e)=>{
      filterButtons(e.target.value);
    });
    searchInput.addEventListener('keydown', (e)=>{
      if(e.key === 'Escape'){
        searchInput.value = '';
        filterButtons('');
      }
    });
  }
  // clear button removed — use Escape key to clear
  
});
