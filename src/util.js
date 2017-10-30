"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var THREE = require("three");
var OrbitControls = require("three-orbit-controls");
var constants_1 = require("./constants");
var orbitControls = OrbitControls(THREE);
var Util = (function () {
    // tooltip : HTMLElement
    function Util(camera, domElement) {
        this.mouse = new THREE.Vector2(-1, -1);
        this.camera = camera;
        this.control = new orbitControls(camera, domElement);
        this.control.enableZoom = false;
        this.control.autoRotate = false;
        this.control.maxDistance = 180;
        this.control.minDistance = 1;
        this.raycaster = new THREE.Raycaster();
        // this.tooltip = document.getElementById('tooltip_anchor')
        // this.tooltip.addEventListener('click',(e)=>{
        //     e.stopPropagation()
        // },false)
    }
    /* this event may become obsolete soon */
    Util.prototype.mouseClickEvent = function (canvas, e, modSofa) {
        // if( this.sofaInFocus ){
        //     this.tooltip.style.left = '-9999'
        //     this.sofaInFocus = false
        // }else if( this.INTERSECT ){
        //     this.sofaInFocus = true
        //     this.tooltip.style.left = e.clientX
        //     this.tooltip.style.top = e.clientY
        //     modSofa.findSofa( this.INTERSECT )
        // }
    };
    Util.prototype.mouseMoveEvent = function (canvas, e) {
        /* necesssary if the webgl component is not fullscreen and is off center */
        var rect = canvas.getBoundingClientRect();
        this.mouse.x = (e.clientX - rect.left) / canvas.clientWidth * 2 - 1;
        this.mouse.y = -((e.clientY - rect.top) / canvas.clientHeight * 2) + 1;
    };
    return Util;
}());
exports.Util = Util;
var OnHoverControls = (function () {
    function OnHoverControls(factory) {
        this.sphereMaterial = new THREE.MeshPhongMaterial({
            depthTest: false,
            opacity: 0.3,
            transparent: true,
            blending: THREE.CustomBlending,
            blendEquation: THREE.AddEquation,
            blendSrc: THREE.SrcAlphaFactor,
            blendDst: THREE.OneMinusSrcAlphaFactor,
            color: 0x999999
            // blendSrcAlpha:0.3
        });
        this.solidMaterial = new THREE.MeshPhongMaterial({});
        this.sphereGeometry = new THREE.SphereGeometry(constants_1.NODESIZE, 16, 16);
        this.refMesh = new THREE.Mesh();
        this.materialSphere = new THREE.Mesh(this.sphereGeometry, this.sphereMaterial.clone());
        this.leftSphere = new THREE.Mesh(this.sphereGeometry, this.sphereMaterial.clone());
        this.rightSphere = new THREE.Mesh(this.sphereGeometry, this.sphereMaterial.clone());
        this.topSphere = new THREE.Mesh(this.sphereGeometry, this.sphereMaterial.clone());
        this.bottomSphere = new THREE.Mesh(this.sphereGeometry, this.sphereMaterial.clone());
        this.materialSolid = new THREE.Mesh(this.sphereGeometry, this.solidMaterial.clone());
        this.leftSolid = new THREE.Mesh(this.sphereGeometry, this.solidMaterial.clone());
        this.rightSolid = new THREE.Mesh(this.sphereGeometry, this.solidMaterial.clone());
        this.topSolid = new THREE.Mesh(this.sphereGeometry, this.solidMaterial.clone());
        this.bottomSolid = new THREE.Mesh(this.sphereGeometry, this.solidMaterial.clone());
        this.INTERSECTS = [];
        this.sphereOnHover = false;
        this.sphereOnSelect = false;
        this.refMesh.add(this.materialSphere);
        this.refMesh.add(this.leftSphere);
        this.refMesh.add(this.rightSphere);
        this.refMesh.add(this.topSphere);
        this.refMesh.add(this.bottomSphere);
        this.refMesh.add(this.materialSolid);
        this.refMesh.add(this.leftSolid);
        this.refMesh.add(this.rightSolid);
        this.refMesh.add(this.topSolid);
        this.refMesh.add(this.bottomSolid);
        var realHeight = constants_1.SOFAHEIGHT;
        var realWidth = 0.94 * constants_1.SOFAWIDTH / 2;
        this.materialSolid.position.set(0, realHeight * 1.1, 0);
        this.leftSolid.position.set(-realWidth, realHeight, 0);
        this.rightSolid.position.set(realWidth, realHeight, 0);
        this.topSolid.position.set(0, realHeight, -realWidth);
        this.bottomSolid.position.set(0, realHeight, realWidth);
        this.materialSphere.position.set(0, realHeight * 1.1, 0);
        this.leftSphere.position.set(-realWidth, realHeight, 0);
        this.rightSphere.position.set(realWidth, realHeight, 0);
        this.topSphere.position.set(0, realHeight, -realWidth);
        this.bottomSphere.position.set(0, realHeight, realWidth);
        this.sofaFactory = factory;
        this.smallerTooltip = document.getElementById('tooltip_singular');
        this.smallerTooltip.addEventListener('click', function (e) { return e.stopPropagation(); });
    }
    OnHoverControls.prototype.tetherTo = function (target) {
        if (this.target) {
            this.target.remove(this.refMesh);
        }
        if (target) {
            var targetSofa = this.sofaFactory.findSofa(target);
            if (targetSofa) {
                this.target = targetSofa.meshes[0];
                this.target.add(this.refMesh);
            }
        }
        else {
            this.target = null;
        }
    };
    OnHoverControls.prototype.lightupObj = function (obj) {
        var _this = this;
        this.refMesh.children.forEach(function (child) {
            if (child === obj) {
                obj.currentHex = obj.material.emissive.getHex();
                obj.material.emissive.setHex(constants_1.HIGHLIGHT_COLOR2);
                _this.INTERSECTS.push(obj);
                _this.sphereOnHover = true;
            }
        });
    };
    OnHoverControls.prototype.mouseClickEvent = function (canvas, e, modsofa) {
        if (!this.sphereOnSelect && this.INTERSECTS.length > 0) {
            var rect = canvas.getBoundingClientRect();
            this.smallerTooltip.style.left = (e.clientX - rect.left) + 'px';
            this.smallerTooltip.style.top = (e.clientY - rect.top) + 'px';
            this.showToolTip();
            this.sphereOnSelect = true;
        }
        else {
            this.dismissTooltip();
        }
    };
    OnHoverControls.prototype.showToolTip = function () {
        var _this = this;
        this.selectedSofa = this.sofaFactory.findSofa(this.INTERSECTS[0].parent);
        /* then find the node that was clicked */
        if (Math.abs(this.INTERSECTS[0].position.x - this.INTERSECTS[0].parent.position.x) < 0.01) {
            if (Math.abs(this.INTERSECTS[0].position.z - this.INTERSECTS[0].parent.position.z) < 0.01) {
                /* material sphere */
                this.selectedSide = 'color';
            }
            else if (this.INTERSECTS[0].position.z > this.INTERSECTS[0].parent.position.z) {
                /* bottom node */
                this.selectedSide = 'bottom';
            }
            else if (this.INTERSECTS[0].position.z < this.INTERSECTS[0].parent.position.z) {
                /* top node */
                this.selectedSide = 'top';
            }
        }
        else if (this.INTERSECTS[0].position.x > this.INTERSECTS[0].parent.position.x) {
            /* right node */
            this.selectedSide = 'right';
        }
        else if (this.INTERSECTS[0].position.x < this.INTERSECTS[0].parent.position.x) {
            /* left node */
            this.selectedSide = 'left';
        }
        /* now, append the correct information to tooltip box */
        /* first check if the spot is occupied */
        if (this.selectedSofa[this.selectedSide]) {
            var accElement = document.createElement('div');
            var accName = document.createElement('span');
            accName.innerHTML = this.selectedSofa[this.selectedSide].constructor.name;
            var removeMe = document.createElement('span');
            removeMe.className = ' smaller';
            removeMe.innerHTML = 'remove';
            removeMe.addEventListener('click', function (ev) {
                _this.sofaFactory.remove(_this.selectedSofa, _this.selectedSide);
                _this.dismissTooltip();
            });
            accElement.appendChild(accName).appendChild(removeMe);
            this.smallerTooltip.innerHTML = "";
            this.smallerTooltip.appendChild(accElement);
            /* if the selected node is a backrest, append an additional option: mirrorclone */
            if (this.selectedSofa[this.selectedSide].constructor.name == 'Backsupport') {
                var mirrorClone = document.createElement('div');
                if (this.selectedSofa['mirror' + this.selectedSide]) {
                    var title = document.createElement('span');
                    title.innerHTML = 'Mirrored Sofa';
                    var removeButton = document.createElement('span');
                    removeButton.className = ' smaller';
                    removeButton.innerHTML = 'remove';
                    removeButton.addEventListener('click', function (ev) {
                        _this.sofaFactory.remove(_this.selectedSofa, 'mirror' + _this.selectedSide);
                        _this.dismissTooltip();
                    });
                    mirrorClone.appendChild(title).appendChild(removeButton);
                }
                else {
                    mirrorClone.className = ' smaller';
                    mirrorClone.innerHTML = 'Mirror Clone';
                    mirrorClone.addEventListener('click', function (ev) {
                        _this.cloneMirror(_this.selectedSofa, _this.selectedSide);
                        _this.dismissTooltip();
                    });
                }
                this.smallerTooltip.appendChild(mirrorClone);
            }
            /* nb: to find removal options for cushion, see the else section. crunch time, no time to rewrite logic */
        }
        else {
            this.smallerTooltip.innerHTML = "";
            var accElement_1 = document.createElement('div');
            var elements = [];
            switch (this.selectedSide) {
                case 'top':
                case 'bottom':
                    {
                        var accNameAddBackSupport = document.createElement('div');
                        accNameAddBackSupport.innerHTML = "add Backsupport";
                        accNameAddBackSupport.className = "smaller";
                        accNameAddBackSupport.addEventListener('click', function () {
                            _this.sofaFactory.addBacksupport(_this.selectedSofa, _this.selectedSide);
                            _this.dismissTooltip();
                        });
                        var accNameAddSofa = document.createElement('div');
                        accNameAddSofa.innerHTML = "add Sofa";
                        accNameAddSofa.className = "smaller";
                        accNameAddSofa.addEventListener('click', function () {
                            _this.sofaFactory.makeANewSofa(_this.selectedSofa, _this.selectedSide);
                            _this.dismissTooltip();
                        });
                        elements = [accNameAddBackSupport, accNameAddSofa];
                    }
                    break;
                case 'left':
                case 'right':
                    {
                        var accNameAddArmRest = document.createElement('div');
                        accNameAddArmRest.innerHTML = "add Armrest";
                        accNameAddArmRest.className = "smaller";
                        accNameAddArmRest.addEventListener('click', function () {
                            _this.sofaFactory.addArmrest(_this.selectedSofa, _this.selectedSide);
                            _this.dismissTooltip();
                        });
                        var accNameAddSofa = document.createElement('div');
                        accNameAddSofa.innerHTML = "add Sofa";
                        accNameAddSofa.className = "smaller";
                        accNameAddSofa.addEventListener('click', function () {
                            _this.sofaFactory.makeANewSofa(_this.selectedSofa, _this.selectedSide);
                            _this.dismissTooltip();
                        });
                        elements = [accNameAddArmRest, accNameAddSofa];
                    }
                    break;
                case 'color':
                    {
                        /* adding menu options to change colours */
                        var rowEl = document.createElement('div');
                        var materialColor_1 = document.createElement('span');
                        // materialColor.innerHTML = 'chnage color'//this.selectedSofa[this.selectedSide].constructor.name
                        var colors = [constants_1.CHALK, constants_1.LIGHTGRAY, constants_1.BEIGE, constants_1.BLUE, constants_1.CHARCOALBLACK];
                        colors.forEach(function (color) {
                            var colorEl = document.createElement('span');
                            colorEl.className = "colorEl";
                            colorEl.style.backgroundColor = "#" + color.toString(16);
                            colorEl.style.setProperty('display', 'inline-block');
                            colorEl.addEventListener('click', function () { return _this.sofaFactory.changeColor(_this.selectedSofa, color); });
                            materialColor_1.appendChild(colorEl);
                        });
                        rowEl.appendChild(materialColor_1);
                        /* adding menu option to add/remove cushion */
                        var accNameAddCushionArray = [];
                        if (this.selectedSofa.hasBackRest() != 0) {
                            if (this.selectedSofa.cushion) {
                                var accNameAddCushion = document.createElement('div');
                                accNameAddCushion.innerHTML = "remove Cushion";
                                accNameAddCushion.className = "smaller";
                                accNameAddCushion.addEventListener('click', function () {
                                    _this.sofaFactory.remove(_this.selectedSofa, 'cushion');
                                    _this.dismissTooltip();
                                });
                                accNameAddCushionArray.push(accNameAddCushion);
                            }
                            else {
                                var accNameAddCushion = document.createElement('div');
                                accNameAddCushion.innerHTML = "add Cushion";
                                accNameAddCushion.className = "smaller";
                                accNameAddCushion.addEventListener('click', function () {
                                    _this.sofaFactory.addCushion(_this.selectedSofa);
                                    _this.dismissTooltip();
                                });
                                accNameAddCushionArray.push(accNameAddCushion);
                            }
                        }
                        /* adding menu option to remove this sofa */
                        var removeSofa = document.createElement('div');
                        removeSofa.innerHTML = "remove sofa";
                        removeSofa.className = "smaller";
                        removeSofa.addEventListener('click', function () {
                            var parentSofa = _this.sofaFactory.findSofa(_this.selectedSofa.meshes[0].parent);
                            var sides = ['left', 'right', 'top', 'bottom', 'mirrortop', 'mirrorbottom'];
                            /* currently, the root sofa cannot be deleted */
                            if (parentSofa) {
                                var parentSide = sides.find(function (side) { return parentSofa[side] === _this.selectedSofa; });
                                _this.sofaFactory.remove(parentSofa, parentSide);
                            }
                            _this.dismissTooltip();
                        });
                        elements = [rowEl].concat(accNameAddCushionArray, [removeSofa]);
                    }
                    break;
            }
            elements.forEach(function (el) { return accElement_1.appendChild(el); });
            this.smallerTooltip.appendChild(accElement_1);
        }
    };
    OnHoverControls.prototype.cloneMirror = function (targetSofa, side) {
        var ztranslation;
        side == 'top' ? ztranslation = -constants_1.SOFAWIDTH - constants_1.SOFAWIDTH * 0.13 :
            side == 'bottom' ? ztranslation = constants_1.SOFAWIDTH + constants_1.SOFAWIDTH * 0.13 :
                console.log('clone mirror error', side);
        if (!ztranslation) {
            return;
        }
        var newSofa = targetSofa.clone(this.sofaFactory);
        newSofa.mirrorXZ();
        this.sofaFactory.sofaLedger.push(newSofa);
        targetSofa['mirror' + side] = newSofa;
        newSofa.meshes.forEach(function (mesh) {
            targetSofa.meshes[0].add(mesh);
            mesh.position.set(0, 0, ztranslation);
        });
    };
    OnHoverControls.prototype.dismissTooltip = function () {
        var _this = this;
        this.smallerTooltip.style.left = '-9999px';
        this.sphereOnHover = false;
        this.sphereOnSelect = false;
        this.sofaFactory.sofaLedger.forEach(function (sofa) {
            if (sofa.cushion) {
                sofa.cushion.reposition();
            }
        });
        setTimeout(function () {
            _this.priceCalc();
        }, 0);
    };
    OnHoverControls.prototype.priceCalc = function () {
        var sofaTally = 0, armTally = 0, backTally = 0, cushionTally = 0;
        var sides = ['left', 'right', 'top', 'bottom', 'cushion'];
        this.sofaFactory.sofaLedger.forEach(function (sofa) {
            sofaTally++;
            // to export colours too, use:
            // let material:any = sofa.material
            // material.color.r / material.color.g material.color.b
            for (var _i = 0, sides_1 = sides; _i < sides_1.length; _i++) {
                var side = sides_1[_i];
                if (sofa[side]) {
                    switch (sofa[side].constructor.name) {
                        case 'Backsupport':
                            {
                                backTally++;
                            }
                            break;
                        case 'Armrest':
                            {
                                armTally++;
                            }
                            break;
                        case 'Cushion':
                            {
                                if (sofa[side].meshes[0].visible) {
                                    cushionTally++;
                                }
                            }
                            break;
                    }
                }
            }
        });
        window['kopa_tally'] = {
            sofa: sofaTally,
            arm: armTally,
            back: backTally,
            cushion: cushionTally
        };
        var priceTally = "\nPrice Tally:<br />\nSofa x " + sofaTally + ", Armrest x " + armTally + ", Backrest x " + backTally + ", Cushion x " + cushionTally + " <br />\ntotally $" + (sofaTally * constants_1.PRICE.SOFA + armTally * constants_1.PRICE.ARMREST + backTally * constants_1.PRICE.BACKREST + cushionTally * constants_1.PRICE.CUSHION) + "<br /><br />\n        ";
        var boundingBox = new THREE.Box3().setFromObject(this.sofaFactory.sofaLedger[0].meshes[0]);
        var width = Math.round((boundingBox.max.x - boundingBox.min.x) * constants_1.SCALE);
        var height = Math.round((boundingBox.max.y - boundingBox.min.y) * constants_1.SCALE);
        var depth = Math.round((boundingBox.max.z - boundingBox.min.z) * constants_1.SCALE);
        var dimension = "\nEstimated dimension: (cm) <br />\n" + width + " x " + depth + " x " + height + "\n        ";
        var pricePanel = document.getElementById('webgl_info');
        pricePanel.innerHTML = priceTally + dimension;
    };
    return OnHoverControls;
}());
exports.OnHoverControls = OnHoverControls;
//# sourceMappingURL=util.js.map