"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var THREE = require("three");
var sofaModel_1 = require("./sofaModel");
var constants_1 = require("./constants");
var SofaFactory = (function () {
    function SofaFactory() {
        this.castShadow = false;
        this.charcoalMaterial = new THREE.MeshPhongMaterial({
            color: constants_1.CHARCOAL,
            side: THREE.DoubleSide,
            vertexColors: THREE.FaceColors,
        });
        this.navyMaterial = new THREE.MeshPhongMaterial({
            color: constants_1.NAVY,
            side: THREE.DoubleSide,
            vertexColors: THREE.FaceColors
        });
        this.lightgrayMaterial = new THREE.MeshPhongMaterial({
            color: constants_1.LIGHTGRAY,
            side: THREE.DoubleSide,
            vertexColors: THREE.FaceColors
        });
        this.beigeMaterial = new THREE.MeshPhongMaterial({
            color: constants_1.CHALK,
            side: THREE.DoubleSide,
            vertexColors: THREE.FaceColors
        });
        /* load geometry/materials here */
        this.material = this.beigeMaterial;
        this.sofaLedger = [];
    }
    SofaFactory.prototype.loadGeometries = function (callback) {
        var _this = this;
        Promise.all([
            new Promise(function (resolve, reject) {
                var mainLoader = new THREE.JSONLoader();
                mainLoader.load(constants_1.ROOT + "./blenderobj/sofa.json", function (geometry) {
                    _this.geometry = geometry;
                    resolve();
                }, function () { }, function (e) {
                    reject(e.message);
                });
            }),
            new Promise(function (resolve, reject) {
                var mainLoader = new THREE.JSONLoader();
                mainLoader.load(constants_1.ROOT + "./blenderobj/arm.json", function (geometry) {
                    _this.armrestGeometry = geometry;
                    resolve();
                }, function () { }, function (e) {
                    reject(e.message);
                });
            }),
            new Promise(function (resolve, reject) {
                var mainLoader = new THREE.JSONLoader();
                mainLoader.load(constants_1.ROOT + "./blenderobj/backrest.json", function (geometry) {
                    _this.backsupportGeometry = geometry;
                    resolve();
                }, function () { }, function (e) {
                    reject(e.message);
                });
            }),
            new Promise(function (resolve, reject) {
                var mainLoader = new THREE.JSONLoader();
                mainLoader.load(constants_1.ROOT + "./blenderobj/sofalegs.json", function (geometry) {
                    _this.sofaLegsGeometry = geometry;
                    resolve();
                }, function () { }, function (e) {
                    reject(e.message);
                });
            }),
            new Promise(function (resolve, reject) {
                var mainLoader = new THREE.JSONLoader();
                mainLoader.load(constants_1.ROOT + "./blenderobj/armlegs.json", function (geometry) {
                    _this.armrestLegsGeometry = geometry;
                    resolve();
                }, function () { }, function (e) {
                    reject(e.message);
                });
            }),
            // new Promise((resolve,reject)=>{
            //     let mainLoader = new THREE.JSONLoader()
            //     mainLoader.load(ROOT + "./blenderobj/backrestlegs.json",(geometry)=>{
            //         this.backsupportLegsGeometry = geometry
            //         resolve()
            //     },()=>{},(e)=>{
            //         reject(e.message)
            //     })
            // }),
            new Promise(function (resolve, reject) {
                var mainLoader = new THREE.JSONLoader();
                mainLoader.load(constants_1.ROOT + "./blenderobj/backrestpins.json", function (geometry) {
                    _this.sofaPinsGeometry = geometry;
                    resolve();
                }, function () { }, function (e) {
                    reject(e.message);
                });
            }),
            new Promise(function (resolve, reject) {
                var mainLoader = new THREE.JSONLoader();
                mainLoader.load(constants_1.ROOT + "./blenderobj/cushion.json", function (geometry) {
                    geometry.computeVertexNormals();
                    _this.cushionGeometry = geometry;
                    resolve();
                }, function () { }, function (e) {
                    reject(e.message);
                });
            }),
            new Promise(function (resolve, reject) {
                var textureLoader = new THREE.TextureLoader();
                textureLoader.crossOrigin = '';
                textureLoader.load(constants_1.ROOT + "./blenderobj/white.jpg", function (texture) {
                    // textureLoader.load(ROOT + "./blenderobj/SOFA/CHALK.jpg",(texture)=>{
                    texture.wrapS = THREE.RepeatWrapping;
                    texture.wrapT = THREE.RepeatWrapping;
                    texture.repeat.set(constants_1.TEXTURE_WRAPS, constants_1.TEXTURE_WRAPT);
                    _this.texture = texture;
                    resolve();
                }, function () { }, function (e) {
                    reject(e.message);
                });
            }),
            new Promise(function (resolve, reject) {
                var textureLoader = new THREE.TextureLoader();
                textureLoader.crossOrigin = '';
                textureLoader.load(constants_1.ROOT + "./blenderobj/normal.jpg", function (texture) {
                    texture.wrapS = THREE.RepeatWrapping;
                    texture.wrapT = THREE.RepeatWrapping;
                    texture.repeat.set(constants_1.TEXTURE_WRAPS, constants_1.TEXTURE_WRAPT);
                    _this.normalMap = texture;
                    resolve();
                }, function () { }, function (e) {
                    reject(e.message);
                });
            })
        ]).then(function () {
            _this.charcoalMaterial = new THREE.MeshPhongMaterial({
                color: constants_1.CHALK,
                side: THREE.DoubleSide,
                vertexColors: THREE.FaceColors,
                map: _this.texture,
                bumpMap: _this.normalMap,
                bumpScale: constants_1.TEXTURE_BUMP,
            });
            _this.material = _this.charcoalMaterial;
            _this.pinMaterial = new THREE.MeshPhongMaterial({
                color: 0x9f9f9f,
                specular: 0xcccccc
            });
            _this.legMaterial = new THREE.MeshLambertMaterial({
                color: 0x161616
            });
            callback();
        });
        // mainLoader.load("blenderobj/main.json",(geometry)=>{
        //     this.geometry = geometry
        // })
        // armLoader.load("blenderobj/arm.json",(geometry)=>{
        //     this.armrestGeometry = geometry
        // })
        // backLoader.load("blenderobj/back.json",(geometry)=>{
        //     this.backsupportGeometry = geometry
        // })
    };
    SofaFactory.prototype.makeANewSofa = function (sofa, position) {
        var _this = this;
        if (sofa) {
            if (!sofa[position]) {
                var newMaterial = this.material.clone();
                newMaterial.emissive.setHex(0x000000);
                var newSofa = new sofaModel_1.Sofa(this.geometry, newMaterial, this.sofaLegsGeometry, this.legMaterial);
                newSofa.meshes.forEach(function (mesh) {
                    mesh.castShadow = _this.castShadow;
                });
                this.sofaLedger.push(newSofa);
                sofa[position] = newSofa;
                sofa[position].meshes.forEach(function (mesh) {
                    sofa.meshes[0].add(mesh);
                });
                switch (position) {
                    case 'top':
                        {
                            sofa[position].meshes.forEach(function (mesh) {
                                mesh.position.set(0, 0, -constants_1.SOFAWIDTH);
                            });
                        }
                        break;
                    case 'left':
                        {
                            sofa[position].meshes.forEach(function (mesh) {
                                mesh.position.set(-constants_1.SOFAWIDTH, 0, 0);
                            });
                        }
                        break;
                    case 'bottom':
                        {
                            sofa[position].meshes.forEach(function (mesh) {
                                mesh.position.set(0, 0, constants_1.SOFAWIDTH);
                            });
                        }
                        break;
                    case 'right':
                        {
                            sofa[position].meshes.forEach(function (mesh) {
                                mesh.position.set(constants_1.SOFAWIDTH, 0, 0);
                            });
                        }
                        break;
                    case 'mirrortop': {
                        sofa[position].meshes.forEach(function (mesh) {
                            mesh.position.set(0, 0, constants_1.SOFAWIDTH);
                        });
                    }
                    case 'mirrorbottom': {
                        sofa[position].meshes.forEach(function (mesh) {
                            mesh.position.set(0, 0, -constants_1.SOFAWIDTH);
                        });
                    }
                }
                return null;
            }
            else {
                throw new Error("This position is already occupied!");
            }
        }
        else {
            var newSofa = new sofaModel_1.Sofa(this.geometry, this.material, this.sofaLegsGeometry, this.legMaterial);
            newSofa.meshes.forEach(function (mesh) {
                mesh.castShadow = _this.castShadow;
            });
            this.sofaLedger.push(newSofa);
            return newSofa;
        }
    };
    SofaFactory.prototype.addCushion = function (sofa) {
        sofa.cushion = new sofaModel_1.Cushion(sofa, this.cushionGeometry);
        sofa.cushion.meshes.forEach(function (mesh) {
            mesh.castShadow = true;
            sofa.meshes[0].add(mesh);
        });
    };
    SofaFactory.prototype.addArmrest = function (sofa, position) {
        if (!sofa[position]) {
            sofa[position] = new sofaModel_1.Armrest(sofa, this.armrestGeometry, this.armrestLegsGeometry, this.legMaterial);
            sofa[position].meshes.forEach(function (mesh) {
                mesh.castShadow = true;
                sofa.meshes[0].add(mesh);
            });
            switch (position) {
                case 'top':
                    {
                        sofa[position].meshes.forEach(function (mesh) {
                            mesh.rotateY(Math.PI / 2 * 3);
                        });
                    }
                    break;
                case 'left':
                    {
                    }
                    break;
                case 'bottom':
                    {
                        sofa[position].meshes.forEach(function (mesh) {
                            mesh.rotateY(Math.PI / 2);
                        });
                    }
                    break;
                case 'right':
                    {
                        sofa[position].meshes.forEach(function (mesh) {
                            mesh.rotateY(Math.PI);
                        });
                    }
                    break;
            }
        }
        else {
            throw new Error('This position is already occupied!');
        }
    };
    SofaFactory.prototype.addBacksupport = function (sofa, position) {
        if (!sofa[position]) {
            sofa[position] = new sofaModel_1.Backsupport(sofa, this.backsupportGeometry, this.sofaPinsGeometry, this.pinMaterial);
            sofa[position].meshes.forEach(function (mesh) {
                mesh.castShadow = true;
                sofa.meshes[0].add(mesh);
            });
            switch (position) {
                case 'top':
                    {
                    }
                    break;
                case 'left':
                    {
                        sofa[position].meshes.forEach(function (mesh) {
                            mesh.rotateY(Math.PI / 2);
                        });
                    }
                    break;
                case 'bottom':
                    {
                        sofa[position].meshes.forEach(function (mesh) {
                            mesh.rotateY(Math.PI);
                        });
                    }
                    break;
                case 'right':
                    {
                        sofa[position].meshes.forEach(function (mesh) {
                            mesh.rotateY(Math.PI / 2 * 3);
                        });
                    }
                    break;
            }
        }
        else {
            throw new Error('This position is already occupied!');
        }
    };
    SofaFactory.prototype.changeColor = function (sofa, color) {
        var material = sofa.material;
        material.color.setHex(color);
    };
    /* remove acc /sofa from view */
    SofaFactory.prototype.remove = function (sofa, position) {
        if (sofa[position]) {
            if (sofa[position].constructor.name == 'Sofa') {
                this.removeAllSofasFromLedger(sofa[position]);
            }
            sofa[position].meshes.forEach(function (mesh) {
                sofa.meshes[0].remove(mesh);
            });
            sofa[position] = null;
        }
    };
    /* once sofa is removed from view, it also needs to be removed from the ledger */
    SofaFactory.prototype.removeAllSofasFromLedger = function (sofa) {
        var _this = this;
        this.sofaLedger.forEach(function (itSofa, idx, arr) {
            if (sofa === itSofa) {
                arr.splice(idx, 1);
                sofa.left && sofa.left.constructor.name == 'Sofa' ? _this.removeAllSofasFromLedger(sofa.left) : {};
                sofa.right && sofa.right.constructor.name == 'Sofa' ? _this.removeAllSofasFromLedger(sofa.right) : {};
                sofa.top && sofa.top.constructor.name == 'Sofa' ? _this.removeAllSofasFromLedger(sofa.top) : {};
                sofa.bottom && sofa.bottom.constructor.name == 'Sofa' ? _this.removeAllSofasFromLedger(sofa.bottom) : {};
                return;
            }
        });
    };
    /* given a mesh, find the Sofa obj in ledger */
    SofaFactory.prototype.findSofa = function (mesh) {
        /* intersection could be an accessory or base sofa */
        var sofa = this.sofaLedger.find(function (sofa) { return sofa.meshes[0] === mesh; });
        return sofa ? sofa : this.sofaLedger.find(function (sofa) { return sofa.meshes[0] === mesh.parent; });
    };
    return SofaFactory;
}());
exports.SofaFactory = SofaFactory;
//# sourceMappingURL=sofaFactory.js.map