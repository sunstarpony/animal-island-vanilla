/**
 * Animal Island UI — Vanilla JS
 * 纯原生 JS 交互逻辑，无需 React / Node.js
 *
 * 使用方式：
 *   <script src="js/animal-island.js"></script>
 *   然后在 HTML 中用 data 属性初始化，或调用 AnimalIsland.XXX() API
 */
(function (global) {
  'use strict';

  var AI = {};

  /* ============================================
     Time — 实时时钟
     ============================================ */
  AI.Time = function (el, options) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    if (!this.el) return;

    var o = (this.options = options || {});
    this.locale = o.locale === 'zh-cn' ? 'zh-cn' : 'en';
    this.weekdayFormat = o.weekdayFormat || 'dddd';
    this.dateFormat = o.dateFormat || (this.locale === 'zh-cn' ? 'M月D日' : 'MMM D');

    if (o.className) {
      String(o.className).split(/\s+/).forEach(function (cls) {
        if (cls) this.el.classList.add(cls);
      }, this);
    }
    if (o.style && typeof o.style === 'object') {
      Object.keys(o.style).forEach(function (key) {
        this.el.style[key] = o.style[key];
      }, this);
    }
    this.el.setAttribute('role', 'timer');
    this.el.setAttribute('aria-live', 'off');

    this._render();
    this._timer = setInterval(this._render.bind(this), 1000);
  };

  AI.Time.MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  AI.Time.MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  AI.Time.DAYS_MIN = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  AI.Time.DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  AI.Time.DAYS_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  AI.Time.MONTHS_SHORT_ZH = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  AI.Time.MONTHS_LONG_ZH = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
  AI.Time.DAYS_MIN_ZH = ['日', '一', '二', '三', '四', '五', '六'];
  AI.Time.DAYS_SHORT_ZH = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  AI.Time.DAYS_LONG_ZH = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

  /** dayjs 核心 token 的子集：locale 决定 dddd / ddd / dd / MMM / MMMM 的语言名 */
  AI.Time._format = function (date, fmt, locale) {
    var zh = locale === 'zh-cn';
    var lits = [];
    var out = String(fmt).replace(/\[[^\]]*\]/g, function (m) {
      lits.push(m.slice(1, -1));
      return '\u0001' + (lits.length - 1) + '\u0001';
    });
    var pad2 = function (n) { return String(n).padStart(2, '0'); };
    var hours = date.getHours();
    var map = {
      YYYY: String(date.getFullYear()),
      YY: String(date.getFullYear()).slice(-2),
      MMMM: (zh ? AI.Time.MONTHS_LONG_ZH : AI.Time.MONTHS_LONG)[date.getMonth()],
      MMM: (zh ? AI.Time.MONTHS_SHORT_ZH : AI.Time.MONTHS_SHORT)[date.getMonth()],
      MM: pad2(date.getMonth() + 1),
      M: String(date.getMonth() + 1),
      DD: pad2(date.getDate()),
      D: String(date.getDate()),
      HH: pad2(hours),
      H: String(hours),
      mm: pad2(date.getMinutes()),
      m: String(date.getMinutes()),
      ss: pad2(date.getSeconds()),
      s: String(date.getSeconds()),
      dddd: (zh ? AI.Time.DAYS_LONG_ZH : AI.Time.DAYS_LONG)[date.getDay()],
      ddd: (zh ? AI.Time.DAYS_SHORT_ZH : AI.Time.DAYS_SHORT)[date.getDay()],
      dd: (zh ? AI.Time.DAYS_MIN_ZH : AI.Time.DAYS_MIN)[date.getDay()],
      d: String(date.getDay()),
      A: hours < 12 ? 'AM' : 'PM',
      a: hours < 12 ? 'am' : 'pm'
    };
    out = out.replace(/YYYY|YY|MMMM|MMM|MM|M|DD|D|HH|H|mm|m|ss|s|dddd|ddd|dd|d|A|a/g, function (t) { return map[t]; });
    return out.replace(/\u0001(\d+)\u0001/g, function (_, i) { return lits[+i]; });
  };

  AI.Time.prototype._render = function () {
    var now = new Date();
    var hours = String(now.getHours()).padStart(2, '0');
    var minutes = String(now.getMinutes()).padStart(2, '0');

    this.el.innerHTML =
      '<div class="ai-time__clock">' +
        hours +
        '<span class="ai-time__colon">:</span>' +
        minutes +
      '</div>' +
      '<div class="ai-time__date">' +
        '<span class="ai-time__weekday">' + AI.Time._format(now, this.weekdayFormat, this.locale) + '</span>' +
        '<span class="ai-time__dot" aria-hidden="true">·</span>' +
        '<span class="ai-time__monthday">' + AI.Time._format(now, this.dateFormat, this.locale) + '</span>' +
      '</div>';
  };

  AI.Time.prototype.destroy = function () {
    if (this._timer) clearInterval(this._timer);
  };

  /* ============================================
     Input — 输入框（清除按钮 + prefix/suffix/shadow）
     ============================================ */
  AI.Input = function (el, options) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    if (!this.el) return;

    this.options = options || {};
    this.wrapper = this.el.closest('.ai-input-wrapper');
    if (!this.wrapper) return;
    this.onChange = this.options.onChange || null;
    this._isControlled = this.options.value !== undefined;

    // 受控 / 默认值
    if (this._isControlled) {
      this.el.value = this.options.value == null ? '' : this.options.value;
    } else if (this.options.defaultValue !== undefined && this.el.value === '') {
      this.el.value = this.options.defaultValue;
    }

    // 尺寸：small / middle / large → sm / md / lg
    if (this.options.size) {
      var sizeMap = { small: 'sm', middle: 'md', large: 'lg' };
      this.wrapper.classList.remove('ai-input-wrapper--sm', 'ai-input-wrapper--md', 'ai-input-wrapper--lg');
      this.wrapper.classList.add('ai-input-wrapper--' + (sizeMap[this.options.size] || 'md'));
    }

    // 校验状态
    if (this.options.status === 'error' || this.options.status === 'warning') {
      this.wrapper.classList.add('ai-input-wrapper--' + this.options.status);
      if (this.options.status === 'error') this.el.setAttribute('aria-invalid', 'true');
    }

    // 阴影：原版默认无阴影（shadow=false）；显式 --shadow 类优先
    if (!this.options.shadow && !this.wrapper.classList.contains('ai-input-wrapper--shadow')) {
      this.wrapper.classList.add('ai-input-wrapper--no-shadow');
    }

    // 禁用
    if (this.options.disabled) {
      this.wrapper.classList.add('ai-input-wrapper--disabled');
      this.el.disabled = true;
    }

    // Ensure prefix/suffix/clear elements exist
    if (this.options.prefix && !this.wrapper.querySelector('.ai-input__prefix')) {
      var prefix = document.createElement('span');
      prefix.className = 'ai-input__prefix';
      prefix.innerHTML = this.options.prefix;
      this.wrapper.insertBefore(prefix, this.el);
    }

    if (this.options.suffix && !this.wrapper.querySelector('.ai-input__suffix')) {
      var suffix = document.createElement('span');
      suffix.className = 'ai-input__suffix';
      suffix.innerHTML = this.options.suffix;
      this.wrapper.appendChild(suffix);
    }

    // allowClear support
    if (this.options.allowClear && !this.wrapper.querySelector('.ai-input__clear')) {
      var clearBtn = document.createElement('button');
      clearBtn.type = 'button';
      clearBtn.className = 'ai-input__clear';
      clearBtn.textContent = '×';
      clearBtn.setAttribute('aria-label', this.options.clearAriaLabel || '清除');
      clearBtn.style.display = 'none';
      // Insert before suffix if exists, otherwise append
      var suffixEl = this.wrapper.querySelector('.ai-input__suffix');
      if (suffixEl) {
        this.wrapper.insertBefore(clearBtn, suffixEl);
      } else {
        this.wrapper.appendChild(clearBtn);
      }
      this.clearBtn = clearBtn;
    } else {
      this.clearBtn = this.wrapper.querySelector('.ai-input__clear');
    }

    if (this.clearBtn) {
      if (!this.clearBtn.getAttribute('aria-label')) {
        this.clearBtn.setAttribute('aria-label', this.options.clearAriaLabel || '清除');
      }
      this.clearBtn.addEventListener('click', this._onClear.bind(this));
    }

    this._updateClearVisibility();
    this.el.addEventListener('input', this._onInput.bind(this));
    this.el.addEventListener('focus', this._onFocus.bind(this));
    this.el.addEventListener('blur', this._onBlur.bind(this));
  };

  AI.Input.prototype._onInput = function (e) {
    this._updateClearVisibility();
    if (this.onChange) this.onChange(e);
  };

  AI.Input.prototype._onClear = function () {
    if (!this._isControlled) this.el.value = '';
    this.el.dispatchEvent(new Event('input', { bubbles: true }));
    this.el.focus();
    this._updateClearVisibility();
    if (this.options.onClear) this.options.onClear();
  };

  AI.Input.prototype._updateClearVisibility = function () {
    if (!this.clearBtn) return;
    var disabled = this.wrapper && this.wrapper.classList.contains('ai-input-wrapper--disabled');
    this.clearBtn.style.display = (this.el.value && !disabled) ? '' : 'none';
  };

  AI.Input.prototype._onFocus = function () {
    if (this.wrapper && !this.wrapper.classList.contains('ai-input-wrapper--disabled')) {
      this.wrapper.classList.add('ai-input-wrapper--focused');
    }
  };

  AI.Input.prototype._onBlur = function () {
    if (this.wrapper) {
      this.wrapper.classList.remove('ai-input-wrapper--focused');
    }
  };

  /* ============================================
     Checkbox — 复选框组（vertical + 键盘支持）
     ============================================ */
  AI.Checkbox = function (el, options) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    if (!this.el) return;

    this.options = options || {};
    this.onChange = this.options.onChange || null;
    this._isControlled = this.options.value !== undefined;

    // 受控 value 优先，其次 defaultValue
    this._applyValues(this._isControlled ? this.options.value : (this.options.defaultValue || []));

    // Apply group disabled
    if (this.options.disabled) {
      this.el.classList.add('ai-checkbox-group--disabled');
    }

    // Apply direction
    if (this.options.direction === 'vertical') {
      this.el.classList.add('ai-checkbox-group--vertical');
    }

    // Apply size: small / middle / large → sm / md / lg
    if (this.options.size) this._applySize(this.options.size);

    this._syncFocusable();

    this.el._aiCheckbox = this;
    this.el.addEventListener('click', this._onClick.bind(this));
    this.el.addEventListener('keydown', this._onKeydown.bind(this));
  };

  AI.Checkbox.SIZE_MAP = { small: 'sm', middle: 'md', large: 'lg' };

  AI.Checkbox.prototype._applySize = function (size) {
    var cls = 'ai-checkbox-item--' + (AI.Checkbox.SIZE_MAP[size] || 'md');
    this.el.querySelectorAll('.ai-checkbox-item').forEach(function (item) {
      item.classList.remove('ai-checkbox-item--sm', 'ai-checkbox-item--md', 'ai-checkbox-item--lg');
      item.classList.add(cls);
    });
  };

  AI.Checkbox.prototype._applyValues = function (values) {
    var list = (values || []).map(String);
    this.el.querySelectorAll('.ai-checkbox-item').forEach(function (item) {
      var on = list.indexOf(String(item.getAttribute('data-value'))) !== -1;
      item.classList.toggle('ai-checkbox-item--checked', on);
      var checkmark = item.querySelector('.ai-checkbox-checkmark');
      if (checkmark) checkmark.style.display = on ? 'flex' : 'none';
    });
  };

  AI.Checkbox.prototype._syncFocusable = function () {
    var groupDisabled = this.el.classList.contains('ai-checkbox-group--disabled');
    this.el.querySelectorAll('.ai-checkbox-box').forEach(function (box) {
      var item = box.closest('.ai-checkbox-item');
      var off = groupDisabled || !item || item.classList.contains('ai-checkbox-item--disabled');
      if (off) box.removeAttribute('tabindex');
      else box.setAttribute('tabindex', '0');
    });
  };

  AI.Checkbox.prototype._onClick = function (e) {
    var item = e.target.closest('.ai-checkbox-item');
    if (!item || item.classList.contains('ai-checkbox-item--disabled')) return;
    if (this.el.classList.contains('ai-checkbox-group--disabled')) return;
    this._toggleItem(item);
  };

  AI.Checkbox.prototype._onKeydown = function (e) {
    if (e.key !== ' ' && e.key !== 'Enter') return;
    var box = e.target.closest('.ai-checkbox-box');
    if (!box) return;
    var item = box.closest('.ai-checkbox-item');
    if (!item || item.classList.contains('ai-checkbox-item--disabled')) return;
    if (this.el.classList.contains('ai-checkbox-group--disabled')) return;
    e.preventDefault();
    this._toggleItem(item);
  };

  AI.Checkbox.prototype._toggleItem = function (item) {
    var val = item.getAttribute('data-value');
    var checked = item.classList.contains('ai-checkbox-item--checked');
    var values = this.getValues();
    var next = checked ? values.filter(function (v) { return v !== val; }) : values.concat([val]);

    if (!this._isControlled) {
      this._applyValues(next);
    }

    this.el.dispatchEvent(new CustomEvent('ai-checkbox-change', { detail: { values: next }, bubbles: true }));
    if (this.onChange) this.onChange(next);
  };

  AI.Checkbox.prototype.getValues = function () {
    var values = [];
    this.el.querySelectorAll('.ai-checkbox-item--checked').forEach(function (item) {
      values.push(item.getAttribute('data-value'));
    });
    return values;
  };

  AI.Checkbox.prototype.update = function (next) {
    var o = next || {};
    Object.keys(o).forEach(function (k) { this.options[k] = o[k]; }, this);
    if ('value' in o) {
      this._isControlled = true;
      this._applyValues(o.value);
    } else if ('defaultValue' in o && !this._isControlled) {
      this._applyValues(o.defaultValue);
    }
    if ('size' in o && o.size) this._applySize(o.size);
    if ('disabled' in o) {
      this.el.classList.toggle('ai-checkbox-group--disabled', !!o.disabled);
      this._syncFocusable();
    }
    if ('direction' in o) {
      this.el.classList.toggle('ai-checkbox-group--vertical', o.direction === 'vertical');
    }
  };

  /* ============================================
     Switch — 开关
     ============================================ */
  AI.Switch = function (el, options) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    if (!this.el) return;
    // 幂等：autoInit 可能被多次调用，重复构造会导致一次点击翻转两次
    if (this.el._aiSwitch) return;
    this.el._aiSwitch = true;

    this.options = options || {};
    this.onChange = this.options.onChange || null;
    this._isControlled = this.options.checked !== undefined;
    this._checked = this._isControlled
      ? !!this.options.checked
      : (this.options.defaultChecked !== undefined
          ? !!this.options.defaultChecked
          : this.el.classList.contains('ai-switch--checked'));

    // Ensure handle and inner elements exist
    if (!this.el.querySelector('.ai-switch__handle')) {
      var handle = document.createElement('span');
      handle.className = 'ai-switch__handle';
      this.el.insertBefore(handle, this.el.firstChild);
    }
    if (!this.el.querySelector('.ai-switch__inner')) {
      var inner = document.createElement('span');
      inner.className = 'ai-switch__inner';
      this.el.appendChild(inner);
    }

    // 尺寸 / 禁用 / 语义
    var size = this.options.size || (this.el.classList.contains('ai-switch--sm') ? 'small' : 'default');
    this.el.classList.toggle('ai-switch--sm', size === 'small');
    if (this.options.disabled) this.el.classList.add('ai-switch--disabled');
    if (!this.el.hasAttribute('role')) this.el.setAttribute('role', 'switch');
    if (!this.el.hasAttribute('tabindex') && this.el.tagName !== 'BUTTON') this.el.setAttribute('tabindex', '0');

    // Apply loading state
    if (this.options.loading || this.el.classList.contains('ai-switch--loading')) {
      this.el.classList.add('ai-switch--loading');
      var handle = this.el.querySelector('.ai-switch__handle');
      if (handle && !handle.querySelector('.ai-switch__spinner')) {
        var spinner = document.createElement('span');
        spinner.className = 'ai-switch__spinner';
        handle.appendChild(spinner);
      }
      this.el.setAttribute('aria-busy', 'true');
    }

    this._applyChecked();

    this.el.addEventListener('click', this._onClick.bind(this));
    this.el.addEventListener('keydown', this._onKeydown.bind(this));
  };

  AI.Switch.prototype._applyChecked = function () {
    var isChecked = this._checked;
    this.el.classList.toggle('ai-switch--checked', isChecked);
    this.el.setAttribute('aria-checked', String(isChecked));
    var inner = this.el.querySelector('.ai-switch__inner');
    if (inner) {
      var checkedText = this.el.getAttribute('data-checked-text') || this.options.checkedChildren || '';
      var uncheckedText = this.el.getAttribute('data-unchecked-text') || this.options.unCheckedChildren || '';
      inner.innerHTML = isChecked ? checkedText : uncheckedText;
    }
  };

  AI.Switch.prototype._onKeydown = function (e) {
    if (e.key !== ' ' && e.key !== 'Enter') return;
    e.preventDefault();
    this._onClick();
  };

  AI.Switch.prototype._onClick = function () {
    if (this.el.classList.contains('ai-switch--disabled') ||
        this.el.classList.contains('ai-switch--loading') ||
        this.options.disabled || this.options.loading) return;

    var next = !this._checked;
    // 受控模式下由外部通过 update({ checked }) 回写，此处仅通知
    if (!this._isControlled) {
      this._checked = next;
      this._applyChecked();
    }

    this.el.dispatchEvent(new CustomEvent('ai-switch-change', { detail: { checked: next }, bubbles: true }));
    if (this.onChange) this.onChange(next);
  };

  AI.Switch.prototype.update = function (next) {
    var o = next || {};
    Object.keys(o).forEach(function (k) { this.options[k] = o[k]; }, this);
    if ('checked' in o) {
      this._isControlled = true;
      this._checked = !!o.checked;
    } else if ('defaultChecked' in o && !this._isControlled) {
      this._checked = !!o.defaultChecked;
    }
    if ('size' in o) this.el.classList.toggle('ai-switch--sm', o.size === 'small');
    if ('disabled' in o) this.el.classList.toggle('ai-switch--disabled', !!o.disabled);
    this._applyChecked();
  };

  /* ============================================
     Select — 下拉选择（含 option-dot）
     ============================================ */
  AI.Select = function (el, options) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    if (!this.el) return;

    this.options = options || {};
    this.onChange = this.options.onChange || null;
    this.onClear = this.options.onClear || null;
    this.onSearch = this.options.onSearch || null;
    this.variant = this.options.variant || this.el.getAttribute('data-variant') || 'default';
    this.allowClear = !!this.options.allowClear;
    this.showSearch = !!this.options.showSearch;
    this.disabled = !!this.options.disabled || this.el.classList.contains('ai-select--disabled');
    this.placeholderText = this.options.placeholder || this.el.getAttribute('data-placeholder') || '请选择';
    this.notFoundContent = this.options.notFoundContent || '暂无数据';
    this.clearAriaLabel = this.options.clearAriaLabel || '清除';
    this.isOpen = false;
    this._activeKey = null;

    this.trigger = this.el.querySelector('.ai-select__trigger');
    this.dropdown = this.el.querySelector('.ai-select__dropdown');
    this.valueEl = this.el.querySelector('.ai-select__value');
    this.placeholderEl = this.el.querySelector('.ai-select__placeholder');

    if (!this.trigger || !this.dropdown) return;

    // Ensure arrow SVG exists
    if (!this.trigger.querySelector('.ai-select__arrow')) {
      var arrow = document.createElement('span');
      arrow.className = 'ai-select__arrow';
      arrow.innerHTML = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      this.trigger.appendChild(arrow);
    }

    // Ensure each option has dot and pill
    this.dropdown.querySelectorAll('.ai-select__option').forEach(function (opt) {
      if (!opt.querySelector('.ai-select__option-dot')) {
        var dot = document.createElement('span');
        dot.className = 'ai-select__option-dot';
        opt.insertBefore(dot, opt.firstChild);
      }
      if (!opt.querySelector('.ai-select__pill')) {
        var pill = document.createElement('div');
        pill.className = 'ai-select__pill';
        pill.style.display = 'none';
        opt.appendChild(pill);
      }
    });

    // 空结果占位（listbox 内以禁用 option 呈现）
    this.notFoundEl = document.createElement('div');
    this.notFoundEl.className = 'ai-select__not-found';
    this.notFoundEl.setAttribute('role', 'option');
    this.notFoundEl.setAttribute('aria-disabled', 'true');
    this.notFoundEl.textContent = this.notFoundContent;
    this.notFoundEl.style.display = 'none';
    this.dropdown.appendChild(this.notFoundEl);

    // 可搜索：触发区内改为输入框（回显选中 label，输入即过滤）
    if (this.showSearch) {
      this.searchInput = document.createElement('input');
      this.searchInput.className = 'ai-select__search';
      this.searchInput.type = 'text';
      this.searchInput.autocomplete = 'off';
      this.searchInput.placeholder = this.placeholderText;
      this.searchInput.setAttribute('role', 'combobox');
      this.searchInput.setAttribute('aria-autocomplete', 'list');
      this.searchInput.setAttribute('aria-label', this.options['aria-label'] || this.placeholderText);
      if (this.disabled) this.searchInput.disabled = true;
      this.trigger.insertBefore(this.searchInput, this.trigger.firstChild);
      if (this.valueEl) this.valueEl.style.display = 'none';
      if (this.placeholderEl) this.placeholderEl.style.display = 'none';
      this.searchInput.addEventListener('input', this._onSearchInput.bind(this));
      this.searchInput.addEventListener('keydown', this._onKeydown.bind(this));
    }

    // 可清空
    if (this.allowClear) {
      this.clearBtn = document.createElement('button');
      this.clearBtn.type = 'button';
      this.clearBtn.className = 'ai-select__clear';
      this.clearBtn.setAttribute('aria-label', this.clearAriaLabel);
      this.clearBtn.innerHTML = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 3l6 6M9 3L3 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
      this.clearBtn.style.display = 'none';
      this.trigger.insertBefore(this.clearBtn, this.trigger.querySelector('.ai-select__arrow') || null);
      this.clearBtn.addEventListener('click', this._onClearClick.bind(this));
      this.clearBtn.addEventListener('mousedown', function (e) { e.preventDefault(); });
      this.el.addEventListener('mouseenter', this._syncClear.bind(this));
      this.el.addEventListener('mouseleave', this._syncClear.bind(this));
    }

    // 初始值：受控 value 优先，其次 data-value
    var currentValue = this.options.value !== undefined ? this.options.value : this.el.getAttribute('data-value');
    this._applyValue(currentValue, null, false);

    if (!this.showSearch) {
      this.trigger.setAttribute('role', 'combobox');
      this.trigger.setAttribute('aria-haspopup', 'listbox');
      this.trigger.setAttribute('tabindex', this.disabled ? '-1' : '0');
      this.trigger.setAttribute('aria-expanded', 'false');
    } else {
      this.trigger.setAttribute('aria-expanded', 'false');
    }
    if (this.disabled) this.trigger.setAttribute('aria-disabled', 'true');

    this.trigger.addEventListener('click', this._onTriggerClick.bind(this));
    if (!this.showSearch) this.trigger.addEventListener('keydown', this._onKeydown.bind(this));
    this.dropdown.addEventListener('click', this._onSelect.bind(this));
    this.dropdown.addEventListener('mousemove', this._onHover.bind(this));
    document.addEventListener('click', this._onClickOutside.bind(this));
  };

  AI.Select.prototype._optionsArray = function () {
    return Array.prototype.slice.call(this.dropdown.querySelectorAll('.ai-select__option'));
  };

  AI.Select.prototype._labelOf = function (opt) {
    var labelEl = opt.querySelector('.ai-select__option-label');
    return labelEl ? labelEl.textContent.trim() : opt.textContent.trim();
  };

  AI.Select.prototype._applyValue = function (key, label, fire) {
    var target = null;
    this._optionsArray().forEach(function (opt) {
      var on = key != null && key !== '' && opt.getAttribute('data-key') === String(key);
      opt.classList.toggle('ai-select__option--active', on);
      opt.setAttribute('aria-selected', String(on));
      var pill = opt.querySelector('.ai-select__pill');
      if (pill) pill.style.display = on ? 'block' : 'none';
      if (on) target = opt;
    });

    if (typeof label !== 'string') label = target ? this._labelOf(target) : '';

    if (key != null && key !== '' && target) {
      if (this.valueEl) {
        this.valueEl.textContent = label;
        this.valueEl.style.display = '';
      }
      if (this.placeholderEl) this.placeholderEl.style.display = 'none';
      this.el.setAttribute('data-value', key);
    } else {
      if (this.valueEl) this.valueEl.style.display = 'none';
      if (this.placeholderEl) this.placeholderEl.style.display = '';
      this.el.removeAttribute('data-value');
      key = '';
    }

    if (this.searchInput) this.searchInput.value = label || '';
    this._activeKey = key || null;
    this._syncClear();

    if (fire) {
      this.el.dispatchEvent(new CustomEvent('ai-select-change', { detail: { key: key, label: label }, bubbles: true }));
      if (this.onChange) this.onChange(key);
    }
  };

  AI.Select.prototype._syncClear = function () {
    if (!this.clearBtn) return;
    var hasValue = !!this.el.getAttribute('data-value');
    var hovered = this.el.matches(':hover');
    this.clearBtn.style.display = hasValue && hovered && !this.disabled ? '' : 'none';
  };

  AI.Select.prototype._onClearClick = function (e) {
    e.stopPropagation();
    this._applyValue('', '', true);
    if (this.onClear) this.onClear();
    this._focusTrigger();
  };

  AI.Select.prototype._onTriggerClick = function (e) {
    if (this.disabled) return;
    if (this.clearBtn && this.clearBtn.contains(e.target)) return;
    if (this.searchInput && e.target === this.searchInput && this.isOpen) return;
    this.isOpen ? this._close() : this._open();
  };

  AI.Select.prototype._open = function () {
    if (this.disabled) return;
    this.isOpen = true;
    this.trigger.classList.add('ai-select__trigger--open');
    this.trigger.setAttribute('aria-expanded', 'true');
    this.dropdown.style.display = 'block';
    this._filter('');
    this._resetPosition();

    if (this.variant === 'game') {
      this._positionGame();
    } else {
      this._positionDefault();
    }

    // 键盘/鼠标高亮默认落在已选项，无则第一项
    var initial = this.dropdown.querySelector('.ai-select__option--active') || this._optionsArray()[0];
    if (initial) this._setKeyboardActive(initial);

    if (this.searchInput) {
      var self = this;
      setTimeout(function () {
        self.searchInput.value = '';
        self.searchInput.focus();
      }, 0);
    }
  };

  AI.Select.prototype._positionGame = function () {
    var rect = this.el.getBoundingClientRect();
    var viewportWidth = window.innerWidth;
    var dropdownHeight = this.dropdown.offsetHeight || 200;

    if (rect.right + 200 > viewportWidth) {
      this.dropdown.style.right = '100%';
      this.dropdown.style.marginRight = '6px';
      this.dropdown.style.left = 'auto';
    } else {
      this.dropdown.style.left = '100%';
      this.dropdown.style.marginLeft = '6px';
      this.dropdown.style.right = 'auto';
    }

    var spaceBelow = window.innerHeight - rect.bottom;
    if (spaceBelow < dropdownHeight) {
      this.dropdown.style.top = 'auto';
      this.dropdown.style.bottom = '100%';
      this.dropdown.style.marginBottom = '6px';
    } else {
      this.dropdown.style.top = '50%';
      this.dropdown.style.transform = 'translateY(-50%)';
      this.dropdown.style.bottom = 'auto';
    }
  };

  AI.Select.prototype._positionDefault = function () {
    var rect = this.el.getBoundingClientRect();
    var ddRect = this.dropdown.getBoundingClientRect();
    var spaceBelow = window.innerHeight - rect.bottom;
    var spaceAbove = rect.top;

    this.dropdown.style.left = '50%';
    this.dropdown.style.transform = 'translateX(-50%)';
    this.dropdown.style.right = 'auto';

    if (spaceBelow < ddRect.height + 8 && spaceAbove > spaceBelow) {
      this.dropdown.style.top = 'auto';
      this.dropdown.style.bottom = '100%';
      this.dropdown.style.marginBottom = '6px';
      this.dropdown.style.marginTop = '0';
    } else {
      this.dropdown.style.top = '100%';
      this.dropdown.style.bottom = 'auto';
      this.dropdown.style.marginTop = '6px';
      this.dropdown.style.marginBottom = '0';
    }

    // 视口边界修正
    var left = rect.left + rect.width / 2 - ddRect.width / 2;
    var right = left + ddRect.width;
    var offset = 0;
    if (left < 8) offset = 8 - left;
    else if (right > window.innerWidth - 8) offset = (window.innerWidth - 8) - right;
    this.dropdown.style.marginLeft = (offset ? offset : 0) + 'px';
  };

  AI.Select.prototype._resetPosition = function () {
    this.dropdown.style.left = '';
    this.dropdown.style.right = '';
    this.dropdown.style.top = '';
    this.dropdown.style.bottom = '';
    this.dropdown.style.marginLeft = '';
    this.dropdown.style.marginRight = '';
    this.dropdown.style.marginTop = '';
    this.dropdown.style.marginBottom = '';
    this.dropdown.style.transform = '';
  };

  AI.Select.prototype._close = function () {
    this.isOpen = false;
    this.trigger.setAttribute('aria-expanded', 'false');
    this.dropdown.classList.add('ai-select__dropdown--closing');
    if (this.searchInput) {
      this.searchInput.value = this.el.getAttribute('data-value') ? (this.valueEl ? this.valueEl.textContent : '') : '';
    }
    this._filter('');
    setTimeout(function () {
      this.dropdown.style.display = 'none';
      this.dropdown.classList.remove('ai-select__dropdown--closing');
      this.trigger.classList.remove('ai-select__trigger--open');
    }.bind(this), 150);
  };

  AI.Select.prototype._focusTrigger = function () {
    if (this.searchInput) this.searchInput.focus();
    else this.trigger.focus();
  };

  AI.Select.prototype._setKeyboardActive = function (opt) {
    this.dropdown.querySelectorAll('.ai-select__option').forEach(function (o) {
      o.classList.remove('ai-select__option--hovered');
    });
    if (!opt) return;
    opt.classList.add('ai-select__option--hovered');
    this._activeKey = opt.getAttribute('data-key');
  };

  AI.Select.prototype._moveActive = function (delta) {
    var options = this._optionsArray().filter(function (o) { return o.style.display !== 'none'; });
    if (!options.length) return;
    var current = options.indexOf(this.dropdown.querySelector('.ai-select__option--hovered'));
    if (current < 0) current = 0;
    var next = Math.min(Math.max(current + delta, 0), options.length - 1);
    this._setKeyboardActive(options[next]);
  };

  AI.Select.prototype._onKeydown = function (e) {
    if (this.disabled) return;
    var key = e.key;
    if (key === 'Escape') {
      if (this.isOpen) {
        e.preventDefault();
        this._close();
        this._focusTrigger();
      }
      return;
    }
    if (key === 'ArrowDown' || key === 'ArrowUp') {
      e.preventDefault();
      if (!this.isOpen) {
        this._open();
        return;
      }
      this._moveActive(key === 'ArrowDown' ? 1 : -1);
      return;
    }
    if (key === 'Home' || key === 'End') {
      if (!this.isOpen) return;
      e.preventDefault();
      var visible = this._optionsArray().filter(function (o) { return o.style.display !== 'none'; });
      if (visible.length) this._setKeyboardActive(key === 'Home' ? visible[0] : visible[visible.length - 1]);
      return;
    }
    if (key === 'Enter') {
      var hovered = this.dropdown.querySelector('.ai-select__option--hovered');
      if (this.isOpen && hovered) {
        e.preventDefault();
        this._selectOption(hovered);
      } else if (!this.isOpen) {
        e.preventDefault();
        this._open();
      }
    }
  };

  AI.Select.prototype._onSearchInput = function (e) {
    var query = e.target.value;
    if (!this.isOpen) this._open();
    this._filter(query);
    if (this.onSearch) this.onSearch(query);
  };

  AI.Select.prototype._filter = function (query) {
    var q = (query || '').trim().toLowerCase();
    var visible = 0;
    this._optionsArray().forEach(function (opt) {
      var match = !q || this._labelOf(opt).toLowerCase().indexOf(q) !== -1;
      opt.style.display = match ? '' : 'none';
      if (match) visible++;
    }, this);
    if (this.notFoundEl) this.notFoundEl.style.display = visible ? 'none' : '';
    if (!visible) this._setKeyboardActive(null);
  };

  AI.Select.prototype._selectOption = function (option) {
    var key = option.getAttribute('data-key');
    var label = this._labelOf(option);
    this._applyValue(key, label, true);
    this._close();
    this._focusTrigger();
  };

  AI.Select.prototype._onSelect = function (e) {
    var option = e.target.closest('.ai-select__option');
    if (!option) return;
    this._selectOption(option);
  };

  AI.Select.prototype._onHover = function (e) {
    var option = e.target.closest('.ai-select__option');
    if (!option || option.style.display === 'none') return;
    this.dropdown.querySelectorAll('.ai-select__option').forEach(function (opt) {
      opt.classList.remove('ai-select__option--hovered');
    });
    option.classList.add('ai-select__option--hovered');
    this._activeKey = option.getAttribute('data-key');
  };

  AI.Select.prototype._onClickOutside = function (e) {
    if (this.isOpen && !this.el.contains(e.target)) {
      this._close();
    }
  };

  AI.Select.prototype.update = function (next) {
    var o = next || {};
    Object.keys(o).forEach(function (k) { this.options[k] = o[k]; }, this);
    if ('value' in o) this._applyValue(o.value, null, false);
    if ('disabled' in o) {
      this.disabled = !!o.disabled;
      this.el.classList.toggle('ai-select--disabled', this.disabled);
      this.trigger.setAttribute('aria-disabled', String(this.disabled));
      if (!this.showSearch) this.trigger.setAttribute('tabindex', this.disabled ? '-1' : '0');
      if (this.searchInput) this.searchInput.disabled = this.disabled;
      if (this.disabled && this.isOpen) this._close();
    }
  };

  /* ============================================
     Tabs — 选项卡（含 leaf 叶子装饰）
     ============================================ */
  AI.Tabs = function (el, options) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    if (!this.el) return;

    this.options = options || {};
    this.onChange = this.options.onChange || null;

    this.tabList = this.el.querySelector('.ai-tabs__list');
    if (!this.tabList) return;

    this.shadow = this.options.shadow !== undefined ? this.options.shadow : true;
    // leafAnimation 在原版已废弃（叶子装饰移除），此处仅为兼容入参保留

    this.tabList.addEventListener('click', this._onClick.bind(this));
    this.tabList.addEventListener('keydown', this._onKeydown.bind(this));

    var activeTab = this.tabList.querySelector('.ai-tabs__item--active');
    if (!activeTab) {
      var firstTab = this.tabList.querySelector('.ai-tabs__item');
      if (firstTab) this._activate(firstTab);
    } else {
      // 已有激活项时同步 aria 状态，不触发 change 事件
      this.tabList.querySelectorAll('.ai-tabs__item').forEach(function (t) {
        var on = t === activeTab;
        t.setAttribute('aria-selected', String(on));
        t.setAttribute('tabindex', on ? '0' : '-1');
      });
    }
  };

  AI.Tabs.prototype._onClick = function (e) {
    var tab = e.target.closest('.ai-tabs__item');
    if (!tab) return;
    this._activate(tab);
    if (this.onChange) this.onChange(tab.getAttribute('data-key'));
  };

  AI.Tabs.prototype._onKeydown = function (e) {
    var key = e.key;
    if (key !== 'ArrowRight' && key !== 'ArrowLeft' && key !== 'Home' && key !== 'End') return;
    var tabs = Array.prototype.slice.call(this.tabList.querySelectorAll('.ai-tabs__item'));
    if (!tabs.length) return;
    e.preventDefault();
    var current = tabs.indexOf(this.tabList.querySelector('.ai-tabs__item--active'));
    if (current < 0) current = 0;
    var next = current;
    if (key === 'ArrowRight') next = (current + 1) % tabs.length;
    else if (key === 'ArrowLeft') next = (current - 1 + tabs.length) % tabs.length;
    else if (key === 'Home') next = 0;
    else if (key === 'End') next = tabs.length - 1;
    var target = tabs[next];
    this._activate(target);
    target.focus();
    if (this.onChange) this.onChange(target.getAttribute('data-key'));
  };

  AI.Tabs.prototype._activate = function (tab) {
    this.tabList.querySelectorAll('.ai-tabs__item').forEach(function (t) {
      t.classList.remove('ai-tabs__item--active', 'ai-tabs__item--active-shadow', 'ai-tabs__item--active-leaf');
      t.setAttribute('aria-selected', 'false');
      t.setAttribute('tabindex', '-1');
      var icon = t.querySelector('.ai-tabs__icon');
      if (icon) icon.textContent = '○';
    });

    tab.classList.add('ai-tabs__item--active');
    if (this.shadow) tab.classList.add('ai-tabs__item--active-shadow');

    var activeIcon = tab.querySelector('.ai-tabs__icon');
    if (activeIcon) activeIcon.textContent = '●';

    var key = tab.getAttribute('data-key');
    this.el.querySelectorAll('.ai-tabs__panel').forEach(function (panel) {
      panel.style.display = panel.getAttribute('data-key') === key ? 'block' : 'none';
    });

    this.el.dispatchEvent(new CustomEvent('ai-tabs-change', { detail: { key: key }, bubbles: true }));
  };

  /* ============================================
     Collapse — 折叠面板（含高度过渡动画）
     ============================================ */
  AI.Collapse = function (el, options) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    if (!this.el) return;

    this.options = options || {};

    // Ensure leaf decoration exists
    var header = this.el.querySelector('.ai-collapse__header');
    if (header && !header.querySelector('.ai-collapse__leaf')) {
      var leaf = document.createElement('span');
      leaf.className = 'ai-collapse__leaf';
      leaf.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"/></svg>';
      header.appendChild(leaf);
    }

    // Apply defaultExpanded
    var defaultExpanded = this.options.defaultExpanded || this.el.classList.contains('ai-collapse--expanded');
    if (defaultExpanded && !this.el.classList.contains('ai-collapse--expanded')) {
      this.el.classList.add('ai-collapse--expanded');
      var icon = this.el.querySelector('.ai-collapse__icon');
      if (icon) icon.textContent = '−';
    }

    if (header) {
      header.addEventListener('click', this._onClick.bind(this));
    }
  };

  AI.Collapse.prototype._onClick = function () {
    if (this.el.classList.contains('ai-collapse--disabled')) return;
    this.el.classList.toggle('ai-collapse--expanded');

    var expanded = this.el.classList.contains('ai-collapse--expanded');
    var header = this.el.querySelector('.ai-collapse__header');
    if (header) header.setAttribute('aria-expanded', expanded);

    var icon = this.el.querySelector('.ai-collapse__icon');
    if (icon) icon.textContent = expanded ? '−' : '+';

    this.el.dispatchEvent(new CustomEvent('ai-collapse-change', { detail: { expanded: expanded }, bubbles: true }));
  };

  /* ============================================
     Table — 表格（动态渲染 + loading + 空状态）
     ============================================ */
  AI.Table = function (el, options) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    if (!this.el) return;

    this.options = options || {};
    this.columns = this.options.columns || [];
    this.dataSource = this.options.dataSource || [];
    this.striped = this.options.striped !== false;
    this.showHeader = this.options.showHeader !== false;
    this.emptyText = this.options.emptyText || '暂无数据';
    this.loading = this.options.loading || false;
    this.rowKey = this.options.rowKey || 'key';
    this.rowClassName = this.options.rowClassName || null;
    this.onRow = this.options.onRow || null;
    this.scroll = this.options.scroll || null;

    // 分页：传对象开启客户端分页（total 内部计算），false / 缺省不分页
    var pagination = this.options.pagination;
    this.paginated = pagination !== false && pagination !== undefined;
    this.paginationOptions = this.paginated ? (pagination || {}) : {};
    this._innerPage = this.paginated ? (this.paginationOptions.defaultCurrent || 1) : 1;
    this._innerPageSize = this.paginated ? (this.paginationOptions.defaultPageSize || 10) : 10;

    this._render();
  };

  AI.Table.prototype._render = function () {
    var isScrollable = this.scroll && (this.scroll.x || this.scroll.y);
    var wrapperCls = 'ai-table-wrapper' + (isScrollable ? ' ai-table-wrapper--scrollable' : '');

    // 客户端分页：受控 current / pageSize 优先，否则用内部状态
    var pageSize = this.paginated
      ? (this.paginationOptions.pageSize !== undefined ? this.paginationOptions.pageSize : this._innerPageSize)
      : this.dataSource.length;
    var pageCount = Math.max(1, Math.ceil(this.dataSource.length / Math.max(1, pageSize)));
    var currentPage = this.paginated
      ? Math.min(this.paginationOptions.current !== undefined ? this.paginationOptions.current : this._innerPage, pageCount)
      : 1;
    this._currentPage = currentPage;
    this._pageSize = pageSize;
    this._pageData = this.paginated
      ? this.dataSource.slice((currentPage - 1) * pageSize, currentPage * pageSize)
      : this.dataSource;

    var wrapperStyle = '';
    if (this.scroll) {
      if (this.scroll.y) wrapperStyle += 'max-height:' + this.scroll.y + 'px;';
      if (this.scroll.x) wrapperStyle += 'min-width:' + this.scroll.x + 'px;';
    }

    var html = '<div class="' + wrapperCls + '"' + (wrapperStyle ? ' style="' + wrapperStyle + '"' : '') + '>';
    html += '<table class="ai-table">';

    if (this.showHeader && this.columns.length) {
      html += '<thead class="ai-table__thead"><tr class="ai-table__header-row">';
      for (var i = 0; i < this.columns.length; i++) {
        var col = this.columns[i];
        var align = col.align || 'left';
        var w = col.width ? ' width="' + col.width + '"' : '';
        var colStyle = '';
        if (col.style) {
          for (var sk in col.style) {
            if (col.style.hasOwnProperty(sk)) {
              colStyle += sk.replace(/([A-Z])/g, '-$1').toLowerCase() + ':' + col.style[sk] + ';';
            }
          }
        }
        var styleAttr = 'text-align:' + align + ';' + colStyle;
        html += '<th class="ai-table__header-cell" style="' + styleAttr + '"' + w + '>' + col.title + '</th>';
      }
      html += '</tr></thead>';
    }

    html += '<tbody class="ai-table__tbody">';
    if (this.dataSource.length === 0) {
      html += '<tr><td colspan="' + Math.max(this.columns.length, 1) + '" class="ai-table__empty">' +
        '<div class="ai-table__empty-content">' +
          '<svg class="ai-table__empty-icon" viewBox="0 0 24 24" width="48" height="48">' +
            '<path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z"/>' +
          '</svg>' +
          '<span>' + this.emptyText + '</span>' +
        '</div>' +
      '</td></tr>';
    } else {
      for (var r = 0; r < this._pageData.length; r++) {
        var record = this._pageData[r];
        var rowCls = 'ai-table__row';
        if (this.striped && r % 2 === 1) rowCls += ' ai-table__row--striped';

        // rowClassName support
        if (this.rowClassName) {
          if (typeof this.rowClassName === 'function') {
            var extraCls = this.rowClassName(record, r);
            if (extraCls) rowCls += ' ' + extraCls;
          } else {
            rowCls += ' ' + this.rowClassName;
          }
        }

        // rowKey
        var rowKeyVal = '';
        if (typeof this.rowKey === 'function') {
          rowKeyVal = this.rowKey(record);
        } else {
          rowKeyVal = record[this.rowKey] || String(r);
        }

        // onRow attributes
        var rowAttrs = ' class="' + rowCls + '" data-row-key="' + rowKeyVal + '"';
        if (this.onRow) {
          var rowProps = this.onRow(record, r);
          if (rowProps) {
            if (rowProps.className) rowAttrs = ' class="' + rowCls + ' ' + rowProps.className + '" data-row-key="' + rowKeyVal + '"';
            if (rowProps.onClick) rowAttrs += ' onclick="this.__onRowClick && this.__onRowClick()"';
            if (rowProps.style) {
              var rs = '';
              for (var rk in rowProps.style) {
                if (rowProps.style.hasOwnProperty(rk)) {
                  rs += rk.replace(/([A-Z])/g, '-$1').toLowerCase() + ':' + rowProps.style[rk] + ';';
                }
              }
              if (rs) rowAttrs += ' style="' + rs + '"';
            }
          }
        }

        html += '<tr' + rowAttrs + '>';
        for (var c = 0; c < this.columns.length; c++) {
          var col2 = this.columns[c];
          var val = col2.dataIndex ? record[col2.dataIndex] : undefined;
          var cellContent = col2.render ? col2.render(val, record, r) : (val != null ? val : '');
          var a2 = col2.align || 'left';
          var cellStyle = 'text-align:' + a2 + ';';
          if (col2.style) {
            for (var cs in col2.style) {
              if (col2.style.hasOwnProperty(cs)) {
                cellStyle += cs.replace(/([A-Z])/g, '-$1').toLowerCase() + ':' + col2.style[cs] + ';';
              }
            }
          }
          html += '<td class="ai-table__cell" style="' + cellStyle + '">' + cellContent + '</td>';
        }
        html += '</tr>';
      }
    }
    html += '</tbody></table>';

    if (this.loading) {
      html += '<div class="ai-table__loading-overlay">' +
        '<div class="ai-table__loading-spinner">' +
          '<svg viewBox="0 0 50 50" width="40" height="40">' +
            '<circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-dasharray="31.4 31.4"/>' +
          '</svg>' +
        '</div>' +
      '</div>';
    }

    html += '</div>';
    if (this.paginated && this.dataSource.length > 0) {
      html += '<div class="ai-table__pagination"></div>';
    }
    this.el.innerHTML = html;

    if (this.paginated && this.dataSource.length > 0) {
      this._mountPagination();
    }

    // Bind onRow click handlers after render
    if (this.onRow) {
      var self = this;
      this.el.querySelectorAll('.ai-table__row').forEach(function (row, idx) {
        var rowProps = self.onRow(self._pageData[idx], idx);
        if (rowProps && rowProps.onClick) {
          row.__onRowClick = function () { rowProps.onClick(); };
          row.addEventListener('click', row.__onRowClick);
        }
      });
    }
  };

  AI.Table.prototype._mountPagination = function () {
    var mount = this.el.querySelector('.ai-table__pagination');
    if (!mount) return;
    var self = this;
    var custom = this.paginationOptions;
    var options = {};
    for (var key in custom) {
      if (Object.prototype.hasOwnProperty.call(custom, key)) options[key] = custom[key];
    }
    options.total = this.dataSource.length;
    options.current = this._currentPage;
    options.pageSize = this._pageSize;
    options.onChange = function (page, size) {
      if (custom.current === undefined) self._innerPage = page;
      if (custom.pageSize === undefined) self._innerPageSize = size;
      self._render();
      if (custom.onChange) custom.onChange(page, size);
    };
    mount._aiPagination = new AI.Pagination(mount, options);
  };

  AI.Table.prototype.setLoading = function (loading) {
    this.loading = loading;
    this._render();
  };

  AI.Table.prototype.setData = function (dataSource) {
    this.dataSource = dataSource;
    this._render();
  };

  /* ============================================
     Modal — 弹窗（footer 控制 + Cursor 包裹）
     ============================================ */
  AI.Modal = function (options) {
    this.options = options || {};
    this.title = this.options.title || '';
    this.content = this.options.content || '';
    this.width = this.options.width || 520;
    this.maskClosable = this.options.maskClosable !== false;
    // variant: 'game'（默认，异形裁剪）| 'default'（常规圆角卡片）
    this.variant = this.options.variant === 'default' ? 'default' : 'game';
    this.maskStyle = this.options.maskStyle || null;
    this.className = this.options.className || '';
    // footer: undefined = default buttons, null = hidden, string = custom HTML
    this.footer = this.options.footer !== undefined ? this.options.footer : undefined;
    this.onOk = this.options.onOk || null;
    this.onClose = this.options.onClose || null;
    this.typewriter = this.options.typewriter !== false;
    this.typeSpeed = this.options.typeSpeed || 80;
    this.cursor = this.options.cursor !== false;

    this.mask = null;
    this.dialog = null;
    this._lastActive = null;
    this._keyHandler = null;
  };

  AI.Modal.FOCUSABLE = [
    'a[href]',
    'area[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    'audio[controls]',
    'video[controls]',
    '[contenteditable]:not([contenteditable="false"])'
  ].join(',');

  AI.Modal._getFocusable = function (root) {
    return Array.prototype.slice.call(root.querySelectorAll(AI.Modal.FOCUSABLE)).filter(function (el) {
      return !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true';
    });
  };

  AI.Modal._applyStyle = function (el, style) {
    if (!style) return;
    if (typeof style === 'string') {
      el.style.cssText = style;
      return;
    }
    for (var key in style) {
      if (!Object.prototype.hasOwnProperty.call(style, key)) continue;
      el.style[key] = style[key];
    }
  };

  AI.Modal._ensureClip = function () {
    if (document.getElementById('ai-modal-clip')) return;
    var svgDef = document.createElement('div');
    svgDef.style.cssText = 'position:absolute;width:0;height:0';
    svgDef.setAttribute('aria-hidden', 'true');
    svgDef.innerHTML =
      '<svg><clipPath id="ai-modal-clip" clipPathUnits="objectBoundingBox">' +
      '<path d="M0.501,0.005 L0.501,0.005 L0.523,0.005 L0.549,0.006 C0.704,0.01,0.796,0.017,0.825,0.027 L0.827,0.028 C0.872,0.045,0.939,0.044,0.978,0.17 C1,0.254,1,0.365,0.99,0.505 L0.988,0.513 C0.979,0.558,0.971,0.598,0.965,0.633 C0.956,0.689,0.979,0.77,0.964,0.865 C0.953,0.928,0.921,0.966,0.869,0.979 C0.821,0.986,0.773,0.992,0.726,0.995 L0.712,0.996 L0.694,0.997 C0.648,1,0.586,1,0.507,1 L0.501,1 L0.464,1 C0.385,1,0.325,0.998,0.283,0.995 C0.234,0.992,0.184,0.987,0.133,0.979 C0.081,0.966,0.05,0.928,0.039,0.865 C0.023,0.77,0.047,0.689,0.037,0.633 C0.031,0.595,0.023,0.552,0.013,0.505 C-0.006,0.365,-0.002,0.254,0.024,0.17 C0.064,0.045,0.13,0.045,0.174,0.028 L0.175,0.028 C0.204,0.017,0.303,0.009,0.474,0.005 L0.501,0.005" />' +
      '</clipPath></svg>';
    document.body.appendChild(svgDef);
  };

  AI.Modal.prototype.open = function () {
    if (this.mask) return;

    AI.Modal._ensureClip();

    var uid = 'ai-modal-' + (AI.Modal._count = (AI.Modal._count || 0) + 1);
    var titleId = uid + '-title';
    var bodyId = uid + '-body';
    var isGame = this.variant === 'game';

    this.mask = document.createElement('div');
    this.mask.className = 'ai-modal-mask';
    AI.Modal._applyStyle(this.mask, this.maskStyle);

    var cursorWrapper = this.cursor ? document.createElement('div') : null;
    if (cursorWrapper) cursorWrapper.className = 'ai-cursor--force';

    var modal = document.createElement('div');
    modal.className = 'ai-modal' + (isGame ? ' ai-modal--game' : '');
    if (this.className) modal.className += ' ' + this.className;
    modal.style.width = typeof this.width === 'number' ? this.width + 'px' : this.width;
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    if (this.title) modal.setAttribute('aria-labelledby', titleId);
    modal.setAttribute('aria-describedby', bodyId);
    modal.setAttribute('tabindex', '-1');

    var clipped = document.createElement('div');
    clipped.className = 'ai-modal__clipped' + (isGame ? ' ai-modal__clipped--game' : '');

    if (this.title) {
      var header = document.createElement('div');
      header.className = 'ai-modal__header';
      header.innerHTML = '<div class="ai-modal__title" id="' + titleId + '">' + this.title + '</div>';
      clipped.appendChild(header);
    }

    var body = document.createElement('div');
    body.className = 'ai-modal__body';
    body.id = bodyId;
    if (this.typewriter) {
      body.innerHTML = '<span class="ai-typewriter"></span>';
    } else {
      body.innerHTML = this.content;
    }
    clipped.appendChild(body);

    if (this.footer !== null) {
      var footer = document.createElement('div');
      footer.className = 'ai-modal__footer';
      if (typeof this.footer === 'string') {
        footer.innerHTML = this.footer;
      } else {
        footer.innerHTML =
          '<button class="ai-modal__footer-btn ai-modal__footer-btn--primary">取消</button>' +
          '<button class="ai-modal__footer-btn ai-modal__footer-btn--primary">确定</button>';
        footer.children[0].addEventListener('click', this.close.bind(this));
        footer.children[1].addEventListener('click', function () {
          if (this.onOk) this.onOk();
          this.close();
        }.bind(this));
      }
      clipped.appendChild(footer);
    }

    modal.appendChild(clipped);

    if (cursorWrapper) {
      cursorWrapper.appendChild(modal);
      this.mask.appendChild(cursorWrapper);
    } else {
      this.mask.appendChild(modal);
    }

    document.body.appendChild(this.mask);
    this.dialog = modal;

    modal.addEventListener('click', function (e) {
      e.stopPropagation();
    });

    this.mask.addEventListener('click', function (e) {
      if (!this.maskClosable) return;
      if (e.target === this.mask || (cursorWrapper && e.target === cursorWrapper)) this.close();
    }.bind(this));

    // A11y：记录触发元素，焦点移入对话框；Tab 焦点陷阱 + ESC 关闭
    this._lastActive = document.activeElement;
    this._keyHandler = function (e) {
      if (e.key === 'Escape') {
        this.close();
        return;
      }
      if (e.key !== 'Tab') return;
      var focusables = AI.Modal._getFocusable(modal);
      if (focusables.length === 0) {
        e.preventDefault();
        modal.focus();
        return;
      }
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      var active = document.activeElement;
      if (e.shiftKey) {
        if (active === first || !modal.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else if (active === last || !modal.contains(active)) {
        e.preventDefault();
        first.focus();
      }
    }.bind(this);
    document.addEventListener('keydown', this._keyHandler);

    document.body.style.overflow = 'hidden';

    var self = this;
    setTimeout(function () {
      if (!self.dialog) return;
      var focusables = AI.Modal._getFocusable(self.dialog);
      (focusables[0] || self.dialog).focus();
    }, 0);

    if (this.typewriter) {
      var tw = body.querySelector('.ai-typewriter');
      if (tw) new AI.Typewriter(tw, this.content, this.typeSpeed);
    }
  };

  AI.Modal.prototype.close = function () {
    if (!this.mask) return;
    document.body.style.overflow = '';
    if (this._keyHandler) {
      document.removeEventListener('keydown', this._keyHandler);
      this._keyHandler = null;
    }
    this.mask.remove();
    this.mask = null;
    this.dialog = null;
    if (this._lastActive && this._lastActive.focus) this._lastActive.focus();
    this._lastActive = null;
    if (this.onClose) this.onClose();
  };

  /* ============================================
     Typewriter — 打字机效果（支持 HTML + trigger + autoPlay）
     ============================================ */
  AI.Typewriter = function (el, text, options) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    if (!this.el) return;

    if (typeof options === 'number') {
      this.speed = options;
      this.autoPlay = true;
      this.onDone = null;
    } else {
      this.options = options || {};
      this.speed = this.options.speed || 90;
      this.autoPlay = this.options.autoPlay !== false;
      this.onDone = this.options.onDone || null;
    }

    this.text = text || '';
    this.index = 0;

    if (this.autoPlay) {
      this._start();
    } else {
      this.el.innerHTML = this.text;
    }
  };

  AI.Typewriter.prototype._start = function () {
    this.index = 0;
    this.el.innerHTML = '';

    if (this.text.length === 0) {
      if (this.onDone) this.onDone();
      return;
    }

    var hasHtml = /<[a-z/][\s\S]*>/i.test(this.text);

    if (!hasHtml) {
      this._timer = setInterval(function () {
        if (this.index < this.text.length) {
          this.el.textContent += this.text.charAt(this.index);
          this.index++;
        } else {
          clearInterval(this._timer);
          this._timer = null;
          if (this.onDone) this.onDone();
        }
      }.bind(this), this.speed);
    } else {
      this._htmlNodes = this._parseHtml(this.text);
      this._htmlIndex = 0;
      this._charIndex = 0;
      this._renderHtml();
    }
  };

  AI.Typewriter.prototype._parseHtml = function (html) {
    var nodes = [];
    var regex = /(<[^>]+>)/g;
    var lastIndex = 0;
    var match;

    while ((match = regex.exec(html)) !== null) {
      if (match.index > lastIndex) {
        nodes.push({ type: 'text', value: html.slice(lastIndex, match.index) });
      }
      nodes.push({ type: 'tag', value: match[1] });
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < html.length) {
      nodes.push({ type: 'text', value: html.slice(lastIndex) });
    }
    return nodes;
  };

  AI.Typewriter.prototype._renderHtml = function () {
    var nodes = this._htmlNodes;
    var html = '';

    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (node.type === 'tag') {
        html += node.value;
      } else {
        if (i < this._htmlIndex) {
          html += _escapeHtml(node.value);
        } else if (i === this._htmlIndex) {
          html += _escapeHtml(node.value.slice(0, this._charIndex));
        }
      }
    }

    this.el.innerHTML = html;

    if (this._htmlIndex >= nodes.length) {
      if (this.onDone) this.onDone();
      return;
    }

    var currentNode = nodes[this._htmlIndex];
    if (currentNode.type === 'tag') {
      this._htmlIndex++;
      this._charIndex = 0;
      setTimeout(this._renderHtml.bind(this), 0);
    } else {
      this._charIndex++;
      if (this._charIndex > currentNode.value.length) {
        this._htmlIndex++;
        this._charIndex = 0;
      }
      this._timer = setTimeout(this._renderHtml.bind(this), this.speed);
    }
  };

  AI.Typewriter.prototype.restart = function () {
    this.destroy();
    this._start();
  };

  AI.Typewriter.prototype.destroy = function () {
    if (this._timer) {
      clearInterval(this._timer);
      clearTimeout(this._timer);
      this._timer = null;
    }
  };

  /* ============================================
     Loading — 加载动画（SVG + CSS 动画 + 遮罩过渡）
     ============================================ */
  AI.Loading = function (el, options) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    if (!this.el) return;

    this.options = options || {};
    this.type = this.options.type === 'circle' ? 'circle' : 'snow';
    this.showBoat = this.options.showBoat !== false;
    this.active = this.options.active !== false;
    this.tip = this.options.tip != null ? this.options.tip : null;
    this.delay = this.options.delay || 0;
    this.fadeDuration = this.options.fadeDuration != null ? this.options.fadeDuration : 0.6;
    this.zIndex = this.options.zIndex != null ? this.options.zIndex : 3000;
    this.className = this.options.className || '';
    this.style = this.options.style || null;

    this._shown = this.active && this.delay === 0;
    this._exiting = false;
    this._showTimer = null;
    this._hideTimer = null;
    this._uid = 'ai-loading-' + (AI.Loading._count = (AI.Loading._count || 0) + 1);
    this._flakes = AI.Loading._makeFlakes();

    if (this._shown) {
      this._render();
    } else if (this.active) {
      var self = this;
      this._showTimer = setTimeout(function () {
        self._shown = true;
        self._render();
      }, this.delay);
    }
  };

  AI.Loading.FLAKE_COUNT = 50;

  /* 雪花：随机尺寸 1–6px、水平位置、下落时长 6–12s；负延迟让首屏即有分布 */
  AI.Loading._makeFlakes = function () {
    var flakes = [];
    for (var i = 0; i < AI.Loading.FLAKE_COUNT; i++) {
      var size = Math.random() * 5 + 1;
      var duration = Math.random() * 6 + 6;
      flakes.push({
        width: size.toFixed(2) + 'px',
        height: size.toFixed(2) + 'px',
        left: (Math.random() * 100).toFixed(2) + '%',
        animationDuration: duration.toFixed(2) + 's',
        animationDelay: (-Math.random() * duration).toFixed(2) + 's'
      });
    }
    return flakes;
  };

  /* naive-icons sailboat（MIT），底部波浪单独成层横向滚动 */
  AI.Loading.SAILBOAT = '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#2A2A2A" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" class="ai-loading__sailboat-svg" role="presentation">' +
    '<defs>' +
      '<path id="__UID__-wave" d="M4.85 43.15 C 8.68 41.24 10.59 45.07 14.42 43.15 C 18.25 41.24 20.17 45.07 24 43.15 C 27.83 41.24 29.75 45.07 33.58 43.15 C 37.41 41.24 39.32 45.07 43.15 43.15" stroke="#2A9D8F" stroke-width="1.9" fill="none"/>' +
      '<clipPath id="__UID__-clip"><rect x="9.63" y="0" width="28.74" height="48"/></clipPath>' +
    '</defs>' +
    '<g transform="translate(24 39.32) scale(0.8) translate(-24 -39.32)">' +
      '<g class="ai-loading__boat">' +
        '<path d="M22.08 9.64 L 22.08 27.83 L 9.64 27.83 Z" fill="#E76F51"/>' +
        '<path d="M25.92 6.76 L 25.92 27.83 L 39.32 27.83 Z" fill="#FAEDCD"/>' +
        '<path d="M24 4.85 L 24 29.75" stroke="#2A2A2A" stroke-width="3"/>' +
        '<path d="M7.72 31.66 L 40.28 31.66 L 35.49 39.32 L 12.51 39.32 Z" fill="#8B5E3C"/>' +
        '<circle cx="29.75" cy="17.3" r="1.53" fill="#E76F51" stroke="none"/>' +
      '</g>' +
    '</g>' +
    '<g clip-path="url(#__UID__-clip)">' +
      '<g transform="translate(0 1.2)">' +
        '<g class="ai-loading__wave-track" style="--animal-sailboat-wave-scroll:28.74px">' +
          '<use href="#__UID__-wave" transform="translate(-2 0)"/>' +
          '<use href="#__UID__-wave" transform="translate(-40.3 0)"/>' +
          '<use href="#__UID__-wave" transform="translate(-78.6 0)"/>' +
          '<use href="#__UID__-wave" transform="translate(-116.9 0)"/>' +
        '</g>' +
      '</g>' +
    '</g>' +
  '</svg>';

  AI.Loading.prototype._styleText = function () {
    var out = 'z-index:' + this.zIndex + ';';
    if (this.type === 'circle') {
      out += '--animal-loading-mask-duration:' + this.fadeDuration + 's;--animal-loading-mask-r:0px;';
    }
    if (this._exiting && this.type !== 'circle') {
      out += 'transition-duration:' + this.fadeDuration + 's;';
    }
    if (this.style) {
      if (typeof this.style === 'string') {
        out += this.style;
      } else {
        for (var key in this.style) {
          if (!Object.prototype.hasOwnProperty.call(this.style, key)) continue;
          out += key.replace(/[A-Z]/g, function (m) { return '-' + m.toLowerCase(); }) + ':' + this.style[key] + ';';
        }
      }
    }
    return out;
  };

  AI.Loading.prototype._render = function () {
    if (!this._shown) return;

    var rootCls = 'ai-loading';
    var isCircle = this.type === 'circle';
    if (isCircle) rootCls += ' ai-loading--circle';
    if (this._exiting) rootCls += isCircle ? ' ai-loading--masking' : ' ai-loading--exiting';
    if (this.className) rootCls += ' ' + this.className;

    var html = '<div class="' + rootCls + '" role="status" style="' + this._styleText() + '">';

    if (isCircle) {
      if (this.showBoat) {
        html += '<div class="ai-loading__sailboat-scene" aria-hidden="true">' +
          AI.Loading.SAILBOAT.replace(/__UID__/g, this._uid) +
        '</div>';
      }
    } else {
      html += '<div class="ai-loading__snow" aria-hidden="true">';
      for (var i = 0; i < this._flakes.length; i++) {
        var f = this._flakes[i];
        html += '<span class="ai-loading__flake" style="width:' + f.width + ';height:' + f.height +
          ';left:' + f.left + ';animation-duration:' + f.animationDuration +
          ';animation-delay:' + f.animationDelay + '"></span>';
      }
      html += '</div><span class="ai-loading__vignette" aria-hidden="true"></span>';
    }

    if (this.tip) {
      var tipText = String(this.tip);
      html += '<div class="ai-loading__tip">' + (/[<&]/.test(tipText) ? tipText : AI.Loading._escape(tipText)) + '</div>';
    } else {
      html += '<span class="ai-loading__sr-only">加载中</span>';
    }

    html += '</div>';
    this.el.innerHTML = html;
    this.root = this.el.querySelector('.ai-loading');

    if (this._exiting && isCircle && this.root) {
      var self = this;
      requestAnimationFrame(function () {
        if (!self.root) return;
        var rect = self.root.getBoundingClientRect();
        var w = rect.width || window.innerWidth;
        var h = rect.height || window.innerHeight;
        self.root.style.setProperty('--animal-loading-mask-r', Math.ceil(Math.hypot(w, h) / 2 + 50) + 'px');
      });
    }
  };

  AI.Loading._escape = function (text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };

  AI.Loading.prototype.setActive = function (active) {
    this.active = active;
    var self = this;

    if (active) {
      clearTimeout(this._hideTimer);
      this._exiting = false;
      if (this.delay === 0) {
        clearTimeout(this._showTimer);
        this._shown = true;
        this._render();
      } else {
        clearTimeout(this._showTimer);
        this._showTimer = setTimeout(function () {
          self._shown = true;
          self._render();
        }, this.delay);
      }
      return;
    }

    clearTimeout(this._showTimer);
    if (!this._shown) return;

    this._exiting = true;
    this._render();
    this._hideTimer = setTimeout(function () {
      self._shown = false;
      self._exiting = false;
      self.el.innerHTML = '';
      self.root = null;
    }, this.fadeDuration * 1000);
  };

  AI.Loading.prototype.destroy = function () {
    clearTimeout(this._showTimer);
    clearTimeout(this._hideTimer);
    this.el.innerHTML = '';
    this.root = null;
  };

  /* ============================================
     Phone — 手机模拟器
     ============================================ */
  AI.Phone = function (el) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    if (!this.el) return;

    this._render();
    this._timer = setInterval(this._updateTime.bind(this), 1000);
  };

  AI.Phone.prototype._render = function () {
    var apps = [
      { id: 'camera', icon: 'camera', color: '#B77DEE', badge: true },
      { id: 'miles', icon: 'miles', color: '#889DF0', offset: true },
      { id: 'critterpedia', icon: 'critterpedia', color: '#F7CD67' },
      { id: 'diy', icon: 'diy', color: '#E59266' },
      { id: 'design', icon: 'design', color: '#F8A6B2' },
      { id: 'map', icon: 'map', color: '#82D5BB', badge: true },
      { id: 'variant', icon: 'variant', color: '#8AC68A' },
      { id: 'helicopter', icon: 'helicopter', color: '#FC736D' },
      { id: 'chat', icon: 'chat', color: '#D1DA49' }
    ];

    var appsHtml = apps.map(function (app) {
      var badgeHtml = app.badge ? '<span class="ai-phone__badge"></span>' : '';
      var itemCls = 'ai-phone__app-item' + (app.offset ? ' ai-phone__app-item--offset' : '');
      var iconCls = 'ai-phone__app-icon ai-phone__app-icon--' + app.icon + (app.offset ? ' ai-phone__app-icon--offset' : '');
      return '<div class="' + itemCls + '" style="background-color:' + app.color + '">' +
        badgeHtml +
        '<span class="' + iconCls + '"></span>' +
      '</div>';
    }).join('');

    this.el.innerHTML =
      '<div class="ai-phone">' +
        '<div class="ai-phone__home-screen">' +
          '<div class="ai-phone__date-display">' +
            '<div class="ai-phone__date-header">' +
              '<span class="ai-phone__icon-wifi"></span>' +
              '<div class="ai-phone__time-display"></div>' +
              '<span class="ai-phone__icon-location"></span>' +
            '</div>' +
            '<div class="ai-phone__day-text">Welcome!</div>' +
          '</div>' +
          '<div class="ai-phone__apps-grid">' + appsHtml + '</div>' +
          '<div class="ai-phone__page-indicator">' +
            '<span class="ai-phone__icon-page"></span>' +
          '</div>' +
        '</div>' +
      '</div>';

    this._updateTime();
  };

  AI.Phone.prototype._updateTime = function () {
    var now = new Date();
    var hours = now.getHours();
    var minutes = String(now.getMinutes()).padStart(2, '0');
    var ampm = hours >= 12 ? 'PM' : 'AM';
    var displayHours = hours % 12 || 12;

    var timeDisplay = this.el.querySelector('.ai-phone__time-display');
    if (timeDisplay) {
      timeDisplay.innerHTML = displayHours +
        '<span class="ai-phone__blink">:</span>' +
        minutes + ampm;
    }
  };

  AI.Phone.prototype.destroy = function () {
    if (this._timer) clearInterval(this._timer);
  };

  /* ============================================
     CodeBlock — 语法高亮
     ============================================ */
  AI.CodeBlock = function (el, options) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    if (!this.el) return;
    // 幂等：autoInit 会对页面上所有 .ai-code-block 调用，重复构造会叠加复制按钮
    if (this.el.__aiCodeBlock) return;
    this.el.__aiCodeBlock = this;

    var o = (this.options = options || {});
    var copyable = o.copyable;
    if (copyable === undefined) copyable = this.el.getAttribute('data-copyable') !== 'false';

    // 已高亮的 pre 的 textContent 仍是原始代码，可安全重复读出
    var code = o.code !== undefined ? String(o.code) : (this.el.getAttribute('data-code') || this.el.textContent);
    this.code = code;

    this.el.innerHTML = this._highlight(code);

    if (o.className) {
      String(o.className).split(/\s+/).forEach(function (cls) {
        if (cls) this.el.classList.add(cls);
      }, this);
    }
    if (o.style && typeof o.style === 'object') {
      Object.keys(o.style).forEach(function (key) {
        this.el.style[key] = o.style[key];
      }, this);
    }

    if (copyable) {
      this._mountCopy(o.onCopy);
    }
  };

  AI.CodeBlock.prototype._mountCopy = function (onCopy) {
    var self = this;
    var pre = this.el;
    var wrapper = pre.parentNode;

    if (!wrapper || !wrapper.classList || !wrapper.classList.contains('ai-codeblock')) {
      wrapper = document.createElement('div');
      wrapper.className = 'ai-codeblock';
      if (pre.parentNode) pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);
    }
    this.wrapper = wrapper;

    // 未显式设置 padding 时给复制按钮留出空间（原版 paddingRight: 96）
    if (!pre.style.padding && !pre.style.paddingRight) {
      pre.classList.add('ai-code-block--copyable');
    }

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ai-codeblock__copy';
    btn.textContent = '复制';
    btn.setAttribute('aria-label', '复制代码');
    wrapper.appendChild(btn);
    this.copyBtn = btn;

    this._resetTimer = null;
    btn.addEventListener('click', function () {
      clearTimeout(self._resetTimer);
      self._copyText(self.code).then(function () {
        self._setCopyStatus('copied');
        if (onCopy) onCopy(self.code);
      }).catch(function () {
        self._setCopyStatus('error');
      }).then(function () {
        self._resetTimer = setTimeout(function () { self._setCopyStatus('idle'); }, 2000);
      });
    });
  };

  AI.CodeBlock.prototype._setCopyStatus = function (status) {
    if (!this.copyBtn) return;
    var content = {
      idle: { text: '复制', label: '复制代码' },
      copied: { text: '已复制', label: '代码已复制' },
      error: { text: '复制失败', label: '代码复制失败' }
    }[status] || { text: '复制', label: '复制代码' };
    this.copyBtn.textContent = content.text;
    this.copyBtn.setAttribute('aria-label', content.label);
  };

  AI.CodeBlock.prototype._copyText = function (text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      try {
        textarea.select();
        if (!document.execCommand('copy')) throw new Error('Copy command failed');
        resolve();
      } catch (err) {
        reject(err);
      } finally {
        document.body.removeChild(textarea);
      }
    });
  };

  AI.CodeBlock.COLORS = {
    comment: '#6b5e50',
    string: '#a8d4a0',
    keyword: '#d4a0e0',
    react: '#e06c75',
    component: '#80c0e0',
    func: '#61afef',
    prop: '#e8c87a',
    jsx: '#f0a870',
    operator: '#d4b896',
    number: '#a8d4a0',
    default: '#e8d5bc'
  };

  AI.CodeBlock.prototype._highlight = function (code) {
    var tokens = [];
    var C = AI.CodeBlock.COLORS;

    function addPattern(regex, color) {
      var match;
      var re = new RegExp(regex.source, regex.flags.indexOf('g') !== -1 ? regex.flags : regex.flags + 'g');
      while ((match = re.exec(code)) !== null) {
        tokens.push({ start: match.index, end: match.index + match[0].length, color: color });
      }
    }

    addPattern(/\/\*[\s\S]*?\*\//g, C.comment);
    addPattern(/\/\/.*$/gm, C.comment);
    addPattern(/`[^`]*`/g, C.string);
    addPattern(/"[^"]*"/g, C.string);
    addPattern(/'[^']*'/g, C.string);
    addPattern(/<\/?[A-Z][\w.$]*/g, C.jsx);
    addPattern(/<\/?[a-z][\w-]*/g, C.jsx);
    addPattern(/\/?>/g, C.jsx);
    addPattern(/\b(React|useState|useEffect|useCallback|useMemo|useRef|useContext|useReducer|useLayoutEffect|useImperativeHandle|useDebugValue|createContext|createElement|cloneElement|Fragment|Suspense|lazy|memo|forwardRef|useId|FC|ReactNode|ReactElement|CSSProperties)\b/g, C.react);
    addPattern(/\b(true|false)\b/g, C.keyword);
    addPattern(/\b(null|undefined|void|NaN|Infinity)\b/gi, C.keyword);
    addPattern(/\b\d+\.?\d*\b/g, C.number);
    addPattern(/\b(import|from|as|export|default|const|let|var|function|return|if|else|for|while|switch|case|break|continue|try|catch|throw|finally|new|typeof|instanceof|async|await|type|interface|class|extends|super)\b/gi, C.keyword);
    addPattern(/\b[A-Z][a-zA-Z0-9_$]*\b/g, C.component);
    addPattern(/\b[a-z][a-zA-Z0-9_$]*\s*(?=\()/g, C.func);
    addPattern(/\b[a-zA-Z_$][\w$]*\s*(?==)/g, C.prop);
    addPattern(/>|===|!==|==|!=|<=|>=|&&|\|\||[+\-*/%=<>!&|^~?:]/g, C.operator);
    addPattern(/[{}[\]();,]/g, C.operator);

    tokens.sort(function (a, b) { return a.start - b.start; });

    var result = '';
    var pos = 0;

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      if (token.start < pos) continue;
      if (token.start > pos) result += _escapeHtml(code.slice(pos, token.start));
      result += '<span style="color:' + token.color + '">' + _escapeHtml(code.slice(token.start, token.end)) + '</span>';
      pos = token.end;
    }

    if (pos < code.length) result += _escapeHtml(code.slice(pos));
    return result;
  };

  AI.CodeBlock.highlight = function (code) {
    var instance = Object.create(AI.CodeBlock.prototype);
    return instance._highlight(code);
  };

  function _escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ============================================
     Tag — 标签（closable / clickable）
     ============================================ */
  AI.Tag = function (el, options) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    if (!this.el) return;

    this.options = options || {};
    this.onClose = this.options.onClose ||
      (this.el.getAttribute('data-on-close') ? new Function(this.el.getAttribute('data-on-close')) : null);
    this.onClick = this.options.onClick ||
      (this.el.getAttribute('data-on-click') ? new Function(this.el.getAttribute('data-on-click')) : null);

    var closeBtn = this.el.querySelector('.ai-tag__close');
    if (closeBtn) {
      this._closeBtn = closeBtn;
      closeBtn.addEventListener('click', this._handleClose.bind(this));
    }
    // 原版：仅传 onClick 时标签可点击；此处兼容 data-on-click 与显式 clickable 类
    var clickable = this.onClick || this.el.classList.contains('ai-tag--clickable');
    if (clickable) {
      this.el.classList.add('ai-tag--clickable');
      this.el.setAttribute('role', 'button');
      if (!this.el.hasAttribute('tabindex')) this.el.setAttribute('tabindex', '0');
      this.el.addEventListener('click', this._handleClick.bind(this));
      this.el.addEventListener('keydown', this._handleKeydown.bind(this));
    }
  };

  AI.Tag.prototype._handleClose = function (e) {
    e.stopPropagation();
    if (this.el.classList.contains('ai-tag--disabled')) return;
    // 原版仅触发回调，是否移除由调用方决定
    if (this.onClose) this.onClose(e);
  };

  AI.Tag.prototype._handleClick = function (e) {
    if (this.el.classList.contains('ai-tag--disabled')) return;
    if (this.onClick) this.onClick(e);
  };

  AI.Tag.prototype._handleKeydown = function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._handleClick(e);
    }
  };

  AI.Tag.prototype.close = function () {
    if (this._closeBtn) this._closeBtn.click();
  };

  AI.Tag.prototype.disable = function () { this.el.classList.add('ai-tag--disabled'); };
  AI.Tag.prototype.enable = function () { this.el.classList.remove('ai-tag--disabled'); };

  /* ============================================
     Title — 标题（ribbon 飘带 / layer 双层纸 / tab 折角便签）
     ============================================ */
  AI.Title = function (options) {
    var opts = options || {};
    var size = opts.size || 'middle'; // small | middle | large
    var color = opts.color || 'default';
    var variant = opts.variant || 'ribbon'; // ribbon | layer | tab
    var text = opts.text != null ? String(opts.text) : '';

    var sizeClass = size === 'small' ? 'ai-title--sm'
      : size === 'large' ? 'ai-title--lg'
      : 'ai-title--md';
    var colorClass = color !== 'default' ? 'ai-title--' + color : '';

    var root = document.createElement('span');
    root.className = 'ai-title ' + sizeClass + ' ' + colorClass +
      (opts.className ? ' ' + opts.className : '');
    if (opts.style) {
      if (typeof opts.style === 'string') root.style.cssText += opts.style;
      else Object.keys(opts.style).forEach(function (k) {
        if (k.indexOf('--') === 0) root.style.setProperty(k, opts.style[k]);
        else root.style[k] = opts.style[k];
      });
    }

    if (variant === 'layer') {
      var layer = document.createElement('span');
      layer.className = 'ai-title__layer';
      var layerFront = document.createElement('span');
      layerFront.className = 'ai-title__layer-front';
      layerFront.innerHTML = text;
      layer.appendChild(layerFront);
      root.appendChild(layer);
    } else if (variant === 'tab') {
      var tab = document.createElement('span');
      tab.className = 'ai-title__tab';
      var tabText = document.createElement('span');
      tabText.className = 'ai-title__tab-text';
      tabText.innerHTML = text;
      tab.appendChild(tabText);
      root.appendChild(tab);
    } else {
      var ribbon = document.createElement('span');
      ribbon.className = 'ai-title__ribbon';

      var backLeft = document.createElement('span');
      backLeft.className = 'ai-title__back ai-title__back--left';
      backLeft.setAttribute('aria-hidden', 'true');
      var backRight = document.createElement('span');
      backRight.className = 'ai-title__back ai-title__back--right';
      backRight.setAttribute('aria-hidden', 'true');
      var foldLeft = document.createElement('span');
      foldLeft.className = 'ai-title__fold ai-title__fold--left';
      foldLeft.setAttribute('aria-hidden', 'true');
      var foldRight = document.createElement('span');
      foldRight.className = 'ai-title__fold ai-title__fold--right';
      foldRight.setAttribute('aria-hidden', 'true');
      var front = document.createElement('span');
      front.className = 'ai-title__front';
      front.setAttribute('aria-hidden', 'true');
      var textEl = document.createElement('span');
      textEl.className = 'ai-title__text';
      textEl.innerHTML = text;

      ribbon.appendChild(backLeft);
      ribbon.appendChild(backRight);
      ribbon.appendChild(foldLeft);
      ribbon.appendChild(foldRight);
      ribbon.appendChild(front);
      ribbon.appendChild(textEl);
      root.appendChild(ribbon);
    }

    this.el = root;
    return root;
  };

  AI.Title.prototype.setText = function (text) {
    var textEl = this.el.querySelector('.ai-title__text, .ai-title__layer-front, .ai-title__tab-text');
    if (textEl) textEl.innerHTML = text;
  };

  /* ============================================
     Skeleton — 骨架屏（工厂方法 + 切换 loading）
     ============================================ */
  AI.Skeleton = function (el, options) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    if (!this.el) return;

    this.options = options || {};
    this.variant = this.options.variant || 'text';
    this.active = this.options.active !== false;
    this.rows = this.options.rows || 3;
    this.width = this.options.width;
    this.heightValue = this.options.heightValue;
    this.widthValue = this.options.widthValue;
    this.rowWidths = this.options.rowWidths;
    this.loading = this.options.loading !== false;
    this.children = this.options.children;

    // loading=false 时保留原有子内容；若传入 children 则替换
    if (!this.loading) {
      if (this.children != null) this.el.innerHTML = this.children;
      return;
    }

    this._render();
  };

  AI.Skeleton.prototype._render = function () {
    var baseCls = 'ai-skeleton';
    if (this.active) baseCls += ' ai-skeleton--active';
    var variantCls = 'ai-skeleton--' + this.variant;

    if (this.variant === 'paragraph') {
      this.el.className = baseCls + ' ai-skeleton--paragraph';
      var widths = Array.isArray(this.rowWidths) && this.rowWidths.length
        ? this.rowWidths
        : ['100%', '92%', '84%', '76%', '68%'];
      var html = '';
      var rowCount = Math.max(1, this.rows);
      for (var i = 0; i < rowCount; i++) {
        var w = widths[i] != null ? widths[i] : widths[widths.length - 1];
        html += '<div class="ai-skeleton__line" style="width:' + w + '"></div>';
      }
      this.el.innerHTML = html;
      return;
    }

    if (this.variant === 'circle') {
      var size = this.widthValue || this.heightValue || 44;
      this.el.className = baseCls + ' ' + variantCls;
      this.el.style.width = typeof size === 'number' ? size + 'px' : size;
      this.el.style.height = typeof size === 'number' ? size + 'px' : size;
      this.el.setAttribute('aria-hidden', 'true');
      return;
    }

    if (this.variant === 'rect') {
      var rw = this.widthValue || '100%';
      var rh = this.heightValue || 120;
      this.el.className = baseCls + ' ' + variantCls;
      this.el.style.width = typeof rw === 'number' ? rw + 'px' : rw;
      this.el.style.height = typeof rh === 'number' ? rh + 'px' : rh;
      this.el.setAttribute('aria-hidden', 'true');
      return;
    }

    // text
    var tw = this.width || '100%';
    var th = this.heightValue || 16;
    this.el.className = baseCls + ' ' + variantCls;
    this.el.style.width = typeof tw === 'number' ? tw + 'px' : tw;
    this.el.style.height = typeof th === 'number' ? th + 'px' : th;
    this.el.setAttribute('aria-hidden', 'true');
  };

  AI.Skeleton.prototype.setActive = function (active) {
    this.active = !!active;
    this._render();
  };

  /* ============================================
     Progress — 进度条（动态更新百分比）
     ============================================ */
  AI.Progress = function (el, options) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    if (!this.el) return;

    this.options = options || {};
    this.percent = this._parsePercent(this.options.percent != null ? this.options.percent : parseFloat(this.el.getAttribute('data-percent') || '0'));
    this.size = this.options.size || this.el.getAttribute('data-size') || 'middle';
    this.variant = this.options.variant || this.el.getAttribute('data-variant') || null;
    this.color = this.options.color || null;
    this.wave = !!this.options.wave;
    this.animated = this.options.animated !== false;
    this.showInfo = this.options.showInfo !== false;
    this.infoFormat = this.options.infoFormat;
    this.duration = this.options.duration != null ? this.options.duration : 0.6;
    this.ariaLabel = this.options['aria-label'] || this.el.getAttribute('aria-label') || null;
    this.ariaLabelledBy = this.options['aria-labelledby'] || this.el.getAttribute('aria-labelledby') || null;
    this.className = this.options.className || null;

    if (this.className) {
      var extra = this.className.split(/\s+/).filter(Boolean);
      for (var i = 0; i < extra.length; i++) this.el.classList.add(extra[i]);
    }
    if (this.options.style && typeof this.options.style === 'object') {
      for (var key in this.options.style) {
        if (Object.prototype.hasOwnProperty.call(this.options.style, key)) this.el.style[key] = this.options.style[key];
      }
    }

    this._render();

    // 场景图按整条轨道宽度铺满：宽度变化时重算 background-size
    if (this.variant && typeof ResizeObserver !== 'undefined') {
      var self = this;
      this._ro = new ResizeObserver(function () { self._syncVariantBg(); });
      this._ro.observe(this.el);
    }
  };

  AI.Progress.VARIANT_BG = {
    'sweet-corner': 'assets/img/backgrounds/sweet-corner.svg',
    'coffee-break': 'assets/img/backgrounds/coffee-break.svg',
    'forest-grove': 'assets/img/backgrounds/03-forest-grove.svg',
    'starry-camp': 'assets/img/backgrounds/30-starry-camp.svg'
  };

  AI.Progress.prototype._parsePercent = function (v) {
    if (typeof v !== 'number' || isNaN(v)) return 0;
    return Math.max(0, Math.min(100, v));
  };

  AI.Progress.prototype._render = function () {
    var p = this.percent;
    var info = this.infoFormat ? this.infoFormat(p) : Math.round(p) + '%';
    var sizeClass = this.size === 'small' ? 'ai-progress__track--sm'
      : this.size === 'large' ? 'ai-progress__track--lg'
      : 'ai-progress__track--md';
    var fillTransition = this.duration === 0 ? 'ai-progress__fill--notransition' : '';

    var html = '<div class="ai-progress__row">';
    html += '<div class="ai-progress__track ' + sizeClass + '">';
    html += '<div class="ai-progress__fill ' + fillTransition + '" style="width:' + p + '%;transition-duration:' + this.duration + 's">';
    if (this.wave) {
      var playing = this.animated && p > 0 && p < 100;
      html += '<span class="ai-wave" aria-hidden="true" style="--ai-wave-play-state:' + (playing ? 'running' : 'paused') + '"></span>';
    }
    html += '</div>';
    html += '</div>';
    if (this.showInfo) {
      html += '<div class="ai-progress__info ai-progress__info--right">' + info + '</div>';
    }
    html += '</div>';

    this.el.classList.add('ai-progress');
    if (this.className) {
      var extraCls = this.className.split(/\s+/).filter(Boolean);
      for (var ci = 0; ci < extraCls.length; ci++) this.el.classList.add(extraCls[ci]);
    }
    this.el.setAttribute('role', 'progressbar');
    this.el.setAttribute('aria-valuemin', '0');
    this.el.setAttribute('aria-valuemax', '100');
    this.el.setAttribute('aria-valuenow', String(Math.round(p)));
    if (typeof info === 'string') this.el.setAttribute('aria-valuetext', info);
    else this.el.removeAttribute('aria-valuetext');
    if (this.ariaLabel) this.el.setAttribute('aria-label', this.ariaLabel);
    else this.el.removeAttribute('aria-label');
    if (this.ariaLabelledBy) this.el.setAttribute('aria-labelledby', this.ariaLabelledBy);
    else this.el.removeAttribute('aria-labelledby');
    this.el.innerHTML = html;

    this._fillEl = this.el.querySelector('.ai-progress__fill');
    this._applyFillStyle();
  };

  AI.Progress.prototype._applyFillStyle = function () {
    var fill = this._fillEl;
    if (!fill) return;
    if (this.variant) {
      var url = AI.Progress.VARIANT_BG[this.variant];
      if (url) {
        fill.style.backgroundImage = 'url("' + url + '")';
        fill.style.backgroundRepeat = 'no-repeat';
        fill.style.backgroundPosition = 'left top';
        fill.style.backgroundColor = '';
      }
      this._syncVariantBg();
    } else if (this.color) {
      fill.style.backgroundColor = this.color;
      fill.style.backgroundImage = 'linear-gradient(180deg, rgba(255,255,255,0.24), transparent 60%, rgba(61,52,40,0.08))';
    }
  };

  AI.Progress.prototype._syncVariantBg = function () {
    if (!this.variant || !this._fillEl) return;
    var track = this.el.querySelector('.ai-progress__track');
    if (!track) return;
    var w = track.clientWidth;
    this._fillEl.style.backgroundSize = w > 0 ? w + 'px auto' : '100% auto';
  };

  AI.Progress.prototype.setPercent = function (percent) {
    this.percent = this._parsePercent(percent);
    this._render();
  };

  AI.Progress.prototype.getPercent = function () { return this.percent; };

  /* ============================================
     Wallet — 钱包（数值格式化 + 更新）
     ============================================ */
  AI.Wallet = function (el, options) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    if (!this.el) return;

    this.options = options || {};
    this.size = this.options.size || this.el.getAttribute('data-size') || 'medium';
    this.value = this.options.value != null ? this.options.value : this.el.getAttribute('data-value');
    this.thousandSeparator = this.options.thousandSeparator != null ? this.options.thousandSeparator : ',';
    this.iconHTML = this.options.iconHTML || null;

    this._render();
  };

  AI.Wallet._formatValue = function (value, sep) {
    if (value === undefined || value === null) return '00,000';
    if (typeof value !== 'number') return String(value);
    if (!sep) return String(value);
    var sign = value < 0 ? '-' : '';
    var parts = Math.abs(value).toString().split('.');
    var intPart = parts[0];
    var frac = parts[1];
    var intWithSep = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, sep);
    return frac ? sign + intWithSep + '.' + frac : sign + intWithSep;
  };

  AI.Wallet.prototype._render = function () {
    var sizeClass = this.size === 'small' ? 'ai-wallet--sm'
      : this.size === 'large' ? 'ai-wallet--lg'
      : '';
    this.el.className = 'ai-wallet ' + sizeClass;

    var bagHTML = this.iconHTML != null
      ? this.iconHTML
      : '<img src="assets/img/icons/items/item-022.png" alt="" style="width:80%;height:80%;object-fit:contain" onerror="this.style.display=\'none\'">';

    var formatted = AI.Wallet._formatValue(this.value, this.thousandSeparator);
    this.el.innerHTML =
      '<div class="ai-wallet__bag">' + bagHTML + '</div>' +
      '<div class="ai-wallet__pill"><span class="ai-wallet__value">' + formatted + '</span></div>';
  };

  AI.Wallet.prototype.setValue = function (value) {
    this.value = value;
    var valEl = this.el.querySelector('.ai-wallet__value');
    if (valEl) {
      valEl.textContent = AI.Wallet._formatValue(value, this.thousandSeparator);
    }
  };

  AI.Wallet.prototype.getValue = function () { return this.value; };

  /* ============================================
     Radio — 单选组（roving tabindex + 键盘导航）
     ============================================ */
  AI.Radio = function (el, options) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    if (!this.el) return;

    this.options = options || {};
    this.size = this.options.size || this.el.getAttribute('data-size') || 'middle';
    this.disabled = this.options.disabled || this.el.classList.contains('ai-radio-group--disabled');
    this.direction = this.options.direction || (this.el.classList.contains('ai-radio-group--vertical') ? 'vertical' : 'horizontal');
    this.onChange = this.options.onChange || null;

    // Determine initial value
    var checkedItem = this.el.querySelector('.ai-radio-item--checked');
    this.value = this.options.value != null
      ? this.options.value
      : (checkedItem ? checkedItem.getAttribute('data-value') : this.options.defaultValue);

    this._idBase = 'ai-radio-' + Math.random().toString(36).slice(2, 10);
    this._render();
    this.el._aiRadio = this;
    this.el.addEventListener('keydown', this._onKeydown.bind(this));
  };

  AI.Radio.prototype._render = function () {
    var sizeClass = this.size === 'small' ? 'ai-radio-item--sm'
      : this.size === 'large' ? 'ai-radio-item--lg'
      : 'ai-radio-item--md';
    var dirClass = this.direction === 'vertical' ? 'ai-radio-group--vertical' : '';
    var disabledClass = this.disabled ? 'ai-radio-group--disabled' : '';

    var opts = this.options.options || this._collectOptions();
    this._options = opts;

    var html = '';
    for (var i = 0; i < opts.length; i++) {
      var opt = opts[i];
      var isChecked = String(opt.value) === String(this.value);
      var isDisabled = this.disabled || opt.disabled;
      var cls = 'ai-radio-item ' + sizeClass;
      if (isChecked) cls += ' ai-radio-item--checked';
      if (isDisabled) cls += ' ai-radio-item--disabled';
      var inputId = this._idBase + '-' + i;
      html +=
        '<label class="' + cls + '" data-value="' + _escapeHtml(String(opt.value)) + '">' +
          '<span class="ai-radio-item__box">' +
            '<input class="ai-radio-item__input" type="radio" name="' + this._idBase + '" id="' + inputId + '"' +
              (isChecked ? ' checked' : '') + (isDisabled ? ' disabled' : '') + '>' +
            '<span class="ai-radio-item__splash"></span>' +
            '<svg class="ai-radio-item__check" fill="none" viewBox="0 0 15 14" height="14" width="15"><path d="M2 8.36364L6.23077 12L13 2"></path></svg>' +
          '</span>' +
          '<span class="ai-radio-item__label">' + (opt.label != null ? String(opt.label) : '') + '</span>' +
        '</label>';
    }
    this.el.className = 'ai-radio-group ' + dirClass + ' ' + disabledClass;
    this.el.setAttribute('role', 'radiogroup');
    this.el.innerHTML = html;

    var self = this;
    var inputs = this.el.querySelectorAll('.ai-radio-item__input');
    inputs.forEach(function (input, idx) {
      input.addEventListener('change', function () { self._select(idx); });
      input.addEventListener('focus', function () {
        self._focusedIndex = idx;
      });
    });
    this._focusedIndex = this._findIndex(this.value);
  };

  AI.Radio.prototype._collectOptions = function () {
    var items = this.el.querySelectorAll('.ai-radio-item');
    var result = [];
    items.forEach(function (item) {
      result.push({
        value: item.getAttribute('data-value'),
        label: (item.querySelector('.ai-radio-item__label') || {}).textContent || '',
        disabled: item.classList.contains('ai-radio-item--disabled'),
      });
    });
    return result;
  };

  AI.Radio.prototype._findIndex = function (value) {
    for (var i = 0; i < this._options.length; i++) {
      if (String(this._options[i].value) === String(value)) return i;
    }
    return 0;
  };

  AI.Radio.prototype._select = function (idx) {
    if (idx < 0 || idx >= this._options.length) return;
    var opt = this._options[idx];
    if (this.disabled || opt.disabled) return;
    this.value = opt.value;
    this._focusedIndex = idx;
    // Update DOM
    var items = this.el.querySelectorAll('.ai-radio-item');
    items.forEach(function (item, i) {
      var input = item.querySelector('.ai-radio-item__input');
      if (i === idx) {
        item.classList.add('ai-radio-item--checked');
        if (input) input.checked = true;
      } else {
        item.classList.remove('ai-radio-item--checked');
        if (input) input.checked = false;
      }
    });
    this.el.dispatchEvent(new CustomEvent('ai-radio-change', { detail: { value: this.value }, bubbles: true }));
    if (this.onChange) this.onChange(this.value);
  };

  AI.Radio.prototype._onKeydown = function (e) {
    var enabled = [];
    for (var i = 0; i < this._options.length; i++) {
      if (!this.disabled && !this._options[i].disabled) enabled.push(i);
    }
    if (!enabled.length) return;

    var currentPos = enabled.indexOf(this._focusedIndex);
    if (currentPos === -1) currentPos = 0;
    var nextPos = -1;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        nextPos = (currentPos + 1) % enabled.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        nextPos = (currentPos - 1 + enabled.length) % enabled.length;
        break;
      case 'Home':
        e.preventDefault();
        nextPos = 0;
        break;
      case 'End':
        e.preventDefault();
        nextPos = enabled.length - 1;
        break;
      default:
        return;
    }

    if (nextPos >= 0) {
      var nextIdx = enabled[nextPos];
      this._select(nextIdx);
      var input = this.el.querySelectorAll('.ai-radio-item__input')[nextIdx];
      if (input) input.focus();
    }
  };

  AI.Radio.prototype.getValue = function () { return this.value; };
  AI.Radio.prototype.setValue = function (value) { this._select(this._findIndex(value)); };
  AI.Radio.prototype.disable = function () { this.disabled = true; this._render(); };
  AI.Radio.prototype.enable = function () { this.disabled = false; this._render(); };

  /* ============================================
     Tooltip — 工具提示（hover/focus/click）
     ============================================ */
  AI.Tooltip = function (el, options) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    if (!this.el) return;

    this.options = options || {};
    this.title = this.options.title || this.el.getAttribute('data-title') || '';
    this.placement = this.options.placement || this.el.getAttribute('data-placement') || 'top';
    this.trigger = this.options.trigger || this.el.getAttribute('data-trigger') || 'hover';
    this.variant = this.options.variant || this.el.getAttribute('data-variant') || 'default';
    this.bordered = this.options.bordered !== false;
    if (this.el.getAttribute('data-borderless') === 'true') this.bordered = false;

    this._visible = false;
    this._timer = null;
    this._render();
    this._bindTrigger();
  };

  AI.Tooltip.prototype._render = function () {
    var tip = this.el.querySelector('.ai-tooltip');
    if (!tip) {
      tip = document.createElement('div');
      tip.className = 'ai-tooltip';
      tip.setAttribute('role', 'tooltip');
      this.el.appendChild(tip);
    }

    var cls = 'ai-tooltip ai-tooltip--' + this.placement +
      (this.variant === 'island' ? ' ai-tooltip--island' : '') +
      (this.bordered ? ' ai-tooltip--bordered' : ' ai-tooltip--borderless');
    tip.className = cls;

    if (this.variant === 'island') {
      // 原版：仅 bordered 时渲染异形轮廓 SVG；borderless 用普通圆角底色
      var islandSvg = this.bordered
        ? '<svg class="ai-tooltip__island-svg" viewBox="0 0 1 1" preserveAspectRatio="none" aria-hidden="true">' +
            '<path d="M0.501,0.005 L0.549,0.006 C0.704,0.01,0.796,0.017,0.825,0.027 L0.827,0.028 C0.872,0.045,0.939,0.044,0.978,0.17 C1,0.254,1,0.365,0.99,0.505 L0.988,0.513 C0.979,0.558,0.971,0.598,0.965,0.633 C0.956,0.689,0.979,0.77,0.964,0.865 C0.953,0.928,0.921,0.966,0.869,0.979 C0.821,0.986,0.773,0.992,0.726,0.995 L0.694,0.997 C0.648,1,0.586,1,0.507,1 L0.464,1 C0.385,1,0.325,0.998,0.283,0.995 C0.234,0.992,0.184,0.987,0.133,0.979 C0.081,0.966,0.05,0.928,0.039,0.865 C0.023,0.77,0.047,0.689,0.037,0.633 C0.031,0.595,0.023,0.552,0.013,0.505 C-0.006,0.365,-0.002,0.254,0.024,0.17 C0.064,0.045,0.13,0.045,0.174,0.028 L0.175,0.028 C0.204,0.017,0.303,0.009,0.474,0.005 L0.501,0.005" ' +
              'fill="rgb(247, 243, 223)" stroke="#c4b89e" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linejoin="round"></path>' +
          '</svg>'
        : '';
      tip.innerHTML =
        '<div class="ai-tooltip__island-body">' +
          islandSvg +
          '<div class="ai-tooltip__island-content"><div class="ai-tooltip__content">' + this.title + '</div></div>' +
        '</div>' +
        '<span class="ai-tooltip__tail" aria-hidden="true"></span>';
    } else {
      tip.innerHTML = '<div class="ai-tooltip__content">' + this.title + '</div>';
    }

    this._tip = tip;
  };

  AI.Tooltip.prototype._bindTrigger = function () {
    var self = this;
    if (this.trigger === 'hover') {
      this.el.addEventListener('mouseenter', function () { self.show(); });
      this.el.addEventListener('mouseleave', function () { self.hide(); });
      this._tip.addEventListener('mouseenter', function () { self.show(); });
      this._tip.addEventListener('mouseleave', function () { self.hide(); });
    } else if (this.trigger === 'focus') {
      var triggerEl = this.el.firstElementChild;
      if (triggerEl) {
        triggerEl.addEventListener('focus', function () { self.show(); });
        triggerEl.addEventListener('blur', function () { self.hide(); });
      }
    } else if (this.trigger === 'click') {
      var clickEl = this.el.firstElementChild || this.el;
      clickEl.addEventListener('click', function (e) {
        e.stopPropagation();
        self._visible ? self.hide() : self.show();
      });
      document.addEventListener('click', function (e) {
        if (!self.el.contains(e.target)) self.hide();
      });
    }
  };

  AI.Tooltip.prototype.show = function () {
    var self = this;
    clearTimeout(this._timer);
    this._timer = setTimeout(function () {
      self._visible = true;
      self._tip.classList.add('ai-tooltip--visible');
      self._tip.setAttribute('aria-hidden', 'false');
    }, 0);
  };

  AI.Tooltip.prototype.hide = function () {
    var self = this;
    clearTimeout(this._timer);
    this._timer = setTimeout(function () {
      self._visible = false;
      self._tip.classList.remove('ai-tooltip--visible');
      self._tip.setAttribute('aria-hidden', 'true');
    }, 100);
  };

  AI.Tooltip.prototype.setTitle = function (title) {
    this.title = title;
    this._render();
  };

  AI.Tooltip.prototype.destroy = function () {
    clearTimeout(this._timer);
    if (this._tip && this._tip.parentNode) {
      this._tip.parentNode.removeChild(this._tip);
    }
  };

  /* ============================================
     BackTop — 返回顶部
     ============================================ */
  AI.BackTop = function (el, options) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    if (!this.el) {
      this.el = document.createElement('button');
      this.el.className = 'ai-backtop';
      this.el.setAttribute('type', 'button');
      this.el.setAttribute('aria-label', '返回顶部');
      document.body.appendChild(this.el);
    }

    this.options = options || {};
    this.visibilityHeight = this.options.visibilityHeight || 400;
    this.duration = this.options.duration || 300;
    this.onClick = this.options.onClick || null;

    // Target: window by default, or options.target() returning HTMLElement
    this._getTarget = this.options.target
      ? this.options.target
      : function () { return window; };

    // Build inner image if not present
    var img = this.el.querySelector('.ai-backtop__img');
    if (!img) {
      img = document.createElement('img');
      img.className = 'ai-backtop__img';
      img.alt = '返回顶部';
      img.src = this.options.imgSrc || AI.BackTop.DEFAULT_IMG;
      this.el.appendChild(img);
    }
    this.el.setAttribute('role', 'button');
    this.el.setAttribute('tabindex', '0');

    this._onScroll = this._onScroll.bind(this);
    this._scrollToTop = this._scrollToTop.bind(this);
    this._onKeydown = this._onKeydown.bind(this);

    this.el.addEventListener('click', this._scrollToTop);
    this.el.addEventListener('keydown', this._onKeydown);

    var target = this._getTarget();
    target.addEventListener('scroll', this._onScroll, { passive: true });
    this._onScroll();
  };

  // naive-icons RocketIcon 等价手绘（48 视口：奶油机身 / 青绿舷窗 / 珊瑚尾焰与尾翼 / 墨色描边）
  AI.BackTop.DEFAULT_IMG = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">' +
      '<path d="M24 34c2.5 3 4 6 4 8.5 0 2-1.6 3.5-4 3.5s-4-1.5-4-3.5c0-2.5 1.5-5.5 4-8.5z" fill="#E76F51" stroke="#2A2A2A" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M17 26c-3.5 1.5-5.5 4.5-6 8 2.5.5 5-.5 7-2.5" fill="#E76F51" stroke="#2A2A2A" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M31 26c3.5 1.5 5.5 4.5 6 8-2.5.5-5-.5-7-2.5" fill="#E76F51" stroke="#2A2A2A" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M24 4c5.5 3 9 10 9 18 0 5-1 9-3 13H18c-2-4-3-8-3-13 0-8 3.5-15 9-18z" fill="#FAEDCD" stroke="#2A2A2A" stroke-width="2" stroke-linejoin="round"/>' +
      '<circle cx="24" cy="19" r="4.5" fill="#2A9D8F" stroke="#2A2A2A" stroke-width="2"/>' +
    '</svg>'
  );

  AI.BackTop.prototype._onScroll = function () {
    var target = this._getTarget();
    var scrollTop = target === window ? window.scrollY : target.scrollTop;
    if (scrollTop > this.visibilityHeight) {
      this.el.classList.add('ai-backtop--visible');
    } else {
      this.el.classList.remove('ai-backtop--visible');
    }
  };

  AI.BackTop.prototype._scrollToTop = function (e) {
    var target = this._getTarget();
    var start = target === window ? window.scrollY : target.scrollTop;
    var startTime = performance.now();
    var duration = this.duration;
    var isWindow = target === window;

    function animate(now) {
      var elapsed = now - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var eased = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      var current = start * (1 - eased);
      if (isWindow) {
        window.scrollTo(0, current);
      } else {
        target.scrollTop = current;
      }
      if (progress < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
    if (this.onClick) this.onClick(e);
  };

  AI.BackTop.prototype._onKeydown = function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._scrollToTop(e);
    }
  };

  AI.BackTop.prototype.destroy = function () {
    var target = this._getTarget();
    target.removeEventListener('scroll', this._onScroll);
    this.el.removeEventListener('click', this._scrollToTop);
    this.el.removeEventListener('keydown', this._onKeydown);
    if (this.el.parentNode) this.el.parentNode.removeChild(this.el);
  };

  /* ============================================
     Drawer — 抽屉（左/右/上/下，遮罩，景深）
     ============================================ */
  AI.Drawer = function (el, options) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    this.options = options || {};

    this.placement = this.options.placement || (this.el && this.el.getAttribute('data-placement')) || 'right';
    this.title = this.options.title || (this.el && this.el.getAttribute('data-title')) || '';
    this.width = this.options.width || 378;
    this.height = this.options.height || 300;
    this.maskClosable = this.options.maskClosable !== false;
    this.pushBackground = this.options.pushBackground !== false;
    this.footer = this.options.footer != null ? this.options.footer : null;
    this.bodyHTML = this.options.body != null ? this.options.body : null;
    this.onClose = this.options.onClose || null;

    this._open = false;
    this._previouslyFocused = null;
    this._pushed = [];
    this._rafId = null;
    this._restoreRafId = null;

    if (this.el && this.el.nodeType) {
      // Inline mode: read children as body, mount onto body
      this._initFromExistingEl();
    } else {
      this.el = null;
    }
  };

  AI.Drawer.prototype._initFromExistingEl = function () {
    var self = this;
    // Wrap existing content (children) as body content
    var existingBody = '';
    var children = Array.prototype.slice.call(this.el.childNodes);
    children.forEach(function (c) {
      if (c.nodeType === 1) existingBody += c.outerHTML;
      else if (c.nodeType === 3) existingBody += c.textContent;
    });
    if (this.bodyHTML == null) this.bodyHTML = existingBody;
    this.el.style.display = 'none';
    this.el.setAttribute('aria-hidden', 'true');
    // Listen for triggers via data attribute
    var triggerSel = this.el.getAttribute('data-trigger');
    if (triggerSel) {
      var trigger = document.querySelector(triggerSel);
      if (trigger) trigger.addEventListener('click', function () { self.open(); });
    }
  };

  AI.Drawer.prototype._buildDOM = function () {
    var self = this;
    if (this._mask) return;

    var mask = document.createElement('div');
    // 原版横向抽屉用 Cursor 包裹（全覆盖自定义光标）
    var useCursor = this.placement === 'left' || this.placement === 'right';
    mask.className = 'ai-drawer-mask' + (useCursor ? ' ai-cursor ai-cursor--force' : '');
    mask.setAttribute('data-animal-drawer-portal', '');

    var panel = document.createElement('div');
    panel.className = 'ai-drawer ai-drawer--' + this.placement;
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('tabindex', '-1');

    if (this.placement === 'left' || this.placement === 'right') {
      panel.style.width = typeof this.width === 'number' ? this.width + 'px' : this.width;
    } else {
      panel.style.height = typeof this.height === 'number' ? this.height + 'px' : this.height;
    }

    var html = '';
    if (this.title) {
      html += '<div class="ai-drawer__header">' +
        '<div class="ai-drawer__title">' + this.title + '</div>' +
        '<button type="button" class="ai-drawer__close" aria-label="关闭">×</button>' +
      '</div>';
    }
    html += '<div class="ai-drawer__body">' + (this.bodyHTML || '') + '</div>';
    if (this.footer) {
      html += '<div class="ai-drawer__footer">' + this.footer + '</div>';
    }
    panel.innerHTML = html;

    mask.appendChild(panel);
    document.body.appendChild(mask);

    // Click handlers
    mask.addEventListener('click', function (e) {
      if (e.target === mask && self.maskClosable) self.close();
    });
    var closeBtn = panel.querySelector('.ai-drawer__close');
    if (closeBtn) closeBtn.addEventListener('click', function () { self.close(); });

    // Keydown (ESC + Tab trap)
    this._onKeydown = function (e) { self._handleKeydown(e); };

    this._mask = mask;
    this._panel = panel;
  };

  AI.Drawer.prototype._handleKeydown = function (e) {
    if (e.key === 'Escape') {
      this.close();
      return;
    }
    if (e.key !== 'Tab') return;
    var focusables = AI.Drawer._getFocusable(this._panel);
    if (!focusables.length) {
      e.preventDefault();
      this._panel.focus();
      return;
    }
    var first = focusables[0];
    var last = focusables[focusables.length - 1];
    var active = document.activeElement;
    if (e.shiftKey) {
      if (active === first || !this._panel.contains(active)) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (active === last || !this._panel.contains(active)) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  AI.Drawer._getFocusable = function (root) {
    var sel = 'a[href],area[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),' +
      'select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"]),' +
      'audio[controls],video[controls],[contenteditable]:not([contenteditable="false"])';
    var result = [];
    var all = root.querySelectorAll(sel);
    for (var i = 0; i < all.length; i++) {
      var el = all[i];
      if (!el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true') {
        result.push(el);
      }
    }
    return result;
  };

  AI.Drawer.prototype.open = function () {
    if (this._open) return;
    this._open = true;
    this._buildDOM();
    var self = this;

    this._previouslyFocused = document.activeElement;
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(function () {
      self._mask.classList.add('ai-drawer-mask--open');
      self._panel.classList.add('ai-drawer--open');
      self._panel.setAttribute('aria-hidden', 'false');

      setTimeout(function () {
        var focusables = AI.Drawer._getFocusable(self._panel);
        (focusables[0] || self._panel).focus();
      }, 0);
    });

    if (this.pushBackground) this._applyPush();
    document.addEventListener('keydown', this._onKeydown);
  };

  AI.Drawer.prototype.close = function () {
    if (!this._open) return;
    this._open = false;
    var self = this;

    this._mask.classList.remove('ai-drawer-mask--open');
    this._panel.classList.remove('ai-drawer--open');
    this._panel.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', this._onKeydown);

    setTimeout(function () {
      if (self._mask && self._mask.parentNode) {
        self._mask.parentNode.removeChild(self._mask);
      }
      self._mask = null;
      self._panel = null;
      if (self._previouslyFocused && self._previouslyFocused.focus) {
        self._previouslyFocused.focus();
      }
    }, 360);

    this._restorePush();
    if (this.onClose) this.onClose();
  };

  AI.Drawer.prototype._applyPush = function () {
    var self = this;
    if (this._restoreRafId !== null) {
      cancelAnimationFrame(this._restoreRafId);
      this._restoreRafId = null;
    }

    var candidates = [];
    var children = document.body.children;
    for (var i = 0; i < children.length; i++) {
      var el = children[i];
      if (!(el instanceof HTMLElement)) continue;
      var tag = el.tagName;
      if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') continue;
      if (el.hasAttribute('data-animal-drawer-ignore')) continue;
      if (el.hasAttribute('data-animal-drawer-portal')) continue;
      if (getComputedStyle(el).position === 'fixed') continue;
      candidates.push(el);
    }

    this._pushed = candidates.map(function (el) {
      return {
        el: el,
        transform: el.style.transform,
        filter: el.style.filter,
        borderRadius: el.style.borderRadius,
        overflow: el.style.overflow,
        transition: el.style.transition,
      };
    });

    candidates.forEach(function (el) {
      el.style.transition = 'transform 0.36s cubic-bezier(0.2, 0, 0.2, 1), filter 0.36s ease, border-radius 0.36s ease';
    });

    this._rafId = requestAnimationFrame(function () {
      candidates.forEach(function (el) {
        el.style.transform = 'scale(0.94)';
        el.style.filter = 'blur(1px)';
        el.style.borderRadius = '14px';
        el.style.overflow = 'hidden';
      });
    });
  };

  AI.Drawer.prototype._restorePush = function () {
    var self = this;
    if (this._rafId !== null) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
    this._pushed.forEach(function (item) {
      item.el.style.transform = item.transform;
      item.el.style.filter = item.filter;
      item.el.style.borderRadius = item.borderRadius;
      item.el.style.overflow = item.overflow;
    });
    this._restoreRafId = requestAnimationFrame(function () {
      self._pushed.forEach(function (item) {
        item.el.style.transition = item.transition;
      });
      self._restoreRafId = null;
    });
  };

  AI.Drawer.prototype.isOpen = function () { return this._open; };

  /* ============================================
     Notification — 通知（命令式 API）
     ============================================ */
  AI.Notification = function (config) {
    return AI.Notification.open(config);
  };

  AI.Notification._positions = ['top', 'topLeft', 'topRight', 'bottom', 'bottomLeft', 'bottomRight'];
  AI.Notification._containers = {};
  AI.Notification._items = {};
  AI.Notification._idCounter = 0;

  AI.Notification._getContainer = function (position) {
    if (AI.Notification._containers[position]) return AI.Notification._containers[position];
    var root = document.querySelector('.ai-notification-root');
    if (!root) {
      root = document.createElement('div');
      root.className = 'ai-notification-root';
      document.body.appendChild(root);
    }
    var pos = document.createElement('div');
    pos.className = 'ai-notification-position ai-notification-position--' + position;
    pos.setAttribute('data-position', position);
    root.appendChild(pos);
    AI.Notification._containers[position] = pos;
    return pos;
  };

  AI.Notification._ICONS = {
    success: '<svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    info: '<svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden><circle cx="12" cy="7" r="1.6" fill="currentColor"/><path d="M12 11v7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>',
    warning: '<svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden><path d="M12 4l9.5 16.5h-19z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/><path d="M12 10v4M12 16.5v.01" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>',
    error: '<svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden><path d="M6.5 6.5l11 11M17.5 6.5l-11 11" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>',
  };

  AI.Notification._html = function (value) {
    if (value == null) return '';
    var text = String(value);
    return /[<&]/.test(text) ? text : AI.Loading._escape(text);
  };

  AI.Notification._applyStyle = function (el, style) {
    if (!style) return;
    if (typeof style === 'string') {
      el.style.cssText = style;
      return;
    }
    for (var key in style) {
      if (!Object.prototype.hasOwnProperty.call(style, key)) continue;
      el.style[key] = style[key];
    }
  };

  AI.Notification.open = function (config) {
    var cfg = typeof config === 'string' ? { message: config } : (config || {});
    var type = cfg.type || 'info';
    var position = cfg.position || 'top';
    var placement = position === 'bottom' || position === 'bottomLeft' || position === 'bottomRight' ? 'bottom' : 'top';
    var duration = cfg.duration != null ? cfg.duration : 4.5;
    var key = cfg.key || ('ai-notif-' + (++AI.Notification._idCounter));

    // 同 key 再次 open：替换现有通知（不触发旧 onClose）
    if (AI.Notification._items[key]) {
      AI.Notification._remove(key, true, true);
    }

    var container = AI.Notification._getContainer(position);
    var notif = document.createElement('div');
    notif.className = 'ai-notification ai-notification--' + type + ' ai-notification--placement-' + placement;
    if (cfg.onClick) notif.classList.add('ai-notification--clickable');
    if (cfg.className) notif.className += ' ' + cfg.className;
    notif.setAttribute('data-notification-key', key);
    AI.Notification._applyStyle(notif, cfg.style);
    if (cfg.onClick) {
      notif.setAttribute('role', 'button');
      notif.setAttribute('tabindex', '0');
    }

    var iconHTML = cfg.icon != null ? cfg.icon : AI.Notification._ICONS[type];
    var html =
      '<div class="ai-notification__icon-wrap" aria-hidden="true">' + iconHTML + '</div>' +
      '<div class="ai-notification__body">' +
        '<div class="ai-notification__title">' + AI.Notification._html(cfg.message) + '</div>';
    if (cfg.description != null) {
      html += '<div class="ai-notification__description">' + AI.Notification._html(cfg.description) + '</div>';
    }
    html += '</div>';
    if (cfg.btn) {
      html += '<div class="ai-notification__btn-slot">' + cfg.btn + '</div>';
    }
    html += '<button type="button" class="ai-notification__close" aria-label="close">' + (cfg.closeIcon || '<span aria-hidden="true">×</span>') + '</button>';
    notif.innerHTML = html;

    notif.addEventListener('click', function (e) {
      if (e.target.closest('.ai-notification__close')) return;
      if (cfg.onClick) cfg.onClick();
    });
    notif.addEventListener('keydown', function (e) {
      if (!cfg.onClick) return;
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        cfg.onClick();
      }
    });
    var closeBtn = notif.querySelector('.ai-notification__close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        AI.Notification._remove(key);
      });
    }

    container.appendChild(notif);

    var item = {
      key: key,
      el: notif,
      leaving: false,
      timer: duration > 0 ? setTimeout(function () {
        AI.Notification._remove(key);
      }, duration * 1000) : null,
      onClose: cfg.onClose,
    };
    AI.Notification._items[key] = item;
    return key;
  };

  AI.Notification._remove = function (key, immediate, silent) {
    var item = AI.Notification._items[key];
    if (!item || item.leaving) return;
    if (item.timer) { clearTimeout(item.timer); item.timer = null; }
    item.leaving = true;

    var el = item.el;
    var finish = function () {
      if (el && el.parentNode) el.parentNode.removeChild(el);
      delete AI.Notification._items[key];
      if (!silent && item.onClose) item.onClose();
    };

    if (immediate || !el) {
      finish();
      return;
    }

    el.classList.add('ai-notification--leaving');
    setTimeout(finish, 250);
  };

  AI.Notification.success = function (cfg) { cfg = typeof cfg === 'string' ? { message: cfg } : Object.assign({}, cfg); cfg.type = 'success'; return AI.Notification.open(cfg); };
  AI.Notification.info = function (cfg) { cfg = typeof cfg === 'string' ? { message: cfg } : Object.assign({}, cfg); cfg.type = 'info'; return AI.Notification.open(cfg); };
  AI.Notification.warning = function (cfg) { cfg = typeof cfg === 'string' ? { message: cfg } : Object.assign({}, cfg); cfg.type = 'warning'; return AI.Notification.open(cfg); };
  AI.Notification.error = function (cfg) { cfg = typeof cfg === 'string' ? { message: cfg } : Object.assign({}, cfg); cfg.type = 'error'; return AI.Notification.open(cfg); };

  AI.Notification.close = function (key) { AI.Notification._remove(key); };

  AI.Notification.destroy = function (key) {
    if (key) {
      AI.Notification._remove(key, true);
      return;
    }
    Object.keys(AI.Notification._items).forEach(function (k) {
      AI.Notification._remove(k, true);
    });
    AI.Notification._positions.forEach(function (p) {
      var c = AI.Notification._containers[p];
      if (c && c.parentNode) c.parentNode.removeChild(c);
      delete AI.Notification._containers[p];
    });
  };

  /* ============================================
     Form — 表单（校验、值管理、提交）
     ============================================ */
  AI.Form = function (el, options) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    if (!this.el) return;

    this.options = options || {};
    this.layout = this.options.layout || this.el.getAttribute('data-layout') || 'horizontal';
    this.size = this.options.size || 'middle';
    this.disabled = !!this.options.disabled;
    this.labelAlign = this.options.labelAlign || (this.layout === 'horizontal' ? 'right' : 'left');
    this.colon = this.options.colon !== false;
    this.requiredMark = this.options.requiredMark !== undefined ? this.options.requiredMark : true;

    this.onFinish = this.options.onFinish || null;
    this.onFinishFailed = this.options.onFinishFailed || null;
    this.onValuesChange = this.options.onValuesChange || null;
    this.onReset = this.options.onReset || null;

    this._fields = {};      // name -> { el, rules, value, errors, touched, validating }
    this._initialValues = this.options.initialValues || {};

    this._init();
  };

  AI.Form._defaultValidators = {
    required: function (value, rule) {
      if (rule.required === false) return null;
      if (value === undefined || value === null || value === '') return rule.message || '该字段为必填项';
      if (typeof value === 'string' && rule.whitespace && !value.trim()) return rule.message || '该字段不能全为空白';
      if (Array.isArray(value) && value.length === 0) return rule.message || '至少选择一项';
      return null;
    },
    type: function (value, rule) {
      if (value === undefined || value === null || value === '') return null;
      var t = rule.type;
      var ok = true;
      try {
        if (t === 'email') ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value));
        else if (t === 'url') ok = /^https?:\/\//.test(String(value));
        else if (t === 'number') ok = !isNaN(Number(value));
        else if (t === 'integer') ok = /^-?\d+$/.test(String(value));
        else if (t === 'float') ok = /^-?\d+(\.\d+)?$/.test(String(value));
        else if (t === 'boolean') ok = value === true || value === false || value === 'true' || value === 'false';
        else if (t === 'array') ok = Array.isArray(value);
        else if (t === 'object') ok = typeof value === 'object' && !Array.isArray(value);
        else if (t === 'date') ok = value instanceof Date || !isNaN(Date.parse(value));
        else if (t === 'string') ok = typeof value === 'string';
      } catch (e) { ok = false; }
      return ok ? null : (rule.message || '类型不正确，应为 ' + t);
    },
    min: function (value, rule) {
      if (value === undefined || value === null || value === '') return null;
      var numericType = rule.type === 'number' || rule.type === 'integer' || rule.type === 'float';
      if (numericType || typeof value === 'number') {
        var num = Number(value);
        if (!isNaN(num) && num < rule.min) return rule.message || '不能小于 ' + rule.min;
      } else if (typeof value === 'string' || Array.isArray(value)) {
        if (value.length < rule.min) return rule.message || '长度不能少于 ' + rule.min;
      }
      return null;
    },
    max: function (value, rule) {
      if (value === undefined || value === null || value === '') return null;
      var numericType = rule.type === 'number' || rule.type === 'integer' || rule.type === 'float';
      if (numericType || typeof value === 'number') {
        var num = Number(value);
        if (!isNaN(num) && num > rule.max) return rule.message || '不能大于 ' + rule.max;
      } else if (typeof value === 'string' || Array.isArray(value)) {
        if (value.length > rule.max) return rule.message || '长度不能超过 ' + rule.max;
      }
      return null;
    },
    len: function (value, rule) {
      if (value === undefined || value === null || value === '') return null;
      if (typeof value === 'string' || Array.isArray(value)) {
        if (value.length !== rule.len) return rule.message || '长度必须为 ' + rule.len;
      }
      return null;
    },
    pattern: function (value, rule) {
      if (value === undefined || value === null || value === '') return null;
      var pattern = rule.pattern instanceof RegExp ? rule.pattern : new RegExp(rule.pattern);
      if (!pattern.test(String(value))) return rule.message || '格式不正确';
      return null;
    },
    validator: function (value, rule) {
      if (typeof rule.validator !== 'function') return null;
      try {
        var result = rule.validator(rule, value);
        if (result instanceof Promise) {
          return result.then(
            function (msg) { return msg || null; },
            function (err) { return (err && err.message) || '校验失败'; }
          );
        }
        return result || null;
      } catch (e) {
        return e.message || '校验失败';
      }
    },
  };

  AI.Form._parseCol = function (col) {
    if (col == null) return { span: 24, offset: 0 };
    if (typeof col === 'number') return { span: col, offset: 0 };
    if (typeof col === 'string') {
      try { col = JSON.parse(col); } catch (e) { col = { span: parseInt(col, 10) || 24 }; }
    }
    return { span: col.span || 24, offset: col.offset || 0 };
  };

  AI.Form.prototype._init = function () {
    var self = this;
    // Layout class
    var layoutCls = this.layout === 'vertical' ? 'ai-form--vertical'
      : this.layout === 'inline' ? 'ai-form--inline'
      : 'ai-form--horizontal';
    var sizeCls = this.size === 'small' ? 'ai-form--small'
      : this.size === 'large' ? 'ai-form--large'
      : 'ai-form--middle';
    this.el.className = 'ai-form ' + layoutCls + ' ' + sizeCls + (this.disabled ? ' ai-form--disabled' : '');

    // Collect Form.Items
    var items = this.el.querySelectorAll('.ai-form-item');
    items.forEach(function (item) {
      var name = item.getAttribute('data-name');
      if (!name) return;
      var rulesAttr = item.getAttribute('data-rules');
      var rules = rulesAttr ? JSON.parse(rulesAttr) : [];
      if (self.options.rules && self.options.rules[name]) rules = self.options.rules[name];
      var control = item.querySelector('.ai-form-item__control-input') || item.querySelector('.ai-form-item__control');
      var inputEl = control ? control.querySelector('input,textarea,select') : null;
      var groupEl = control ? control.querySelector('.ai-checkbox-group, .ai-radio-group') : null;
      var kind = groupEl ? (groupEl.classList.contains('ai-checkbox-group') ? 'checkbox' : 'radio') : 'input';
      var initial = self._initialValues[name];

      // 标签：对齐 / 冒号 / 必填星号
      var labelEl = item.querySelector('.ai-form-item__label');
      if (labelEl) {
        labelEl.style.textAlign = self.labelAlign;
        var hasText = labelEl.textContent.trim() !== '';
        labelEl.classList.toggle('ai-form-item__label--colon', self.colon && hasText);
        var isRequired = rules.some(function (r) { return r && r.required; }) || item.getAttribute('data-required') === 'true';
        labelEl.classList.toggle('ai-form-item__label--required', isRequired && self.requiredMark !== false);
        if (inputEl && !labelEl.getAttribute('for')) labelEl.setAttribute('for', name);
      }

      // 栅格：labelCol / wrapperCol（24 列）
      var labelCol = item.getAttribute('data-label-col') || self.options.labelCol;
      var wrapperCol = item.getAttribute('data-wrapper-col') || self.options.wrapperCol;
      if (labelCol && labelEl) {
        var lc = AI.Form._parseCol(labelCol);
        labelEl.style.flex = '0 0 ' + (lc.span / 24 * 100) + '%';
        labelEl.style.marginLeft = (lc.offset / 24 * 100) + '%';
      }
      if (wrapperCol && control && control.parentNode) {
        var wc = AI.Form._parseCol(wrapperCol);
        var wrap = control.parentNode;
        wrap.style.flex = '0 0 ' + (wc.span / 24 * 100) + '%';
        wrap.style.marginLeft = (wc.offset / 24 * 100) + '%';
      }

      var defaultValue;
      if (initial !== undefined) defaultValue = initial;
      else if (kind === 'checkbox') defaultValue = self._groupValues(groupEl);
      else if (kind === 'radio') defaultValue = self._groupValue(groupEl);
      else defaultValue = inputEl ? inputEl.value : '';

      self._fields[name] = {
        el: item,
        name: name,
        rules: rules,
        value: defaultValue,
        errors: [],
        touched: false,
        validating: false,
        inputEl: inputEl,
        groupEl: groupEl,
        kind: kind,
      };

      if (kind === 'input' && inputEl) {
        inputEl.addEventListener('input', function () {
          self._setFieldValue(name, inputEl.value, { touch: true });
        });
        inputEl.addEventListener('change', function () {
          self._setFieldValue(name, inputEl.value, { touch: true });
        });
        inputEl.addEventListener('blur', function () {
          self._validateField(name);
        });
        // Apply initial value
        if (initial !== undefined) {
          inputEl.value = initial;
        }
      } else if (kind === 'checkbox' && groupEl) {
        item.addEventListener('ai-checkbox-change', function (e) {
          self._setFieldValue(name, (e.detail && e.detail.values) || self._groupValues(groupEl), { touch: true });
        });
        if (initial !== undefined) self._applyFieldValue(name);
      } else if (kind === 'radio' && groupEl) {
        item.addEventListener('change', function () {
          self._setFieldValue(name, self._groupValue(groupEl), { touch: true });
        });
        if (initial !== undefined) self._applyFieldValue(name);
      }
    });

    // Submit handler
    this.el.addEventListener('submit', function (e) {
      e.preventDefault();
      self.submit();
    });
    if (this.options.onReset !== undefined || this.el.querySelector('button[type="reset"]')) {
      this.el.addEventListener('reset', function (e) {
        // Allow default reset, then sync fields
        setTimeout(function () { self._afterReset(); }, 0);
      });
    }
  };

  AI.Form.prototype._groupValues = function (groupEl) {
    var values = [];
    if (!groupEl) return values;
    groupEl.querySelectorAll('.ai-checkbox-item--checked').forEach(function (item) {
      values.push(item.getAttribute('data-value'));
    });
    return values;
  };

  AI.Form.prototype._groupValue = function (groupEl) {
    if (!groupEl) return undefined;
    if (groupEl._aiRadio) return groupEl._aiRadio.value;
    var checked = groupEl.querySelector('.ai-radio-item--checked');
    return checked ? checked.getAttribute('data-value') : undefined;
  };

  /** 把 field.value 回写到 input / checkbox 组 / radio 组的视图中 */
  AI.Form.prototype._applyFieldValue = function (name) {
    var field = this._fields[name];
    if (!field) return;
    if (field.kind === 'checkbox' && field.groupEl) {
      var arr = Array.isArray(field.value) ? field.value : [];
      if (field.groupEl._aiCheckbox) {
        field.groupEl._aiCheckbox._applyValues(arr);
      } else {
        field.groupEl.querySelectorAll('.ai-checkbox-item').forEach(function (item) {
          var on = arr.indexOf(item.getAttribute('data-value')) > -1;
          item.classList.toggle('ai-checkbox-item--checked', on);
          item.setAttribute('aria-checked', on ? 'true' : 'false');
        });
      }
    } else if (field.kind === 'radio' && field.groupEl) {
      if (field.groupEl._aiRadio) field.groupEl._aiRadio.setValue(field.value);
    } else if (field.inputEl) {
      field.inputEl.value = field.value == null ? '' : field.value;
    }
  };

  AI.Form.prototype._setFieldValue = function (name, value, opts) {
    var field = this._fields[name];
    if (!field) return;
    var prev = field.value;
    field.value = value;
    if (opts && opts.touch) field.touched = true;
    if (prev !== value) {
      if (this.onValuesChange) {
        var changed = {}; changed[name] = value;
        this.onValuesChange(changed, this.getFieldsValue());
      }
    }
  };

  AI.Form.prototype._afterReset = function () {
    var self = this;
    Object.keys(this._fields).forEach(function (name) {
      var field = self._fields[name];
      field.value = self._initialValues[name] !== undefined ? self._initialValues[name]
        : field.kind === 'checkbox' ? [] : '';
      field.errors = [];
      field.touched = false;
      self._applyFieldValue(name);
      self._renderFieldError(name);
    });
    if (this.onReset) this.onReset();
  };

  AI.Form.prototype._validateField = function (name) {
    var field = this._fields[name];
    if (!field) return Promise.resolve();
    var value = field.value;
    var errors = [];
    var self = this;

    field.validating = true;
    self._renderFieldError(name);

    var promises = [];
    for (var i = 0; i < field.rules.length; i++) {
      var rule = field.rules[i];
      var validators = AI.Form._defaultValidators;
      // Try each known validator key
      ['required', 'type', 'min', 'max', 'len', 'pattern', 'validator'].forEach(function (key) {
        if (rule[key] === undefined && key !== 'validator') return;
        if (key === 'validator' && typeof rule.validator !== 'function') return;
        if (key === 'required' && rule.required === false) return;
        if (key === 'type' && !rule.type) return;
        if (key === 'min' && rule.min === undefined) return;
        if (key === 'max' && rule.max === undefined) return;
        if (key === 'len' && rule.len === undefined) return;
        if (key === 'pattern' && !rule.pattern) return;
        var fn = validators[key];
        var result = fn(value, rule);
        if (result instanceof Promise) {
          promises.push(result.then(function (msg) { if (msg) errors.push(msg); }));
        } else if (result) {
          errors.push(result);
        }
      });
    }

    return Promise.all(promises).then(function () {
      field.errors = errors;
      field.validating = false;
      self._renderFieldError(name);
      return errors;
    });
  };

  AI.Form.prototype._renderFieldError = function (name) {
    var field = this._fields[name];
    if (!field) return;
    var item = field.el;
    item.classList.remove('ai-form-item--has-error', 'ai-form-item--has-warning', 'ai-form-item--has-success', 'ai-form-item--is-validating');
    if (field.validating) {
      item.classList.add('ai-form-item--is-validating');
    } else if (field.errors.length) {
      item.classList.add('ai-form-item--has-error');
    }

    // Append explain INSIDE the control div (so it stacks below the input in all layouts)
    var control = item.querySelector('.ai-form-item__control') || item;
    var explain = control.querySelector('.ai-form-item__explain');
    if (!explain) {
      explain = document.createElement('div');
      explain.className = 'ai-form-item__explain';
      control.appendChild(explain);
    }
    if (field.validating) {
      explain.className = 'ai-form-item__explain';
      explain.textContent = '校验中...';
    } else if (field.errors.length) {
      explain.className = 'ai-form-item__explain ai-form-item__explain--error';
      explain.textContent = field.errors[0];
    } else {
      explain.className = 'ai-form-item__explain';
      explain.textContent = '';
    }
  };

  AI.Form.prototype.getFieldValue = function (name) {
    var field = this._fields[name];
    return field ? field.value : undefined;
  };

  AI.Form.prototype.getFieldsValue = function (nameList) {
    var self = this;
    var result = {};
    var names = nameList === true ? Object.keys(this._fields)
      : Array.isArray(nameList) ? nameList
      : Object.keys(this._fields);
    names.forEach(function (n) {
      if (self._fields[n]) result[n] = self._fields[n].value;
    });
    return result;
  };

  AI.Form.prototype.setFieldValue = function (name, value) {
    var field = this._fields[name];
    if (!field) return;
    field.value = value;
    this._applyFieldValue(name);
    if (this.onValuesChange) {
      var changed = {}; changed[name] = value;
      this.onValuesChange(changed, this.getFieldsValue());
    }
  };

  AI.Form.prototype.setFieldsValue = function (values) {
    var self = this;
    if (!values) return;
    Object.keys(values).forEach(function (name) {
      self.setFieldValue(name, values[name]);
    });
  };

  AI.Form.prototype.resetFields = function (nameList) {
    var self = this;
    var names = Array.isArray(nameList) ? nameList : Object.keys(this._fields);
    names.forEach(function (n) {
      var field = self._fields[n];
      if (!field) return;
      field.value = self._initialValues[n] !== undefined ? self._initialValues[n]
        : field.kind === 'checkbox' ? [] : '';
      field.errors = [];
      field.touched = false;
      self._applyFieldValue(n);
      self._renderFieldError(n);
    });
    if (this.onReset) this.onReset();
  };

  AI.Form.prototype.validateFields = function (nameList) {
    var self = this;
    var names = Array.isArray(nameList) ? nameList : Object.keys(this._fields);
    var promises = names.map(function (n) { return self._validateField(n); });
    return Promise.all(promises).then(function (results) {
      var errorFields = [];
      var values = {};
      results.forEach(function (errs, i) {
        var name = names[i];
        values[name] = self._fields[name].value;
        if (errs && errs.length) {
          errorFields.push({ name: name, errors: errs });
        }
      });
      if (errorFields.length) {
        return Promise.reject({ values: values, errorFields: errorFields, outOfDate: false });
      }
      return values;
    });
  };

  AI.Form.prototype.submit = function () {
    var self = this;
    this.validateFields().then(
      function (values) {
        if (self.onFinish) self.onFinish(values);
      },
      function (info) {
        if (self.onFinishFailed) self.onFinishFailed(info);
      }
    );
  };

  AI.Form.prototype.getFieldError = function (name) {
    var field = this._fields[name];
    return field ? field.errors : undefined;
  };

  AI.Form.prototype.isFieldTouched = function (name) {
    var field = this._fields[name];
    return field ? field.touched : false;
  };

  AI.Form.prototype.isFieldValidating = function (name) {
    var field = this._fields[name];
    return field ? field.validating : false;
  };

  AI.Form.prototype.scrollToField = function (name, options) {
    var field = this._fields[name];
    if (field && field.el && field.el.scrollIntoView) {
      field.el.scrollIntoView(options || { behavior: 'smooth', block: 'center' });
    }
  };

  /* ============================================
     Avatar —— 头像
     圆形/方形、图片/图标/文字三种内容形态
     ============================================ */
  // 默认用户图标（naive-icons UserIcon 等价手绘，实色剪影）
  var AVATAR_USER_ICON =
    '<svg viewBox="0 0 48 48" fill="currentColor" aria-hidden="true">' +
    '<circle cx="24" cy="16.5" r="9.5"/>' +
    '<path d="M7 44c0-11.6 7.6-18.5 17-18.5S41 32.4 41 44v1.5H7V44z"/>' +
    '</svg>';

  var AVATAR_PRESET_SIZE = { small: 32, middle: 40, large: 48 };
  // 各预设尺寸对应的文字字号（px），自定义数字尺寸按 0.4 倍换算
  var AVATAR_PRESET_FONT = { small: 14, middle: 16, large: 20 };

  function aiAvatarResolveSize(size) {
    var s = size != null ? size : 'middle';
    var px = typeof s === 'number' ? s : AVATAR_PRESET_SIZE[s] || AVATAR_PRESET_SIZE.middle;
    var fontPx = typeof s === 'number' ? Math.max(12, Math.round(px * 0.4)) : (AVATAR_PRESET_FONT[s] || 16);
    return { px: px, fontPx: fontPx };
  }

  AI.Avatar = function (el, options) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    if (!this.el) return;
    this.options = options || {};
    this._isImgLoaded = !!this.options.src;
    this.el._aiAvatar = this;
    this._render();
  };

  AI.Avatar.prototype._render = function () {
    var o = this.options;
    var el = this.el;
    var s = aiAvatarResolveSize(o.size);
    el.classList.add('ai-avatar');
    el.classList.toggle('ai-avatar--square', o.shape === 'square');
    el.style.width = s.px + 'px';
    el.style.height = s.px + 'px';
    el.style.lineHeight = s.px + 'px';

    var hasImage = !!o.src && this._isImgLoaded;
    var html = '';
    if (hasImage) {
      // 有图：img 铺满
      el.classList.remove('ai-avatar--placeholder');
      el.removeAttribute('role');
      el.removeAttribute('aria-label');
      html = '<img class="ai-avatar__img" src="' + o.src + '" alt="' + (o.alt || '') + '">';
    } else if (o.icon) {
      // 图标头像
      el.classList.add('ai-avatar--placeholder');
      el.setAttribute('role', 'img');
      el.setAttribute('aria-label', 'avatar');
      html = '<span class="ai-avatar__text">' + o.icon + '</span>';
    } else if (o.text) {
      // 文字头像：超宽时按 available = px - gap*2 等比缩小字号
      el.classList.add('ai-avatar--placeholder');
      el.removeAttribute('role');
      el.removeAttribute('aria-label');
      html = '<span class="ai-avatar__text" style="font-size:' + s.fontPx + 'px">' + o.text + '</span>';
    } else {
      // 默认用户图标占位
      el.classList.add('ai-avatar--placeholder');
      el.setAttribute('role', 'img');
      el.setAttribute('aria-label', 'avatar');
      html = '<span class="ai-avatar__text" style="font-size:' + Math.round(s.px * 0.5) + 'px">' +
        AVATAR_USER_ICON + '</span>';
    }
    el.innerHTML = html;

    var self = this;
    if (hasImage) {
      var img = el.querySelector('.ai-avatar__img');
      if (img) {
        img.addEventListener('error', function () {
          // 图片加载失败：询问 onError，默认回退到占位内容
          var canRetry = self.options.onError ? self.options.onError() : undefined;
          if (canRetry !== false) {
            self._isImgLoaded = false;
            self._render();
          }
        });
      }
    } else if (o.text) {
      var textEl = el.querySelector('.ai-avatar__text');
      var gap = o.gap != null ? o.gap : 4;
      var available = s.px - gap * 2;
      if (textEl && available > 0) {
        var textWidth = textEl.offsetWidth;
        if (textWidth > available) {
          textEl.style.fontSize = (s.fontPx * (available / textWidth)) + 'px';
        }
      }
    }
  };

  AI.Avatar.prototype.update = function (next) {
    var o = next || {};
    var self = this;
    Object.keys(o).forEach(function (k) { self.options[k] = o[k]; });
    if ('src' in o) this._isImgLoaded = !!o.src;
    this._render();
  };

  AI.Avatar.prototype.destroy = function () {
    if (this.el) delete this.el._aiAvatar;
  };

  /* ============================================
     Avatar.Group —— 头像组
     支持 items 配置或已有的 .ai-avatar 子元素两种用法
     ============================================ */
  AI.AvatarGroup = function (el, options) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    if (!this.el) return;
    this.options = options || {};
    this.el._aiAvatarGroup = this;
    this._avatars = [];
    this._moreEl = null;
    this._render();
  };

  AI.AvatarGroup.prototype._render = function () {
    var o = this.options;
    var el = this.el;
    var self = this;
    el.classList.add('ai-avatar-group');
    el.style.setProperty('--avatar-group-gap', (o.gap != null ? o.gap : 8) + 'px');

    this._avatars.forEach(function (a) { a.destroy(); });
    this._avatars = [];
    if (this._moreEl && this._moreEl.parentNode) this._moreEl.parentNode.removeChild(this._moreEl);
    this._moreEl = null;

    var maxCount = o.maxCount && o.maxCount > 0 ? o.maxCount : 0;

    if (o.items && o.items.length) {
      // items 配置模式：由组件创建头像
      var shown = o.items;
      var restCount = 0;
      if (maxCount && o.items.length > maxCount) {
        shown = o.items.slice(0, maxCount);
        restCount = o.items.length - maxCount;
      }
      shown.forEach(function (item) {
        var span = document.createElement('span');
        var opts = {};
        ['src', 'alt', 'icon', 'text'].forEach(function (k) {
          if (item[k] !== undefined) opts[k] = item[k];
        });
        // 把组级 size / shape 注入未显式指定的子头像
        if (o.size !== undefined && item.size === undefined) opts.size = o.size;
        if (o.shape !== undefined && item.shape === undefined) opts.shape = o.shape;
        self._avatars.push(new AI.Avatar(span, opts));
        el.appendChild(span);
      });
      if (restCount > 0) this._appendMore(restCount, o);
    } else {
      // 已有子元素模式：折叠超出 maxCount 的头像
      var kids = Array.prototype.slice.call(el.querySelectorAll('.ai-avatar')).filter(function (k) {
        return k.parentNode === el;
      });
      var rest = 0;
      var shownKids = kids;
      if (maxCount && kids.length > maxCount) {
        shownKids = kids.slice(0, maxCount);
        rest = kids.length - maxCount;
      }
      kids.forEach(function (kid) {
        var inst = kid._aiAvatar;
        if (inst) {
          if (o.size !== undefined && inst.options.size === undefined) { inst.options.size = o.size; inst._render(); }
          if (o.shape !== undefined && inst.options.shape === undefined) { inst.options.shape = o.shape; inst._render(); }
        }
        if (shownKids.indexOf(kid) === -1) kid.style.display = 'none';
        else kid.style.display = '';
      });
      if (rest > 0) this._appendMore(rest, o);
    }
  };

  AI.AvatarGroup.prototype._appendMore = function (restCount, o) {
    var more = document.createElement('span');
    more.className = 'ai-avatar ai-avatar--placeholder ai-avatar-group__more';
    var s = aiAvatarResolveSize(o.size);
    more.style.width = s.px + 'px';
    more.style.height = s.px + 'px';
    if (o.maxStyle) more.style.cssText += o.maxStyle;
    more.textContent = '+' + restCount;
    this.el.appendChild(more);
    this._moreEl = more;
  };

  AI.AvatarGroup.prototype.destroy = function () {
    this._avatars.forEach(function (a) { a.destroy(); });
    this._avatars = [];
    if (this.el) delete this.el._aiAvatarGroup;
  };

  /* ============================================
     Badge —— 徽标数
     数字 / 封顶数字 / 小红点，独立或包裹两用
     ============================================ */
  // 全角 / CJK 字符在正圆里会顶破圆直径
  var BADGE_FULLWIDTH = /[\u2E80-\u9FFF\uF900-\uFAFF\uFF00-\uFFEF]/;

  // 纯数字或纯数字字符串才参与封顶换算，其余内容原样展示
  function badgeToNumeric(value) {
    if (typeof value === 'number') return value;
    if (typeof value === 'string' && value.trim() !== '' && !isNaN(Number(value))) return Number(value);
    return null;
  }

  // 1–2 位内容锁成正圆；「100」「99+」等 3 位以上、两格全角字回退为胶囊
  function badgeFitsCircle(value) {
    var text = typeof value === 'number' ? String(value) : typeof value === 'string' ? value.trim() : null;
    if (text === null || text.length === 0 || text.length > 2) return false;
    return !(text.length === 2 && BADGE_FULLWIDTH.test(text));
  }

  AI.Badge = function (el, options) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    if (!this.el) return;
    this.options = options || {};
    // 不传内容即独立使用：角标不再相对某元素定位
    this._standalone = this.el.children.length === 0 && this.el.textContent.trim() === '';
    this.el._aiBadge = this;
    this._render();
  };

  AI.Badge.prototype._render = function () {
    var o = this.options;
    var el = this.el;
    var count = o.count !== undefined ? o.count : null;
    var overflowCount = o.overflowCount != null ? o.overflowCount : 99;
    var showZero = !!o.showZero;
    var dot = !!o.dot;
    var size = o.size || 'medium';
    var color = o.color || 'app-red';

    var numeric = badgeToNumeric(count);
    // 封顶：仅数字参与换算，100 → "99+"
    var displayCount = numeric !== null && numeric > overflowCount ? overflowCount + '+' : count;
    var isZero = displayCount === 0 || displayCount === '0';
    var showAsDot = dot && !isZero;
    var isEmpty = count === null || count === undefined || (typeof count === 'string' && count.trim() === '');
    // 无内容，或数值为 0 且未开启 showZero，且不是小圆点时整体隐藏
    var isHidden = !showAsDot && (isEmpty || (isZero && !showZero));

    el.classList.add('ai-badge');
    el.classList.toggle('ai-badge--standalone', this._standalone);
    var old = el.querySelector('.ai-badge__indicator');
    if (old) old.parentNode.removeChild(old);
    if (isHidden) return;

    var sup = document.createElement('sup');
    sup.className = 'ai-badge__indicator ai-badge__indicator--' + size +
      ' ai-badge__indicator--color-' + color +
      (badgeFitsCircle(displayCount) ? ' ai-badge__indicator--circle' : '') +
      (showAsDot ? ' ai-badge__indicator--dot' : '');
    if (showAsDot) {
      // dot 无内容
    } else if (typeof displayCount === 'string' && /[<&]/.test(displayCount)) {
      // 原版 count 支持 ReactNode（如内联图标 SVG），此处按 HTML 渲染
      sup.innerHTML = displayCount;
    } else {
      sup.textContent = displayCount;
    }
    // 原生 tooltip：未显式传 title 时用真实数值，封顶后仍是完整数字
    var indicatorTitle = o.title !== undefined ? o.title
      : (!showAsDot && (typeof count === 'number' || typeof count === 'string') ? String(count) : undefined);
    if (indicatorTitle !== undefined) sup.setAttribute('title', indicatorTitle);
    el.appendChild(sup);
  };

  AI.Badge.prototype.update = function (next) {
    var o = next || {};
    var self = this;
    Object.keys(o).forEach(function (k) { self.options[k] = o[k]; });
    this._render();
  };

  AI.Badge.prototype.destroy = function () {
    if (this.el) delete this.el._aiBadge;
  };

  /* ============================================
     NoData —— 空态
     空纸箱 / 搜索无结果 / 简洁三种变体
     ============================================ */
  // 空纸箱图标（naive-icons NoDataIcon 等价手绘）
  var NODATA_BOX_ICON =
    '<svg class="ai-no-data__scene-icon" viewBox="0 0 96 96" fill="none" aria-hidden="true">' +
    '<ellipse cx="48" cy="87" rx="29" ry="4.5" fill="#e8dcc8"/>' +
    '<path d="M26 40h44l-4 12H30z" fill="#b98a55"/>' +
    '<path d="M27 44 13 29l22-7 13 16z" fill="#f8ecd4" stroke="#794f27" stroke-width="4" stroke-linejoin="round"/>' +
    '<path d="M69 44l14-15-22-7-13 16z" fill="#f8ecd4" stroke="#794f27" stroke-width="4" stroke-linejoin="round"/>' +
    '<path d="M28 50h40l-3.5 33h-33z" fill="#f8ecd4" stroke="#794f27" stroke-width="4" stroke-linejoin="round"/>' +
    '<path d="M30 50v-8h36v8" fill="#b98a55"/>' +
    '<circle cx="41.5" cy="64" r="2.8" fill="#794f27"/>' +
    '<circle cx="54.5" cy="64" r="2.8" fill="#794f27"/>' +
    '<path d="M41 73q7-5.5 14 0" stroke="#794f27" stroke-width="3" stroke-linecap="round" fill="none"/>' +
    '</svg>';
  // 搜索图标（naive-icons SearchIcon 等价手绘）
  var NODATA_SEARCH_ICON =
    '<svg class="ai-no-data__scene-icon" viewBox="0 0 96 96" fill="none" aria-hidden="true">' +
    '<ellipse cx="48" cy="88" rx="26" ry="4" fill="#e8dcc8"/>' +
    '<path d="M74 20l2.2 5.4L82 28l-5.8 2.6L74 36l-2.2-5.4L66 28l5.8-2.6z" fill="#f7cd67"/>' +
    '<circle cx="43" cy="43" r="23" fill="#fff" stroke="#794f27" stroke-width="5"/>' +
    '<path d="M32 36a12 12 0 0 1 9-6" stroke="#c9e8e5" stroke-width="4" stroke-linecap="round" fill="none"/>' +
    '<path d="M60 60l16 16" stroke="#794f27" stroke-width="8" stroke-linecap="round"/>' +
    '</svg>';

  AI.NoData = function (el, options) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    if (!this.el) return;
    this.options = options || {};
    this.el._aiNoData = this;
    this._render();
  };

  AI.NoData.prototype._render = function () {
    var o = this.options;
    var el = this.el;
    var size = o.size || 'medium';
    var variant = o.variant || 'default';
    el.classList.add('ai-no-data');
    ['small', 'medium', 'large'].forEach(function (s) {
      el.classList.toggle('ai-no-data--' + s, s === size);
    });
    ['default', 'search', 'simple'].forEach(function (v) {
      el.classList.toggle('ai-no-data--' + v, v === variant);
    });
    el.classList.toggle('ai-no-data--bordered', !!o.bordered);

    // 只有 undefined 采用默认内容，null/false 保留调用方主动隐藏的意图
    var heading = o.title === undefined ? (variant === 'search' ? '没有找到相关结果' : '暂无数据') : o.title;
    var graphic = o.icon === undefined ? (variant === 'search' ? NODATA_SEARCH_ICON : NODATA_BOX_ICON) : o.icon;
    var actions = o.extra !== undefined ? o.extra : o.children;

    var html = '';
    if (graphic !== null && graphic !== false) {
      var custom = o.icon !== undefined;
      html += '<div class="ai-no-data__artwork' + (custom ? ' ai-no-data__artwork--custom' : '') +
        '" aria-hidden="true">' + (custom ? '<span class="ai-no-data__symbol">' + graphic + '</span>' : graphic) +
        '</div>';
    }
    if (heading !== null && heading !== false) {
      html += '<div class="ai-no-data__title">' + heading + '</div>';
    }
    if (o.description !== undefined && o.description !== null && o.description !== false) {
      html += '<div class="ai-no-data__description">' + o.description + '</div>';
    }
    if (actions !== null && actions !== undefined && actions !== false) {
      html += '<div class="ai-no-data__actions">' + actions + '</div>';
    }
    el.innerHTML = html;
  };

  AI.NoData.prototype.update = function (next) {
    var o = next || {};
    var self = this;
    Object.keys(o).forEach(function (k) { self.options[k] = o[k]; });
    this._render();
  };

  AI.NoData.prototype.destroy = function () {
    if (this.el) delete this.el._aiNoData;
  };

  /* ============================================
     Rate —— 评分
     原生 radio 单选语义 + 星星弹跳 / 六点扩散动画
     ============================================ */
  var RATE_BURST_STEP_MS = 60; // 相邻星星的弹出延迟步进

  // 把任意评分夹取成 [0, count] 的整数：小数就近取整，超出范围直接夹取
  function rateToStarCount(value, count) {
    return Math.min(count, Math.max(0, Math.round(value)));
  }

  // naive-icons StarIcon 等价手绘：描边星 + 两只眼睛
  var RATE_STAR_ICON =
    '<svg class="ai-rate__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
    '<path d="M12 2.9l2.7 5.6 6.1.8-4.4 4.3 1.1 6.1L12 16.9l-5.5 2.8 1.1-6.1L3.2 9.3l6.1-.8z" stroke-width="2" stroke-linejoin="round"/>' +
    '<circle cx="9.7" cy="10.6" r="1.15"/>' +
    '<circle cx="14.3" cy="10.6" r="1.15"/>' +
    '</svg>';

  AI.Rate = function (el, options) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    if (!this.el) return;
    this.options = options || {};
    var o = this.options;
    // 受控：外部传 value；非受控：defaultValue 起步
    this._isControlled = o.value !== undefined;
    this._innerValue = o.defaultValue || 0;
    this._hoverValue = 0;
    this._burst = { from: 0, to: 0, seq: 0 };
    this._name = 'ai-rate-' + Math.random().toString(36).slice(2, 10);
    this._onKeyDown = this._handleKeyDown.bind(this);
    this._onMouseLeave = this._handleMouseLeave.bind(this);
    this.el.addEventListener('keydown', this._onKeyDown);
    this.el.addEventListener('mouseleave', this._onMouseLeave);
    this.el._aiRate = this;
    this._render();
  };

  Object.defineProperty(AI.Rate.prototype, 'value', {
    get: function () {
      var o = this.options;
      return this._isControlled ? o.value : this._innerValue;
    }
  });

  AI.Rate.prototype._handleKeyDown = function (e) {
    if (this.options.readonly) return;
    var count = this.options.count || 5;
    var checkedValue = rateToStarCount(this.value, count);
    var next = 0;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next = Math.min(count, checkedValue + 1);
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = Math.max(1, checkedValue - 1);
    else if (e.key === 'Home') next = 1;
    else if (e.key === 'End') next = count;
    else return;
    e.preventDefault();
    this._hoverValue = 0;
    var inputs = this.el.querySelectorAll('.ai-rate__input');
    if (inputs[next - 1]) inputs[next - 1].focus();
    this._commit(next);
  };

  AI.Rate.prototype._handleMouseLeave = function () {
    if (this._hoverValue !== 0) {
      this._hoverValue = 0;
      this._render();
    }
  };

  AI.Rate.prototype._commit = function (next) {
    if (this.options.readonly || next === this.value) return;
    if (!this._isControlled) this._innerValue = next;
    // 清空后鼠标仍停在原处，重置预览才能立刻看到「已清空」
    if (next === 0) this._hoverValue = 0;
    var count = this.options.count || 5;
    this._burst = { from: rateToStarCount(this.value, count), to: next, seq: this._burst.seq + 1 };
    if (this.options.onChange) this.options.onChange(next);
    this._render();
  };

  AI.Rate.prototype._render = function () {
    var o = this.options;
    var count = o.count || 5;
    var size = o.size || 'middle';
    var el = this.el;
    el.classList.add('ai-rate');
    ['small', 'middle', 'large'].forEach(function (s) {
      el.classList.toggle('ai-rate--' + s, s === size);
    });
    el.classList.toggle('ai-rate--readonly', !!o.readonly);
    el.setAttribute('role', 'radiogroup');
    el.setAttribute('aria-label', '评分');
    if (o.readonly) el.setAttribute('aria-readonly', 'true');
    else el.removeAttribute('aria-readonly');

    var rateValue = this.value;
    // 悬停预览：只读时始终展示真实评分
    var displayValue = !o.readonly && this._hoverValue > 0 ? this._hoverValue : rateValue;
    var filledCount = rateToStarCount(displayValue, count);
    var checkedValue = rateToStarCount(rateValue, count);
    var burst = this._burst;

    var html = '';
    for (var index = 0; index < count; index += 1) {
      var starValue = index + 1;
      var isActive = index < filledCount;
      var isChecked = checkedValue === starValue;
      // 受控值可能是小数或超出范围：保证永远有一颗星可 Tab 到达
      var isTabStop = checkedValue > 0 ? isChecked : index === 0;
      // 只有「加分」才播放动画：新点亮的星星依次弹出
      var isBursting = burst.to > burst.from && index >= burst.from && index < burst.to;
      var isSplash = burst.to > burst.from && index === burst.to - 1;
      html += '<label class="ai-rate__item' + (isActive ? ' ai-rate__item--active' : '') + '">' +
        '<input class="ai-rate__input" type="radio" name="' + this._name + '"' +
        (isChecked ? ' checked' : '') +
        (o.readonly ? ' disabled' : '') +
        (!o.readonly && isTabStop ? ' tabindex="0"' : ' tabindex="-1"') +
        ' aria-label="' + starValue + ' 星" data-star="' + starValue + '">' +
        (isSplash ? '<span class="ai-rate__splash" aria-hidden="true"></span>' : '') +
        '<span class="ai-rate__star' +
        (isBursting ? ' ai-rate__star--pop" style="--rate-pop-delay:' +
          ((index - burst.from) * RATE_BURST_STEP_MS) + 'ms' : '') +
        '">' + RATE_STAR_ICON + '</span>' +
        '</label>';
    }
    el.innerHTML = html;

    var self = this;
    var allowClear = o.allowClear !== false;
    el.querySelectorAll('.ai-rate__item').forEach(function (item) {
      item.addEventListener('mouseenter', function () {
        if (self.options.readonly) return;
        self._hoverValue = Number(item.querySelector('.ai-rate__input').getAttribute('data-star'));
        self._render();
      });
    });
    el.querySelectorAll('.ai-rate__input').forEach(function (input) {
      input.addEventListener('change', function () {
        self._commit(Number(input.getAttribute('data-star')));
      });
      // 再次点击同一颗星：清空评分
      input.addEventListener('click', function () {
        if (allowClear && rateToStarCount(self.value, count) === Number(input.getAttribute('data-star'))) {
          self._commit(0);
        }
      });
    });
  };

  AI.Rate.prototype.setValue = function (v) {
    this.options.value = v;
    this._isControlled = true;
    this._hoverValue = 0;
    this._render();
  };

  AI.Rate.prototype.update = function (next) {
    var o = next || {};
    var self = this;
    Object.keys(o).forEach(function (k) { self.options[k] = o[k]; });
    if ('value' in o) this._isControlled = true;
    this._render();
  };

  AI.Rate.prototype.destroy = function () {
    if (this.el) {
      this.el.removeEventListener('keydown', this._onKeyDown);
      this.el.removeEventListener('mouseleave', this._onMouseLeave);
      delete this.el._aiRate;
    }
  };

  /* ============================================
     Pagination —— 分页
     幽灵正圆格子 + orange / teal 配色
     SizeChanger 上弹层 + QuickJumper 快速跳页
     ============================================ */
  // 生成页码序列：首尾页 + 当前页邻域 + 省略号（超过 7 页折叠）
  function paginationPageItems(current, pageCount) {
    if (pageCount <= 7) {
      var all = [];
      for (var i = 1; i <= pageCount; i += 1) all.push(i);
      return all;
    }
    var items = [1];
    if (current > 3) items.push('ellipsis-left');
    var start = Math.max(2, current - 1);
    var end = Math.min(pageCount - 1, current + 1);
    for (var j = start; j <= end; j += 1) items.push(j);
    if (current < pageCount - 2) items.push('ellipsis-right');
    items.push(pageCount);
    return items;
  }

  var PAGINATION_CHEVRON_LEFT =
    '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false">' +
    '<path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M15 5l-7 7 7 7"/></svg>';
  var PAGINATION_CHEVRON_RIGHT =
    '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false">' +
    '<path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>';
  var PAGINATION_CARET_DOWN =
    '<svg viewBox="0 0 24 24" width="10" height="10" aria-hidden="true" focusable="false">' +
    '<path fill="currentColor" d="M12 16.5L5.5 9h13z"/></svg>';

  AI.Pagination = function (el, options) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    if (!this.el) return;
    this.options = options || {};
    var o = this.options;
    this._isPageControlled = o.current !== undefined;
    this._isSizeControlled = o.pageSize !== undefined;
    this._innerPage = o.defaultCurrent || 1;
    this._innerPageSize = o.defaultPageSize || 10;
    this._onDocMouseDown = this._handleDocMouseDown.bind(this);
    this._onDocKeyDown = this._handleDocKeyDown.bind(this);
    this.el._aiPagination = this;
    this._render();
  };

  Object.defineProperty(AI.Pagination.prototype, 'page', {
    get: function () {
      var o = this.options;
      return Math.min(this._isPageControlled ? o.current : this._innerPage, this.pageCount);
    }
  });

  Object.defineProperty(AI.Pagination.prototype, 'pageSize', {
    get: function () {
      var o = this.options;
      return this._isSizeControlled ? o.pageSize : this._innerPageSize;
    }
  });

  Object.defineProperty(AI.Pagination.prototype, 'pageCount', {
    get: function () {
      return Math.max(1, Math.ceil(Math.max(0, this.options.total || 0) / this.pageSize));
    }
  });

  AI.Pagination.prototype._changePage = function (next) {
    var target = Math.min(Math.max(1, next), this.pageCount);
    if (target === this.page) return;
    if (!this._isPageControlled) this._innerPage = target;
    if (this.options.onChange) this.options.onChange(target, this.pageSize);
    this._render();
  };

  AI.Pagination.prototype._changePageSize = function (size) {
    var nextPageCount = Math.max(1, Math.ceil(Math.max(0, this.options.total || 0) / size));
    var targetPage = Math.min(this.page, nextPageCount);
    if (!this._isSizeControlled) this._innerPageSize = size;
    if (!this._isPageControlled) this._innerPage = targetPage;
    if (this.options.onShowSizeChange) this.options.onShowSizeChange(targetPage, size);
    if (targetPage !== this.page || size !== this.pageSize) {
      if (this.options.onChange) this.options.onChange(targetPage, size);
    }
    this._render();
  };

  AI.Pagination.prototype._handleDocMouseDown = function (e) {
    if (this._sizeOpen && this._sizeChangerEl && !this._sizeChangerEl.contains(e.target)) {
      this._sizeOpen = false;
      this._render();
    }
  };

  AI.Pagination.prototype._handleDocKeyDown = function (e) {
    if (this._sizeOpen && e.key === 'Escape') {
      this._sizeOpen = false;
      this._render();
    }
  };

  AI.Pagination.prototype._render = function () {
    var o = this.options;
    var el = this.el;
    var variant = o.variant || 'orange';
    el.classList.add('ai-pagination', 'ai-pagination--' + variant);
    el.classList.toggle('ai-pagination--disabled', !!o.disabled);
    el.setAttribute('aria-label', '分页');

    var disabled = !!o.disabled;
    var page = this.page;
    var pageCount = this.pageCount;
    var items = paginationPageItems(page, pageCount);

    var html = '';
    if (o.showTotal) html += '<span class="ai-pagination__total">共 ' + (o.total || 0) + ' 条</span>';
    html += '<button type="button" class="ai-pagination__item" data-nav="prev"' +
      (disabled || page <= 1 ? ' disabled' : '') + ' aria-label="上一页">' + PAGINATION_CHEVRON_LEFT + '</button>';
    items.forEach(function (item) {
      if (typeof item === 'number') {
        html += '<button type="button" class="ai-pagination__item' +
          (item === page ? ' ai-pagination__item--active' : '') + '" data-page="' + item + '"' +
          (disabled ? ' disabled' : '') +
          (item === page ? ' aria-current="page"' : '') + '>' + item + '</button>';
      } else {
        html += '<span class="ai-pagination__ellipsis" aria-hidden="true">···</span>';
      }
    });
    html += '<button type="button" class="ai-pagination__item" data-nav="next"' +
      (disabled || page >= pageCount ? ' disabled' : '') + ' aria-label="下一页">' + PAGINATION_CHEVRON_RIGHT + '</button>';

    if (o.showSizeChanger) {
      var options = o.pageSizeOptions || [10, 20, 50, 100];
      var self = this;
      html += '<div class="ai-pagination__size-changer">' +
        '<button type="button" class="ai-pagination__size-trigger' + (this._sizeOpen ? ' ai-pagination__size-trigger--open' : '') + '"' +
        (disabled ? ' disabled' : '') + ' aria-haspopup="listbox" aria-expanded="' + !!this._sizeOpen + '" aria-label="每页 ' + this.pageSize + ' 条">' +
        '<span>' + this.pageSize + ' 条/页</span>' +
        '<span class="ai-pagination__caret">' + PAGINATION_CARET_DOWN + '</span>' +
        '</button>';
      if (this._sizeOpen) {
        html += '<ul class="ai-pagination__size-list" role="listbox" aria-label="选择每页条数">' +
          options.map(function (opt) {
            return '<li role="option" aria-selected="' + (opt === self.pageSize) + '" data-size="' + opt +
              '" class="ai-pagination__size-option' + (opt === self.pageSize ? ' ai-pagination__size-option--active' : '') +
              '">' + opt + ' 条/页</li>';
          }).join('') + '</ul>';
      }
      html += '</div>';
    }

    if (o.showQuickJumper) {
      html += '<span class="ai-pagination__jumper">跳至' +
        '<input class="ai-pagination__jumper-input" inputmode="numeric" aria-label="跳转到指定页"' +
        (disabled ? ' disabled' : '') + '>页</span>';
    }
    el.innerHTML = html;

    var self2 = this;
    el.querySelectorAll('[data-nav="prev"]').forEach(function (b) {
      b.addEventListener('click', function () { self2._changePage(self2.page - 1); });
    });
    el.querySelectorAll('[data-nav="next"]').forEach(function (b) {
      b.addEventListener('click', function () { self2._changePage(self2.page + 1); });
    });
    el.querySelectorAll('[data-page]').forEach(function (b) {
      b.addEventListener('click', function () { self2._changePage(Number(b.getAttribute('data-page'))); });
    });
    var trigger = el.querySelector('.ai-pagination__size-trigger');
    if (trigger) {
      trigger.addEventListener('click', function () {
        self2._sizeOpen = !self2._sizeOpen;
        self2._sizeChangerEl = trigger.parentNode;
        self2._render();
      });
    }
    el.querySelectorAll('[data-size]').forEach(function (li) {
      li.addEventListener('click', function () {
        self2._sizeOpen = false;
        self2._changePageSize(Number(li.getAttribute('data-size')));
      });
    });
    var jumperInput = el.querySelector('.ai-pagination__jumper-input');
    if (jumperInput) {
      jumperInput.addEventListener('input', function () {
        jumperInput.value = jumperInput.value.replace(/[^\d]/g, '');
      });
      var jump = function () {
        var val = jumperInput.value;
        jumperInput.value = '';
        var num = parseInt(val, 10);
        if (!isNaN(num)) self2._changePage(num);
      };
      jumperInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') jump(); });
      jumperInput.addEventListener('blur', jump);
    }
    // 弹层开启期间监听外部点击 / ESC
    if (this._sizeOpen) {
      document.addEventListener('mousedown', this._onDocMouseDown);
      document.addEventListener('keydown', this._onDocKeyDown);
    }
  };

  AI.Pagination.prototype.update = function (next) {
    var o = next || {};
    var self = this;
    Object.keys(o).forEach(function (k) { self.options[k] = o[k]; });
    if ('current' in o) this._isPageControlled = true;
    if ('pageSize' in o) this._isSizeControlled = true;
    this._render();
  };

  AI.Pagination.prototype.destroy = function () {
    document.removeEventListener('mousedown', this._onDocMouseDown);
    document.removeEventListener('keydown', this._onDocKeyDown);
    if (this.el) delete this.el._aiPagination;
  };

  /* ============================================
     Image —— 图片
     相框（bordered 基底 / default 卡片 / stamp 邮票）
     + 错误占位 + 点击大图预览
     ============================================ */
  // naive-icons ImageIcon 等价手绘（错误占位 32px）
  var IMAGE_ERROR_ICON =
    '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
    '<rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" stroke-width="1.8"/>' +
    '<circle cx="9" cy="9.5" r="1.6" fill="currentColor"/>' +
    '<path d="M4.5 17.5l4.7-5 3.4 3.6 2.6-2.6 4.3 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' +
    '</svg>';

  AI.Image = function (el, options) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    if (!this.el) return;
    this.options = options || {};
    var o = this.options;
    if (o.preview === undefined) o.preview = true;
    this._failed = false;
    this._loaded = false;
    this._maskEl = null;
    this._onDocKeyDown = this._handleDocKeyDown.bind(this);
    this.el._aiImage = this;
    this._render();
  };

  AI.Image.prototype._handleDocKeyDown = function (e) {
    if (!this._maskEl) return;
    if (e.key === 'Escape') {
      this._closePreview();
    } else if (e.key === 'Tab') {
      // 遮罩里只有关闭按钮可聚焦
      e.preventDefault();
      this._maskEl.querySelector('.ai-image__close-btn').focus();
    }
  };

  AI.Image.prototype._openPreview = function () {
    // 预览关闭后把焦点还给触发元素
    this._lastFocused = document.activeElement;
    var o = this.options;
    var mask = document.createElement('div');
    mask.className = 'ai-image__mask';
    mask.innerHTML =
      '<div class="ai-image__dialog" role="dialog" aria-modal="true" aria-label="' +
      (o.alt ? '查看图片：' + o.alt : '图片预览') + '">' +
      '<button type="button" class="ai-image__close-btn" aria-label="关闭预览">' +
      '<span class="ai-image__close-mark"></span></button>' +
      '<img src="' + o.src + '" alt="' + (o.alt || '') + '" class="ai-image__preview-img">' +
      '</div>';
    var self = this;
    mask.addEventListener('click', function (e) {
      if (e.target === mask) self._closePreview();
    });
    mask.querySelector('.ai-image__close-btn').addEventListener('click', function () {
      self._closePreview();
    });
    document.body.appendChild(mask);
    this._maskEl = mask;
    document.addEventListener('keydown', this._onDocKeyDown);
    mask.querySelector('.ai-image__close-btn').focus();
  };

  AI.Image.prototype._closePreview = function () {
    if (this._maskEl && this._maskEl.parentNode) this._maskEl.parentNode.removeChild(this._maskEl);
    this._maskEl = null;
    document.removeEventListener('keydown', this._onDocKeyDown);
    if (this._lastFocused && this._lastFocused.focus) this._lastFocused.focus();
    this._lastFocused = null;
  };

  AI.Image.prototype._render = function () {
    var o = this.options;
    var el = this.el;
    // failed：主图加载失败时显示错误占位（span 而非相框）
    if (this._failed) {
      el.className = 'ai-image ai-image--error';
      if (o.color && o.color !== 'white') el.classList.add('ai-image--color-' + o.color);
      el.style.width = o.width != null ? (typeof o.width === 'number' ? o.width + 'px' : o.width) : '';
      el.style.height = o.height != null ? (typeof o.height === 'number' ? o.height + 'px' : o.height) : '';
      el.setAttribute('role', 'img');
      el.setAttribute('aria-label', o.alt || '图片加载失败');
      el.innerHTML = IMAGE_ERROR_ICON + '<span>图片加载失败</span>';
      return;
    }
    el.removeAttribute('role');
    el.removeAttribute('aria-label');
    el.classList.add('ai-image');
    if (o.variant === 'default') el.classList.add('ai-image--default');
    if (o.variant === 'stamp') el.classList.add('ai-image--stamp');
    if (o.variant === 'bordered' && o.color && o.color !== 'white') el.classList.add('ai-image--color-' + o.color);
    if (this._loaded) el.classList.add('ai-image--loaded');
    var asButton = !!o.preview;
    el.classList.toggle('ai-image--preview', asButton);
    if (asButton) {
      el.setAttribute('type', 'button');
      el.setAttribute('aria-label', o.alt || '查看大图');
    } else {
      el.removeAttribute('type');
      el.removeAttribute('aria-label');
    }
    if (o.width != null) el.style.width = typeof o.width === 'number' ? o.width + 'px' : o.width;
    if (o.height != null) el.style.height = typeof o.height === 'number' ? o.height + 'px' : o.height;
    var stampYear = o.variant === 'stamp' && o.stampYear
      ? '<span class="ai-image__stamp-year">' + o.stampYear + '</span>' : '';
    el.innerHTML =
      '<img src="' + o.src + '" alt="' + (o.alt || '') + '"' +
      (o.lazy ? ' loading="lazy"' : '') + ' class="ai-image__img">' + stampYear;
    var img = el.querySelector('.ai-image__img');
    var self = this;
    img.addEventListener('load', function () {
      self._loaded = true;
      el.classList.add('ai-image--loaded');
      if (self.options.onLoad) self.options.onLoad();
    });
    img.addEventListener('error', function () {
      self._failed = true;
      self._loaded = true;
      if (self.options.onError) self.options.onError();
      self._render();
    });
    if (asButton) {
      el.addEventListener('click', function () { self._openPreview(); });
    }
  };

  AI.Image.prototype.update = function (next) {
    var o = next || {};
    var self = this;
    var srcChanged = 'src' in o && o.src !== this.options.src;
    Object.keys(o).forEach(function (k) { self.options[k] = o[k]; });
    // src 变化时重置加载状态
    if (srcChanged) { this._failed = false; this._loaded = false; }
    this._render();
  };

  AI.Image.prototype.destroy = function () {
    this._closePreview();
    if (this.el) delete this.el._aiImage;
  };

  /* ============================================
   * Carousel — 轮播图
   * 淡入 + 位移过渡、圆点指示器、箭头、播放控制、键盘可用
   * ============================================ */

  AI.Carousel = function (el, options) {
    var self = this;
    this.el = el;
    this.options = Object.assign(
      {
        items: null,            // 数组（string 或 { html } 或 { src, title, desc }）；未传则收集已有子元素
        activeIndex: undefined, // 受控
        defaultActiveIndex: 0,
        onChange: null,
        autoplay: false,
        interval: 3000,
        loop: true,
        showArrows: true,
        showDots: true,
        pauseOnHover: true,
        ariaLabel: '轮播图'
      },
      options || {}
    );
    this._hoverPaused = false;
    this._focusPaused = false;
    this._rotationPaused = false;
    this._autoplayTimer = null;
    el.classList.add('ai-carousel');
    el.setAttribute('role', 'region');
    el.setAttribute('aria-roledescription', 'carousel');
    el.setAttribute('aria-label', this.options.ariaLabel);
    el.setAttribute('tabindex', '0');
    el._aiCarousel = this;
    this._collectSlides();
    var initialIndex = this.options.activeIndex != null
      ? this.options.activeIndex
      : (this.options.defaultActiveIndex || 0);
    this._internalIndex = Math.min(Math.max(initialIndex || 0, 0), Math.max(this._slides.length - 1, 0));
    this._render();
    this._bind();
    if (this.options.autoplay) this._startAutoplay();
  };

  /** 收集轮播内容：items 数组模式优先，否则折叠 el 既有子元素 */
  AI.Carousel.prototype._collectSlides = function () {
    var el = this.el;
    var items = this.options.items;
    if (items && items.length) {
      this._slides = items.map(function (item) {
        if (typeof item === 'string') return item;
        if (item && typeof item === 'object' && item.html != null) return item.html;
        // { src, title, desc } 便捷形式：底部渐变 + 白字标题
        var html = '<div style="min-height:360px;height:100%;display:flex;align-items:flex-end;padding:28px;box-sizing:border-box;color:#fff9e3;' +
          'background:linear-gradient(0deg,rgba(43,33,24,.72),transparent 62%),url(' + item.src + ') center / cover">' +
          '<div style="padding-bottom:30px"><div style="font-size:26px;font-weight:900">' + item.title +
          '</div><div style="margin-top:6px;font-size:14px;font-weight:600">' + item.desc + '</div></div></div>';
        return html;
      });
    } else {
      this._slides = Array.prototype.map.call(el.children, function (child) {
        return child.outerHTML;
      });
      el.innerHTML = '';
    }
  };

  AI.Carousel.prototype._render = function () {
    var self = this;
    var el = this.el;
    var o = this.options;
    var count = this._slides.length;
    this._lastIndex = Math.max(count - 1, 0);
    this._internalIndex = Math.min(Math.max(this._internalIndex, 0), this._lastIndex);
    var hasControls = count > 1;

    var html = '';
    if (hasControls && o.autoplay) {
      html += '<button type="button" class="ai-carousel__rotation-control" aria-label="暂停自动播放">暂停</button>';
    }
    html += '<div class="ai-carousel__viewport">';
    this._slides.forEach(function (slide, index) {
      html += '<div class="ai-carousel__slide' + '" role="group" aria-roledescription="slide" aria-label="第 ' +
        (index + 1) + ' 张，共 ' + count + ' 张" aria-hidden="true">' + slide + '</div>';
    });
    html += '</div>';
    if (hasControls && o.showArrows) {
      html += '<button type="button" class="ai-carousel__arrow ai-carousel__arrow--previous" aria-label="上一张"></button>';
      html += '<button type="button" class="ai-carousel__arrow ai-carousel__arrow--next" aria-label="下一张"></button>';
    }
    if (hasControls && o.showDots) {
      html += '<div class="ai-carousel__dots" role="group" aria-label="选择轮播页">';
      this._slides.forEach(function (_, index) {
        html += '<button type="button" class="ai-carousel__dot" aria-label="转到第 ' + (index + 1) + ' 张"></button>';
      });
      html += '</div>';
    }
    el.innerHTML = html;

    this._viewport = el.querySelector('.ai-carousel__viewport');
    this._slidesEls = Array.prototype.slice.call(el.querySelectorAll('.ai-carousel__slide'));
    this._dotsEls = Array.prototype.slice.call(el.querySelectorAll('.ai-carousel__dot'));
    this._prevBtn = el.querySelector('.ai-carousel__arrow--previous');
    this._nextBtn = el.querySelector('.ai-carousel__arrow--next');
    this._rotationBtn = el.querySelector('.ai-carousel__rotation-control');
    this._sync();
    if (self._rotationBtn) {
      self._rotationBtn.addEventListener('click', function () {
        if (self._effectivePaused()) {
          self._hoverPaused = false;
          self._focusPaused = false;
          self._rotationPaused = false;
        } else {
          self._rotationPaused = true;
        }
        self._syncRotation();
      });
    }
    // 控件在每次渲染时重建，监听器随之重新绑定
    if (self._prevBtn) self._prevBtn.addEventListener('click', function () { self.goTo(self._currentIndex() - 1); });
    if (self._nextBtn) self._nextBtn.addEventListener('click', function () { self.goTo(self._currentIndex() + 1); });
    this._dotsEls.forEach(function (dot, index) {
      dot.addEventListener('click', function () { self.goTo(index); });
    });
  };

  AI.Carousel.prototype._effectivePaused = function () {
    return this._hoverPaused || this._focusPaused || this._rotationPaused;
  };

  /** 同步 active 类、圆点、箭头禁用与 aria-hidden */
  AI.Carousel.prototype._sync = function () {
    var current = this._currentIndex();
    this._slidesEls.forEach(function (slide, index) {
      slide.classList.toggle('ai-carousel__slide--active', index === current);
      slide.setAttribute('aria-hidden', String(index !== current));
    });
    this._dotsEls.forEach(function (dot, index) {
      dot.classList.toggle('ai-carousel__dot--active', index === current);
      if (index === current) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
    if (this._prevBtn) this._prevBtn.disabled = !this.options.loop && current === 0;
    if (this._nextBtn) this._nextBtn.disabled = !this.options.loop && current === this._lastIndex;
  };

  AI.Carousel.prototype._syncRotation = function () {
    if (!this._rotationBtn) return;
    var paused = this._effectivePaused();
    this._rotationBtn.textContent = paused ? '播放' : '暂停';
    this._rotationBtn.setAttribute('aria-label', paused ? '继续自动播放' : '暂停自动播放');
  };

  AI.Carousel.prototype._currentIndex = function () {
    return Math.min(Math.max(this.options.activeIndex != null ? this.options.activeIndex : this._internalIndex, 0), this._lastIndex);
  };

  AI.Carousel.prototype._bind = function () {
    var self = this;
    var root = this.el;
    root.addEventListener('keydown', function (event) {
      var current = self._currentIndex();
      if (event.key === 'ArrowLeft') self.goTo(current - 1);
      else if (event.key === 'ArrowRight') self.goTo(current + 1);
      else if (event.key === 'Home') self.goTo(0);
      else if (event.key === 'End') self.goTo(self._lastIndex);
      else return;
      event.preventDefault();
    });
    root.addEventListener('mouseenter', function () {
      if (self.options.pauseOnHover) self._hoverPaused = true;
      self._restartAutoplayIfNeeded();
      self._syncRotation();
    });
    root.addEventListener('mouseleave', function () {
      self._hoverPaused = false;
      self._restartAutoplayIfNeeded();
      self._syncRotation();
    });
    root.addEventListener('focusin', function () { self._focusPaused = true; self._restartAutoplayIfNeeded(); self._syncRotation(); });
    root.addEventListener('focusout', function (event) {
      if (!root.contains(event.relatedTarget)) {
        self._focusPaused = false;
        self._restartAutoplayIfNeeded();
        self._syncRotation();
      }
    });
  };

  AI.Carousel.prototype._restartAutoplayIfNeeded = function () {
    this._stopAutoplay();
    if (!this.options.autoplay) return;
    if (!this._effectivePaused()) this._startAutoplay();
  };

  AI.Carousel.prototype._startAutoplay = function () {
    var self = this;
    if (this._slides.length < 2) return;
    this._stopAutoplay();
    this._autoplayTimer = window.setInterval(function () {
      // 悬停 / 聚焦暂停时跳过切换，但保留计时（与原版 effectivePaused 语义一致）
      if (self._effectivePaused() || document.hidden) return;
      self.goTo(self._currentIndex() + 1);
    }, Math.max(this.options.interval, 1000));
  };

  AI.Carousel.prototype._stopAutoplay = function () {
    if (this._autoplayTimer !== null) {
      window.clearInterval(this._autoplayTimer);
      this._autoplayTimer = null;
    }
  };

  AI.Carousel.prototype.goTo = function (nextIndex) {
    var count = this._slides.length;
    if (count === 0) return;
    var normalized;
    if (this.options.loop) normalized = (nextIndex + count) % count;
    else normalized = Math.min(Math.max(nextIndex, 0), this._lastIndex);
    if (normalized === this._currentIndex()) return;
    if (this.options.activeIndex === undefined) {
      this._internalIndex = normalized;
      this._sync();
    }
    if (this.options.onChange) this.options.onChange(normalized);
  };

  AI.Carousel.prototype.next = function () { this.goTo(this._currentIndex() + 1); };
  AI.Carousel.prototype.prev = function () { this.goTo(this._currentIndex() - 1); };

  AI.Carousel.prototype.update = function (next) {
    var self = this;
    var o = next || {};
    var itemsChanged = 'items' in o;
    var autoplayChanged = 'autoplay' in o;
    var intervalChanged = 'interval' in o;
    var prevIndex = this._internalIndex;
    Object.keys(o).forEach(function (k) { self.options[k] = o[k]; });
    if (itemsChanged) {
      this._collectSlides();
      // 保留当前索引并按新长度钳制，而非强制归零
      this._internalIndex = Math.min(Math.max(prevIndex, 0), Math.max(this._slides.length - 1, 0));
      this._render();
    } else {
      if ('activeIndex' in o) this._internalIndex = this._currentIndex();
      this._sync();
    }
    if (itemsChanged || autoplayChanged || intervalChanged || 'activeIndex' in o) {
      this._restartAutoplayIfNeeded();
      this._syncRotation();
    }
  };

  AI.Carousel.prototype.destroy = function () {
    this._stopAutoplay();
    if (this.el) delete this.el._aiCarousel;
  };

  /* ============================================
   * Countdown — 倒计时
   * 里程表式数字条、颜色提醒、抖动、最后几秒回弹、归零收尾
   * ============================================ */

  var COUNTDOWN_DEFAULT_REMINDERS = [
    { seconds: 60, color: '#c77c34' },
    { seconds: 10, color: 'var(--ai-error-color, #e05a5a)' }
  ];

  /** 抖动配置归一化：兼容布尔 / 秒数简写 / 对象 */
  function resolveShake(value) {
    var o = value && typeof value === 'object' ? value : {};
    var seconds;
    if (typeof value === 'number') seconds = Number.isFinite(value) ? Math.max(0, value) : 0;
    else if (value) seconds = numberOptionCD(o.seconds, 5);
    else seconds = 0;
    return {
      seconds: seconds,
      urgentSeconds: numberOptionCD(o.urgentSeconds, 3),
      duration: numberOptionCD(o.duration, 1000, 16),
      urgentDuration: numberOptionCD(o.urgentDuration, 650, 16),
      distance: numberOptionCD(o.distance, 1.5),
      urgentDistance: numberOptionCD(o.urgentDistance, 2.5),
      rotation: numberOptionCD(o.rotation, 0.6, 0, 360),
      urgentRotation: numberOptionCD(o.urgentRotation, 0.9, 0, 360),
      easing: (o.easing && String(o.easing).trim()) || 'var(--ai-motion-ease, cubic-bezier(0.4, 0, 0.2, 1))'
    };
  }

  /** 回弹 + 波纹配置归一化；duration 自动延长以覆盖全部子动画 */
  function resolveEffectCD(value) {
    var o = value && typeof value === 'object' ? value : {};
    var bounce = o.bounce && typeof o.bounce === 'object' ? o.bounce : {};
    var ripple = o.ripple && typeof o.ripple === 'object' ? o.ripple : {};
    var bounceEnabled = o.bounce !== false;
    var count = o.ripple === false ? 0 : Math.floor(numberOptionCD(ripple.count, 2, 0, 10));
    var bounceDuration = numberOptionCD(bounce.duration, 350);
    var rippleDuration = numberOptionCD(ripple.duration, 600);
    var delay = numberOptionCD(ripple.delay, 150);
    var fadeDuration = numberOptionCD(o.fadeDuration, 250);
    var reducedMotion = o.reducedMotion != null ? o.reducedMotion : 'fade';
    var duration = Math.max(
      numberOptionCD(o.duration, 900),
      bounceEnabled ? bounceDuration : 0,
      count ? rippleDuration + delay * (count - 1) : 0,
      reducedMotion === 'fade' ? fadeDuration : 0
    );
    return {
      duration: duration,
      bounce: bounceEnabled,
      bounceDuration: bounceDuration,
      pressScale: numberOptionCD(bounce.pressScale, 0.94),
      popScale: numberOptionCD(bounce.popScale, 1.05),
      pressOffset: numberOptionCD(bounce.pressOffset, 1, -60000),
      popOffset: numberOptionCD(bounce.popOffset, -2, -60000),
      count: count,
      rippleDuration: rippleDuration,
      delay: delay,
      color: (ripple.color && String(ripple.color).trim()) || 'var(--ai-countdown-reminder-color, var(--ai-primary-color, #19c8b9))',
      opacity: numberOptionCD(ripple.opacity, 0.45, 0, 1),
      width: numberOptionCD(ripple.width, 2),
      offset: numberOptionCD(ripple.offset, 5),
      radius: numberOptionCD(ripple.radius, 16),
      startScale: numberOptionCD(ripple.startScale, 0.98),
      scaleX: numberOptionCD(ripple.scaleX, 1.08),
      scaleY: numberOptionCD(ripple.scaleY, 1.35),
      easing: (o.easing && String(o.easing).trim()) || 'var(--ai-motion-ease, cubic-bezier(0.4, 0, 0.2, 1))',
      reducedMotion: reducedMotion,
      fadeDuration: fadeDuration,
      fadeOpacity: numberOptionCD(o.fadeOpacity, 0.65, 0, 1)
    };
  }

  /** 最后几秒循环配置：布尔 false 不启用；间隔不短于单次完整动效 */
  function resolveEndingCD(value) {
    var o = value && typeof value === 'object' ? value : {};
    var effect = resolveEffectCD(value);
    return Object.assign({}, effect, {
      seconds: value ? numberOptionCD(o.seconds, 5) : 0,
      interval: Math.max(effect.duration, numberOptionCD(o.interval, 1000, 16))
    });
  }

  function numberOptionCD(value, fallback, min, max) {
    if (min === undefined) min = 0;
    if (max === undefined) max = 60000;
    return typeof value === 'number' && Number.isFinite(value) ? Math.max(min, Math.min(max, value)) : fallback;
  }

  function countdownPad(value) { return String(value).padStart(2, '0'); }

  /** 格式模板解析为 token / 字面量序列 */
  function parseCountdownFormat(format) {
    var parts = [];
    var re = /DD|HH|mm|ss/g;
    var last = 0;
    var m;
    while ((m = re.exec(format)) !== null) {
      if (m.index > last) parts.push({ kind: 'literal', text: format.slice(last, m.index) });
      parts.push({ kind: 'token', token: m[0] });
      last = m.index + m[0].length;
    }
    if (last < format.length) parts.push({ kind: 'literal', text: format.slice(last) });
    return parts;
  }

  /** 剩余秒数拆成天/时/分/秒；格式含 DD 时小时不进位到天 */
  function splitCountdownSeconds(totalSeconds, format) {
    var days = Math.floor(totalSeconds / 86400);
    var hasDays = format.indexOf('DD') !== -1;
    var hours = hasDays ? Math.floor((totalSeconds % 86400) / 3600) : Math.floor(totalSeconds / 3600);
    var minutes = Math.floor((totalSeconds % 3600) / 60);
    var seconds = totalSeconds % 60;
    return { DD: countdownPad(days), HH: countdownPad(hours), mm: countdownPad(minutes), ss: countdownPad(seconds) };
  }

  /** 从任意顺序规则中取最小命中阈值 */
  function getReminderColor(seconds, rules) {
    var matched = null;
    (rules || []).forEach(function (rule) {
      if (!Number.isFinite(rule.seconds) || rule.seconds < 0 || !rule.color || !rule.color.trim()) return;
      if (seconds <= rule.seconds && (!matched || rule.seconds < matched.seconds)) matched = rule;
    });
    return matched ? matched.color : undefined;
  }

  AI.Countdown = function (el, options) {
    var self = this;
    this.el = el;
    this.options = Object.assign(
      {
        value: Date.now(),
        format: 'HH:mm:ss',
        prefix: undefined,
        size: 'middle',
        variant: 'default',
        bordered: false,
        reminder: false,
        shake: false,
        endingAnimation: false,
        finishAnimation: false,
        onChange: null,
        onFinish: null
      },
      options || {}
    );
    this._shakeOptions = resolveShake(this.options.shake);
    this._endingOptions = resolveEndingCD(this.options.endingAnimation);
    this._finishOptions = resolveEffectCD(this.options.finishAnimation);
    this._finishedRef = false;
    this._countedDown = false;
    this._timer = null;
    this._pulseTimer = null;
    this._pulseTick = 0;
    this._finishTimer = null;
    this._digits = []; // [{ strip, pos, prev }]
    this._motionVisible = true;
    el.classList.add('ai-countdown', 'ai-countdown--' + this.options.size, 'ai-countdown--' + this.options.variant);
    if (this.options.bordered) el.classList.add('ai-countdown--bordered');
    el.setAttribute('role', 'timer');
    el.setAttribute('aria-live', 'off');
    el._aiCountdown = this;
    this._renderSkeleton();
    this._applyMotionVars();
    this._observeVisibility();
    this._startInterval();
  };

  /** 构建一次骨架：prefix + motion(group + ripples) + srOnly；数字位持久化以便滚动 */
  AI.Countdown.prototype._renderSkeleton = function () {
    var self = this;
    var el = this.el;
    var o = this.options;
    this._parts = parseCountdownFormat(o.format);
    var html = '';
    if (o.prefix !== undefined && o.prefix !== null) {
      html += '<span class="ai-countdown__prefix">' + o.prefix + '</span>';
    }
    html += '<span class="ai-countdown__motion" aria-hidden="true"><span class="ai-countdown__group">';
    this._digits = [];
    this._parts.forEach(function (part, i) {
      if (part.kind === 'token') {
        html += '<span class="ai-countdown__unit" data-unit="' + i + '">';
        // 两位数字（pad 保证 token 输出都是两位）
        for (var j = 0; j < 2; j++) {
          html += '<span class="ai-countdown__digit-cell"><span class="ai-countdown__digit-strip">';
          for (var k = 0; k < 20; k++) {
            html += '<span class="ai-countdown__digit-face">' + (k % 10) + '</span>';
          }
          html += '</span></span>';
        }
        html += '</span>';
      } else {
        var isColon = /[:：]/.test(part.text);
        html += '<span class="' + (isColon ? 'ai-countdown__colon' : 'ai-countdown__sep') + '">' + part.text + '</span>';
      }
    });
    html += '</span></span><span class="ai-countdown__sr-only" aria-hidden="true"></span>';
    el.innerHTML = html;

    // 收集数字条引用并定位到初始位置
    var units = el.querySelectorAll('.ai-countdown__unit');
    Array.prototype.forEach.call(units, function (unit) {
      var strips = unit.querySelectorAll('.ai-countdown__digit-strip');
      Array.prototype.forEach.call(strips, function (strip) {
        self._digits.push({ strip: strip, pos: 0, prev: '0' });
      });
    });
    this._motionEl = el.querySelector('.ai-countdown__motion');
    this._groupEl = el.querySelector('.ai-countdown__group');
    this._srEl = el.querySelector('.ai-countdown__sr-only');
    this._setRemaining(this._remaining(), true);
  };

  /** shake / effect 的 CSS 变量只随构造与 update 设置 */
  AI.Countdown.prototype._applyMotionVars = function () {
    var el = this.el;
    var s = this._shakeOptions;
    var e = this._endingOptions; // ending 与 finish 共用变量，取并集时长较大者由 interval 保障
    var f = this._finishOptions;
    var set = function (name, value) { el.style.setProperty(name, value); };
    set('--ai-countdown-shake-duration', s.duration + 'ms');
    set('--ai-countdown-shake-distance', s.distance + 'px');
    set('--ai-countdown-shake-angle', s.rotation + 'deg');
    set('--ai-countdown-urgent-duration', s.urgentDuration + 'ms');
    set('--ai-countdown-urgent-distance', s.urgentDistance + 'px');
    set('--ai-countdown-urgent-angle', s.urgentRotation + 'deg');
    set('--ai-countdown-shake-easing', s.easing);
    set('--ai-countdown-bounce-duration', e.bounceDuration + 'ms');
    set('--ai-countdown-press-scale', e.pressScale);
    set('--ai-countdown-pop-scale', e.popScale);
    set('--ai-countdown-press-offset', e.pressOffset + 'px');
    set('--ai-countdown-pop-offset', e.popOffset + 'px');
    set('--ai-countdown-ripple-duration', e.rippleDuration + 'ms');
    set('--ai-countdown-ripple-color', e.color);
    set('--ai-countdown-ripple-opacity', e.opacity);
    set('--ai-countdown-ripple-width', e.width + 'px');
    set('--ai-countdown-ripple-offset', -e.offset + 'px');
    set('--ai-countdown-ripple-radius', e.radius + 'px');
    set('--ai-countdown-ripple-start-scale', e.startScale);
    set('--ai-countdown-ripple-scale-x', e.scaleX);
    set('--ai-countdown-ripple-scale-y', e.scaleY);
    set('--ai-countdown-effect-easing', e.easing);
    set('--ai-countdown-effect-play-state', 'running');
    set('--ai-countdown-fade-duration', f.fadeDuration + 'ms');
    set('--ai-countdown-fade-opacity', f.fadeOpacity);
  };

  AI.Countdown.prototype._remaining = function () {
    return Math.max(0, this.options.value - Date.now());
  };

  /** 单个数字位滚动：所有变化向下滚，0→9 回绕时瞬移到下一循环（里程表式） */
  AI.Countdown.prototype._rollDigit = function (digit, index) {
    var d = this._digits[index];
    if (!d) return;
    var prev = Number(d.prev);
    var next = Number(digit);
    if (prev === next) return;
    d.prev = digit;
    var delta = (prev - next + 10) % 10;
    var from = d.pos;
    var target = from - delta;
    if (target < 0) {
      from += 10;
      target = from - delta;
      d.strip.style.transition = 'none';
      d.strip.style.transform = 'translateY(-' + from * 5 + '%)';
      void d.strip.offsetHeight; // 强制回流让瞬移生效
      d.strip.style.transition = '';
    }
    d.pos = target;
    d.strip.style.transform = 'translateY(-' + target * 5 + '%)';
  };

  AI.Countdown.prototype._setRemaining = function (remaining, immediate) {
    var self = this;
    var el = this.el;
    this._lastRemaining = remaining;
    var remainingSeconds = Math.ceil(remaining / 1000);
    var format = this.options.format;
    var digits = splitCountdownSeconds(remainingSeconds, format);
    var readable = this._parts.map(function (part) {
      return part.kind === 'token' ? digits[part.token] : part.text;
    }).join('');
    if (this._srEl) this._srEl.textContent = readable;

    // 更新每个数字位
    var digitIndex = 0;
    this._parts.forEach(function (part) {
      if (part.kind !== 'token') return;
      digits[part.token].split('').forEach(function (d) {
        self._rollDigit(d, digitIndex++);
      });
    });

    // 颜色提醒
    var rules = this.options.reminder === true ? COUNTDOWN_DEFAULT_REMINDERS : this.options.reminder || [];
    var reminderColor = getReminderColor(remainingSeconds, rules);
    el.classList.toggle('ai-countdown--reminding', !!reminderColor);
    if (reminderColor) el.style.setProperty('--ai-countdown-reminder-color', reminderColor);
    else el.style.removeProperty('--ai-countdown-reminder-color');

    // 抖动
    var shaking = remainingSeconds > 0 && remainingSeconds <= this._shakeOptions.seconds;
    var urgent = shaking && remainingSeconds <= this._shakeOptions.urgentSeconds;
    el.classList.toggle('ai-countdown--shaking', shaking);
    el.classList.toggle('ai-countdown--urgent', urgent);

    // 最后几秒循环回弹与波纹
    var ending = remainingSeconds > 0 && remainingSeconds <= this._endingOptions.seconds;
    this._syncEnding(ending);

    // 归零收尾
    var finishing = !!this.options.finishAnimation && remaining === 0 && this._countedDown && !this._finishedRef;
    el.classList.toggle('ai-countdown--finishing', finishing);
    if (finishing) {
      el.classList.toggle('ai-countdown--bouncing', this._finishOptions.bounce);
      this._renderRipples(this._finishOptions);
      if (this._finishTimer !== null) window.clearTimeout(this._finishTimer);
      this._finishTimer = window.setTimeout(function () {
        el.classList.remove('ai-countdown--finishing', 'ai-countdown--bouncing');
        self._removeRipples();
      }, this._finishOptions.duration);
    }
    this._applyMotionVisibility();

    if (this.options.onChange) this.options.onChange(remaining);
  };

  /** ending 状态切换：进入时启动循环 pulse 计时器，退出时停止 */
  AI.Countdown.prototype._syncEnding = function (ending) {
    var self = this;
    var el = this.el;
    var wasEnding = el.classList.contains('ai-countdown--ending');
    el.classList.toggle('ai-countdown--ending', ending);
    if (ending && !wasEnding) {
      this._pulseTick = 0;
      this._renderRipples(this._endingOptions);
      el.classList.add('ai-countdown--bouncing', 'ai-countdown--pulse-odd');
      this._motionVisible = typeof IntersectionObserver === 'undefined';
      this._bindMotionObserver();
      this._syncPulseTimer();
    } else if (!ending && wasEnding) {
      if (this._pulseTimer !== null) { window.clearInterval(this._pulseTimer); this._pulseTimer = null; }
      el.classList.remove('ai-countdown--bouncing', 'ai-countdown--pulse-odd', 'ai-countdown--pulse-even');
      this._removeRipples();
      this._unbindMotionObserver();
    }
    this._applyMotionVisibility();
  };

  /** 抖动/循环只在视口内且页面可见时播放，避免离屏继续消耗。 */
  AI.Countdown.prototype._bindMotionObserver = function () {
    var self = this;
    if (this._motionObserver || typeof IntersectionObserver === 'undefined') {
      this._applyMotionVisibility();
      return;
    }
    this._motionObserver = new IntersectionObserver(function (entries) {
      var entry = entries[0];
      self._motionVisible = !!(entry && entry.isIntersecting);
      self._applyMotionVisibility();
    });
    this._motionObserver.observe(this.el);
    this._onMotionVisibilityChange = function () {
      self._applyMotionVisibility();
    };
    document.addEventListener('visibilitychange', this._onMotionVisibilityChange);
  };

  AI.Countdown.prototype._unbindMotionObserver = function () {
    if (this._motionObserver) {
      this._motionObserver.disconnect();
      this._motionObserver = null;
    }
    if (this._onMotionVisibilityChange) {
      document.removeEventListener('visibilitychange', this._onMotionVisibilityChange);
      this._onMotionVisibilityChange = null;
    }
    this._motionVisible = true;
  };

  AI.Countdown.prototype._applyMotionVisibility = function () {
    var el = this.el;
    var visible = this._motionVisible !== false && !document.hidden;
    var finishing = el.classList.contains('ai-countdown--finishing');
    el.style.setProperty('--ai-countdown-effect-play-state', finishing || visible ? 'running' : 'paused');
    var shaking = el.classList.contains('ai-countdown--shaking');
    el.querySelectorAll('.ai-countdown__group').forEach(function (group) {
      group.style.animationPlayState = shaking && !visible ? 'paused' : '';
    });
    this._syncPulseTimer();
  };

  AI.Countdown.prototype._syncPulseTimer = function () {
    var self = this;
    var el = this.el;
    var ending = el.classList.contains('ai-countdown--ending');
    var visible = this._motionVisible !== false && !document.hidden;
    if (ending && visible && this._pulseTimer === null) {
      this._pulseTimer = window.setInterval(function () {
        self._pulseTick++;
        var odd = self._pulseTick % 2 === 1;
        el.classList.toggle('ai-countdown--pulse-odd', odd);
        el.classList.toggle('ai-countdown--pulse-even', !odd);
      }, this._endingOptions.interval);
    } else if ((!ending || !visible) && this._pulseTimer !== null) {
      window.clearInterval(this._pulseTimer);
      this._pulseTimer = null;
    }
  };

  AI.Countdown.prototype._renderRipples = function (effect) {
    if (!this._motionEl || !effect.count) return;
    this._removeRipples();
    for (var i = 0; i < effect.count; i++) {
      var ripple = document.createElement('span');
      ripple.className = 'ai-countdown__ripple';
      ripple.style.animationDelay = i * effect.delay + 'ms';
      this._motionEl.appendChild(ripple);
    }
  };

  AI.Countdown.prototype._removeRipples = function () {
    if (!this._motionEl) return;
    Array.prototype.slice.call(this._motionEl.querySelectorAll('.ai-countdown__ripple')).forEach(function (r) {
      r.remove();
    });
  };

  /** 后台 / 离屏暂停循环动效（合并视口与页面可见性） */
  AI.Countdown.prototype._observeVisibility = function () {
    var self = this;
    var el = this.el;
    var update = function () {
      self._motionVisible = !document.hidden;
      el.style.setProperty('--ai-countdown-effect-play-state', self._motionVisible ? 'running' : 'paused');
    };
    document.addEventListener('visibilitychange', update);
    update();
  };

  AI.Countdown.prototype._startInterval = function () {
    var self = this;
    this._stopInterval();
    this._countedDown = false;
    var update = function () {
      var next = self._remaining();
      if (next > 0) self._countedDown = true;
      self._setRemaining(next);
      if (next === 0 && !self._finishedRef) {
        self._finishedRef = true;
        self._stopInterval(); // 归零后清除定时器，避免 setInterval 空转
        if (self.options.onFinish) self.options.onFinish();
      }
      return next;
    };
    if (update() > 0) this._timer = window.setInterval(update, 250);
  };

  AI.Countdown.prototype._stopInterval = function () {
    if (this._timer !== null) {
      window.clearInterval(this._timer);
      this._timer = null;
    }
  };

  AI.Countdown.prototype.update = function (next) {
    var self = this;
    var el = this.el;
    // 仅在目标时间变化时重置完成标记，避免 onFinish 内 update() 递归
    if (next && 'value' in next) this._finishedRef = false;
    Object.keys(next || {}).forEach(function (k) { self.options[k] = next[k]; });
    if (next && 'shake' in next) this._shakeOptions = resolveShake(this.options.shake);
    if (next && 'endingAnimation' in next) this._endingOptions = resolveEndingCD(this.options.endingAnimation);
    if (next && 'finishAnimation' in next) this._finishOptions = resolveEffectCD(this.options.finishAnimation);
    if (next && ('prefix' in next || 'format' in next)) {
      el.classList.remove('ai-countdown--reminding', 'ai-countdown--shaking', 'ai-countdown--urgent',
        'ai-countdown--ending', 'ai-countdown--bouncing', 'ai-countdown--pulse-odd', 'ai-countdown--pulse-even', 'ai-countdown--finishing');
      if (this._pulseTimer !== null) { window.clearInterval(this._pulseTimer); this._pulseTimer = null; }
      this._removeRipples();
      this._renderSkeleton();
      this._applyMotionVars();
      this._startInterval();
    } else {
      this._startInterval();
    }
  };

  AI.Countdown.prototype.destroy = function () {
    this._stopInterval();
    if (this._pulseTimer !== null) window.clearInterval(this._pulseTimer);
    if (this._finishTimer !== null) window.clearTimeout(this._finishTimer);
    this._unbindMotionObserver();
    if (this.el) delete this.el._aiCountdown;
  };

  /* ============================================
   * CountUp — 数字滚动
   * 五段缓动、暂停续滚、千分位/小数格式化、庆祝动效与贴纸
   * ============================================ */

  var COUNTUP_EASINGS = {
    linear: function (p) { return p; },
    easeInCubic: function (p) { return p * p * p; },
    easeOutCubic: function (p) { return 1 - Math.pow(1 - p, 3); },
    easeInOutCubic: function (p) { return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; },
    easeOutExpo: function (p) { return p >= 1 ? 1 : 1 - Math.pow(2, -10 * p); }
  };

  var COUNTUP_CELEBRATE_DURATION = 900;

  function countUpResolveEasing(easing) {
    if (typeof easing === 'function') return easing;
    return COUNTUP_EASINGS[easing] || COUNTUP_EASINGS.easeOutCubic;
  }

  function countUpDecimalCount(value) {
    var text = String(value);
    var dot = text.indexOf('.');
    return dot === -1 ? 0 : text.length - dot - 1;
  }

  function countUpGroupThousands(text, separator) {
    return separator === '' ? text : text.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  }

  function countUpFormatNumber(value, places, decimalSeparator, thousandsSeparator) {
    if (places <= 0) return countUpGroupThousands(String(Math.round(value)), thousandsSeparator);
    var parts = value.toFixed(places).split('.');
    return countUpGroupThousands(parts[0], thousandsSeparator) + decimalSeparator + parts[1];
  }

  AI.CountUp = function (el, options) {
    var self = this;
    this.el = el;
    this.options = Object.assign(
      {
        start: 0,
        end: 0,
        duration: 2,
        isCounting: false,
        decimalPlaces: undefined,
        decimalSeparator: '.',
        thousandsSeparator: '',
        easing: 'easeOutCubic',
        formatter: null,
        updateInterval: 0,
        prefix: undefined,
        suffix: undefined,
        size: 'middle',
        variant: 'default',
        bordered: false,
        celebrate: false,
        onUpdate: null,
        onComplete: null
      },
      options || {}
    );
    this._elapsed = 0;
    this._lastTimestamp = null;
    this._frame = null;
    this._repeatTimer = null;
    this._celebrateTimer = null;
    this._completed = false;
    this._pendingStart = undefined;
    this._formatted = null;
    this._target = null;
    this._value = this.options.start;
    this._running = false;
    this._useChildren = typeof this.options.children === 'function';
    this._resetFn = this.reset.bind(this);
    this._runToken = 0;
    el.classList.add('ai-count-up', 'ai-count-up--' + this.options.size, 'ai-count-up--' + this.options.variant);
    if (this.options.bordered) el.classList.add('ai-count-up--bordered');
    el.setAttribute('role', 'status');
    el._aiCountUp = this;
    this._renderSkeleton();
    this._run();
  };

  AI.CountUp.prototype._places = function () {
    var o = this.options;
    return o.decimalPlaces != null ? o.decimalPlaces : Math.max(countUpDecimalCount(o.start), countUpDecimalCount(o.end));
  };

  AI.CountUp.prototype._format = function (value) {
    if (this.options.formatter) return String(this.options.formatter(value));
    return countUpFormatNumber(value, this._places(), this.options.decimalSeparator, this.options.thousandsSeparator);
  };

  /** children 渲染函数接管数字块；未提供时回退默认格式化。 */
  AI.CountUp.prototype._content = function (value) {
    if (this._useChildren) {
      try {
        return String(this.options.children({ value: value, reset: this._resetFn }));
      } catch (err) {
        return this._format(value);
      }
    }
    return this._format(value);
  };

  /** 一次性构建骨架：effects 容器 + plate(prefix + number + suffix) + srOnly */
  AI.CountUp.prototype._renderSkeleton = function () {
    var el = this.el;
    var o = this.options;
    var html = '<span class="ai-count-up__plate-wrap">' +
      '<span class="ai-count-up__plate" aria-hidden="true">' +
      (o.prefix !== undefined && o.prefix !== null ? '<span class="ai-count-up__affix">' + o.prefix + '</span>' : '') +
      '<span class="ai-count-up__number">' + this._content(o.start) + '</span>' +
      (o.suffix !== undefined && o.suffix !== null ? '<span class="ai-count-up__affix">' + o.suffix + '</span>' : '') +
      '</span></span>' +
      '<span class="ai-count-up__sr-only" aria-hidden="true"></span>';
    el.innerHTML = html;
    this._plateWrap = el.querySelector('.ai-count-up__plate-wrap');
    this._plate = el.querySelector('.ai-count-up__plate');
    this._numberEl = el.querySelector('.ai-count-up__number');
    this._srEl = el.querySelector('.ai-count-up__sr-only');
    this._effectsEl = null;
    this._commit(o.start, true);
  };

  /** 只在文案变化时更新 DOM；长动画不重建节点 */
  AI.CountUp.prototype._commit = function (next, force) {
    var rendered = this._content(next);
    this._value = next;
    if (!force && rendered === this._formatted) return;
    this._formatted = rendered;
    if (this._useChildren) this._numberEl.innerHTML = rendered;
    else this._numberEl.textContent = rendered;
    if (this._srEl) {
      // 计数过程中不打扰读屏，静止后播报默认数字格式（不经过 formatter / children）
      this._srEl.textContent = this._running
        ? ''
        : countUpFormatNumber(next, this._places(), this.options.decimalSeparator, this.options.thousandsSeparator);
    }
    if (this.options.onUpdate) this.options.onUpdate(next);
  };

  AI.CountUp.prototype._step = function (timestamp) {
    var self = this;
    this._frame = null;
    if (this._lastTimestamp === null) {
      this._lastTimestamp = timestamp;
      this._frame = requestAnimationFrame(function (t) { self._step(t); });
      return;
    }
    this._elapsed += timestamp - this._lastTimestamp;
    this._lastTimestamp = timestamp;

    var o = this.options;
    var totalMs = Math.max(0, o.duration) * 1000;
    var intervalMs = Math.max(0, o.updateInterval) * 1000;
    var elapsed = this._elapsed;
    var quantized = intervalMs > 0 ? Math.floor(elapsed / intervalMs) * intervalMs : elapsed;
    var done = elapsed >= totalMs;
    var progress = done ? 1 : Math.min(1, Math.max(0, quantized / totalMs));
    var next = done ? o.end : o.start + (o.end - o.start) * countUpResolveEasing(o.easing)(progress);

    if (done) {
      this._finish(elapsed);
      return;
    }
    this._commit(next);
    this._frame = requestAnimationFrame(function (t) { self._step(t); });
  };

  AI.CountUp.prototype._finish = function (elapsedMs) {
    var self = this;
    this._completed = true;
    this._running = false;
    this._lastTimestamp = null;
    this._commit(this.options.end, true);

    if (this.options.celebrate) this._celebrate();

    var result = this.options.onComplete ? this.options.onComplete(elapsedMs / 1000) : null;
    if (result && result.shouldRepeat) {
      if (this._repeatTimer !== null) window.clearTimeout(this._repeatTimer);
      this._repeatTimer = window.setTimeout(function () {
        self._repeatTimer = null;
        self._pendingStart = result.newStartAt;
        self._runToken++;
        self._run();
      }, Math.max(0, result.delay != null ? result.delay : 0) * 1000);
    }
  };

  /** 庆祝动效：pop + 双光环 + 四角星芒 + 可选贴纸，900ms 后摘除 */
  AI.CountUp.prototype._celebrate = function () {
    var self = this;
    var el = this.el;
    el.classList.add('ai-count-up--celebrating');
    var text = this.options.celebrate && typeof this.options.celebrate === 'object' ? this.options.celebrate.text : undefined;
    var effects = document.createElement('span');
    effects.className = 'ai-count-up__effects';
    effects.setAttribute('aria-hidden', 'true');
    effects.innerHTML = '<span class="ai-count-up__ring"></span><span class="ai-count-up__ring"></span>' +
      '<span class="ai-count-up__sparkles"><span class="ai-count-up__sparkle"></span><span class="ai-count-up__sparkle"></span>' +
      '<span class="ai-count-up__sparkle"></span><span class="ai-count-up__sparkle"></span></span>' +
      (text !== undefined ? '<span class="ai-count-up__badge-wrap"><span class="ai-count-up__badge">' + text + '</span></span>' : '');
    this._plateWrap.insertBefore(effects, this._plate);
    this._effectsEl = effects;
    if (this._celebrateTimer !== null) window.clearTimeout(this._celebrateTimer);
    this._celebrateTimer = window.setTimeout(function () {
      self._celebrateTimer = null;
      el.classList.remove('ai-count-up--celebrating');
      if (self._effectsEl && self._effectsEl.parentNode) self._effectsEl.parentNode.removeChild(self._effectsEl);
      self._effectsEl = null;
    }, COUNTUP_CELEBRATE_DURATION);
  };

  /** 主循环调度：target(start|end|duration) 或 runToken 变化时重播 */
  AI.CountUp.prototype._run = function () {
    var self = this;
    var el = this.el;
    if (this._frame !== null) { cancelAnimationFrame(this._frame); this._frame = null; }
    if (this._repeatTimer !== null) { window.clearTimeout(this._repeatTimer); this._repeatTimer = null; }

    var o = this.options;
    var target = o.start + '|' + o.end + '|' + o.duration;
    var restart = target !== this._target || this._runToken !== this._lastToken;
    this._target = target;
    this._lastToken = this._runToken;

    if (restart) {
      this._elapsed = 0;
      this._lastTimestamp = null;
      this._completed = false;
      el.classList.remove('ai-count-up--celebrating');
      if (this._effectsEl && this._effectsEl.parentNode) this._effectsEl.parentNode.removeChild(this._effectsEl);
      this._effectsEl = null;
      this._commit(typeof this._pendingStart === 'number' ? this._pendingStart : o.start, true);
    }
    this._pendingStart = undefined;

    if (!o.isCounting || this._completed) return;
    if (typeof requestAnimationFrame !== 'function') return;
    this._running = true;
    if (Math.max(0, o.duration) * 1000 === 0) {
      this._finish(0);
      return;
    }
    this._lastTimestamp = null;
    this._frame = requestAnimationFrame(function (t) { self._step(t); });
  };

  /** 重置到起始值并重新播放（可选从 newStartAt 开始） */
  AI.CountUp.prototype.reset = function (newStartAt) {
    this._pendingStart = newStartAt;
    this._runToken++;
    this._run();
  };

  AI.CountUp.prototype.start = function () {
    this.options.isCounting = true;
    this._run();
  };

  AI.CountUp.prototype.pause = function () {
    // 暂停：停帧但保留已流逝时间，恢复时从暂停处继续
    if (this._frame !== null) { cancelAnimationFrame(this._frame); this._frame = null; }
    this._lastTimestamp = null;
    this.options.isCounting = false;
    if (this._running) {
      this._running = false;
      this._commit(this._value, true);
    }
  };

  AI.CountUp.prototype.update = function (next) {
    var self = this;
    var needSkeleton = next && ('prefix' in next || 'suffix' in next || 'size' in next || 'variant' in next ||
      'bordered' in next || 'formatter' in next || 'decimalSeparator' in next || 'thousandsSeparator' in next ||
      'decimalPlaces' in next || 'children' in next);
    Object.keys(next || {}).forEach(function (k) { self.options[k] = next[k]; });
    if (next && 'children' in next) this._useChildren = typeof next.children === 'function';
    if (needSkeleton) {
      this._renderSkeleton();
      this._target = null; // 强制按 restart 流程提交起始值
      this._run();
    } else {
      this._run();
    }
  };

  AI.CountUp.prototype.destroy = function () {
    if (this._frame !== null) cancelAnimationFrame(this._frame);
    if (this._repeatTimer !== null) window.clearTimeout(this._repeatTimer);
    if (this._celebrateTimer !== null) window.clearTimeout(this._celebrateTimer);
    if (this.el) delete this.el._aiCountUp;
  };

  /* ============================================
     Upload — 文件上传（text / picture / picture-card + 拖拽）
     模拟上传：220ms 步进 +12~20%，起始 6%；支持 customRequest / action(XHR)
     注意：构造函数必须最先赋值，后续静态方法与 prototype 挂在同一函数对象上
     ============================================ */
  AI.Upload = function (el, options) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    if (!this.el) return;

    var o = options || {};
    this.options = {
      listType: o.listType || 'text',
      accept: o.accept || '',
      multiple: !!o.multiple,
      maxCount: o.maxCount,
      disabled: !!o.disabled,
      directory: !!o.directory,
      action: o.action || '',
      method: o.method || 'post',
      name: o.name || 'file',
      headers: o.headers || {},
      data: o.data || {},
      withCredentials: !!o.withCredentials,
      showUploadList: o.showUploadList === undefined ? true : o.showUploadList,
      drag: !!o.drag,
      tip: o.tip || '',
      children: o.children || '',
      progress: o.progress === undefined ? false : o.progress,
      beforeUpload: o.beforeUpload || null,
      customRequest: o.customRequest || null,
      onChange: o.onChange || null,
      onPreview: o.onPreview || null,
      onRemove: o.onRemove || null,
      onExceed: o.onExceed || null,
      ariaLabel: o.ariaLabel || ''
    };

    this._controlled = !!o.fileList;
    this.fileList = (o.fileList || o.defaultFileList || []).map(function (f) {
      return this._normalize(f, 'done');
    }, this);
    this._blobUrls = [];
    this._timers = {};
    this._xhrs = {};
    this._previewLayer = null;
    this._lastFocused = null;

    this._build();
    this._bind();

    var self = this;
    this.fileList.forEach(function (item) {
      // 只有带 originFileObj 的新选择文件才自动开始上传；
      // defaultFileList 里的 uploading 项（如固定进度预览）保持原样
      if (item.status === 'uploading' && item.originFileObj) self._beginUpload([item]);
    });

    this.el._aiUpload = this;
  };

  AI.Upload._uid = 0;

  AI.Upload._icons = {
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
    check: '<polyline points="20 6 9 17 4 12"/>',
    close: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    eye: '<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>'
  };

  AI.Upload._icon = function (name, size) {
    var s = size || 14;
    return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      AI.Upload._icons[name] + '</svg>';
  };

  AI.Upload._esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  AI.Upload._formatSize = function (bytes) {
    if (bytes == null) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  AI.Upload.prototype._matchAccept = function (accept, file) {
    if (!accept) return true;
    var name = (file.name || '').toLowerCase();
    var type = (file.type || '').toLowerCase();
    var parts = accept.split(',').map(function (s) { return s.trim().toLowerCase(); }).filter(Boolean);
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      if (p.charAt(0) === '.') {
        if (name.indexOf(p, name.length - p.length) !== -1) return true;
      } else if (p.charAt(p.length - 1) === '*') {
        if (type.indexOf(p.slice(0, -1)) === 0) return true;
      } else if (type === p) {
        return true;
      }
    }
    return false;
  };

  AI.Upload.prototype._isImage = function (item) {
    return !!(item.type && String(item.type).indexOf('image/') === 0);
  };

  AI.Upload.prototype._normalize = function (file, status) {
    var item = file && file.uid ? file : {
      name: file && file.name ? file.name : 'file',
      size: file && file.size != null ? file.size : null,
      type: file && file.type ? file.type : ''
    };
    if (!item.uid) item.uid = ++AI.Upload._uid;
    if (!item.status) item.status = status || 'done';
    if (item.percent == null) item.percent = item.status === 'uploading' ? 0 : 100;
    return item;
  };

  AI.Upload.prototype._build = function () {
    var o = this.options;
    this.el.classList.add('ai-upload');
    if (o.disabled) this.el.classList.add('ai-upload--disabled');

    var input = document.createElement('input');
    input.type = 'file';
    input.className = 'ai-upload__hidden-input';
    input.setAttribute('aria-hidden', 'true');
    input.tabIndex = -1;
    if (o.accept) input.accept = o.accept;
    if (o.multiple) input.multiple = true;
    if (o.directory) { input.setAttribute('webkitdirectory', ''); input.setAttribute('directory', ''); }
    if (o.disabled) input.disabled = true;
    this.input = input;
    this.el.appendChild(input);

    var html = '';
    if (o.children) {
      html += '<button type="button" class="ai-upload__trigger--custom" aria-label="' +
        AI.Upload._esc(o.ariaLabel) + '"' + (o.disabled ? ' disabled' : '') + '>' + o.children + '</button>';
    } else if (o.drag) {
      html += '<div class="ai-upload__drag-zone" role="button" tabindex="0" aria-label="' +
        AI.Upload._esc(o.ariaLabel || '点击或拖拽文件到此处上传') + '"' + (o.disabled ? ' aria-disabled="true"' : '') + '>' +
        '<span class="ai-upload__drag-icon">' + AI.Upload._icon('upload', 18) + '</span>' +
        '<span class="ai-upload__drag-text">点击或拖拽文件到这里</span>' +
        '</div>';
    } else {
      html += '<button type="button" class="ai-upload__trigger" aria-label="' +
        AI.Upload._esc(o.ariaLabel || '选择文件') + '"' + (o.disabled ? ' disabled' : '') + '>' +
        AI.Upload._icon('upload', 14) + '<span>点击上传</span></button>';
    }
    if (o.tip) html += '<div class="ai-upload__tip">' + o.tip + '</div>';

    var zone = document.createElement('div');
    zone.className = 'ai-upload__trigger-area';
    zone.innerHTML = html;
    this.el.appendChild(zone);
    this.triggerArea = zone;

    var listWrap = document.createElement('div');
    this.el.appendChild(listWrap);
    this.listWrap = listWrap;
    this._renderList();
  };

  /* ---------- 列表渲染 ---------- */
  AI.Upload.prototype._showList = function () {
    var s = this.options.showUploadList;
    if (s === false) return false;
    return true;
  };
  AI.Upload.prototype._showPreviewIcon = function () {
    var s = this.options.showUploadList;
    return s === true || (s && typeof s === 'object' && s.showPreviewIcon !== false);
  };
  AI.Upload.prototype._showRemoveIcon = function () {
    var s = this.options.showUploadList;
    return s === true || (s && typeof s === 'object' && s.showRemoveIcon !== false);
  };

  AI.Upload.prototype._barProgressHTML = function (percent) {
    var p = this.options.progress || {};
    var colorStyle = p.color ? 'background:' + p.color + ';' : '';
    var dur = p.duration ? 'transition-duration:' + p.duration + 's;' : '';
    return '<div class="ai-upload__file-progress">' +
      '<div class="ai-progress__track ai-progress__track--sm">' +
      '<div class="ai-progress__fill" style="width:' + Math.round(percent) + '%;' + colorStyle + dur + '"></div>' +
      '</div></div>';
  };

  AI.Upload.prototype._textItemHTML = function (item) {
    var o = this.options;
    var cls = 'ai-upload__text-item';
    if (item.status === 'error') cls += ' ai-upload__text-item--error';
    var bgLayer = '';
    var uploading = item.status === 'uploading';
    if (uploading && o.progress && o.progress.type === 'background') {
      bgLayer = '<div class="ai-upload__background-progress" aria-hidden="true">' +
        '<div class="ai-upload__background-fill" style="width:' + Math.round(item.percent) + '%' +
        (o.progress.color ? ';background:' + o.progress.color : '') +
        (o.progress.duration ? ';transition-duration:' + o.progress.duration + 's' : '') + '"></div></div>';
    }

    var thumb = '';
    if (o.listType === 'picture') {
      // picture 模式：固定 30px 缩略图盒，有 previewSrc 放图片，否则放文件图标
      var src = item.thumbUrl || item.url;
      if (this._isImage(item) && src) {
        thumb = '<span class="ai-upload__text-thumb"><img class="ai-upload__text-thumb-img" src="' +
          AI.Upload._esc(src) + '" alt=""></span>';
      } else {
        thumb = '<span class="ai-upload__text-thumb">' + AI.Upload._icon('file', 18) + '</span>';
      }
    } else {
      thumb = '<span class="ai-upload__file-icon">' + AI.Upload._icon('file', 15) + '</span>';
    }

    var details = '<div class="ai-upload__file-details">' +
      '<span class="ai-upload__file-name" title="' + AI.Upload._esc(item.name) + '">' +
      AI.Upload._esc(item.name) + '</span>';
    if (uploading && o.progress && o.progress.type === 'bar') {
      details += this._barProgressHTML(item.percent);
    }
    details += '</div>';

    var sizeHtml = item.size != null && item.size !== undefined
      ? '<span class="ai-upload__file-size">' + AI.Upload._formatSize(item.size) + '</span>'
      : '';

    var statusHtml = '';
    if (uploading) {
      statusHtml = '<span class="ai-upload__status-icon"><span class="ai-upload__spinner" aria-hidden="true"></span>' +
        (o.progress && o.progress.showInfo !== false
        ? '<span class="ai-upload__percent">' + Math.round(item.percent) + '%</span>' : '') +
        '</span>';
    } else if (item.status === 'error') {
      statusHtml = '<span class="ai-upload__status-icon ai-upload__status-icon--error">' +
        AI.Upload._icon('close', 12) + '</span>';
    } else {
      statusHtml = '<span class="ai-upload__status-icon ai-upload__status-icon--done">' +
        AI.Upload._icon('check', 12) + '</span>';
    }
    if (uploading && o.progress && o.progress.type === 'background' && o.progress.showInfo !== false) {
      statusHtml = '<span class="ai-upload__background-percent">' + Math.round(item.percent) + '%</span>';
    }

    var previewable = this._isImage(item) && !!(item.thumbUrl || item.url);
    var actions = '';
    if (item.status !== 'uploading' && previewable && this._showPreviewIcon()) {
      actions += '<button type="button" class="ai-upload__preview-btn" data-preview-uid="' + item.uid +
        '" aria-label="预览 ' + AI.Upload._esc(item.name) + '">' + AI.Upload._icon('eye', 13) + '</button>';
    }
    if (this._showRemoveIcon()) {
      actions += '<button type="button" class="ai-upload__remove-btn" data-remove-uid="' + item.uid +
        '" aria-label="移除 ' + AI.Upload._esc(item.name) + '">' + AI.Upload._icon('close', 12) + '</button>';
    }

    return '<li class="' + cls + '" data-uid="' + item.uid + '">' + bgLayer + thumb + details + sizeHtml +
      statusHtml + actions + '</li>';
  };

  AI.Upload.prototype._cardItemHTML = function (item) {
    var o = this.options;
    var cls = 'ai-upload__card';
    if (item.status === 'done') cls += ' ai-upload__card--done';
    if (item.status === 'error') cls += ' ai-upload__card--error';

    var inner = '';
    var previewable = this._isImage(item) && !!(item.thumbUrl || item.url);
    if (this._isImage(item) && (item.thumbUrl || item.url)) {
      inner += '<img class="ai-upload__card-img' +
        (previewable && this._showPreviewIcon() && item.status !== 'uploading' ? ' ai-upload__card-img--previewable' : '') +
        '" src="' + AI.Upload._esc(item.thumbUrl || item.url) + '" alt="' + AI.Upload._esc(item.name) + '">';
    } else {
      inner += '<span class="ai-upload__card-file-icon">' + AI.Upload._icon('file', 24) + '</span>';
    }

    if (item.status === 'uploading') {
      var bgCls = o.progress && o.progress.type === 'background' ? ' ai-upload__card-mask--background' : '';
      var showInfo = (o.progress && o.progress.showInfo !== false) || !o.progress;
      inner += '<div class="ai-upload__card-mask' + bgCls + '">' +
        (o.progress && o.progress.type === 'bar'
          ? '<div class="ai-upload__card-progress">' +
            '<div class="ai-progress__track ai-progress__track--sm">' +
            '<div class="ai-progress__fill" style="width:' + Math.round(item.percent) + '%' +
            (o.progress.color ? ';background:' + o.progress.color : '') +
            (o.progress.duration ? ';transition-duration:' + o.progress.duration + 's' : '') + '"></div>' +
            '</div>' +
            (showInfo ? '<span class="ai-upload__card-percent">' + Math.round(item.percent) + '%</span>' : '') +
            '</div>'
          : (showInfo ? '<span class="ai-upload__card-percent" style="color:' +
            (o.progress && o.progress.type === 'background' ? '#794f27' : '#fff') + '">' +
            Math.round(item.percent) + '%</span>' : '')) +
        '</div>';
    } else if (item.status === 'error') {
      inner += '<div class="ai-upload__card-mask">' + AI.Upload._icon('close', 16) + '</div>';
    }

    var actions = '';
    if (item.status !== 'uploading' && previewable && this._showPreviewIcon()) {
      actions += '<button type="button" class="ai-upload__card-preview" data-preview-uid="' + item.uid +
        '" aria-label="预览 ' + AI.Upload._esc(item.name) + '">' + AI.Upload._icon('eye', 12) + '</button>';
    }
    if (this._showRemoveIcon()) {
      actions += '<button type="button" class="ai-upload__card-remove" data-remove-uid="' + item.uid +
        '" aria-label="移除 ' + AI.Upload._esc(item.name) + '">' + AI.Upload._icon('close', 12) + '</button>';
    }

    return '<li class="' + cls + '" data-uid="' + item.uid + '">' + inner + actions + '</li>';
  };

  AI.Upload.prototype._renderList = function () {
    if (!this.listWrap) return;
    var o = this.options;
    if (!this._showList()) { this.listWrap.innerHTML = ''; return; }

    var self = this;
    if (o.listType === 'picture-card') {
      var cards = this.fileList.map(function (item) { return self._cardItemHTML(item); }).join('');
      var addBtn = '';
      var full = o.maxCount != null && this.fileList.length >= o.maxCount;
      if (!full) {
        addBtn = '<li class="ai-upload__card-add">' +
          '<button type="button" class="ai-upload__card-add-btn" aria-label="添加文件"' +
          (o.disabled ? ' disabled' : '') + '>' + AI.Upload._icon('upload', 18) + '</button></li>';
      }
      this.listWrap.innerHTML = '<ul class="ai-upload__card-list">' + cards + addBtn + '</ul>';
    } else {
      var rows = this.fileList.map(function (item) { return self._textItemHTML(item); }).join('');
      this.listWrap.innerHTML = rows ? '<ul class="ai-upload__text-list">' + rows + '</ul>' : '';
    }
  };

  /* ---------- 事件绑定 ---------- */
  AI.Upload.prototype._bind = function () {
    var self = this;

    this.el.addEventListener('click', function (e) {
      var removeBtn = e.target.closest('[data-remove-uid]');
      if (removeBtn) {
        var uid1 = Number(removeBtn.getAttribute('data-remove-uid'));
        self._handleRemove(uid1);
        return;
      }
      var previewBtn = e.target.closest('[data-preview-uid]');
      if (previewBtn) {
        self._handlePreview(Number(previewBtn.getAttribute('data-preview-uid')));
        return;
      }
      if (e.target.closest('.ai-upload__card-img--previewable')) {
        var card = e.target.closest('.ai-upload__card');
        if (card) self._handlePreview(Number(card.getAttribute('data-uid')));
        return;
      }
      if (e.target.closest('.ai-upload__trigger, .ai-upload__drag-zone, .ai-upload__card-add-btn')) {
        self._openPicker();
      }
    });

    this.el.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var zone = e.target.closest('.ai-upload__drag-zone');
      if (!zone) return;
      e.preventDefault();
      self._openPicker();
    });

    if (this.options.drag) {
      this.el.addEventListener('dragover', function (e) { e.preventDefault(); });
      this.el.addEventListener('dragenter', function (e) {
        e.preventDefault();
        var zone = self.el.querySelector('.ai-upload__drag-zone');
        if (zone && !self.options.disabled) zone.classList.add('ai-upload__drag-zone--active');
      });
      this.el.addEventListener('dragleave', function (e) {
        var zone = self.el.querySelector('.ai-upload__drag-zone');
        if (zone && !self.el.contains(e.relatedTarget)) zone.classList.remove('ai-upload__drag-zone--active');
      });
      this.el.addEventListener('drop', function (e) {
        e.preventDefault();
        var zone = self.el.querySelector('.ai-upload__drag-zone');
        if (zone) zone.classList.remove('ai-upload__drag-zone--active');
        if (self.options.disabled) return;
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) {
          self._onSelect(e.dataTransfer.files);
        }
      });
    }
  };

  AI.Upload.prototype._openPicker = function () {
    if (this.options.disabled) return;
    if (this.input) this.input.click();
  };

  /* ---------- 文件选择 ---------- */
  AI.Upload.prototype._onSelect = function (fileListRaw) {
    if (this.options.disabled) return;
    var files = Array.prototype.slice.call(fileListRaw || []);
    if (!files.length) return;

    if (!this.options.directory && this.options.accept) {
      var self = this;
      files = files.filter(function (f) { return self._matchAccept(self.options.accept, f); });
      if (!files.length) return;
    }

    var before = this.options.beforeUpload;
    var self2 = this;
    var proceed = function (kept) {
      self2._acceptFiles(kept);
    };
    var checked = [];
    var pending = 0;
    var flush = function () {
      if (pending === 0) proceed(checked);
    };
    for (var i = 0; i < files.length; i++) {
      (function (file) {
        if (!before) { checked.push(file); return; }
        var r = before(file, files);
        if (r === false) return;
        if (r && typeof r.then === 'function') {
          pending++;
          r.then(function (res) {
            pending--;
            if (res !== false) checked.push(res instanceof File ? res : file);
            flush();
          }, function () {
            pending--;
            flush();
          });
        } else {
          checked.push(r instanceof File ? r : file);
        }
      })(files[i]);
    }
    if (pending === 0) proceed(checked);
  };

  AI.Upload.prototype._acceptFiles = function (files) {
    if (!files.length) return;
    var o = this.options;

    if (o.multiple !== true && !o.directory) files = files.slice(0, 1);

    var overflow = null;
    if (o.maxCount != null) {
      if (o.maxCount === 1) {
        this._discardAll();
        this.fileList = [];
      } else {
        var room = o.maxCount - this.fileList.length;
        if (files.length > room) {
          overflow = files.slice(room);
          files = files.slice(0, Math.max(room, 0));
        }
      }
    }

    var self = this;
    var items = files.map(function (file) {
      var item = self._normalize(file, 'uploading');
      item.originFileObj = file;
      if (self._isImage(item)) {
        try {
          item.thumbUrl = URL.createObjectURL(file);
          self._blobUrls.push(item.thumbUrl);
        } catch (err) { /* blob 创建失败则无缩略图 */ }
      }
      return item;
    });

    if (o.maxCount === 1) {
      this.fileList = items;
    } else {
      this.fileList = this.fileList.concat(items);
    }

    this._renderList();
    this._fireChange(items[items.length - 1], 'select');

    if (overflow && o.onExceed) {
      o.onExceed(overflow, this.fileList.slice());
    }

    this._beginUpload(items);
  };

  AI.Upload.prototype._discardAll = function () {
    var self = this;
    this.fileList.forEach(function (item) { self._stopTransfer(item); });
  };

  AI.Upload.prototype._beginUpload = function (items) {
    var self = this;
    items.forEach(function (item) {
      if (self.options.customRequest) {
        self.options.customRequest({
          file: item.originFileObj,
          onProgress: function (e) {
            // 兼容两种回调形态：onProgress({ percent: 50 }) 或 onProgress(50)
            var p = (e && typeof e === 'object' && e.percent != null) ? e.percent : e;
            self._patchItem(item.uid, { percent: typeof p === 'number' ? p : item.percent });
          },
          onSuccess: function (ret) {
            self._patchItem(item.uid, { status: 'done', percent: 100, response: ret });
          },
          onError: function (err) {
            self._patchItem(item.uid, { status: 'error', error: err });
          }
        }, item);
      } else if (self.options.action) {
        self._xhrUpload(item);
      } else {
        self._simulate(item);
      }
    });
  };

  AI.Upload.prototype._simulate = function (item) {
    var self = this;
    var percent = 6;
    var timer = setInterval(function () {
      percent += 12 + Math.round(Math.random() * 8);
      if (percent >= 100) {
        clearInterval(timer);
        delete self._timers[item.uid];
        self._patchItem(item.uid, { percent: 100, status: 'done' });
      } else {
        self._patchItem(item.uid, { percent: percent });
      }
    }, 220);
    this._timers[item.uid] = timer;
    self._patchItem(item.uid, { percent: percent });
  };

  AI.Upload.prototype._xhrUpload = function (item) {
    var o = this.options;
    var self = this;
    var xhr = new XMLHttpRequest();
    item.xhr = xhr;
    this._xhrs[item.uid] = xhr;

    var formData = new FormData();
    Object.keys(o.data || {}).forEach(function (k) { formData.append(k, o.data[k]); });
    formData.append(o.name, item.originFileObj);

    xhr.open(o.method, o.action, true);
    Object.keys(o.headers || {}).forEach(function (k) { xhr.setRequestHeader(k, o.headers[k]); });
    if (o.withCredentials) xhr.withCredentials = true;

    if (xhr.upload) {
      xhr.upload.onprogress = function (e) {
        if (e.lengthComputable) {
          self._patchItem(item.uid, { percent: Math.round((e.loaded / e.total) * 100) });
        }
      };
    }
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        self._patchItem(item.uid, { status: 'done', percent: 100, response: xhr.responseText });
      } else {
        self._patchItem(item.uid, { status: 'error', error: new Error('HTTP ' + xhr.status) });
      }
    };
    xhr.onerror = function () {
      self._patchItem(item.uid, { status: 'error', error: new Error('网络错误') });
    };
    xhr.send(formData);
  };

  AI.Upload.prototype._stopTransfer = function (item) {
    if (this._timers[item.uid]) { clearInterval(this._timers[item.uid]); delete this._timers[item.uid]; }
    if (this._xhrs[item.uid]) { this._xhrs[item.uid].abort(); delete this._xhrs[item.uid]; }
    if (item.xhr) delete item.xhr;
  };

  AI.Upload.prototype._findItem = function (uid) {
    var found = null;
    this.fileList.forEach(function (item) { if (item.uid === uid) found = item; });
    return found;
  };

  AI.Upload.prototype._patchItem = function (uid, patch) {
    var item = this._findItem(uid);
    if (!item) return;
    Object.keys(patch).forEach(function (k) { item[k] = patch[k]; });
    this._renderList();
    this._fireChange(item, patch.status || 'progress');
  };

  AI.Upload.prototype._fireChange = function (file, event) {
    if (this.options.onChange) {
      this.options.onChange({ file: file, fileList: this.fileList.slice(), event: event });
    }
    this.el.dispatchEvent(new CustomEvent('ai-upload-change', {
      detail: { file: file, fileList: this.fileList.slice(), event: event },
      bubbles: true
    }));
  };

  AI.Upload.prototype._handleRemove = function (uid) {
    var item = this._findItem(uid);
    if (!item) return;
    var self = this;
    var result = this.options.onRemove ? this.options.onRemove(item, this.fileList.slice()) : undefined;
    if (result === false) return;
    // 支持异步拦截：resolve(false) 或 reject 时保留文件
    if (result && typeof result.then === 'function') {
      result.then(function (ok) {
        if (ok !== false) self._doRemove(item);
      }).catch(function () { /* 抛错视为阻止移除 */ });
      return;
    }
    this._doRemove(item);
  };

  AI.Upload.prototype._doRemove = function (item) {
    this._stopTransfer(item);

    // 非受控模式下回收 blob URL；受控模式（fileList 由外部维护）保留
    if (!this._controlled && item.thumbUrl) {
      var idx = this._blobUrls.indexOf(item.thumbUrl);
      if (idx !== -1) {
        try { URL.revokeObjectURL(item.thumbUrl); } catch (err) { /* 忽略 */ }
        this._blobUrls.splice(idx, 1);
      }
    }

    var uid = item.uid;
    this.fileList = this.fileList.filter(function (it) { return it.uid !== uid; });

    this._renderList();
    this._fireChange(item, 'removed');
  };

  AI.Upload.prototype._handlePreview = function (uid) {
    var item = this._findItem(uid);
    if (!item) return;
    if (this.options.onPreview) {
      this.options.onPreview(item);
      return;
    }
    var url = item.thumbUrl || item.url;
    if (this._isImage(item) && url) this._openPreview(item);
  };

  /* ---------- 内置图片预览弹层 ---------- */
  AI.Upload.prototype._openPreview = function (item) {
    if (this._previewLayer) return;
    var self = this;
    this._lastFocused = document.activeElement;

    var layer = document.createElement('div');
    layer.className = 'ai-upload__preview-layer';
    layer.setAttribute('role', 'dialog');
    layer.setAttribute('aria-modal', 'true');
    layer.setAttribute('aria-label', '图片预览');
    layer.innerHTML = '<img class="ai-upload__preview-img" src="' + AI.Upload._esc(item.thumbUrl || item.url) +
      '" alt="' + AI.Upload._esc(item.name) + '">' +
      '<button type="button" class="ai-upload__preview-close" aria-label="关闭预览">' +
      AI.Upload._icon('close', 16) + '</button>';
    document.body.appendChild(layer);
    this._previewLayer = layer;
    document.body.style.overflow = 'hidden';

    this._onKeydown = function (e) { if (e.key === 'Escape') self.closePreview(); };
    document.addEventListener('keydown', this._onKeydown);
    layer.addEventListener('click', function (e) {
      if (e.target === layer || e.target.closest('.ai-upload__preview-close')) self.closePreview();
    });

    var closeBtn = layer.querySelector('.ai-upload__preview-close');
    if (closeBtn) closeBtn.focus();
  };

  AI.Upload.prototype.closePreview = function () {
    if (!this._previewLayer) return;
    document.body.removeChild(this._previewLayer);
    this._previewLayer = null;
    document.body.style.overflow = '';
    document.removeEventListener('keydown', this._onKeydown);
    if (this._lastFocused && this._lastFocused.focus) this._lastFocused.focus();
  };

  /* ---------- 公开 API ---------- */
  AI.Upload.prototype.update = function (next) {
    var self = this;
    Object.keys(next || {}).forEach(function (k) { self.options[k] = next[k]; });
    if (next && next.fileList) {
      this._controlled = true;
      this.fileList = next.fileList.map(function (f) { return self._normalize(f); });
    }
    this.el.classList.toggle('ai-upload--disabled', !!this.options.disabled);
    if (this.input) this.input.disabled = !!this.options.disabled;
    this._renderList();
  };

  AI.Upload.prototype.destroy = function () {
    var self = this;
    this.fileList.slice().forEach(function (item) { self._stopTransfer(item); });
    this._blobUrls.forEach(function (url) {
      try { URL.revokeObjectURL(url); } catch (err) { /* 忽略 */ }
    });
    this._blobUrls = [];
    this.closePreview();
    if (this.el) delete this.el._aiUpload;
  };

  AI.Upload.prototype.uploadFiles = function (files) {
    this._onSelect(files);
  };


  /* ============================================
     DatePicker 日期选择
     对应原版 React 实现：严格解析（拒绝 2026-02-30 进位）、
     42 格网格（周日起始）、单选 pendingDate + 「确定」提交、
     范围双面板 + hover 反向预览、date/month/year 三级模式、
     面板翻转定位 + 200ms 退场动效、完整键盘导航
     ============================================ */
  AI.DatePicker = function (el, options) {
    // 构造函数必须最先赋值：后面的 prototype 方法挂载依赖它已存在
    var o = this.options = Object.assign({
      range: false,
      picker: 'date',
      value: undefined,
      defaultValue: null,
      onChange: null,
      placeholder: '请选择日期',
      disabled: false,
      allowClear: false,
      size: 'middle',
      status: null,
      format: null,
      disabledDate: null,
      open: undefined,
      onOpenChange: null,
      showToday: true,
      ariaLabel: null,
      ariaLabelledby: null
    }, options || {});
    this.el = el;
    el._aiDatePicker = this;
    this._uid = ++AI.DatePicker._uidSeed;
    this._controlled = o.value !== undefined;
    this._value = this._controlled ? o.value : (o.defaultValue != null ? o.defaultValue : null);
    this._innerOpen = false;
    this._format = o.format || (o.picker === 'month' ? 'YYYY-MM' : 'YYYY-MM-DD');
    var initial = AI.DatePicker.parse(typeof o.defaultValue === 'string' ? o.defaultValue : null) || AI.DatePicker.today();
    this._viewDate = initial;
    this._focusedDate = initial;
    this._mode = o.picker === 'month' && !o.range ? 'month' : 'date';
    this._rangeStart = null;
    this._rangeEnd = null;
    this._hoverDate = null;
    this._pendingDate = null;
    this._selectedDate = null;
    this._selectedRange = null;
    this._mounted = false;
    this._closing = false;
    this._closeTimer = null;
    this._panelEl = null;
    this._triggerEl = null;
    this._positioned = false;
    this._build();
  };

  AI.DatePicker._uidSeed = 0;
  AI.DatePicker.WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];
  AI.DatePicker.MONTHS = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
  /** 日期网格固定补满 6 行 × 7 列 */
  AI.DatePicker.GRID_CELLS = 42;
  /** 关闭退场动画时长，与 .ai-datepicker__panel 的 0.2s 过渡保持一致 */
  AI.DatePicker.CLOSE_ANIMATION_MS = 200;

  AI.DatePicker._pad2 = function (n) {
    return (n < 10 ? '0' : '') + n;
  };

  AI.DatePicker._esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  /** 日期归一化为当天 00:00 的本地时间 */
  AI.DatePicker.norm = function (d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  };

  AI.DatePicker.today = function () {
    return AI.DatePicker.norm(new Date());
  };

  /** 严格解析 YYYY-MM-DD / YYYY-M-D / YYYY-MM，非法输入返回 null（不回退原生 Date 的静默进位） */
  AI.DatePicker.parse = function (value) {
    if (!value) return null;
    var m = /^(\d{4})-(\d{1,2})(?:-(\d{1,2}))?$/.exec(String(value));
    if (!m) return null;
    var y = +m[1], mo = +m[2], d = m[3] === undefined ? 1 : +m[3];
    var date = new Date(y, mo - 1, d);
    if (date.getFullYear() !== y || date.getMonth() !== mo - 1 || date.getDate() !== d) return null;
    return date;
  };

  /** 解析范围值 [开始, 结束]，任一端非法或非数组均返回 null */
  AI.DatePicker.parseRange = function (value) {
    if (!value || typeof value === 'string' || !value.length) return null;
    var start = AI.DatePicker.parse(value[0]);
    var end = AI.DatePicker.parse(value[1]);
    return start && end ? [start, end] : null;
  };

  AI.DatePicker.iso = function (d) {
    return d.getFullYear() + '-' + AI.DatePicker._pad2(d.getMonth() + 1) + '-' + AI.DatePicker._pad2(d.getDate());
  };

  AI.DatePicker.isoMonth = function (d) {
    return d.getFullYear() + '-' + AI.DatePicker._pad2(d.getMonth() + 1);
  };

  AI.DatePicker.sameDay = function (a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  };

  AI.DatePicker.sameMonth = function (a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
  };

  AI.DatePicker.firstOfMonth = function (d) {
    return new Date(d.getFullYear(), d.getMonth(), 1);
  };

  AI.DatePicker.addDays = function (d, n) {
    var x = new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
    return AI.DatePicker.norm(x);
  };

  /** 月份加法：保留日期并夹取到目标月天数（对应 dayjs add('month')） */
  AI.DatePicker.addMonthsKeep = function (d, n) {
    var dim = new Date(d.getFullYear(), d.getMonth() + n + 1, 0).getDate();
    return new Date(d.getFullYear(), d.getMonth() + n, Math.min(d.getDate(), dim));
  };

  AI.DatePicker.daysInMonth = function (y, m0) {
    return new Date(y, m0 + 1, 0).getDate();
  };

  /** 模板格式化：dayjs 核心 token（YYYY/YY/MM/M/MMM/MMMM/DD/D/HH/H/mm/m/ss/s/ddd/d/A/a）与 [字面量] */
  AI.DatePicker._format = function (date, fmt) {
    var lits = [];
    var out = String(fmt).replace(/\[[^\]]*\]/g, function (m) {
      lits.push(m.slice(1, -1));
      return '\u0001' + (lits.length - 1) + '\u0001';
    });
    var shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var longMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var hours = date.getHours();
    var map = {
      YYYY: String(date.getFullYear()),
      YY: String(date.getFullYear()).slice(-2),
      MMMM: longMonths[date.getMonth()],
      MMM: shortMonths[date.getMonth()],
      MM: AI.DatePicker._pad2(date.getMonth() + 1),
      M: String(date.getMonth() + 1),
      DD: AI.DatePicker._pad2(date.getDate()),
      D: String(date.getDate()),
      HH: AI.DatePicker._pad2(hours),
      H: String(hours),
      mm: AI.DatePicker._pad2(date.getMinutes()),
      m: String(date.getMinutes()),
      ss: AI.DatePicker._pad2(date.getSeconds()),
      s: String(date.getSeconds()),
      ddd: shortDays[date.getDay()],
      d: String(date.getDay()),
      A: hours < 12 ? 'AM' : 'PM',
      a: hours < 12 ? 'am' : 'pm'
    };
    out = out.replace(/YYYY|YY|MMMM|MMM|MM|M|DD|D|HH|H|mm|m|ss|s|ddd|d|A|a/g, function (t) { return map[t]; });
    return out.replace(/\u0001(\d+)\u0001/g, function (_, i) { return lits[+i]; });
  };

  /** 视图起点：本月 1 日所在周的周日（周日起始） */
  AI.DatePicker.gridStartOf = function (month) {
    var first = AI.DatePicker.firstOfMonth(month);
    return AI.DatePicker.addDays(first, -first.getDay());
  };

  AI.DatePicker._buildCells = function (vDate) {
    var gridStart = AI.DatePicker.gridStartOf(vDate);
    var cells = [];
    for (var i = 0; i < AI.DatePicker.GRID_CELLS; i++) cells.push(AI.DatePicker.addDays(gridStart, i));
    return cells;
  };

  AI.DatePicker._calendarIcon =
    '<svg width="14" height="14" viewBox="0 0 14 14" fill="none">' +
    '<rect x="1.5" y="2.5" width="11" height="10" rx="2" stroke="currentColor" stroke-width="1.4"/>' +
    '<path d="M1.5 5.5h11" stroke="currentColor" stroke-width="1.4"/>' +
    '<path d="M4.7 1v2.4M9.3 1v2.4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' +
    '</svg>';

  // 年导航按钮用 class 图标（CSS 16×16），月导航按钮带 width/height 12 —— 与原版一致
  AI.DatePicker._chevronLeft = '<svg class="ai-datepicker__nav-icon" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M7.5 2.5L4 6l3.5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  AI.DatePicker._chevronLeftSmall = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M7.5 2.5L4 6l3.5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  AI.DatePicker._chevronRight = '<svg class="ai-datepicker__nav-icon" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M4.5 2.5L8 6l-3.5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  AI.DatePicker._chevronRightSmall = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M4.5 2.5L8 6l-3.5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  AI.DatePicker.prototype._isOpen = function () {
    return this.options.open !== undefined ? !!this.options.open : this._innerOpen;
  };

  AI.DatePicker.prototype._syncDerived = function () {
    var o = this.options;
    this._selectedDate = !o.range ? AI.DatePicker.parse(typeof this._value === 'string' ? this._value : null) : null;
    this._selectedRange = o.range ? AI.DatePicker.parseRange(this._value) : null;
  };

  AI.DatePicker.prototype._build = function () {
    var o = this.options;
    var self = this;
    this.el.classList.add('ai-datepicker');
    if (o.disabled) this.el.classList.add('ai-datepicker--disabled');
    this._renderTrigger();

    this.el.addEventListener('click', function (e) {
      var clear = e.target.closest('.ai-datepicker__clear');
      if (clear) { e.stopPropagation(); self._handleClear(); return; }
      if (e.target.closest('.ai-datepicker__trigger')) {
        if (!o.disabled && !self._closing) self._setOpen(!self._isOpen());
        return;
      }
      var act = e.target.closest('[data-act]');
      if (act && self._panelEl && self._panelEl.contains(act)) self._handlePanelAction(act);
    });
    this.el.addEventListener('mousedown', function (e) {
      // 面板与清除按钮内按下不转移焦点（对应原版 onMouseDown preventDefault）
      if (e.target.closest && (e.target.closest('.ai-datepicker__panel button') || e.target.closest('.ai-datepicker__clear'))) {
        e.preventDefault();
      }
    });
    this.el.addEventListener('keydown', function (e) { self._handleKeydown(e); });
    // 焦点不在组件内部时（如鼠标点击后焦点落在 body），仍允许 Esc 关闭面板
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape' || !self._isOpen() || self.el.contains(e.target)) return;
      self._closePanel();
    });
    this.el.addEventListener('focusout', function (e) {
      // 仅当焦点明确移出根节点（如 Tab 到外部元素）时关闭；
      // 点击面板空白区域（relatedTarget 为 null）不关闭，外部点击由 mousedown 监听处理
      if (self._isOpen() && e.relatedTarget && !self.el.contains(e.relatedTarget)) self._closePanel();
    });
    this.el.addEventListener('mouseover', function (e) {
      if (!o.range || !self._isOpen() || self._closing) return;
      var cell = e.target.closest('[data-act="day"]');
      if (!cell || !self._panelEl || !self._panelEl.contains(cell)) return;
      self._hoverDate = AI.DatePicker.parse(cell.getAttribute('data-key'));
      self._renderPanel();
    });
    this.el.addEventListener('mouseout', function (e) {
      if (!o.range) return;
      var cell = e.target.closest('[data-act="day"]');
      if (!cell || !self._panelEl || !self._panelEl.contains(cell)) return;
      self._hoverDate = null;
      self._renderPanel();
    });
    document.addEventListener('mousedown', function (e) {
      if (!self._isOpen() || self._closing) return;
      if (!self.el.contains(e.target)) self._closePanel();
    });
  };

  AI.DatePicker.prototype._renderTrigger = function () {
    var o = this.options;
    this._syncDerived();
    var open = this._isOpen();
    var f = function (d) { return AI.DatePicker._format(d, self._format); };
    var self = this;
    var inner = '';
    if (o.range) {
      if (open && this._rangeStart) {
        // 正在选择：实时显示待选的开始与结束日期
        inner += '<span class="ai-datepicker__value">' + f(this._rangeStart) + '</span>';
        inner += '<span class="ai-datepicker__range-divider" aria-hidden="true"></span>';
        inner += this._rangeEnd
          ? '<span class="ai-datepicker__value">' + f(this._rangeEnd) + '</span>'
          : '<span class="ai-datepicker__placeholder">' + AI.DatePicker._esc(o.placeholder) + '</span>';
      } else if (this._selectedRange) {
        inner += '<span class="ai-datepicker__value">' + f(this._selectedRange[0]) + '</span>';
        inner += '<span class="ai-datepicker__range-divider" aria-hidden="true"></span>';
        inner += '<span class="ai-datepicker__value">' + f(this._selectedRange[1]) + '</span>';
      } else {
        inner += '<span class="ai-datepicker__placeholder">' + AI.DatePicker._esc(o.placeholder) + '</span>';
      }
    } else {
      var showValue = this._value || (open && this._pendingDate);
      var text = open && this._pendingDate
        ? f(this._pendingDate)
        : this._selectedDate ? f(this._selectedDate) : o.placeholder;
      inner += '<span class="' + (showValue ? 'ai-datepicker__value' : 'ai-datepicker__placeholder') + '">' +
        AI.DatePicker._esc(text) + '</span>';
    }
    if (o.allowClear && this._value && !o.disabled) {
      inner += '<button type="button" class="ai-datepicker__clear" aria-label="清除日期">×</button>';
    }
    inner += '<span class="ai-datepicker__calendar-icon" aria-hidden="true">' + AI.DatePicker._calendarIcon + '</span>';
    var trigger = '<div class="ai-datepicker__trigger ai-datepicker__trigger--' + (o.size || 'middle') +
      (o.status ? ' ai-datepicker__trigger--' + o.status : '') +
      (open ? ' ai-datepicker__trigger--open' : '') +
      '" role="combobox" aria-expanded="' + open + '" aria-haspopup="dialog"' +
      (open ? ' aria-controls="ai-datepicker-panel-' + this._uid + '"' : '') +
      (o.disabled ? ' aria-disabled="true"' : '') +
      (o.ariaLabel ? ' aria-label="' + AI.DatePicker._esc(o.ariaLabel) + '"' : '') +
      (o.ariaLabelledby ? ' aria-labelledby="' + AI.DatePicker._esc(o.ariaLabelledby) + '"' : '') +
      ' tabindex="' + (o.disabled ? -1 : 0) + '">' + inner + '</div>';
    if (this._triggerEl) {
      var tmp = document.createElement('div');
      tmp.innerHTML = trigger;
      var next = tmp.firstChild;
      this.el.replaceChild(next, this._triggerEl);
      this._triggerEl = next;
    } else {
      this.el.insertAdjacentHTML('afterbegin', trigger);
      this._triggerEl = this.el.querySelector('.ai-datepicker__trigger');
    }
  };

  AI.DatePicker.prototype._navBtn = function (dy, dm, label) {
    var icon = (dy < 0 || dm < 0)
      ? (dy !== 0 ? AI.DatePicker._chevronLeft : AI.DatePicker._chevronLeftSmall)
      : (dy !== 0 ? AI.DatePicker._chevronRight : AI.DatePicker._chevronRightSmall);
    return '<button type="button" class="ai-datepicker__nav-btn" aria-label="' + label +
      '" data-act="nav" data-dy="' + dy + '" data-dm="' + dm + '">' + icon + '</button>';
  };

  AI.DatePicker.prototype._renderDayGrid = function (vDate) {
    var o = this.options;
    var self = this;
    var vMonth = vDate.getMonth();
    var today = AI.DatePicker.today();
    var h = '<div class="ai-datepicker__week-row">';
    AI.DatePicker.WEEKDAYS.forEach(function (w) {
      h += '<div class="ai-datepicker__week-cell">' + w + '</div>';
    });
    h += '</div><div class="ai-datepicker__grid">';
    // 范围模式有效端点：进行中的选择（预览）优先于已选范围
    var effStart = null, effEnd = null;
    if (o.range) {
      if (this._rangeStart) {
        if (this._rangeEnd) {
          effStart = this._rangeStart;
          effEnd = this._rangeEnd;
        } else if (this._hoverDate && this._hoverDate.getTime() < this._rangeStart.getTime()) {
          // 反向预览：悬停日期作为新的潜在起点
          effStart = this._hoverDate;
          effEnd = this._rangeStart;
        } else {
          effStart = this._rangeStart;
          effEnd = this._hoverDate && this._hoverDate.getTime() > this._rangeStart.getTime() ? this._hoverDate : this._rangeStart;
        }
      } else if (this._selectedRange) {
        effStart = this._selectedRange[0];
        effEnd = this._selectedRange[1];
      }
    }
    AI.DatePicker._buildCells(vDate).forEach(function (cell) {
      var disabledCell = o.disabledDate ? o.disabledDate(cell) === true : false;
      var isToday = AI.DatePicker.sameDay(cell, today);
      var outside = cell.getMonth() !== vMonth;
      var selected = false, rangeStartCell = false, rangeEndCell = false, inRange = false;
      if (o.range) {
        if (effStart && effEnd) {
          rangeStartCell = AI.DatePicker.sameDay(cell, effStart);
          rangeEndCell = AI.DatePicker.sameDay(cell, effEnd);
          inRange = cell.getTime() > effStart.getTime() && cell.getTime() < effEnd.getTime();
        }
      } else {
        var activeDate = self._pendingDate || self._selectedDate;
        selected = !!activeDate && AI.DatePicker.sameDay(cell, activeDate);
      }
      var cls = 'ai-datepicker__day-cell';
      if (outside) cls += ' ai-datepicker__day-cell--outside';
      // 范围模式不圈出今天
      if (!o.range && isToday) cls += ' ai-datepicker__day-cell--today';
      if (selected) cls += ' ai-datepicker__day-cell--selected';
      if (rangeStartCell) cls += ' ai-datepicker__day-cell--range-start';
      if (rangeEndCell) cls += ' ai-datepicker__day-cell--range-end';
      if (inRange) cls += ' ai-datepicker__day-cell--in-range';
      if (disabledCell) cls += ' ai-datepicker__day-cell--disabled';
      h += '<button type="button" class="' + cls + '" aria-label="' + cell.getFullYear() + '年' +
        (cell.getMonth() + 1) + '月' + cell.getDate() + '日"' +
        (disabledCell ? ' aria-disabled="true" disabled' : '') +
        ' data-act="day" data-key="' + AI.DatePicker.iso(cell) + '">' + cell.getDate() + '</button>';
    });
    return h + '</div>';
  };

  AI.DatePicker.prototype._renderMonthGrid = function () {
    var self = this;
    var year = this._viewDate.getFullYear();
    var h = '<div class="ai-datepicker__grid-3x4">';
    AI.DatePicker.MONTHS.forEach(function (label, i) {
      var activeDate = self._pendingDate || self._selectedDate;
      var selected = !!activeDate && activeDate.getFullYear() === year && activeDate.getMonth() === i;
      h += '<button type="button" class="ai-datepicker__month-cell' +
        (selected ? ' ai-datepicker__month-cell--selected' : '') +
        '" aria-label="' + (i + 1) + '月" data-act="month" data-m="' + i + '">' + label + '</button>';
    });
    return h + '</div>';
  };

  AI.DatePicker.prototype._renderYearGrid = function () {
    var year = this._viewDate.getFullYear();
    var startYear = Math.floor(year / 10) * 10;
    var h = '<div class="ai-datepicker__grid-3x4">';
    for (var i = 0; i < 12; i++) {
      var y = startYear - 1 + i;
      var selected = !!this._selectedDate && this._selectedDate.getFullYear() === y;
      h += '<button type="button" class="ai-datepicker__year-cell' +
        (selected ? ' ai-datepicker__year-cell--selected' : '') +
        '" aria-label="' + y + '年" data-act="year" data-y="' + y + '">' + y + '</button>';
    }
    return h + '</div>';
  };

  AI.DatePicker.prototype._renderHeader = function () {
    var year = this._viewDate.getFullYear();
    var month = this._viewDate.getMonth();
    var h = '<div class="ai-datepicker__header"><div class="ai-datepicker__header-group">';
    h += this._navBtn(-1, 0, '上一年');
    if (this._mode === 'date') h += this._navBtn(0, -1, '上个月');
    h += '</div>';
    if (this._mode === 'date') {
      h += '<button type="button" class="ai-datepicker__label-btn" data-act="label">' + year + '年' + (month + 1) + '月</button>';
    } else if (this._mode === 'month') {
      h += '<button type="button" class="ai-datepicker__label-btn" data-act="label">' + year + '年</button>';
    } else {
      var startYear = Math.floor(year / 10) * 10;
      h += '<span class="ai-datepicker__year-label">' + startYear + ' - ' + (startYear + 9) + '年</span>';
    }
    h += '<div class="ai-datepicker__header-group">';
    if (this._mode === 'date') h += this._navBtn(0, 1, '下个月');
    h += this._navBtn(1, 0, '下一年');
    h += '</div></div>';
    return h;
  };

  AI.DatePicker.prototype._renderRangePanel = function (panelDate, idx) {
    var h = '<div class="ai-datepicker__range-panel"><div class="ai-datepicker__header">';
    h += '<div class="ai-datepicker__header-group">';
    if (idx === 0) {
      h += this._navBtn(-1, 0, '上一年');
      h += this._navBtn(0, -1, '上个月');
    }
    h += '</div>';
    h += '<span class="ai-datepicker__year-label">' + panelDate.getFullYear() + '年' +
      (panelDate.getMonth() + 1) + '月</span>';
    h += '<div class="ai-datepicker__header-group">';
    if (idx === 1) {
      h += this._navBtn(0, 1, '下个月');
      h += this._navBtn(1, 0, '下一年');
    }
    h += '</div></div>';
    h += this._renderDayGrid(panelDate);
    h += '</div>';
    return h;
  };

  AI.DatePicker.prototype._renderPanelBody = function () {
    var o = this.options;
    var h = '';
    if (o.range) {
      var second = AI.DatePicker.addMonthsKeep(AI.DatePicker.firstOfMonth(this._viewDate), 1);
      h += '<div class="ai-datepicker__range-panels">';
      h += this._renderRangePanel(this._viewDate, 0);
      h += this._renderRangePanel(second, 1);
      h += '</div>';
      h += '<div class="ai-datepicker__footer">' +
        '<button type="button" class="ai-datepicker__confirm-btn" data-act="confirm">确定</button></div>';
      return h;
    }
    h += this._renderHeader();
    if (this._mode === 'date') h += this._renderDayGrid(this._viewDate);
    if (this._mode === 'month') h += this._renderMonthGrid();
    if (this._mode === 'year') h += this._renderYearGrid();
    if (this._mode === 'date' || (o.picker === 'month' && this._mode === 'month')) {
      h += '<div class="ai-datepicker__footer">';
      if (o.showToday) h += '<button type="button" class="ai-datepicker__today-btn" data-act="today">今天</button>';
      h += '<button type="button" class="ai-datepicker__confirm-btn" data-act="confirm">确定</button>';
      h += '</div>';
    }
    return h;
  };

  /** 面板定位：优先向下展开，下方空间不足且上方更宽裕时向上翻转；右侧不足时右对齐 */
  AI.DatePicker.prototype._positionPanel = function () {
    if (!this._panelEl || !this._triggerEl) return;
    var o = this.options;
    var rect = this._triggerEl.getBoundingClientRect();
    var viewportHeight = window.innerHeight;
    var panelHeight = 340;
    var top = null, bottom = null, marginTop = '0', marginBottom = '0';
    if (rect.bottom + panelHeight > viewportHeight && rect.top > viewportHeight - rect.bottom) {
      bottom = '100%';
      marginBottom = '6px';
    } else {
      top = '100%';
      marginTop = '6px';
    }
    var left = '0', right = 'auto';
    if (rect.left + (o.range ? 620 : 300) > window.innerWidth) {
      right = '0';
      left = 'auto';
    }
    var s = this._panelEl.style;
    s.top = top || 'auto';
    s.bottom = bottom || 'auto';
    s.left = left;
    s.right = right;
    s.marginTop = marginTop;
    s.marginBottom = marginBottom;
  };

  AI.DatePicker.prototype._renderPanel = function () {
    var o = this.options;
    var self = this;
    if (!this._panelEl) {
      var panel = document.createElement('div');
      panel.id = 'ai-datepicker-panel-' + this._uid;
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-label', o.range ? '选择日期范围' : '选择日期');
      this.el.appendChild(panel);
      this._panelEl = panel;
      this._mounted = false;
      requestAnimationFrame(function () {
        self._mounted = true;
        if (self._panelEl && !self._closing) self._panelEl.classList.add('ai-datepicker__panel--visible');
      });
    }
    var cls = 'ai-datepicker__panel' + (o.range ? ' ai-datepicker__panel--range' : '');
    if (this._closing) cls += ' ai-datepicker__panel--closing';
    else if (this._mounted) cls += ' ai-datepicker__panel--visible';
    this._panelEl.className = cls;
    if (!this._positioned) {
      this._positionPanel();
      this._positioned = true;
    }
    this._panelEl.innerHTML = this._renderPanelBody();
  };

  AI.DatePicker.prototype._showPanel = function () {
    var o = this.options;
    // 重新展开：取消未完成的退场动画
    if (this._closeTimer) {
      clearTimeout(this._closeTimer);
      this._closeTimer = null;
    }
    this._closing = false;
    // 每次展开把面板视图重置到当前选中值（无选中则回到今天）
    var base;
    if (o.range) {
      var r = AI.DatePicker.parseRange(this._value);
      base = (r && r[0]) || AI.DatePicker.today();
    } else {
      base = AI.DatePicker.parse(typeof this._value === 'string' ? this._value : null) || AI.DatePicker.today();
    }
    this._viewDate = base;
    this._focusedDate = base;
    this._mode = o.picker === 'month' && !o.range ? 'month' : 'date';
    this._rangeStart = null;
    this._rangeEnd = null;
    this._hoverDate = null;
    this._pendingDate = null;
    this._positioned = false;
    this._renderTrigger();
    this._renderPanel();
  };

  /** 统一关闭入口：先播放退场动效，动画结束后再卸载面板 */
  AI.DatePicker.prototype._closePanel = function () {
    if (this._closing) return;
    var o = this.options;
    var self = this;
    this._closing = true;
    if (this._panelEl) {
      this._panelEl.classList.remove('ai-datepicker__panel--visible');
      this._panelEl.classList.add('ai-datepicker__panel--closing');
    }
    this._closeTimer = setTimeout(function () {
      self._closing = false;
      self._closeTimer = null;
      if (o.open === undefined) self._innerOpen = false;
      self._mounted = false;
      if (self._panelEl) {
        self._panelEl.remove();
        self._panelEl = null;
      }
      self._rangeStart = null;
      self._rangeEnd = null;
      self._hoverDate = null;
      self._pendingDate = null;
      self._renderTrigger();
      if (o.onOpenChange) o.onOpenChange(false);
    }, AI.DatePicker.CLOSE_ANIMATION_MS);
  };

  AI.DatePicker.prototype._setOpen = function (next) {
    var o = this.options;
    if (o.open === undefined) this._innerOpen = next;
    if (o.onOpenChange) o.onOpenChange(next);
    if (next) this._showPanel();
  };

  AI.DatePicker.prototype._selectDate = function (date) {
    var o = this.options;
    if (!date) return;
    if (o.disabledDate && o.disabledDate(date)) return;
    if (!o.range) {
      // 点选日期：仅更新待选值，点击「确定」后才提交并关闭
      this._pendingDate = date;
      this._renderPanel();
      this._renderTrigger();
      return;
    }
    // 范围模式：第一次点击确定开始日期，第二次点击确定结束日期
    if (!this._rangeStart) {
      this._rangeStart = date;
    } else if (date.getTime() < this._rangeStart.getTime()) {
      // 第二次点击早于开始日期：以它作为新的开始日期
      this._rangeStart = date;
    } else {
      this._rangeEnd = date;
    }
    this._renderPanel();
    this._renderTrigger();
  };

  AI.DatePicker.prototype._shiftView = function (yearDelta, monthDelta) {
    var d = this._viewDate;
    this._viewDate = new Date(d.getFullYear() + yearDelta, d.getMonth() + monthDelta, 1);
    this._renderPanel();
  };

  AI.DatePicker.prototype._handleToday = function () {
    var o = this.options;
    var today = AI.DatePicker.today();
    if (!o.range) {
      // 单日期模式：跳转到今天所在月份，并把今天设为待选日期
      this._viewDate = AI.DatePicker.firstOfMonth(today);
      this._focusedDate = today;
      this._mode = o.picker === 'month' ? 'month' : 'date';
      this._pendingDate = today;
    } else {
      // 范围模式：「今天」仅负责把视图跳转到今天所在月份
      this._viewDate = AI.DatePicker.firstOfMonth(today);
      this._focusedDate = today;
      this._rangeStart = null;
      this._rangeEnd = null;
    }
    this._renderPanel();
    this._renderTrigger();
  };

  /** 确定：提交待选值并关闭面板；无待选值（或范围不完整）时仅关闭 */
  AI.DatePicker.prototype._confirmTime = function () {
    var o = this.options;
    if (!o.range) {
      if (this._pendingDate) {
        var next = o.picker === 'month'
          ? AI.DatePicker.isoMonth(this._pendingDate)
          : AI.DatePicker.iso(this._pendingDate);
        if (!this._controlled) this._value = next;
        if (o.onChange) o.onChange(next);
      }
      this._closePanel();
      this._focusTrigger();
      return;
    }
    if (this._rangeStart && this._rangeEnd) {
      var next = [AI.DatePicker.iso(this._rangeStart), AI.DatePicker.iso(this._rangeEnd)];
      if (!this._controlled) this._value = next;
      if (o.onChange) o.onChange(next);
    }
    this._closePanel();
    this._focusTrigger();
  };

  AI.DatePicker.prototype._handleClear = function () {
    var o = this.options;
    if (!this._controlled) this._value = null;
    if (o.onChange) o.onChange(null);
    this._renderTrigger();
    this._focusTrigger();
  };

  AI.DatePicker.prototype._handlePanelAction = function (btn) {
    var o = this.options;
    var act = btn.getAttribute('data-act');
    if (act === 'day') {
      this._selectDate(AI.DatePicker.parse(btn.getAttribute('data-key')));
      return;
    }
    if (act === 'nav') {
      this._shiftView(Number(btn.getAttribute('data-dy')) || 0, Number(btn.getAttribute('data-dm')) || 0);
      return;
    }
    if (act === 'label') {
      this._mode = 'year';
      this._renderPanel();
      return;
    }
    if (act === 'today') {
      this._handleToday();
      return;
    }
    if (act === 'confirm') {
      this._confirmTime();
      return;
    }
    if (act === 'month') {
      var i = Number(btn.getAttribute('data-m'));
      var picked = new Date(this._viewDate.getFullYear(), i, 1);
      if (o.picker === 'month' && !o.range) {
        // 月份选择模式：点击即设为待选月份
        this._pendingDate = picked;
      } else {
        this._viewDate = picked;
        this._focusedDate = picked;
        this._mode = 'date';
      }
      this._renderPanel();
      this._renderTrigger();
      return;
    }
    if (act === 'year') {
      var y = Number(btn.getAttribute('data-y'));
      var picked = new Date(y, this._viewDate.getMonth(), 1);
      this._viewDate = picked;
      this._focusedDate = picked;
      this._mode = 'month';
      this._renderPanel();
    }
  };

  AI.DatePicker.prototype._handleKeydown = function (e) {
    var o = this.options;
    if (o.disabled) return;
    var key = e.key;
    if (!this._isOpen()) {
      if (key === 'Enter' || key === ' ' || key === 'ArrowDown' || key === 'ArrowUp') {
        e.preventDefault();
        this._setOpen(true);
      }
      return;
    }
    if (key === 'Escape') {
      e.preventDefault();
      this._closePanel();
      this._focusTrigger();
      return;
    }
    if (key === 'Enter' || key === ' ') {
      e.preventDefault();
      if (this._mode === 'date') {
        if (o.disabledDate && o.disabledDate(this._focusedDate)) return;
        if (o.range) {
          // 范围模式：回车依次确定开始日期与结束日期（待选）
          if (!this._rangeStart) this._rangeStart = this._focusedDate;
          else if (this._focusedDate.getTime() < this._rangeStart.getTime()) this._rangeStart = this._focusedDate;
          else this._rangeEnd = this._focusedDate;
          this._renderPanel();
          this._renderTrigger();
          return;
        }
        this._pendingDate = this._focusedDate;
        this._renderPanel();
        this._renderTrigger();
      } else if (this._mode === 'month') {
        if (o.picker === 'month' && !o.range) {
          // 月份选择模式：回车设为待选月份
          this._pendingDate = AI.DatePicker.firstOfMonth(this._viewDate);
        } else {
          this._viewDate = AI.DatePicker.firstOfMonth(this._viewDate);
          this._focusedDate = this._viewDate;
          this._mode = 'date';
        }
        this._renderPanel();
        this._renderTrigger();
      } else {
        this._focusedDate = AI.DatePicker.firstOfMonth(this._viewDate);
        this._mode = 'month';
        this._renderPanel();
      }
      return;
    }
    if (key === 'ArrowLeft' || key === 'ArrowRight' || key === 'ArrowUp' || key === 'ArrowDown') {
      e.preventDefault();
      var delta = key === 'ArrowLeft' ? -1 : key === 'ArrowRight' ? 1 : key === 'ArrowUp' ? -7 : 7;
      if (this._mode === 'date') {
        var next = AI.DatePicker.addDays(this._focusedDate, delta);
        this._focusedDate = next;
        if (!AI.DatePicker.sameMonth(next, this._viewDate)) {
          this._viewDate = AI.DatePicker.firstOfMonth(next);
          this._renderPanel();
        }
      } else if (this._mode === 'month') {
        this._viewDate = AI.DatePicker.addMonthsKeep(this._viewDate, delta);
        this._focusedDate = AI.DatePicker.firstOfMonth(this._viewDate);
        this._renderPanel();
      } else {
        this._viewDate = AI.DatePicker.addMonthsKeep(this._viewDate, delta * 12);
        this._focusedDate = AI.DatePicker.firstOfMonth(this._viewDate);
        this._renderPanel();
      }
      return;
    }
    if (key === 'PageUp' || key === 'PageDown') {
      e.preventDefault();
      var d = key === 'PageUp' ? -1 : 1;
      if (this._mode === 'date') {
        var vd = AI.DatePicker.addMonthsKeep(this._viewDate, d);
        this._viewDate = AI.DatePicker.firstOfMonth(vd);
        // 保留原日数（溢出时按原生行为进位，对应 dayjs .date(n)）
        this._focusedDate = new Date(vd.getFullYear(), vd.getMonth(), this._focusedDate.getDate());
      } else if (this._mode === 'month') {
        this._viewDate = AI.DatePicker.firstOfMonth(AI.DatePicker.addMonthsKeep(this._viewDate, d * 12));
        this._focusedDate = this._viewDate;
      } else {
        this._viewDate = AI.DatePicker.firstOfMonth(AI.DatePicker.addMonthsKeep(this._viewDate, d * 120));
        this._focusedDate = this._viewDate;
      }
      this._renderPanel();
    }
  };

  AI.DatePicker.prototype._focusTrigger = function () {
    if (this._triggerEl) this._triggerEl.focus();
  };

  /** 受控 value / open 变化后调用 */
  AI.DatePicker.prototype.update = function (patch) {
    var o = this.options;
    if (patch) Object.assign(o, patch);
    this._controlled = o.value !== undefined;
    if (this._controlled) this._value = o.value;
    if (o.disabled) this.el.classList.add('ai-datepicker--disabled');
    else this.el.classList.remove('ai-datepicker--disabled');
    var openNow = this._isOpen();
    if (openNow && !this._panelEl) this._showPanel();
    else if (!openNow && this._panelEl && !this._closing) {
      this._panelEl.remove();
      this._panelEl = null;
      this._mounted = false;
    }
    this._renderTrigger();
  };

  AI.DatePicker.prototype.destroy = function () {
    if (this._closeTimer) clearTimeout(this._closeTimer);
    if (this._panelEl) this._panelEl.remove();
    this.el.classList.remove('ai-datepicker', 'ai-datepicker--disabled');
    delete this.el._aiDatePicker;
  };

  /* ============================================
     TimePicker 时间选择
     触发区与 DatePicker 同款；面板为时/分(/秒)滚轮列，
     待选值实时回显，点击「确定」提交、「此刻」快捷取当前时间
     ============================================ */
  AI.TimePicker = function (el, options) {
    // 构造函数必须最先赋值：后面的 prototype 方法挂载依赖它已存在
    var o = this.options = Object.assign({
      value: undefined,
      defaultValue: null,
      onChange: null,
      placeholder: '请选择时间',
      disabled: false,
      allowClear: false,
      size: 'middle',
      status: null,
      format: 'HH:mm:ss',
      hourStep: 1,
      minuteStep: 1,
      secondStep: 1,
      open: undefined,
      onOpenChange: null,
      ariaLabel: null,
      ariaLabelledby: null
    }, options || {});
    this.el = el;
    el._aiTimePicker = this;
    this._uid = ++AI.TimePicker._uidSeed;
    this._controlled = o.value !== undefined;
    this._value = this._controlled ? o.value : (o.defaultValue != null ? o.defaultValue : null);
    this._innerOpen = false;
    this._pending = null;
    this._mounted = false;
    this._closing = false;
    this._closeTimer = null;
    this._panelEl = null;
    this._triggerEl = null;
    this._positioned = false;
    this._build();
  };

  AI.TimePicker._uidSeed = 0;
  AI.TimePicker.CLOSE_ANIMATION_MS = 200;
  /** 滚动居中用的条目步进：条目高 28px + 间距 10px */
  AI.TimePicker.ITEM_HEIGHT = 38;

  AI.TimePicker._pad2 = function (n) {
    return (n < 10 ? '0' : '') + n;
  };

  AI.TimePicker._esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  /** 解析 HH:mm 或 HH:mm:ss（秒段可省略），越界返回 null */
  AI.TimePicker.parse = function (value) {
    if (!value) return null;
    var m = /^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/.exec(String(value));
    if (!m) return null;
    var h = +m[1], min = +m[2], s = m[3] === undefined ? 0 : +m[3];
    if (h > 23 || min > 59 || s > 59) return null;
    return { h: h, m: min, s: s };
  };

  AI.TimePicker.toValue = function (part) {
    return AI.TimePicker._pad2(part.h) + ':' + AI.TimePicker._pad2(part.m) + ':' + AI.TimePicker._pad2(part.s);
  };

  /** format 是否含秒段（去掉 [字面量] 后检查 ss） */
  AI.TimePicker.hasSeconds = function (format) {
    return /ss/.test(String(format || '').replace(/\[[^\]]*\]/g, ''));
  };

  /** 模板格式化：支持 HH / H / hh / h / mm / m / ss / s / A / a 与 [字面量] */
  AI.TimePicker.formatTime = function (part, format) {
    var lits = [];
    var out = String(format).replace(/\[[^\]]*\]/g, function (m) {
      lits.push(m.slice(1, -1));
      return '\u0001' + (lits.length - 1) + '\u0001';
    });
    var h12 = part.h % 12 === 0 ? 12 : part.h % 12;
    var map = {
      HH: AI.TimePicker._pad2(part.h),
      H: String(part.h),
      hh: AI.TimePicker._pad2(h12),
      h: String(h12),
      mm: AI.TimePicker._pad2(part.m),
      m: String(part.m),
      ss: AI.TimePicker._pad2(part.s),
      s: String(part.s),
      A: part.h < 12 ? 'AM' : 'PM',
      a: part.h < 12 ? 'am' : 'pm'
    };
    out = out.replace(/HH|H|hh|h|mm|m|ss|s|A|a/g, function (t) { return map[t]; });
    return out.replace(/\u0001(\d+)\u0001/g, function (_, i) { return lits[+i]; });
  };

  AI.TimePicker._steps = function (total, step) {
    var s = Math.max(1, step);
    var arr = [];
    for (var i = 0; i < total; i++) {
      if (i % s === 0) arr.push(i);
    }
    return arr;
  };

  AI.TimePicker._clockIcon =
    '<svg width="14" height="14" viewBox="0 0 14 14" fill="none">' +
    '<circle cx="7" cy="7" r="5.5" stroke="currentColor" stroke-width="1.4"/>' +
    '<path d="M7 4.2V7l2 1.2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' +
    '</svg>';

  AI.TimePicker.prototype._isOpen = function () {
    return this.options.open !== undefined ? !!this.options.open : this._innerOpen;
  };

  AI.TimePicker.prototype._build = function () {
    var o = this.options;
    var self = this;
    this.el.classList.add('ai-timepicker');
    if (o.disabled) this.el.classList.add('ai-timepicker--disabled');
    this._renderTrigger();

    this.el.addEventListener('click', function (e) {
      var clear = e.target.closest('.ai-timepicker__clear');
      if (clear) { e.stopPropagation(); self._handleClear(); return; }
      if (e.target.closest('.ai-timepicker__trigger')) {
        if (!o.disabled && !self._closing) self._setOpen(!self._isOpen());
        return;
      }
      var act = e.target.closest('[data-act]');
      if (act && self._panelEl && self._panelEl.contains(act)) self._handlePanelAction(act);
    });
    this.el.addEventListener('mousedown', function (e) {
      if (e.target.closest && (e.target.closest('.ai-timepicker__panel button') || e.target.closest('.ai-timepicker__clear'))) {
        e.preventDefault();
      }
    });
    this.el.addEventListener('keydown', function (e) { self._handleKeydown(e); });
    // 焦点不在组件内部时（如鼠标点击后焦点落在 body），仍允许 Esc 关闭面板
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape' || !self._isOpen() || self.el.contains(e.target)) return;
      self._closePanel();
    });
    this.el.addEventListener('focusout', function (e) {
      if (self._isOpen() && e.relatedTarget && !self.el.contains(e.relatedTarget)) self._closePanel();
    });
    document.addEventListener('mousedown', function (e) {
      if (!self._isOpen() || self._closing) return;
      if (!self.el.contains(e.target)) self._closePanel();
    });
  };

  AI.TimePicker.prototype._renderTrigger = function () {
    var o = this.options;
    var open = this._isOpen();
    var parsed = AI.TimePicker.parse(this._value);
    var text = open && this._pending
      ? AI.TimePicker.formatTime(this._pending, o.format)
      : parsed ? AI.TimePicker.formatTime(parsed, o.format) : o.placeholder;
    var inner = '<span class="' + (this._value ? 'ai-timepicker__value' : 'ai-timepicker__placeholder') + '">' +
      AI.TimePicker._esc(text) + '</span>';
    if (o.allowClear && this._value && !o.disabled) {
      inner += '<button type="button" class="ai-timepicker__clear" aria-label="清除时间">×</button>';
    }
    inner += '<span class="ai-timepicker__clock-icon" aria-hidden="true">' + AI.TimePicker._clockIcon + '</span>';
    var trigger = '<div class="ai-timepicker__trigger ai-timepicker__trigger--' + (o.size || 'middle') +
      (o.status ? ' ai-timepicker__trigger--' + o.status : '') +
      (open ? ' ai-timepicker__trigger--open' : '') +
      '" role="combobox" aria-expanded="' + open + '" aria-haspopup="dialog"' +
      (open ? ' aria-controls="ai-timepicker-panel-' + this._uid + '"' : '') +
      (o.disabled ? ' aria-disabled="true"' : '') +
      (o.ariaLabel ? ' aria-label="' + AI.TimePicker._esc(o.ariaLabel) + '"' : '') +
      (o.ariaLabelledby ? ' aria-labelledby="' + AI.TimePicker._esc(o.ariaLabelledby) + '"' : '') +
      ' tabindex="' + (o.disabled ? -1 : 0) + '">' + inner + '</div>';
    if (this._triggerEl) {
      var tmp = document.createElement('div');
      tmp.innerHTML = trigger;
      var next = tmp.firstChild;
      this.el.replaceChild(next, this._triggerEl);
      this._triggerEl = next;
    } else {
      this.el.insertAdjacentHTML('afterbegin', trigger);
      this._triggerEl = this.el.querySelector('.ai-timepicker__trigger');
    }
  };

  AI.TimePicker.prototype._renderColumn = function (col, title, values, active, unit) {
    var h = '<div class="ai-timepicker__column">' +
      '<div class="ai-timepicker__column-title">' + title + '</div>' +
      '<div class="ai-timepicker__column-list" data-col="' + col + '">';
    values.forEach(function (n) {
      h += '<button type="button" class="ai-timepicker__option' +
        (active === n ? ' ai-timepicker__option--selected' : '') +
        '" aria-label="' + n + ' ' + unit +
        '" data-act="unit" data-col="' + col + '" data-v="' + n + '">' +
        AI.TimePicker._pad2(n) + '</button>';
    });
    return h + '</div></div>';
  };

  AI.TimePicker.prototype._renderPanelBody = function () {
    var o = this.options;
    var base = this._pending || { h: 0, m: 0, s: 0 };
    var h = '<div class="ai-timepicker__columns">';
    h += this._renderColumn('h', '时', AI.TimePicker._steps(24, o.hourStep), base.h, '时');
    h += this._renderColumn('m', '分', AI.TimePicker._steps(60, o.minuteStep), base.m, '分');
    if (AI.TimePicker.hasSeconds(o.format)) {
      h += this._renderColumn('s', '秒', AI.TimePicker._steps(60, o.secondStep), base.s, '秒');
    }
    h += '</div>';
    h += '<div class="ai-timepicker__footer">' +
      '<button type="button" class="ai-timepicker__footer-btn" data-act="now">此刻</button>' +
      '<button type="button" class="ai-timepicker__confirm-btn" data-act="confirm">确定</button>' +
      '</div>';
    return h;
  };

  AI.TimePicker.prototype._positionPanel = function () {
    if (!this._panelEl || !this._triggerEl) return;
    var rect = this._triggerEl.getBoundingClientRect();
    var viewportHeight = window.innerHeight;
    var panelHeight = 320;
    var top = null, bottom = null, marginTop = '0', marginBottom = '0';
    if (rect.bottom + panelHeight > viewportHeight && rect.top > viewportHeight - rect.bottom) {
      bottom = '100%';
      marginBottom = '6px';
    } else {
      top = '100%';
      marginTop = '6px';
    }
    var left = '0', right = 'auto';
    if (rect.left + 260 > window.innerWidth) {
      right = '0';
      left = 'auto';
    }
    var s = this._panelEl.style;
    s.top = top || 'auto';
    s.bottom = bottom || 'auto';
    s.left = left;
    s.right = right;
    s.marginTop = marginTop;
    s.marginBottom = marginBottom;
  };

  AI.TimePicker.prototype._renderPanel = function () {
    var o = this.options;
    var self = this;
    if (!this._panelEl) {
      var panel = document.createElement('div');
      panel.id = 'ai-timepicker-panel-' + this._uid;
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-label', '选择时间');
      this.el.appendChild(panel);
      this._panelEl = panel;
      this._mounted = false;
      requestAnimationFrame(function () {
        self._mounted = true;
        if (self._panelEl && !self._closing) self._panelEl.classList.add('ai-timepicker__panel--visible');
      });
    }
    var cls = 'ai-timepicker__panel';
    if (!AI.TimePicker.hasSeconds(o.format)) cls += ' ai-timepicker__panel--no-seconds';
    if (this._closing) cls += ' ai-timepicker__panel--closing';
    else if (this._mounted) cls += ' ai-timepicker__panel--visible';
    this._panelEl.className = cls;
    if (!this._positioned) {
      this._positionPanel();
      this._positioned = true;
    }
    this._panelEl.innerHTML = this._renderPanelBody();
  };

  /** 列滚动定位：让当前选中项落在列可视区中部 */
  AI.TimePicker.prototype._centerList = function (list, unit, step) {
    if (!list) return;
    var index = Math.floor(unit / Math.max(1, step));
    var first = list.firstElementChild;
    // 行距按实际 DOM 测量：静态值 38 与 CSS（28px 项 + 2px gap）不一致，写死会让选中项偏离中心
    var pitch = AI.TimePicker.ITEM_HEIGHT;
    if (first && first.nextElementSibling) {
      pitch = (first.nextElementSibling.offsetTop - first.offsetTop) || pitch;
    }
    var itemHeight = first ? first.offsetHeight : 28;
    list.scrollTop = index * pitch - list.clientHeight / 2 + itemHeight / 2;
  };

  AI.TimePicker.prototype._centerColumns = function () {
    if (!this._panelEl) return;
    var o = this.options;
    var part = this._pending || { h: 0, m: 0, s: 0 };
    this._centerList(this._panelEl.querySelector('[data-col="h"]'), part.h, o.hourStep);
    this._centerList(this._panelEl.querySelector('[data-col="m"]'), part.m, o.minuteStep);
    if (AI.TimePicker.hasSeconds(o.format)) {
      this._centerList(this._panelEl.querySelector('[data-col="s"]'), part.s, o.secondStep);
    }
  };

  AI.TimePicker.prototype._showPanel = function () {
    var o = this.options;
    if (this._closeTimer) {
      clearTimeout(this._closeTimer);
      this._closeTimer = null;
    }
    this._closing = false;
    this._pending = AI.TimePicker.parse(this._value) || { h: 0, m: 0, s: 0 };
    this._positioned = false;
    this._renderTrigger();
    this._renderPanel();
    this._centerColumns();
  };

  AI.TimePicker.prototype._closePanel = function () {
    if (this._closing) return;
    var o = this.options;
    var self = this;
    this._closing = true;
    if (this._panelEl) {
      this._panelEl.classList.remove('ai-timepicker__panel--visible');
      this._panelEl.classList.add('ai-timepicker__panel--closing');
    }
    this._closeTimer = setTimeout(function () {
      self._closing = false;
      self._closeTimer = null;
      if (o.open === undefined) self._innerOpen = false;
      self._mounted = false;
      if (self._panelEl) {
        self._panelEl.remove();
        self._panelEl = null;
      }
      self._pending = null;
      self._renderTrigger();
      if (o.onOpenChange) o.onOpenChange(false);
    }, AI.TimePicker.CLOSE_ANIMATION_MS);
  };

  AI.TimePicker.prototype._setOpen = function (next) {
    var o = this.options;
    if (o.open === undefined) this._innerOpen = next;
    if (o.onOpenChange) o.onOpenChange(next);
    if (next) this._showPanel();
  };

  /** 点选列项：更新待选值并实时回显到触发区 */
  AI.TimePicker.prototype._pickUnit = function (col, value) {
    var base = this._pending || { h: 0, m: 0, s: 0 };
    if (col === 'h') this._pending = { h: value, m: base.m, s: base.s };
    else if (col === 'm') this._pending = { h: base.h, m: value, s: base.s };
    else this._pending = { h: base.h, m: base.m, s: value };
    this._renderPanel();
    // 面板重建会把列表滚动位置清零，重绘后需重新定位，否则选中项跑出可视区
    this._centerColumns();
    this._renderTrigger();
  };

  AI.TimePicker.prototype._confirmTime = function () {
    var o = this.options;
    if (!this._pending) return;
    var next = AI.TimePicker.toValue(this._pending);
    if (next !== this._value) {
      if (!this._controlled) this._value = next;
      if (o.onChange) o.onChange(next);
    }
    this._closePanel();
    this._focusTrigger();
  };

  AI.TimePicker.prototype._handleClear = function () {
    var o = this.options;
    if (!this._controlled) this._value = null;
    if (o.onChange) o.onChange(null);
    this._renderTrigger();
    this._focusTrigger();
  };

  AI.TimePicker.prototype._handlePanelAction = function (btn) {
    var act = btn.getAttribute('data-act');
    if (act === 'unit') {
      this._pickUnit(btn.getAttribute('data-col'), Number(btn.getAttribute('data-v')));
      return;
    }
    if (act === 'now') {
      var now = new Date();
      this._pending = { h: now.getHours(), m: now.getMinutes(), s: now.getSeconds() };
      this._renderPanel();
      this._centerColumns();
      this._renderTrigger();
      return;
    }
    if (act === 'confirm') this._confirmTime();
  };

  AI.TimePicker.prototype._handleKeydown = function (e) {
    var o = this.options;
    if (o.disabled) return;
    var key = e.key;
    if (!this._isOpen()) {
      if (key === 'Enter' || key === ' ' || key === 'ArrowDown' || key === 'ArrowUp') {
        e.preventDefault();
        this._setOpen(true);
      }
      return;
    }
    if (key === 'Escape') {
      e.preventDefault();
      this._closePanel();
      this._focusTrigger();
      return;
    }
    if (key === 'Enter' || key === ' ') {
      e.preventDefault();
      this._confirmTime();
    }
  };

  AI.TimePicker.prototype._focusTrigger = function () {
    if (this._triggerEl) this._triggerEl.focus();
  };

  /** 受控 value / open 变化后调用 */
  AI.TimePicker.prototype.update = function (patch) {
    var o = this.options;
    if (patch) Object.assign(o, patch);
    this._controlled = o.value !== undefined;
    if (this._controlled) this._value = o.value;
    if (o.disabled) this.el.classList.add('ai-timepicker--disabled');
    else this.el.classList.remove('ai-timepicker--disabled');
    var openNow = this._isOpen();
    if (openNow && !this._panelEl) this._showPanel();
    else if (!openNow && this._panelEl && !this._closing) {
      this._panelEl.remove();
      this._panelEl = null;
      this._mounted = false;
    }
    this._renderTrigger();
  };

  AI.TimePicker.prototype.destroy = function () {
    if (this._closeTimer) clearTimeout(this._closeTimer);
    if (this._panelEl) this._panelEl.remove();
    this.el.classList.remove('ai-timepicker', 'ai-timepicker--disabled');
    delete this.el._aiTimePicker;
  };

  /* ============================================
     Calendar 日历
     轻量月面板：容器与 DatePicker 同源（奶油卡片 + 青绿主色）
     面板尺寸完全由宽度推导：组件测量自身宽度后下发 --animal-calendar-scale
     （= 实际宽度 / 基准宽度 750），下面所有度量都是「基准值 × 系数」
     事项条用绝对定位叠加层渲染：跨天切段、每行最多 2 条、超出折叠 +N
     ============================================ */
  AI.Calendar = function (el, options) {
    // 构造函数必须最先赋值：后面的 prototype 方法挂载依赖它已存在
    var o = this.options = Object.assign({
      value: undefined,
      defaultValue: null,
      panelValue: undefined,
      defaultPanelValue: null,
      onChange: null,
      onPanelChange: null,
      events: [],
      showEventTime: true,
      draggableEvents: false,
      onEventCreate: null,
      width: null,
      ariaLabel: null,
      ariaLabelledby: null
    }, options || {});
    this.el = el;
    el._aiCalendar = this;
    if (o.ariaLabel) el.setAttribute('aria-label', o.ariaLabel);
    if (o.ariaLabelledby) el.setAttribute('aria-labelledby', o.ariaLabelledby);
    this._controlled = o.value !== undefined;
    var today = AI.Calendar.today();
    this._innerValue = o.defaultValue != null ? o.defaultValue : AI.Calendar.iso(today);
    this._panelControlled = o.panelValue !== undefined;
    this._innerPanel = AI.Calendar.parseMonth(o.defaultPanelValue) ||
      AI.Calendar.parseDate(o.defaultValue) || AI.Calendar.parseDate(o.value) || today;
    this._focusCursor = AI.Calendar.parseDate(this._selectedValue()) || today;
    this._lastSelected = this._selectedValue() || '';
    this._dragging = false;
    this._dragAnchor = null;
    this._dragHead = null;
    this._measuredWidth = 0;
    this._pendingFocus = false;
    this._build();
  };

  /** 布局基准：所有度量 = 基准值 × scale（scale = 实际宽度 / width） */
  AI.Calendar.LAYOUT_BASE = { width: 750, header: 32, cellHeight: 104, numberBand: 42, eventRow: 22 };
  AI.Calendar.MIN_SCALE = 0.6;
  AI.Calendar.MAX_SCALE = 2;
  AI.Calendar.MAX_EVENT_ROWS = 2;
  AI.Calendar.COLS = 7;
  AI.Calendar.GRID_CELLS = 42;
  AI.Calendar.WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

  AI.Calendar._pad2 = function (n) {
    return (n < 10 ? '0' : '') + n;
  };

  AI.Calendar._esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  /** 解析 'YYYY-MM-DD' / 'YYYY-M-D' / 'YYYY-MM-DD HH:mm' 或 Date；非法返回 null */
  AI.Calendar.parseDate = function (value) {
    if (!value) return null;
    if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
    var m = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[ T](\d{1,2}):(\d{1,2}))?$/.exec(String(value));
    if (!m) return null;
    var y = +m[1], mo = +m[2], d = +m[3];
    var date = new Date(y, mo - 1, d, m[4] ? +m[4] : 0, m[5] ? +m[5] : 0);
    if (date.getFullYear() !== y || date.getMonth() !== mo - 1 || date.getDate() !== d) return null;
    return date;
  };

  /** 解析 'YYYY-MM'，补 '-01' 后按日期解析；非法返回 null */
  AI.Calendar.parseMonth = function (value) {
    if (!value) return null;
    var m = /^(\d{4})-(\d{1,2})$/.exec(String(value));
    if (!m) return null;
    return AI.Calendar.parseDate(m[1] + '-' + m[2] + '-01');
  };

  AI.Calendar.iso = function (d) {
    return d.getFullYear() + '-' + AI.Calendar._pad2(d.getMonth() + 1) + '-' + AI.Calendar._pad2(d.getDate());
  };

  AI.Calendar.isoMonth = function (d) {
    return d.getFullYear() + '-' + AI.Calendar._pad2(d.getMonth() + 1);
  };

  AI.Calendar.sameDay = function (a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  };

  AI.Calendar.today = function () {
    return new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
  };

  AI.Calendar.firstOfMonth = function (d) {
    return new Date(d.getFullYear(), d.getMonth(), 1);
  };

  AI.Calendar.addDays = function (d, n) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  };

  /** 月份加法：保留日期并夹取到目标月天数 */
  AI.Calendar.addMonthsKeep = function (d, n) {
    var dim = new Date(d.getFullYear(), d.getMonth() + n + 1, 0).getDate();
    return new Date(d.getFullYear(), d.getMonth() + n, Math.min(d.getDate(), dim));
  };

  AI.Calendar.daysInMonth = function (y, m0) {
    return new Date(y, m0 + 1, 0).getDate();
  };

  /** 事件起始时间展示 HH:mm */
  AI.Calendar._hm = function (value) {
    var d = value instanceof Date ? value : AI.Calendar.parseDate(value);
    if (!d) return '';
    return AI.Calendar._pad2(d.getHours()) + ':' + AI.Calendar._pad2(d.getMinutes());
  };

  /** 视图起点：本月 1 日所在周的周日（周日起始） */
  AI.Calendar.gridStartOf = function (month) {
    var first = AI.Calendar.firstOfMonth(month);
    return AI.Calendar.addDays(first, -first.getDay());
  };

  /** 日期在网格中的下标（0..41，超出夹取） */
  AI.Calendar.cellIndexOf = function (value, gridStart) {
    var diff = Math.round((AI.Calendar.norm(value) - AI.Calendar.norm(gridStart)) / 86400000);
    return Math.max(0, Math.min(AI.Calendar.GRID_CELLS - 1, diff));
  };

  AI.Calendar.norm = function (d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  };

  /** 事件是否与当前网格有交集 */
  AI.Calendar.isEventVisibleInGrid = function (start, last, gridStart) {
    var gridEnd = AI.Calendar.addDays(gridStart, AI.Calendar.GRID_CELLS - 1);
    return start.getTime() <= gridEnd.getTime() && last.getTime() >= gridStart.getTime();
  };

  /** 任意日期夹取到当前网格内 */
  AI.Calendar.clampToGrid = function (value, gridStart) {
    return AI.Calendar.addDays(gridStart, AI.Calendar.cellIndexOf(value, gridStart));
  };

  /**
   * 事项布局：按开始时间排序后逐周切段，每行最多 MAX_EVENT_ROWS 条，
   * counts 记录每格可见事项数（预览事件不计入）。
   */
  AI.Calendar.layoutEvents = function (events, gridStart, today, nonCountingEvent) {
    var segments = [];
    var counts = new Array(AI.Calendar.GRID_CELLS).fill(0);
    // 占用表按「绝对格号 × 行」记录：同一格的每个事项行独立占位，否则第二行永远排不进去
    var rows = [];
    for (var cell = 0; cell < AI.Calendar.GRID_CELLS; cell++) {
      rows.push(new Array(AI.Calendar.MAX_EVENT_ROWS).fill(false));
    }
    var sorted = [];
    events.forEach(function (event) {
      if (!event) return;
      // 无 start 的事项按今天兜底（与原版一致）
      var start = AI.Calendar.parseDate(event.start) || today;
      var end = AI.Calendar.parseDate(event.end) || start;
      sorted.push({ event: event, start: start, end: end });
    });
    sorted.sort(function (a, b) {
      return a.start.getTime() - b.start.getTime();
    });
    var gridEnd = AI.Calendar.addDays(gridStart, AI.Calendar.GRID_CELLS - 1);
    sorted.forEach(function (item) {
      var event = item.event;
      var start = item.start;
      var end = item.end;
      var last = end.getTime() < start.getTime() ? start : end;
      if (start.getTime() > gridEnd.getTime() || last.getTime() < gridStart.getTime()) return;
      var from = AI.Calendar.cellIndexOf(start, gridStart);
      var to = AI.Calendar.cellIndexOf(last, gridStart);
      // 事项在它经过的每一格都计入（用于 +N 折叠）
      if (event !== nonCountingEvent) {
        for (var i = from; i <= to; i++) counts[i] += 1;
      }
      for (var w = 0; w < AI.Calendar.GRID_CELLS / AI.Calendar.COLS; w++) {
        var rowStart = w * AI.Calendar.COLS;
        var rowEnd = rowStart + AI.Calendar.COLS - 1;
        if (to < rowStart || from > rowEnd) continue;
        var segFrom = Math.max(from, rowStart);
        var segTo = Math.min(to, rowEnd);
        var placed = -1;
        for (var r = 0; r < AI.Calendar.MAX_EVENT_ROWS; r++) {
          var free = true;
          for (var i = segFrom; i <= segTo; i++) {
            if (rows[i][r]) { free = false; break; }
          }
          if (free) { placed = r; break; }
        }
        if (placed < 0) continue;
        for (var k = segFrom; k <= segTo; k++) rows[k][placed] = true;
        segments.push({
          event: event,
          index: segFrom,
          endIndex: to,
          /** 首片就是事项本身的起始格时才算首段：跨周续接段与「早于视图」的截断段都不重复展示时间 */
          continuation: !AI.Calendar.sameDay(start, AI.Calendar.addDays(gridStart, segFrom)),
          span: segTo - segFrom + 1,
          row: placed
        });
      }
    });
    return { segments: segments, counts: counts };
  };

  AI.Calendar._calendarIcon =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">' +
    '<rect x="3" y="4" width="18" height="18" rx="2"/>' +
    '<path d="M16 2v4M8 2v4M3 10h18"/>' +
    '</svg>';

  AI.Calendar._chevronLeft = function (size) {
    return '<svg class="ai-calendar__nav-icon" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>';
  };
  AI.Calendar._chevronRight = function (size) {
    return '<svg class="ai-calendar__nav-icon" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>';
  };

  AI.Calendar.prototype._selectedValue = function () {
    return this.options.value !== undefined ? this.options.value : this._innerValue;
  };

  AI.Calendar.prototype._viewMonth = function () {
    return this.options.panelValue !== undefined
      ? (AI.Calendar.parseMonth(this.options.panelValue) || AI.Calendar.today())
      : this._innerPanel;
  };

  AI.Calendar.prototype._build = function () {
    var o = this.options;
    var self = this;
    this.el.classList.add('ai-calendar');
    if (o.draggableEvents) this.el.setAttribute('data-draggable', 'true');
    if (o.width != null) {
      this.el.style.width = typeof o.width === 'number' ? o.width + 'px' : o.width;
    }
    if (typeof ResizeObserver !== 'undefined') {
      this._observer = new ResizeObserver(function (entries) {
        var next = entries[0] && entries[0].contentRect ? entries[0].contentRect.width : 0;
        if (next > 0 && Math.abs(next - self._measuredWidth) > 0.5) {
          self._measuredWidth = next;
          self._render();
        }
      });
      this._observer.observe(this.el);
    }

    this.el.addEventListener('click', function (e) {
      var act = e.target.closest('[data-act]');
      if (act) {
        var a = act.getAttribute('data-act');
        if (a === 'prev-year') self._shiftYear(-1);
        else if (a === 'prev-month') self._shiftMonth(-1);
        else if (a === 'next-month') self._shiftMonth(1);
        else if (a === 'next-year') self._shiftYear(1);
        else if (a === 'today') self._selectDate(AI.Calendar.today());
        return;
      }
      var td = e.target.closest('.ai-calendar__cell');
      if (td && self.el.contains(td)) {
        var d = AI.Calendar.parseDate(td.getAttribute('data-date'));
        if (d) self._selectDate(d);
      }
    });
    this.el.addEventListener('keydown', function (e) { self._handleKeydown(e); });
    this.el.addEventListener('mousedown', function (e) {
      if (e.button !== 0) return;
      var td = e.target.closest('.ai-calendar__cell');
      if (!td) return;
      self._startDragAt(Number(td.getAttribute('data-index')));
    });
    this.el.addEventListener('mouseover', function (e) {
      var td = e.target.closest('.ai-calendar__cell');
      if (!td) return;
      self._extendDragAt(Number(td.getAttribute('data-index')));
    });
    this.el.addEventListener('pointerup', function () { self._finishDrag(); });
    // 兜底：只派发 mouse 事件的合成拖拽（无 pointerup）同样能提交；已收尾时为空操作
    this.el.addEventListener('mouseup', function () { self._finishDrag(); });
    document.addEventListener('pointerup', function () { self._stopDrag(); });
    document.addEventListener('pointercancel', function () { self._stopDrag(); });

    this._render();
  };

  AI.Calendar.prototype._navBtn = function (act, label, size, dir) {
    return '<button type="button" class="ai-calendar__nav-btn" aria-label="' + label + '" data-act="' + act + '">' +
      (dir === 'left' ? AI.Calendar._chevronLeft(size) : AI.Calendar._chevronRight(size)) + '</button>';
  };

  AI.Calendar.prototype._render = function () {
    var o = this.options;
    var self = this;
    var today = AI.Calendar.today();
    var viewMonth = this._viewMonth();
    var gridStart = AI.Calendar.gridStartOf(viewMonth);
    var selectedDate = AI.Calendar.parseDate(this._selectedValue());
    var selectedKey = selectedDate ? AI.Calendar.iso(AI.Calendar.clampToGrid(selectedDate, gridStart)) : '';
    var focusKey = AI.Calendar.iso(AI.Calendar.clampToGrid(this._focusCursor, gridStart));
    var todayKey = AI.Calendar.iso(today);
    // 缩放系数：以实际宽度为准（width 数值 / 测量值 / 基准 750）
    var numericWidth = typeof o.width === 'number' ? o.width : 0;
    var effectiveWidth = numericWidth || this._measuredWidth || AI.Calendar.LAYOUT_BASE.width;
    var scale = Math.min(AI.Calendar.MAX_SCALE, Math.max(AI.Calendar.MIN_SCALE, effectiveWidth / AI.Calendar.LAYOUT_BASE.width));
    var metrics = {
      header: AI.Calendar.LAYOUT_BASE.header * scale,
      cellHeight: AI.Calendar.LAYOUT_BASE.cellHeight * scale,
      numberBand: AI.Calendar.LAYOUT_BASE.numberBand * scale,
      eventRow: AI.Calendar.LAYOUT_BASE.eventRow * scale
    };
    // 拖拽中的预览事件：虚线框，不占用折叠计数
    var previewEvent = null;
    if (this._dragging && this._dragAnchor && this._dragHead) {
      var from = this._dragAnchor.getTime() <= this._dragHead.getTime() ? this._dragAnchor : this._dragHead;
      var to = this._dragAnchor.getTime() <= this._dragHead.getTime() ? this._dragHead : this._dragAnchor;
      previewEvent = { title: '', start: AI.Calendar.iso(from), end: AI.Calendar.iso(to), color: 'teal', __preview: true };
    }
    var layout = AI.Calendar.layoutEvents(previewEvent ? o.events.concat([previewEvent]) : o.events, gridStart, today, previewEvent);
    // 折叠计数：每格已绘制条数 = 覆盖它的切段数
    var drawn = new Array(AI.Calendar.GRID_CELLS).fill(0);
    layout.segments.forEach(function (seg) {
      for (var i = 0; i < seg.span; i++) {
        var at = seg.index + i;
        if (at < AI.Calendar.GRID_CELLS) drawn[at] += 1;
      }
    });
    var overflowCounts = layout.counts.map(function (c, i) { return Math.max(0, c - drawn[i]); });
    // 每格经过的所有事项：跨天事项在它经过的每一格都计入（用于 aria-label）
    var eventsByCell = {};
    o.events.forEach(function (event) {
      var start = AI.Calendar.parseDate(event && event.start) || today;
      var end = AI.Calendar.parseDate(event && event.end) || start;
      var last = end.getTime() < start.getTime() ? start : end;
      if (!AI.Calendar.isEventVisibleInGrid(start, last, gridStart)) return;
      var from = AI.Calendar.cellIndexOf(start, gridStart);
      var to = AI.Calendar.cellIndexOf(last, gridStart);
      for (var i = from; i <= to; i++) {
        if (!eventsByCell[i]) eventsByCell[i] = [];
        eventsByCell[i].push(event);
      }
    });

    var h = '<div class="ai-calendar__header"><div class="ai-calendar__header-group">';
    h += this._navBtn('prev-year', '上一年', 14, 'left');
    h += this._navBtn('prev-month', '上个月', 16, 'left');
    h += '</div>';
    h += '<div class="ai-calendar__month-label"><span class="ai-calendar__month-icon" aria-hidden="true">' +
      AI.Calendar._calendarIcon + '</span>' + viewMonth.getFullYear() + '年' + (viewMonth.getMonth() + 1) + '月</div>';
    h += '<div class="ai-calendar__header-group">';
    h += '<button type="button" class="ai-calendar__today-btn" data-act="today">今天</button>';
    h += this._navBtn('next-month', '下个月', 16, 'right');
    h += this._navBtn('next-year', '下一年', 14, 'right');
    h += '</div></div>';
    h += '<div class="ai-calendar__body">';
    h += '<table role="grid"' + (o.ariaLabel ? ' aria-label="' + AI.Calendar._esc(o.ariaLabel) + '"' : '') +
      (o.ariaLabelledby ? ' aria-labelledby="' + AI.Calendar._esc(o.ariaLabelledby) + '"' : '') +
      ' class="ai-calendar__table"><thead><tr role="row">';
    AI.Calendar.WEEKDAYS.forEach(function (w) {
      h += '<th role="columnheader" scope="col" class="ai-calendar__week-cell">' + w + '</th>';
    });
    h += '</tr></thead><tbody>';
    for (var row = 0; row < 6; row++) {
      h += '<tr role="row">';
      for (var col = 0; col < AI.Calendar.COLS; col++) {
        var index = row * AI.Calendar.COLS + col;
        var cell = AI.Calendar.addDays(gridStart, index);
        var cellKey = AI.Calendar.iso(cell);
        var outside = cell.getMonth() !== viewMonth.getMonth();
        var selected = cellKey === selectedKey;
        var isToday = cellKey === todayKey;
        var cls = 'ai-calendar__cell';
        if (outside) cls += ' ai-calendar__cell--outside';
        if (selected) cls += ' ai-calendar__cell--selected';
        var cellEvents = eventsByCell[index] || [];
        var overflow = overflowCounts[index] || 0;
        var label = cellKey;
        if (cellEvents.length > 0) {
          // 去重后标题数少于事项数时补「等」，否则会出现「2 项事项」只念出 1 个标题
          var titles = [];
          cellEvents.forEach(function (ev) {
            var t = ev && ev.title ? String(ev.title) : '';
            if (t && titles.indexOf(t) === -1) titles.push(t);
          });
          if (titles.length === 0) {
            label = cellKey + ' ' + cellEvents.length + ' 项事项';
          } else {
            var collapsed = titles.length < cellEvents.length ? ' 等' : '';
            label = cellKey + ' ' + cellEvents.length + ' 项事项：' + titles.join('，') + collapsed;
          }
        }
        h += '<td role="gridcell" tabindex="' + (focusKey === cellKey ? 0 : -1) +
          (selected ? '" aria-selected="true' : '') +
          '" aria-label="' + AI.Calendar._esc(label) +
          '" data-date="' + cellKey + '" data-index="' + index + '" class="' + cls + '">' +
          '<span class="ai-calendar__cell-inner"><span class="ai-calendar__day-number">' + cell.getDate() + '</span>' +
          (overflow > 0 ? '<span class="ai-calendar__more">+' + overflow + '</span>' : '') +
          '</span></td>';
      }
      h += '</tr>';
    }
    h += '</tbody></table>';
    // 事项叠加层：绝对定位覆盖日期区，条位置按格轨道计算
    h += '<div class="ai-calendar__events-layer" aria-hidden="true">';
    layout.segments.forEach(function (seg) {
      var segCol = seg.index % AI.Calendar.COLS;
      var barTop = metrics.header + Math.floor(seg.index / AI.Calendar.COLS) * metrics.cellHeight +
        metrics.numberBand + (seg.row + 0.5) * metrics.eventRow;
      var ev = seg.event;
      var inner = (o.showEventTime && ev.showTime && ev.start && !seg.continuation)
        ? '<span class="ai-calendar__event-time">' + AI.Calendar._hm(ev.start) + '</span>' +
          '<span class="ai-calendar__event-title">' + AI.Calendar._esc(ev.title || '') + '</span>'
        : '<span class="ai-calendar__event-title">' + AI.Calendar._esc(ev.title || '') + '</span>';
      h += '<div class="ai-calendar__event" data-color="' + (ev.color || 'teal') +
        '" data-span="' + (seg.span > 1) +
        '" data-start="' + (seg.index % AI.Calendar.COLS === 0) +
        '" data-end="' + ((seg.index + seg.span - 1) % AI.Calendar.COLS === AI.Calendar.COLS - 1) + '"' +
        (ev === previewEvent ? ' data-preview="true"' : '') +
        ' style="--animal-calendar-bar-top: ' + barTop.toFixed(2) + 'px; --animal-calendar-bar-left: calc((100% / 7) * ' +
        segCol + ' + 5px); --animal-calendar-bar-width: calc((100% / 7) * ' + seg.span + ' - 10px)">' + inner + '</div>';
    });
    h += '</div></div>';
    this.el.style.setProperty('--animal-calendar-scale', String(scale));
    this.el.innerHTML = h;
    // 键盘焦点搬移到 focusCursor 所在格
    if (this._pendingFocus) {
      this._pendingFocus = false;
      var node = this.el.querySelector('[data-date="' + focusKey + '"]');
      if (node) node.focus();
    }
  };

  /** 点选日期：更新值；跨月时联动翻页 */
  AI.Calendar.prototype._selectDate = function (date) {
    var o = this.options;
    if (!date) return;
    var next = AI.Calendar.iso(date);
    this._focusCursor = date;
    if (o.value === undefined) this._innerValue = next;
    if (o.onChange) o.onChange(next);
    this._lastSelected = next;
    var monthKey = AI.Calendar.isoMonth(this._viewMonth());
    if (AI.Calendar.isoMonth(date) !== monthKey) {
      this._goToMonth(AI.Calendar.firstOfMonth(date));
    } else {
      this._render();
    }
  };

  AI.Calendar.prototype._goToMonth = function (month, focus) {
    var o = this.options;
    if (o.panelValue === undefined) this._innerPanel = month;
    if (o.onPanelChange) o.onPanelChange(AI.Calendar.isoMonth(month));
    if (focus) this._focusCursor = focus;
    this._render();
  };

  AI.Calendar.prototype._shiftMonth = function (delta) {
    var next = AI.Calendar.firstOfMonth(AI.Calendar.addMonthsKeep(this._viewMonth(), delta));
    var focusDate = this._focusCursor;
    var focus = new Date(next.getFullYear(), next.getMonth(),
      Math.min(focusDate.getDate(), AI.Calendar.daysInMonth(next.getFullYear(), next.getMonth())));
    this._goToMonth(next, focus);
  };

  AI.Calendar.prototype._shiftYear = function (delta) {
    this._shiftMonth(delta * 12);
  };

  AI.Calendar.prototype._handleKeydown = function (e) {
    if (!e.target.closest || !e.target.closest('.ai-calendar__body')) return;
    var key = e.key;
    var gridStart = AI.Calendar.gridStartOf(this._viewMonth());
    if (key === 'PageUp' || key === 'PageDown') {
      e.preventDefault();
      this._pendingFocus = true;
      if (key === 'PageUp') this._shiftMonth(-1);
      else this._shiftMonth(1);
      return;
    }
    if (key === 'ArrowLeft' || key === 'ArrowRight' || key === 'ArrowUp' || key === 'ArrowDown') {
      e.preventDefault();
      var delta = key === 'ArrowLeft' ? -1 : key === 'ArrowRight' ? 1 : key === 'ArrowUp' ? -7 : 7;
      var focus = AI.Calendar.clampToGrid(this._focusCursor, gridStart);
      var next = AI.Calendar.addDays(focus, delta);
      this._pendingFocus = true;
      this._focusCursor = next;
      var monthKey = AI.Calendar.isoMonth(this._viewMonth());
      if (AI.Calendar.isoMonth(next) !== monthKey) this._goToMonth(AI.Calendar.firstOfMonth(next));
      else this._render();
      return;
    }
    if (key === 'Enter' || key === ' ') {
      e.preventDefault();
      this._selectDate(AI.Calendar.clampToGrid(this._focusCursor, gridStart));
    }
  };

  /** 拖拽创建：按下定起点，划过定终点，松手提交 [start, end] */
  AI.Calendar.prototype._startDragAt = function (index) {
    var o = this.options;
    if (!o.draggableEvents) return;
    var cell = AI.Calendar.addDays(AI.Calendar.gridStartOf(this._viewMonth()), index);
    this._dragging = true;
    this._dragAnchor = cell;
    this._dragHead = cell;
    this._render();
  };

  AI.Calendar.prototype._extendDragAt = function (index) {
    if (!this._dragging) return;
    this._dragHead = AI.Calendar.addDays(AI.Calendar.gridStartOf(this._viewMonth()), index);
    this._render();
  };

  AI.Calendar.prototype._finishDrag = function () {
    if (!this._dragging) return;
    var o = this.options;
    var anchor = this._dragAnchor;
    var head = this._dragHead;
    this._dragging = false;
    this._dragAnchor = null;
    this._dragHead = null;
    if (!anchor || !head) return;
    var from = anchor.getTime() <= head.getTime() ? anchor : head;
    var to = anchor.getTime() <= head.getTime() ? head : anchor;
    // 单击不算拖拽（选中由 click 处理）
    if (AI.Calendar.sameDay(from, to)) return;
    if (o.onEventCreate) o.onEventCreate(AI.Calendar.iso(from), AI.Calendar.iso(to));
  };

  /** 指针在面板外抬起：仅取消预览，不提交 */
  AI.Calendar.prototype._stopDrag = function () {
    if (!this._dragging) return;
    this._dragging = false;
    this._dragAnchor = null;
    this._dragHead = null;
    this._render();
  };

  /** events / value / width 等变化后调用 */
  AI.Calendar.prototype.update = function (patch) {
    var o = this.options;
    Object.assign(o, patch || {});
    this._controlled = o.value !== undefined;
    this._panelControlled = o.panelValue !== undefined;
    if (o.draggableEvents) this.el.setAttribute('data-draggable', 'true');
    else this.el.removeAttribute('data-draggable');
    if (o.width != null) this.el.style.width = typeof o.width === 'number' ? o.width + 'px' : o.width;
    else this.el.style.width = '';
    var sel = AI.Calendar.parseDate(this._selectedValue());
    if (sel) {
      this._focusCursor = sel;
      var selKey = AI.Calendar.iso(sel);
      if (selKey !== this._lastSelected) {
        this._lastSelected = selKey;
        // 非受控面板跟随选中月份
        if (o.panelValue === undefined && AI.Calendar.isoMonth(sel) !== AI.Calendar.isoMonth(this._viewMonth())) {
          this._innerPanel = AI.Calendar.firstOfMonth(sel);
        }
      }
    }
    this._render();
  };

  AI.Calendar.prototype.destroy = function () {
    if (this._observer) this._observer.disconnect();
    this.el.classList.remove('ai-calendar');
    this.el.removeAttribute('data-draggable');
    delete this.el._aiCalendar;
  };

  /* ============================================
     Chart — 19 种纯 SVG 图表
     ============================================ */
  var CHART_COLORS = ['#19b7a7', '#e59266', '#8ac68a', '#b38ad3', '#e4b84f', '#7e9fc4', '#dc8c9e', '#9a835a'];
  var CHART_ITEM_TYPES = { pie: 1, ring: 1, rose: 1, funnel: 1, word: 1, map: 1 };

  function chartFinite(value) {
    return typeof value === 'number' && isFinite(value);
  }

  function chartFormatNumber(value) {
    if (!chartFinite(value)) return '—';
    try {
      return new Intl.NumberFormat('zh-CN', {
        maximumFractionDigits: 2,
        notation: Math.abs(value) >= 10000 ? 'compact' : 'standard'
      }).format(value);
    } catch (err) {
      return String(value);
    }
  }

  function chartShortLabel(text, maxLength) {
    var label = text === undefined || text === null ? '' : String(text);
    return label.length > maxLength ? label.slice(0, Math.max(1, maxLength - 1)) + '…' : label;
  }

  function chartExtent(values, min, max, zero) {
    var list = [];
    (values || []).forEach(function (value) {
      if (chartFinite(value)) list.push(value);
    });
    var low = chartFinite(min) ? min : list.length ? Math.min.apply(null, list) : 0;
    var high = chartFinite(max) ? max : list.length ? Math.max.apply(null, list) : 0;
    if (zero) {
      low = Math.min(0, low);
      high = Math.max(0, high);
    }
    if (low === high) {
      low -= 1;
      high += 1;
    }
    return [low, high];
  }

  function chartAxisTicks(values, min, max) {
    var extent = chartExtent(values, min, max, false);
    var low = extent[0];
    var high = extent[1];
    var span = high - low;
    var magnitude = Math.pow(10, Math.floor(Math.log(span) / Math.LN10));
    var normalized = span / 2.5 / magnitude;
    var step = (normalized >= 5 ? 5 : normalized >= 2.5 ? 2.5 : normalized >= 2 ? 2 : 1) * magnitude;
    var start = Math.floor(low / step) * step;
    var end = Math.ceil(high / step) * step;
    if (start === end) end = start + step;
    var ticks = [];
    for (var value = start; value <= end + step / 2; value += step) ticks.push(value);
    return ticks;
  }

  function chartPolar(cx, cy, radius, angle) {
    return { x: cx + radius * Math.sin(angle), y: cy - radius * Math.cos(angle) };
  }

  function chartArc(cx, cy, radius, startAngle, endAngle) {
    var start = chartPolar(cx, cy, radius, startAngle);
    var end = chartPolar(cx, cy, radius, endAngle);
    return 'M ' + start.x + ' ' + start.y + ' A ' + radius + ' ' + radius + ' 0 ' +
      (endAngle - startAngle > Math.PI ? 1 : 0) + ' 1 ' + end.x + ' ' + end.y;
  }

  function chartSector(cx, cy, radius, startAngle, endAngle) {
    var start = chartPolar(cx, cy, radius, startAngle);
    var end = chartPolar(cx, cy, radius, endAngle);
    return 'M ' + cx + ' ' + cy + ' L ' + start.x + ' ' + start.y + ' A ' + radius + ' ' + radius + ' 0 ' +
      (endAngle - startAngle > Math.PI ? 1 : 0) + ' 1 ' + end.x + ' ' + end.y + ' Z';
  }

  function chartAnnularSector(cx, cy, inner, outer, startAngle, endAngle) {
    var large = endAngle - startAngle > Math.PI ? 1 : 0;
    var a = chartPolar(cx, cy, outer, startAngle);
    var b = chartPolar(cx, cy, outer, endAngle);
    var c = chartPolar(cx, cy, inner, endAngle);
    var d = chartPolar(cx, cy, inner, startAngle);
    return 'M ' + a.x + ' ' + a.y + ' A ' + outer + ' ' + outer + ' 0 ' + large + ' 1 ' + b.x + ' ' + b.y +
      ' L ' + c.x + ' ' + c.y + ' A ' + inner + ' ' + inner + ' 0 ' + large + ' 0 ' + d.x + ' ' + d.y + ' Z';
  }

  function chartLinePath(points, smooth) {
    if (!points.length) return '';
    if (points.length === 1) return 'M ' + points[0].x + ' ' + points[0].y;
    if (!smooth) {
      return points.map(function (point, index) {
        return (index ? 'L ' : 'M ') + point.x + ' ' + point.y;
      }).join(' ');
    }
    var path = 'M ' + points[0].x + ' ' + points[0].y;
    for (var i = 1; i < points.length; i++) {
      var previous = points[i - 1];
      var current = points[i];
      var middle = (previous.x + current.x) / 2;
      path += ' C ' + middle + ' ' + previous.y + ' ' + middle + ' ' + current.y + ' ' + current.x + ' ' + current.y;
    }
    return path;
  }

  function chartTimeLabel(value) {
    var date = new Date(value);
    if (isNaN(date.getTime())) return String(value);
    return ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
  }

  /** 提示按原版显示完整日期时间；坐标轴只显示 HH:mm。 */
  function chartTimeFullLabel(value) {
    var date = new Date(value);
    if (isNaN(date.getTime())) return String(value);
    function pad(n) { return ('0' + n).slice(-2); }
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) +
      ' ' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds());
  }

  function chartNormalize(props) {
    var type = props.type || 'column';
    var series = props.series || [];
    var categories = props.categories || [];
    var palette = props.colors && props.colors.length ? props.colors : CHART_COLORS;
    var points = [];
    series.forEach(function (entry, seriesIndex) {
      var data = entry.data || [];
      data.forEach(function (datum, dataIndex) {
        if (datum === null || datum === undefined) return;
        var object = typeof datum === 'object' ? datum : null;
        var candle = object && 'open' in object ? object : null;
        var point = object && !candle ? object : null;
        var value = typeof datum === 'number' ? datum
          : candle ? candle.close
          : point ? (point.value !== undefined ? point.value : point.y)
          : undefined;
        var x = point && point.x !== undefined ? point.x : dataIndex;
        if (!chartFinite(value) || !chartFinite(x)) return;
        if ((type === 'scatter' || type === 'bubble' || type === 'time') &&
          (!chartFinite(point && point.x) || !chartFinite(point && point.y))) return;
        var name = object && object.name !== undefined ? object.name
          : categories[dataIndex] !== undefined ? categories[dataIndex]
          : String(dataIndex + 1);
        points.push({
          seriesIndex: seriesIndex,
          seriesName: entry.name || '系列 ' + (seriesIndex + 1),
          dataIndex: dataIndex,
          name: name,
          value: value,
          x: x,
          y: point ? point.y : value,
          open: candle ? candle.open : undefined,
          high: candle ? candle.high : undefined,
          low: candle ? candle.low : undefined,
          close: candle ? candle.close : undefined,
          size: point && point.size !== undefined ? point.size : undefined,
          color: entry.color || palette[(CHART_ITEM_TYPES[type] ? dataIndex : seriesIndex) % palette.length]
        });
      });
    });
    if (CHART_ITEM_TYPES[type]) {
      return points.filter(function (point) { return point.seriesIndex === 0; });
    }
    return points;
  }

  function chartCartesianScene(ctx) {
    var props = ctx.props;
    var points = ctx.points;
    var width = ctx.width;
    var height = ctx.height;
    var format = ctx.format;
    var xFormatter = typeof props.xFormatter === 'function' ? props.xFormatter : null;
    function xAxisLabel(value, fallback) {
      if (!xFormatter) return fallback;
      try {
        return String(xFormatter(value));
      } catch (err) {
        return fallback;
      }
    }
    var type = props.type || 'column';
    var categories = props.categories || [];
    var series = props.series || [];
    var showAxes = props.showAxes !== false;
    var stacked = !!props.stacked;
    var smooth = !!props.smooth;
    var showLabels = !!props.showLabels;
    var horizontal = type === 'bar';
    var numericX = type === 'scatter' || type === 'bubble' || type === 'time';
    var left = horizontal ? 90 : 62;
    var right = width - 24;
    var top = 28;
    var bottom = height - 44;
    var plotWidth = Math.max(right - left, 1);
    var plotHeight = Math.max(bottom - top, 1);
    var groups = [];
    points.forEach(function (point) {
      if (groups.indexOf(point.seriesIndex) < 0) groups.push(point.seriesIndex);
    });
    var count = Math.max(categories.length, 1);
    series.forEach(function (entry) { count = Math.max(count, (entry.data || []).length); });
    var step = (horizontal ? plotHeight : plotWidth) / count;
    // 分组条必须落在各自分类槽位内，否则会压住相邻分类与轴标签
    var groupSpan = Math.min(step * 0.78, 30 * Math.max(groups.length, 1));
    var groupWidth = groupSpan / Math.max(groups.length, 1);
    var barWidth = Math.max(2, groupWidth - 3);
    var stepStart = horizontal ? top : left;
    var byIndex = {};
    points.forEach(function (point) {
      var bucket = byIndex[point.dataIndex] || (byIndex[point.dataIndex] = {});
      if (bucket[point.seriesIndex] === undefined) bucket[point.seriesIndex] = point;
    });
    var values = [];
    points.forEach(function (point) {
      values.push(point.value);
      if (chartFinite(point.high)) values.push(point.high);
      if (chartFinite(point.low)) values.push(point.low);
    });
    // 柱/条/面积需要以 0 为基线，避免数值轴不含 0 时柱子溢出到标签区
    if (type === 'column' || type === 'bar' || type === 'area' || type === 'mount' || type === 'mix') values.push(0);
    var ticks = chartAxisTicks(values, props.min, props.max);
    var axisLow = ticks[0];
    var axisHigh = ticks[ticks.length - 1];
    var xRange = chartExtent(points.map(function (point) { return point.x; }), undefined, undefined, false);
    var xLow = xRange[0];
    var xHigh = xRange[1];
    var bars = stacked && (type === 'column' || type === 'bar');

    function ratio(value) {
      return (value - axisLow) / (axisHigh - axisLow);
    }
    function yAt(value) {
      return bottom - ratio(value) * plotHeight;
    }
    function xAt(value) {
      if (numericX) return left + ((value - xLow) / (xHigh - xLow)) * plotWidth;
      return left + (value + 0.5) * (plotWidth / Math.max(count, 1));
    }
    function yCat(value) {
      return top + (value + 0.5) * (plotHeight / Math.max(count, 1));
    }
    function barStart(index, valueIndex) {
      var base = stepStart + index * step + (step - groupSpan) / 2;
      return base + valueIndex * groupWidth;
    }
    function stackBase(point) {
      if (!bars) return 0;
      var total = 0;
      groups.forEach(function (other) {
        if (other >= point.seriesIndex) return;
        var otherPoint = byIndex[point.dataIndex] && byIndex[point.dataIndex][other];
        if (otherPoint) total += otherPoint.value;
      });
      return total;
    }

    var background = [];
    if (showAxes) {
      ticks.forEach(function (tick) {
        if (horizontal) {
          var gridX = left + ratio(tick) * plotWidth;
          background.push('<line class="chart-grid-line" x1="' + gridX + '" y1="' + top + '" x2="' + gridX + '" y2="' + bottom + '"/>');
          background.push('<text class="chart-axis-label" x="' + gridX + '" y="' + (bottom + 20) + '" text-anchor="middle">' + _escapeHtml(format(tick)) + '</text>');
        } else {
          var gridY = yAt(tick);
          background.push('<line class="chart-grid-line" x1="' + left + '" y1="' + gridY + '" x2="' + right + '" y2="' + gridY + '"/>');
          background.push('<text class="chart-axis-label" x="' + (left - 10) + '" y="' + (gridY + 4) + '" text-anchor="end">' + _escapeHtml(format(tick)) + '</text>');
        }
      });
      if (numericX) {
        // 数值轴按刻度标注，避免把分类索引当成坐标导致标签挤压、越界
        if (type === 'time') {
          var timePoints = [];
          points.forEach(function (point) {
            var exists = timePoints.some(function (other) { return other.x === point.x; });
            if (!exists) timePoints.push(point);
          });
          timePoints.sort(function (a, b) { return a.x - b.x; });
          var lastLabelX = -Infinity;
          timePoints.forEach(function (point, timeIndex) {
            var labelX = xAt(point.x);
            // 窄图抽稀：与上一个标签距离不足 54px 时跳过，最后一个始终保留
            if (timeIndex < timePoints.length - 1 && labelX - lastLabelX < 54) return;
            lastLabelX = labelX;
            background.push('<text class="chart-axis-label" x="' + labelX + '" y="' + (bottom + 20) + '" text-anchor="middle">' + _escapeHtml(xAxisLabel(point.x, chartShortLabel(point.name, 10))) + '</text>');
          });
        } else {
          chartAxisTicks([xLow, xHigh]).forEach(function (tick) {
            if (tick < xLow || tick > xHigh) return;
            background.push('<text class="chart-axis-label" x="' + xAt(tick) + '" y="' + (bottom + 20) + '" text-anchor="middle">' + _escapeHtml(xAxisLabel(tick, format(tick))) + '</text>');
          });
        }
      } else {
        for (var index = 0; index < count; index++) {
          var sample = null;
          for (var indexPoint = 0; indexPoint < points.length; indexPoint++) {
            if (points[indexPoint].dataIndex === index) { sample = points[indexPoint]; break; }
          }
          var label = categories[index] !== undefined ? categories[index] : sample ? sample.name : String(index + 1);
          if (horizontal) {
            background.push('<text class="chart-axis-label" x="' + (left - 10) + '" y="' + (yCat(index) + 4) + '" text-anchor="end">' + _escapeHtml(chartShortLabel(label, 8)) + '</text>');
          } else {
            background.push('<text class="chart-axis-label" x="' + xAt(index) + '" y="' + (bottom + 20) + '" text-anchor="middle">' + _escapeHtml(chartShortLabel(label, 8)) + '</text>');
          }
        }
      }
      if (axisLow < 0 && axisHigh > 0) {
        if (horizontal) {
          background.push('<line class="chart-zero" x1="' + (left + ratio(0) * plotWidth) + '" y1="' + top + '" x2="' + (left + ratio(0) * plotWidth) + '" y2="' + bottom + '"/>');
        } else {
          background.push('<line class="chart-zero" x1="' + left + '" y1="' + yAt(0) + '" x2="' + right + '" y2="' + yAt(0) + '"/>');
        }
      }
    }
    var layers = [];
    var marks = [];

    function pushMark(key, point, x, y, axisPosition, inner) {
      marks.push({ key: key, point: point, x: x, y: y, axisPosition: axisPosition, html: inner });
    }

    if (type === 'column' || type === 'bar' || type === 'mix') {
      groups.forEach(function (seriesIndex) {
        var entry = series[seriesIndex] || {};
        var mode = type === 'mix' ? (entry.type || 'column') : type;
        if (mode !== 'column' && mode !== 'bar') return;
        var groupIndex = groups.indexOf(seriesIndex);
        points.forEach(function (point) {
          if (point.seriesIndex !== seriesIndex) return;
          var baseValue = bars ? stackBase(point) : 0;
          var start = point.value >= 0 ? baseValue : baseValue + point.value;
          var end = point.value >= 0 ? baseValue + point.value : baseValue;
          var offset = barStart(point.dataIndex, groupIndex);
          var x0, x1, y0, y1;
          if (horizontal) {
            y0 = offset;
            y1 = offset + barWidth;
            x0 = left + ratio(start) * plotWidth;
            x1 = left + ratio(end) * plotWidth;
            if (x1 - x0 < 1.5) x1 = x0 + 1.5;
          } else {
            x0 = offset;
            x1 = offset + barWidth;
            y0 = yAt(end);
            y1 = yAt(start);
            if (y1 - y0 < 1.5) y1 = y0 + 1.5;
          }
          var rect = '<rect x="' + x0 + '" y="' + y0 + '" width="' + (x1 - x0) + '" height="' + (y1 - y0) +
            '" rx="' + Math.min(6, (x1 - x0) / 2, (y1 - y0) / 2) + '" fill="' + point.color + '"/>';
          var hit = horizontal
            ? '<rect x="' + left + '" y="' + offset + '" width="' + plotWidth + '" height="' + barWidth + '" fill="transparent"/>'
            : '<rect x="' + x0 + '" y="' + top + '" width="' + barWidth + '" height="' + plotHeight + '" fill="transparent"/>';
          var label = '';
          if (showLabels) {
            if (horizontal) {
              label = '<text class="chart-value-label" x="' + (Math.max(x0, x1) + 8) + '" y="' + (y0 + barWidth / 2 + 4) + '" text-anchor="start">' + _escapeHtml(format(point.value)) + '</text>';
            } else {
              label = '<text class="chart-value-label" x="' + (x0 + barWidth / 2) + '" y="' + (Math.min(y0, y1) - 7) + '" text-anchor="middle">' + _escapeHtml(format(point.value)) + '</text>';
            }
          }
          var anchorX = horizontal ? left + ratio((start + end) / 2) * plotWidth : x0 + barWidth / 2;
          var anchorY = horizontal ? y0 + barWidth / 2 : yAt((start + end) / 2);
          pushMark('bar-' + seriesIndex + '-' + point.dataIndex, point, anchorX, anchorY,
            horizontal ? anchorY : anchorX, rect + hit + label);
        });
      });
    }

    if (type === 'line' || type === 'area' || type === 'mount' || type === 'mix' || type === 'time') {
      groups.forEach(function (seriesIndex) {
        var entry = series[seriesIndex] || {};
        var mode = type === 'mix' ? (entry.type || 'column') : type;
        if (type !== 'time' && mode !== 'line' && mode !== 'area' && mode !== 'mount') return;
        var seriesPoints = points.filter(function (point) { return point.seriesIndex === seriesIndex; })
          .slice()
          .sort(function (a, b) { return a.x - b.x; });
        if (!seriesPoints.length) return;
        var coords = seriesPoints.map(function (point) {
          var baseValue = bars ? stackBase(point) : 0;
          return { point: point, x: xAt(point.x), y: yAt(baseValue + point.value) };
        });
        var path = chartLinePath(coords, smooth);
        var color = seriesPoints[0].color;
        var fillShape = mode === 'area' || mode === 'mount' || type === 'area' || type === 'mount';
        if (fillShape) {
          var first = coords[0];
          var last = coords[coords.length - 1];
          layers.push({
            seriesIndex: seriesIndex,
            html: '<path d="' + path + ' L ' + last.x + ' ' + bottom + ' L ' + first.x + ' ' + bottom +
              ' Z" fill="' + color + '" fill-opacity="' + (mode === 'mount' ? 0.24 : 0.2) + '" stroke="none"/>'
          });
        }
        layers.push({
          seriesIndex: seriesIndex,
          html: '<path d="' + path + '" fill="none" stroke="' + color + '" stroke-width="' + (mode === 'mount' ? 3 : 2.5) +
            '" stroke-linejoin="round" stroke-linecap="round"/>'
        });
        coords.forEach(function (coord) {
          var radius = mode === 'mount' ? 3.5 : 4.5;
          var dot = '<circle cx="' + coord.x + '" cy="' + coord.y + '" r="' + radius + '" fill="' + color + '" stroke="#fffdf4" stroke-width="2"/>';
          var hit = '<circle cx="' + coord.x + '" cy="' + coord.y + '" r="12" fill="transparent"/>';
          var label = showLabels
            ? '<text class="chart-value-label" x="' + coord.x + '" y="' + (coord.y - 10) + '" text-anchor="middle">' + _escapeHtml(format(coord.point.value)) + '</text>'
            : '';
          pushMark('point-' + seriesIndex + '-' + coord.point.dataIndex, coord.point, coord.x, coord.y,
            horizontal ? coord.y : coord.x, dot + hit + label);
        });
      });
    }

    if (type === 'scatter' || type === 'bubble') {
      var maxSize = 1;
      points.forEach(function (point) {
        if (chartFinite(point.size)) maxSize = Math.max(maxSize, point.size);
      });
      points.forEach(function (point) {
        var radius = type === 'bubble' ? 4 + Math.sqrt(Math.max(point.size || 0, 0) / maxSize) * 12 : 4.5;
        var dot = '<circle cx="' + xAt(point.x) + '" cy="' + yAt(point.y) + '" r="' + radius + '" fill="' + point.color +
          '" fill-opacity="0.9" stroke="#fffdf4" stroke-width="2"/>';
        var hit = '<circle cx="' + xAt(point.x) + '" cy="' + yAt(point.y) + '" r="' + Math.max(12, radius) + '" fill="transparent"/>';
        pushMark('point-' + point.seriesIndex + '-' + point.dataIndex, point, xAt(point.x), yAt(point.y), undefined, dot + hit);
      });
    }

    if (type === 'candle') {
      points.forEach(function (point) {
        if (!chartFinite(point.open) || !chartFinite(point.close) || !chartFinite(point.high) || !chartFinite(point.low)) return;
        var up = point.close >= point.open;
        var color = up ? '#19b7a7' : '#e59266';
        var centerX = xAt(point.x);
        var bodyWidth = Math.max(6, barWidth * 0.62);
        var wickTop = yAt(point.high);
        var wickBottom = yAt(point.low);
        var bodyTop = yAt(Math.max(point.open, point.close));
        var bodyBottom = yAt(Math.min(point.open, point.close));
        var wick = '<line x1="' + centerX + '" y1="' + wickTop + '" x2="' + centerX + '" y2="' + wickBottom +
          '" stroke="' + color + '" stroke-width="2" stroke-linecap="round"/>';
        var body = '<rect x="' + (centerX - bodyWidth / 2) + '" y="' + bodyTop + '" width="' + bodyWidth +
          '" height="' + Math.max(1.5, bodyBottom - bodyTop) + '" rx="3" fill="' + color + '"/>';
        var hit = '<rect x="' + (centerX - bodyWidth / 2 - 6) + '" y="' + (wickTop - 6) + '" width="' + (bodyWidth + 12) +
          '" height="' + (wickBottom - wickTop + 12) + '" fill="transparent"/>';
        pushMark('candle-' + point.seriesIndex + '-' + point.dataIndex, point, centerX,
          yAt((point.high + point.low) / 2), centerX, wick + body + hit);
      });
    }
    return {
      background: background.join(''),
      layers: layers,
      marks: marks,
      plot: { left: left, right: right, top: top, bottom: bottom, horizontal: horizontal }
    };
  }

  function chartPieScene(ctx) {
    var props = ctx.props;
    var points = ctx.points;
    var width = ctx.width;
    var height = ctx.height;
    var format = ctx.format;
    var type = props.type || 'pie';
    var data = points.filter(function (point) { return point.value > 0; });
    var total = 0;
    data.forEach(function (point) { total += point.value; });
    var maxValue = 0;
    data.forEach(function (point) { maxValue = Math.max(maxValue, point.value); });
    var cx = width / 2;
    var cy = height / 2;
    var radius = Math.max(40, Math.min(width, height) / 2 - 34);
    var inner = type === 'ring' ? radius * 0.58 : type === 'rose' ? radius * 0.3 : 0;
    var marks = [];
    var angle = 0;
    var stepAngle = Math.PI * 2 / Math.max(data.length, 1);
    data.forEach(function (point, index) {
      var startAngle;
      var endAngle;
      var outer = radius;
      if (type === 'rose') {
        startAngle = index * stepAngle;
        endAngle = startAngle + stepAngle;
        outer = inner + (radius - inner) * (maxValue ? point.value / maxValue : 0);
      } else {
        startAngle = angle;
        var fraction = total ? point.value / total : 0;
        endAngle = angle + fraction * Math.PI * 2;
        angle = endAngle;
      }
      var path = inner
        ? chartAnnularSector(cx, cy, inner, outer, startAngle, endAngle)
        : chartSector(cx, cy, radius, startAngle, endAngle);
      var shape = '<path d="' + path + '" fill="' + point.color + '" stroke="#fffdf4" stroke-width="2" stroke-linejoin="round"/>';
      var label = '';
      if (props.showLabels) {
        var middle = (startAngle + endAngle) / 2;
        var labelRadius = inner ? (inner + outer) / 2 : outer * 0.68;
        var position = chartPolar(cx, cy, labelRadius, middle);
        var share = total ? Math.round(point.value / total * 1000) / 10 : 0;
        label = '<text class="chart-value-label" x="' + position.x + '" y="' + (position.y + 4) +
          '" text-anchor="middle" fill="#fffdf4">' + _escapeHtml(chartShortLabel(point.name, 5) + ' ' + share + '%') + '</text>';
      }
      var anchorAngle = type === 'rose' ? startAngle + stepAngle / 2 : (startAngle + endAngle) / 2;
      var anchor = chartPolar(cx, cy, inner ? (inner + outer) / 2 : outer * 0.66, anchorAngle);
      marks.push({
        key: 'slice-' + point.dataIndex,
        point: point,
        x: anchor.x,
        y: anchor.y,
        axisPosition: undefined,
        html: shape + label
      });
    });
    var background = '';
    if (type === 'ring') {
      background = '<g class="chart-center"><text x="' + cx + '" y="' + (cy - 8) + '" text-anchor="middle">合计</text>' +
        '<text class="chart-center-value" x="' + cx + '" y="' + (cy + 20) + '" text-anchor="middle">' +
        _escapeHtml(format(total)) + '</text></g>';
    }
    return { background: background, layers: [], marks: marks, plot: null };
  }

  function chartRadarScene(ctx) {
    var props = ctx.props;
    var points = ctx.points;
    var width = ctx.width;
    var height = ctx.height;
    var format = ctx.format;
    var categories = (props.categories || []).slice();
    if (!categories.length) {
      points.forEach(function (point) {
        if (categories.indexOf(point.name) < 0) categories.push(point.name);
      });
    }
    var total = Math.max(categories.length, 1);
    var cx = width / 2;
    var cy = height / 2 + 4;
    var radius = Math.max(50, Math.min(width, height) / 2 - 44);
    var low = chartFinite(props.min) ? props.min : 0;
    var range = chartExtent(points.map(function (point) { return point.value; }), low, props.max, false);
    var axisLow = range[0];
    var axisHigh = range[1];
    function angleAt(index) {
      return Math.PI * 2 * index / total;
    }
    function pointAt(value, index) {
      var length = radius * ((value - axisLow) / (axisHigh - axisLow));
      return chartPolar(cx, cy, Math.max(length, 0), angleAt(index));
    }
    var background = [];
    [0.25, 0.5, 0.75, 1].forEach(function (level, ringIndex) {
      var polygon = [];
      for (var i = 0; i < total; i++) {
        var position = chartPolar(cx, cy, radius * level, angleAt(i));
        polygon.push(position.x + ',' + position.y);
      }
      background.push('<polygon class="chart-radar-grid" points="' + polygon.join(' ') + '"/>');
      if (ringIndex === 3) {
        for (var a = 0; a < total; a++) {
          var end = chartPolar(cx, cy, radius, angleAt(a));
          background.push('<line class="chart-grid-line" x1="' + cx + '" y1="' + cy + '" x2="' + end.x + '" y2="' + end.y + '"/>');
          var labelPoint = chartPolar(cx, cy, radius + 18, angleAt(a));
          var anchor = labelPoint.x < cx - 1 ? 'end' : labelPoint.x > cx + 1 ? 'start' : 'middle';
          background.push('<text class="chart-axis-label" x="' + labelPoint.x + '" y="' + (labelPoint.y + 4) +
            '" text-anchor="' + anchor + '">' + _escapeHtml(chartShortLabel(categories[a], 6)) + '</text>');
        }
      }
    });
    var layers = [];
    var marks = [];
    var groups = [];
    points.forEach(function (point) {
      if (groups.indexOf(point.seriesIndex) < 0) groups.push(point.seriesIndex);
    });
    groups.forEach(function (seriesIndex) {
      var seriesPoints = points.filter(function (point) { return point.seriesIndex === seriesIndex; });
      if (!seriesPoints.length) return;
      var color = seriesPoints[0].color;
      var vertices = [];
      seriesPoints.forEach(function (point) {
        var index = categories.indexOf(point.name);
        if (index < 0) index = point.dataIndex % total;
        var position = pointAt(point.value, index);
        vertices.push({ point: point, x: position.x, y: position.y });
        marks.push({
          key: 'radar-' + seriesIndex + '-' + point.dataIndex,
          point: point,
          x: position.x,
          y: position.y,
          axisPosition: undefined,
          html: '<circle cx="' + position.x + '" cy="' + position.y + '" r="4.5" fill="' + color +
            '" stroke="#fffdf4" stroke-width="2"/><circle cx="' + position.x + '" cy="' + position.y + '" r="12" fill="transparent"/>'
        });
      });
      if (vertices.length > 1) {
        var path = 'M ' + vertices.map(function (vertex) { return vertex.x + ' ' + vertex.y; }).join(' L ') + ' Z';
        layers.push({
          seriesIndex: seriesIndex,
          html: '<path d="' + path + '" fill="' + color + '" fill-opacity="0.18" stroke="' + color +
            '" stroke-width="2.5" stroke-linejoin="round"/>'
        });
      }
    });
    return { background: background.join(''), layers: layers, marks: marks, plot: null };
  }

  function chartGaugeScene(ctx) {
    var props = ctx.props;
    var points = ctx.points;
    var width = ctx.width;
    var height = ctx.height;
    var format = ctx.format;
    var gauge = props.type === 'gauge';
    // 每系列首项代表当前读数；仪表盘只用首个可见系列。
    var data = [];
    points.forEach(function (point) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].seriesIndex === point.seriesIndex) return;
      }
      data.push(point);
    });
    if (gauge) data = data.slice(0, 1);
    var range = chartExtent([], props.min === undefined ? 0 : props.min, props.max === undefined ? 100 : props.max, false);
    var low = range[0];
    var high = range[1];
    var start = -Math.PI * 0.75;
    var end = Math.PI * 0.75;
    var background = [];
    var marks = [];
    data.forEach(function (point, index) {
      var space = width / Math.max(1, data.length);
      var cx = space * (index + 0.5);
      var cy = height / 2 + 20;
      var radius = Math.max(20, Math.min(space / 2 - 22, height / 2 - 38));
      var fraction = Math.max(0, Math.min(1, (point.value - low) / (high - low)));
      background.push('<path d="' + chartArc(cx, cy, radius, start, end) + '" fill="none" stroke="#eae2ce" stroke-width="' +
        (gauge ? 18 : 14) + '" stroke-linecap="round"/>');
      if (gauge) {
        for (var tick = 0; tick <= 8; tick++) {
          var angle = start + (end - start) * tick / 8;
          var tickStart = chartPolar(cx, cy, radius - 20, angle);
          var tickEnd = chartPolar(cx, cy, radius - 27, angle);
          background.push('<line x1="' + tickStart.x + '" y1="' + tickStart.y + '" x2="' + tickEnd.x +
            '" y2="' + tickEnd.y + '" stroke="#b6a184" stroke-width="2"/>');
        }
        [low, (low + high) / 2, high].forEach(function (value, scaleIndex) {
          var scale = chartPolar(cx, cy, radius + 16, start + (end - start) * scaleIndex / 2);
          background.push('<text class="chart-axis-label" x="' + scale.x + '" y="' + (scale.y + 4) +
            '" text-anchor="middle">' + _escapeHtml(chartShortLabel(format(value), 8)) + '</text>');
        });
      }
      var needle = chartPolar(cx, cy, radius - 34, start + fraction * (end - start));
      var html = '';
      if (fraction > 0) {
        html += '<path d="' + chartArc(cx, cy, radius, start, start + fraction * (end - start)) + '" fill="none" stroke="' +
          point.color + '" stroke-width="' + (gauge ? 18 : 14) + '" stroke-linecap="round"/>';
      }
      if (gauge) {
        html += '<line x1="' + cx + '" y1="' + cy + '" x2="' + needle.x + '" y2="' + needle.y +
          '" stroke="#725d42" stroke-width="4" stroke-linecap="round"/>' +
          '<circle cx="' + cx + '" cy="' + cy + '" r="7" fill="#725d42"/>';
      }
      html += '<text class="chart-center-value" x="' + cx + '" y="' + (cy + (gauge ? 38 : 0)) +
        '" text-anchor="middle">' + _escapeHtml(chartShortLabel(format(point.value), 10)) + '</text>' +
        '<text class="chart-axis-label" x="' + cx + '" y="' + (cy + (gauge ? 59 : 26)) +
        '" text-anchor="middle">' + _escapeHtml(chartShortLabel(point.seriesName, 12)) + '</text>' +
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + radius + '" fill="transparent"/>';
      marks.push({ key: 'gauge-' + point.seriesIndex, point: point, x: cx, y: cy, axisPosition: undefined, html: html });
    });
    return { background: background.join(''), layers: [], marks: marks, plot: null };
  }

  function chartFunnelScene(ctx) {
    var props = ctx.props;
    var points = ctx.points;
    var width = ctx.width;
    var height = ctx.height;
    var format = ctx.format;
    var max = 0;
    points.forEach(function (point) { max = Math.max(max, point.value); });
    if (!max) return { background: '', layers: [], marks: [], plot: null };
    var step = (height - 40) / Math.max(1, points.length);
    var span = width * 0.7;
    var marks = points.map(function (point, index) {
      var upper = point.value / max * span;
      var next = points[index + 1];
      var lower = point.value === 0 ? 0 : ((next ? next.value : point.value * 0.75) / max) * span;
      var y = 20 + index * step;
      var cx = width / 2;
      var path = 'M ' + (cx - upper / 2) + ' ' + y + ' H ' + (cx + upper / 2) +
        ' L ' + (cx + lower / 2) + ' ' + (y + step - 5) + ' H ' + (cx - lower / 2) + ' Z';
      var label = chartShortLabel(point.name, 12) + (props.showLabels !== false ? ' · ' + format(point.value) : '');
      return {
        key: 'funnel-' + point.dataIndex,
        point: point,
        x: cx,
        y: y + step / 2,
        axisPosition: undefined,
        html: '<path d="' + path + '" fill="' + point.color + '" fill-opacity="0.55" stroke="' + point.color +
          '" stroke-width="1.5" stroke-linejoin="round"/>' +
          '<text class="chart-value-label" x="' + cx + '" y="' + (y + step / 2 + 4) + '" text-anchor="middle">' +
          _escapeHtml(label) + '</text>'
      };
    });
    return { background: '', layers: [], marks: marks, plot: null };
  }

  function chartWordScene(ctx) {
    var points = ctx.points;
    var width = ctx.width;
    var height = ctx.height;
    var boxes = [];
    var max = 1;
    points.forEach(function (point) { max = Math.max(max, point.value); });
    var marks = [];
    points.filter(function (point) { return point.value > 0; })
      .sort(function (a, b) { return b.value - a.value; })
      .forEach(function (point) {
        var text = chartShortLabel(point.name, 16);
        var units = 0;
        Array.from(text).forEach(function (char) {
          units += char.codePointAt(0) > 127 ? 1 : 0.7;
        });
        var fontSize = Math.min(44, 14 + Math.sqrt(point.value / max) * 30, (width - 30) / Math.max(1, units));
        var box = null;
        while (fontSize >= 12 && !box) {
          var boxWidth = units * fontSize + 12;
          var boxHeight = fontSize * 1.5;
          for (var i = 0; i < 1200; i++) {
            var angle = i * 0.55;
            var radius = 4.2 * Math.sqrt(i);
            var x = width / 2 + Math.cos(angle) * radius * 2 - boxWidth / 2;
            var y = height / 2 + Math.sin(angle) * radius - boxHeight / 2;
            if (x < 10 || x + boxWidth > width - 10 || y < 10 || y + boxHeight > height - 10) continue;
            var overlaps = false;
            for (var b = 0; b < boxes.length; b++) {
              var other = boxes[b];
              if (x < other.x + other.w && x + boxWidth > other.x && y < other.y + other.h && y + boxHeight > other.y) {
                overlaps = true;
                break;
              }
            }
            if (overlaps) continue;
            box = { x: x, y: y, w: boxWidth, h: boxHeight };
            break;
          }
          if (!box) fontSize -= 3;
        }
        if (!box) return;
        boxes.push(box);
        var cx = box.x + box.w / 2;
        var cy = box.y + box.h / 2;
        marks.push({
          key: 'word-' + point.dataIndex,
          point: point,
          x: cx,
          y: cy,
          axisPosition: undefined,
          html: '<text x="' + cx + '" y="' + cy + '" text-anchor="middle" dominant-baseline="central" fill="' +
            point.color + '" font-size="' + fontSize + '" font-weight="800">' + _escapeHtml(text) + '</text>'
        });
      });
    return { background: '', layers: [], marks: marks, plot: null };
  }

  function chartMapScene(ctx) {
    var props = ctx.props;
    var points = ctx.points;
    var width = ctx.width;
    var height = ctx.height;
    var regions = [];
    (props.regions || []).forEach(function (region) {
      var polygons = (region.polygons || []).filter(function (ring) {
        if (!ring || ring.length < 3) return false;
        return ring.every(function (pair) { return pair && chartFinite(pair[0]) && chartFinite(pair[1]); });
      });
      if (polygons.length) regions.push({ name: region.name, polygons: polygons });
    });
    var coordinates = [];
    regions.forEach(function (region) {
      region.polygons.forEach(function (ring) {
        ring.forEach(function (pair) { coordinates.push(pair); });
      });
    });
    if (!coordinates.length) return { background: '', layers: [], marks: [], plot: null };
    var xRange = chartExtent(coordinates.map(function (pair) { return pair[0]; }), undefined, undefined, false);
    var yRange = chartExtent(coordinates.map(function (pair) { return pair[1]; }), undefined, undefined, false);
    var scale = Math.min((width - 48) / (xRange[1] - xRange[0]), (height - 40) / (yRange[1] - yRange[0]));
    function project(pair) {
      return [
        width / 2 + (pair[0] - (xRange[0] + xRange[1]) / 2) * scale,
        height / 2 - (pair[1] - (yRange[0] + yRange[1]) / 2) * scale
      ];
    }
    var valueRange = chartExtent(points.map(function (point) { return point.value; }), undefined, undefined, false);
    var background = [];
    var marks = [];
    regions.forEach(function (region, index) {
      var paths = region.polygons.map(function (ring) {
        return ring.map(function (pair, pairIndex) {
          var projected = project(pair);
          return (pairIndex ? 'L' : 'M') + projected[0] + ',' + projected[1];
        }).join(' ') + ' Z';
      }).join(' ');
      var cx = 0;
      var cy = 0;
      var total = 0;
      region.polygons.forEach(function (ring) {
        ring.forEach(function (pair) {
          var projected = project(pair);
          cx += projected[0];
          cy += projected[1];
          total++;
        });
      });
      cx /= Math.max(total, 1);
      cy /= Math.max(total, 1);
      var point = null;
      for (var p = 0; p < points.length; p++) {
        if (points[p].name === region.name) { point = points[p]; break; }
      }
      var opacity = point
        ? 0.3 + Math.max(0, Math.min(1, (point.value - valueRange[0]) / (valueRange[1] - valueRange[0]))) * 0.65
        : 1;
      var html = '<path d="' + paths + '" fill="' + (point ? point.color : '#eae2ce') + '" fill-opacity="' + opacity +
        '" fill-rule="evenodd" stroke="#fffdf7" stroke-width="3" stroke-linejoin="round"/>';
      if (props.showLabels) {
        html += '<text class="chart-value-label" x="' + cx + '" y="' + cy + '" text-anchor="middle">' +
          _escapeHtml(chartShortLabel(region.name, 8)) + '</text>';
      }
      if (point) {
        marks.push({ key: 'region-' + index, point: point, x: cx, y: cy, axisPosition: undefined, html: html });
      } else {
        background.push('<g>' + html + '<title>' + _escapeHtml(String(region.name)) + '：暂无数据</title></g>');
      }
    });
    return { background: background.join(''), layers: [], marks: marks, plot: null };
  }

  function chartSceneFor(ctx) {
    var type = ctx.props.type || 'column';
    if (type === 'pie' || type === 'ring' || type === 'rose') return chartPieScene(ctx);
    if (type === 'radar') return chartRadarScene(ctx);
    if (type === 'gauge' || type === 'arcbar') return chartGaugeScene(ctx);
    if (type === 'funnel') return chartFunnelScene(ctx);
    if (type === 'word') return chartWordScene(ctx);
    if (type === 'map') return chartMapScene(ctx);
    return chartCartesianScene(ctx);
  }

  AI.Chart = function (el, options) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    if (!this.el) return;
    if (this.el._aiChart) this.el._aiChart.destroy();

    this.props = {};
    this.hidden = {};
    this.hoverKey = null;
    this.selectedKey = null;
    this.locked = false;
    this.loading = false;
    this.markData = [];
    this.scene = null;
    this.width = 640;
    this.height = 320;

    this._build(options || {});
    this._bind();
    this._renderAll();

    this.el._aiChart = this;
  };

  AI.Chart.prototype._build = function (options) {
    var props = {
      type: 'column',
      series: [],
      categories: [],
      height: 300,
      legend: true,
      tooltip: true,
      showAxes: true,
      showLabels: false,
      highlight: true,
      selectable: true,
      animated: true,
      stacked: false,
      smooth: false
    };
    var key;
    for (key in options) {
      if (Object.prototype.hasOwnProperty.call(options, key)) props[key] = options[key];
    }
    this.props = props;

    var root = this.el;
    root.classList.add('ai-chart');
    if (props.className) {
      String(props.className).split(/\s+/).forEach(function (cls) {
        if (cls) root.classList.add(cls);
      });
    }
    if (props.style && typeof props.style === 'object') {
      Object.keys(props.style).forEach(function (name) {
        root.style[name] = props.style[name];
      });
    }
    if (props.animated !== false) root.classList.add('ai-chart--animated');
    root.setAttribute('role', 'figure');

    root.innerHTML =
      '<div class="ai-chart__header" hidden>' +
        '<div class="ai-chart__title"></div>' +
        '<div class="ai-chart__description"></div>' +
      '</div>' +
      '<div class="ai-chart__viewport">' +
        '<svg class="ai-chart__canvas" role="img" focusable="false"></svg>' +
        '<div class="ai-chart__tooltip" hidden></div>' +
        '<div class="ai-chart__state" hidden></div>' +
        '<div class="ai-chart__empty" hidden></div>' +
      '</div>' +
      '<div class="ai-chart__selection" hidden></div>' +
      '<div class="ai-chart__legend"></div>' +
      '<details class="ai-chart__data">' +
        '<summary>查看数据明细</summary>' +
        '<div class="ai-chart__data-scroll"></div>' +
      '</details>';

    this.header = root.querySelector('.ai-chart__header');
    this.titleEl = root.querySelector('.ai-chart__title');
    this.descriptionEl = root.querySelector('.ai-chart__description');
    this.viewport = root.querySelector('.ai-chart__viewport');
    this.canvas = root.querySelector('.ai-chart__canvas');
    this.tooltip = root.querySelector('.ai-chart__tooltip');
    this.state = root.querySelector('.ai-chart__state');
    this.empty = root.querySelector('.ai-chart__empty');
    this.selection = root.querySelector('.ai-chart__selection');
    this.legend = root.querySelector('.ai-chart__legend');
    this.data = root.querySelector('.ai-chart__data');
    this.dataBody = root.querySelector('.ai-chart__data-scroll');
  };

  AI.Chart.prototype._measure = function () {
    var props = this.props;
    var width = props.width;
    if (!chartFinite(width) || width <= 0) {
      width = (this.viewport && this.viewport.clientWidth) || this.el.clientWidth || 640;
    }
    this.width = Math.max(280, Math.round(width));
    this.height = Math.max(180, Math.round(chartFinite(props.height) ? props.height : 300));
    this.canvas.setAttribute('width', this.width);
    this.canvas.setAttribute('height', this.height);
    this.canvas.setAttribute('viewBox', '0 0 ' + this.width + ' ' + this.height);
    this.viewport.style.minHeight = this.height + 'px';
  };

  AI.Chart.prototype._format = function () {
    var formatter = this.props.valueFormatter;
    return function (value) {
      if (typeof formatter === 'function') {
        try {
          return String(formatter(value));
        } catch (err) {
          return chartFormatNumber(value);
        }
      }
      return chartFormatNumber(value);
    };
  };

  AI.Chart.prototype._isItemType = function () {
    return !!CHART_ITEM_TYPES[this.props.type];
  };

  AI.Chart.prototype._xFormat = function (value, full) {
    var formatter = this.props.xFormatter;
    if (typeof formatter === 'function') {
      try {
        return String(formatter(value));
      } catch (err) {
        return chartFormatNumber(value);
      }
    }
    if (this.props.type === 'time') return full ? chartTimeFullLabel(value) : chartTimeLabel(value);
    return chartFormatNumber(value);
  };

  /** 提示与屏幕阅读器共用：K 线报四个价，二维图报坐标，其余报数值。 */
  AI.Chart.prototype._describeMark = function (mark) {
    var format = this._format();
    var point = mark.point;
    var type = this.props.type;
    if (type === 'candle') {
      return '开 ' + format(point.open) + ' / 收 ' + format(point.close) +
        ' / 低 ' + format(point.low) + ' / 高 ' + format(point.high);
    }
    if (type === 'scatter' || type === 'bubble' || type === 'time') {
      return this._xFormat(point.x, true) + ' · ' + format(point.value) +
        (type === 'bubble' ? ' · 权重 ' + format(point.size) : '');
    }
    return format(point.value);
  };

  AI.Chart.prototype._activePoints = function () {
    var hidden = this.hidden;
    var itemType = this._isItemType();
    return (this.allPoints || []).filter(function (point) {
      return !hidden[(itemType ? 'item-' : 'series-') + (itemType ? point.dataIndex : point.seriesIndex)];
    });
  };

  AI.Chart.prototype._renderAll = function () {
    var props = this.props;
    if (!this.canvas) return;

    this.hoverKey = null;
    this.tooltip.hidden = true;
    this.tooltip.innerHTML = '';

    if (this.titleEl) this.titleEl.textContent = props.title || '';
    if (this.descriptionEl) this.descriptionEl.textContent = props.description || '';
    this.header.hidden = !props.title && !props.description;

    this.loading = props.loading === true;
    this.allPoints = chartNormalize(props);

    if (this.loading) {
      this.canvas.innerHTML = '';
      this.canvas.style.display = 'none';
      this.selection.hidden = true;
      this.data.hidden = true;
      this.empty.hidden = true;
      this.state.hidden = false;
      this.state.setAttribute('role', 'status');
      this.state.style.height = Math.max(180, chartFinite(props.height) ? props.height : 300) + 'px';
      this.state.textContent = '正在整理数据…';
      this.legend.hidden = true;
      return;
    }
    this.state.hidden = true;
    this.state.textContent = '';
    this.state.removeAttribute('role');
    this.state.style.height = '';
    this.canvas.style.display = '';

    var points = this._activePoints();
    this._measure();
    this.scene = chartSceneFor({
      props: props,
      points: points,
      width: this.width,
      height: this.height,
      format: this._format()
    });

    this._renderCanvas();
    this._renderLegend();
    this._renderSelection();
    this._renderData(points);
    this._syncEmpty(points);
    this._renderCrosshair(null);
    this._renderIndicators([]);
  };

  AI.Chart.prototype._renderCanvas = function () {
    var scene = this.scene || {};
    var self = this;

    var layers = '';
    (scene.layers || []).forEach(function (layer) {
      layers += '<g class="ai-chart__layer" data-series="' + layer.seriesIndex + '">' + layer.html + '</g>';
    });

    var marks = '';
    (scene.marks || []).forEach(function (mark) {
      var label = self._markLabel(mark);
      marks += '<g class="ai-chart__mark" data-key="' + _escapeHtml(mark.key) + '" data-series="' +
        mark.point.seriesIndex + '" data-index="' + mark.point.dataIndex + '" tabindex="0" role="button" aria-label="' +
        _escapeHtml(label) + '">' + mark.html + '</g>';
    });

    this.canvas.innerHTML =
      '<g class="ai-chart__background">' + (scene.background || '') + '</g>' +
      '<g class="ai-chart__layers">' + layers + '</g>' +
      '<g class="ai-chart__marks">' + marks + '</g>' +
      '<g class="ai-chart__crosshair"></g>' +
      '<g class="ai-chart__indicators"></g>';
    this.markData = scene.marks || [];
    this.markGroups = this.canvas.querySelectorAll('.ai-chart__mark');
    this.layerGroups = this.canvas.querySelectorAll('.ai-chart__layer');
  };

  AI.Chart.prototype._markLabel = function (mark) {
    var point = mark.point;
    var categories = this.props.categories || [];
    var name = mark.axisPosition !== undefined && categories[mark.axisPosition] !== undefined
      ? categories[mark.axisPosition]
      : point.name;
    return name + ' ' + this._format()(point.value);
  };

  AI.Chart.prototype._findMark = function (key) {
    for (var i = 0; i < this.markData.length; i++) {
      if (this.markData[i].key === key) return this.markData[i];
    }
    return null;
  };

  AI.Chart.prototype._syncEmpty = function (points) {
    var type = this.props.type;
    var regions = this.props.regions || [];
    var missingMap = type === 'map' && !regions.length;
    var allHidden = this.allPoints.length > 0 && !points.length;
    var empty = !points.length || missingMap;
    var hiddenCount = this._hiddenCount();

    this.empty.hidden = !empty;
    this.canvas.style.visibility = empty ? 'hidden' : '';
    this.legend.hidden = empty || this.props.legend === false;
    this.selection.hidden = empty;
    this.data.hidden = empty;

    if (!empty) {
      this.empty.textContent = '';
      this.empty.removeAttribute('role');
      return;
    }

    this.empty.setAttribute('role', 'status');
    var emptyText = this.props.emptyText;
    this.empty.innerHTML = '';
    // 自定义元素直接渲染；字符串与默认文案交给 NoData，保持与原版一致的空态外观。
    if (!allHidden && !missingMap && emptyText instanceof HTMLElement) {
      this.empty.appendChild(emptyText);
      return;
    }
    var mount = document.createElement('div');
    new AI.NoData(mount, {
      size: 'small',
      title: allHidden
        ? '所有图例已隐藏'
        : missingMap
          ? '请提供地图区域轮廓'
          : emptyText !== undefined && emptyText !== null
            ? String(emptyText)
            : '暂无数据',
      description: allHidden ? '恢复图例后，即可继续查看统计。' : undefined,
      extra: hiddenCount > 0
        ? '<button type="button" class="ai-btn ai-btn--default ai-btn--sm ai-chart__restore">恢复全部图例</button>'
        : undefined
    });
    this.empty.appendChild(mount);
  };

  AI.Chart.prototype._hiddenCount = function () {
    var count = 0;
    for (var key in this.hidden) {
      if (Object.prototype.hasOwnProperty.call(this.hidden, key) && this.hidden[key]) count++;
    }
    return count;
  };

  AI.Chart.prototype._legendItems = function () {
    var self = this;
    var items = [];
    if (this._isItemType()) {
      (this.allPoints || []).forEach(function (point) {
        items.push({ key: 'item-' + point.dataIndex, label: point.name, color: point.color });
      });
      return items;
    }
    (this.props.series || []).forEach(function (entry, index) {
      var sample = null;
      (self.allPoints || []).forEach(function (point) {
        if (!sample && point.seriesIndex === index) sample = point;
      });
      items.push({
        key: 'series-' + index,
        label: entry.name || '系列 ' + (index + 1),
        color: sample ? sample.color : CHART_COLORS[index % CHART_COLORS.length]
      });
    });
    return items;
  };

  AI.Chart.prototype._renderLegend = function () {
    var items = this._legendItems();
    if (this.props.legend === false || !items.length) {
      this.legend.hidden = true;
      this.legend.innerHTML = '';
      return;
    }
    var self = this;
    var html = '';
    items.forEach(function (item) {
      html += '<button type="button" data-key="' + _escapeHtml(item.key) + '" aria-pressed="' +
        (self.hidden[item.key] ? 'false' : 'true') + '">' +
        '<span class="ai-chart__swatch" style="background:' + item.color + '"></span>' +
        _escapeHtml(item.label) + '</button>';
    });
    if (this._hiddenCount() > 0) {
      html += '<button type="button" class="ai-chart__restore">恢复全部图例</button>';
    }
    this.legend.innerHTML = html;
    this.legend.hidden = false;
  };

  AI.Chart.prototype._renderSelection = function () {
    var mark = this.locked && this.selectedKey ? this._findMark(this.selectedKey) : null;
    if (!mark) {
      this.selection.hidden = true;
      this.selection.innerHTML = '';
      return;
    }
    var context = this._contextFor(mark);
    var label = this._isItemType() ? mark.point.name : mark.point.seriesName;
    this.selection.innerHTML = '<span>已锁定：' + _escapeHtml(context.title) + ' · ' +
      _escapeHtml(label) + ' ' + _escapeHtml(this._format()(mark.point.value)) + '</span>' +
      '<button type="button">解除锁定</button>';
    this.selection.hidden = false;
  };

  AI.Chart.prototype._renderData = function (points) {
    var format = this._format();
    var isItem = this._isItemType();
    var html = '<table><caption>数据明细</caption>';

    if (isItem) {
      var total = 0;
      points.forEach(function (point) { total += Math.max(point.value, 0); });
      html += '<thead><tr><th scope="col">名称</th><th scope="col">数值</th><th scope="col">占比</th></tr></thead><tbody>';
      points.forEach(function (point) {
        var share = total ? (point.value / total * 100).toFixed(1) + '%' : '—';
        html += '<tr><td>' + _escapeHtml(point.name) + '</td><td>' + _escapeHtml(format(point.value)) +
          '</td><td>' + share + '</td></tr>';
      });
      html += '</tbody></table>';
      this.dataBody.innerHTML = html;
      return;
    }

    var seriesNames = (this.props.series || []).map(function (entry, index) {
      return entry.name || '系列 ' + (index + 1);
    });
    html += '<thead><tr><th scope="col">类别</th>';
    seriesNames.forEach(function (name) {
      html += '<th scope="col">' + _escapeHtml(name) + '</th>';
    });
    html += '</tr></thead><tbody>';

    var rows = [];
    var rowIndex = {};
    points.forEach(function (point) {
      var key = point.dataIndex;
      if (rowIndex[key] === undefined) {
        rowIndex[key] = rows.length;
        rows.push({ label: point.name, values: {} });
      }
      rows[rowIndex[key]].values[point.seriesIndex] = point;
    });
    rows.slice(0, 100).forEach(function (row) {
      html += '<tr><td>' + _escapeHtml(row.label) + '</td>';
      seriesNames.forEach(function (name, index) {
        var point = row.values[index];
        html += '<td>' + _escapeHtml(point ? format(point.value) : '—') + '</td>';
      });
      html += '</tr>';
    });
    html += '</tbody></table>';
    this.dataBody.innerHTML = html;
  };

  AI.Chart.prototype._bind = function () {
    var self = this;
    if (!this.viewport) return;

    function findMark(event) {
      var target = event.target;
      if (!target || !target.closest) return null;
      var mark = target.closest('.ai-chart__mark');
      return mark && self.canvas.contains(mark) ? mark : null;
    }

    this.viewport.addEventListener('mouseover', function (event) {
      var mark = findMark(event);
      if (!mark || self.locked) return;
      var key = mark.getAttribute('data-key');
      if (key === self.hoverKey) return;
      self._setHover(key);
    });

    this.viewport.addEventListener('mouseleave', function () {
      if (!self.locked) self._clearActive();
    });

    this.viewport.addEventListener('click', function (event) {
      var mark = findMark(event);
      if (!mark) return;
      self._toggleSelect(mark.getAttribute('data-key'));
    });

    this.viewport.addEventListener('keydown', function (event) {
      var mark = findMark(event);
      if (event.key === 'Escape') {
        self._clearActive(true);
        return;
      }
      if (!mark) return;
      if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
        event.preventDefault();
        self._toggleSelect(mark.getAttribute('data-key'));
        return;
      }
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown' ||
          event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault();
        var forward = event.key === 'ArrowRight' || event.key === 'ArrowDown';
        self._focusNeighbor(mark, forward ? 1 : -1);
      }
    });

    this.legend.addEventListener('click', function (event) {
      if (event.target.closest && event.target.closest('.ai-chart__restore')) {
        self.hidden = {};
        self.selectedKey = null;
        self.locked = false;
        self._renderAll();
        return;
      }
      var button = event.target.closest ? event.target.closest('button[data-key]') : null;
      if (!button) return;
      var key = button.getAttribute('data-key');
      if (self.hidden[key]) delete self.hidden[key];
      else self.hidden[key] = true;
      self.selectedKey = null;
      self.locked = false;
      self._renderAll();
    });

    this.legend.addEventListener('mouseover', function (event) {
      var button = event.target.closest ? event.target.closest('button[data-key]') : null;
      if (!button || self.locked) return;
      self._highlightLegend(button.getAttribute('data-key'));
    });

    this.legend.addEventListener('mouseleave', function () {
      if (!self.locked) self._clearActive();
    });

    this.selection.addEventListener('click', function (event) {
      var button = event.target.closest ? event.target.closest('button') : null;
      if (!button) return;
      self._clearActive(true);
    });

    this.empty.addEventListener('click', function (event) {
      if (!event.target.closest || !event.target.closest('.ai-chart__restore')) return;
      self.hidden = {};
      self.selectedKey = null;
      self.locked = false;
      self._renderAll();
    });

    this._onResize = function () { self._scheduleRender(); };
    window.addEventListener('resize', this._onResize);
  };

  AI.Chart.prototype._triggerFor = function (mark) {
    var tooltip = this.props.tooltip;
    var trigger = tooltip && typeof tooltip === 'object' && tooltip.trigger ? tooltip.trigger : 'axis';
    if (mark.axisPosition === undefined) return 'item';
    return trigger === 'item' ? 'item' : 'axis';
  };

  AI.Chart.prototype._tooltipOption = function (name, fallback) {
    var tooltip = this.props.tooltip;
    if (!tooltip || typeof tooltip !== 'object') return fallback;
    return tooltip[name] === undefined ? fallback : tooltip[name];
  };

  AI.Chart.prototype._contextFor = function (mark) {
    var trigger = this._triggerFor(mark);
    var items = [];
    if (trigger === 'axis' && mark.axisPosition !== undefined) {
      var seen = {};
      this.markData.forEach(function (item) {
        if (item.axisPosition !== mark.axisPosition) return;
        if (seen[item.point.seriesIndex]) return;
        seen[item.point.seriesIndex] = true;
        items.push(item);
      });
    } else {
      items.push(mark);
    }
    var type = this.props.type;
    var categories = this.props.categories || [];
    var title;
    if (trigger === 'axis' && categories[mark.axisPosition] !== undefined) {
      title = categories[mark.axisPosition];
    } else if (CHART_ITEM_TYPES[type]) {
      title = mark.point.seriesName || '分布';
    } else if (type === 'time') {
      title = this._xFormat(mark.point.x, true);
    } else {
      title = mark.point.name;
    }
    return { title: title, items: items, trigger: trigger };
  };

  AI.Chart.prototype._setHover = function (key) {
    this.hoverKey = key;
    this._applyActive();
    if (!key) {
      this.tooltip.hidden = true;
      this._renderCrosshair(null);
      this._renderIndicators([]);
      return;
    }
    var mark = this._findMark(key);
    if (mark) this._showTooltip(mark);
  };

  AI.Chart.prototype._applyActive = function () {
    var key = this.locked ? this.selectedKey : this.hoverKey;
    var mark = key ? this._findMark(key) : null;
    var related = {};
    var relatedSeries = {};
    if (mark) {
      if (this._triggerFor(mark) === 'axis' && mark.axisPosition !== undefined) {
        this.markData.forEach(function (item) {
          if (item.axisPosition !== mark.axisPosition) return;
          related[item.key] = true;
          relatedSeries[item.point.seriesIndex] = true;
        });
      } else {
        related[mark.key] = true;
        relatedSeries[mark.point.seriesIndex] = true;
      }
    }
    var highlight = this.props.highlight !== false;
    this.markGroups.forEach(function (group) {
      var active = !!related[group.getAttribute('data-key')];
      group.classList.toggle('ai-chart__mark-active', active);
      group.classList.toggle('ai-chart__muted', !!mark && !active && highlight);
    });
    this.layerGroups.forEach(function (layer) {
      var series = parseInt(layer.getAttribute('data-series'), 10);
      layer.classList.toggle('ai-chart__muted', !!mark && !relatedSeries[series] && highlight);
    });
    if (!mark) {
      this._renderCrosshair(null);
      this._renderIndicators([]);
    }
  };

  AI.Chart.prototype._highlightLegend = function (key) {
    var isItem = key.indexOf('item-') === 0;
    var index = parseInt(key.split('-')[1], 10);
    var highlight = this.props.highlight !== false;
    this.markGroups.forEach(function (group) {
      var related = isItem
        ? parseInt(group.getAttribute('data-index'), 10) === index
        : parseInt(group.getAttribute('data-series'), 10) === index;
      group.classList.toggle('ai-chart__mark-active', related);
      group.classList.toggle('ai-chart__muted', !related && highlight);
    });
    this.layerGroups.forEach(function (layer) {
      var series = parseInt(layer.getAttribute('data-series'), 10);
      layer.classList.toggle('ai-chart__muted', !isItem && series !== index && highlight);
    });
  };

  AI.Chart.prototype._toggleSelect = function (key) {
    var mark = this._findMark(key);
    if (!mark) return;
    if (this.props.selectable === false) {
      this._setHover(key);
      return;
    }
    if (this.locked && this.selectedKey === key) {
      this._clearActive(true);
      return;
    }
    this.selectedKey = key;
    this.hoverKey = key;
    this.locked = true;
    this._applyActive();
    this._showTooltip(mark);
    this._renderSelection();
    var callback = this.props.onDataClick;
    if (typeof callback === 'function') {
      try {
        callback(mark.point);
      } catch (err) {
        /* 回调异常不影响图表交互 */
      }
    }
  };

  AI.Chart.prototype._clearActive = function (clearSelection) {
    this.hoverKey = null;
    if (clearSelection) {
      this.selectedKey = null;
      this.locked = false;
    }
    this._applyActive();
    this.tooltip.hidden = true;
    this.tooltip.innerHTML = '';
    this._renderCrosshair(null);
    this._renderIndicators([]);
    this._renderSelection();
  };

  AI.Chart.prototype._focusNeighbor = function (mark, delta) {
    var groups = this.markGroups;
    if (!groups || !groups.length) return;
    var index = 0;
    for (var i = 0; i < groups.length; i++) {
      if (groups[i] === mark) {
        index = i;
        break;
      }
    }
    var next = groups[(index + delta + groups.length) % groups.length];
    if (next && next.focus) next.focus();
  };

  AI.Chart.prototype._showTooltip = function (mark) {
    var context = this._contextFor(mark);
    var custom = this._customTooltip(context);
    if (custom === false) {
      this.tooltip.hidden = true;
      this.tooltip.innerHTML = '';
      this._renderCrosshair(null);
      this._renderIndicators([]);
      return;
    }
    this._renderCrosshair(mark);
    this._renderIndicators(context.items);
    this.tooltip.innerHTML = custom === null ? this._tooltipHtml(context) : custom;
    this.tooltip.className = 'ai-chart__tooltip' + (this.locked ? ' ai-chart__tooltip--locked' : '');
    this.tooltip.hidden = false;

    var viewportWidth = this.viewport.clientWidth || this.width;
    var viewportHeight = this.viewport.clientHeight || this.height;
    var tooltipWidth = this.tooltip.offsetWidth;
    var tooltipHeight = this.tooltip.offsetHeight;
    var x = mark.x + 16;
    var y = mark.y - tooltipHeight / 2;
    if (x + tooltipWidth > viewportWidth - 8) x = mark.x - tooltipWidth - 16;
    x = Math.max(8, Math.min(x, Math.max(8, viewportWidth - tooltipWidth - 8)));
    y = Math.max(8, Math.min(y, Math.max(8, viewportHeight - tooltipHeight - 8)));
    this.tooltip.style.left = x + 'px';
    this.tooltip.style.top = y + 'px';
  };

  /** tooltip.render 自定义提示；返回 null/undefined/false 时隐藏，其余作为 HTML 输出。 */
  AI.Chart.prototype._customTooltip = function (context) {
    var options = this.props.tooltip;
    var render = options && typeof options === 'object' ? options.render : null;
    if (typeof render !== 'function') return null;

    var self = this;
    var type = this.props.type;
    var proportion = type === 'pie' || type === 'ring' || type === 'rose' || type === 'funnel';
    var visible = this._activePoints();
    var total = 0;
    if (proportion) {
      visible.forEach(function (point) { total += Math.max(point.value, 0); });
    }
    var first = type === 'funnel' && visible.length ? Math.max(visible[0].value, 0) : 0;

    var items = context.items.map(function (mark) {
      var point = mark.point;
      var index = -1;
      if (type === 'funnel') {
        for (var i = 0; i < visible.length; i++) {
          if (visible[i].dataIndex === point.dataIndex) { index = i; break; }
        }
      }
      var denominator = type === 'funnel' ? first : total;
      var previous = index > 0 ? visible[index - 1].value : 0;
      return {
        type: type,
        seriesIndex: point.seriesIndex,
        dataIndex: point.dataIndex,
        seriesName: point.seriesName,
        name: point.name,
        value: point.value,
        datum: point.datum,
        color: point.color,
        formattedValue: self._describeMark(mark),
        percentage: proportion && denominator > 0 ? Math.max(point.value, 0) / denominator * 100 : undefined,
        conversion: type === 'funnel' && previous > 0 ? point.value / previous * 100 : undefined
      };
    });

    var output;
    try {
      output = render({ type: type, name: context.title, items: items, locked: !!this.locked });
    } catch (err) {
      return null;
    }
    if (output === null || output === undefined || output === false) return false;
    return String(output);
  };

  AI.Chart.prototype._tooltipHtml = function (context) {
    var format = this._format();
    var xFormat = this._xFormat.bind(this);
    var type = this.props.type;
    var isItem = this._isItemType();
    var proportion = type === 'pie' || type === 'ring' || type === 'rose' || type === 'funnel';
    var showPercentage = this._tooltipOption('showPercentage', true);
    var visible = this._activePoints();
    var total = 0;
    if (proportion) {
      visible.forEach(function (point) { total += Math.max(point.value, 0); });
    }
    var firstFunnel = type === 'funnel' && visible.length ? Math.max(visible[0].value, 0) : 0;

    var html = '<div class="ai-chart__tooltip-title"><span>' + _escapeHtml(context.title) + '</span>' +
      (this.locked ? '<span class="ai-chart__locked">已锁定</span>' : '') + '</div>';

    context.items.forEach(function (item) {
      var point = item.point;
      var label = isItem ? point.name : point.seriesName;
      var extra = '';
      if (proportion && showPercentage && total > 0) {
        extra += '占比 ' + (Math.max(point.value, 0) / total * 100).toFixed(1) + '%';
      }
      if (type === 'funnel') {
        var index = -1;
        for (var i = 0; i < visible.length; i++) {
          if (visible[i].dataIndex === point.dataIndex) {
            index = i;
            break;
          }
        }
        if (index > 0 && visible[index - 1].value > 0) {
          extra += (extra ? ' · ' : '') + '较上一阶段 ' +
            (point.value / visible[index - 1].value * 100).toFixed(0) + '%';
        }
        if (firstFunnel > 0 && index !== 0) {
          extra += (extra ? ' · ' : '') + '较首阶段 ' +
            (point.value / firstFunnel * 100).toFixed(0) + '%';
        }
      }
      if (type === 'scatter' || type === 'bubble') {
        extra += (extra ? ' · ' : '') + 'x ' + xFormat(point.x) + ' · y ' + xFormat(point.y);
        if (type === 'bubble' && point.size !== undefined) extra += ' · 权重 ' + format(point.size);
      }
      if (type === 'candle') {
        extra = '开 ' + format(point.open) + ' · 收 ' + format(point.close) +
          ' · 低 ' + format(point.low) + ' · 高 ' + format(point.high);
      }
      if (type === 'time') {
        extra += (extra ? ' · ' : '') + xFormat(point.x, true);
      }
      html += '<div class="ai-chart__tooltip-row">' +
        '<span class="ai-chart__swatch" style="background:' + point.color + '"></span>' +
        '<span class="ai-chart__tooltip-value">' +
          '<span>' + _escapeHtml(label) + '</span>' +
          '<strong>' + _escapeHtml(format(point.value)) + '</strong>' +
          (extra ? '<small>' + _escapeHtml(extra) + '</small>' : '') +
        '</span>' +
      '</div>';
    });

    var selectable = this.props.selectable !== false;
    html += '<div class="ai-chart__tooltip-hint">' +
      (selectable
        ? (this.locked ? '点击其他图形切换锁定 · Esc 解除' : '点击锁定读数 · Esc 解除')
        : 'Esc 关闭提示') +
    '</div>';
    return html;
  };

  AI.Chart.prototype._renderCrosshair = function (mark) {
    var group = this.canvas.querySelector('.ai-chart__crosshair');
    if (!group) return;
    group.innerHTML = '';
    if (!mark || mark.axisPosition === undefined) return;
    if (this.props.tooltip === false || this._tooltipOption('crosshair', true) === false) return;
    var plot = this.scene && this.scene.plot;
    if (!plot) return;
    var html = '';
    if (plot.horizontal) {
      html += '<line x1="' + plot.left + '" y1="' + mark.y + '" x2="' + plot.right + '" y2="' + mark.y + '"/>';
    } else {
      html += '<line x1="' + mark.x + '" y1="' + plot.top + '" x2="' + mark.x + '" y2="' + plot.bottom + '"/>';
      if (this.props.type === 'scatter' || this.props.type === 'bubble') {
        html += '<line x1="' + plot.left + '" y1="' + mark.y + '" x2="' + plot.right + '" y2="' + mark.y + '"/>';
      }
    }
    group.innerHTML = html;
  };

  AI.Chart.prototype._renderIndicators = function (marks) {
    var group = this.canvas.querySelector('.ai-chart__indicators');
    if (!group) return;
    var html = '';
    (marks || []).forEach(function (mark) {
      html += '<circle cx="' + mark.x + '" cy="' + mark.y + '" r="7" fill="none" stroke="' +
        mark.point.color + '" stroke-width="2" stroke-opacity="0.5"/>';
    });
    group.innerHTML = html;
  };

  AI.Chart.prototype._scheduleRender = function () {
    var self = this;
    if (this._frame) return;
    var schedule = window.requestAnimationFrame || function (callback) { return setTimeout(callback, 16); };
    this._frame = schedule(function () {
      self._frame = null;
      self._renderAll();
    });
  };

  AI.Chart.prototype.setProps = function (options) {
    var key;
    for (key in options || {}) {
      if (Object.prototype.hasOwnProperty.call(options, key)) this.props[key] = options[key];
    }
    if (this.props.animated !== false) this.el.classList.add('ai-chart--animated');
    else this.el.classList.remove('ai-chart--animated');
    this._renderAll();
  };

  AI.Chart.prototype.setLoading = function (loading) {
    this.loading = !!loading;
    this._renderAll();
  };

  AI.Chart.prototype.destroy = function () {
    if (this._onResize) window.removeEventListener('resize', this._onResize);
    if (this.el) {
      this.el.classList.remove('ai-chart', 'ai-chart--animated');
      this.el.removeAttribute('role');
      this.el.innerHTML = '';
      if (this.el._aiChart === this) delete this.el._aiChart;
    }
    this.canvas = null;
  };

  /* ============================================
     Divider — 六种线型 + 图标循环 + 海浪
     ============================================ */
  AI.Divider = function (options) {
    var o = options || {};
    var type = o.type || 'dashed-brown';
    var iconSize = o.iconSize == null ? 24 : o.iconSize;
    var iconGap = o.iconGap == null ? 8 : o.iconGap;
    var root = document.createElement('div');

    AI.Divider._applyStyle = AI.Divider._applyStyle || function (el, style) {
      if (!style) return;
      if (typeof style === 'string') { el.style.cssText += style; return; }
      Object.keys(style).forEach(function (k) {
        if (k.indexOf('--') === 0) el.style.setProperty(k, style[k]);
        else el.style[k] = style[k];
      });
    };

    if (o.icon) {
      root.className = 'ai-divider ai-divider--icon' + (o.className ? ' ' + o.className : '');
      root.setAttribute('aria-hidden', 'true');
      AI.Divider._applyStyle(root, o.style);

      var render = function () {
        var cycleWidth = iconSize + iconGap;
        var cycles = Math.max(1, Math.floor(root.clientWidth / cycleWidth));
        var html = '';
        for (var c = 0; c < cycles; c++) {
          html += '<div class="ai-divider__cycle">' + o.icon;
          if (c < cycles - 1) {
            html += '<span class="ai-divider__gap" style="width:' + iconGap + 'px">' +
              '<span class="ai-divider__line"></span></span>';
          }
          html += '</div>';
        }
        root.innerHTML = html;
      };
      render();
      if (typeof ResizeObserver !== 'undefined') {
        var ro = new ResizeObserver(render);
        ro.observe(root);
        root.__aiDividerRO = ro;
      }
      return root;
    }

    root.className = 'ai-divider ai-divider--' + type +
      (o.animated === false ? ' ai-divider--paused' : '') +
      (o.className ? ' ' + o.className : '');
    AI.Divider._applyStyle(root, o.style);
    if (type === 'ocean-wave') {
      var wave = document.createElement('span');
      wave.className = 'ai-wave';
      wave.setAttribute('aria-hidden', 'true');
      wave.style.setProperty('--ai-wave-play-state', o.animated === false ? 'paused' : 'running');
      root.appendChild(wave);
    }
    return root;
  };

  /* ============================================
     Footer — 版权栏
     ============================================ */
  AI.Footer = function (options) {
    var o = options || {};
    var year = o.year || new Date().getFullYear();
    var el = document.createElement('footer');
    el.className = 'ai-footer' + (o.className ? ' ' + o.className : '');
    el.textContent = '© ' + year + ' ' + (o.text || 'All Rights Reserved.');
    if (o.style) {
      if (typeof o.style === 'string') el.style.cssText += o.style;
      else Object.keys(o.style).forEach(function (k) {
        if (k.indexOf('--') === 0) el.style.setProperty(k, o.style[k]);
        else el.style[k] = o.style[k];
      });
    }
    return el;
  };

  /* ============================================
     Auto-init — 自动初始化 data-ai 属性
     ============================================ */
  AI.autoInit = function () {
    document.querySelectorAll('[data-ai="time"]').forEach(function (el) {
      new AI.Time(el);
    });

    document.querySelectorAll('.ai-input-wrapper .ai-input').forEach(function (el) {
      new AI.Input(el);
    });

    document.querySelectorAll('[data-ai="checkbox"]').forEach(function (el) {
      new AI.Checkbox(el);
    });

    document.querySelectorAll('.ai-switch').forEach(function (el) {
      new AI.Switch(el);
    });

    document.querySelectorAll('[data-ai="select"]').forEach(function (el) {
      new AI.Select(el);
    });

    document.querySelectorAll('[data-ai="tabs"]').forEach(function (el) {
      new AI.Tabs(el);
    });

    document.querySelectorAll('.ai-collapse').forEach(function (el) {
      new AI.Collapse(el);
    });

    document.querySelectorAll('[data-ai="phone"]').forEach(function (el) {
      new AI.Phone(el);
    });

    document.querySelectorAll('.ai-code-block').forEach(function (el) {
      new AI.CodeBlock(el);
    });

    document.querySelectorAll('[data-ai="loading"]').forEach(function (el) {
      new AI.Loading(el);
    });

    document.querySelectorAll('[data-ai="table"]').forEach(function (el) {
      var columnsAttr = el.getAttribute('data-columns');
      var dataSourceAttr = el.getAttribute('data-source');
      var columns = columnsAttr ? JSON.parse(columnsAttr) : [];
      var dataSource = dataSourceAttr ? JSON.parse(dataSourceAttr) : [];
      new AI.Table(el, { columns: columns, dataSource: dataSource });
    });

    // -- Tag: 可关闭/可点击标签
    document.querySelectorAll('[data-ai="tag"]').forEach(function (el) {
      new AI.Tag(el);
    });

    // -- Skeleton: 骨架屏
    document.querySelectorAll('[data-ai="skeleton"]').forEach(function (el) {
      var variant = el.getAttribute('data-variant') || 'text';
      // 纯数字属性转成 number，否则 inline style 会得到无单位的 "56" 而失效
      var dim = function (v) {
        return v != null && /^\d+(\.\d+)?$/.test(v) ? Number(v) : v;
      };
      var options = { variant: variant, active: el.getAttribute('data-active') !== 'false' };
      if (el.getAttribute('data-rows')) options.rows = parseInt(el.getAttribute('data-rows'), 10);
      if (el.getAttribute('data-width')) options.width = dim(el.getAttribute('data-width'));
      if (el.getAttribute('data-width-value')) options.widthValue = dim(el.getAttribute('data-width-value'));
      if (el.getAttribute('data-height-value')) options.heightValue = dim(el.getAttribute('data-height-value'));
      new AI.Skeleton(el, options);
    });

    // -- Progress: 进度条
    document.querySelectorAll('[data-ai="progress"]').forEach(function (el) {
      new AI.Progress(el);
    });
    document.querySelectorAll('.ai-progress[data-percent]').forEach(function (el) {
      if (!el.hasAttribute('data-ai')) new AI.Progress(el);
    });

    // -- Wallet: 钱包
    document.querySelectorAll('[data-ai="wallet"]').forEach(function (el) {
      new AI.Wallet(el);
    });
    document.querySelectorAll('.ai-wallet[data-value]').forEach(function (el) {
      if (!el.hasAttribute('data-ai')) new AI.Wallet(el);
    });

    // -- Radio: 单选组
    document.querySelectorAll('[data-ai="radio"]').forEach(function (el) {
      var options = {};
      var optsAttr = el.getAttribute('data-options');
      if (optsAttr) {
        try { options.options = JSON.parse(optsAttr); } catch (e) {}
      }
      var dirAttr = el.getAttribute('data-direction');
      if (dirAttr) options.direction = dirAttr;
      if (el.getAttribute('data-disabled') === 'true') options.disabled = true;
      var valAttr = el.getAttribute('data-value');
      if (valAttr != null) options.value = valAttr;
      new AI.Radio(el, options);
    });

    // -- Tooltip: 工具提示
    document.querySelectorAll('[data-ai="tooltip"]').forEach(function (el) {
      new AI.Tooltip(el);
    });

    // -- BackTop: 返回顶部
    document.querySelectorAll('[data-ai="backtop"]').forEach(function (el) {
      new AI.BackTop(el);
    });

    // -- Drawer: 抽屉（inline 模式）
    document.querySelectorAll('[data-ai="drawer"]').forEach(function (el) {
      new AI.Drawer(el);
    });

    // -- Form: 表单
    document.querySelectorAll('[data-ai="form"]').forEach(function (el) {
      new AI.Form(el);
    });

    // -- Avatar: 头像
    document.querySelectorAll('[data-ai="avatar"]').forEach(function (el) {
      if (el._aiAvatar) return;
      var options = {};
      var shape = el.getAttribute('data-shape');
      if (shape) options.shape = shape;
      var size = el.getAttribute('data-size');
      if (size) options.size = isNaN(Number(size)) ? size : Number(size);
      var src = el.getAttribute('data-src');
      if (src) options.src = src;
      var alt = el.getAttribute('data-alt');
      if (alt) options.alt = alt;
      var icon = el.getAttribute('data-icon');
      if (icon === 'null') options.icon = null;
      else if (icon) options.icon = icon;
      var text = el.getAttribute('data-text');
      if (text != null) options.text = text;
      new AI.Avatar(el, options);
    });

    // -- AvatarGroup: 头像组（items 通过 JS 传入）
    document.querySelectorAll('[data-ai="avatar-group"]').forEach(function (el) {
      if (el._aiAvatarGroup) return;
      var options = {};
      var maxCount = el.getAttribute('data-max-count');
      if (maxCount) options.maxCount = Number(maxCount);
      var gap = el.getAttribute('data-gap');
      if (gap) options.gap = Number(gap);
      var size = el.getAttribute('data-size');
      if (size) options.size = isNaN(Number(size)) ? size : Number(size);
      var shape = el.getAttribute('data-shape');
      if (shape) options.shape = shape;
      new AI.AvatarGroup(el, options);
    });

    // -- Badge: 徽标数
    document.querySelectorAll('[data-ai="badge"]').forEach(function (el) {
      if (el._aiBadge) return;
      var options = {};
      var count = el.getAttribute('data-count');
      if (count != null && count !== '') options.count = isNaN(Number(count)) ? count : Number(count);
      var overflow = el.getAttribute('data-overflow-count');
      if (overflow != null && overflow !== '') options.overflowCount = Number(overflow);
      if (el.getAttribute('data-show-zero')) options.showZero = true;
      if (el.getAttribute('data-dot')) options.dot = true;
      var size = el.getAttribute('data-size');
      if (size) options.size = size;
      var color = el.getAttribute('data-color');
      if (color) options.color = color;
      var title = el.getAttribute('data-title');
      if (title) options.title = title;
      new AI.Badge(el, options);
    });

    // -- NoData: 空态
    document.querySelectorAll('[data-ai="no-data"]').forEach(function (el) {
      if (el._aiNoData) return;
      var options = {};
      var variant = el.getAttribute('data-variant');
      if (variant) options.variant = variant;
      var size = el.getAttribute('data-size');
      if (size) options.size = size;
      var title = el.getAttribute('data-title');
      if (title === 'null') options.title = null;
      else if (title) options.title = title;
      var desc = el.getAttribute('data-description');
      if (desc) options.description = desc;
      var icon = el.getAttribute('data-icon');
      if (icon === 'null') options.icon = null;
      else if (icon) options.icon = icon;
      if (el.getAttribute('data-bordered')) options.bordered = true;
      var extra = el.getAttribute('data-extra');
      if (extra) options.extra = extra;
      new AI.NoData(el, options);
    });

    // -- Rate: 评分
    document.querySelectorAll('[data-ai="rate"]').forEach(function (el) {
      if (el._aiRate) return;
      var options = {};
      var value = el.getAttribute('data-value');
      if (value != null && value !== '') options.value = Number(value);
      var defaultValue = el.getAttribute('data-default-value');
      if (defaultValue != null && defaultValue !== '') options.defaultValue = Number(defaultValue);
      var count = el.getAttribute('data-count');
      if (count != null && count !== '') options.count = Number(count);
      var size = el.getAttribute('data-size');
      if (size) options.size = size;
      if (el.getAttribute('data-readonly') === 'true') options.readonly = true;
      if (el.getAttribute('data-allow-clear') === 'false') options.allowClear = false;
      new AI.Rate(el, options);
    });

    // -- Pagination: 分页
    document.querySelectorAll('[data-ai="pagination"]').forEach(function (el) {
      if (el._aiPagination) return;
      var options = {};
      var total = el.getAttribute('data-total');
      if (total != null && total !== '') options.total = Number(total);
      var current = el.getAttribute('data-current');
      if (current != null && current !== '') options.current = Number(current);
      var defaultCurrent = el.getAttribute('data-default-current');
      if (defaultCurrent != null && defaultCurrent !== '') options.defaultCurrent = Number(defaultCurrent);
      var pageSize = el.getAttribute('data-page-size');
      if (pageSize != null && pageSize !== '') options.pageSize = Number(pageSize);
      var defaultPageSize = el.getAttribute('data-default-page-size');
      if (defaultPageSize != null && defaultPageSize !== '') options.defaultPageSize = Number(defaultPageSize);
      if (el.getAttribute('data-show-size-changer') === 'true') options.showSizeChanger = true;
      var sizeOptions = el.getAttribute('data-page-size-options');
      if (sizeOptions) {
        try { options.pageSizeOptions = JSON.parse(sizeOptions); } catch (e) {}
      }
      if (el.getAttribute('data-show-quick-jumper') === 'true') options.showQuickJumper = true;
      if (el.getAttribute('data-show-total') === 'true') options.showTotal = true;
      if (el.getAttribute('data-disabled') === 'true') options.disabled = true;
      var variant = el.getAttribute('data-variant');
      if (variant) options.variant = variant;
      new AI.Pagination(el, options);
    });

    // -- Image: 图片（stampYear/preview 通过 data 属性传入）
    document.querySelectorAll('[data-ai="image"]').forEach(function (el) {
      if (el._aiImage) return;
      var options = {};
      var src = el.getAttribute('data-src');
      if (src) options.src = src;
      var alt = el.getAttribute('data-alt');
      if (alt != null) options.alt = alt;
      var width = el.getAttribute('data-width');
      if (width != null && width !== '') options.width = isNaN(Number(width)) ? width : Number(width);
      var height = el.getAttribute('data-height');
      if (height != null && height !== '') options.height = isNaN(Number(height)) ? height : Number(height);
      var color = el.getAttribute('data-color');
      if (color) options.color = color;
      var variant = el.getAttribute('data-variant');
      if (variant) options.variant = variant;
      var stampYear = el.getAttribute('data-stamp-year');
      if (stampYear) options.stampYear = stampYear;
      if (el.getAttribute('data-lazy') === 'true') options.lazy = true;
      if (el.getAttribute('data-preview') === 'false') options.preview = false;
      new AI.Image(el, options);
    });

    // -- Carousel: 轮播图
    document.querySelectorAll('[data-ai="carousel"]').forEach(function (el) {
      if (el._aiCarousel) return;
      var options = {};
      var items = el.getAttribute('data-items');
      if (items) {
        try { options.items = JSON.parse(items); } catch (e) {}
      }
      var defaultActive = el.getAttribute('data-default-active-index');
      if (defaultActive != null && defaultActive !== '') options.defaultActiveIndex = Number(defaultActive);
      if (el.getAttribute('data-autoplay') === 'true') options.autoplay = true;
      var interval = el.getAttribute('data-interval');
      if (interval != null && interval !== '') options.interval = Number(interval);
      if (el.getAttribute('data-loop') === 'false') options.loop = false;
      if (el.getAttribute('data-show-arrows') === 'false') options.showArrows = false;
      if (el.getAttribute('data-show-dots') === 'false') options.showDots = false;
      if (el.getAttribute('data-pause-on-hover') === 'false') options.pauseOnHover = false;
      var ariaLabel = el.getAttribute('data-aria-label');
      if (ariaLabel) options.ariaLabel = ariaLabel;
      new AI.Carousel(el, options);
    });

    // -- Countdown: 倒计时（value 为毫秒时间戳）
    document.querySelectorAll('[data-ai="countdown"]').forEach(function (el) {
      if (el._aiCountdown) return;
      var options = {};
      var value = el.getAttribute('data-value');
      if (value != null && value !== '') {
        // 支持 "now+15000" 相对写法与绝对时间戳
        if (value.indexOf('now+') === 0) options.value = Date.now() + Number(value.slice(4));
        else {
          var n = Number(value);
          if (!isNaN(n)) options.value = n;
        }
      }
      var format = el.getAttribute('data-format');
      if (format) options.format = format;
      var prefix = el.getAttribute('data-prefix');
      if (prefix) options.prefix = prefix;
      var size = el.getAttribute('data-size');
      if (size) options.size = size;
      var variant = el.getAttribute('data-variant');
      if (variant) options.variant = variant;
      if (el.getAttribute('data-bordered') === 'true') options.bordered = true;
      var reminder = el.getAttribute('data-reminder');
      if (reminder === 'true') options.reminder = true;
      else if (reminder && reminder !== 'false') {
        try { options.reminder = JSON.parse(reminder); } catch (e) {}
      }
      var shake = el.getAttribute('data-shake');
      if (shake === 'true') options.shake = true;
      else if (shake && shake !== 'false' && !isNaN(Number(shake))) options.shake = Number(shake);
      var ending = el.getAttribute('data-ending-animation');
      if (ending === 'true') options.endingAnimation = true;
      else if (ending && ending !== 'false' && ending.indexOf('{') === 0) {
        try { options.endingAnimation = JSON.parse(ending); } catch (e) {}
      }
      var finish = el.getAttribute('data-finish-animation');
      if (finish === 'true') options.finishAnimation = true;
      else if (finish && finish !== 'false' && finish.indexOf('{') === 0) {
        try { options.finishAnimation = JSON.parse(finish); } catch (e) {}
      }
      new AI.Countdown(el, options);
    });

    // -- CountUp: 数字滚动
    document.querySelectorAll('[data-ai="countup"]').forEach(function (el) {
      if (el._aiCountUp) return;
      var options = {};
      var start = el.getAttribute('data-start');
      if (start != null && start !== '') options.start = Number(start);
      var end = el.getAttribute('data-end');
      if (end != null && end !== '') options.end = Number(end);
      var duration = el.getAttribute('data-duration');
      if (duration != null && duration !== '') options.duration = Number(duration);
      if (el.getAttribute('data-is-counting') === 'true') options.isCounting = true;
      var decimalPlaces = el.getAttribute('data-decimal-places');
      if (decimalPlaces != null && decimalPlaces !== '') options.decimalPlaces = Number(decimalPlaces);
      var ds = el.getAttribute('data-decimal-separator');
      if (ds) options.decimalSeparator = ds;
      var ts = el.getAttribute('data-thousands-separator');
      if (ts != null) options.thousandsSeparator = ts;
      var easing = el.getAttribute('data-easing');
      if (easing) options.easing = easing;
      var updateInterval = el.getAttribute('data-update-interval');
      if (updateInterval != null && updateInterval !== '') options.updateInterval = Number(updateInterval);
      var prefix = el.getAttribute('data-prefix');
      if (prefix) options.prefix = prefix;
      var suffix = el.getAttribute('data-suffix');
      if (suffix) options.suffix = suffix;
      var size = el.getAttribute('data-size');
      if (size) options.size = size;
      var variant = el.getAttribute('data-variant');
      if (variant) options.variant = variant;
      if (el.getAttribute('data-bordered') === 'true') options.bordered = true;
      var celebrate = el.getAttribute('data-celebrate');
      if (celebrate === 'true') options.celebrate = true;
      else if (celebrate && celebrate !== 'false' && celebrate.indexOf('{') === 0) {
        try { options.celebrate = JSON.parse(celebrate); } catch (e) {}
      }
      new AI.CountUp(el, options);
    });

    document.querySelectorAll('[data-ai="upload"]').forEach(function (el) {
      if (el._aiUpload) return;
      var options = {};
      var listType = el.getAttribute('data-list-type');
      if (listType) options.listType = listType;
      var accept = el.getAttribute('data-accept');
      if (accept) options.accept = accept;
      if (el.getAttribute('data-multiple') === 'true') options.multiple = true;
      var maxCount = el.getAttribute('data-max-count');
      if (maxCount != null && maxCount !== '') options.maxCount = Number(maxCount);
      if (el.getAttribute('data-disabled') === 'true') options.disabled = true;
      if (el.getAttribute('data-directory') === 'true') options.directory = true;
      if (el.getAttribute('data-drag') === 'true') options.drag = true;
      var tip = el.getAttribute('data-tip');
      if (tip) options.tip = tip;
      var showList = el.getAttribute('data-show-upload-list');
      if (showList === 'false') options.showUploadList = false;
      else if (showList && showList.indexOf('{') === 0) {
        try { options.showUploadList = JSON.parse(showList); } catch (e) {}
      }
      var progress = el.getAttribute('data-progress');
      if (progress === 'false') options.progress = false;
      else if (progress && progress.indexOf('{') === 0) {
        try { options.progress = JSON.parse(progress); } catch (e) {}
      }
      var defaultList = el.getAttribute('data-default-file-list');
      if (defaultList && defaultList.indexOf('[') === 0) {
        try { options.defaultFileList = JSON.parse(defaultList); } catch (e) {}
      }
      var ariaLabel = el.getAttribute('data-aria-label');
      if (ariaLabel) options.ariaLabel = ariaLabel;
      // 内置 XHR 上传相关
      var action = el.getAttribute('data-action');
      if (action) options.action = action;
      var method = el.getAttribute('data-method');
      if (method) options.method = method;
      var fieldName = el.getAttribute('data-name');
      if (fieldName) options.name = fieldName;
      var extraData = el.getAttribute('data-data');
      if (extraData && extraData.indexOf('{') === 0) {
        try { options.data = JSON.parse(extraData); } catch (e) {}
      }
      if (el.getAttribute('data-with-credentials') === 'true') options.withCredentials = true;
      // children（自定义触发区 HTML）：取容器内 .ai-upload-custom-trigger 的内容
      var custom = el.querySelector('.ai-upload-custom-trigger');
      if (custom) options.children = custom.innerHTML;
      new AI.Upload(el, options);
    });

    document.querySelectorAll('[data-ai="background"]').forEach(function (el) {
      var type = el.getAttribute('data-type') || 'default';
      el.classList.add('ai-background');
      el.classList.add('ai-bg-' + type);
    });

    // -- DatePicker: 日期选择
    document.querySelectorAll('[data-ai="datepicker"]').forEach(function (el) {
      if (el._aiDatePicker) return;
      var options = {};
      if (el.getAttribute('data-range') === 'true') options.range = true;
      if (el.getAttribute('data-picker')) options.picker = el.getAttribute('data-picker');
      if (el.getAttribute('data-value')) options.value = el.getAttribute('data-value');
      if (el.hasAttribute('data-default-value')) options.defaultValue = el.getAttribute('data-default-value');
      if (el.getAttribute('data-placeholder')) options.placeholder = el.getAttribute('data-placeholder');
      if (el.getAttribute('data-disabled') === 'true') options.disabled = true;
      if (el.getAttribute('data-allow-clear') === 'true') options.allowClear = true;
      if (el.getAttribute('data-size')) options.size = el.getAttribute('data-size');
      if (el.getAttribute('data-status')) options.status = el.getAttribute('data-status');
      if (el.getAttribute('data-format')) options.format = el.getAttribute('data-format');
      if (el.getAttribute('data-show-today') === 'false') options.showToday = false;
      if (el.getAttribute('data-aria-label')) options.ariaLabel = el.getAttribute('data-aria-label');
      new AI.DatePicker(el, options);
    });

    // -- TimePicker: 时间选择
    document.querySelectorAll('[data-ai="timepicker"]').forEach(function (el) {
      if (el._aiTimePicker) return;
      var options = {};
      if (el.getAttribute('data-value')) options.value = el.getAttribute('data-value');
      if (el.hasAttribute('data-default-value')) options.defaultValue = el.getAttribute('data-default-value');
      if (el.getAttribute('data-placeholder')) options.placeholder = el.getAttribute('data-placeholder');
      if (el.getAttribute('data-disabled') === 'true') options.disabled = true;
      if (el.getAttribute('data-allow-clear') === 'true') options.allowClear = true;
      if (el.getAttribute('data-size')) options.size = el.getAttribute('data-size');
      if (el.getAttribute('data-status')) options.status = el.getAttribute('data-status');
      if (el.getAttribute('data-format')) options.format = el.getAttribute('data-format');
      var num = function (name) {
        var v = el.getAttribute('data-' + name);
        return v ? Number(v) : null;
      };
      if (num('hour-step')) options.hourStep = num('hour-step');
      if (num('minute-step')) options.minuteStep = num('minute-step');
      if (num('second-step')) options.secondStep = num('second-step');
      if (el.getAttribute('data-aria-label')) options.ariaLabel = el.getAttribute('data-aria-label');
      new AI.TimePicker(el, options);
    });

    // -- Calendar: 日历
    document.querySelectorAll('[data-ai="calendar"]').forEach(function (el) {
      if (el._aiCalendar) return;
      var options = {};
      if (el.getAttribute('data-value')) options.value = el.getAttribute('data-value');
      if (el.hasAttribute('data-default-value')) options.defaultValue = el.getAttribute('data-default-value');
      if (el.getAttribute('data-panel-value')) options.panelValue = el.getAttribute('data-panel-value');
      if (el.hasAttribute('data-default-panel-value')) options.defaultPanelValue = el.getAttribute('data-default-panel-value');
      if (el.getAttribute('data-show-event-time') === 'false') options.showEventTime = false;
      if (el.getAttribute('data-draggable-events') === 'true') options.draggableEvents = true;
      if (el.getAttribute('data-width')) options.width = /^\d+$/.test(el.getAttribute('data-width'))
        ? Number(el.getAttribute('data-width'))
        : el.getAttribute('data-width');
      if (el.getAttribute('data-events')) {
        try { options.events = JSON.parse(el.getAttribute('data-events')); } catch (err) { /* 忽略非法 JSON */ }
      }
      if (el.getAttribute('data-aria-label')) options.ariaLabel = el.getAttribute('data-aria-label');
      new AI.Calendar(el, options);
    });

    // -- Chart: 图表（data-options 传入完整配置）
    document.querySelectorAll('[data-ai="chart"]').forEach(function (el) {
      if (el._aiChart) return;
      var options = {};
      var raw = el.getAttribute('data-options') || el.getAttribute('data-chart');
      if (raw) {
        try { options = JSON.parse(raw) || {}; } catch (err) { options = {}; }
      }
      if (el.getAttribute('data-type') && !options.type) options.type = el.getAttribute('data-type');
      new AI.Chart(el, options);
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', AI.autoInit);
  } else {
    AI.autoInit();
  }

  global.AnimalIsland = AI;

})(typeof window !== 'undefined' ? window : this);
