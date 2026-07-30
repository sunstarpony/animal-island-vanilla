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
  AI.Time = function (el) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    if (!this.el) return;

    this.weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    this.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    this._render();
    this._timer = setInterval(this._render.bind(this), 1000);
  };

  AI.Time.prototype._render = function () {
    var now = new Date();
    var weekday = this.weekdays[now.getDay()];
    var month = this.months[now.getMonth()];
    var day = now.getDate();
    var hours = String(now.getHours()).padStart(2, '0');
    var minutes = String(now.getMinutes()).padStart(2, '0');

    this.el.innerHTML =
      '<div class="ai-time__date">' +
        '<span class="ai-time__weekday">' + weekday + '</span>' +
        '<span class="ai-time__monthday">' + month + ' ' + day + '</span>' +
      '</div>' +
      '<div class="ai-time__clock">' +
        hours +
        '<span class="ai-time__colon">:</span>' +
        minutes +
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
      var clearBtn = document.createElement('span');
      clearBtn.className = 'ai-input__clear';
      clearBtn.textContent = '×';
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
      this.clearBtn.addEventListener('click', this._onClear.bind(this));
    }

    this._updateClearVisibility();
    this.el.addEventListener('input', this._updateClearVisibility.bind(this));
    this.el.addEventListener('focus', this._onFocus.bind(this));
    this.el.addEventListener('blur', this._onBlur.bind(this));
  };

  AI.Input.prototype._onClear = function () {
    this.el.value = '';
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

    // Apply defaultValue: pre-check items whose data-value is in the array
    var defaultValues = this.options.defaultValue || [];
    if (defaultValues.length) {
      this.el.querySelectorAll('.ai-checkbox-item').forEach(function (item) {
        var val = item.getAttribute('data-value');
        if (defaultValues.indexOf(val) !== -1 && !item.classList.contains('ai-checkbox-item--disabled')) {
          item.classList.add('ai-checkbox-item--checked');
          var checkmark = item.querySelector('.ai-checkbox-checkmark');
          if (checkmark) checkmark.style.display = 'flex';
        }
      });
    }

    // Apply group disabled
    if (this.options.disabled) {
      this.el.classList.add('ai-checkbox-group--disabled');
    }

    // Apply direction
    if (this.options.direction === 'vertical') {
      this.el.classList.add('ai-checkbox-group--vertical');
    }

    this.el.addEventListener('click', this._onClick.bind(this));
    this.el.addEventListener('keydown', this._onKeydown.bind(this));
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
    item.classList.toggle('ai-checkbox-item--checked');
    var checkmark = item.querySelector('.ai-checkbox-checkmark');
    if (checkmark) {
      checkmark.style.display = item.classList.contains('ai-checkbox-item--checked') ? 'flex' : 'none';
    }
    var values = this.getValues();
    this.el.dispatchEvent(new CustomEvent('ai-checkbox-change', { detail: { values: values }, bubbles: true }));
    if (this.onChange) this.onChange(values);
  };

  AI.Checkbox.prototype.getValues = function () {
    var values = [];
    this.el.querySelectorAll('.ai-checkbox-item--checked').forEach(function (item) {
      values.push(item.getAttribute('data-value'));
    });
    return values;
  };

  /* ============================================
     Switch — 开关
     ============================================ */
  AI.Switch = function (el, options) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    if (!this.el) return;

    this.options = options || {};
    this.onChange = this.options.onChange || null;

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

    // Apply loading state
    if (this.options.loading || this.el.classList.contains('ai-switch--loading')) {
      this.el.classList.add('ai-switch--loading');
      var handle = this.el.querySelector('.ai-switch__handle');
      if (handle && !handle.querySelector('.ai-switch__spinner')) {
        var spinner = document.createElement('span');
        spinner.className = 'ai-switch__spinner';
        handle.appendChild(spinner);
      }
    }

    // Apply checked text
    var isChecked = this.el.classList.contains('ai-switch--checked');
    var innerEl = this.el.querySelector('.ai-switch__inner');
    if (innerEl) {
      var checkedText = this.el.getAttribute('data-checked-text') || this.options.checkedChildren || '';
      var uncheckedText = this.el.getAttribute('data-unchecked-text') || this.options.unCheckedChildren || '';
      innerEl.textContent = isChecked ? checkedText : uncheckedText;
    }

    this.el.addEventListener('click', this._onClick.bind(this));
  };

  AI.Switch.prototype._onClick = function () {
    if (this.el.classList.contains('ai-switch--disabled') ||
        this.el.classList.contains('ai-switch--loading')) return;

    this.el.classList.toggle('ai-switch--checked');
    var isChecked = this.el.classList.contains('ai-switch--checked');
    this.el.setAttribute('aria-checked', isChecked);

    var inner = this.el.querySelector('.ai-switch__inner');
    if (inner) {
      var checkedText = this.el.getAttribute('data-checked-text') || this.options.checkedChildren || '';
      var uncheckedText = this.el.getAttribute('data-unchecked-text') || this.options.unCheckedChildren || '';
      inner.textContent = isChecked ? checkedText : uncheckedText;
    }

    this.el.dispatchEvent(new CustomEvent('ai-switch-change', { detail: { checked: isChecked }, bubbles: true }));
    if (this.onChange) this.onChange(isChecked);
  };

  /* ============================================
     Select — 下拉选择（含 option-dot）
     ============================================ */
  AI.Select = function (el, options) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    if (!this.el) return;

    this.options = options || {};
    this.onChange = this.options.onChange || null;
    this.placeholder = this.el.getAttribute('data-placeholder') || '请选择';
    this.isOpen = false;

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

    // Mark active option from data-value
    var currentValue = this.el.getAttribute('data-value');
    if (currentValue) {
      var activeOpt = this.dropdown.querySelector('.ai-select__option[data-key="' + currentValue + '"]');
      if (activeOpt) {
        activeOpt.classList.add('ai-select__option--active');
        var pill = activeOpt.querySelector('.ai-select__pill');
        if (pill) pill.style.display = 'block';
      }
    }

    this.trigger.addEventListener('click', this._toggle.bind(this));
    this.dropdown.addEventListener('click', this._onSelect.bind(this));
    this.dropdown.addEventListener('mouseover', this._onHover.bind(this));
    document.addEventListener('click', this._onClickOutside.bind(this));
  };

  AI.Select.prototype._toggle = function () {
    if (this.el.classList.contains('ai-select--disabled')) return;
    this.isOpen ? this._close() : this._open();
  };

  AI.Select.prototype._open = function () {
    this.isOpen = true;
    this.trigger.classList.add('ai-select__trigger--open');
    this.dropdown.style.display = 'block';

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

  AI.Select.prototype._close = function () {
    this.isOpen = false;
    this.dropdown.classList.add('ai-select__dropdown--closing');
    setTimeout(function () {
      this.dropdown.style.display = 'none';
      this.dropdown.classList.remove('ai-select__dropdown--closing');
      this.trigger.classList.remove('ai-select__trigger--open');
    }.bind(this), 150);
  };

  AI.Select.prototype._onSelect = function (e) {
    var option = e.target.closest('.ai-select__option');
    if (!option) return;

    var key = option.getAttribute('data-key');
    var labelEl = option.querySelector('.ai-select__option-label');
    var label = labelEl ? labelEl.textContent : option.textContent.trim();

    // Clear previous active
    this.dropdown.querySelectorAll('.ai-select__option').forEach(function (opt) {
      opt.classList.remove('ai-select__option--active');
      var pill = opt.querySelector('.ai-select__pill');
      if (pill) pill.style.display = 'none';
    });

    // Set new active
    option.classList.add('ai-select__option--active');
    var pill = option.querySelector('.ai-select__pill');
    if (pill) pill.style.display = 'block';

    if (this.valueEl) {
      this.valueEl.textContent = label;
      this.valueEl.style.display = '';
    }
    if (this.placeholderEl) {
      this.placeholderEl.style.display = 'none';
    }

    this.el.setAttribute('data-value', key);
    this._close();

    this.el.dispatchEvent(new CustomEvent('ai-select-change', { detail: { key: key, label: label }, bubbles: true }));

    if (this.onChange) this.onChange(key);
  };

  AI.Select.prototype._onHover = function (e) {
    var option = e.target.closest('.ai-select__option');
    if (!option) return;
    this.dropdown.querySelectorAll('.ai-select__option').forEach(function (opt) {
      opt.classList.remove('ai-select__option--hovered');
    });
    option.classList.add('ai-select__option--hovered');
  };

  AI.Select.prototype._onClickOutside = function (e) {
    if (this.isOpen && !this.el.contains(e.target)) {
      this._close();
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
    this.leafAnimation = this.options.leafAnimation !== undefined ? this.options.leafAnimation : (this.tabList.querySelector('.ai-tabs__item--active-leaf') !== null);
    this.shadow = this.options.shadow !== undefined ? this.options.shadow : (this.tabList.querySelector('.ai-tabs__item--active.ai-tabs__item--active-shadow') !== null);

    this.tabList = this.el.querySelector('.ai-tabs__list');
    if (!this.tabList) return;

    this.tabList.addEventListener('click', this._onClick.bind(this));

    var activeTab = this.tabList.querySelector('.ai-tabs__item--active');
    if (!activeTab) {
      var firstTab = this.tabList.querySelector('.ai-tabs__item');
      if (firstTab) this._activate(firstTab);
    } else {
      this._addLeaf(activeTab);
    }
  };

  AI.Tabs.prototype._onClick = function (e) {
    var tab = e.target.closest('.ai-tabs__item');
    if (!tab) return;
    this._activate(tab);
    if (this.onChange) this.onChange(tab.getAttribute('data-key'));
  };

  AI.Tabs.prototype._activate = function (tab) {
    this.tabList.querySelectorAll('.ai-tabs__item').forEach(function (t) {
      t.classList.remove('ai-tabs__item--active', 'ai-tabs__item--active-shadow', 'ai-tabs__item--active-leaf');
      var leaf = t.querySelector('.ai-tabs__leaf');
      if (leaf) leaf.remove();
      var icon = t.querySelector('.ai-tabs__icon');
      if (icon) icon.textContent = '○';
    });

    tab.classList.add('ai-tabs__item--active');
    if (this.shadow) tab.classList.add('ai-tabs__item--active-shadow');
    if (this.leafAnimation) tab.classList.add('ai-tabs__item--active-leaf');

    var activeIcon = tab.querySelector('.ai-tabs__icon');
    if (activeIcon) activeIcon.textContent = '●';

    this._addLeaf(tab);

    var key = tab.getAttribute('data-key');
    this.el.querySelectorAll('.ai-tabs__panel').forEach(function (panel) {
      panel.style.display = panel.getAttribute('data-key') === key ? 'block' : 'none';
    });

    this.el.dispatchEvent(new CustomEvent('ai-tabs-change', { detail: { key: key }, bubbles: true }));
  };

  AI.Tabs.prototype._addLeaf = function (tab) {
    var leaf = document.createElement('img');
    leaf.className = 'ai-tabs__leaf' + (this.leafAnimation ? '' : ' ai-tabs__leaf--static');
    leaf.src = 'assets/img/icons/icon-leaf.png';
    leaf.alt = '';
    tab.appendChild(leaf);
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

    this._render();
  };

  AI.Table.prototype._render = function () {
    var isScrollable = this.scroll && (this.scroll.x || this.scroll.y);
    var wrapperCls = 'ai-table-wrapper' + (isScrollable ? ' ai-table-wrapper--scrollable' : '');

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
      for (var r = 0; r < this.dataSource.length; r++) {
        var record = this.dataSource[r];
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
    this.el.innerHTML = html;

    // Bind onRow click handlers after render
    if (this.onRow) {
      var self = this;
      this.el.querySelectorAll('.ai-table__row').forEach(function (row, idx) {
        var rowProps = self.onRow(self.dataSource[idx], idx);
        if (rowProps && rowProps.onClick) {
          row.__onRowClick = function () { rowProps.onClick(); };
          row.addEventListener('click', row.__onRowClick);
        }
      });
    }
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
    // footer: undefined = default buttons, null = hidden, string = custom HTML
    this.footer = this.options.footer !== undefined ? this.options.footer : undefined;
    this.onOk = this.options.onOk || null;
    this.onClose = this.options.onClose || null;
    this.typewriter = this.options.typewriter !== false;
    this.typeSpeed = this.options.typeSpeed || 80;
    this.cursor = this.options.cursor !== false;

    this.mask = null;
    this._escHandler = null;
  };

  AI.Modal.prototype.open = function () {
    if (this.mask) return;

    if (!document.getElementById('ai-modal-clip')) {
      var svgDef = document.createElement('div');
      svgDef.style.cssText = 'position:absolute;width:0;height:0';
      svgDef.setAttribute('aria-hidden', 'true');
      svgDef.innerHTML =
        '<svg><clipPath id="ai-modal-clip" clipPathUnits="objectBoundingBox">' +
        '<path d="M0.501,0.005 L0.501,0.005 L0.523,0.005 L0.549,0.006 C0.704,0.01,0.796,0.017,0.825,0.027 L0.827,0.028 C0.872,0.045,0.939,0.044,0.978,0.17 C1,0.254,1,0.365,0.99,0.505 L0.988,0.513 C0.979,0.558,0.971,0.598,0.965,0.633 C0.956,0.689,0.979,0.77,0.964,0.865 C0.953,0.928,0.921,0.966,0.869,0.979 C0.821,0.986,0.773,0.992,0.726,0.995 L0.712,0.996 L0.694,0.997 C0.648,1,0.586,1,0.507,1 L0.501,1 L0.464,1 C0.385,1,0.325,0.998,0.283,0.995 C0.234,0.992,0.184,0.987,0.133,0.979 C0.081,0.966,0.05,0.928,0.039,0.865 C0.023,0.77,0.047,0.689,0.037,0.633 C0.031,0.595,0.023,0.552,0.013,0.505 C-0.006,0.365,-0.002,0.254,0.024,0.17 C0.064,0.045,0.13,0.045,0.174,0.028 L0.175,0.028 C0.204,0.017,0.303,0.009,0.474,0.005 L0.501,0.005" />' +
        '</clipPath></svg>';
      document.body.appendChild(svgDef);
    }

    this.mask = document.createElement('div');
    this.mask.className = 'ai-modal-mask';

    var cursorWrapper = this.cursor ? document.createElement('div') : null;
    if (cursorWrapper) cursorWrapper.className = 'ai-cursor--force';

    var modal = document.createElement('div');
    modal.className = 'ai-modal';
    modal.style.width = this.width + 'px';

    var clipped = document.createElement('div');
    clipped.className = 'ai-modal__clipped';

    if (this.title) {
      var header = document.createElement('div');
      header.className = 'ai-modal__header';
      header.innerHTML =
        '<div class="ai-modal__title">' + this.title + '</div>' +
        '<button class="ai-modal__close">&times;</button>';
      clipped.appendChild(header);
      header.querySelector('.ai-modal__close').addEventListener('click', this.close.bind(this));
    }

    var body = document.createElement('div');
    body.className = 'ai-modal__body';
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
          '<button class="ai-modal__footer-btn">取消</button>' +
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

    modal.addEventListener('click', function (e) {
      e.stopPropagation();
    });

    this.mask.addEventListener('click', function (e) {
      if (this.maskClosable && e.target === this.mask) this.close();
    }.bind(this));

    this._escHandler = function (e) {
      if (e.key === 'Escape') this.close();
    }.bind(this);
    document.addEventListener('keydown', this._escHandler);

    document.body.style.overflow = 'hidden';

    if (this.typewriter) {
      var tw = body.querySelector('.ai-typewriter');
      if (tw) new AI.Typewriter(tw, this.content, this.typeSpeed);
    }
  };

  AI.Modal.prototype.close = function () {
    if (!this.mask) return;
    document.body.style.overflow = '';
    if (this._escHandler) document.removeEventListener('keydown', this._escHandler);
    this.mask.remove();
    this.mask = null;
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
      this.speed = this.options.speed || 80;
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
    this.active = this.options.active !== false;
    this._animStarted = false;
    this._fishRafId = null;

    this._render();
    if (this.active) this._startAnimation();
  };

  AI.Loading.SVG_CONTENT = '<svg viewBox="0 0 446 540" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" class="illustration"><defs><path id="wave-segment" d="M78.238,447.196C99.161,447.224 102.365,433.986 117.183,433.986C132.006,433.986 138.546,447.165 154.302,447.165C170.057,447.165 179.54,433.877 192.035,433.877C204.53,433.877 212.069,447.271 228.234,447.2L228.238,447.2L228.238,456.742L174.344,456.758L78.238,456.773L78.238,447.196Z" style="fill:rgb(186,228,240);"></path><path id="fish-path" d="M13.805,497.326C13.805,497.384 14.676,454.6 14.676,454.6C15.117,447.421 27.398,371.652 61.333,371.652C95.268,371.652 105.059,451.758 105.059,454.992C105.059,458.227 106.846,496.252 106.846,496.252"></path></defs><g id="scene"><mask id="fish-mask"><rect x="0" y="291" width="230" height="122" style="fill:white;"></rect></mask><mask id="leaves"><path id="leaf3" d="M240.331,175.61C249.784,176.339 250.158,149.143 251.971,143.795C253.784,138.446 265.447,112.749 300.347,88.992C309.312,82.889 273.249,84.744 262.701,95.4C262.408,95.697 299.949,59.14 306.273,31.167C307.299,26.628 249.717,36.275 232.63,81.142C222.01,109.028 230.879,174.881 240.331,175.61Z" style="fill:white;"></path><path id="leaf4" d="M235.235,178.598C230.936,186.776 266.297,154.023 318.903,172.056C323.277,173.556 316.664,157.916 303.38,150.707C300.853,149.335 357.48,165.86 365.744,172.947C369.234,175.941 366.977,149.035 343.343,139.012C342.972,138.854 395.083,146.153 405.989,149.98C402.419,131.963 371.178,102.148 331.289,103.467C302.148,104.431 250.238,129.248 235.235,178.598Z" style="fill:white;"></path><path id="leaf5" d="M225.34,183.401C242.089,183.539 293.669,185.304 293.267,235.202C301.036,226.747 302.632,218.437 301.053,208.836C307.555,214.258 316.799,229.731 326.228,250.463C335.015,247.135 333.311,224.064 332.455,221.081C331.599,218.098 353.49,248.751 367.144,253.999C374.306,246.977 367.541,201.115 334.573,182.932C301.604,164.749 252.16,164.232 222.521,178.152C219.051,180.584 208.59,183.263 225.34,183.401Z" style="fill:white;"></path><path id="leaf2" d="M258.286,187.293C240.185,184.835 213.891,161.373 191.899,150.057C181.762,144.841 155.131,147.377 152.51,147.063C149.889,146.749 160.892,131.003 174.394,130.585C148.357,121.905 126.027,133.793 123.824,131.978C121.622,130.162 125.177,116.202 149.97,106.951C148.994,105.186 114.646,110.911 94.891,95.692C89.271,91.895 124.581,66.427 144.554,68.645C164.527,70.862 192.389,70.409 230.889,143.333C236.093,156.138 252.386,169.599 252.386,169.599C259.636,174.413 265.589,189.696 258.286,187.293Z" style="fill:white;"></path><path id="leaf1" d="M258.286,187.293C240.185,184.835 210.105,169.378 185.032,211.545C181.648,215.311 177.193,210.024 179.458,194.986C169.272,211.871 150.363,232.47 145.605,231.801C140.847,231.132 144.651,202.538 148.831,194.882C141.881,190.227 118.57,237.947 114.874,238.097C104.523,239.756 100.911,141.41 191.899,150.057C234.088,154.067 252.386,169.599 252.386,169.599C259.636,174.413 265.589,189.696 258.286,187.293Z" style="fill:white;"></path></mask><mask id="water-mask"><path id="water-mask-path" d="M357.315,457.852C357.437,447.646 336.649,432.68 329.793,430.146C322.936,427.612 314.374,428.513 238.56,428.513C162.746,428.513 145.106,431.336 137.885,433.152C120.949,437.411 109.195,447.259 109.195,458.368C109.195,465.163 130.018,472.394 230.463,472.394C330.908,472.394 357.193,468.059 357.315,457.852Z" style="fill:white;"></path></mask><ellipse id="water-circle1" cx="232.22" cy="476.77" rx="98.92" ry="27.85" fill="#12b2da"></ellipse><ellipse id="water-circle2" cx="258.15" cy="505.32" rx="73.8" ry="18.22" fill="#12b2da"></ellipse><g mask="url(#fish-mask)"><path mask="url(#fish-mask)" id="fish" d="M50.84 379.73a.82.82 0 001.19 1.08c4.62-3.66 8.38-6.75 12.4-6.27 4.93.6 7.64 4.13 11.17 7.58 3.54 3.46 12.51 5.33 15.32 1.09 2.81-4.25.94-12.5-3.43-15.8-4.1-3.11-15.71-5.28-23.96-.09a40.6 40.6 0 00-12.7 12.41z" fill="#0793b8"></path></g><g id="tri-wave2" fill="#2ec3ec"><path d="M32.73 413.4a1.27 1.27 0 012.05.01l21.54 29.41a1.27 1.27 0 01-1.02 2.02H12.03a1.27 1.27 0 01-1.02-2.02l21.72-29.41z"></path><path d="M76.46 413.4a1.27 1.27 0 012.04.01l21.55 29.41a1.27 1.27 0 01-1.02 2.02H55.76a1.27 1.27 0 01-1.02-2.02l21.72-29.41z"></path><path d="M120.35 413.4a1.27 1.27 0 012.04.01l21.55 29.41a1.27 1.27 0 01-1.03 2.02H99.66a1.27 1.27 0 01-1.02-2.02l21.72-29.41z"></path></g><g id="whole-island"><g id="tree"><g id="trunk"><path d="M213.22 300.79c5.11-16.37 25.14-63.35 19.41-78.67-2.73-6.27-5.74 4.48-7.08 6.09-1.33 1.61-9.85-17.34-13.5-17.37-3.66-.02-2.22 4.79-6.04 3.71-3.82-1.07-11.66-5.68-6.03-12.13 3.44-4.26-.36-7.98-7.01-8.9-6.66-.9 3.72-18.2 10.99-20.22 7.26-2 48.02-11.76 69.87 9.27 13.25 12.6 10.28 12.74 6.7 13.47-3.58.72-8.31-1.49-9.12.87-.81 2.36-.34 7.25-4.09 10.01s-13.19 6.65-12.11 8.26c1.08 1.6 15.9 56.5 2.36 89.27-18.8-.05-47.45 1.59-44.35-3.66z" fill="#e5b13b"></path><path d="M255.2 215.18c.68 1-3.42-2-9.85-1.73-3.92.16-11.38 3.5-12.72 8.68-2.73-6.28-5.74 4.47-7.08 6.08-1.33 1.61-9.85-17.34-13.5-17.37-3.66-.02-7.84-13.08-14.36-16.05-4.95-2.25 16.2-13.42 28.46-12.84 7.91.37 33.58 2.68 42.53 8.4 4.54 2.9 3.46 5.03 1.77 12.55-1.34 5.94-16.32 10.67-15.24 12.28zM261.06 242.04c.85 5.74 1.55 12.04 1.92 18.54l-4.57 4.63-4.45-10.34-9.79 11.7-6.07-9.77-6.5 10.4-5.44-3.51c1.88-5.83 3.61-11.7 4.93-17.21l6.36-6.74 7.26 6.83 9.3-8.82 7.05 4.3z" fill="#f2e390"></path><path d="M224.3 199.7c9.25-4.05 13.24 13.88 4.94 17.24-8.3 3.36-12.8-13.8-4.93-17.25zM247.78 186.94c5.3-8.59 18.79 3.88 13.88 11.37-4.91 7.5-18.4-4.05-13.88-11.37z" fill="#e5b13b"></path></g><g id="leaf-bg" mask="url(#leaves)"><path fill="#ABD25E" d="M52.91 2.99h386.67V280.6H52.91z"></path><ellipse cx="236.41" cy="137.75" rx="125.06" ry="80.87" fill="#8cc751"></ellipse></g></g><g id="island"><path id="island-dirt" d="M344.8 381.58c-3.22-6.65-224.38-19.67-224.1 12.27v9.44c0 23 7.75 44.2 20.79 61.13 2.87 4.2 177.12 3.56 182.8.64a99.87 99.87 0 0021.3-61.77c0-18.04.38-19.29-.78-21.7z" fill="#fed09d"></path><path id="island-dirt1" d="M283.82 374.64c33.92 1.72 59.9 4.7 60.99 6.94 1.16 2.42.77 3.67.77 21.71a99.87 99.87 0 01-21.28 61.77c-1.62.83-16.96 1.48-38.1 1.88a340.61 340.61 0 002.05-37.63 333.1 333.1 0 00-4.43-54.67z" fill="#fbb381" fill-opacity=".97"></path><path d="M258.9 393.96s-5.6 48.68-12 63.21c-6.39 14.53.83-57.2-7.37-76.36-8.21-19.16 19.36 13.15 19.36 13.15zM132.09 380.06s7.16 63.86 33.56 86.93c7.92.12 16.42.15 16.42.15s-29.56-66.88-25.57-83.3c-9.14-3.15-24.41-3.78-24.41-3.78z" fill="#fbb381"></path><path id="Grass" d="M207.31 296.89c1.53-5.52 4.13-14.63 5.08-15.86 1.37-1.8 11.24 11.8 13 12.45 1.77.66 10.36-9.54 12.57-10.46 2.2-.92 13.4 10.9 15 11.69 1.6.79 15.09-13.1 16.87-12.77 1.2.22 1.9 10.6 2.47 17.92 60.25 15.2 73 64.26 73.43 88.25-3.87-.2-8.18 8.96-12.77 10.35-4.6 1.39-16.02-4.5-20.17-3.32-4.16 1.19-14.83 10.42-19.82 10.7-4.99.28-11.34-6.23-16-5.48-4.67.74-12.37 8.56-18.45 8.5-6.08-.08-9.08-6.6-15.72-6.59-6.65.03-16.76 8.65-20.3 9-3.54.37-12.63-10.06-17.24-9.74-4.62.32-13.67 8.36-18.57 8.2-4.91-.16-12.44-9.97-16.59-9.58-4.14.4-15.47 7.5-19.98 5.96-4.5-1.55-7.6-10.46-14.42-11.45-6.78-1-8.81 1.85-15.6 1.53.9-30.06 12.28-88.8 87.21-99.3z" fill="#8cc751"></path><g id="grass-shapes"><path d="M187.54 351.45a1.26 1.26 0 011.9-.61l23.64 15.98a1.26 1.26 0 01-.31 2.24c-6.9 2.24-26.46 8.6-33.37 10.86a1.26 1.26 0 01-1.57-1.63l9.71-26.84zM246.08 320.07a1.26 1.26 0 011.97.2l15.04 24.27a1.26 1.26 0 01-1.2 1.91l-34.9-3.75a1.26 1.26 0 01-.76-2.12l19.85-20.51zM278.82 342.07c.04-.37.25-.72.58-.93.32-.22.72-.27 1.08-.15l26.67 8.65c.45.15.77.54.82 1 .06.47-.16.93-.57 1.2l-29.33 19.25c-.4.27-.91.28-1.32.05a1.2 1.2 0 01-.6-1.15l2.68-27.92z" fill="#bbd86a"></path><path d="M295.38 308.3A90 90 0 01323.55 330l-43.68-5.05a1.63 1.63 0 01-1.32-.92c-.21-.49-.08-1.03.33-1.39l16.5-14.33z" fill="#78bb4d"></path><path d="M164.06 311.45l6.7 5.53c.43.34.57.88.37 1.38-.2.5-.7.86-1.3.95l-19.9 2.83a85.74 85.74 0 0114.13-10.7z" fill="#bbd86a"></path><path id="Grass1" d="M134.1 342.3l26.84-.64c.51-.02.99.2 1.22.55.23.35.19.77-.12 1.09l-18.3 18.9c-.24.25-.63.4-1.04.42-.42 0-.81-.13-1.07-.38l-11.92-11.2a94.53 94.53 0 014.4-8.75z" fill="#78bb4d"></path><path d="M198.96 298.3l2.04 9.27c.09.39-.06.79-.37 1.03s-.74.29-1.1.11l-14.2-6.87c4.26-1.38 8.8-2.56 13.63-3.53z" fill="#bbd86a"></path><path d="M331.63 375.4a.9.9 0 01-.56.38.9.9 0 01-.67-.1l-13.5-8.62a.54.54 0 01-.23-.64.84.84 0 01.62-.52l21.78-5.07c.3-.07.6 0 .79.19.18.18.2.44.06.67l-8.29 13.7zM208.4 334.54a.81.81 0 01-.69.12.81.81 0 01-.54-.44c-1.36-2.99-6.69-13.48-8.36-17.14a.74.74 0 01.12-.8.8.8 0 01.8-.24l21.68 5.65c.3.08.52.31.59.6a.74.74 0 01-.3.76c-3.23 2.38-10.65 9.55-13.3 11.49z" fill="#78bb4d"></path></g></g></g><path id="front-water" d="M357.31 457.85c-.49-8.02-19.23-9.86-34.35-8.83-7.3.5-11.12 5.67-86.93 5.67-75.82 0-101.03-6.83-109.88-6.76-7.44.06-16.96 3.64-16.96 10.44 0 6.8 20.83 14.02 121.27 14.02 100.45 0 127.48-4.35 126.85-14.54z" fill="#bae4f0"></path><g id="tri-wave1" fill="#2ec3ec"><path d="M366.29 502.93a1.27 1.27 0 012.04 0l21.55 29.42a1.27 1.27 0 01-1.03 2.02h-43.27a1.27 1.27 0 01-1.01-2.02l21.72-29.42z"></path><path d="M322.56 502.93a1.27 1.27 0 012.04 0l21.55 29.42a1.27 1.27 0 01-1.02 2.02h-43.27a1.27 1.27 0 01-1.02-2.02l21.72-29.42zM410.18 502.93a1.27 1.27 0 012.04 0l21.54 29.42a1.27 1.27 0 01-1.02 2.02h-43.27a1.27 1.27 0 01-1.02-2.02l21.73-29.42z"></path></g><g mask="url(#water-mask)" id="sine-wave-group"><use href="#wave-segment" id="wave-segment-0" x="-150"></use><use href="#wave-segment" id="wave-segment-1"></use><use href="#wave-segment" id="wave-segment-2" x="150"></use><use href="#wave-segment" id="wave-segment-3" x="3000"></use></g></g></svg>';

  AI.Loading.prototype._render = function () {
    this.el.innerHTML =
      '<div class="ai-loading">' +
        '<div class="ai-loading__container"' + (this.active ? '' : ' style="display:none"') + '>' +
          AI.Loading.SVG_CONTENT +
        '</div>' +
      '</div>';
    this.container = this.el.querySelector('.ai-loading__container');
  };

  /* SVG path parser — 解析 SVG path d 属性为点数组 */
  AI.Loading._parsePath = function (d) {
    var commands = [];
    var re = /([MmLlHhVvCcSsQqTtAaZz])([^MmLlHhVvCcSsQqTtAaZz]*)/g;
    var m;
    while ((m = re.exec(d)) !== null) {
      commands.push({ cmd: m[1], args: m[2].trim().split(/[\s,]+/).filter(function (s) { return s !== ''; }).map(Number) });
    }
    var points = [];
    var cx = 0, cy = 0, sx = 0, sy = 0;
    for (var i = 0; i < commands.length; i++) {
      var c = commands[i], cmd = c.cmd, a = c.args;
      switch (cmd) {
        case 'M': cx = a[0]; cy = a[1]; sx = cx; sy = cy; points.push({ x: cx, y: cy }); break;
        case 'm': cx += a[0]; cy += a[1]; sx = cx; sy = cy; points.push({ x: cx, y: cy }); break;
        case 'L':
          for (var j = 0; j < a.length; j += 2) { cx = a[j]; cy = a[j + 1]; points.push({ x: cx, y: cy }); }
          break;
        case 'l':
          for (var j = 0; j < a.length; j += 2) { cx += a[j]; cy += a[j + 1]; points.push({ x: cx, y: cy }); }
          break;
        case 'H': cx = a[0]; points.push({ x: cx, y: cy }); break;
        case 'h': cx += a[0]; points.push({ x: cx, y: cy }); break;
        case 'V': cy = a[0]; points.push({ x: cx, y: cy }); break;
        case 'v': cy += a[0]; points.push({ x: cx, y: cy }); break;
        case 'C':
          for (var j = 0; j < a.length; j += 6) {
            var x0 = cx, y0 = cy, x1 = a[j], y1 = a[j + 1], x2 = a[j + 2], y2 = a[j + 3], x3 = a[j + 4], y3 = a[j + 5];
            var steps = Math.max(8, Math.ceil(Math.hypot(x3 - x0, y3 - y0) / 5));
            for (var s = 1; s <= steps; s++) {
              var t = s / steps, u = 1 - t;
              points.push({
                x: u * u * u * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3,
                y: u * u * u * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3
              });
            }
            cx = x3; cy = y3;
          }
          break;
        case 'c':
          for (var j = 0; j < a.length; j += 6) {
            var x0 = cx, y0 = cy, x1 = cx + a[j], y1 = cy + a[j + 1], x2 = cx + a[j + 2], y2 = cy + a[j + 3], x3 = cx + a[j + 4], y3 = cy + a[j + 5];
            var steps = Math.max(8, Math.ceil(Math.hypot(x3 - x0, y3 - y0) / 5));
            for (var s = 1; s <= steps; s++) {
              var t = s / steps, u = 1 - t;
              points.push({
                x: u * u * u * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3,
                y: u * u * u * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3
              });
            }
            cx = x3; cy = y3;
          }
          break;
        case 'Z': case 'z': cx = sx; cy = sy; break;
      }
    }
    return points;
  };

  /* 沿路径点数组按 t(0~1) 取坐标和角度 */
  AI.Loading._samplePath = function (points, t) {
    if (points.length < 2) return { x: 0, y: 0, angle: 0 };
    t = Math.max(0, Math.min(1, t));
    var idx = t * (points.length - 1);
    var i = Math.floor(idx);
    var frac = idx - i;
    if (i >= points.length - 1) { i = points.length - 2; frac = 1; }
    var p0 = points[i], p1 = points[i + 1];
    var x = p0.x + (p1.x - p0.x) * frac;
    var y = p0.y + (p1.y - p0.y) * frac;
    var angle = Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180 / Math.PI;
    return { x: x, y: y, angle: angle };
  };

  AI.Loading.prototype._startAnimation = function () {
    if (this._animStarted) return;
    this._animStarted = true;

    /* CSS 动画：给容器添加 class */
    var loading = this.el.querySelector('.ai-loading');
    if (loading) loading.classList.add('ai-loading--animated');

    /* 鱼路径动画：纯 JS requestAnimationFrame */
    var fishEl = this.el.querySelector('#fish');
    var fishPathEl = this.el.querySelector('#fish-path');
    if (!fishEl || !fishPathEl) return;

    var pathD = fishPathEl.getAttribute('d');
    var pathPoints = AI.Loading._parsePath(pathD);

    /* 获取鱼自身的中心坐标（用于 align 偏移计算） */
    var fishBBox = fishEl.getBBox();
    var fishCX = fishBBox.x + fishBBox.width / 2;
    var fishCY = fishBBox.y + fishBBox.height / 2;

    /* 设置鱼的 transform-origin 为自身中心，使旋转围绕中心 */
    fishEl.style.transformBox = 'fill-box';
    fishEl.style.transformOrigin = 'center center';

    /* 计算 path 总长度，用于归一化 */
    var totalLen = 0;
    for (var i = 1; i < pathPoints.length; i++) {
      totalLen += Math.hypot(pathPoints[i].x - pathPoints[i - 1].x, pathPoints[i].y - pathPoints[i - 1].y);
    }

    /* 按弧长重新参数化 */
    var arcLenPoints = [{ x: pathPoints[0].x, y: pathPoints[0].y, len: 0 }];
    var cumLen = 0;
    for (var i = 1; i < pathPoints.length; i++) {
      cumLen += Math.hypot(pathPoints[i].x - pathPoints[i - 1].x, pathPoints[i].y - pathPoints[i - 1].y);
      arcLenPoints.push({ x: pathPoints[i].x, y: pathPoints[i].y, len: cumLen });
    }

    var FISH_DURATION = 3000;   // 3s 游完路径
    var FISH_DELAY = 4000;      // 4s 间隔
    var FISH_CYCLE = FISH_DURATION + FISH_DELAY;

    /* slow(0.3, 0.7) 缓动近似 — 先慢后快再慢 */
    function slowEase(t) {
      return t * t * (3 - 2 * t); // smoothstep 近似
    }

    var self = this;
    var startTime = null;

    function animateFish(timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed = (timestamp - startTime) % FISH_CYCLE;

      if (elapsed < FISH_DURATION) {
        var t = elapsed / FISH_DURATION;
        t = slowEase(t);

        /* 按弧长采样 */
        var targetLen = t * totalLen;
        var segIdx = 0;
        for (var i = 1; i < arcLenPoints.length; i++) {
          if (arcLenPoints[i].len >= targetLen) { segIdx = i - 1; break; }
          if (i === arcLenPoints.length - 1) segIdx = i - 1;
        }
        var segStart = arcLenPoints[segIdx];
        var segEnd = arcLenPoints[segIdx + 1] || segStart;
        var segFrac = (segEnd.len - segStart.len) > 0
          ? (targetLen - segStart.len) / (segEnd.len - segStart.len)
          : 0;
        segFrac = Math.max(0, Math.min(1, segFrac));

        var px = segStart.x + (segEnd.x - segStart.x) * segFrac;
        var py = segStart.y + (segEnd.y - segStart.y) * segFrac;
        var angle = Math.atan2(segEnd.y - segStart.y, segEnd.x - segStart.x) * 180 / Math.PI;

        /* 关键：translate 偏移 = 路径坐标 - 鱼中心坐标
           GSAP motionPath align 会把元素中心对齐到路径点，
           所以 translate 需要补偿鱼自身的中心偏移 */
        var tx = px - fishCX;
        var ty = py - fishCY;

        fishEl.style.transform = 'translate(' + tx.toFixed(1) + 'px,' + ty.toFixed(1) + 'px) rotate(' + angle.toFixed(1) + 'deg)';
        fishEl.style.opacity = '1';
      } else {
        fishEl.style.opacity = '0';
      }

      self._fishRafId = requestAnimationFrame(animateFish);
    }

    /* 设置 fish-path 缩放（原 GSAP gsap.set('#fish-path', {scaleY:1.3, scaleX:1.3})） */
    fishPathEl.style.transformOrigin = 'bottom left';
    fishPathEl.style.transform = 'scale(1.3, 1.3)';

    /* 鱼初始位置 */
    var startPos = AI.Loading._samplePath(pathPoints, 0);
    var initTx = startPos.x - fishCX;
    var initTy = startPos.y - fishCY;
    fishEl.style.transform = 'translate(' + initTx.toFixed(1) + 'px,' + initTy.toFixed(1) + 'px) rotate(' + startPos.angle.toFixed(1) + 'deg)';

    this._fishRafId = requestAnimationFrame(animateFish);
  };

  AI.Loading.prototype._stopAnimation = function () {
    if (this._fishRafId) {
      cancelAnimationFrame(this._fishRafId);
      this._fishRafId = null;
    }
    this._animStarted = false;
    var loading = this.el.querySelector('.ai-loading');
    if (loading) loading.classList.remove('ai-loading--animated');
  };

  AI.Loading.prototype.setActive = function (active) {
    if (!this.container) return;

    if (active) {
      this.container.style.display = 'flex';
      this.container.classList.remove('ai-loading__container--closing');
      this.container.style.transition = '';
      this.container.style.setProperty('--ai-mask-r', '0px');
      if (!this._animStarted) {
        this._startAnimation();
      }
    } else {
      this._stopAnimation();

      var rect = this.container.getBoundingClientRect();
      var finalR = Math.ceil(Math.hypot(rect.width, rect.height) / 2) + 50;
      var duration = Math.max(0.1, finalR / 1500);

      this.container.classList.add('ai-loading__container--closing');
      this.container.style.transition = '';
      this.container.style.setProperty('--ai-mask-r', '0px');
      void this.container.offsetHeight;
      this.container.style.transition = '--ai-mask-r ' + duration + 's linear';
      this.container.style.setProperty('--ai-mask-r', finalR + 'px');

      setTimeout(function () {
        this.container.style.display = 'none';
      }.bind(this), duration * 1000);
    }
    this.active = active;
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
  AI.CodeBlock = function (el) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    if (!this.el) return;

    var code = this.el.textContent;
    this.el.innerHTML = this._highlight(code);
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
    if (this.el.classList.contains('ai-tag--clickable')) {
      this.el.addEventListener('click', this._handleClick.bind(this));
      this.el.addEventListener('keydown', this._handleKeydown.bind(this));
    }
  };

  AI.Tag.prototype._handleClose = function (e) {
    e.stopPropagation();
    if (this.el.classList.contains('ai-tag--disabled')) return;
    if (this.onClose) this.onClose(e);
    // Default: remove from DOM after close
    if (!e.defaultPrevented) {
      this.el.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
      this.el.style.opacity = '0';
      this.el.style.transform = 'scale(0.8)';
      var self = this;
      setTimeout(function () {
        if (self.el.parentNode) self.el.parentNode.removeChild(self.el);
      }, 200);
    }
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
     Title — 标题（缎带）— 仅工厂方法
     ============================================ */
  AI.Title = function (options) {
    var opts = options || {};
    var size = opts.size || 'middle'; // small | middle | large
    var color = opts.color || 'default';
    var text = opts.text != null ? String(opts.text) : '';

    var sizeClass = size === 'small' ? 'ai-title--sm'
      : size === 'large' ? 'ai-title--lg'
      : 'ai-title--md';
    var colorClass = color !== 'default' ? 'ai-title--' + color : '';

    var root = document.createElement('span');
    root.className = 'ai-title ' + sizeClass + ' ' + colorClass;

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

    this.el = root;
    return root;
  };

  AI.Title.prototype.setText = function (text) {
    var textEl = this.el.querySelector('.ai-title__text');
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
    this._savedChildren = [];

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
    this.showInfo = this.options.showInfo !== false;
    this.infoPosition = this.options.infoPosition || this.el.getAttribute('data-info-position') || 'inside';
    this.duration = this.options.duration != null ? this.options.duration : 0.6;
    this.infoFormat = this.options.infoFormat;

    this._render();
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
    var INSIDE_MIN_FILL = 18;
    var isInside = this.showInfo && this.infoPosition === 'inside';
    var infoInsideVisible = isInside && p >= INSIDE_MIN_FILL;
    var bodyCls = this.infoPosition === 'top' ? 'ai-progress__body' : 'ai-progress__body ai-progress__body--nogap';

    var html = '';
    if (this.infoPosition === 'top') {
      html += '<div class="' + bodyCls + '">';
      if (this.showInfo) {
        html += '<div class="ai-progress__info ai-progress__info--top">' + info + '</div>';
      }
      html += this._renderTrack(sizeClass, fillTransition, p, info, isInside, infoInsideVisible);
      html += '</div>';
    } else {
      html += '<div class="ai-progress__row">';
      html += this._renderTrack(sizeClass, fillTransition, p, info, isInside, infoInsideVisible);
      if (this.showInfo && this.infoPosition === 'right') {
        html += '<div class="ai-progress__info ai-progress__info--right">' + info + '</div>';
      }
      html += '</div>';
    }

    this.el.className = 'ai-progress';
    this.el.setAttribute('role', 'progressbar');
    this.el.setAttribute('aria-valuemin', '0');
    this.el.setAttribute('aria-valuemax', '100');
    this.el.setAttribute('aria-valuenow', String(Math.round(p)));
    this.el.innerHTML = html;
  };

  AI.Progress.prototype._renderTrack = function (sizeClass, fillTransition, p, info, isInside, infoInsideVisible) {
    var html = '<div class="ai-progress__track ' + sizeClass + '">';
    html += '<div class="ai-progress__fill ' + fillTransition + '" style="width:' + p + '%;transition-duration:' + this.duration + 's">';
    if (infoInsideVisible) {
      html += '<span class="ai-progress__info-inside">' + info + '</span>';
    }
    html += '</div>';
    if (isInside && !infoInsideVisible) {
      html += '<span class="ai-progress__info-inside" style="color:#725d42">' + info + '</span>';
    }
    html += '</div>';
    return html;
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
      tip.innerHTML =
        '<div class="ai-tooltip__island-body">' +
          '<svg class="ai-tooltip__island-svg" viewBox="0 0 1 1" preserveAspectRatio="none" aria-hidden="true">' +
            '<path d="M0.501,0.005 L0.549,0.006 C0.704,0.01,0.796,0.017,0.825,0.027 L0.827,0.028 C0.872,0.045,0.939,0.044,0.978,0.17 C1,0.254,1,0.365,0.99,0.505 L0.988,0.513 C0.979,0.558,0.971,0.598,0.965,0.633 C0.956,0.689,0.979,0.77,0.964,0.865 C0.953,0.928,0.921,0.966,0.869,0.979 C0.821,0.986,0.773,0.992,0.726,0.995 L0.694,0.997 C0.648,1,0.586,1,0.507,1 L0.464,1 C0.385,1,0.325,0.998,0.283,0.995 C0.234,0.992,0.184,0.987,0.133,0.979 C0.081,0.966,0.05,0.928,0.039,0.865 C0.023,0.77,0.047,0.689,0.037,0.633 C0.031,0.595,0.023,0.552,0.013,0.505 C-0.006,0.365,-0.002,0.254,0.024,0.17 C0.064,0.045,0.13,0.045,0.174,0.028 L0.175,0.028 C0.204,0.017,0.303,0.009,0.474,0.005 L0.501,0.005" ' +
              'fill="rgb(247, 243, 223)" stroke="#c4b89e" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linejoin="round"></path>' +
          '</svg>' +
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

  AI.BackTop.DEFAULT_IMG = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
      '<circle cx="60" cy="60" r="50" fill="#f7c34a" stroke="#d4a030" stroke-width="3"/>' +
      '<path d="M60 35 L40 60 L52 60 L52 80 L68 80 L68 60 L80 60 Z" fill="#725d42"/>' +
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
    mask.className = 'ai-drawer-mask';
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
  AI.Notification = function () {};

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

  AI.Notification.open = function (config) {
    var cfg = config || {};
    var type = cfg.type || 'info';
    var position = cfg.position || 'top';
    var placement = position === 'bottom' || position === 'bottomLeft' || position === 'bottomRight' ? 'bottom' : 'top';
    var duration = cfg.duration != null ? cfg.duration : 4.5;
    var key = cfg.key || ('ai-notif-' + (++AI.Notification._idCounter));

    // If key exists, update existing
    if (AI.Notification._items[key]) {
      AI.Notification._remove(key);
    }

    var container = AI.Notification._getContainer(position);
    var notif = document.createElement('div');
    notif.className = 'ai-notification ai-notification--' + type + ' ai-notification--placement-' + placement;
    if (cfg.onClick) notif.classList.add('ai-notification--clickable');
    if (cfg.className) notif.className += ' ' + cfg.className;
    notif.setAttribute('data-notification-key', key);
    if (cfg.onClick) {
      notif.setAttribute('role', 'button');
      notif.setAttribute('tabindex', '0');
    }

    var iconHTML = cfg.icon != null ? cfg.icon : AI.Notification._ICONS[type];
    var html =
      '<div class="ai-notification__icon-wrap" aria-hidden="true">' + iconHTML + '</div>' +
      '<div class="ai-notification__body">' +
        '<div class="ai-notification__title">' + (cfg.message != null ? String(cfg.message) : '') + '</div>';
    if (cfg.description != null) {
      html += '<div class="ai-notification__description">' + String(cfg.description) + '</div>';
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
    var closeBtn = notif.querySelector('.ai-notification__close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        AI.Notification._remove(key);
        if (cfg.onClose) cfg.onClose();
      });
    }

    container.appendChild(notif);

    var item = {
      key: key,
      el: notif,
      timer: duration > 0 ? setTimeout(function () {
        AI.Notification._remove(key);
        if (cfg.onClose) cfg.onClose();
      }, duration * 1000) : null,
      onClose: cfg.onClose,
    };
    AI.Notification._items[key] = item;
    return key;
  };

  AI.Notification._remove = function (key) {
    var item = AI.Notification._items[key];
    if (!item) return;
    if (item.timer) { clearTimeout(item.timer); item.timer = null; }
    var el = item.el;
    if (!el) { delete AI.Notification._items[key]; return; }

    el.classList.add('ai-notification--leaving');
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
      delete AI.Notification._items[key];
    }, 250);
  };

  AI.Notification.success = function (cfg) { cfg = Object.assign({}, cfg); cfg.type = 'success'; return AI.Notification.open(cfg); };
  AI.Notification.info = function (cfg) { cfg = Object.assign({}, cfg); cfg.type = 'info'; return AI.Notification.open(cfg); };
  AI.Notification.warning = function (cfg) { cfg = Object.assign({}, cfg); cfg.type = 'warning'; return AI.Notification.open(cfg); };
  AI.Notification.error = function (cfg) { cfg = Object.assign({}, cfg); cfg.type = 'error'; return AI.Notification.open(cfg); };

  AI.Notification.close = function (key) { AI.Notification._remove(key); };

  AI.Notification.destroy = function () {
    Object.keys(AI.Notification._items).forEach(function (k) {
      AI.Notification._remove(k);
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
    this.requiredMark = this.options.requiredMark !== undefined ? this.options.requiredMark : false;

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
      if (!rule.pattern.test(String(value))) return rule.message || '格式不正确';
      return null;
    },
    validator: function (value, rule) {
      if (typeof rule.validator !== 'function') return null;
      try {
        var result = rule.validator(rule, value);
        if (result instanceof Promise) {
          return result.then(function (msg) { return msg || null; });
        }
        return result || null;
      } catch (e) {
        return e.message || '校验失败';
      }
    },
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
      var control = item.querySelector('.ai-form-item__control-input') || item.querySelector('.ai-form-item__control');
      var inputEl = control ? control.querySelector('input,textarea,select') : null;

      self._fields[name] = {
        el: item,
        name: name,
        rules: rules,
        value: self._initialValues[name] !== undefined ? self._initialValues[name] : (inputEl ? inputEl.value : ''),
        errors: [],
        touched: false,
        validating: false,
        inputEl: inputEl,
      };

      if (inputEl) {
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
        if (self._initialValues[name] !== undefined) {
          inputEl.value = self._initialValues[name];
        }
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
      field.value = self._initialValues[name] !== undefined ? self._initialValues[name] : '';
      field.errors = [];
      field.touched = false;
      if (field.inputEl) field.inputEl.value = field.value;
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
    if (field.inputEl) field.inputEl.value = value;
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
      field.value = self._initialValues[n] !== undefined ? self._initialValues[n] : '';
      field.errors = [];
      field.touched = false;
      if (field.inputEl) field.inputEl.value = field.value;
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
      var options = { variant: variant, active: el.getAttribute('data-active') !== 'false' };
      if (el.getAttribute('data-rows')) options.rows = parseInt(el.getAttribute('data-rows'), 10);
      if (el.getAttribute('data-width')) options.width = el.getAttribute('data-width');
      if (el.getAttribute('data-width-value')) options.widthValue = el.getAttribute('data-width-value');
      if (el.getAttribute('data-height-value')) options.heightValue = el.getAttribute('data-height-value');
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
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', AI.autoInit);
  } else {
    AI.autoInit();
  }

  global.AnimalIsland = AI;

})(typeof window !== 'undefined' ? window : this);
