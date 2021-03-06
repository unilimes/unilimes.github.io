import * as THREE from "three"
import { Sofa,Armrest,Backsupport,Cushion } from "./sofaModel"
import { CHALK,ROOT,SOFAWIDTH,WHITE,CHARCOAL,NAVY,LIGHTGRAY,BEIGE,TEXTURE_WRAPS,TEXTURE_WRAPT,TEXTURE_BUMP } from "./constants"
/**
 * Creates a new Util.
 * @class
 */
export class SofaFactory {

    castShadow : boolean = false;

    sofaLedger : Sofa[];
    geometry : THREE.Geometry;
    material : THREE.Material;
    legMaterial : THREE.MeshLambertMaterial;
    pinMaterial : THREE.MeshPhongMaterial;

    armrestGeometry : THREE.Geometry;
    backsupportGeometry : THREE.Geometry;

    armrestLegsGeometry : THREE.Geometry;
    backsupportLegsGeometry : THREE.Geometry;
    sofaLegsGeometry : THREE.Geometry;
    sofaPinsGeometry : THREE.Geometry;
    cushionGeometry : THREE.Geometry;

    charcoalMaterial : THREE.Material;
    navyMaterial : THREE.Material;
    lightgrayMaterial : THREE.Material;
    beigeMaterial : THREE.Material;

    texture : THREE.Texture;
    normalMap : THREE.Texture;
    
