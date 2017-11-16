import {Scene} from './scene'
import * as THREE from "three"
import {Util, OnHoverControls} from "./util"
import {ModifySofaDialog} from "./modSofa"
import {ZOOMFACTOR, HIGHLIGHT_COLOR, RENDERER_COLOR, RENDER_MIRROR, RENDER_SPOT} from "./constants"

export class KopaViewer {

    canvas: HTMLElement;

    renderer: THREE.WebGLRenderer;
    scene: Scene;

    public util: Util;
    modSofa: ModifySofaDialog;
    onHoverControls: OnHoverControls;

    INTERSECT: any;

    /* canvas should be the html element passed */
    constructor(canvas: HTMLElement) {
        this.canvas = canvas;


        /* setting up the renderer */
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize( this.canvas.clientWidth, this.canvas.clientHeight );
        this.renderer.setClearColor(RENDERER_COLOR);
        this.canvas.appendChild( this.renderer.domElement );

        /* setting up the scene + units */
        this.scene = new Scene(this.renderer);

        /* util deals with drag controls and highlighting */
        this.util = new Util(this.scene.camera, this.canvas);
        this.modSofa = new ModifySofaDialog( this.scene.sofaFactory );

        this.canvas.addEventListener('mousemove', (e) => this.util.mouseMoveEvent(this.canvas, e), false);
        this.canvas.addEventListener('click', (e) => this.onHoverControls.mouseClickEvent(this.canvas, e, this.modSofa), false);

        this.onHoverControls = new OnHoverControls(this.scene.sofaFactory);

        if (RENDER_SPOT) this.configShadow();
        this.init()
    }

    configShadow() {
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        this.scene.floor.floor.receiveShadow = true;
        this.scene.sofaFactory.castShadow = true;


        this.scene.spot.castShadow = true;
        this.scene.spot.shadow.mapSize.width = 1024;
        this.scene.spot.shadow.mapSize.height = 1024;
    }

    init() {
        this.scene.setup();
        this.animationFrame()
    }

