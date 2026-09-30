(() => {
  'use strict';

  const snapshot = window.MODEL_COST_SNAPSHOT;
  const official = window.MODEL_OFFICIAL_PRICING || { meta: {}, sources: {}, models: {} };
  const storageKey = 'links-model-cost-selection-v1';

  if (!snapshot?.models?.length) {
    document.getElementById('catalog').innerHTML = '<div class="empty-state"><strong>快照加载失败</strong><p>请确认 snapshot.js 与 index.html 位于同一目录。</p></div>';
    return;
  }

  const modalityLabels = { text: '文本', image: '图片', video: '视频', audio: '语音', tool: '工具' };
  const auditLabels = { verified: '官方已核', review: '有价需确认', unverified: '未确认官方来源' };
  const regionLabels = { domestic: '国内', overseas: '海外' };
  const state = {
    region: 'all',
    search: '',
    modality: 'all',
    status: 'all',
    audit: 'all',
    selected: loadSelection(),
    expanded: new Set(),
  };

  const elements = {
    catalog: document.getElementById('catalog'),
    empty: document.getElementById('emptyState'),
    search: document.getElementById('searchInput'),
    modality: document.getElementById('modalityFilter'),
    status: document.getElementById('statusFilter'),
    audit: document.getElementById('auditFilter'),
    visibleCount: document.getElementById('visibleCount'),
    selectionList: document.getElementById('selectionList'),
    selectedCount: document.getElementById('selectedCount'),
    selectedDomestic: document.getElementById('selectedDomestic'),
    selectedOverseas: document.getElementById('selectedOverseas'),
    selectedReview: document.getElementById('selectedReview'),
    download: document.getElementById('downloadCsv'),
    copy: document.getElementById('copySelection'),
    clear: document.getElementById('clearSelection'),
    toast: document.getElementById('toast'),
  };

  // Drop choices that no longer exist after a snapshot refresh.
  const currentKeys = new Set(snapshot.models.map((model) => model.id));
  state.selected = new Set([...state.selected].filter((key) => currentKeys.has(key)));
  saveSelection();

  function loadSelection() {
    try {
      const value = JSON.parse(localStorage.getItem(storageKey) || '[]');
      return new Set(Array.isArray(value) ? value : []);
    } catch {
      return new Set();
    }
  }

  function saveSelection() {
    try {
      localStorage.setItem(storageKey, JSON.stringify([...state.selected]));
    } catch {
      // The selector remains usable when storage is blocked (for example in a hardened file:// context).
    }
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function moneyFromFen(value) {
    if (value === null || value === undefined || Number.isNaN(Number(value))) return '—';
    const yuan = Number(value) / 100;
    return `¥${yuan.toLocaleString('zh-CN', { maximumFractionDigits: 6 })}`;
  }

  function getOfficial(model) {
    return official.models?.[model.id] || official.models?.[model.model] || {
      status: 'unverified',
      headline: '暂无可公开核验的精确官方价',
      detail: '需以厂商控制台、合同或商务报价为准。',
      note: '未用本地录入值反推官方真实成本。',
      localBasis: '当前数字是 Admin 人工录入值；数据库未保存原始报价、汇率或公式，不得反推为官方价。',
    };
  }

  function getSource(price) {
    if (!price?.source) return null;
    if (typeof price.source === 'object') return price.source;
    return official.sources?.[price.source] || null;
  }

  function sourceUrl(price) {
    return getSource(price)?.url || '';
  }

  function priceRows(model) {
    const rows = [];
    for (const ability of model.abilities) {
      const price = ability.price;
      if (!price) {
        rows.push({ ability: ability.label, tier: '—', cost: '未录入', sale: '未录入' });
        continue;
      }
      if (price.mode === 'token') {
        rows.push({ ability: ability.label, tier: '输入 / 100万 token', cost: moneyFromFen(price.costIn), sale: moneyFromFen(price.saleIn) });
        rows.push({ ability: ability.label, tier: '输出 / 100万 token', cost: moneyFromFen(price.costOut), sale: moneyFromFen(price.saleOut) });
        continue;
      }
      if (price.mode === 'functions') {
        for (const [rawName, item] of Object.entries(price.items || {})) {
          rows.push({ ability: ability.label, tier: rawName.split('#')[0], cost: moneyFromFen(item.cost), sale: moneyFromFen(item.sale) });
        }
        continue;
      }
      if (price.tiers) {
        for (const [tier, item] of Object.entries(price.tiers)) {
          const unit = price.mode === 'per_image' ? ' / 张' : price.mode === 'per_second' ? ' / 输出秒' : price.mode === 'per_video' ? ' / 条' : '';
          rows.push({ ability: ability.label, tier, cost: `${moneyFromFen(item.cost)}${unit}`, sale: `${moneyFromFen(item.sale)}${unit}` });
          if (price.mode === 'per_second' && item.inCost !== undefined) {
            rows.push({ ability: `${ability.label}（输入素材）`, tier, cost: `${moneyFromFen(item.inCost)} / 输入秒`, sale: `${moneyFromFen(item.inSale)} / 输入秒` });
          }
        }
        continue;
      }
      const unit = {
        per_call: ' / 次',
        per_minute: ' / 分钟',
        per_kchar: ' / 千字',
        per_image: ' / 张',
        per_second: ' / 秒',
        per_video: ' / 条',
      }[price.mode] || '';
      rows.push({ ability: ability.label, tier: price.mode || '固定', cost: `${moneyFromFen(price.cost)}${unit}`, sale: `${moneyFromFen(price.sale)}${unit}` });
    }
    return rows;
  }

  function localSummary(model) {
    const rows = priceRows(model).filter((row) => row.cost !== '未录入');
    if (!rows.length) return '本地计费模板未录入成本';
    if (rows.length === 1) return `${rows[0].tier} ${rows[0].cost}`;
    const first = rows[0];
    return `${first.tier} ${first.cost} 起 · 共 ${rows.length} 个本地档位`;
  }

  function matches(model) {
    const price = getOfficial(model);
    if (state.region !== 'all' && model.region !== state.region) return false;
    if (state.modality !== 'all' && model.modality !== state.modality) return false;
    if (state.status === 'enabled' && !model.enabled) return false;
    if (state.status === 'disabled' && model.enabled) return false;
    if (state.audit !== 'all' && price.status !== state.audit) return false;
    if (!state.search) return true;
    const haystack = [
      model.name,
      model.model,
      model.upstreamModel,
      model.channel,
      model.channelPlatform,
      model.maker,
      model.catalogCard,
      ...model.abilities.flatMap((ability) => [ability.label, ability.category, ability.protocol]),
    ].join(' ').toLocaleLowerCase('zh-CN');
    return haystack.includes(state.search.toLocaleLowerCase('zh-CN'));
  }

  function renderModel(model) {
    const price = getOfficial(model);
    const source = getSource(price);
    const expanded = state.expanded.has(model.id);
    const selected = state.selected.has(model.id);
    const abilityChips = model.abilities.map((ability) =>
      `<span class="ability-chip${ability.enabled ? '' : ' is-off'}">${escapeHtml(ability.label)}</span>`,
    ).join('');
    const rows = priceRows(model);
    const tableRows = rows.map((row) => `<tr><td>${escapeHtml(row.ability)}</td><td>${escapeHtml(row.tier)}</td><td>${escapeHtml(row.cost)}</td><td>${escapeHtml(row.sale)}</td></tr>`).join('');
    const sourceLabel = price.sourceLabel || (price.status === 'unverified' ? '待确认来源' : '官方价格来源');
    const sourceLink = source?.url
      ? `<a class="source-link" href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">${escapeHtml(sourceLabel)} ↗</a>`
      : '<span class="source-link">需控制台 / 商务报价</span>';
    const extraLinks = (price.extraSources || []).map((sourceKey) => {
      const item = typeof sourceKey === 'object' ? sourceKey : official.sources?.[sourceKey];
      return item?.url ? `<a href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer">${escapeHtml(item.title || '补充来源')}</a>` : '';
    }).filter(Boolean).join(' · ');

    return `
      <article class="model-row${selected ? ' is-selected' : ''}${expanded ? ' is-expanded' : ''}" data-model-key="${escapeHtml(model.id)}">
        <label class="model-check" title="勾选 ${escapeHtml(model.name)}">
          <input class="model-selector" type="checkbox" data-model-key="${escapeHtml(model.id)}" ${selected ? 'checked' : ''} aria-label="勾选 ${escapeHtml(model.name)}" />
        </label>
        <div class="model-identity" role="button" tabindex="0" aria-expanded="${expanded}" title="展开完整信息">
          <div class="model-identity__top">
            <h4>${escapeHtml(model.name)}</h4>
            <span class="status-pill status-pill--${model.enabled ? 'on' : 'off'}">${model.enabled ? '已启用' : '已停用'}</span>
            <span class="modality-pill">${escapeHtml(modalityLabels[model.modality] || model.modality)}</span>
          </div>
          <div class="model-id">${escapeHtml(model.model)}</div>
          <div class="ability-chips">${abilityChips}</div>
        </div>
        <div class="origin-block">
          <span>真实原厂 / 接入平台</span>
          <strong>${escapeHtml(model.maker)}</strong>
          <small>${escapeHtml(model.channelPlatform)}</small>
          <code>upstream: ${escapeHtml(model.upstreamModel)}</code>
        </div>
        <div class="price-block">
          <span>官方公开成本</span>
          <strong class="official-price">${escapeHtml(price.headline)}</strong>
          <small>${escapeHtml(price.detail || '')}</small>
          <div class="local-price"><b>本地成本模板</b><p>${escapeHtml(localSummary(model))}</p></div>
        </div>
        <div class="audit-cell">
          <span class="audit-pill audit-pill--${escapeHtml(price.status)}">${escapeHtml(auditLabels[price.status] || '待核')}</span>
          ${sourceLink}
        </div>
        <button class="expand-button" type="button" aria-label="${expanded ? '收起' : '展开'} ${escapeHtml(model.name)}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
        </button>
        <div class="model-details">
          <div class="detail-card">
            <h5>官方成本口径与证据</h5>
            <p>${escapeHtml(price.detail || price.headline)}</p>
            ${price.note ? `<p class="detail-warning">${escapeHtml(price.note)}</p>` : ''}
            ${source ? `<p>来源：<a href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">${escapeHtml(source.title || source.url)}</a></p>` : '<p>来源：尚未找到可公开复核的一手价目；需以控制台或合同为准。</p>'}
            ${extraLinks ? `<p>补充：${extraLinks}</p>` : ''}
            <p>渠道账号：<strong>${escapeHtml(model.channel)}</strong> · 本地模板：${escapeHtml(model.templateName || '未关联')}</p>
            <p>逻辑 ID：<code>${escapeHtml(model.model)}</code><br />上游 ID：<code>${escapeHtml(model.upstreamModel)}</code></p>
          </div>
          <div class="detail-card">
            <h5>本地 Admin 计费模板（人民币）</h5>
            <table class="price-table"><thead><tr><th>能力</th><th>档位 / 单位</th><th>成本</th><th>售价</th></tr></thead><tbody>${tableRows}</tbody></table>
            <div class="basis-note"><strong>当前价格怎么来的</strong><p>${escapeHtml(price.localBasis || '本地 cost / sale 由管理员在渠道计费模板中人工录入；数据库没有保存官方报价版本、汇率或换算公式，本页只在数字能一一对上时标注“可反推”。')}</p></div>
            ${price.nextStep ? `<p class="next-step"><b>决策前动作：</b>${escapeHtml(price.nextStep)}</p>` : ''}
            <p class="detail-warning">本地数字是运营配置，不自动等同于厂商账单；复杂 token、像素或素材输入计费应按左侧官方公式复核。</p>
          </div>
        </div>
      </article>`;
  }

  function monogram(channel) {
    const latin = channel.match(/[A-Za-z0-9]+/g)?.join('') || '';
    return (latin ? latin.slice(0, 2) : channel.slice(0, 2)).toUpperCase();
  }

  function renderCatalog() {
    const visible = snapshot.models.filter(matches);
    elements.visibleCount.textContent = visible.length;
    elements.empty.hidden = visible.length > 0;
    elements.catalog.hidden = visible.length === 0;

    const regions = ['domestic', 'overseas'].filter((region) => state.region === 'all' || state.region === region);
    elements.catalog.innerHTML = regions.map((region) => {
      const regionModels = visible.filter((model) => model.region === region);
      if (!regionModels.length) return '';
      const channelIds = [...new Set(regionModels.map((model) => model.channelId))];
      const channelHtml = channelIds.map((channelId) => {
        const models = regionModels.filter((model) => model.channelId === channelId);
        const first = models[0];
        const selectedCount = models.filter((model) => state.selected.has(model.id)).length;
        return `
          <section class="channel-group" data-channel-id="${channelId}">
            <header class="channel-head">
              <div class="channel-head__identity">
                <span class="channel-monogram">${escapeHtml(monogram(first.channelPlatform))}</span>
                <div><h3>${escapeHtml(first.channel)}</h3><p>接入平台：${escapeHtml(first.channelPlatform)} · 原厂身份见每一行</p></div>
              </div>
              <div class="channel-head__actions">
                <span class="channel-head__count">${models.length} 个模型</span>
                <label class="channel-check"><input type="checkbox" class="channel-selector" data-channel-id="${channelId}" ${selectedCount === models.length ? 'checked' : ''} />勾选本渠道</label>
              </div>
            </header>
            <div class="model-list">${models.map(renderModel).join('')}</div>
          </section>`;
      }).join('');
      return `
        <section class="region-section" data-region="${region}">
          <header class="region-heading">
            <div class="region-heading__label"><span class="region-heading__flag">${region === 'domestic' ? 'CN' : 'INTL'}</span><div><h2>${regionLabels[region]}渠道</h2><p>${region === 'domestic' ? '人民币官方价与本地运营成本' : '保留美元原价，避免隐含汇率假设'}</p></div></div>
            <span>${regionModels.length} 个模型 · ${channelIds.length} 个渠道</span>
          </header>
          ${channelHtml}
        </section>`;
    }).join('');

    elements.catalog.querySelectorAll('.channel-selector').forEach((checkbox) => {
      const channelId = Number(checkbox.dataset.channelId);
      const models = visible.filter((model) => model.channelId === channelId);
      const count = models.filter((model) => state.selected.has(model.id)).length;
      checkbox.indeterminate = count > 0 && count < models.length;
    });
    return visible;
  }

  function renderSelection() {
    const chosen = snapshot.models.filter((model) => state.selected.has(model.id));
    const domestic = chosen.filter((model) => model.region === 'domestic').length;
    const overseas = chosen.length - domestic;
    const needsReview = chosen.filter((model) => getOfficial(model).status !== 'verified').length;
    elements.selectedCount.textContent = chosen.length;
    elements.selectedDomestic.textContent = domestic;
    elements.selectedOverseas.textContent = overseas;
    elements.selectedReview.textContent = needsReview;
    elements.download.disabled = chosen.length === 0;
    elements.copy.disabled = chosen.length === 0;
    elements.clear.disabled = chosen.length === 0;

    if (!chosen.length) {
      elements.selectionList.innerHTML = '<div class="selection-empty"><span>✓</span><strong>从左侧勾选候选模型</strong><p>选择会保存在当前浏览器，不会修改 Admin 配置。</p></div>';
      return;
    }
    elements.selectionList.innerHTML = ['domestic', 'overseas'].map((region) => {
      const regionModels = chosen.filter((model) => model.region === region);
      if (!regionModels.length) return '';
      return `<section class="selection-group"><h4><span>${regionLabels[region]}</span><span>${regionModels.length}</span></h4>${regionModels.map((model) => {
        const price = getOfficial(model);
        return `<article class="selection-item"><strong>${escapeHtml(model.name)}</strong><small>${escapeHtml(model.channelPlatform)} · ${escapeHtml(auditLabels[price.status])}</small><button type="button" class="remove-selection" data-model-key="${escapeHtml(model.id)}" aria-label="移除 ${escapeHtml(model.name)}">×</button></article>`;
      }).join('')}</section>`;
    }).join('');
  }

  function render() {
    renderCatalog();
    renderSelection();
  }

  function setSelected(keys, selected) {
    for (const key of keys) selected ? state.selected.add(key) : state.selected.delete(key);
    saveSelection();
    render();
  }

  function resetFilters() {
    state.region = 'all';
    state.search = '';
    state.modality = 'all';
    state.status = 'all';
    state.audit = 'all';
    elements.search.value = '';
    elements.modality.value = 'all';
    elements.status.value = 'all';
    elements.audit.value = 'all';
    document.querySelectorAll('.region-tab').forEach((tab) => {
      const active = tab.dataset.region === 'all';
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
    });
    render();
  }

  function showToast(message) {
    elements.toast.textContent = message;
    elements.toast.classList.add('is-visible');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => elements.toast.classList.remove('is-visible'), 2200);
  }

  function csvValue(value) {
    return `"${String(value ?? '').replaceAll('"', '""')}"`;
  }

  function exportCsv() {
    const chosen = snapshot.models.filter((model) => state.selected.has(model.id));
    const headers = ['区域', '本地渠道', '接入平台', '模型名', '逻辑模型ID', '真实上游ID', '真实原厂', '类型', '状态', '核价状态', '官方成本口径', '为什么还需确认', '本地成本摘要', '本地配置依据', '决策前动作', '官方来源'];
    const lines = [headers, ...chosen.map((model) => {
      const price = getOfficial(model);
      return [
        regionLabels[model.region], model.channel, model.channelPlatform, model.name, model.model, model.upstreamModel,
        model.maker, modalityLabels[model.modality] || model.modality, model.enabled ? '已启用' : '已停用',
        auditLabels[price.status] || price.status, `${price.headline}${price.detail ? `；${price.detail}` : ''}`,
        price.note || '', localSummary(model), price.localBasis || '人工录入，数据库未留原始换算依据', price.nextStep || '', sourceUrl(price),
      ];
    })].map((row) => row.map(csvValue).join(','));
    const blob = new Blob([`\ufeff${lines.join('\r\n')}`], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `模型成本勾选-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
    showToast(`已导出 ${chosen.length} 个候选模型`);
  }

  async function copySelection() {
    const chosen = snapshot.models.filter((model) => state.selected.has(model.id));
    const text = chosen.map((model, index) => {
      const price = getOfficial(model);
      return `${index + 1}. [${regionLabels[model.region]}] ${model.name}\n   渠道：${model.channelPlatform}｜原厂：${model.maker}\n   官方成本：${price.headline}（${auditLabels[price.status]}）\n   本地成本：${localSummary(model)}`;
    }).join('\n\n');
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    }
    showToast('勾选摘要已复制');
  }

  function initializeHeader() {
    const observedDate = snapshot.meta.observedAt?.slice(0, 10) || '—';
    document.getElementById('snapshotDate').textContent = observedDate;
    document.getElementById('metricModels').textContent = snapshot.stats.models;
    document.getElementById('metricEnabled').textContent = snapshot.stats.enabledModels;
    document.getElementById('metricChannels').textContent = snapshot.stats.channels;
    document.getElementById('metricVerified').textContent = snapshot.models.filter((model) => getOfficial(model).status === 'verified').length;
    document.getElementById('auditVerifiedCount').textContent = snapshot.models.filter((model) => getOfficial(model).status === 'verified').length;
    document.getElementById('auditReviewCount').textContent = snapshot.models.filter((model) => getOfficial(model).status === 'review').length;
    document.getElementById('auditUnverifiedCount').textContent = snapshot.models.filter((model) => getOfficial(model).status === 'unverified').length;
    document.getElementById('countAll').textContent = snapshot.stats.models;
    document.getElementById('countDomestic').textContent = snapshot.models.filter((model) => model.region === 'domestic').length;
    document.getElementById('countOverseas').textContent = snapshot.models.filter((model) => model.region === 'overseas').length;
    const excluded = snapshot.stats.excludedAbilityRows || 0;
    document.getElementById('snapshotEvidence').textContent = `${snapshot.meta.observedAt} 只读提取 ${snapshot.meta.database}：${snapshot.stats.channels} 个有效渠道、${snapshot.stats.models} 个逻辑模型、${snapshot.stats.abilityRows} 条可见能力配置；另排除 ${excluded} 条已删除渠道残留能力。官方价核对日期：${official.meta?.auditedAt || official.meta?.checkedAt || observedDate}。`;
  }

  document.querySelectorAll('.region-tab').forEach((tab) => tab.addEventListener('click', () => {
    state.region = tab.dataset.region;
    document.querySelectorAll('.region-tab').forEach((item) => {
      const active = item === tab;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-selected', String(active));
    });
    render();
  }));
  elements.search.addEventListener('input', () => { state.search = elements.search.value.trim(); render(); });
  elements.modality.addEventListener('change', () => { state.modality = elements.modality.value; render(); });
  elements.status.addEventListener('change', () => { state.status = elements.status.value; render(); });
  elements.audit.addEventListener('change', () => { state.audit = elements.audit.value; render(); });

  elements.catalog.addEventListener('change', (event) => {
    const selector = event.target.closest('.model-selector');
    if (selector) return setSelected([selector.dataset.modelKey], selector.checked);
    const channel = event.target.closest('.channel-selector');
    if (channel) {
      const keys = snapshot.models.filter(matches).filter((model) => model.channelId === Number(channel.dataset.channelId)).map((model) => model.id);
      setSelected(keys, channel.checked);
    }
  });

  function toggleExpanded(row) {
    const key = row?.dataset.modelKey;
    if (!key) return;
    state.expanded.has(key) ? state.expanded.delete(key) : state.expanded.add(key);
    render();
    const replacement = [...elements.catalog.querySelectorAll('.model-row')].find((item) => item.dataset.modelKey === key);
    replacement?.focus?.({ preventScroll: true });
  }

  elements.catalog.addEventListener('click', (event) => {
    if (event.target.closest('a, input, label')) return;
    if (event.target.closest('.expand-button, .model-identity')) toggleExpanded(event.target.closest('.model-row'));
  });
  elements.catalog.addEventListener('keydown', (event) => {
    if ((event.key === 'Enter' || event.key === ' ') && event.target.closest('.model-identity')) {
      event.preventDefault();
      toggleExpanded(event.target.closest('.model-row'));
    }
  });

  elements.selectionList.addEventListener('click', (event) => {
    const button = event.target.closest('.remove-selection');
    if (button) setSelected([button.dataset.modelKey], false);
  });
  document.getElementById('selectVisible').addEventListener('click', () => setSelected(snapshot.models.filter(matches).map((model) => model.id), true));
  document.getElementById('clearVisible').addEventListener('click', () => setSelected(snapshot.models.filter(matches).map((model) => model.id), false));
  elements.clear.addEventListener('click', () => setSelected([...state.selected], false));
  elements.download.addEventListener('click', exportCsv);
  elements.copy.addEventListener('click', copySelection);
  document.getElementById('resetFilters').addEventListener('click', resetFilters);
  document.getElementById('jumpToModels').addEventListener('click', () => document.getElementById('models').scrollIntoView({ behavior: 'smooth' }));
  document.getElementById('openMethodology').addEventListener('click', () => document.getElementById('methodology').scrollIntoView({ behavior: 'smooth', block: 'center' }));
  const locateErnie = document.getElementById('locateErnie');
  if (locateErnie) {
    locateErnie.addEventListener('click', () => {
      resetFilters();
      state.expanded.add('37:ernie-4.5-turbo-32k');
      render();
      requestAnimationFrame(() => {
        const row = [...elements.catalog.querySelectorAll('.model-row')].find((item) => item.dataset.modelKey === '37:ernie-4.5-turbo-32k');
        row?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        row?.classList.add('is-highlighted');
        setTimeout(() => row?.classList.remove('is-highlighted'), 1800);
      });
    });
  }
  document.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      elements.search.focus();
    }
  });

  initializeHeader();
  render();
})();
