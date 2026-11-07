import{n as j,t as L}from"./chunk-DYupy9no.js";import{t as Z}from"./chunk-D0x5yOmO.js";import{S as oe,T as Ht,d as V,m as ae,n as An,p as Zt,s as Nn,v as Qn,x as it$1,y as cn}from"./main-Q5UDL7R5.js";import"./chunk-Bkr61jk5.js";import{l as yn,r as bn,t as $}from"./chunk-CnJJGLxN.js";import"./chunk-CPlfdD_H.js";import"./chunk-BTnubRX8.js";import"./chunk-Bm79qjJX.js";import{n as a,o,s as u}from"./chunk-BHmHgxbO.js";import{$ as Oo,C as EE,Dr as yT,Dt as Tv,Et as Tr,F as In,Ft as Vi,Gn as mh,Hn as la,J as Nf,K as NS,Ln as jC,Lt as Vp,M as Hv,Mt as VC,O as Fp,Or as yc,Ot as U,P as If,Pt as VE,Qn as ph,Qt as ZC,Rn as ji,Rt as WC,St as TT,Ut as XC,Vt as Wv,Wn as m,X as OT,Xn as oc,Xt as Z$1,Y as Nn$1,Yt as Yv,Zt as Z5,_r as vc,_t as Sh,an as _f,ar as qe,bn as fb,ct as Re,d as Bi,fn as b,gt as Sf,h as Cf,jn as hl,kt as UC,lt as Ri,m as CT,mn as ce,mt as Sc,n as $v,nt as PT,o as Av,or as qt,pn as bE,pt as ST,q as Ne,rn as _c,rr as q5,sr as qv,st as Qt,t as $i,tr as pt$1,ur as rq,vn as dy,w as Ee,wn as g,wr as xS,wt as Tf,x as E5,yn as ee,yt as Sv}from"./chunk-D0Ip9mUJ.js";var Qe=(()=>{class d{labelPosition=`after`;static ɵfac=function(a){return new(a||d)};static ɵcmp=(function(){return qe({type:d,selectors:[[``,`mat-internal-form-field`,``]],hostAttrs:[1,`mdc-form-field`,`mat-internal-form-field`],hostVars:2,hostBindings:function(c,m){c&2&&Nn$1(`mdc-form-field--align-end`,m.labelPosition===`before`)},inputs:{labelPosition:`labelPosition`},ngContentSelectors:[`*`],decls:1,vars:0,template:function(c,m){c&1&&(Vi(),Qt(0))},styles:[`.mat-internal-form-field {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
}
.mat-internal-form-field > label, .mat-internal-form-field > .mat-internal-form-field-label {
  margin-left: 0;
  margin-right: auto;
  padding-left: 4px;
  padding-right: 0;
  order: 0;
}
[dir=rtl] .mat-internal-form-field > label, [dir=rtl] .mat-internal-form-field > .mat-internal-form-field-label {
  margin-left: auto;
  margin-right: 0;
  padding-left: 0;
  padding-right: 4px;
}

.mdc-form-field--align-end > label, .mdc-form-field--align-end > .mat-internal-form-field-label {
  margin-left: auto;
  margin-right: 0;
  padding-left: 0;
  padding-right: 4px;
  order: -1;
}
[dir=rtl] .mdc-form-field--align-end .mdc-form-field--align-end label, [dir=rtl] .mdc-form-field--align-end .mdc-form-field--align-end .mat-internal-form-field-label {
  margin-left: 0;
  margin-right: auto;
  padding-left: 4px;
  padding-right: 0;
}
`],encapsulation:2})})()}return d})();var et=new b(`mat-slide-toggle-default-options`,{providedIn:`root`,factory:()=>({disableToggleValue:!1,hideIcon:!1,disabledInteractive:!1})});var q=class{source;checked;constructor(l,e){this.source=l,this.checked=e}};var Q=(()=>{class d{_elementRef=m(Ee);_focusMonitor=m(Fp);_changeDetectorRef=m($i);defaults=m(et);_injector=m(ee);_signalFormField=null;_onChange=e=>{};_onTouched=()=>{};_validatorOnChange=()=>{};_uniqueId;_checked=!1;_createChangeEvent(e){return new q(this,e)}_labelId;get buttonId(){return`${this.id||this._uniqueId}-button`}_switchElement;focus(){this._switchElement.nativeElement.focus()}_noopAnimations=Oo();_focused=!1;name=null;id;labelPosition=`after`;ariaLabel=null;ariaLabelledby=null;ariaDescribedby;required=!1;color;disabled=!1;fullWidth=!1;disableRipple=!1;tabIndex=0;get checked(){return this._checked}set checked(e){this._checked=e,this._changeDetectorRef.markForCheck()}hideIcon;disabledInteractive;change=new ce;toggleChange=new ce;get inputId(){return`${this.id||this._uniqueId}-input`}constructor(){m(Tr).load(bE);let e=m(new Sc(`tabindex`),{optional:!0}),a=this.defaults;this.tabIndex=e==null?0:parseInt(e)||0,this.color=a.color||`accent`,this.id=this._uniqueId=m(Vp).getId(`mat-mdc-slide-toggle-`),this.hideIcon=a.hideIcon??!1,this.disabledInteractive=a.disabledInteractive??!1,this._labelId=this._uniqueId+`-label`}ngOnInit(){this._signalFormField=this._injector.get(cn,void 0,{optional:!0,self:!0})}ngAfterContentInit(){this._focusMonitor.monitor(this._elementRef,!0).subscribe(e=>{e===`keyboard`||e===`program`?(this._focused=!0,this._changeDetectorRef.markForCheck()):e||Promise.resolve().then(()=>{this._focused=!1,this._onTouched(),this._changeDetectorRef.markForCheck()})})}ngOnChanges(e){e.required&&this._validatorOnChange()}ngOnDestroy(){this._focusMonitor.stopMonitoring(this._elementRef)}writeValue(e){this.checked=!!e}registerOnChange(e){this._onChange=e}registerOnTouched(e){this._onTouched=e}validate(e){return this.required&&e.value!==!0&&!this._signalFormField?{required:!0}:null}registerOnValidatorChange(e){this._validatorOnChange=e}setDisabledState(e){this.disabled=e,this._changeDetectorRef.markForCheck()}toggle(){this.checked=!this.checked,this._onChange(this.checked)}_emitChangeEvent(){this._onChange(this.checked),this.change.emit(this._createChangeEvent(this.checked))}_handleClick(){this.disabled||(this.toggleChange.emit(),this.defaults.disableToggleValue||(this.checked=!this.checked,this._onChange(this.checked),this.change.emit(new q(this,this.checked))))}_getAriaLabelledBy(){return this.ariaLabelledby?this.ariaLabelledby:this.ariaLabel?null:this._labelId}static ɵfac=function(a){return new(a||d)};static ɵcmp=(function(){let e=[`switch`],a=[`*`];function c(m,w){m&1&&(oc(0,`span`,11),Sh(),oc(1,`svg`,13),vc(2,`path`,14),_f(),oc(3,`svg`,15),vc(4,`path`,16),_f()())}return qe({type:d,selectors:[[`mat-slide-toggle`]],viewQuery:function(w,s){if(w&1&&Av(e,5),w&2){let E;If(E=Sf())&&(s._switchElement=E.first)}},hostAttrs:[1,`mat-mdc-slide-toggle`],hostVars:15,hostBindings:function(w,s){w&2&&(Tv(`id`,s.id),In(`tabindex`,null)(`aria-label`,null)(`name`,null)(`aria-labelledby`,null),Cf(s.color?`mat-`+s.color:``),Nn$1(`mat-mdc-slide-toggle-focused`,s._focused)(`mat-mdc-slide-toggle-checked`,s.checked)(`mat-slide-toggle-full-width`,s.fullWidth)(`_mat-animation-noopable`,s._noopAnimations))},inputs:{name:`name`,id:`id`,labelPosition:`labelPosition`,ariaLabel:[0,`aria-label`,`ariaLabel`],ariaLabelledby:[0,`aria-labelledby`,`ariaLabelledby`],ariaDescribedby:[0,`aria-describedby`,`ariaDescribedby`],required:[2,`required`,`required`,pt$1],color:`color`,disabled:[2,`disabled`,`disabled`,pt$1],fullWidth:[2,`fullWidth`,`fullWidth`,pt$1],disableRipple:[2,`disableRipple`,`disableRipple`,pt$1],tabIndex:[2,`tabIndex`,`tabIndex`,m=>m==null?0:dy(m)],checked:[2,`checked`,`checked`,pt$1],hideIcon:[2,`hideIcon`,`hideIcon`,pt$1],disabledInteractive:[2,`disabledInteractive`,`disabledInteractive`,pt$1]},outputs:{change:`change`,toggleChange:`toggleChange`},exportAs:[`matSlideToggle`],features:[Nf([{provide:ae,useExisting:la(()=>d),multi:!0},{provide:V,useExisting:d,multi:!0}]),qt],ngContentSelectors:a,decls:14,vars:27,consts:[[`switch`,``],[`mat-internal-form-field`,``,3,`labelPosition`],[`role`,`switch`,`type`,`button`,1,`mdc-switch`,3,`click`,`tabIndex`,`disabled`],[1,`mat-mdc-slide-toggle-touch-target`],[1,`mdc-switch__track`],[1,`mdc-switch__handle-track`],[1,`mdc-switch__handle`],[1,`mdc-switch__shadow`],[1,`mdc-elevation-overlay`],[1,`mdc-switch__ripple`],[`mat-ripple`,``,1,`mat-mdc-slide-toggle-ripple`,`mat-focus-indicator`,3,`matRippleTrigger`,`matRippleDisabled`,`matRippleCentered`],[1,`mdc-switch__icons`],[1,`mdc-label`,3,`click`,`for`],[`viewBox`,`0 0 24 24`,`aria-hidden`,`true`,1,`mdc-switch__icon`,`mdc-switch__icon--on`],[`d`,`M19.69,5.23L8.96,15.96l-4.23-4.23L2.96,13.5l6,6L21.46,7L19.69,5.23z`],[`viewBox`,`0 0 24 24`,`aria-hidden`,`true`,1,`mdc-switch__icon`,`mdc-switch__icon--off`],[`d`,`M20 13H4v-2h16v2z`]],template:function(w,s){if(w&1&&(Vi(),oc(0,`div`,1)(1,`button`,2,0),yc(`click`,function(){return s._handleClick()}),vc(3,`div`,3)(4,`span`,4),oc(5,`span`,5)(6,`span`,6)(7,`span`,7),vc(8,`span`,8),_f(),oc(9,`span`,9),vc(10,`span`,10),_f(),ji(11,c,5,0,`span`,11),_f()()(),oc(12,`label`,12),yc(`click`,function(Je){return Je.stopPropagation()}),Qt(13),_f()()),w&2){let E=XC(2);Sv(`labelPosition`,s.labelPosition),Ri(),Nn$1(`mdc-switch--selected`,s.checked)(`mdc-switch--unselected`,!s.checked)(`mdc-switch--checked`,s.checked)(`mdc-switch--disabled`,s.disabled)(`mat-mdc-slide-toggle-disabled-interactive`,s.disabledInteractive),Sv(`tabIndex`,s.disabled&&!s.disabledInteractive?-1:s.tabIndex)(`disabled`,s.disabled&&!s.disabledInteractive),In(`id`,s.buttonId)(`name`,s.name)(`aria-label`,s.ariaLabel)(`aria-labelledby`,s._getAriaLabelledBy())(`aria-describedby`,s.ariaDescribedby)(`aria-required`,s.required||null)(`aria-checked`,s.checked)(`aria-disabled`,s.disabled&&s.disabledInteractive?`true`:null),Ri(9),Sv(`matRippleTrigger`,E)(`matRippleDisabled`,s.disableRipple||s.disabled)(`matRippleCentered`,!0),Ri(),Bi(s.hideIcon?-1:11),Ri(),Sv(`for`,s.buttonId),In(`id`,s._labelId)}},dependencies:[E5,Qe],styles:[`.mdc-switch {
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  display: inline-flex;
  flex-shrink: 0;
  margin: 0;
  outline: none;
  overflow: visible;
  padding: 0;
  position: relative;
  width: var(--%NS%mat-slide-toggle-track-width, 52px);
}
.mdc-switch.mdc-switch--disabled {
  cursor: default;
  pointer-events: none;
}
.mdc-switch.mat-mdc-slide-toggle-disabled-interactive {
  pointer-events: auto;
}

.mdc-switch__track {
  overflow: hidden;
  position: relative;
  width: 100%;
  height: var(--%NS%mat-slide-toggle-track-height, 32px);
  border-radius: var(--%NS%mat-slide-toggle-track-shape, var(--%NS%mat-sys-corner-full));
}
.mdc-switch--disabled.mdc-switch .mdc-switch__track {
  opacity: var(--%NS%mat-slide-toggle-disabled-track-opacity, 0.12);
}
.mdc-switch__track::before, .mdc-switch__track::after {
  border: 1px solid transparent;
  border-radius: inherit;
  box-sizing: border-box;
  content: "";
  height: 100%;
  left: 0;
  position: absolute;
  width: 100%;
  border-width: var(--%NS%mat-slide-toggle-track-outline-width, 2px);
  border-color: var(--%NS%mat-slide-toggle-track-outline-color, var(--%NS%mat-sys-outline));
}
.mdc-switch--selected .mdc-switch__track::before, .mdc-switch--selected .mdc-switch__track::after {
  border-width: var(--%NS%mat-slide-toggle-selected-track-outline-width, 2px);
  border-color: var(--%NS%mat-slide-toggle-selected-track-outline-color, transparent);
}
.mdc-switch--disabled .mdc-switch__track::before, .mdc-switch--disabled .mdc-switch__track::after {
  border-width: var(--%NS%mat-slide-toggle-disabled-unselected-track-outline-width, 2px);
  border-color: var(--%NS%mat-slide-toggle-disabled-unselected-track-outline-color, var(--%NS%mat-sys-on-surface));
}
@media (forced-colors: active) {
  .mdc-switch__track {
    border-color: currentColor;
  }
}
.mdc-switch__track::before {
  transition: transform 75ms 0ms cubic-bezier(0, 0, 0.2, 1);
  transform: translateX(0);
  background: var(--%NS%mat-slide-toggle-unselected-track-color, var(--%NS%mat-sys-surface-variant));
}
.mdc-switch--selected .mdc-switch__track::before {
  transition: transform 75ms 0ms cubic-bezier(0.4, 0, 0.6, 1);
  transform: translateX(100%);
}
[dir=rtl] .mdc-switch--selected .mdc-switch--selected .mdc-switch__track::before {
  transform: translateX(-100%);
}
.mdc-switch--selected .mdc-switch__track::before {
  opacity: var(--%NS%mat-slide-toggle-hidden-track-opacity, 0);
  transition: var(--%NS%mat-slide-toggle-hidden-track-transition, opacity 75ms);
}
.mdc-switch--unselected .mdc-switch__track::before {
  opacity: var(--%NS%mat-slide-toggle-visible-track-opacity, 1);
  transition: var(--%NS%mat-slide-toggle-visible-track-transition, opacity 75ms);
}
.mdc-switch:enabled:hover:not(:focus):not(:active) .mdc-switch__track::before {
  background: var(--%NS%mat-slide-toggle-unselected-hover-track-color, var(--%NS%mat-sys-surface-variant));
}
.mdc-switch:enabled:focus:not(:active) .mdc-switch__track::before {
  background: var(--%NS%mat-slide-toggle-unselected-focus-track-color, var(--%NS%mat-sys-surface-variant));
}
.mdc-switch:enabled:active .mdc-switch__track::before {
  background: var(--%NS%mat-slide-toggle-unselected-pressed-track-color, var(--%NS%mat-sys-surface-variant));
}
.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:hover:not(:focus):not(:active) .mdc-switch__track::before, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:focus:not(:active) .mdc-switch__track::before, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:active .mdc-switch__track::before, .mdc-switch.mdc-switch--disabled .mdc-switch__track::before {
  background: var(--%NS%mat-slide-toggle-disabled-unselected-track-color, var(--%NS%mat-sys-surface-variant));
}
.mdc-switch__track::after {
  transform: translateX(-100%);
  background: var(--%NS%mat-slide-toggle-selected-track-color, var(--%NS%mat-sys-primary));
}
[dir=rtl] .mdc-switch__track::after {
  transform: translateX(100%);
}
.mdc-switch--selected .mdc-switch__track::after {
  transform: translateX(0);
}
.mdc-switch--selected .mdc-switch__track::after {
  opacity: var(--%NS%mat-slide-toggle-visible-track-opacity, 1);
  transition: var(--%NS%mat-slide-toggle-visible-track-transition, opacity 75ms);
}
.mdc-switch--unselected .mdc-switch__track::after {
  opacity: var(--%NS%mat-slide-toggle-hidden-track-opacity, 0);
  transition: var(--%NS%mat-slide-toggle-hidden-track-transition, opacity 75ms);
}
.mdc-switch:enabled:hover:not(:focus):not(:active) .mdc-switch__track::after {
  background: var(--%NS%mat-slide-toggle-selected-hover-track-color, var(--%NS%mat-sys-primary));
}
.mdc-switch:enabled:focus:not(:active) .mdc-switch__track::after {
  background: var(--%NS%mat-slide-toggle-selected-focus-track-color, var(--%NS%mat-sys-primary));
}
.mdc-switch:enabled:active .mdc-switch__track::after {
  background: var(--%NS%mat-slide-toggle-selected-pressed-track-color, var(--%NS%mat-sys-primary));
}
.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:hover:not(:focus):not(:active) .mdc-switch__track::after, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:focus:not(:active) .mdc-switch__track::after, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:active .mdc-switch__track::after, .mdc-switch.mdc-switch--disabled .mdc-switch__track::after {
  background: var(--%NS%mat-slide-toggle-disabled-selected-track-color, var(--%NS%mat-sys-on-surface));
}

.mdc-switch__handle-track {
  height: 100%;
  pointer-events: none;
  position: absolute;
  top: 0;
  transition: transform 75ms 0ms cubic-bezier(0.4, 0, 0.2, 1);
  left: 0;
  right: auto;
  transform: translateX(0);
  width: calc(100% - var(--%NS%mat-slide-toggle-handle-width));
}
[dir=rtl] .mdc-switch__handle-track {
  left: auto;
  right: 0;
}
.mdc-switch--selected .mdc-switch__handle-track {
  transform: translateX(100%);
}
[dir=rtl] .mdc-switch--selected .mdc-switch__handle-track {
  transform: translateX(-100%);
}

.mdc-switch__handle {
  display: flex;
  pointer-events: auto;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
  right: auto;
  transition: width 75ms cubic-bezier(0.4, 0, 0.2, 1), height 75ms cubic-bezier(0.4, 0, 0.2, 1), margin 75ms cubic-bezier(0.4, 0, 0.2, 1);
  width: var(--%NS%mat-slide-toggle-handle-width);
  height: var(--%NS%mat-slide-toggle-handle-height);
  border-radius: var(--%NS%mat-slide-toggle-handle-shape, var(--%NS%mat-sys-corner-full));
}
[dir=rtl] .mdc-switch__handle {
  left: auto;
  right: 0;
}
.mat-mdc-slide-toggle .mdc-switch--unselected .mdc-switch__handle {
  width: var(--%NS%mat-slide-toggle-unselected-handle-size, 16px);
  height: var(--%NS%mat-slide-toggle-unselected-handle-size, 16px);
  margin: var(--%NS%mat-slide-toggle-unselected-handle-horizontal-margin, 0 8px);
}
.mat-mdc-slide-toggle .mdc-switch--unselected .mdc-switch__handle:has(.mdc-switch__icons) {
  margin: var(--%NS%mat-slide-toggle-unselected-with-icon-handle-horizontal-margin, 0 4px);
}
.mat-mdc-slide-toggle .mdc-switch--selected .mdc-switch__handle {
  width: var(--%NS%mat-slide-toggle-selected-handle-size, 24px);
  height: var(--%NS%mat-slide-toggle-selected-handle-size, 24px);
  margin: var(--%NS%mat-slide-toggle-selected-handle-horizontal-margin, 0 24px);
}
.mat-mdc-slide-toggle .mdc-switch--selected .mdc-switch__handle:has(.mdc-switch__icons) {
  margin: var(--%NS%mat-slide-toggle-selected-with-icon-handle-horizontal-margin, 0 24px);
}
.mat-mdc-slide-toggle .mdc-switch__handle:has(.mdc-switch__icons) {
  width: var(--%NS%mat-slide-toggle-with-icon-handle-size, 24px);
  height: var(--%NS%mat-slide-toggle-with-icon-handle-size, 24px);
}
.mat-mdc-slide-toggle .mdc-switch:active:not(.mdc-switch--disabled) .mdc-switch__handle {
  width: var(--%NS%mat-slide-toggle-pressed-handle-size, 28px);
  height: var(--%NS%mat-slide-toggle-pressed-handle-size, 28px);
}
.mat-mdc-slide-toggle .mdc-switch--%NS%selected:active:not(.mdc-switch--disabled) .mdc-switch__handle {
  margin: var(--%NS%mat-slide-toggle-selected-pressed-handle-horizontal-margin, 0 22px);
}
.mat-mdc-slide-toggle .mdc-switch--%NS%unselected:active:not(.mdc-switch--disabled) .mdc-switch__handle {
  margin: var(--%NS%mat-slide-toggle-unselected-pressed-handle-horizontal-margin, 0 2px);
}
.mdc-switch--disabled.mdc-switch--selected .mdc-switch__handle::after {
  opacity: var(--%NS%mat-slide-toggle-disabled-selected-handle-opacity, 1);
}
.mdc-switch--disabled.mdc-switch--unselected .mdc-switch__handle::after {
  opacity: var(--%NS%mat-slide-toggle-disabled-unselected-handle-opacity, 0.38);
}
.mdc-switch__handle::before, .mdc-switch__handle::after {
  border: 1px solid transparent;
  border-radius: inherit;
  box-sizing: border-box;
  content: "";
  width: 100%;
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  transition: background-color 75ms 0ms cubic-bezier(0.4, 0, 0.2, 1), border-color 75ms 0ms cubic-bezier(0.4, 0, 0.2, 1);
  z-index: -1;
}
@media (forced-colors: active) {
  .mdc-switch__handle::before, .mdc-switch__handle::after {
    border-color: currentColor;
  }
}
.mdc-switch--%NS%selected:enabled .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-selected-handle-color, var(--%NS%mat-sys-on-primary));
}
.mdc-switch--%NS%selected:enabled:hover:not(:focus):not(:active) .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-selected-hover-handle-color, var(--%NS%mat-sys-primary-container));
}
.mdc-switch--%NS%selected:enabled:focus:not(:active) .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-selected-focus-handle-color, var(--%NS%mat-sys-primary-container));
}
.mdc-switch--%NS%selected:enabled:active .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-selected-pressed-handle-color, var(--%NS%mat-sys-primary-container));
}
.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--disabled.mdc-switch--%NS%selected:hover:not(:focus):not(:active) .mdc-switch__handle::after, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--disabled.mdc-switch--%NS%selected:focus:not(:active) .mdc-switch__handle::after, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--disabled.mdc-switch--%NS%selected:active .mdc-switch__handle::after, .mdc-switch--selected.mdc-switch--disabled .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-disabled-selected-handle-color, var(--%NS%mat-sys-surface));
}
.mdc-switch--%NS%unselected:enabled .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-unselected-handle-color, var(--%NS%mat-sys-outline));
}
.mdc-switch--%NS%unselected:enabled:hover:not(:focus):not(:active) .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-unselected-hover-handle-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-switch--%NS%unselected:enabled:focus:not(:active) .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-unselected-focus-handle-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-switch--%NS%unselected:enabled:active .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-unselected-pressed-handle-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-switch--unselected.mdc-switch--disabled .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-disabled-unselected-handle-color, var(--%NS%mat-sys-on-surface));
}
.mdc-switch__handle::before {
  background: var(--%NS%mat-slide-toggle-handle-surface-color);
}

.mdc-switch__shadow {
  border-radius: inherit;
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
}
.mdc-switch:enabled .mdc-switch__shadow {
  box-shadow: var(--%NS%mat-slide-toggle-handle-elevation-shadow);
}
.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:hover:not(:focus):not(:active) .mdc-switch__shadow, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:focus:not(:active) .mdc-switch__shadow, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:active .mdc-switch__shadow, .mdc-switch.mdc-switch--disabled .mdc-switch__shadow {
  box-shadow: var(--%NS%mat-slide-toggle-disabled-handle-elevation-shadow);
}

.mdc-switch__ripple {
  left: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: -1;
  width: var(--%NS%mat-slide-toggle-state-layer-size, 40px);
  height: var(--%NS%mat-slide-toggle-state-layer-size, 40px);
}
.mdc-switch__ripple::after {
  content: "";
  opacity: 0;
}
.mdc-switch--disabled .mdc-switch__ripple::after {
  display: none;
}
.mat-mdc-slide-toggle-disabled-interactive .mdc-switch__ripple::after {
  display: block;
}
.mdc-switch:hover .mdc-switch__ripple::after {
  transition: 75ms opacity cubic-bezier(0, 0, 0.2, 1);
}
.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:enabled:focus .mdc-switch__ripple::after, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:enabled:active .mdc-switch__ripple::after, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:enabled:hover:not(:focus) .mdc-switch__ripple::after, .mdc-switch--%NS%unselected:enabled:hover:not(:focus) .mdc-switch__ripple::after {
  background: var(--%NS%mat-slide-toggle-unselected-hover-state-layer-color, var(--%NS%mat-sys-on-surface));
  opacity: var(--%NS%mat-slide-toggle-unselected-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));
}
.mdc-switch--%NS%unselected:enabled:focus .mdc-switch__ripple::after {
  background: var(--%NS%mat-slide-toggle-unselected-focus-state-layer-color, var(--%NS%mat-sys-on-surface));
  opacity: var(--%NS%mat-slide-toggle-unselected-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity));
}
.mdc-switch--%NS%unselected:enabled:active .mdc-switch__ripple::after {
  background: var(--%NS%mat-slide-toggle-unselected-pressed-state-layer-color, var(--%NS%mat-sys-on-surface));
  opacity: var(--%NS%mat-slide-toggle-unselected-pressed-state-layer-opacity, var(--%NS%mat-sys-pressed-state-layer-opacity));
  transition: opacity 75ms linear;
}
.mdc-switch--%NS%selected:enabled:hover:not(:focus) .mdc-switch__ripple::after {
  background: var(--%NS%mat-slide-toggle-selected-hover-state-layer-color, var(--%NS%mat-sys-primary));
  opacity: var(--%NS%mat-slide-toggle-selected-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));
}
.mdc-switch--%NS%selected:enabled:focus .mdc-switch__ripple::after {
  background: var(--%NS%mat-slide-toggle-selected-focus-state-layer-color, var(--%NS%mat-sys-primary));
  opacity: var(--%NS%mat-slide-toggle-selected-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity));
}
.mdc-switch--%NS%selected:enabled:active .mdc-switch__ripple::after {
  background: var(--%NS%mat-slide-toggle-selected-pressed-state-layer-color, var(--%NS%mat-sys-primary));
  opacity: var(--%NS%mat-slide-toggle-selected-pressed-state-layer-opacity, var(--%NS%mat-sys-pressed-state-layer-opacity));
  transition: opacity 75ms linear;
}

.mdc-switch__icons {
  position: relative;
  height: 100%;
  width: 100%;
  z-index: 1;
  transform: translateZ(0);
}
.mdc-switch--disabled.mdc-switch--unselected .mdc-switch__icons {
  opacity: var(--%NS%mat-slide-toggle-disabled-unselected-icon-opacity, 0.38);
}
.mdc-switch--disabled.mdc-switch--selected .mdc-switch__icons {
  opacity: var(--%NS%mat-slide-toggle-disabled-selected-icon-opacity, 0.38);
}

.mdc-switch__icon {
  bottom: 0;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  top: 0;
  opacity: 0;
  transition: opacity 30ms 0ms cubic-bezier(0.4, 0, 1, 1);
}
.mdc-switch--unselected .mdc-switch__icon {
  width: var(--%NS%mat-slide-toggle-unselected-icon-size, 16px);
  height: var(--%NS%mat-slide-toggle-unselected-icon-size, 16px);
  fill: var(--%NS%mat-slide-toggle-unselected-icon-color, var(--%NS%mat-sys-surface-variant));
}
.mdc-switch--unselected.mdc-switch--disabled .mdc-switch__icon {
  fill: var(--%NS%mat-slide-toggle-disabled-unselected-icon-color, var(--%NS%mat-sys-surface-variant));
}
.mdc-switch--selected .mdc-switch__icon {
  width: var(--%NS%mat-slide-toggle-selected-icon-size, 16px);
  height: var(--%NS%mat-slide-toggle-selected-icon-size, 16px);
  fill: var(--%NS%mat-slide-toggle-selected-icon-color, var(--%NS%mat-sys-on-primary-container));
}
.mdc-switch--selected.mdc-switch--disabled .mdc-switch__icon {
  fill: var(--%NS%mat-slide-toggle-disabled-selected-icon-color, var(--%NS%mat-sys-on-surface));
}

.mdc-switch--selected .mdc-switch__icon--on,
.mdc-switch--unselected .mdc-switch__icon--off {
  opacity: 1;
  transition: opacity 45ms 30ms cubic-bezier(0, 0, 0.2, 1);
}

.mat-mdc-slide-toggle {
  -webkit-user-select: none;
  user-select: none;
  display: inline-block;
  -webkit-tap-highlight-color: transparent;
  outline: 0;
}
.mat-mdc-slide-toggle .mat-icon {
  min-height: fit-content;
  flex-shrink: 0;
}
.mat-mdc-slide-toggle .mat-mdc-slide-toggle-ripple,
.mat-mdc-slide-toggle .mdc-switch__ripple::after {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}
.mat-mdc-slide-toggle .mat-mdc-slide-toggle-ripple:not(:empty),
.mat-mdc-slide-toggle .mdc-switch__ripple::after:not(:empty) {
  transform: translateZ(0);
}
.mat-mdc-slide-toggle.mat-mdc-slide-toggle-focused .mat-focus-indicator::before {
  content: "";
}
.mat-mdc-slide-toggle .mat-internal-form-field {
  color: var(--%NS%mat-slide-toggle-label-text-color, var(--%NS%mat-sys-on-surface));
  font-family: var(--%NS%mat-slide-toggle-label-text-font, var(--%NS%mat-sys-body-medium-font));
  line-height: var(--%NS%mat-slide-toggle-label-text-line-height, var(--%NS%mat-sys-body-medium-line-height));
  font-size: var(--%NS%mat-slide-toggle-label-text-size, var(--%NS%mat-sys-body-medium-size));
  letter-spacing: var(--%NS%mat-slide-toggle-label-text-tracking, var(--%NS%mat-sys-body-medium-tracking));
  font-weight: var(--%NS%mat-slide-toggle-label-text-weight, var(--%NS%mat-sys-body-medium-weight));
}
.mat-mdc-slide-toggle .mat-ripple-element {
  opacity: 0.12;
}
.mat-mdc-slide-toggle .mat-focus-indicator::before {
  border-radius: 50%;
}
.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__handle-track,
.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__icon,
.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__handle::before,
.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__handle::after,
.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__track::before,
.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__track::after {
  transition: none;
}
.mat-mdc-slide-toggle .mdc-switch:enabled + .mdc-label {
  cursor: pointer;
}
.mat-mdc-slide-toggle .mdc-switch--disabled + label {
  color: var(--%NS%mat-slide-toggle-disabled-label-text-color, var(--%NS%mat-sys-on-surface));
}
.mat-mdc-slide-toggle label:empty {
  display: none;
}

.mat-slide-toggle-full-width {
  width: 100%;
}
.mat-slide-toggle-full-width .mat-internal-form-field {
  width: 100%;
  justify-content: space-between;
}
.mat-slide-toggle-full-width .mat-internal-form-field label {
  margin: 0;
  flex-grow: 1;
  text-align: end;
}
.mat-slide-toggle-full-width .mdc-form-field--align-end label {
  text-align: start;
}

.mat-mdc-slide-toggle-touch-target {
  position: absolute;
  top: 50%;
  left: 50%;
  height: var(--%NS%mat-slide-toggle-touch-target-size, 48px);
  width: 100%;
  transform: translate(-50%, -50%);
  display: var(--%NS%mat-slide-toggle-touch-target-display, block);
}
[dir=rtl] .mat-mdc-slide-toggle-touch-target {
  left: auto;
  right: 50%;
  transform: translate(50%, -50%);
}
`],encapsulation:2})})()}return d})();var Ze=(()=>{class d{static ɵfac=function(a){return new(a||d)};static ɵmod=Re({type:d});static ɵinj=Ne({imports:[Q,hl]})}return d})();var it=(d,l)=>l.id;var nt=(d,l)=>l.field;var at=(d,l)=>l.rowNumber;function lt(d,l){if(d&1&&(oc(0,`div`,8),yT(1),_f()),d&2){let e=ZC(2);Ri(),Hv(e.error())}}function dt(d,l){if(d&1){let e=WC();oc(0,`tr`,12),yc(`click`,function(){let c=ph(e).$implicit,m=ZC(2);return mh(c.status===`Previewed`&&m.open(c.id))}),oc(1,`td`,13),yT(2),OT(3,`faDate`),_f(),oc(4,`td`),yT(5),_f(),oc(6,`td`)(7,`span`,14),yT(8),_f()(),oc(9,`td`,15),yT(10),OT(11,`faNum`),_f(),oc(12,`td`,15),yT(13),OT(14,`faNum`),_f(),oc(15,`td`,15),yT(16),OT(17,`faNum`),_f(),oc(18,`td`,15),yT(19),OT(20,`faNum`),_f(),oc(21,`td`),yT(22),_f()()}if(d&2){let e=l.$implicit,a=ZC(2);Nn$1(`clickable`,e.status===`Previewed`),Ri(2),Hv(PT(3,14,e.uploadedAt)),Ri(3),Hv(e.fileName),Ri(2),Nn$1(`ok`,e.status===`Committed`)(`warn`,e.status===`Previewed`),Ri(),Hv(a.statusText[e.status]),Ri(2),Hv(PT(11,16,e.totalRows)),Ri(3),Hv(PT(14,18,e.createdCount)),Ri(3),Hv(PT(17,20,e.updatedCount)),Ri(3),Hv(PT(20,22,e.errorRows)),Ri(3),Hv(e.uploadedByName)}}function rt(d,l){d&1&&(oc(0,`tr`)(1,`td`,16),yT(2,`هنوز فایلی وارد نشده است.`),_f()())}function st(d,l){if(d&1){let e=WC();oc(0,`div`,4)(1,`h2`),yT(2,`۱. انتخاب فایل`),_f(),oc(3,`p`,5),yT(4,`فایل `),oc(5,`b`),yT(6,`.xlsx`),_f(),yT(7,` (حداکثر ۵ مگابایت). ستون‌ها از روی عنوان ردیف اول شناسایی می‌شوند و قبل از ثبت می‌توانید آن‌ها را اصلاح کنید. تا وقتی «ثبت نهایی» را نزنید هیچ تغییری در موجودی ایجاد نمی‌شود.`),_f(),oc(8,`label`,6)(9,`input`,7),yc(`change`,function(c){ph(e);let m=ZC();return mh(m.onFile(c))}),_f(),oc(10,`span`,3),yT(11,`upload_file`),_f(),oc(12,`span`),yT(13),_f()(),ji(14,lt,2,1,`div`,8),_f(),oc(15,`div`,4)(16,`h2`),yT(17,`سابقه ورود اطلاعات`),_f(),oc(18,`div`,9)(19,`table`,10)(20,`thead`)(21,`tr`)(22,`th`),yT(23,`زمان`),_f(),oc(24,`th`),yT(25,`فایل`),_f(),oc(26,`th`),yT(27,`وضعیت`),_f(),oc(28,`th`),yT(29,`ردیف`),_f(),oc(30,`th`),yT(31,`جدید`),_f(),oc(32,`th`),yT(33,`به‌روز`),_f(),oc(34,`th`),yT(35,`خطا`),_f(),oc(36,`th`),yT(37,`کاربر`),_f()()(),oc(38,`tbody`),UC(39,dt,23,24,`tr`,11,it,!1,rt,3,0,`tr`),_f()()()()}if(d&2){let e=ZC();Ri(8),Nn$1(`busy`,e.busy()),Ri(),Sv(`disabled`,e.busy()),Ri(4),Hv(e.busy()?`در حال بررسی…`:`برای انتخاب فایل کلیک کنید`),Ri(),Bi(e.error()?14:-1),Ri(25),VC(e.history())}}function ct(d,l){if(d&1&&(oc(0,`mat-option`,31),yT(1),OT(2,`faNum`),_f()),d&2){let e=l.$implicit,a=l.$index;Sv(`value`,a),Ri(),$v(`ستون `,PT(2,3,a+1),`: `,e||`(بدون عنوان)`)}}function ot(d,l){if(d&1){let e=WC();oc(0,`mat-form-field`)(1,`mat-label`),yT(2),_f(),oc(3,`mat-select`,19),NS(),yc(`ngModelChange`,function(c){let m=ph(e).$implicit,w=ZC(2);return mh(w.setMap(m.field,c))}),oc(4,`mat-option`,31),yT(5,`— استفاده نشود —`),_f(),UC(6,ct,3,5,`mat-option`,31,jC),_f()()}if(d&2){let e=l.$implicit;ZC();let a=TT(0),c=ZC();Ri(2),$v(``,e.label,``,c.required.includes(e.field)?` *`:``),Ri(),Sv(`ngModel`,c.mapping()[e.field]??-1)(`disabled`,a.status!==`Previewed`),xS(),Ri(),Sv(`value`,-1),Ri(2),VC(a.headers)}}function mt(d,l){d&1&&vc(0,`mat-progress-bar`,21)}function ut(d,l){if(d&1&&(oc(0,`tr`)(1,`td`,15),yT(2),OT(3,`faNum`),_f(),oc(4,`td`)(5,`span`,14),yT(6),OT(7,`label`),_f()(),oc(8,`td`,15),yT(9),_f(),oc(10,`td`),yT(11),_f(),oc(12,`td`,15),yT(13),OT(14,`faNum`),_f(),oc(15,`td`,15),yT(16),OT(17,`faNum`),_f(),oc(18,`td`,15),yT(19),OT(20,`faNum`),_f(),oc(21,`td`),yT(22),OT(23,`label`),_f(),oc(24,`td`,15),yT(25),OT(26,`faNum`),_f(),oc(27,`td`,32),yT(28),_f()()),d&2){let e=l.$implicit,a=ZC(2);Nn$1(`err`,e.action===`Error`),Ri(2),Hv(PT(3,18,e.rowNumber)),Ri(3),Nn$1(`ok`,e.action===`Create`)(`gold`,e.action===`Update`)(`bad`,e.action===`Error`),Ri(),Hv(PT(7,20,e.action)),Ri(3),Hv(e.parsed?.sku??e.sku??`—`),Ri(2),Hv(e.parsed?.name??a.cell(e.cells,`Name`)),Ri(2),Hv(e.parsed?PT(14,22,e.parsed.purity):a.cell(e.cells,`Purity`)),Ri(3),Hv(e.parsed?PT(17,24,e.parsed.weightGrams):a.cell(e.cells,`Weight`)),Ri(3),Hv(e.parsed?PT(20,26,e.parsed.wagePercent):a.cell(e.cells,`WagePercent`)),Ri(3),Hv(e.parsed?PT(23,28,e.parsed.trackingMode):a.cell(e.cells,`Tracking`)),Ri(3),Hv(e.parsed?PT(26,30,e.parsed.stock):a.cell(e.cells,`Stock`)),Ri(3),Hv(e.errors)}}function gt(d,l){d&1&&(oc(0,`tr`)(1,`td`,33),yT(2,`ردیفی برای نمایش نیست.`),_f()())}function ht(d,l){d&1&&(oc(0,`span`,20),yT(1,`ردیف‌های دارای خطا ثبت نمی‌شوند؛ می‌توانید فایل را اصلاح و دوباره بارگذاری کنید.`),_f())}function pt(d,l){if(d&1){let e=WC();oc(0,`button`,34),yc(`click`,function(){ph(e);let c=ZC(2);return mh(c.commit())}),yT(1),OT(2,`faNum`),_f(),oc(3,`button`,35),yc(`click`,function(){ph(e);let c=ZC(2);return mh(c.discard())}),yT(4,`لغو این فایل`),_f(),ji(5,ht,2,0,`span`,20)}if(d&2){ZC();let e=TT(0),a=ZC();Sv(`disabled`,a.busy()||e.createdCount+e.updatedCount===0),Ri(),Tf(` ثبت نهایی (`,PT(2,4,e.createdCount+e.updatedCount),` ردیف معتبر) `),Ri(2),Sv(`disabled`,a.busy()),Ri(2),Bi(e.errorRows?5:-1)}}function bt(d,l){if(d&1){let e=WC();oc(0,`div`,36),yT(1),OT(2,`faNum`),OT(3,`faNum`),_f(),oc(4,`button`,37),yc(`click`,function(){ph(e);let c=ZC(2);return mh(c.reset())}),yT(5,`فایل دیگر`),_f()}if(d&2){ZC();let e=TT(0);Ri(),$v(`این فایل ثبت شد: `,PT(2,2,e.createdCount),` کالای جدید، `,PT(3,4,e.updatedCount),` به‌روزرسانی.`)}}function _t(d,l){if(d&1){let e=WC();Yv(0),oc(1,`div`,4)(2,`h2`),yT(3),_f(),oc(4,`div`,17),UC(5,ot,8,5,`mat-form-field`,null,nt),_f(),oc(7,`div`,18)(8,`mat-slide-toggle`,19),NS(),qv(`ngModelChange`,function(c){ph(e);let m=ZC();return ST(m.updateExisting,c)||(m.updateExisting=c),mh(c)}),yc(`ngModelChange`,function(){ph(e);let c=ZC();return mh(c.revalidate())}),yT(9,` کالاهایی که کدشان قبلاً ثبت شده به‌روزرسانی شوند `),_f(),oc(10,`span`,20),yT(11),_f()()(),ji(12,mt,1,0,`mat-progress-bar`,21),oc(13,`div`,4)(14,`h2`),yT(15,`۳. پیش‌نمایش`),_f(),oc(16,`div`,22)(17,`div`)(18,`b`,15),yT(19),OT(20,`faNum`),_f(),oc(21,`span`),yT(22,`ردیف`),_f()(),oc(23,`div`,23)(24,`b`,15),yT(25),OT(26,`faNum`),_f(),oc(27,`span`),yT(28,`کالای جدید`),_f()(),oc(29,`div`,24)(30,`b`,15),yT(31),OT(32,`faNum`),_f(),oc(33,`span`),yT(34,`به‌روزرسانی`),_f()(),oc(35,`div`)(36,`b`,15),yT(37),OT(38,`faNum`),_f(),oc(39,`span`),yT(40,`رد (تکراری)`),_f()(),oc(41,`div`,25)(42,`b`,15),yT(43),OT(44,`faNum`),_f(),oc(45,`span`),yT(46,`خطا`),_f()()(),oc(47,`div`,26)(48,`mat-slide-toggle`,27),NS(),qv(`ngModelChange`,function(c){ph(e);let m=ZC();return ST(m.onlyErrors,c)||(m.onlyErrors=c),mh(c)}),yT(49,`فقط ردیف‌های دارای خطا`),_f()(),oc(50,`div`,28)(51,`table`,10)(52,`thead`)(53,`tr`)(54,`th`),yT(55,`ردیف`),_f(),oc(56,`th`),yT(57,`نتیجه`),_f(),oc(58,`th`),yT(59,`کد`),_f(),oc(60,`th`),yT(61,`نام`),_f(),oc(62,`th`),yT(63,`عیار`),_f(),oc(64,`th`),yT(65,`وزن`),_f(),oc(66,`th`),yT(67,`اجرت`),_f(),oc(68,`th`),yT(69,`نوع`),_f(),oc(70,`th`),yT(71,`موجودی`),_f(),oc(72,`th`),yT(73,`خطاها`),_f()()(),oc(74,`tbody`),UC(75,ut,29,32,`tr`,29,at,!1,gt,3,0,`tr`),_f()()()(),oc(78,`div`,30),ji(79,pt,6,6)(80,bt,6,6),_f()}if(d&2){let e=ZC(),a=CT(e.preview());Ri(3),Tf(`۲. تطبیق ستون‌ها — `,a.fileName),Ri(2),VC(e.fields()),Ri(3),Wv(`ngModel`,e.updateExisting),Sv(`disabled`,a.status!==`Previewed`),xS(),Ri(3),Hv(e.updateExisting?`مشخصات و موجودی کالای موجود با فایل جایگزین می‌شود (تغییر موجودی در تاریخچه ثبت می‌شود).`:`کالاهای موجود دست‌نخورده می‌مانند.`),Ri(),Bi(e.busy()?12:-1),Ri(7),Hv(PT(20,14,a.totalRows)),Ri(6),Hv(PT(26,16,a.createdCount)),Ri(6),Hv(PT(32,18,a.updatedCount)),Ri(6),Hv(PT(38,20,a.skippedCount)),Ri(6),Hv(PT(44,22,a.errorRows)),Ri(5),Wv(`ngModel`,e.onlyErrors),xS(),Ri(27),VC(e.visibleRows()),Ri(4),Bi(a.status===`Previewed`?79:80)}}var Ye=class d{api=m(EE);snack=m(Ht);dialogs=m(Z);required=[`Sku`,`Name`,`Weight`];statusText={Previewed:`در انتظار ثبت`,Committed:`ثبت شده`,Discarded:`لغو شده`};fields=Z$1([]);history=Z$1([]);preview=Z$1(null);mapping=Z$1({});busy=Z$1(!1);error=Z$1(``);updateExisting=!0;onlyErrorsSig=Z$1(!1);get onlyErrors(){return this.onlyErrorsSig()}set onlyErrors(l){this.onlyErrorsSig.set(l)}visibleRows=_c(()=>{let l=this.preview()?.rows??[];return(this.onlyErrorsSig()?l.filter(e=>e.action===`Error`):l).slice(0,1e3)});ngOnInit(){this.api.importFields().subscribe(l=>this.fields.set(l)),this.loadHistory()}loadHistory(){this.api.imports().subscribe(l=>this.history.set(l))}cell(l,e){let a=this.mapping()[e];return a===void 0||a<0?``:l[a]??``}show(l){this.preview.set(l),this.mapping.set(g({},l.mapping))}async onFile(l){let e=l.target,a=e.files?.[0];if(e.value=``,!!a){this.busy.set(!0),this.error.set(``);try{this.show(await VE(this.api.upload(a))),this.updateExisting=!0}catch(c){this.error.set(rq(c))}finally{this.busy.set(!1)}}}async open(l){try{this.show(await VE(this.api.importBatch(l)))}catch(e){this.snack.open(rq(e),`باشه`)}}setMap(l,e){this.mapping.update(a=>U(g({},a),{[l]:e})),this.revalidate()}async revalidate(){let l=this.preview();if(!(!l||l.status!==`Previewed`)){this.busy.set(!0);try{this.show(await VE(this.api.revalidate(l.id,this.mapping(),this.updateExisting)))}catch(e){this.snack.open(rq(e),`باشه`)}finally{this.busy.set(!1)}}}async commit(){let l=this.preview();if(!(!l||!await this.dialogs.confirm(`ثبت نهایی ورود اطلاعات`,`${l.createdCount} \u06A9\u0627\u0644\u0627\u06CC \u062C\u062F\u06CC\u062F \u062B\u0628\u062A \u0648 ${l.updatedCount} \u06A9\u0627\u0644\u0627 \u0628\u0647\u200C\u0631\u0648\u0632\u0631\u0633\u0627\u0646\u06CC \u0645\u06CC\u200C\u0634\u0648\u062F. ${l.errorRows?l.errorRows+` ردیف دارای خطا نادیده گرفته می‌شود.`:``}`,{confirmText:`ثبت نهایی`}))){this.busy.set(!0);try{this.show(await VE(this.api.commitImport(l.id,this.updateExisting))),this.snack.open(`اطلاعات با موفقیت ثبت شد.`,`باشه`),this.loadHistory()}catch(a){this.snack.open(rq(a),`باشه`,{duration:8e3})}finally{this.busy.set(!1)}}}async discard(){let l=this.preview();if(l){try{await VE(this.api.discardImport(l.id))}catch{}this.reset()}}reset(){this.preview.set(null),this.loadHistory()}static ɵfac=function(e){return new(e||d)};static ɵcmp=qe({type:d,selectors:[[`app-import`]],decls:14,vars:3,consts:[[1,`page`],[1,`page-head`],[`mat-stroked-button`,``,3,`href`],[1,`material-symbols-outlined`],[1,`card`],[1,`muted`],[1,`drop`],[`type`,`file`,`accept`,`.xlsx`,3,`change`,`disabled`],[1,`error-box`],[1,`table-wrap`],[1,`t`],[3,`clickable`],[3,`click`],[1,`num`,`small`],[1,`badge`],[1,`num`],[`colspan`,`8`,1,`empty`],[1,`map-grid`],[1,`row`],[3,`ngModelChange`,`ngModel`,`disabled`],[1,`muted`,`small`],[`mode`,`indeterminate`],[1,`stats`],[1,`ok`],[1,`gold`],[1,`bad`],[1,`row`,2,`margin`,`10px 0`],[3,`ngModelChange`,`ngModel`],[1,`table-wrap`,`preview`],[3,`err`],[1,`row`,`actions`],[3,`value`],[1,`errs`],[`colspan`,`10`,1,`empty`],[`mat-flat-button`,``,1,`big-btn`,3,`click`,`disabled`],[`mat-button`,``,3,`click`,`disabled`],[1,`info-box`],[`mat-stroked-button`,``,3,`click`]],template:function(e,a){e&1&&(oc(0,`div`,0)(1,`div`,1)(2,`h1`),yT(3,`ورود کالا از اکسل`),_f(),oc(4,`a`,2)(5,`span`,3),yT(6,`download`),_f(),yT(7,` قالب خالی`),_f(),oc(8,`a`,2)(9,`span`,3),yT(10,`download`),_f(),yT(11,` قالب با داده نمونه`),_f()(),ji(12,st,42,6)(13,_t,81,24),_f()),e&2&&(Ri(4),Sv(`href`,a.api.templateUrl(!1),fb),Ri(4),Sv(`href`,a.api.templateUrl(!0),fb),Ri(4),Bi(a.preview()?13:12))},dependencies:[Nn,An,Zt,Z5,q5,Qn,it$1,oe,yn,bn,$,Ze,Q,j,L,a,u,o],styles:[`.drop[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center;gap:8px;padding:36px;border:2px dashed var(--%NS%gold);border-radius:14px;background:#fffaf0;cursor:pointer;color:var(--%NS%gold)}.drop[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{display:none}.drop[_ngcontent-%COMP%]   span.material-symbols-outlined[_ngcontent-%COMP%]{font-size:42px}.drop.busy[_ngcontent-%COMP%]{opacity:.6}.map-grid[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:4px 12px;margin-bottom:8px}.stats[_ngcontent-%COMP%]{display:flex;gap:10px;flex-wrap:wrap}.stats[_ngcontent-%COMP%] > div[_ngcontent-%COMP%]{flex:1 1 110px;border:1px solid var(--%NS%line);border-radius:12px;padding:10px 14px;display:flex;flex-direction:column}.stats[_ngcontent-%COMP%]   b[_ngcontent-%COMP%]{font-size:24px}.stats[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{color:var(--%NS%muted);font-size:13px}.stats[_ngcontent-%COMP%]   .ok[_ngcontent-%COMP%]   b[_ngcontent-%COMP%]{color:var(--%NS%ok)}.stats[_ngcontent-%COMP%]   .bad[_ngcontent-%COMP%]   b[_ngcontent-%COMP%]{color:var(--%NS%bad)}.stats[_ngcontent-%COMP%]   .gold[_ngcontent-%COMP%]   b[_ngcontent-%COMP%]{color:var(--%NS%gold)}.preview[_ngcontent-%COMP%]{max-height:520px;overflow:auto}tr.err[_ngcontent-%COMP%]{background:#fff6f6}.errs[_ngcontent-%COMP%]{color:var(--%NS%bad);font-size:13px;min-width:220px}.actions[_ngcontent-%COMP%]{margin-top:16px}`]})};export{Ye as ImportPage};