import{m as ae$1,n as An,p as Zt$1,s as Nn,w as a}from"./main-JSHFMLMY.js";import{n as s,t as g}from"./chunk-CxAg95D_.js";import{i,n as a$1,s as u}from"./chunk-0NbTUipz.js";import{$ as Oo,C as EE,Dr as yT,Er as yE,Et as Tr,F as In,Ft as Vi,Hn as la,J as Nf,K as NS,Lt as Vp,M as Hv,Mt as VC,Nt as VD,O as Fp,Or as yc,P as If,Qt as ZC,Rn as ji,Sn as fl,U as Lv,Ut as XC,V as LT,Vt as Wv,Wn as m,X as OT,Xn as oc,Xt as Z,Y as Nn$1,Zt as Z5,_r as vc,an as _f,ar as qe,ct as Re,d as Bi,fn as b,gt as Sf,i as AT,in as _e,jn as hl,kt as UC,lt as Ri,mn as ce,mt as Sc,n as $v,nt as PT,o as Av,pn as bE,pt as ST,q as Ne,rn as _c,sr as qv,st as Qt$1,t as $i,tr as pt,un as aE,ur as rq,v as Dc,w as Ee,wr as xS,wt as Tf,x as E5,yt as Sv}from"./chunk-CW1CpVlt.js";var Et=new b(`MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS`,{providedIn:`root`,factory:()=>({hideSingleSelectionIndicator:!1,hideMultipleSelectionIndicator:!1,disabledInteractive:!1})});var At=new b(`MatButtonToggleGroup`);var Qt={provide:ae$1,useExisting:la(()=>U),multi:!0};var D=class{source;value;constructor(l,t){this.source=l,this.value=t}};var U=(()=>{class e{_changeDetector=m($i);_dir=m(VD,{optional:!0});_multiple=!1;_disabled=!1;_disabledInteractive=!1;_selectionModel;_rawValue;_controlValueAccessorChangeFn=()=>{};_onTouched=()=>{};_buttonToggles;appearance;get name(){return this._name}set name(t){this._name=t,this._markButtonsForCheck()}_name=m(Vp).getId(`mat-button-toggle-group-`);vertical=!1;get value(){let t=this._selectionModel?this._selectionModel.selected:[];return this.multiple?t.map(n=>n.value):t[0]?t[0].value:void 0}set value(t){this._setSelectionByValue(t),this.valueChange.emit(this.value)}valueChange=new ce;get selected(){let t=this._selectionModel?this._selectionModel.selected:[];return this.multiple?t:t[0]||null}get multiple(){return this._multiple}set multiple(t){this._multiple=t,this._markButtonsForCheck()}get disabled(){return this._disabled}set disabled(t){this._disabled=t,this._markButtonsForCheck()}get disabledInteractive(){return this._disabledInteractive}set disabledInteractive(t){this._disabledInteractive=t,this._markButtonsForCheck()}get dir(){return this._dir&&this._dir.value===`rtl`?`rtl`:`ltr`}change=new ce;get hideSingleSelectionIndicator(){return this._hideSingleSelectionIndicator}set hideSingleSelectionIndicator(t){this._hideSingleSelectionIndicator=t,this._markButtonsForCheck()}_hideSingleSelectionIndicator;get hideMultipleSelectionIndicator(){return this._hideMultipleSelectionIndicator}set hideMultipleSelectionIndicator(t){this._hideMultipleSelectionIndicator=t,this._markButtonsForCheck()}_hideMultipleSelectionIndicator;constructor(){let t=m(Et,{optional:!0});this.appearance=t&&t.appearance?t.appearance:`standard`,this._hideSingleSelectionIndicator=t?.hideSingleSelectionIndicator??!1,this._hideMultipleSelectionIndicator=t?.hideMultipleSelectionIndicator??!1}ngOnInit(){this._selectionModel=new s(this.multiple,void 0,!1)}ngAfterContentInit(){this._selectionModel.select(...this._buttonToggles.filter(t=>t.checked)),this.multiple||this._initializeTabIndex()}writeValue(t){this.value=t,this._changeDetector.markForCheck()}registerOnChange(t){this._controlValueAccessorChangeFn=t}registerOnTouched(t){this._onTouched=t}setDisabledState(t){this.disabled=t}_keydown(t){if(this.multiple||this.disabled||aE(t))return;let i=t.target.id,g=this._buttonToggles.toArray().findIndex(u=>u.buttonId===i),d=null;switch(t.keyCode){case 32:case 13:d=this._buttonToggles.get(g)||null;break;case 38:d=this._getNextButton(g,-1);break;case 37:d=this._getNextButton(g,this.dir===`ltr`?-1:1);break;case 40:d=this._getNextButton(g,1);break;case 39:d=this._getNextButton(g,this.dir===`ltr`?1:-1);break;default:return}d&&(t.preventDefault(),d._onButtonClick(),d.focus())}_emitChangeEvent(t){let n=new D(t,this.value);this._rawValue=n.value,this._controlValueAccessorChangeFn(n.value),this.change.emit(n)}_syncButtonToggle(t,n,i=!1,g=!1){!this.multiple&&this.selected&&!t.checked&&(this.selected.checked=!1),this._selectionModel?n?this._selectionModel.select(t):this._selectionModel.deselect(t):g=!0,g?Promise.resolve().then(()=>this._updateModelValue(t,i)):this._updateModelValue(t,i)}_isSelected(t){return this._selectionModel&&this._selectionModel.isSelected(t)}_isPrechecked(t){return typeof this._rawValue>`u`?!1:this.multiple&&Array.isArray(this._rawValue)?this._rawValue.some(n=>t.value!=null&&n===t.value):t.value===this._rawValue}_initializeTabIndex(){if(this._buttonToggles.forEach(t=>{t.tabIndex=-1}),this.selected)this.selected.tabIndex=0;else for(let t=0;t<this._buttonToggles.length;t++){let n=this._buttonToggles.get(t);if(!n.disabled){n.tabIndex=0;break}}}_getNextButton(t,n){let i=this._buttonToggles;for(let g=1;g<=i.length;g++){let d=(t+n*g+i.length)%i.length,u=i.get(d);if(u&&!u.disabled)return u}return null}_setSelectionByValue(t){if(this._rawValue=t,!this._buttonToggles)return;let n=this._buttonToggles.toArray();if(this.multiple&&t?(this._clearSelection(),t.forEach(i=>this._selectValue(i,n))):(this._clearSelection(),this._selectValue(t,n)),!this.multiple&&n.every(i=>i.tabIndex===-1)){for(let i of n)if(!i.disabled){i.tabIndex=0;break}}}_clearSelection(){this._selectionModel.clear(),this._buttonToggles.forEach(t=>{t.checked=!1,this.multiple||(t.tabIndex=-1)})}_selectValue(t,n){for(let i of n)if(i.value===t){i.checked=!0,this._selectionModel.select(i),this.multiple||(i.tabIndex=0);break}}_updateModelValue(t,n){n&&this._emitChangeEvent(t),this.valueChange.emit(this.value)}_markButtonsForCheck(){this._buttonToggles?.forEach(t=>t._markForCheck())}static ɵfac=function(n){return new(n||e)};static ɵdir=_e({type:e,selectors:[[`mat-button-toggle-group`]],contentQueries:function(n,i,g){if(n&1&&Dc(g,F,5),n&2){let d;If(d=Sf())&&(i._buttonToggles=d)}},hostAttrs:[1,`mat-button-toggle-group`],hostVars:6,hostBindings:function(n,i){n&1&&yc(`keydown`,function(d){return i._keydown(d)}),n&2&&(In(`role`,i.multiple?`group`:`radiogroup`)(`aria-disabled`,i.disabled),Nn$1(`mat-button-toggle-vertical`,i.vertical)(`mat-button-toggle-group-appearance-standard`,i.appearance===`standard`))},inputs:{appearance:`appearance`,name:`name`,vertical:[2,`vertical`,`vertical`,pt],value:`value`,multiple:[2,`multiple`,`multiple`,pt],disabled:[2,`disabled`,`disabled`,pt],disabledInteractive:[2,`disabledInteractive`,`disabledInteractive`,pt],hideSingleSelectionIndicator:[2,`hideSingleSelectionIndicator`,`hideSingleSelectionIndicator`,pt],hideMultipleSelectionIndicator:[2,`hideMultipleSelectionIndicator`,`hideMultipleSelectionIndicator`,pt]},outputs:{valueChange:`valueChange`,change:`change`},exportAs:[`matButtonToggleGroup`],features:[Nf([Qt,{provide:At,useExisting:e}])]})}return e})();var F=(()=>{class e{_changeDetectorRef=m($i);_elementRef=m(Ee);_focusMonitor=m(Fp);_idGenerator=m(Vp);_animationDisabled=Oo();_checked=!1;ariaLabel;ariaLabelledby=null;_buttonElement;buttonToggleGroup;get buttonId(){return`${this.id}-button`}id;name;value;get tabIndex(){return this._tabIndex()}set tabIndex(t){this._tabIndex.set(t)}_tabIndex;disableRipple=!1;get appearance(){return this.buttonToggleGroup?this.buttonToggleGroup.appearance:this._appearance}set appearance(t){this._appearance=t}_appearance;get checked(){return this.buttonToggleGroup?this.buttonToggleGroup._isSelected(this):this._checked}set checked(t){t!==this._checked&&(this._checked=t,this.buttonToggleGroup&&this.buttonToggleGroup._syncButtonToggle(this,this._checked),this._changeDetectorRef.markForCheck())}get disabled(){return this._disabled||this.buttonToggleGroup&&this.buttonToggleGroup.disabled}set disabled(t){this._disabled=t}_disabled=!1;get disabledInteractive(){return this._disabledInteractive||this.buttonToggleGroup!==null&&this.buttonToggleGroup.disabledInteractive}set disabledInteractive(t){this._disabledInteractive=t}_disabledInteractive;change=new ce;constructor(){m(Tr).load(bE);let t=m(At,{optional:!0}),n=m(new Sc(`tabindex`),{optional:!0})||``,i=m(Et,{optional:!0});this._tabIndex=Z(parseInt(n)||0),this.buttonToggleGroup=t,this._appearance=i&&i.appearance?i.appearance:`standard`,this._disabledInteractive=i?.disabledInteractive??!1}ngOnInit(){let t=this.buttonToggleGroup;this.id=this.id||this._idGenerator.getId(`mat-button-toggle-`),t&&(t._isPrechecked(this)?this.checked=!0:t._isSelected(this)!==this._checked&&t._syncButtonToggle(this,this._checked))}ngAfterViewInit(){this._animationDisabled||this._elementRef.nativeElement.classList.add(`mat-button-toggle-animations-enabled`),this._focusMonitor.monitor(this._elementRef,!0)}ngOnDestroy(){let t=this.buttonToggleGroup;this._focusMonitor.stopMonitoring(this._elementRef),t&&t._isSelected(this)&&t._syncButtonToggle(this,!1,!1,!0)}focus(t){this._buttonElement.nativeElement.focus(t)}_onButtonClick(){if(this.disabled)return;let t=this.isSingleSelector()?!0:!this._checked;if(t!==this._checked&&(this._checked=t,this.buttonToggleGroup&&(this.buttonToggleGroup._syncButtonToggle(this,this._checked,!0),this.buttonToggleGroup._onTouched())),this.isSingleSelector()){let n=this.buttonToggleGroup._buttonToggles.find(i=>i.tabIndex===0);n&&(n.tabIndex=-1),this.tabIndex=0}this.change.emit(new D(this,this.value))}_markForCheck(){this._changeDetectorRef.markForCheck()}_getButtonName(){return this.isSingleSelector()?this.buttonToggleGroup.name:this.name||null}isSingleSelector(){return this.buttonToggleGroup&&!this.buttonToggleGroup.multiple}static ɵfac=function(n){return new(n||e)};static ɵcmp=(function(){let t=[`button`],n=[`*`];function i(g,d){if(g&1&&(oc(0,`div`,2),vc(1,`mat-pseudo-checkbox`,6),_f()),g&2){let u=ZC();Ri(),Sv(`disabled`,u.disabled)}}return qe({type:e,selectors:[[`mat-button-toggle`]],viewQuery:function(d,u){if(d&1&&Av(t,5),d&2){let k;If(k=Sf())&&(u._buttonElement=k.first)}},hostAttrs:[`role`,`presentation`,1,`mat-button-toggle`],hostVars:14,hostBindings:function(d,u){d&1&&yc(`focus`,function(){return u.focus()}),d&2&&(In(`aria-label`,null)(`aria-labelledby`,null)(`id`,u.id)(`name`,null),Nn$1(`mat-button-toggle-standalone`,!u.buttonToggleGroup)(`mat-button-toggle-checked`,u.checked)(`mat-button-toggle-disabled`,u.disabled)(`mat-button-toggle-disabled-interactive`,u.disabledInteractive)(`mat-button-toggle-appearance-standard`,u.appearance===`standard`))},inputs:{ariaLabel:[0,`aria-label`,`ariaLabel`],ariaLabelledby:[0,`aria-labelledby`,`ariaLabelledby`],id:`id`,name:`name`,value:`value`,tabIndex:`tabIndex`,disableRipple:[2,`disableRipple`,`disableRipple`,pt],appearance:`appearance`,checked:[2,`checked`,`checked`,pt],disabled:[2,`disabled`,`disabled`,pt],disabledInteractive:[2,`disabledInteractive`,`disabledInteractive`,pt]},outputs:{change:`change`},exportAs:[`matButtonToggle`],ngContentSelectors:n,decls:7,vars:13,consts:[[`button`,``],[`type`,`button`,1,`mat-button-toggle-button`,`mat-focus-indicator`,3,`click`,`id`,`disabled`],[1,`mat-button-toggle-checkbox-wrapper`],[1,`mat-button-toggle-label-content`],[1,`mat-button-toggle-focus-overlay`],[`matRipple`,``,1,`mat-button-toggle-ripple`,3,`matRippleTrigger`,`matRippleDisabled`],[`state`,`checked`,`aria-hidden`,`true`,`appearance`,`minimal`,3,`disabled`]],template:function(d,u){if(d&1&&(Vi(),oc(0,`button`,1,0),yc(`click`,function(){return u._onButtonClick()}),ji(2,i,2,1,`div`,2),oc(3,`span`,3),Qt$1(4),_f()(),vc(5,`span`,4)(6,`span`,5)),d&2){let k=XC(1);Sv(`id`,u.buttonId)(`disabled`,u.disabled&&!u.disabledInteractive||null),In(`role`,u.isSingleSelector()?`radio`:`button`)(`tabindex`,u.disabled&&!u.disabledInteractive?-1:u.tabIndex)(`aria-pressed`,u.isSingleSelector()?null:u.checked)(`aria-checked`,u.isSingleSelector()?u.checked:null)(`name`,u._getButtonName())(`aria-label`,u.ariaLabel)(`aria-labelledby`,u.ariaLabelledby)(`aria-disabled`,u.disabled&&u.disabledInteractive?`true`:null),Ri(2),Bi(u.buttonToggleGroup&&(!u.buttonToggleGroup.multiple&&!u.buttonToggleGroup.hideSingleSelectionIndicator||u.buttonToggleGroup.multiple&&!u.buttonToggleGroup.hideMultipleSelectionIndicator)?2:-1),Ri(4),Sv(`matRippleTrigger`,k)(`matRippleDisabled`,u.disableRipple||u.disabled)}},dependencies:[E5,g],styles:[`.mat-button-toggle-standalone,
.mat-button-toggle-group {
  position: relative;
  display: inline-flex;
  flex-direction: row;
  white-space: nowrap;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
  border-radius: var(--%NS%mat-button-toggle-legacy-shape);
  transform: translateZ(0);
}
.mat-button-toggle-standalone:not([class*=mat-elevation-z]),
.mat-button-toggle-group:not([class*=mat-elevation-z]) {
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
}
@media (forced-colors: active) {
  .mat-button-toggle-standalone,
  .mat-button-toggle-group {
    outline: solid 1px;
  }
}

.mat-button-toggle-standalone.mat-button-toggle-appearance-standard,
.mat-button-toggle-group-appearance-standard {
  border-radius: var(--%NS%mat-button-toggle-shape, var(--%NS%mat-sys-corner-extra-large));
  border: solid 1px var(--%NS%mat-button-toggle-divider-color, var(--%NS%mat-sys-outline));
}
.mat-button-toggle-standalone.mat-button-toggle-appearance-standard .mat-pseudo-checkbox,
.mat-button-toggle-group-appearance-standard .mat-pseudo-checkbox {
  --%NS%mat-pseudo-checkbox-minimal-selected-checkmark-color: var(--%NS%mat-button-toggle-selected-state-text-color, var(--%NS%mat-sys-on-secondary-container));
}
.mat-button-toggle-standalone.mat-button-toggle-appearance-standard:not([class*=mat-elevation-z]),
.mat-button-toggle-group-appearance-standard:not([class*=mat-elevation-z]) {
  box-shadow: none;
}
@media (forced-colors: active) {
  .mat-button-toggle-standalone.mat-button-toggle-appearance-standard,
  .mat-button-toggle-group-appearance-standard {
    outline: 0;
  }
}

.mat-button-toggle-vertical {
  flex-direction: column;
}
.mat-button-toggle-vertical .mat-button-toggle-label-content {
  display: block;
}

.mat-button-toggle {
  white-space: nowrap;
  position: relative;
  color: var(--%NS%mat-button-toggle-legacy-text-color);
  font-family: var(--%NS%mat-button-toggle-legacy-label-text-font);
  font-size: var(--%NS%mat-button-toggle-legacy-label-text-size);
  line-height: var(--%NS%mat-button-toggle-legacy-label-text-line-height);
  font-weight: var(--%NS%mat-button-toggle-legacy-label-text-weight);
  letter-spacing: var(--%NS%mat-button-toggle-legacy-label-text-tracking);
  --%NS%mat-pseudo-checkbox-minimal-selected-checkmark-color: var(--%NS%mat-button-toggle-legacy-selected-state-text-color);
}
.mat-button-toggle.cdk-keyboard-focused .mat-button-toggle-focus-overlay {
  opacity: var(--%NS%mat-button-toggle-legacy-focus-state-layer-opacity);
}
.mat-button-toggle .mat-icon svg {
  vertical-align: top;
}

.mat-button-toggle-checkbox-wrapper {
  display: inline-block;
  justify-content: flex-start;
  align-items: center;
  width: 0;
  height: 18px;
  line-height: 18px;
  overflow: hidden;
  box-sizing: border-box;
  position: absolute;
  top: 50%;
  left: 16px;
  transform: translate3d(0, -50%, 0);
}
[dir=rtl] .mat-button-toggle-checkbox-wrapper {
  left: auto;
  right: 16px;
}
.mat-button-toggle-appearance-standard .mat-button-toggle-checkbox-wrapper {
  left: 12px;
}
[dir=rtl] .mat-button-toggle-appearance-standard .mat-button-toggle-checkbox-wrapper {
  left: auto;
  right: 12px;
}
.mat-button-toggle-checked .mat-button-toggle-checkbox-wrapper {
  width: 18px;
}
.mat-button-toggle-animations-enabled .mat-button-toggle-checkbox-wrapper {
  transition: width 150ms 45ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-button-toggle-vertical .mat-button-toggle-checkbox-wrapper {
  transition: none;
}

.mat-button-toggle-checked {
  color: var(--%NS%mat-button-toggle-legacy-selected-state-text-color);
  background-color: var(--%NS%mat-button-toggle-legacy-selected-state-background-color);
}

.mat-button-toggle-disabled {
  pointer-events: none;
  color: var(--%NS%mat-button-toggle-legacy-disabled-state-text-color);
  background-color: var(--%NS%mat-button-toggle-legacy-disabled-state-background-color);
  --%NS%mat-pseudo-checkbox-minimal-disabled-selected-checkmark-color: var(--%NS%mat-button-toggle-legacy-disabled-state-text-color);
}
.mat-button-toggle-disabled.mat-button-toggle-checked {
  background-color: var(--%NS%mat-button-toggle-legacy-disabled-selected-state-background-color);
}

.mat-button-toggle-disabled-interactive {
  pointer-events: auto;
}

.mat-button-toggle-appearance-standard {
  color: var(--%NS%mat-button-toggle-text-color, var(--%NS%mat-sys-on-surface));
  background-color: var(--%NS%mat-button-toggle-background-color, transparent);
  font-family: var(--%NS%mat-button-toggle-label-text-font, var(--%NS%mat-sys-label-large-font));
  font-size: var(--%NS%mat-button-toggle-label-text-size, var(--%NS%mat-sys-label-large-size));
  line-height: var(--%NS%mat-button-toggle-label-text-line-height, var(--%NS%mat-sys-label-large-line-height));
  font-weight: var(--%NS%mat-button-toggle-label-text-weight, var(--%NS%mat-sys-label-large-weight));
  letter-spacing: var(--%NS%mat-button-toggle-label-text-tracking, var(--%NS%mat-sys-label-large-tracking));
}
.mat-button-toggle-group-appearance-standard .mat-button-toggle-appearance-standard + .mat-button-toggle-appearance-standard {
  border-left: solid 1px var(--%NS%mat-button-toggle-divider-color, var(--%NS%mat-sys-outline));
}
[dir=rtl] .mat-button-toggle-group-appearance-standard .mat-button-toggle-appearance-standard + .mat-button-toggle-appearance-standard {
  border-left: none;
  border-right: solid 1px var(--%NS%mat-button-toggle-divider-color, var(--%NS%mat-sys-outline));
}
.mat-button-toggle-group-appearance-standard.mat-button-toggle-vertical .mat-button-toggle-appearance-standard + .mat-button-toggle-appearance-standard {
  border-left: none;
  border-right: none;
  border-top: solid 1px var(--%NS%mat-button-toggle-divider-color, var(--%NS%mat-sys-outline));
}
.mat-button-toggle-appearance-standard.mat-button-toggle-checked {
  color: var(--%NS%mat-button-toggle-selected-state-text-color, var(--%NS%mat-sys-on-secondary-container));
  background-color: var(--%NS%mat-button-toggle-selected-state-background-color, var(--%NS%mat-sys-secondary-container));
}
.mat-button-toggle-appearance-standard.mat-button-toggle-disabled {
  color: var(--%NS%mat-button-toggle-disabled-state-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
  background-color: var(--%NS%mat-button-toggle-disabled-state-background-color, transparent);
}
.mat-button-toggle-appearance-standard.mat-button-toggle-disabled .mat-pseudo-checkbox {
  --%NS%mat-pseudo-checkbox-minimal-disabled-selected-checkmark-color: var(--%NS%mat-button-toggle-disabled-selected-state-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mat-button-toggle-appearance-standard.mat-button-toggle-disabled.mat-button-toggle-checked {
  color: var(--%NS%mat-button-toggle-disabled-selected-state-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
  background-color: var(--%NS%mat-button-toggle-disabled-selected-state-background-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 12%, transparent));
}
.mat-button-toggle-appearance-standard .mat-button-toggle-focus-overlay {
  background-color: var(--%NS%mat-button-toggle-state-layer-color, var(--%NS%mat-sys-on-surface));
}
.mat-button-toggle-appearance-standard:hover .mat-button-toggle-focus-overlay {
  opacity: var(--%NS%mat-button-toggle-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));
}
.mat-button-toggle-appearance-standard.cdk-keyboard-focused .mat-button-toggle-focus-overlay {
  opacity: var(--%NS%mat-button-toggle-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity));
}
@media (hover: none) {
  .mat-button-toggle-appearance-standard:hover .mat-button-toggle-focus-overlay {
    display: none;
  }
}

.mat-button-toggle-label-content {
  -webkit-user-select: none;
  user-select: none;
  display: inline-block;
  padding: 0 16px;
  line-height: var(--%NS%mat-button-toggle-legacy-height);
  position: relative;
}
.mat-button-toggle-appearance-standard .mat-button-toggle-label-content {
  padding: 0 12px;
  line-height: var(--%NS%mat-button-toggle-height, 40px);
}

.mat-button-toggle-label-content > * {
  vertical-align: middle;
}

.mat-button-toggle-focus-overlay {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  border-radius: inherit;
  pointer-events: none;
  opacity: 0;
  background-color: var(--%NS%mat-button-toggle-legacy-state-layer-color);
}

@media (forced-colors: active) {
  .mat-button-toggle-checked .mat-button-toggle-focus-overlay {
    border-bottom: solid 500px;
    opacity: 0.5;
    height: 0;
  }
  .mat-button-toggle-checked:hover .mat-button-toggle-focus-overlay {
    opacity: 0.6;
  }
  .mat-button-toggle-checked.mat-button-toggle-appearance-standard .mat-button-toggle-focus-overlay {
    border-bottom: solid 500px;
  }
}
.mat-button-toggle .mat-button-toggle-ripple {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  pointer-events: none;
}

.mat-button-toggle-button {
  border: 0;
  background: none;
  color: inherit;
  padding: 0;
  margin: 0;
  font: inherit;
  outline: none;
  width: 100%;
  cursor: pointer;
}
.mat-button-toggle-animations-enabled .mat-button-toggle-button {
  transition: padding 150ms 45ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-button-toggle-vertical .mat-button-toggle-button {
  transition: none;
}
.mat-button-toggle-disabled .mat-button-toggle-button {
  cursor: default;
}
.mat-button-toggle-button::-moz-focus-inner {
  border: 0;
}
.mat-button-toggle-checked .mat-button-toggle-button:has(.mat-button-toggle-checkbox-wrapper) {
  padding-left: 30px;
}
[dir=rtl] .mat-button-toggle-checked .mat-button-toggle-button:has(.mat-button-toggle-checkbox-wrapper) {
  padding-left: 0;
  padding-right: 30px;
}

.mat-button-toggle-standalone.mat-button-toggle-appearance-standard {
  --%NS%mat-focus-indicator-border-radius: var(--%NS%mat-button-toggle-shape, var(--%NS%mat-sys-corner-extra-large));
}

.mat-button-toggle-group-appearance-standard:not(.mat-button-toggle-vertical) .mat-button-toggle:last-of-type .mat-button-toggle-button::before {
  border-top-right-radius: var(--%NS%mat-button-toggle-shape, var(--%NS%mat-sys-corner-extra-large));
  border-bottom-right-radius: var(--%NS%mat-button-toggle-shape, var(--%NS%mat-sys-corner-extra-large));
}
.mat-button-toggle-group-appearance-standard:not(.mat-button-toggle-vertical) .mat-button-toggle:first-of-type .mat-button-toggle-button::before {
  border-top-left-radius: var(--%NS%mat-button-toggle-shape, var(--%NS%mat-sys-corner-extra-large));
  border-bottom-left-radius: var(--%NS%mat-button-toggle-shape, var(--%NS%mat-sys-corner-extra-large));
}

.mat-button-toggle-group-appearance-standard.mat-button-toggle-vertical .mat-button-toggle:last-of-type .mat-button-toggle-button::before {
  border-bottom-right-radius: var(--%NS%mat-button-toggle-shape, var(--%NS%mat-sys-corner-extra-large));
  border-bottom-left-radius: var(--%NS%mat-button-toggle-shape, var(--%NS%mat-sys-corner-extra-large));
}
.mat-button-toggle-group-appearance-standard.mat-button-toggle-vertical .mat-button-toggle:first-of-type .mat-button-toggle-button::before {
  border-top-right-radius: var(--%NS%mat-button-toggle-shape, var(--%NS%mat-sys-corner-extra-large));
  border-top-left-radius: var(--%NS%mat-button-toggle-shape, var(--%NS%mat-sys-corner-extra-large));
}
`],encapsulation:2})})()}return e})();var Dt=(()=>{class e{static ɵfac=function(n){return new(n||e)};static ɵmod=Re({type:e});static ɵinj=Ne({imports:[yE,F,hl]})}return e})();var jt=e=>[`/products`,e];var Ft=(e,l)=>l.category;var Wt=(e,l)=>l.id;var Ht=(e,l)=>l.date;function Zt(e,l){if(e&1&&(oc(0,`div`,4),yT(1),_f()),e&2){let t=ZC();Ri(),Hv(t.error())}}function qt(e,l){e&1&&(oc(0,`div`,4),yT(1,`نرخ روز طلا ثبت نشده است. `),oc(2,`a`,17),yT(3,`ثبت نرخ`),_f()())}function Kt(e,l){if(e&1&&(oc(0,`div`,5),yT(1),OT(2,`faDate`),oc(3,`a`,17),yT(4,`به‌روزرسانی نرخ`),_f()()),e&2){let t=ZC();Ri(),Tf(`آخرین نرخ طلا مربوط به `,PT(2,1,t.rateUpdatedAt),` است. `)}}function Jt(e,l){if(e&1&&(oc(0,`div`,7)(1,`span`),yT(2,`ارزش طلای موجودی`),_f(),oc(3,`b`,8),yT(4),OT(5,`money`),_f(),oc(6,`small`),yT(7,`بدون اجرت و سود`),_f()()),e&2){let t=ZC();Ri(4),Hv(PT(5,1,t.stockGoldValue))}}function Xt(e,l){if(e&1&&(oc(0,`div`,18),OT(1,`faDate`),OT(2,`money`),OT(3,`faNum`),vc(4,`div`,19),oc(5,`span`,20),yT(6),OT(7,`faDate`),_f()()),e&2){let t=l.$implicit,n=l.$index,i=l.$count,g=ZC(3);Sv(`title`,LT(1,4,t.date,`short`)+`: `+PT(2,7,t.total)+` — `+PT(3,9,t.count)+` فاکتور`),Ri(4),Lv(`height`,g.pct(t.total,g.maxDay()),`%`),Ri(2),Hv(i<=10||n%g.Math.ceil(i/7)===0?LT(7,11,t.date,`short`):``)}}function Yt(e,l){if(e&1&&(oc(0,`div`,11),UC(1,Xt,8,14,`div`,18,Ht),_f()),e&2){let t=ZC();Ri(),VC(t.salesByDay)}}function te(e,l){e&1&&(oc(0,`div`,12),yT(1,`در این بازه فروشی ثبت نشده است.`),_f())}function ee(e,l){if(e&1&&(oc(0,`div`,13)(1,`span`,21),yT(2),_f(),oc(3,`div`,22),vc(4,`div`,23),_f(),oc(5,`span`,24),yT(6),OT(7,`money`),_f()()),e&2){let t=l.$implicit,n=ZC(2);Ri(2),Hv(t.category),Ri(2),Lv(`width`,n.pct(t.total,n.maxCat()),`%`),Ri(2),Hv(PT(7,4,t.total))}}function ne(e,l){e&1&&(oc(0,`div`,12),yT(1,`داده‌ای نیست.`),_f())}function ae(e,l){if(e&1&&(oc(0,`tr`)(1,`td`),yT(2),_f(),oc(3,`td`,8),yT(4),OT(5,`faNum`),_f(),oc(6,`td`,8),yT(7),OT(8,`faNum`),_f()()),e&2){let t=l.$implicit;Ri(2),Hv(t.category),Ri(2),Hv(PT(5,3,t.pieces)),Ri(3),Hv(PT(8,5,t.grams))}}function oe(e,l){if(e&1&&(oc(0,`a`,15)(1,`span`,8),yT(2),_f(),yT(3),oc(4,`span`,25),yT(5),OT(6,`faNum`),_f()()),e&2){let t=l.$implicit;Sv(`routerLink`,AT(10,jt,t.id)),Ri(2),Hv(t.sku),Ri(),Tf(` `,t.name,` `),Ri(),Nn$1(`bad`,t.stockQuantity===0)(`warn`,t.stockQuantity>0),Ri(),Hv(PT(6,8,t.stockQuantity))}}function ie(e,l){e&1&&(oc(0,`div`,12),yT(1,`مورد هشداری نیست.`),_f())}function re(e,l){if(e&1&&(ji(0,qt,4,0,`div`,4)(1,Kt,5,3,`div`,5),oc(2,`div`,6)(3,`div`,7)(4,`span`),yT(5,`فروش امروز`),_f(),oc(6,`b`,8),yT(7),OT(8,`money`),_f(),oc(9,`small`),yT(10),OT(11,`faNum`),_f()(),oc(12,`div`,7)(13,`span`),yT(14),OT(15,`faNum`),_f(),oc(16,`b`,8),yT(17),OT(18,`money`),_f(),oc(19,`small`),yT(20),OT(21,`faNum`),_f()(),oc(22,`div`,7)(23,`span`),yT(24,`نرخ ۱۸ عیار`),_f(),oc(25,`b`,8),yT(26),OT(27,`money`),_f(),oc(28,`small`),yT(29),OT(30,`faDate`),_f()(),oc(31,`div`,7)(32,`span`),yT(33,`موجودی`),_f(),oc(34,`b`,8),yT(35),OT(36,`faNum`),_f(),oc(37,`small`),yT(38),OT(39,`faNum`),_f()(),ji(40,Jt,8,3,`div`,7),_f(),oc(41,`div`,9)(42,`div`,10)(43,`h2`),yT(44,`فروش روزانه`),_f(),ji(45,Yt,3,0,`div`,11)(46,te,2,0,`div`,12),_f(),oc(47,`div`,10)(48,`h2`),yT(49,`فروش بر اساس دسته`),_f(),UC(50,ee,8,6,`div`,13,Ft,!1,ne,2,0,`div`,12),_f(),oc(53,`div`,10)(54,`h2`),yT(55,`موجودی بر اساس دسته`),_f(),oc(56,`table`,14)(57,`thead`)(58,`tr`)(59,`th`),yT(60,`دسته`),_f(),oc(61,`th`),yT(62,`تعداد`),_f(),oc(63,`th`),yT(64,`وزن (گرم)`),_f()()(),oc(65,`tbody`),UC(66,ae,9,7,`tr`,null,Ft),_f()()(),oc(68,`div`,10)(69,`h2`),yT(70,`هشدار موجودی کم`),_f(),UC(71,oe,7,12,`a`,15,Wt,!1,ie,2,0,`div`,12),oc(74,`p`,16),yT(75,`فقط کالاهای «تعدادی» با موجودی کمتر یا مساوی حد تعیین‌شده در تنظیمات.`),_f()()()),e&2){let t=l,n=ZC();Bi(t.currentRate?n.rateStale()?1:-1:0),Ri(7),Hv(PT(8,15,t.todaySalesTotal)),Ri(3),$v(``,PT(11,17,t.todayInvoiceCount),` فاکتور · `,t.currency),Ri(4),Tf(`فروش `,PT(15,19,t.days),` روز اخیر`),Ri(3),Hv(PT(18,21,t.periodSalesTotal)),Ri(3),Tf(``,PT(21,23,t.periodInvoiceCount),` فاکتور`),Ri(6),Hv(PT(27,25,t.currentRate)),Ri(3),Hv(PT(30,27,t.rateUpdatedAt)),Ri(6),Tf(``,PT(36,29,t.stockPieces),` عدد`),Ri(3),Tf(`معادل `,PT(39,31,t.stockGrams18k),` گرم ۱۸ عیار`),Ri(2),Bi(n.auth.isOwner()?40:-1),Ri(5),Bi(t.salesByDay.length?45:46),Ri(5),VC(t.salesByCategory),Ri(16),VC(t.stockByCategory),Ri(5),VC(t.lowStock)}}var Gt=class e{api=m(EE);auth=m(a);Math=Math;days=30;d=Z(null);error=Z(``);maxDay=_c(()=>Math.max(1,...this.d()?.salesByDay.map(l=>l.total)??[1]));maxCat=_c(()=>Math.max(1,...this.d()?.salesByCategory.map(l=>l.total)??[1]));rateStale=_c(()=>{let l=this.d()?.rateUpdatedAt;return l?Date.now()-new Date(l.endsWith(`Z`)?l:l+`Z`).getTime()>72e6:!1});ngOnInit(){this.load()}load(){this.api.dashboard(this.days).subscribe({next:l=>{this.d.set(l),this.error.set(``)},error:l=>this.error.set(rq(l))})}pct(l,t){return Math.max(1,l/t*100)}static ɵfac=function(t){return new(t||e)};static ɵcmp=qe({type:e,selectors:[[`app-dashboard`]],decls:13,vars:7,consts:[[1,`page`],[1,`page-head`],[`hideSingleSelectionIndicator`,``,3,`ngModelChange`,`ngModel`],[3,`value`],[1,`error-box`],[1,`info-box`],[1,`kpis`],[1,`kpi`],[1,`num`],[1,`grid-2`],[1,`card`],[1,`bars`],[1,`empty`],[1,`hbar`],[1,`t`],[1,`low`,3,`routerLink`],[1,`muted`,`small`],[`routerLink`,`/rates`],[1,`bar-col`,3,`title`],[1,`bar`],[1,`lbl`],[1,`name`],[1,`track`],[1,`fill`],[1,`num`,`val`],[1,`badge`]],template:function(t,n){if(t&1&&(oc(0,`div`,0)(1,`div`,1)(2,`h1`),yT(3),_f(),oc(4,`mat-button-toggle-group`,2),NS(),qv(`ngModelChange`,function(g){return ST(n.days,g)||(n.days=g),g}),yc(`ngModelChange`,function(){return n.load()}),oc(5,`mat-button-toggle`,3),yT(6,`۷ روز`),_f(),oc(7,`mat-button-toggle`,3),yT(8,`۳۰ روز`),_f(),oc(9,`mat-button-toggle`,3),yT(10,`۹۰ روز`),_f()()(),ji(11,Zt,2,1,`div`,4),ji(12,re,76,33),_f()),t&2){let i;Ri(3),Tf(`سلام `,n.auth.user()?.displayName),Ri(),Wv(`ngModel`,n.days),xS(),Ri(),Sv(`value`,7),Ri(2),Sv(`value`,30),Ri(2),Sv(`value`,90),Ri(2),Bi(n.error()?11:-1),Ri(),Bi((i=n.d())?12:-1,i)}},dependencies:[fl,Nn,An,Zt$1,Z5,Dt,U,F,i,a$1,u],styles:[`.kpis[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:12px;margin-bottom:16px}.kpi[_ngcontent-%COMP%]{background:#fff;border:1px solid var(--%NS%line);border-radius:14px;padding:14px 16px;display:flex;flex-direction:column;gap:4px}.kpi[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{color:var(--%NS%muted);font-size:13px}.kpi[_ngcontent-%COMP%]   b[_ngcontent-%COMP%]{font-size:22px}.kpi[_ngcontent-%COMP%]   small[_ngcontent-%COMP%]{color:var(--%NS%muted)}.bars[_ngcontent-%COMP%]{display:flex;align-items:flex-end;gap:3px;height:180px;padding-top:8px}.bar-col[_ngcontent-%COMP%]{flex:1 1 0;min-width:3px;height:100%;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;gap:4px}.bar[_ngcontent-%COMP%]{width:100%;max-width:28px;background:var(--%NS%gold);border-radius:4px 4px 0 0;min-height:2px}.lbl[_ngcontent-%COMP%]{font-size:10px;color:var(--%NS%muted);white-space:nowrap}.hbar[_ngcontent-%COMP%]{display:grid;grid-template-columns:110px 1fr auto;gap:10px;align-items:center;margin:8px 0}.track[_ngcontent-%COMP%]{background:#f3ede3;border-radius:6px;height:12px;overflow:hidden}.fill[_ngcontent-%COMP%]{background:var(--%NS%gold);height:100%;border-radius:6px}.val[_ngcontent-%COMP%]{font-size:13px}.low[_ngcontent-%COMP%]{display:flex;gap:8px;align-items:center;padding:8px 4px;border-bottom:1px solid var(--%NS%line);color:inherit;text-decoration:none}.low[_ngcontent-%COMP%]   .badge[_ngcontent-%COMP%]{margin-inline-start:auto}`]})};export{Gt as DashboardPage};