    constructor(){
        this.charcoalMaterial = new THREE.MeshPhongMaterial({
            color : CHARCOAL,
            side: THREE.DoubleSide,
            vertexColors : THREE.FaceColors,
        });

        this.navyMaterial = new THREE.MeshPhongMaterial({
            color : NAVY,
            side: THREE.DoubleSide,
            vertexColors : THREE.FaceColors
        });

        this.lightgrayMaterial = new THREE.MeshPhongMaterial({
            color : LIGHTGRAY,
            side: THREE.DoubleSide,
            vertexColors : THREE.FaceColors
        });

        this.beigeMaterial = new THREE.MeshPhongMaterial({
            color : CHALK,
            side: THREE.DoubleSide,
            vertexColors : THREE.FaceColors
        });

        /* load geometry/materials here */
        this.material = this.beigeMaterial;
        this.sofaLedger = []
    }
    /** @function loadGeometries */
    loadGeometries( callback : ()=>void ){
        Promise.all([
            new Promise((resolve,reject)=>{
                let mainLoader = new THREE.JSONLoader();
                mainLoader.load(ROOT + "./blenderobj/sofa.json",(geometry)=>{
                    this.geometry = geometry;
                    resolve()
                },()=>{},(e)=>{
                    reject(e.message)
                })
            }),
            new Promise((resolve,reject)=>{
                let mainLoader = new THREE.JSONLoader();
                mainLoader.load(ROOT + "./blenderobj/arm.json",(geometry)=>{
                    this.armrestGeometry = geometry;
                    resolve()
                },()=>{},(e)=>{
                    reject(e.message)
                })
            }),
            new Promise((resolve,reject)=>{
                let mainLoader = new THREE.JSONLoader();
                mainLoader.load(ROOT + "./blenderobj/backrest.json",(geometry)=>{
                    this.backsupportGeometry = geometry;
                    resolve()
                },()=>{},(e)=>{
                    reject(e.message)
                })
            }),
            new Promise((resolve,reject)=>{
                    let mainLoader = new THREE.JSONLoader();
                    mainLoader.load(ROOT + "./blenderobj/cushion.json",(geometry)=>{
                        geometry.computeVertexNormals();
                        this.cushionGeometry = geometry;
                        resolve()
                    },()=>{},(e)=>{
                    reject(e.message)
                })
            }),
            new Promise((resolve,reject)=>{
                let textureLoader = new THREE.TextureLoader();
                textureLoader.crossOrigin = '';
                textureLoader.load(ROOT + "./blenderobj/SOFA/CHALK.jpg",(texture)=>{
                    texture.wrapS = THREE.RepeatWrapping;
                    texture.wrapT = THREE.RepeatWrapping;
                    texture.repeat.set( TEXTURE_WRAPS, TEXTURE_WRAPT );
                    this.texture = texture;
                    resolve()
                },()=>{},(e)=>{
                    reject(e.message)
                })
            }),
            new Promise((resolve,reject)=>{
                let textureLoader = new THREE.TextureLoader();
                textureLoader.crossOrigin = '';
                textureLoader.load(ROOT + "./blenderobj/CUSHION/YELLOW.jpg",(texture)=>{
                    texture.wrapS = THREE.RepeatWrapping;
                    texture.wrapT = THREE.RepeatWrapping;
                    texture.repeat.set( TEXTURE_WRAPS, TEXTURE_WRAPT );
                    this.normalMap = texture;
                    resolve()
                },()=>{},(e)=>{
                    reject(e.message)
                })
            })
        ]).then(()=>{

            this.charcoalMaterial = new THREE.MeshPhongMaterial({
                color : CHALK,
                side: THREE.DoubleSide,
                vertexColors : THREE.FaceColors,
                map : this.texture,
                bumpMap : this.normalMap,
                bumpScale:TEXTURE_BUMP,
                // specularMap : this.normalMap,
                // specular : 0xcccccc
            });
            this.material = this.charcoalMaterial;

            this.pinMaterial = new THREE.MeshPhongMaterial({
                color : 0x9f9f9f,
                specular : 0xcccccc
            });

            this.legMaterial = new THREE.MeshLambertMaterial({
                color : 0x161616
            });

            callback()
        })

    }
    /** @function makeANewSofa */
    makeANewSofa(sofa?:Sofa,position?:string):Sofa{
        if( sofa ){
            if( !sofa[position] ){
                let newMaterial : any = this.material.clone();
                newMaterial.emissive.setHex(0x000000);
                let newSofa = new Sofa( this.geometry,newMaterial,this.sofaLegsGeometry,this.legMaterial );
                
                newSofa.meshes.forEach(mesh=>{
                    mesh.castShadow = this.castShadow
                });

                this.sofaLedger.push( newSofa );
                sofa[position] = newSofa;
                
                sofa[position].meshes.forEach(mesh=>{
                    sofa.meshes[0].add( mesh )
                });

                switch( position ){
                    case 'top':{
                        sofa[position].meshes.forEach(mesh=>{
                            mesh.position.set(0,0,-SOFAWIDTH)
                        })
                    }break;
                    case 'left':{
                        sofa[position].meshes.forEach(mesh=>{
                            mesh.position.set(-SOFAWIDTH,0,0)
                        })
                    }break;
                    case 'bottom':{
                        sofa[position].meshes.forEach(mesh=>{
                            mesh.position.set(0,0,SOFAWIDTH)
                        })
                    }break;
                    case 'right':{
                        sofa[position].meshes.forEach(mesh=>{
                            mesh.position.set(SOFAWIDTH,0,0)
                        })
                    }break;
                    case 'mirrortop':{
                        sofa[position].meshes.forEach(mesh=>{
                            mesh.position.set(0,0,SOFAWIDTH)
                        })
                    }
                    case 'mirrorbottom':{
                        sofa[position].meshes.forEach(mesh=>{
                            mesh.position.set(0,0,-SOFAWIDTH)
                        })
                    }
                }

                return null
            }else{
                throw new Error("This position is already occupied!")
            }
        }else{
            let newSofa = new Sofa( this.geometry, this.material,this.sofaLegsGeometry,this.legMaterial );
            newSofa.meshes.forEach(mesh=>{
                mesh.castShadow = this.castShadow
            });
            this.sofaLedger.push( newSofa );
            return newSofa
        }
    }
    /** @function addCushion */
    addCushion(sofa:Sofa){
        sofa.cushion = new Cushion(sofa,this.cushionGeometry);
        sofa.cushion.meshes.forEach(mesh=>{
            mesh.castShadow = true;
            sofa.meshes[0].add( mesh );
        })
    }
    /** @function addArmrest */
    addArmrest(sofa:Sofa,position:string){
        if ( !sofa[position] ){

            sofa[position] = new Armrest(sofa,this.armrestGeometry,this.armrestLegsGeometry,this.legMaterial);
            
            sofa[position].meshes.forEach(mesh=>{
                mesh.castShadow = true;
                sofa.meshes[0].add( mesh )
            });

            switch( position ){
                case 'top':{
                    sofa[position].meshes.forEach(mesh=>{
                        mesh.rotateY(Math.PI/2*3)
                    })
                }break;
                case 'left':{
                }break;
                case 'bottom':{
                    sofa[position].meshes.forEach(mesh=>{
                        mesh.rotateY(Math.PI/2)
                    })
                }break;
                case 'right':{
                    sofa[position].meshes.forEach(mesh=>{
                        mesh.rotateY(Math.PI)
                    })
                }break;
            }

        }else{
            throw new Error('This position is already occupied!')
        }
    }
    /** @function addBacksupport */
    addBacksupport(sofa:Sofa,position:string){
        if ( !sofa[position]){
            sofa[position] = new Backsupport(sofa,this.backsupportGeometry,this.sofaPinsGeometry,this.pinMaterial);
            sofa[position].meshes.forEach(mesh=>{
                mesh.castShadow = true;
                sofa.meshes[0].add( mesh )
            });

            switch( position ){
                case 'top':{
                }break;
                case 'left':{
                    sofa[position].meshes.forEach(mesh=>{
                        mesh.rotateY(Math.PI/2)
                    })
                }break;
                case 'bottom':{
                    sofa[position].meshes.forEach(mesh=>{
                        mesh.rotateY(Math.PI)
                    })
                }break;
                case 'right':{
                    sofa[position].meshes.forEach(mesh=>{
                        mesh.rotateY(Math.PI/2*3)
                    })
                }break;
            }
        }else{
            throw new Error('This position is already occupied!')
        }
    }
    /** @function changeColor */
    changeColor(sofa:Sofa,color:number){
        if( sofa ){
            let material : any = sofa.material;
            material.color.setHex(color)
        }
    }
    /** @function changeColorCushion */
    changeColorCushion( cushion:Cushion, color:number){
        if( cushion ){
            let material : any = cushion.meshes[0].material;
            material.color.setHex(color)
        }
    }