    /* necessary to keep the scope */
    animationFrame = () => {

        /* update control, or else will not have mouse driven control of webgl */
        this.util.control.update();

        /* set the center of the scene to be the average of all sofas */
        this.scene.cameraAnchorDest.position.set(0, 0, 0);
        let counter = 0;

        this.scene.sofaFactory.sofaLedger.forEach(sofa => {
            this.scene.cameraAnchorDest.position.add(sofa.meshes[0].position);
            counter++
        });
        if (counter > 0) {
            this.scene.cameraAnchorDest.position.divideScalar(counter)
        }

        /* reposition camera anchor */
        this.scene.cameraAnchor.position.multiplyScalar(9).add(this.scene.cameraAnchorDest.position).divideScalar(10);

        /* if a node is SELECTED, then raycast will not be tested. Until the node is unselected */
        if (!this.onHoverControls.sphereOnSelect) {
            /* find mouse on hover target */
            let raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(this.util.mouse, this.scene.camera);
            let intersects = raycaster.intersectObjects(this.scene.floor.sofaRoot.children, true);

            /* firstly, reset the existing intersects with spheres, if any */
            this.onHoverControls.INTERSECTS.forEach(INTERSECT => {
                INTERSECT.material.emissive.setHex(INTERSECT.currentHex)
            });
            this.onHoverControls.INTERSECTS = [];
            this.onHoverControls.sphereOnHover = false;

            /* next, detect any intersections with spheres */
            intersects.forEach(intersect => {
                this.onHoverControls.lightupObj(intersect.object)
            });

            /* reselect the sofa only if no sphere is selected */
            if (!this.onHoverControls.sphereOnHover) {
                /* onhover sofa mesh */
                /* reset previous on hover emissivehex */
                this.INTERSECT ? this.INTERSECT.material.emissive.setHex(this.INTERSECT.currentHex) : {};

                /* modify on hover target appearance */
                if (intersects.length > 0) {

                    this.INTERSECT = intersects[0].object;
                    this.INTERSECT.currentHex = this.INTERSECT.material.emissive.getHex();
                    this.INTERSECT.material.emissive.setHex(HIGHLIGHT_COLOR)
                } else {
                    this.INTERSECT = null
                }
            }

            this.onHoverControls.tetherTo(this.INTERSECT)
        }

        if (RENDER_MIRROR) {
            this.scene.floor.groundMirror.render()
        }
        this.renderer.render(this.scene.scene, this.scene.camera);
        requestAnimationFrame(this.animationFrame)
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('kopa_webgl')) {
        /* init viewer */
        let kopaViewer = new KopaViewer(document.getElementById('kopa_webgl'));

        // /* overlay */
        document.getElementById('kopa_webgl_cover');
        document.getElementById('kopa_webgl_cover').remove();
        document.getElementById('webgl_overlay_footer').style.visibility = 'visible';

        /* bind shop ui button */
        // document.getElementById('shop_ui_test_btn').addEventListener('click',(ev)=>{
        //     let testbutton = document.getElementById('yui_3_17_2_1_1502516319895_248').click()
        // })

        document.getElementById('webgl_reserve_now').addEventListener('click', () => {
            // console.log( (<HTMLInputElement>document.querySelectorAll("[data-item-id='59fc7b18ec212dd8d9a3661a'")[0].children[0]).value );
            // console.log( (<HTMLInputElement>document.querySelectorAll("[data-item-id='59f716b424a694055a7c20c0'")[0].children[0]).value );
            // console.log( (<HTMLInputElement>document.querySelectorAll("[data-item-id='59fc7b58652deac953923e02'")[0].children[0]).value );
            // console.log( (<HTMLInputElement>document.querySelectorAll("[data-item-id='59fc7b5f24a694eecd2344c2'")[0].children[0]).value );

            function addToCart(id, data, value) {
                (<HTMLInputElement>(document.querySelectorAll(data)[0].children[0])).value = value;
                document.getElementById(id).click();
                document.getElementById(id).style.display = 'none';

            }

            if( window['kopa_tally'].cushion > 0 ){
                setTimeout(addToCart, 500, 'yui_3_17_2_1_1509985286676_152', "[data-item-id='59fc7b5f24a694eecd2344c2'", window['kopa_tally'].cushion);
            } else if( window['kopa_tally'].cushion > 1 ) {
                setTimeout(addToCart, 300, 'yui_3_17_2_1_1509985286676_152', "[data-item-id='59fc7b5f24a694eecd2344c2'", window['kopa_tally'].cushion);
            }

            if( window['kopa_tally'].arm > 0 ){
                setTimeout(addToCart, 900, 'yui_3_17_2_1_1509984998759_152', "[data-item-id='59fc7b58652deac953923e02'", window['kopa_tally'].arm);
            } else if( window['kopa_tally'].arm > 1 ) {
                setTimeout(addToCart, 300, 'yui_3_17_2_1_1509984998759_152', "[data-item-id='59fc7b58652deac953923e02'", window['kopa_tally'].arm);
            }

            if( window['kopa_tally'].back > 0 ){
                setTimeout(addToCart, 1300, 'yui_3_17_2_1_1509985394439_153', "[data-item-id='59fc7b18ec212dd8d9a3661a'", window['kopa_tally'].back);
            } else if( window['kopa_tally'].back > 1 ){
                setTimeout(addToCart, 300, 'yui_3_17_2_1_1509985394439_153', "[data-item-id='59fc7b18ec212dd8d9a3661a'", window['kopa_tally'].back);
            }

            if( window['kopa_tally'].sofa > 0 ){
                setTimeout(addToCart, 1700, 'yui_3_17_2_1_1509984706599_152', "[data-item-id='59f716b424a694055a7c20c0'", window['kopa_tally'].sofa);
            } else if( window['kopa_tally'].sofa > 1 ){
                setTimeout(addToCart, 300, 'yui_3_17_2_1_1509984706599_152', "[data-item-id='59f716b424a694055a7c20c0'", window['kopa_tally'].sofa);
            }

           // function linkToCart(){
           //     const anchor = document.createElement('a');
           //     anchor.setAttribute('href','/cart');
           //     document.body.appendChild(anchor);
           //     anchor.click();
           // }
           //
           //  setTimeout(linkToCart, 4000);

        });
        document.getElementById('webgl_control_zoomIn').addEventListener('click', () => {
            console.log(kopaViewer.scene.camera.position, ZOOMFACTOR);
            kopaViewer.scene.camera.position.set(
                kopaViewer.scene.camera.position.x / ZOOMFACTOR,
                kopaViewer.scene.camera.position.y / ZOOMFACTOR,
                kopaViewer.scene.camera.position.z / ZOOMFACTOR
            )
        });
        document.getElementById('webgl_control_zoomOut').addEventListener('click', () => {
            // kopaViewer.util.control.dollyOut(1.2)
            kopaViewer.scene.camera.position.set(
                kopaViewer.scene.camera.position.x * ZOOMFACTOR,
                kopaViewer.scene.camera.position.y * ZOOMFACTOR,
                kopaViewer.scene.camera.position.z * ZOOMFACTOR
            )
        });
        window['kopaViewer'] = kopaViewer
    }
});
