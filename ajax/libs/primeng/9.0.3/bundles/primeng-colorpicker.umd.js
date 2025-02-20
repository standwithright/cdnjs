(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/animations'), require('@angular/common'), require('primeng/dom'), require('@angular/forms')) :
    typeof define === 'function' && define.amd ? define('primeng/colorpicker', ['exports', '@angular/core', '@angular/animations', '@angular/common', 'primeng/dom', '@angular/forms'], factory) :
    (global = global || self, factory((global.primeng = global.primeng || {}, global.primeng.colorpicker = {}), global.ng.core, global.ng.animations, global.ng.common, global.primeng.dom, global.ng.forms));
}(this, (function (exports, core, animations, common, dom, forms) { 'use strict';

    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var COLORPICKER_VALUE_ACCESSOR = {
        provide: forms.NG_VALUE_ACCESSOR,
        useExisting: core.forwardRef(function () { return ColorPicker; }),
        multi: true
    };
    var ColorPicker = /** @class */ (function () {
        function ColorPicker(el, renderer, cd) {
            this.el = el;
            this.renderer = renderer;
            this.cd = cd;
            this.format = 'hex';
            this.autoZIndex = true;
            this.baseZIndex = 0;
            this.showTransitionOptions = '225ms ease-out';
            this.hideTransitionOptions = '195ms ease-in';
            this.onChange = new core.EventEmitter();
            this.defaultColor = 'ff0000';
            this.onModelChange = function () { };
            this.onModelTouched = function () { };
        }
        Object.defineProperty(ColorPicker.prototype, "colorSelector", {
            set: function (element) {
                this.colorSelectorViewChild = element;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ColorPicker.prototype, "colorHandle", {
            set: function (element) {
                this.colorHandleViewChild = element;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ColorPicker.prototype, "hue", {
            set: function (element) {
                this.hueViewChild = element;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ColorPicker.prototype, "hueHandle", {
            set: function (element) {
                this.hueHandleViewChild = element;
            },
            enumerable: true,
            configurable: true
        });
        ColorPicker.prototype.onHueMousedown = function (event) {
            if (this.disabled) {
                return;
            }
            this.bindDocumentMousemoveListener();
            this.bindDocumentMouseupListener();
            this.hueDragging = true;
            this.pickHue(event);
        };
        ColorPicker.prototype.pickHue = function (event) {
            var top = this.hueViewChild.nativeElement.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);
            this.value = this.validateHSB({
                h: Math.floor(360 * (150 - Math.max(0, Math.min(150, (event.pageY - top)))) / 150),
                s: this.value.s,
                b: this.value.b
            });
            this.updateColorSelector();
            this.updateUI();
            this.updateModel();
            this.onChange.emit({ originalEvent: event, value: this.getValueToUpdate() });
        };
        ColorPicker.prototype.onColorMousedown = function (event) {
            if (this.disabled) {
                return;
            }
            this.bindDocumentMousemoveListener();
            this.bindDocumentMouseupListener();
            this.colorDragging = true;
            this.pickColor(event);
        };
        ColorPicker.prototype.pickColor = function (event) {
            var rect = this.colorSelectorViewChild.nativeElement.getBoundingClientRect();
            var top = rect.top + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);
            var left = rect.left + document.body.scrollLeft;
            var saturation = Math.floor(100 * (Math.max(0, Math.min(150, (event.pageX - left)))) / 150);
            var brightness = Math.floor(100 * (150 - Math.max(0, Math.min(150, (event.pageY - top)))) / 150);
            this.value = this.validateHSB({
                h: this.value.h,
                s: saturation,
                b: brightness
            });
            this.updateUI();
            this.updateModel();
            this.onChange.emit({ originalEvent: event, value: this.getValueToUpdate() });
        };
        ColorPicker.prototype.getValueToUpdate = function () {
            var val;
            switch (this.format) {
                case 'hex':
                    val = '#' + this.HSBtoHEX(this.value);
                    break;
                case 'rgb':
                    val = this.HSBtoRGB(this.value);
                    break;
                case 'hsb':
                    val = this.value;
                    break;
            }
            return val;
        };
        ColorPicker.prototype.updateModel = function () {
            this.onModelChange(this.getValueToUpdate());
        };
        ColorPicker.prototype.writeValue = function (value) {
            if (value) {
                switch (this.format) {
                    case 'hex':
                        this.value = this.HEXtoHSB(value);
                        break;
                    case 'rgb':
                        this.value = this.RGBtoHSB(value);
                        break;
                    case 'hsb':
                        this.value = value;
                        break;
                }
            }
            else {
                this.value = this.HEXtoHSB(this.defaultColor);
            }
            this.updateColorSelector();
            this.updateUI();
        };
        ColorPicker.prototype.updateColorSelector = function () {
            if (this.colorSelectorViewChild) {
                var hsb = {};
                hsb.s = 100;
                hsb.b = 100;
                hsb.h = this.value.h;
                this.colorSelectorViewChild.nativeElement.style.backgroundColor = '#' + this.HSBtoHEX(hsb);
            }
        };
        ColorPicker.prototype.updateUI = function () {
            if (this.colorHandleViewChild && this.hueHandleViewChild.nativeElement) {
                this.colorHandleViewChild.nativeElement.style.left = Math.floor(150 * this.value.s / 100) + 'px';
                this.colorHandleViewChild.nativeElement.style.top = Math.floor(150 * (100 - this.value.b) / 100) + 'px';
                this.hueHandleViewChild.nativeElement.style.top = Math.floor(150 - (150 * this.value.h / 360)) + 'px';
            }
            this.inputBgColor = '#' + this.HSBtoHEX(this.value);
        };
        ColorPicker.prototype.onInputFocus = function () {
            this.onModelTouched();
        };
        ColorPicker.prototype.show = function () {
            this.overlayVisible = true;
        };
        ColorPicker.prototype.onOverlayAnimationStart = function (event) {
            switch (event.toState) {
                case 'visible':
                    if (!this.inline) {
                        this.overlay = event.element;
                        this.appendOverlay();
                        if (this.autoZIndex) {
                            this.overlay.style.zIndex = String(this.baseZIndex + (++dom.DomHandler.zindex));
                        }
                        this.alignOverlay();
                        this.bindDocumentClickListener();
                        this.updateColorSelector();
                        this.updateUI();
                    }
                    break;
                case 'void':
                    this.onOverlayHide();
                    break;
            }
        };
        ColorPicker.prototype.appendOverlay = function () {
            if (this.appendTo) {
                if (this.appendTo === 'body')
                    document.body.appendChild(this.overlay);
                else
                    dom.DomHandler.appendChild(this.overlay, this.appendTo);
            }
        };
        ColorPicker.prototype.restoreOverlayAppend = function () {
            if (this.overlay && this.appendTo) {
                this.el.nativeElement.appendChild(this.overlay);
            }
        };
        ColorPicker.prototype.alignOverlay = function () {
            if (this.appendTo)
                dom.DomHandler.absolutePosition(this.overlay, this.inputViewChild.nativeElement);
            else
                dom.DomHandler.relativePosition(this.overlay, this.inputViewChild.nativeElement);
        };
        ColorPicker.prototype.hide = function () {
            this.overlayVisible = false;
        };
        ColorPicker.prototype.onInputClick = function () {
            this.selfClick = true;
            this.togglePanel();
        };
        ColorPicker.prototype.togglePanel = function () {
            if (!this.overlayVisible)
                this.show();
            else
                this.hide();
        };
        ColorPicker.prototype.onInputKeydown = function (event) {
            switch (event.which) {
                //space
                case 32:
                    this.togglePanel();
                    event.preventDefault();
                    break;
                //escape and tab
                case 27:
                case 9:
                    this.hide();
                    break;
            }
        };
        ColorPicker.prototype.onPanelClick = function () {
            this.selfClick = true;
        };
        ColorPicker.prototype.registerOnChange = function (fn) {
            this.onModelChange = fn;
        };
        ColorPicker.prototype.registerOnTouched = function (fn) {
            this.onModelTouched = fn;
        };
        ColorPicker.prototype.setDisabledState = function (val) {
            this.disabled = val;
        };
        ColorPicker.prototype.bindDocumentClickListener = function () {
            var _this = this;
            if (!this.documentClickListener) {
                this.documentClickListener = this.renderer.listen('document', 'click', function () {
                    if (!_this.selfClick) {
                        _this.overlayVisible = false;
                        _this.unbindDocumentClickListener();
                    }
                    _this.selfClick = false;
                    _this.cd.markForCheck();
                });
            }
        };
        ColorPicker.prototype.unbindDocumentClickListener = function () {
            if (this.documentClickListener) {
                this.documentClickListener();
                this.documentClickListener = null;
            }
        };
        ColorPicker.prototype.bindDocumentMousemoveListener = function () {
            var _this = this;
            if (!this.documentMousemoveListener) {
                this.documentMousemoveListener = this.renderer.listen('document', 'mousemove', function (event) {
                    if (_this.colorDragging) {
                        _this.pickColor(event);
                    }
                    if (_this.hueDragging) {
                        _this.pickHue(event);
                    }
                });
            }
        };
        ColorPicker.prototype.unbindDocumentMousemoveListener = function () {
            if (this.documentMousemoveListener) {
                this.documentMousemoveListener();
                this.documentMousemoveListener = null;
            }
        };
        ColorPicker.prototype.bindDocumentMouseupListener = function () {
            var _this = this;
            if (!this.documentMouseupListener) {
                this.documentMouseupListener = this.renderer.listen('document', 'mouseup', function () {
                    _this.colorDragging = false;
                    _this.hueDragging = false;
                    _this.unbindDocumentMousemoveListener();
                    _this.unbindDocumentMouseupListener();
                });
            }
        };
        ColorPicker.prototype.unbindDocumentMouseupListener = function () {
            if (this.documentMouseupListener) {
                this.documentMouseupListener();
                this.documentMouseupListener = null;
            }
        };
        ColorPicker.prototype.validateHSB = function (hsb) {
            return {
                h: Math.min(360, Math.max(0, hsb.h)),
                s: Math.min(100, Math.max(0, hsb.s)),
                b: Math.min(100, Math.max(0, hsb.b))
            };
        };
        ColorPicker.prototype.validateRGB = function (rgb) {
            return {
                r: Math.min(255, Math.max(0, rgb.r)),
                g: Math.min(255, Math.max(0, rgb.g)),
                b: Math.min(255, Math.max(0, rgb.b))
            };
        };
        ColorPicker.prototype.validateHEX = function (hex) {
            var len = 6 - hex.length;
            if (len > 0) {
                var o = [];
                for (var i = 0; i < len; i++) {
                    o.push('0');
                }
                o.push(hex);
                hex = o.join('');
            }
            return hex;
        };
        ColorPicker.prototype.HEXtoRGB = function (hex) {
            var hexValue = parseInt(((hex.indexOf('#') > -1) ? hex.substring(1) : hex), 16);
            return { r: hexValue >> 16, g: (hexValue & 0x00FF00) >> 8, b: (hexValue & 0x0000FF) };
        };
        ColorPicker.prototype.HEXtoHSB = function (hex) {
            return this.RGBtoHSB(this.HEXtoRGB(hex));
        };
        ColorPicker.prototype.RGBtoHSB = function (rgb) {
            var hsb = {
                h: 0,
                s: 0,
                b: 0
            };
            var min = Math.min(rgb.r, rgb.g, rgb.b);
            var max = Math.max(rgb.r, rgb.g, rgb.b);
            var delta = max - min;
            hsb.b = max;
            hsb.s = max != 0 ? 255 * delta / max : 0;
            if (hsb.s != 0) {
                if (rgb.r == max) {
                    hsb.h = (rgb.g - rgb.b) / delta;
                }
                else if (rgb.g == max) {
                    hsb.h = 2 + (rgb.b - rgb.r) / delta;
                }
                else {
                    hsb.h = 4 + (rgb.r - rgb.g) / delta;
                }
            }
            else {
                hsb.h = -1;
            }
            hsb.h *= 60;
            if (hsb.h < 0) {
                hsb.h += 360;
            }
            hsb.s *= 100 / 255;
            hsb.b *= 100 / 255;
            return hsb;
        };
        ColorPicker.prototype.HSBtoRGB = function (hsb) {
            var rgb = {
                r: null, g: null, b: null
            };
            var h = hsb.h;
            var s = hsb.s * 255 / 100;
            var v = hsb.b * 255 / 100;
            if (s == 0) {
                rgb = {
                    r: v,
                    g: v,
                    b: v
                };
            }
            else {
                var t1 = v;
                var t2 = (255 - s) * v / 255;
                var t3 = (t1 - t2) * (h % 60) / 60;
                if (h == 360)
                    h = 0;
                if (h < 60) {
                    rgb.r = t1;
                    rgb.b = t2;
                    rgb.g = t2 + t3;
                }
                else if (h < 120) {
                    rgb.g = t1;
                    rgb.b = t2;
                    rgb.r = t1 - t3;
                }
                else if (h < 180) {
                    rgb.g = t1;
                    rgb.r = t2;
                    rgb.b = t2 + t3;
                }
                else if (h < 240) {
                    rgb.b = t1;
                    rgb.r = t2;
                    rgb.g = t1 - t3;
                }
                else if (h < 300) {
                    rgb.b = t1;
                    rgb.g = t2;
                    rgb.r = t2 + t3;
                }
                else if (h < 360) {
                    rgb.r = t1;
                    rgb.g = t2;
                    rgb.b = t1 - t3;
                }
                else {
                    rgb.r = 0;
                    rgb.g = 0;
                    rgb.b = 0;
                }
            }
            return { r: Math.round(rgb.r), g: Math.round(rgb.g), b: Math.round(rgb.b) };
        };
        ColorPicker.prototype.RGBtoHEX = function (rgb) {
            var hex = [
                rgb.r.toString(16),
                rgb.g.toString(16),
                rgb.b.toString(16)
            ];
            for (var key in hex) {
                if (hex[key].length == 1) {
                    hex[key] = '0' + hex[key];
                }
            }
            return hex.join('');
        };
        ColorPicker.prototype.HSBtoHEX = function (hsb) {
            return this.RGBtoHEX(this.HSBtoRGB(hsb));
        };
        ColorPicker.prototype.onOverlayHide = function () {
            this.unbindDocumentClickListener();
            this.overlay = null;
        };
        ColorPicker.prototype.ngOnDestroy = function () {
            this.restoreOverlayAppend();
            this.onOverlayHide();
        };
        ColorPicker.ctorParameters = function () { return [
            { type: core.ElementRef },
            { type: core.Renderer2 },
            { type: core.ChangeDetectorRef }
        ]; };
        __decorate([
            core.Input()
        ], ColorPicker.prototype, "style", void 0);
        __decorate([
            core.Input()
        ], ColorPicker.prototype, "styleClass", void 0);
        __decorate([
            core.Input()
        ], ColorPicker.prototype, "inline", void 0);
        __decorate([
            core.Input()
        ], ColorPicker.prototype, "format", void 0);
        __decorate([
            core.Input()
        ], ColorPicker.prototype, "appendTo", void 0);
        __decorate([
            core.Input()
        ], ColorPicker.prototype, "disabled", void 0);
        __decorate([
            core.Input()
        ], ColorPicker.prototype, "tabindex", void 0);
        __decorate([
            core.Input()
        ], ColorPicker.prototype, "inputId", void 0);
        __decorate([
            core.Input()
        ], ColorPicker.prototype, "autoZIndex", void 0);
        __decorate([
            core.Input()
        ], ColorPicker.prototype, "baseZIndex", void 0);
        __decorate([
            core.Input()
        ], ColorPicker.prototype, "showTransitionOptions", void 0);
        __decorate([
            core.Input()
        ], ColorPicker.prototype, "hideTransitionOptions", void 0);
        __decorate([
            core.Output()
        ], ColorPicker.prototype, "onChange", void 0);
        __decorate([
            core.ViewChild('input')
        ], ColorPicker.prototype, "inputViewChild", void 0);
        __decorate([
            core.ViewChild('colorSelector')
        ], ColorPicker.prototype, "colorSelector", null);
        __decorate([
            core.ViewChild('colorHandle')
        ], ColorPicker.prototype, "colorHandle", null);
        __decorate([
            core.ViewChild('hue')
        ], ColorPicker.prototype, "hue", null);
        __decorate([
            core.ViewChild('hueHandle')
        ], ColorPicker.prototype, "hueHandle", null);
        ColorPicker = __decorate([
            core.Component({
                selector: 'p-colorPicker',
                template: "\n        <div [ngStyle]=\"style\" [class]=\"styleClass\" [ngClass]=\"{'ui-colorpicker ui-widget':true,'ui-colorpicker-overlay':!inline,'ui-colorpicker-dragging':colorDragging||hueDragging}\">\n            <input #input type=\"text\" *ngIf=\"!inline\" class=\"ui-colorpicker-preview ui-inputtext ui-state-default ui-corner-all\" readonly=\"readonly\" [ngClass]=\"{'ui-state-disabled': disabled}\"\n                (focus)=\"onInputFocus()\" (click)=\"onInputClick()\" (keydown)=\"onInputKeydown($event)\" [attr.id]=\"inputId\" [attr.tabindex]=\"tabindex\" [disabled]=\"disabled\"\n                [style.backgroundColor]=\"inputBgColor\">\n            <div *ngIf=\"inline || overlayVisible\" [ngClass]=\"{'ui-colorpicker-panel ui-corner-all': true, 'ui-colorpicker-overlay-panel ui-shadow':!inline, 'ui-state-disabled': disabled}\" (click)=\"onPanelClick()\"\n                [@overlayAnimation]=\"{value: 'visible', params: {showTransitionParams: showTransitionOptions, hideTransitionParams: hideTransitionOptions}}\" [@.disabled]=\"inline === true\" (@overlayAnimation.start)=\"onOverlayAnimationStart($event)\">\n                <div class=\"ui-colorpicker-content\">\n                    <div #colorSelector class=\"ui-colorpicker-color-selector\" (mousedown)=\"onColorMousedown($event)\">\n                        <div class=\"ui-colorpicker-color\">\n                            <div #colorHandle class=\"ui-colorpicker-color-handle\"></div>\n                        </div>\n                    </div>\n                    <div #hue class=\"ui-colorpicker-hue\" (mousedown)=\"onHueMousedown($event)\">\n                        <div #hueHandle class=\"ui-colorpicker-hue-handle\"></div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    ",
                animations: [
                    animations.trigger('overlayAnimation', [
                        animations.state('void', animations.style({
                            transform: 'translateY(5%)',
                            opacity: 0
                        })),
                        animations.state('visible', animations.style({
                            transform: 'translateY(0)',
                            opacity: 1
                        })),
                        animations.transition('void => visible', animations.animate('{{showTransitionParams}}')),
                        animations.transition('visible => void', animations.animate('{{hideTransitionParams}}'))
                    ])
                ],
                providers: [COLORPICKER_VALUE_ACCESSOR]
            })
        ], ColorPicker);
        return ColorPicker;
    }());
    var ColorPickerModule = /** @class */ (function () {
        function ColorPickerModule() {
        }
        ColorPickerModule = __decorate([
            core.NgModule({
                imports: [common.CommonModule],
                exports: [ColorPicker],
                declarations: [ColorPicker]
            })
        ], ColorPickerModule);
        return ColorPickerModule;
    }());

    exports.COLORPICKER_VALUE_ACCESSOR = COLORPICKER_VALUE_ACCESSOR;
    exports.ColorPicker = ColorPicker;
    exports.ColorPickerModule = ColorPickerModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=primeng-colorpicker.umd.js.map