    /* remove acc /sofa from view */
    /** @function remove */
    remove(sofa:Sofa,position:string){
        if( sofa[position] ){
            if( sofa[position].constructor.name == 'Sofa' ){
                this.removeAllSofasFromLedger( sofa[position] )
            }
            sofa[position].meshes.forEach(mesh=>{
                sofa.meshes[0].remove( mesh )
            });
            sofa[position] = null
        }
    }

    /* once sofa is removed from view, it also needs to be removed from the ledger */
    /** @function removeAllSofasFromLedger */
    removeAllSofasFromLedger(sofa:any){
        this.sofaLedger.forEach( (itSofa,idx,arr) => {
            if (sofa === itSofa ) { 
                arr.splice(idx,1) ;
                sofa.left && sofa.left.constructor.name == 'Sofa' ? this.removeAllSofasFromLedger( sofa.left ) : {};
                sofa.right && sofa.right.constructor.name == 'Sofa' ? this.removeAllSofasFromLedger( sofa.right ) : {};
                sofa.top && sofa.top.constructor.name == 'Sofa' ? this.removeAllSofasFromLedger( sofa.top ) : {};
                sofa.bottom && sofa.bottom.constructor.name == 'Sofa' ? this.removeAllSofasFromLedger( sofa.bottom ) : {};
                return
            }
        })
    }

    /* given a mesh, find the Sofa obj in ledger */
    /** @function findSofa */
    findSofa(mesh:THREE.Object3D):Sofa{
        /* intersection could be an accessory or base sofa */
        let sofa =  this.sofaLedger.find( sofa => sofa.meshes[0] === mesh );
        
        return sofa ? sofa : this.sofaLedger.find( sofa => sofa.meshes[0] === mesh.parent )
    }
}