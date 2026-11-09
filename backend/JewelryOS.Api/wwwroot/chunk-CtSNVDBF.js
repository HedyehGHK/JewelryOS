import{A as N,B as me,D as Et,M as X$1,N as Y,O as Ht,R as ci,W as xt,k as Mt,w as a}from"./main-NWEBMGN2.js";import{r as h}from"./chunk-BHmHgxbO.js";import{$ as Oo,A as Gx,An as hc,Ar as zo,At as Ug,Bt as Wt$1,Ct as Te,Dn as gs,Dr as yT,Dt as Tv,E as F,Er as yE,Et as Tr,F as In,Fn as io,Ft as Vi,G as N$1,Gn as mh,I as Ip,In as j,J as Nf,Jt as Ye,Kn as nE,L as JE,Lt as Vp,M as Hv,Mt as VC,Nn as hs,Nt as VD,O as Fp,Or as yc,Ot as U,P as If,Q as Ol,Qn as ph,Qt as ZC,Rn as ji,Rt as WC,Sn as fl,Tr as xe$1,U as Lv,Ut as XC,W as Mv,Wn as m,Xn as oc,Xt as Z$1,Y as Nn,Zt as Z5,_r as vc,_t as Sh,a as Ai,an as _f,ar as qe,at as QE,b as E0,cn as a0,ct as Re,d as Bi,dn as ae,dt as Rt$1,er as pr,fn as b,g as Cn,gr as v,gt as Sf,h as Cf,hr as uo,ht as Se,i as AT,in as _e,j as H,jn as hl,jt as Up,kt as UC,ln as a5,lr as rn$1,lt as Ri,mn as ce,o as Av,on as _n,pn as bE,q as Ne,rn as _c,rr as q5,rt as Pr,s as B,sn as _v,st as Qt,t as $i,tr as pt,u as Be$1,un as aE,ut as Rp,v as Dc,vt as Sn,w as Ee,wn as g,wt as Tf,x as E5,yn as ee,yt as Sv,zn as k0}from"./chunk-D0Ip9mUJ.js";function Rt(i,c){let t=!c?.manualCleanup?c?.injector?.get(Te)??m(Te):null,n=Lt(c?.equal),r;c?.requireSync?r=Z$1({kind:0},{equal:n}):r=Z$1({kind:1,value:c?.initialValue},{equal:n});let a,o=i.subscribe({next:d=>r.set({kind:1,value:d}),error:d=>{r.set({kind:2,error:d}),a?.()},complete:()=>{a?.()}});if(c?.requireSync&&r().kind===0)throw new v(601,!1);return a=t?.onDestroy(o.unsubscribe.bind(o)),_c(()=>{let d=r();switch(d.kind){case 1:return d.value;case 2:throw d.error;case 0:throw new v(601,!1)}},{equal:c?.equal})}function Lt(i=Object.is){return(c,e)=>c.kind===1&&e.kind===1&&i(c.value,e.value)}var Wt=new b(`MAT_DRAWER_DEFAULT_AUTOSIZE`,{providedIn:`root`,factory:()=>!1});var Ve=new b(`MAT_DRAWER_CONTAINER`);var de=(()=>{class i extends ci{_platform=m(Ye);_changeDetectorRef=m($i);_element=m(Ee);_ngZone=m(H);_isInert=!1;_container=m(Be);ngAfterContentInit(){this._container._contentMarginChanges.subscribe(()=>this._changeDetectorRef.markForCheck())}_drawerToggled(e){e.opened?this._ngZone.runOutsideAngular(()=>{e._animationEnd.pipe(JE(50),Be$1(1)).subscribe(()=>this._updateInert())}):this._updateInert()}_drawerModeChanged(){this._updateInert()}_updateInert(){let e=this._container._isShowingBackdrop();if(e!==this._isInert){let t=this._element.nativeElement;this._isInert=e,e?t.setAttribute(`inert`,`true`):t.removeAttribute(`inert`)}}_shouldBeHidden(){if(this._platform.isBrowser)return!1;let{start:e,end:t}=this._container;return e!=null&&e.mode!==`over`&&e.opened||t!=null&&t.mode!==`over`&&t.opened}static ɵfac=(()=>{let e;return function(n){return(e||(e=Ug(i)))(n||i)}})();static ɵcmp=(function(){return qe({type:i,selectors:[[`mat-drawer-content`]],hostAttrs:[1,`mat-drawer-content`],hostVars:6,hostBindings:function(n,r){n&2&&(Lv(`margin-left`,r._container._contentMargins.left,`px`)(`margin-right`,r._container._contentMargins.right,`px`),Nn(`mat-drawer-content-hidden`,r._shouldBeHidden()))},features:[Nf([{provide:ci,useExisting:i}]),uo],ngContentSelectors:[`*`],decls:1,vars:0,template:function(n,r){n&1&&(Vi(),Qt(0))},encapsulation:2})})()}return i})();var Fe=(()=>{class i{_elementRef=m(Ee);_focusTrapFactory=m(E0);_focusMonitor=m(Fp);_platform=m(Ye);_ngZone=m(H);_renderer=m(Wt$1);_interactivityChecker=m(nE);_doc=m(B);_isAnimating=!1;_container=m(Ve,{optional:!0});_focusTrap=null;_elementFocusedBeforeDrawerWasOpened=null;_eventCleanups;_isAttached=!1;_anchor=null;get position(){return this._position}set position(e){e=e===`end`?`end`:`start`,e!==this._position&&(this._isAttached&&this._updatePositionInParent(e),this._position=e,this.onPositionChanged.emit())}_position=`start`;get mode(){return this._mode}set mode(e){this._mode=e,this._updateFocusTrapState(),this._modeChanged.next(),this._getContent()?._drawerModeChanged()}_mode=`over`;get disableClose(){return this._disableClose}set disableClose(e){this._disableClose=a5(e)}_disableClose=!1;get autoFocus(){return this._autoFocus??(this.mode===`side`?`dialog`:`first-tabbable`)}set autoFocus(e){(e===`true`||e===`false`||e==null)&&(e=a5(e)),this._autoFocus=e}_autoFocus;get opened(){return this._opened()}set opened(e){this.toggle(a5(e))}_opened=Z$1(!1);_openedVia=null;_animationStarted=new F;_animationEnd=new F;openedChange=new ce(!0);_openedStream=this.openedChange.pipe(Se(e=>e),j(()=>{}));openedStart=this._animationStarted.pipe(Se(()=>this.opened),Ol(void 0));_closedStream=this.openedChange.pipe(Se(e=>!e),j(()=>{}));closedStart=this._animationStarted.pipe(Se(()=>!this.opened),Ol(void 0));_destroyed=new F;onPositionChanged=new ce;_content;_modeChanged=new F;_injector=m(ee);_changeDetectorRef=m($i);constructor(){this.openedChange.pipe(Rt$1(this._destroyed)).subscribe(e=>{e?(this._elementFocusedBeforeDrawerWasOpened=this._doc.activeElement,this._takeFocus()):this._isFocusWithinDrawer()&&this._restoreFocus(this._openedVia||`program`)}),this._eventCleanups=this._ngZone.runOutsideAngular(()=>{let e=this._renderer,t=this._elementRef.nativeElement;return[e.listen(t,`keydown`,n=>{n.keyCode===27&&!this.disableClose&&!aE(n)&&this._ngZone.run(()=>{this.close(),n.stopPropagation(),n.preventDefault()})}),e.listen(t,`transitionend`,this._handleTransitionEvent),e.listen(t,`transitioncancel`,this._handleTransitionEvent)]}),this._animationEnd.subscribe(()=>{this.openedChange.emit(this.opened)})}_focusByCssSelector(e,t){let n=this._elementRef.nativeElement.querySelector(e);n&&(this._interactivityChecker.isFocusable(n)||(n.tabIndex=-1,this._ngZone.runOutsideAngular(()=>{let r=()=>{a(),o(),n.removeAttribute(`tabindex`)},a=this._renderer.listen(n,`blur`,r),o=this._renderer.listen(n,`mousedown`,r)})),n.focus(t))}_takeFocus(){if(!this._focusTrap)return;let e=this._elementRef.nativeElement;switch(this.autoFocus){case!1:case`dialog`:return;case!0:case`first-tabbable`:Ai(()=>{let t=this._isAnimating?{preventScroll:!0}:void 0;!this._focusTrap.focusInitialElement(t)&&typeof e.focus==`function`&&e.focus(t)},{injector:this._injector});break;case`first-heading`:this._focusByCssSelector(`h1, h2, h3, h4, h5, h6, [role="heading"]`);break;default:this._focusByCssSelector(this.autoFocus)}}_restoreFocus(e){this.autoFocus!==`dialog`&&(this._elementFocusedBeforeDrawerWasOpened?this._focusMonitor.focusVia(this._elementFocusedBeforeDrawerWasOpened,e):this._elementRef.nativeElement.blur(),this._elementFocusedBeforeDrawerWasOpened=null)}_isFocusWithinDrawer(){let e=this._doc.activeElement;return!!e&&this._elementRef.nativeElement.contains(e)}ngAfterViewInit(){this._isAttached=!0,this._position===`end`&&this._updatePositionInParent(`end`),this._platform.isBrowser&&(this._focusTrap=this._focusTrapFactory.create(this._elementRef.nativeElement),this._updateFocusTrapState())}ngOnDestroy(){this._eventCleanups.forEach(e=>e()),this._focusTrap?.destroy(),this._anchor?.remove(),this._anchor=null,this._animationStarted.complete(),this._animationEnd.complete(),this._modeChanged.complete(),this._destroyed.next(),this._destroyed.complete()}open(e){return this.toggle(!0,e)}close(){return this.toggle(!1)}_closeViaBackdropClick(){return this._setOpen(!1,!0,`mouse`)}toggle(e=!this.opened,t){e&&t&&(this._openedVia=t);let n=this._setOpen(e,!e&&this._isFocusWithinDrawer(),this._openedVia||`program`);return e||(this._openedVia=null),n}_setOpen(e,t,n){return e===this.opened?Promise.resolve(e?`open`:`close`):(this._opened.set(e),this._getContent()?._drawerToggled(this),this._container?._transitionsEnabled?this._isAnimating?(this._setIsAnimating(!1),this._simulateAnimation()):(this._setIsAnimating(!0),setTimeout(()=>this._animationStarted.next())):this._simulateAnimation(),this._elementRef.nativeElement.classList.toggle(`mat-drawer-opened`,e),!e&&t&&this._restoreFocus(n),this._changeDetectorRef.markForCheck(),this._updateFocusTrapState(),new Promise(r=>{this.openedChange.pipe(Be$1(1)).subscribe(a=>r(a?`open`:`close`))}))}_getContent(){return this._container?._content||this._container?._userContent}_setIsAnimating(e){e!==this._isAnimating&&(this._isAnimating=e,this._elementRef.nativeElement.classList.toggle(`mat-drawer-animating`,e))}_simulateAnimation(){setTimeout(()=>{this._animationStarted.next(),this._animationEnd.next()})}_getWidth(){return this._elementRef.nativeElement.offsetWidth||0}_updateFocusTrapState(){this._focusTrap&&(this._focusTrap.enabled=this.opened&&!!this._container?._isShowingBackdrop())}_updatePositionInParent(e){if(!this._platform.isBrowser)return;let t=this._elementRef.nativeElement,n=t.parentNode;e===`end`?(this._anchor||(this._anchor=this._doc.createComment(`mat-drawer-anchor`),n.insertBefore(this._anchor,t)),n.appendChild(t)):this._anchor&&this._anchor.parentNode.insertBefore(t,this._anchor)}_handleTransitionEvent=e=>{let t=this._elementRef.nativeElement;e.target===t&&this._ngZone.run(()=>{e.type===`transitionend`&&this._setIsAnimating(!1),this._animationEnd.next(e)})};static ɵfac=function(t){return new(t||i)};static ɵcmp=(function(){let e=[`content`];return qe({type:i,selectors:[[`mat-drawer`]],viewQuery:function(r,a){if(r&1&&Av(e,5),r&2){let o;If(o=Sf())&&(a._content=o.first)}},hostAttrs:[1,`mat-drawer`],hostVars:12,hostBindings:function(r,a){r&2&&(In(`align`,null)(`tabIndex`,a.mode!==`side`?`-1`:null),Lv(`visibility`,!a._container&&!a.opened?`hidden`:null),Nn(`mat-drawer-end`,a.position===`end`)(`mat-drawer-over`,a.mode===`over`)(`mat-drawer-push`,a.mode===`push`)(`mat-drawer-side`,a.mode===`side`))},inputs:{position:`position`,mode:`mode`,disableClose:`disableClose`,autoFocus:`autoFocus`,opened:`opened`},outputs:{openedChange:`openedChange`,_openedStream:`opened`,openedStart:`openedStart`,_closedStream:`closed`,closedStart:`closedStart`,onPositionChanged:`positionChanged`},exportAs:[`matDrawer`],ngContentSelectors:[`*`],decls:3,vars:0,consts:[[`content`,``],[`cdkScrollable`,``,1,`mat-drawer-inner-container`]],template:function(r,a){r&1&&(Vi(),oc(0,`div`,1,0),Qt(2),_f())},dependencies:[ci],encapsulation:2})})()}return i})();var Be=(()=>{class i{_dir=m(VD,{optional:!0});_element=m(Ee);_ngZone=m(H);_changeDetectorRef=m($i);_animationDisabled=Oo();_transitionsEnabled=!1;_allDrawers;_drawers=new pr;_content;_userContent;get start(){return this._start}get end(){return this._end}get autosize(){return this._autosize}set autosize(e){this._autosize=a5(e)}_autosize=m(Wt);get hasBackdrop(){return this._drawerHasBackdrop(this._start)||this._drawerHasBackdrop(this._end)}set hasBackdrop(e){this._backdropOverride=e==null?null:a5(e)}_backdropOverride=null;backdropClick=new ce;_start=null;_end=null;_left=null;_right=null;_destroyed=new F;_doCheckSubject=new F;_contentMargins={left:null,right:null};_contentMarginChanges=new F;get scrollable(){return this._userContent||this._content}_injector=m(ee);constructor(){let e=m(Ye),t=m(N);this._dir?.change.pipe(Rt$1(this._destroyed)).subscribe(()=>{this._validateDrawers(),this.updateContentMargins()}),t.change().pipe(Rt$1(this._destroyed)).subscribe(()=>this.updateContentMargins()),!this._animationDisabled&&e.isBrowser&&this._ngZone.runOutsideAngular(()=>{setTimeout(()=>{this._element.nativeElement.classList.add(`mat-drawer-transition`),this._transitionsEnabled=!0},200)})}ngAfterContentInit(){this._allDrawers.changes.pipe(zo(this._allDrawers),Rt$1(this._destroyed)).subscribe(e=>{this._drawers.reset(e.filter(t=>!t._container||t._container===this)),this._drawers.notifyOnChanges()}),this._drawers.changes.pipe(zo(null)).subscribe(()=>{this._validateDrawers(),this._drawers.forEach(e=>{this._watchDrawerToggle(e),this._watchDrawerPosition(e),this._watchDrawerMode(e)}),(!this._drawers.length||this._isDrawerOpen(this._start)||this._isDrawerOpen(this._end))&&this.updateContentMargins(),this._changeDetectorRef.markForCheck()}),this._ngZone.runOutsideAngular(()=>{this._doCheckSubject.pipe(Pr(10),Rt$1(this._destroyed)).subscribe(()=>this.updateContentMargins())})}ngOnDestroy(){this._contentMarginChanges.complete(),this._doCheckSubject.complete(),this._drawers.destroy(),this._destroyed.next(),this._destroyed.complete()}open(){this._drawers.forEach(e=>e.open())}close(){this._drawers.forEach(e=>e.close())}updateContentMargins(){let e=0,t=0;if(this._left&&this._left.opened){if(this._left.mode==`side`)e+=this._left._getWidth();else if(this._left.mode==`push`){let n=this._left._getWidth();e+=n,t-=n}}if(this._right&&this._right.opened){if(this._right.mode==`side`)t+=this._right._getWidth();else if(this._right.mode==`push`){let n=this._right._getWidth();t+=n,e-=n}}e=e||null,t=t||null,(e!==this._contentMargins.left||t!==this._contentMargins.right)&&(this._contentMargins={left:e,right:t},this._ngZone.run(()=>this._contentMarginChanges.next(this._contentMargins)))}ngDoCheck(){this._autosize&&this._isPushed()&&this._ngZone.runOutsideAngular(()=>this._doCheckSubject.next())}_watchDrawerToggle(e){e._animationStarted.pipe(Rt$1(this._drawers.changes)).subscribe(()=>{this.updateContentMargins(),this._changeDetectorRef.markForCheck()}),e.mode!==`side`&&e.openedChange.pipe(Rt$1(this._drawers.changes)).subscribe(()=>this._setContainerClass(e.opened))}_watchDrawerPosition(e){e.onPositionChanged.pipe(Rt$1(this._drawers.changes)).subscribe(()=>{Ai({read:()=>this._validateDrawers()},{injector:this._injector})})}_watchDrawerMode(e){e._modeChanged.pipe(Rt$1(QE(this._drawers.changes,this._destroyed))).subscribe(()=>{this.updateContentMargins(),this._changeDetectorRef.markForCheck()})}_setContainerClass(e){let t=this._element.nativeElement.classList,n=`mat-drawer-container-has-open`;e?t.add(n):t.remove(n)}_validateDrawers(){this._start=this._end=null,this._drawers.forEach(e=>{e.position==`end`?(this._end,this._end=e):(this._start,this._start=e)}),this._right=this._left=null,this._dir&&this._dir.value===`rtl`?(this._left=this._end,this._right=this._start):(this._left=this._start,this._right=this._end)}_isPushed(){return this._isDrawerOpen(this._start)&&this._start.mode!=`over`||this._isDrawerOpen(this._end)&&this._end.mode!=`over`}_onBackdropClicked(){this.backdropClick.emit(),this._closeModalDrawersViaBackdrop()}_closeModalDrawersViaBackdrop(){[this._start,this._end].filter(e=>e&&!e.disableClose&&this._drawerHasBackdrop(e)).forEach(e=>e._closeViaBackdropClick())}_isShowingBackdrop(){return this._isDrawerOpen(this._start)&&this._drawerHasBackdrop(this._start)||this._isDrawerOpen(this._end)&&this._drawerHasBackdrop(this._end)}_isDrawerOpen(e){return e!=null&&e.opened}_drawerHasBackdrop(e){return this._backdropOverride==null?!!e&&e.mode!==`side`:this._backdropOverride}static ɵfac=function(t){return new(t||i)};static ɵcmp=(function(){let e=[[[`mat-drawer`],[`mat-sidenav`]],[[`mat-drawer-content`],[`mat-sidenav-content`]],`*`],t=[`mat-drawer, mat-sidenav`,`mat-drawer-content, mat-sidenav-content`,`*`];function n(a,o){if(a&1){let d=WC();oc(0,`div`,1),yc(`click`,function(){ph(d);let p=ZC();return mh(p._onBackdropClicked())}),_f()}if(a&2){let d=ZC();Nn(`mat-drawer-shown`,d._isShowingBackdrop())}}function r(a,o){a&1&&(oc(0,`mat-drawer-content`),Qt(1,2),_f())}return qe({type:i,selectors:[[`mat-drawer-container`]],contentQueries:function(o,d,u){if(o&1&&Dc(u,de,5)(u,Fe,5),o&2){let p;If(p=Sf())&&(d._content=p.first),If(p=Sf())&&(d._allDrawers=p)}},viewQuery:function(o,d){if(o&1&&Av(de,5),o&2){let u;If(u=Sf())&&(d._userContent=u.first)}},hostAttrs:[1,`mat-drawer-container`],hostVars:2,hostBindings:function(o,d){o&2&&Nn(`mat-drawer-container-explicit-backdrop`,d._backdropOverride)},inputs:{autosize:`autosize`,hasBackdrop:`hasBackdrop`},outputs:{backdropClick:`backdropClick`},exportAs:[`matDrawerContainer`],features:[Nf([{provide:Ve,useExisting:i}])],ngContentSelectors:t,decls:4,vars:2,consts:[[1,`mat-drawer-backdrop`,3,`mat-drawer-shown`],[1,`mat-drawer-backdrop`,3,`click`]],template:function(o,d){o&1&&(Vi(e),ji(0,n,1,2,`div`,0),Qt(1),Qt(2,1),ji(3,r,2,0,`mat-drawer-content`)),o&2&&(Bi(d.hasBackdrop?0:-1),Ri(3),Bi(d._content?-1:3))},dependencies:[de],styles:[`.mat-drawer-container {
  position: relative;
  z-index: 1;
  color: var(--%NS%mat-sidenav-content-text-color, var(--%NS%mat-sys-on-background));
  background-color: var(--%NS%mat-sidenav-content-background-color, var(--%NS%mat-sys-background));
  box-sizing: border-box;
  display: block;
  overflow: hidden;
}
.mat-drawer-container[fullscreen] {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
}
.mat-drawer-container[fullscreen].mat-drawer-container-has-open {
  overflow: hidden;
}
.mat-drawer-container.mat-drawer-container-explicit-backdrop .mat-drawer-side {
  z-index: 3;
}
.mat-drawer-container.ng-animate-disabled .mat-drawer-backdrop,
.mat-drawer-container.ng-animate-disabled .mat-drawer-content, .ng-animate-disabled .mat-drawer-container .mat-drawer-backdrop,
.ng-animate-disabled .mat-drawer-container .mat-drawer-content {
  transition: none;
}

.mat-drawer-backdrop {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  display: block;
  z-index: 3;
  visibility: hidden;
}
.mat-drawer-backdrop.mat-drawer-shown {
  visibility: visible;
  background-color: var(--%NS%mat-sidenav-scrim-color, color-mix(in srgb, var(--%NS%mat-sys-neutral-variant20) 40%, transparent));
}
.mat-drawer-transition .mat-drawer-backdrop {
  transition-duration: 400ms;
  transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);
  transition-property: background-color, visibility;
}
@media (forced-colors: active) {
  .mat-drawer-backdrop {
    opacity: 0.5;
  }
}

.mat-drawer-content {
  position: relative;
  z-index: 1;
  display: block;
  height: 100%;
  overflow: auto;
}
.mat-drawer-content.mat-drawer-content-hidden {
  opacity: 0;
}
.mat-drawer-transition .mat-drawer-content {
  transition-duration: 400ms;
  transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);
  transition-property: transform, margin-left, margin-right;
}

.mat-drawer {
  position: relative;
  z-index: 4;
  color: var(--%NS%mat-sidenav-container-text-color, var(--%NS%mat-sys-on-surface-variant));
  box-shadow: var(--%NS%mat-sidenav-container-elevation-shadow, none);
  background-color: var(--%NS%mat-sidenav-container-background-color, var(--%NS%mat-sys-surface));
  border-top-right-radius: var(--%NS%mat-sidenav-container-shape, var(--%NS%mat-sys-corner-large));
  border-bottom-right-radius: var(--%NS%mat-sidenav-container-shape, var(--%NS%mat-sys-corner-large));
  width: var(--%NS%mat-sidenav-container-width, 360px);
  display: block;
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 3;
  outline: 0;
  box-sizing: border-box;
  overflow-y: auto;
  transform: translate3d(-100%, 0, 0);
}
@media (forced-colors: active) {
  .mat-drawer, [dir=rtl] .mat-drawer.mat-drawer-end {
    border-right: solid 1px currentColor;
  }
}
@media (forced-colors: active) {
  [dir=rtl] .mat-drawer, .mat-drawer.mat-drawer-end {
    border-left: solid 1px currentColor;
    border-right: none;
  }
}
.mat-drawer.mat-drawer-side {
  z-index: 2;
}
.mat-drawer.mat-drawer-end {
  right: 0;
  transform: translate3d(100%, 0, 0);
  border-top-left-radius: var(--%NS%mat-sidenav-container-shape, var(--%NS%mat-sys-corner-large));
  border-bottom-left-radius: var(--%NS%mat-sidenav-container-shape, var(--%NS%mat-sys-corner-large));
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
[dir=rtl] .mat-drawer {
  border-top-left-radius: var(--%NS%mat-sidenav-container-shape, var(--%NS%mat-sys-corner-large));
  border-bottom-left-radius: var(--%NS%mat-sidenav-container-shape, var(--%NS%mat-sys-corner-large));
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  transform: translate3d(100%, 0, 0);
}
[dir=rtl] .mat-drawer.mat-drawer-end {
  border-top-right-radius: var(--%NS%mat-sidenav-container-shape, var(--%NS%mat-sys-corner-large));
  border-bottom-right-radius: var(--%NS%mat-sidenav-container-shape, var(--%NS%mat-sys-corner-large));
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  left: 0;
  right: auto;
  transform: translate3d(-100%, 0, 0);
}
.mat-drawer-transition .mat-drawer {
  transition: transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1);
}
.mat-drawer:not(.mat-drawer-opened):not(.mat-drawer-animating) {
  visibility: hidden;
  box-shadow: none;
}
.mat-drawer:not(.mat-drawer-opened):not(.mat-drawer-animating) .mat-drawer-inner-container {
  display: none;
}
.mat-drawer.mat-drawer-opened.mat-drawer-opened {
  transform: none;
}

.mat-drawer-side {
  box-shadow: none;
  border-right-color: var(--%NS%mat-sidenav-container-divider-color, transparent);
  border-right-width: 1px;
  border-right-style: solid;
}
.mat-drawer-side.mat-drawer-end {
  border-left-color: var(--%NS%mat-sidenav-container-divider-color, transparent);
  border-left-width: 1px;
  border-left-style: solid;
  border-right: none;
}
[dir=rtl] .mat-drawer-side {
  border-left-color: var(--%NS%mat-sidenav-container-divider-color, transparent);
  border-left-width: 1px;
  border-left-style: solid;
  border-right: none;
}
[dir=rtl] .mat-drawer-side.mat-drawer-end {
  border-right-color: var(--%NS%mat-sidenav-container-divider-color, transparent);
  border-right-width: 1px;
  border-right-style: solid;
  border-left: none;
}

.mat-drawer-inner-container {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.mat-sidenav-fixed {
  position: fixed;
}
`],encapsulation:2})})()}return i})();var xe=(()=>{class i extends de{static ɵfac=(()=>{let e;return function(n){return(e||(e=Ug(i)))(n||i)}})();static ɵcmp=(function(){return qe({type:i,selectors:[[`mat-sidenav-content`]],hostAttrs:[1,`mat-drawer-content`,`mat-sidenav-content`],features:[Nf([{provide:ci,useExisting:i},{provide:de,useExisting:i}]),uo],ngContentSelectors:[`*`],decls:1,vars:0,template:function(n,r){n&1&&(Vi(),Qt(0))},encapsulation:2})})()}return i})();var je=(()=>{class i extends Fe{get fixedInViewport(){return this._fixedInViewport}set fixedInViewport(e){this._fixedInViewport=a5(e)}_fixedInViewport=!1;get fixedTopGap(){return this._fixedTopGap}set fixedTopGap(e){this._fixedTopGap=a0(e)}_fixedTopGap=0;get fixedBottomGap(){return this._fixedBottomGap}set fixedBottomGap(e){this._fixedBottomGap=a0(e)}_fixedBottomGap=0;static ɵfac=(()=>{let e;return function(n){return(e||(e=Ug(i)))(n||i)}})();static ɵcmp=(function(){return qe({type:i,selectors:[[`mat-sidenav`]],hostAttrs:[1,`mat-drawer`,`mat-sidenav`],hostVars:16,hostBindings:function(n,r){n&2&&(In(`tabIndex`,r.mode!==`side`?`-1`:null)(`align`,null),Lv(`top`,r.fixedInViewport?r.fixedTopGap:null,`px`)(`bottom`,r.fixedInViewport?r.fixedBottomGap:null,`px`),Nn(`mat-drawer-end`,r.position===`end`)(`mat-drawer-over`,r.mode===`over`)(`mat-drawer-push`,r.mode===`push`)(`mat-drawer-side`,r.mode===`side`)(`mat-sidenav-fixed`,r.fixedInViewport))},inputs:{fixedInViewport:`fixedInViewport`,fixedTopGap:`fixedTopGap`,fixedBottomGap:`fixedBottomGap`},exportAs:[`matSidenav`],features:[Nf([{provide:Fe,useExisting:i}]),uo],ngContentSelectors:[`*`],decls:3,vars:0,consts:[[`content`,``],[`cdkScrollable`,``,1,`mat-drawer-inner-container`]],template:function(n,r){n&1&&(Vi(),oc(0,`div`,1,0),Qt(2),_f())},dependencies:[ci],encapsulation:2})})()}return i})();var At=(()=>{class i extends Be{_allDrawers=void 0;_content=void 0;static ɵfac=(()=>{let e;return function(n){return(e||(e=Ug(i)))(n||i)}})();static ɵcmp=(function(){let e=[[[`mat-drawer`],[`mat-sidenav`]],[[`mat-drawer-content`],[`mat-sidenav-content`]],`*`],t=[`mat-drawer, mat-sidenav`,`mat-drawer-content, mat-sidenav-content`,`*`];function n(a,o){if(a&1){let d=WC();oc(0,`div`,1),yc(`click`,function(){ph(d);let p=ZC();return mh(p._onBackdropClicked())}),_f()}if(a&2){let d=ZC();Nn(`mat-drawer-shown`,d._isShowingBackdrop())}}function r(a,o){a&1&&(oc(0,`mat-sidenav-content`),Qt(1,2),_f())}return qe({type:i,selectors:[[`mat-sidenav-container`]],contentQueries:function(o,d,u){if(o&1&&Dc(u,xe,5)(u,je,5),o&2){let p;If(p=Sf())&&(d._content=p.first),If(p=Sf())&&(d._allDrawers=p)}},hostAttrs:[1,`mat-drawer-container`,`mat-sidenav-container`],hostVars:2,hostBindings:function(o,d){o&2&&Nn(`mat-drawer-container-explicit-backdrop`,d._backdropOverride)},exportAs:[`matSidenavContainer`],features:[Nf([{provide:Ve,useExisting:i},{provide:Be,useExisting:i}]),uo],ngContentSelectors:t,decls:4,vars:2,consts:[[1,`mat-drawer-backdrop`,3,`mat-drawer-shown`],[1,`mat-drawer-backdrop`,3,`click`]],template:function(o,d){o&1&&(Vi(e),ji(0,n,1,2,`div`,0),Qt(1),Qt(2,1),ji(3,r,2,0,`mat-sidenav-content`)),o&2&&(Bi(d.hasBackdrop?0:-1),Ri(3),Bi(d._content?-1:3))},dependencies:[xe],styles:[`.mat-drawer-container {
  position: relative;
  z-index: 1;
  color: var(--%NS%mat-sidenav-content-text-color, var(--%NS%mat-sys-on-background));
  background-color: var(--%NS%mat-sidenav-content-background-color, var(--%NS%mat-sys-background));
  box-sizing: border-box;
  display: block;
  overflow: hidden;
}
.mat-drawer-container[fullscreen] {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
}
.mat-drawer-container[fullscreen].mat-drawer-container-has-open {
  overflow: hidden;
}
.mat-drawer-container.mat-drawer-container-explicit-backdrop .mat-drawer-side {
  z-index: 3;
}
.mat-drawer-container.ng-animate-disabled .mat-drawer-backdrop,
.mat-drawer-container.ng-animate-disabled .mat-drawer-content, .ng-animate-disabled .mat-drawer-container .mat-drawer-backdrop,
.ng-animate-disabled .mat-drawer-container .mat-drawer-content {
  transition: none;
}

.mat-drawer-backdrop {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  display: block;
  z-index: 3;
  visibility: hidden;
}
.mat-drawer-backdrop.mat-drawer-shown {
  visibility: visible;
  background-color: var(--%NS%mat-sidenav-scrim-color, color-mix(in srgb, var(--%NS%mat-sys-neutral-variant20) 40%, transparent));
}
.mat-drawer-transition .mat-drawer-backdrop {
  transition-duration: 400ms;
  transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);
  transition-property: background-color, visibility;
}
@media (forced-colors: active) {
  .mat-drawer-backdrop {
    opacity: 0.5;
  }
}

.mat-drawer-content {
  position: relative;
  z-index: 1;
  display: block;
  height: 100%;
  overflow: auto;
}
.mat-drawer-content.mat-drawer-content-hidden {
  opacity: 0;
}
.mat-drawer-transition .mat-drawer-content {
  transition-duration: 400ms;
  transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);
  transition-property: transform, margin-left, margin-right;
}

.mat-drawer {
  position: relative;
  z-index: 4;
  color: var(--%NS%mat-sidenav-container-text-color, var(--%NS%mat-sys-on-surface-variant));
  box-shadow: var(--%NS%mat-sidenav-container-elevation-shadow, none);
  background-color: var(--%NS%mat-sidenav-container-background-color, var(--%NS%mat-sys-surface));
  border-top-right-radius: var(--%NS%mat-sidenav-container-shape, var(--%NS%mat-sys-corner-large));
  border-bottom-right-radius: var(--%NS%mat-sidenav-container-shape, var(--%NS%mat-sys-corner-large));
  width: var(--%NS%mat-sidenav-container-width, 360px);
  display: block;
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 3;
  outline: 0;
  box-sizing: border-box;
  overflow-y: auto;
  transform: translate3d(-100%, 0, 0);
}
@media (forced-colors: active) {
  .mat-drawer, [dir=rtl] .mat-drawer.mat-drawer-end {
    border-right: solid 1px currentColor;
  }
}
@media (forced-colors: active) {
  [dir=rtl] .mat-drawer, .mat-drawer.mat-drawer-end {
    border-left: solid 1px currentColor;
    border-right: none;
  }
}
.mat-drawer.mat-drawer-side {
  z-index: 2;
}
.mat-drawer.mat-drawer-end {
  right: 0;
  transform: translate3d(100%, 0, 0);
  border-top-left-radius: var(--%NS%mat-sidenav-container-shape, var(--%NS%mat-sys-corner-large));
  border-bottom-left-radius: var(--%NS%mat-sidenav-container-shape, var(--%NS%mat-sys-corner-large));
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
[dir=rtl] .mat-drawer {
  border-top-left-radius: var(--%NS%mat-sidenav-container-shape, var(--%NS%mat-sys-corner-large));
  border-bottom-left-radius: var(--%NS%mat-sidenav-container-shape, var(--%NS%mat-sys-corner-large));
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  transform: translate3d(100%, 0, 0);
}
[dir=rtl] .mat-drawer.mat-drawer-end {
  border-top-right-radius: var(--%NS%mat-sidenav-container-shape, var(--%NS%mat-sys-corner-large));
  border-bottom-right-radius: var(--%NS%mat-sidenav-container-shape, var(--%NS%mat-sys-corner-large));
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  left: 0;
  right: auto;
  transform: translate3d(-100%, 0, 0);
}
.mat-drawer-transition .mat-drawer {
  transition: transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1);
}
.mat-drawer:not(.mat-drawer-opened):not(.mat-drawer-animating) {
  visibility: hidden;
  box-shadow: none;
}
.mat-drawer:not(.mat-drawer-opened):not(.mat-drawer-animating) .mat-drawer-inner-container {
  display: none;
}
.mat-drawer.mat-drawer-opened.mat-drawer-opened {
  transform: none;
}

.mat-drawer-side {
  box-shadow: none;
  border-right-color: var(--%NS%mat-sidenav-container-divider-color, transparent);
  border-right-width: 1px;
  border-right-style: solid;
}
.mat-drawer-side.mat-drawer-end {
  border-left-color: var(--%NS%mat-sidenav-container-divider-color, transparent);
  border-left-width: 1px;
  border-left-style: solid;
  border-right: none;
}
[dir=rtl] .mat-drawer-side {
  border-left-color: var(--%NS%mat-sidenav-container-divider-color, transparent);
  border-left-width: 1px;
  border-left-style: solid;
  border-right: none;
}
[dir=rtl] .mat-drawer-side.mat-drawer-end {
  border-right-color: var(--%NS%mat-sidenav-container-divider-color, transparent);
  border-right-width: 1px;
  border-right-style: solid;
  border-left: none;
}

.mat-drawer-inner-container {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.mat-sidenav-fixed {
  position: fixed;
}
`],encapsulation:2})})()}return i})();var Pt=(()=>{class i{static ɵfac=function(t){return new(t||i)};static ɵmod=Re({type:i});static ɵinj=Ne({imports:[Ht,hl,Ht]})}return i})();var He=new b(`MAT_MENU_PANEL`);var le=(()=>{class i{_isAnchor;_elementRef=m(Ee);_document=m(B);_focusMonitor=m(Fp);_parentMenu=m(He,{optional:!0});_changeDetectorRef=m($i);role=`menuitem`;disabled=!1;disabledInteractive=!1;disableRipple=!1;_hovered=new F;_focused=new F;_highlighted=!1;_triggersSubmenu=!1;constructor(){m(Tr).load(bE),this._parentMenu?.addItem?.(this),this._isAnchor=this._elementRef.nativeElement.tagName===`A`}focus(e,t){this._focusMonitor&&e?this._focusMonitor.focusVia(this._getHostElement(),e,t):this._getHostElement().focus(t),this._focused.next(this)}ngAfterViewInit(){this._focusMonitor&&this._focusMonitor.monitor(this._elementRef,!1)}ngOnDestroy(){this._focusMonitor&&this._focusMonitor.stopMonitoring(this._elementRef),this._parentMenu&&this._parentMenu.removeItem&&this._parentMenu.removeItem(this),this._hovered.complete(),this._focused.complete()}_getTabIndex(){return this.disabled&&!this.disabledInteractive?`-1`:`0`}_getAriaDisabled(){return this._isAnchor?this.disabled||null:this.disabled&&this.disabledInteractive?!0:null}_getDisabled(){return this.disabledInteractive||!this.disabled?null:!0}_getHostElement(){return this._elementRef.nativeElement}_checkDisabled(e){this.disabled&&(e.preventDefault(),e.stopPropagation())}_handleMouseEnter(){this._hovered.next(this)}getLabel(){let e=this._elementRef.nativeElement.cloneNode(!0),t=e.querySelectorAll(`mat-icon, .material-icons, .material-symbols-outlined, .material-symbols-rounded, .material-symbols-sharp`);for(let n=0;n<t.length;n++)t[n].remove();return e.textContent?.trim()||``}_setHighlighted(e){this._highlighted=e,this._changeDetectorRef.markForCheck()}_setTriggersSubmenu(e){this._triggersSubmenu=e,this._changeDetectorRef.markForCheck()}_hasFocus(){return this._document&&this._document.activeElement===this._getHostElement()}static ɵfac=function(t){return new(t||i)};static ɵcmp=(function(){let e=[[[`mat-icon`],[``,`matMenuItemIcon`,``]],`*`],t=[`mat-icon, [matMenuItemIcon]`,`*`];function n(r,a){r&1&&(Sh(),oc(0,`svg`,2),vc(1,`polygon`,3),_f())}return qe({type:i,selectors:[[``,`mat-menu-item`,``]],hostAttrs:[1,`mat-mdc-menu-item`,`mat-focus-indicator`],hostVars:12,hostBindings:function(a,o){a&1&&yc(`click`,function(u){return o._checkDisabled(u)})(`mouseenter`,function(){return o._handleMouseEnter()}),a&2&&(In(`role`,o.role)(`tabindex`,o._getTabIndex())(`aria-disabled`,o._getAriaDisabled())(`disabled`,o._getDisabled()),Nn(`mat-mdc-menu-item-highlighted`,o._highlighted)(`mat-mdc-menu-item-submenu-trigger`,o._triggersSubmenu)(`mat-mdc-menu-item-disabled`,o.disabled)(`mat-mdc-menu-item-disabled-interactive`,o.disabledInteractive))},inputs:{role:`role`,disabled:[2,`disabled`,`disabled`,pt],disabledInteractive:[2,`disabledInteractive`,`disabledInteractive`,pt],disableRipple:[2,`disableRipple`,`disableRipple`,pt]},exportAs:[`matMenuItem`],ngContentSelectors:t,decls:5,vars:3,consts:[[1,`mat-mdc-menu-item-text`],[`matRipple`,``,1,`mat-mdc-menu-ripple`,3,`matRippleDisabled`,`matRippleTrigger`],[`viewBox`,`0 0 5 10`,`focusable`,`false`,`aria-hidden`,`true`,1,`mat-mdc-menu-submenu-icon`],[`points`,`0,0 5,5 0,10`]],template:function(a,o){a&1&&(Vi(e),Qt(0),oc(1,`span`,0),Qt(2,1),_f(),vc(3,`div`,1),ji(4,n,2,0,`svg`,2)),a&2&&(Ri(3),Sv(`matRippleDisabled`,o.disableRipple||o.disabled)(`matRippleTrigger`,o._getHostElement()),Ri(),Bi(o._triggersSubmenu?4:-1))},dependencies:[E5],encapsulation:2})})()}return i})();var Xt=new b(`MatMenuContent`);var Zt=new b(`mat-menu-default-options`,{providedIn:`root`,factory:()=>({overlapTrigger:!1,xPosition:`after`,yPosition:`below`,backdropClass:`cdk-overlay-transparent-backdrop`})});var Le=`_mat-menu-enter`;var Ce=`_mat-menu-exit`;var Z=(()=>{class i{_elementRef=m(Ee);_changeDetectorRef=m($i);_injector=m(ee);_keyManager;_xPosition;_yPosition;_firstItemFocusRef;_exitFallbackTimeout;_animationsDisabled=Oo();_allItems;_directDescendantItems=new pr;_classList={};_panelAnimationState=`void`;_animationDone=new F;_isAnimating=Z$1(!1);parentMenu;direction;overlayPanelClass;backdropClass;ariaLabel;ariaLabelledby;ariaDescribedby;get xPosition(){return this._xPosition}set xPosition(e){this._xPosition=e,this.setPositionClasses()}get yPosition(){return this._yPosition}set yPosition(e){this._yPosition=e,this.setPositionClasses()}templateRef;items;lazyContent;overlapTrigger=!1;hasBackdrop;get panelClass(){return this._previousPanelClass}set panelClass(e){let t=this._previousPanelClass,n=g({},this._classList);t&&t.length&&t.split(` `).forEach(r=>{n[r]=!1}),this._previousPanelClass=e,e&&e.length&&(e.split(` `).forEach(r=>{n[r]=!0}),this._elementRef.nativeElement.className=``),this._classList=n}_previousPanelClass=``;get classList(){return this.panelClass}set classList(e){this.panelClass=e}closed=new ce;close=this.closed;panelId=m(Vp).getId(`mat-menu-panel-`);constructor(){let e=m(Zt);this.overlayPanelClass=e.overlayPanelClass||``,this._xPosition=e.xPosition,this._yPosition=e.yPosition,this.backdropClass=e.backdropClass,this.overlapTrigger=e.overlapTrigger,this.hasBackdrop=e.hasBackdrop}ngOnInit(){this.setPositionClasses()}ngAfterContentInit(){this._updateDirectDescendants(),this._keyManager=new Up(this._directDescendantItems).withWrap().withTypeAhead().withHomeAndEnd().skipPredicate(e=>e.disabled&&!e.disabledInteractive),this._keyManager.tabOut.subscribe(()=>this.closed.emit(`tab`)),this._directDescendantItems.changes.pipe(zo(this._directDescendantItems),xe$1(e=>QE(...e.map(t=>t._focused)))).subscribe(e=>this._keyManager.updateActiveItem(e)),this._directDescendantItems.changes.subscribe(e=>{let t=this._keyManager;if(this._panelAnimationState===`enter`&&t.activeItem?._hasFocus()){let n=e.toArray(),r=Math.max(0,Math.min(n.length-1,t.activeItemIndex||0));n[r]&&!n[r].disabled?t.setActiveItem(r):t.setNextItemActive()}})}ngOnDestroy(){this._keyManager?.destroy(),this._directDescendantItems.destroy(),this.closed.complete(),this._firstItemFocusRef?.destroy(),clearTimeout(this._exitFallbackTimeout)}_hovered(){return this._directDescendantItems.changes.pipe(zo(this._directDescendantItems),xe$1(t=>QE(...t.map(n=>n._hovered))))}addItem(e){}removeItem(e){}_handleKeydown(e){let t=e.keyCode,n=this._keyManager;switch(t){case 27:aE(e)||(e.preventDefault(),this.closed.emit(`keydown`));break;case 37:this.parentMenu&&this.direction===`ltr`&&this.closed.emit(`keydown`);break;case 39:this.parentMenu&&this.direction===`rtl`&&this.closed.emit(`keydown`);break;default:(t===38||t===40)&&n.setFocusOrigin(`keyboard`),n.onKeydown(e);return}}focusFirstItem(e=`program`){this._firstItemFocusRef?.destroy(),this._firstItemFocusRef=Ai(()=>{let t=this._resolvePanel();if(!t||!t.contains(document.activeElement)){let n=this._keyManager;n.setFocusOrigin(e).setFirstItemActive(),!n.activeItem&&t&&t.focus()}},{injector:this._injector})}resetActiveItem(){this._keyManager.setActiveItem(-1)}setElevation(e){}setPositionClasses(e=this.xPosition,t=this.yPosition){this._classList=U(g({},this._classList),{"mat-menu-before":e===`before`,"mat-menu-after":e===`after`,"mat-menu-above":t===`above`,"mat-menu-below":t===`below`}),this._changeDetectorRef.markForCheck()}_onAnimationDone(e){let t=e===Ce;(t||e===Le)&&(t&&(clearTimeout(this._exitFallbackTimeout),this._exitFallbackTimeout=void 0),this._animationDone.next(t?`void`:`enter`),this._isAnimating.set(!1))}_onAnimationStart(e){(e===Le||e===Ce)&&this._isAnimating.set(!0)}_setIsOpen(e){if(this._panelAnimationState=e?`enter`:`void`,e){if(this._keyManager.activeItemIndex===0){let t=this._resolvePanel();t&&(t.scrollTop=0)}}else this._animationsDisabled||(this._exitFallbackTimeout=setTimeout(()=>this._onAnimationDone(Ce),200));this._animationsDisabled&&setTimeout(()=>{this._onAnimationDone(e?Le:Ce)}),this._changeDetectorRef.markForCheck()}_updateDirectDescendants(){this._allItems.changes.pipe(zo(this._allItems)).subscribe(e=>{this._directDescendantItems.reset(e.filter(t=>t._parentMenu===this)),this._directDescendantItems.notifyOnChanges()})}_resolvePanel(){let e=null;return this._directDescendantItems.length&&(e=this._directDescendantItems.first._getHostElement().closest(`[role="menu"]`)),e}static ɵfac=function(t){return new(t||i)};static ɵcmp=(function(){let e=[`*`];function t(n,r){if(n&1){let a=WC();Sn(0,`div`,0),Mv(`click`,function(){ph(a);let d=ZC();return mh(d.closed.emit(`click`))})(`animationstart`,function(d){ph(a);let u=ZC();return mh(u._onAnimationStart(d.animationName))})(`animationend`,function(d){ph(a);let u=ZC();return mh(u._onAnimationDone(d.animationName))})(`animationcancel`,function(d){ph(a);let u=ZC();return mh(u._onAnimationDone(d.animationName))}),Sn(1,`div`,1),Qt(2),Cn()()}if(n&2){let a=ZC();Cf(a._classList),Nn(`mat-menu-panel-animations-disabled`,a._animationsDisabled)(`mat-menu-panel-exit-animation`,a._panelAnimationState===`void`)(`mat-menu-panel-animating`,a._isAnimating()),Tv(`id`,a.panelId),In(`aria-label`,a.ariaLabel||null)(`aria-labelledby`,a.ariaLabelledby||null)(`aria-describedby`,a.ariaDescribedby||null)}}return qe({type:i,selectors:[[`mat-menu`]],contentQueries:function(r,a,o){if(r&1&&Dc(o,Xt,5)(o,le,5)(o,le,4),r&2){let d;If(d=Sf())&&(a.lazyContent=d.first),If(d=Sf())&&(a._allItems=d),If(d=Sf())&&(a.items=d)}},viewQuery:function(r,a){if(r&1&&Av(io,5),r&2){let o;If(o=Sf())&&(a.templateRef=o.first)}},hostVars:3,hostBindings:function(r,a){r&2&&In(`aria-label`,null)(`aria-labelledby`,null)(`aria-describedby`,null)},inputs:{backdropClass:`backdropClass`,ariaLabel:[0,`aria-label`,`ariaLabel`],ariaLabelledby:[0,`aria-labelledby`,`ariaLabelledby`],ariaDescribedby:[0,`aria-describedby`,`ariaDescribedby`],xPosition:`xPosition`,yPosition:`yPosition`,overlapTrigger:[2,`overlapTrigger`,`overlapTrigger`,pt],hasBackdrop:[2,`hasBackdrop`,`hasBackdrop`,n=>n==null?null:pt(n)],panelClass:[0,`class`,`panelClass`],classList:`classList`},outputs:{closed:`closed`,close:`close`},exportAs:[`matMenu`],features:[Nf([{provide:He,useExisting:i}])],ngContentSelectors:e,decls:1,vars:0,consts:[[`tabindex`,`-1`,`role`,`menu`,1,`mat-mdc-menu-panel`,3,`click`,`animationstart`,`animationend`,`animationcancel`,`id`],[1,`mat-mdc-menu-content`]],template:function(r,a){r&1&&(Vi(),_v(0,t,3,12,`ng-template`))},styles:[`mat-menu {
  display: none;
}

.mat-mdc-menu-content {
  margin: 0;
  padding: 8px 0;
  outline: 0;
}
.mat-mdc-menu-content,
.mat-mdc-menu-content .mat-mdc-menu-item .mat-mdc-menu-item-text {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  flex: 1;
  white-space: normal;
  font-family: var(--%NS%mat-menu-item-label-text-font, var(--%NS%mat-sys-label-large-font));
  line-height: var(--%NS%mat-menu-item-label-text-line-height, var(--%NS%mat-sys-label-large-line-height));
  font-size: var(--%NS%mat-menu-item-label-text-size, var(--%NS%mat-sys-label-large-size));
  letter-spacing: var(--%NS%mat-menu-item-label-text-tracking, var(--%NS%mat-sys-label-large-tracking));
  font-weight: var(--%NS%mat-menu-item-label-text-weight, var(--%NS%mat-sys-label-large-weight));
}

@keyframes _mat-menu-enter {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes _mat-menu-exit {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
.mat-mdc-menu-panel {
  min-width: 112px;
  max-width: 280px;
  overflow: auto;
  box-sizing: border-box;
  outline: 0;
  animation: _mat-menu-enter 120ms cubic-bezier(0, 0, 0.2, 1);
  border-radius: var(--%NS%mat-menu-container-shape, var(--%NS%mat-sys-corner-extra-small));
  background-color: var(--%NS%mat-menu-container-color, var(--%NS%mat-sys-surface-container));
  box-shadow: var(--%NS%mat-menu-container-elevation-shadow, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
  will-change: transform, opacity;
}
.mat-mdc-menu-panel.mat-menu-panel-exit-animation {
  animation: _mat-menu-exit 100ms 25ms linear forwards;
}
.mat-mdc-menu-panel.mat-menu-panel-animations-disabled {
  animation: none;
}
.mat-mdc-menu-panel.mat-menu-panel-animating {
  pointer-events: none;
}
.mat-mdc-menu-panel.mat-menu-panel-animating:has(.mat-mdc-menu-content:empty) {
  display: none;
}
@media (forced-colors: active) {
  .mat-mdc-menu-panel {
    outline: solid 1px;
  }
}
.mat-mdc-menu-panel .mat-divider {
  border-top-color: var(--%NS%mat-menu-divider-color, var(--%NS%mat-sys-surface-variant));
  margin-bottom: var(--%NS%mat-menu-divider-bottom-spacing, 8px);
  margin-top: var(--%NS%mat-menu-divider-top-spacing, 8px);
}

.mat-mdc-menu-item {
  display: flex;
  position: relative;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  padding: 0;
  cursor: pointer;
  width: 100%;
  text-align: left;
  box-sizing: border-box;
  color: inherit;
  font-size: inherit;
  background: none;
  text-decoration: none;
  margin: 0;
  min-height: 48px;
  padding-left: var(--%NS%mat-menu-item-leading-spacing, 12px);
  padding-right: var(--%NS%mat-menu-item-trailing-spacing, 12px);
  -webkit-user-select: none;
  user-select: none;
  cursor: pointer;
  outline: none;
  border: none;
  -webkit-tap-highlight-color: transparent;
}
.mat-mdc-menu-item::-moz-focus-inner {
  border: 0;
}
[dir=rtl] .mat-mdc-menu-item {
  padding-left: var(--%NS%mat-menu-item-trailing-spacing, 12px);
  padding-right: var(--%NS%mat-menu-item-leading-spacing, 12px);
}
.mat-mdc-menu-item:has(.material-icons, .material-symbols-outlined, .material-symbols-rounded, .material-symbols-sharp, mat-icon, [matButtonIcon]) {
  padding-left: var(--%NS%mat-menu-item-with-icon-leading-spacing, 12px);
  padding-right: var(--%NS%mat-menu-item-with-icon-trailing-spacing, 12px);
}
[dir=rtl] .mat-mdc-menu-item:has(.material-icons, .material-symbols-outlined, .material-symbols-rounded, .material-symbols-sharp, mat-icon, [matButtonIcon]) {
  padding-left: var(--%NS%mat-menu-item-with-icon-trailing-spacing, 12px);
  padding-right: var(--%NS%mat-menu-item-with-icon-leading-spacing, 12px);
}
.mat-mdc-menu-item, .mat-mdc-menu-item:visited, .mat-mdc-menu-item:link {
  color: var(--%NS%mat-menu-item-label-text-color, var(--%NS%mat-sys-on-surface));
}
.mat-mdc-menu-item .mat-icon-no-color,
.mat-mdc-menu-item .mat-mdc-menu-submenu-icon {
  color: var(--%NS%mat-menu-item-icon-color, var(--%NS%mat-sys-on-surface-variant));
}
.mat-mdc-menu-item[disabled], .mat-mdc-menu-item.mat-mdc-menu-item-disabled {
  cursor: default;
  opacity: 0.38;
}
.mat-mdc-menu-item[disabled]::after, .mat-mdc-menu-item.mat-mdc-menu-item-disabled::after {
  display: block;
  position: absolute;
  content: "";
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}
.mat-mdc-menu-item:focus {
  outline: 0;
}
.mat-mdc-menu-item .mat-icon {
  flex-shrink: 0;
  margin-right: var(--%NS%mat-menu-item-spacing, 12px);
  height: var(--%NS%mat-menu-item-icon-size, 24px);
  width: var(--%NS%mat-menu-item-icon-size, 24px);
}
[dir=rtl] .mat-mdc-menu-item {
  text-align: right;
}
[dir=rtl] .mat-mdc-menu-item .mat-icon {
  margin-right: 0;
  margin-left: var(--%NS%mat-menu-item-spacing, 12px);
}
.mat-mdc-menu-item:not([disabled]):hover {
  background-color: var(--%NS%mat-menu-item-hover-state-layer-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) calc(var(--%NS%mat-sys-hover-state-layer-opacity) * 100%), transparent));
}
.mat-mdc-menu-item:not([disabled]).cdk-program-focused, .mat-mdc-menu-item:not([disabled]).cdk-keyboard-focused, .mat-mdc-menu-item:not([disabled]).mat-mdc-menu-item-highlighted {
  background-color: var(--%NS%mat-menu-item-focus-state-layer-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) calc(var(--%NS%mat-sys-focus-state-layer-opacity) * 100%), transparent));
}
@media (forced-colors: active) {
  .mat-mdc-menu-item {
    margin-top: 1px;
  }
}

.mat-mdc-menu-submenu-icon {
  width: var(--%NS%mat-menu-item-icon-size, 24px);
  height: 10px;
  fill: currentColor;
  padding-left: var(--%NS%mat-menu-item-spacing, 12px);
}
[dir=rtl] .mat-mdc-menu-submenu-icon {
  padding-right: var(--%NS%mat-menu-item-spacing, 12px);
  padding-left: 0;
}
[dir=rtl] .mat-mdc-menu-submenu-icon polygon {
  transform: scaleX(-1);
  transform-origin: center;
}
@media (forced-colors: active) {
  .mat-mdc-menu-submenu-icon {
    fill: CanvasText;
  }
}

.mat-mdc-menu-item .mat-mdc-menu-ripple {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  pointer-events: none;
}
`],encapsulation:2})})()}return i})();var $t=new b(`mat-menu-scroll-strategy`,{providedIn:`root`,factory:()=>{let i=m(ee);return()=>xt(i)}});var X=/* @__PURE__ */ new WeakMap;var Kt=(()=>{class i{_canHaveBackdrop;_element=m(Ee);_viewContainerRef=m(_n);_menuItemInstance=m(le,{optional:!0,self:!0});_dir=m(VD,{optional:!0});_focusMonitor=m(Fp);_ngZone=m(H);_injector=m(ee);_scrollStrategy=m($t);_changeDetectorRef=m($i);_animationsDisabled=Oo();_portal;_overlayRef=null;_menuOpen=!1;_closingActionsSubscription=ae.EMPTY;_menuCloseSubscription=ae.EMPTY;_pendingRemoval;_parentMaterialMenu;_parentInnerPadding;_openedBy=void 0;get _menu(){return this._menuInternal}set _menu(e){e!==this._menuInternal&&(this._menuInternal=e,this._menuCloseSubscription.unsubscribe(),e?(this._parentMaterialMenu,this._menuCloseSubscription=e.close.subscribe(t=>{this._destroyMenu(t),(t===`click`||t===`tab`)&&this._parentMaterialMenu&&this._parentMaterialMenu.closed.emit(t)})):this._destroyMenu(),this._menuItemInstance?._setTriggersSubmenu(this._triggersSubmenu()))}_menuInternal=null;constructor(e){this._canHaveBackdrop=e;let t=m(He,{optional:!0});this._parentMaterialMenu=t instanceof Z?t:void 0}ngOnDestroy(){this._menu&&this._ownsMenu(this._menu)&&X.delete(this._menu),this._pendingRemoval?.unsubscribe(),this._menuCloseSubscription.unsubscribe(),this._closingActionsSubscription.unsubscribe(),this._overlayRef&&(this._overlayRef.dispose(),this._overlayRef=null)}get menuOpen(){return this._menuOpen}get dir(){return this._dir&&this._dir.value===`rtl`?`rtl`:`ltr`}_triggersSubmenu(){return!!(this._menuItemInstance&&this._parentMaterialMenu&&this._menu)}_closeMenu(){this._menu?.close.emit()}_openMenu(e){if(this._triggerIsAriaDisabled())return;let t=this._menu;if(this._menuOpen||!t)return;this._pendingRemoval?.unsubscribe();let n=X.get(t);X.set(t,this),n&&n!==this&&n._closeMenu();let r=this._createOverlay(t),a=r.getConfig(),o=a.positionStrategy;this._setPosition(t,o),this._canHaveBackdrop?a.hasBackdrop=t.hasBackdrop==null?!this._triggersSubmenu():t.hasBackdrop:a.hasBackdrop=t.hasBackdrop??!1,r.hasAttached()||(r.attach(this._getPortal(t)),t.lazyContent?.attach(this.menuData)),this._closingActionsSubscription=this._menuClosingActions().subscribe(()=>this._closeMenu()),t.parentMenu=this._triggersSubmenu()?this._parentMaterialMenu:void 0,t.direction=this.dir,e&&t.focusFirstItem(this._openedBy||`program`),this._setIsMenuOpen(!0),t instanceof Z&&(t._setIsOpen(!0),t._directDescendantItems.changes.pipe(Rt$1(t.close)).subscribe(()=>{o.withLockedPosition(!1).reapplyLastPosition(),o.withLockedPosition(!0)}))}focus(e,t){this._focusMonitor&&e?this._focusMonitor.focusVia(this._element,e,t):this._element.nativeElement.focus(t)}_destroyMenu(e){let t=this._overlayRef,n=this._menu;!t||!this.menuOpen||(this._closingActionsSubscription.unsubscribe(),this._pendingRemoval?.unsubscribe(),n instanceof Z&&this._ownsMenu(n)?(this._pendingRemoval=n._animationDone.pipe(Be$1(1)).subscribe(()=>{t.detach(),X.has(n)||n.lazyContent?.detach()}),n._setIsOpen(!1)):(t.detach(),n?.lazyContent?.detach()),n&&this._ownsMenu(n)&&X.delete(n),this.restoreFocus&&(e===`keydown`||!this._openedBy||!this._triggersSubmenu())&&this.focus(this._openedBy),this._openedBy=void 0,this._setIsMenuOpen(!1))}_setIsMenuOpen(e){e!==this._menuOpen&&(this._menuOpen=e,this._menuOpen?this.menuOpened.emit():this.menuClosed.emit(),this._triggersSubmenu()&&this._menuItemInstance._setHighlighted(e),this._changeDetectorRef.markForCheck())}_createOverlay(e){if(!this._overlayRef){let t=this._getOverlayConfig(e);this._subscribeToPositions(e,t.positionStrategy),this._overlayRef=Mt(this._injector,t),this._overlayRef.keydownEvents().subscribe(n=>{this._menu instanceof Z&&this._menu._handleKeydown(n)})}return this._overlayRef}_getOverlayConfig(e){return new X$1({positionStrategy:Et(this._injector,this._getOverlayOrigin()).withLockedPosition().withGrowAfterOpen().withTransformOriginOn(`.mat-menu-panel, .mat-mdc-menu-panel`),backdropClass:e.backdropClass||`cdk-overlay-transparent-backdrop`,panelClass:e.overlayPanelClass,scrollStrategy:this._scrollStrategy(),direction:this._dir||`ltr`,disableAnimations:this._animationsDisabled})}_subscribeToPositions(e,t){e.setPositionClasses&&t.positionChanges.subscribe(n=>{this._ngZone.run(()=>{let r=n.connectionPair.overlayX===`start`?`after`:`before`,a=n.connectionPair.overlayY===`top`?`below`:`above`;e.setPositionClasses(r,a)})})}_setPosition(e,t){let[n,r]=e.xPosition===`before`?[`end`,`start`]:[`start`,`end`],[a,o]=e.yPosition===`above`?[`bottom`,`top`]:[`top`,`bottom`],[d,u]=[a,o],[p,ke]=[n,r],$=0;if(this._triggersSubmenu()){if(ke=n=e.xPosition===`before`?`start`:`end`,r=p=n===`end`?`start`:`end`,this._parentMaterialMenu){if(this._parentInnerPadding==null){let We=this._parentMaterialMenu.items.first;this._parentInnerPadding=We?We._getHostElement().offsetTop:0}$=a===`bottom`?this._parentInnerPadding:-this._parentInnerPadding}}else e.overlapTrigger||(d=a===`top`?`bottom`:`top`,u=o===`top`?`bottom`:`top`);t.withPositions([{originX:n,originY:d,overlayX:p,overlayY:a,offsetY:$},{originX:r,originY:d,overlayX:ke,overlayY:a,offsetY:$},{originX:n,originY:u,overlayX:p,overlayY:o,offsetY:-$},{originX:r,originY:u,overlayX:ke,overlayY:o,offsetY:-$}])}_menuClosingActions(){let e=this._getOutsideClickStream(this._overlayRef),t=this._overlayRef.detachments(),n=this._parentMaterialMenu?this._parentMaterialMenu.closed:N$1(),r=this._parentMaterialMenu?this._parentMaterialMenu._hovered().pipe(Se(a=>this._menuOpen&&a!==this._menuItemInstance)):N$1();return QE(e,n,r,t)}_getPortal(e){return(!this._portal||this._portal.templateRef!==e.templateRef)&&(this._portal=new Y(e.templateRef,this._viewContainerRef)),this._portal}_ownsMenu(e){return X.get(e)===this}_triggerIsAriaDisabled(){return pt(this._element.nativeElement.getAttribute(`aria-disabled`))}static ɵfac=function(t){hc()};static ɵdir=_e({type:i})}return i})();var zt=(()=>{class i extends Kt{_cleanupTouchstart;_hoverSubscription=ae.EMPTY;get _deprecatedMatMenuTriggerFor(){return this.menu}set _deprecatedMatMenuTriggerFor(e){this.menu=e}get menu(){return this._menu}set menu(e){this._menu=e}menuData;restoreFocus=!0;menuOpened=new ce;onMenuOpen=this.menuOpened;menuClosed=new ce;onMenuClose=this.menuClosed;constructor(){super(!0);let e=m(Wt$1);this._cleanupTouchstart=e.listen(this._element.nativeElement,`touchstart`,t=>{gs(t)||(this._openedBy=`touch`)},{passive:!0})}triggersSubmenu(){return super._triggersSubmenu()}toggleMenu(){return this.menuOpen?this.closeMenu():this.openMenu()}openMenu(){this._openMenu(!0)}closeMenu(){this._closeMenu()}updatePosition(){this._overlayRef?.updatePosition()}ngAfterContentInit(){this._handleHover()}ngOnDestroy(){super.ngOnDestroy(),this._cleanupTouchstart(),this._hoverSubscription.unsubscribe()}_getOverlayOrigin(){return this._element}_getOutsideClickStream(e){return e.backdropClick()}_handleMousedown(e){hs(e)||(this._openedBy=e.button===0?`mouse`:void 0,this.triggersSubmenu()&&e.preventDefault())}_handleKeydown(e){let t=e.keyCode;(t===13||t===32)&&(this._openedBy=`keyboard`),this.triggersSubmenu()&&(t===39&&this.dir===`ltr`||t===37&&this.dir===`rtl`)&&(this._openedBy=`keyboard`,this.openMenu())}_handleClick(e){this.triggersSubmenu()?(e.stopPropagation(),this.openMenu()):this.toggleMenu()}_handleHover(){this.triggersSubmenu()&&this._parentMaterialMenu&&(this._hoverSubscription=this._parentMaterialMenu._hovered().subscribe(e=>{e===this._menuItemInstance&&!e.disabled&&this._parentMaterialMenu?._panelAnimationState!==`void`&&(this._openedBy=`mouse`,this._openMenu(!1))}))}static ɵfac=function(t){return new(t||i)};static ɵdir=_e({type:i,selectors:[[``,`mat-menu-trigger-for`,``],[``,`matMenuTriggerFor`,``]],hostAttrs:[1,`mat-mdc-menu-trigger`],hostVars:3,hostBindings:function(t,n){t&1&&yc(`click`,function(a){return n._handleClick(a)})(`mousedown`,function(a){return n._handleMousedown(a)})(`keydown`,function(a){return n._handleKeydown(a)}),t&2&&In(`aria-haspopup`,n.menu?`menu`:null)(`aria-expanded`,n.menuOpen)(`aria-controls`,n.menuOpen?n.menu?.panelId:null)},inputs:{_deprecatedMatMenuTriggerFor:[0,`mat-menu-trigger-for`,`_deprecatedMatMenuTriggerFor`],menu:[0,`matMenuTriggerFor`,`menu`],menuData:[0,`matMenuTriggerData`,`menuData`],restoreFocus:[0,`matMenuTriggerRestoreFocus`,`restoreFocus`]},outputs:{menuOpened:`menuOpened`,onMenuOpen:`onMenuOpen`,menuClosed:`menuClosed`,onMenuClose:`onMenuClose`},exportAs:[`matMenuTrigger`],features:[uo]})}return i})();var Vt=(()=>{class i{static ɵfac=function(t){return new(t||i)};static ɵmod=Re({type:i});static ɵinj=Ne({imports:[yE,me,hl,Ht]})}return i})();var en=i=>({exact:i});var tn=(i,c)=>c.path;function nn(i,c){if(i&1){let e=WC();oc(0,`a`,16),yc(`click`,function(){ph(e);let n=ZC();return mh(n.menuOpen.set(!1))}),oc(1,`span`,10),yT(2),_f(),yT(3),_f()}if(i&2){let e=c.$implicit;Sv(`routerLink`,e.path)(`routerLinkActiveOptions`,AT(4,en,!!e.exact)),Ri(2),Hv(e.icon),Ri(),Tf(` `,e.label,` `)}}function an(i,c){if(i&1){let e=WC();oc(0,`button`,17),yc(`click`,function(){ph(e);let n=ZC();return mh(n.menuOpen.set(!0))}),oc(1,`span`,10),yT(2,`menu`),_f()()}}function rn(i,c){i&1&&(oc(0,`div`,15),yT(1,`برای امنیت، لطفاً رمز عبور پیش‌فرض را `),oc(2,`a`,18),yT(3,`همین حالا تغییر دهید`),_f(),yT(4,`.`),_f())}var jt=class i{auth=m(a);router=m(rn$1);mobile=Rt(m(Rp).observe(`(max-width: 900px)`).pipe(j(c=>c.matches)),{initialValue:!1});menuOpen=Z$1(!1);nav=[{path:`/`,label:`داشبورد`,icon:`dashboard`,exact:!0},{path:`/sale`,label:`فروش جدید`,icon:`point_of_sale`},{path:`/invoices`,label:`فاکتورها`,icon:`receipt_long`},{path:`/products`,label:`کالاها و موجودی`,icon:`inventory_2`},{path:`/rates`,label:`نرخ روز طلا`,icon:`trending_up`},{path:`/import`,label:`ورود از اکسل`,icon:`upload_file`,owner:!0},{path:`/users`,label:`کاربران`,icon:`group`,owner:!0},{path:`/audit`,label:`گزارش فعالیت‌ها`,icon:`history`,owner:!0},{path:`/settings`,label:`تنظیمات`,icon:`settings`,owner:!0}];visibleNav=_c(()=>this.nav.filter(c=>!c.owner||this.auth.isOwner()));roleLabel=_c(()=>h[this.auth.user()?.role??``]??``);async logout(){await this.auth.logout(),this.router.navigateByUrl(`/login`)}static ɵfac=function(e){return new(e||i)};static ɵcmp=qe({type:i,selectors:[[`app-shell`]],decls:31,vars:7,consts:[[`userMenu`,`matMenu`],[1,`shell`],[`position`,`start`,1,`nav`,`no-print`,3,`closedStart`,`mode`,`opened`],[1,`brand`],[`src`,`/store-logo.png`,`alt`,`نشان جواهری قسمتی`],[`routerLinkActive`,`active`,3,`routerLink`,`routerLinkActiveOptions`],[1,`top`,`no-print`],[`mat-icon-button`,``,`aria-label`,`منو`],[1,`grow`],[`mat-flat-button`,``,`routerLink`,`/sale`,1,`sale-btn`],[1,`material-symbols-outlined`],[`mat-button`,``,1,`user-btn`,3,`matMenuTriggerFor`],[1,`muted`,`small`,`hide-sm`],[`mat-menu-item`,``,`routerLink`,`/account`],[`mat-menu-item`,``,3,`click`],[1,`info-box`,`must-change`,`no-print`],[`routerLinkActive`,`active`,3,`click`,`routerLink`,`routerLinkActiveOptions`],[`mat-icon-button`,``,`aria-label`,`منو`,3,`click`],[`routerLink`,`/account`]],template:function(e,t){if(e&1&&(oc(0,`mat-sidenav-container`,1)(1,`mat-sidenav`,2),yc(`closedStart`,function(){return t.menuOpen.set(!1)}),oc(2,`div`,3),vc(3,`img`,4),oc(4,`b`),yT(5,`جواهری قسمتی`),_f()(),oc(6,`nav`),UC(7,nn,4,6,`a`,5,tn),_f()(),oc(9,`mat-sidenav-content`)(10,`header`,6),ji(11,an,3,0,`button`,7),vc(12,`div`,8),oc(13,`a`,9)(14,`span`,10),yT(15,`point_of_sale`),_f(),yT(16,` فروش جدید`),_f(),oc(17,`button`,11)(18,`span`,10),yT(19,`account_circle`),_f(),yT(20),oc(21,`span`,12),yT(22),_f()(),oc(23,`mat-menu`,null,0)(25,`a`,13),yT(26,`تغییر رمز عبور`),_f(),oc(27,`button`,14),yc(`click`,function(){return t.logout()}),yT(28,`خروج`),_f()()(),ji(29,rn,5,0,`div`,15),vc(30,`router-outlet`),_f()()),e&2){let n=XC(24);Ri(),Sv(`mode`,t.mobile()?`over`:`side`)(`opened`,!t.mobile()||t.menuOpen()),Ri(6),VC(t.visibleNav()),Ri(4),Bi(t.mobile()?11:-1),Ri(6),Sv(`matMenuTriggerFor`,n),Ri(3),Tf(` `,t.auth.user()?.displayName,` `),Ri(2),Tf(`(`,t.roleLabel(),`)`),Ri(7),Bi(t.auth.user()?.mustChangePassword?29:-1)}},dependencies:[Ip,fl,Gx,Pt,je,At,xe,Z5,q5,k0,Vt,Z,le,zt],styles:[`.shell[_ngcontent-%COMP%]{height:100vh;background:var(--%NS%bg)}.nav[_ngcontent-%COMP%]{width:232px;background:#2b2118;color:#f3e7cf;border:0}.brand[_ngcontent-%COMP%]{display:flex;align-items:center;gap:10px;padding:12px 14px 14px;color:#f0c766}.brand[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:48px;height:48px;flex:0 0 48px;object-fit:cover;border-radius:12px}.brand[_ngcontent-%COMP%]   b[_ngcontent-%COMP%]{font-size:16px;font-weight:800;white-space:nowrap}nav[_ngcontent-%COMP%]{display:flex;flex-direction:column;padding:4px 10px;gap:2px}nav[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{display:flex;align-items:center;gap:12px;padding:11px 14px;border-radius:10px;color:#eadcc2;text-decoration:none;font-size:15px}nav[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover{background:#ffffff0f}nav[_ngcontent-%COMP%]   a.active[_ngcontent-%COMP%]{background:#f0c766;color:#2b2118;font-weight:700}.top[_ngcontent-%COMP%]{display:flex;align-items:center;gap:8px;padding:10px 18px;background:#fff;border-bottom:1px solid var(--%NS%line);position:sticky;top:0;z-index:5}.sale-btn[_ngcontent-%COMP%]{height:42px;border-radius:10px}.must-change[_ngcontent-%COMP%]{margin:12px 24px 0}`]})};export{jt as Shell};