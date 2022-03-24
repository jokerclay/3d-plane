/*
    导入 threeJS, dat gui, OrbitControls 
 */ 

import * as THREE from '../node_modules/three/build/three.module.js';                                       // ThreeJS
import * as dat from '../node_modules/dat.gui/build/dat.gui.module.js'                                      // GUI 开发时容易控制状态
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js'
import gsap from '../node_modules/gsap/src/gsap-core.js'                                                    // gasp 动画库

/*
    生成 场景 相机 转换器 GUI 
 */ 
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
const renderer = new THREE.WebGL1Renderer();
const raycaster = new THREE.Raycaster()
const gui = new dat.GUI();

/*
   自定义世界对象, 里面有块板 
 */ 
const world = {
    plane: {
        width: 20,
        hight: 32,
        widthSegments: 30,
        hightSegments: 39,
    }
}

/*
   将 板子 画出来 
 */ 
function generatePlane() {
    planeMesh.geometry.dispose();
    planeMesh.geometry = new THREE.PlaneGeometry(world.plane.width, world.plane.hight, world.plane.widthSegments, world.plane.hightSegments)
    const { array } = planeMesh.geometry.attributes.position;
    for (let i = 0; i < array.length; i += 3) {
        const x = array[i]
        const y = array[i + 1]
        const z = array[i + 2]
        array[i] = x + (Math.random() - 0.5)
        array[i + 1] = y + (Math.random() - 0.5)
        array[i + 2] = z + Math.random()

    }
    const colors = []
    for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
        colors.push(0, 0.19, 0.4)
    }
    planeMesh.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3))
}


/*
   设置控制 GUI
 */ 
gui.add(world.plane, 'width', 1, 100).onChange(generatePlane)
gui.add(world.plane, 'hight', 1, 100).onChange(generatePlane)
gui.add(world.plane, 'widthSegments', 1, 100).onChange(generatePlane)
gui.add(world.plane, 'hightSegments', 1, 100).onChange(generatePlane)

/*
   设置render
 */ 
renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(devicePixelRatio)
document.body.appendChild(renderer.domElement)

/*
   节点
 */ 
const planeGeometry = new THREE.PlaneGeometry(world.plane.width, world.plane.hight, world.plane.widthSegments, world.plane.hightSegments)
const material = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
    flatShading: THREE.FlatShading,
    vertexColors: true
})


/*
   将节点和材料揉和到一起
 */ 
const planeMesh = new THREE.Mesh(planeGeometry, material)
planeMesh.geometry.dispose();
const colors = []
for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
    colors.push(0, 0.19, 0.4)
}
planeMesh.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3))

/*
   添加到场景
 */ 
scene.add(planeMesh)

/*
   物体变形
 */ 
const { array } = planeMesh.geometry.attributes.position;
for (let i = 0; i < array.length; i += 3) {
    const x = array[i]
    const y = array[i + 1]
    const z = array[i + 2]
    array[i + 2] = z + Math.random()
}

/*
   设置相机位置(相机默认在中心点)
 */ 
camera.position.z = 11


/*
   orbit control
 */ 
new OrbitControls(camera, renderer.domElement)
renderer.render(scene, camera)
const light = new THREE.DirectionalLight(0xffffff, 2)
light.position.set(0, 0, 1);
scene.add(light)
const backLight = new THREE.DirectionalLight(0xffffff, 1)
backLight.position.set(0, 0, -1);
scene.add(backLight)



/*
   鼠标
 */ 
const mouse = {
    x: undefined,
    y: undefined
}

// 自定义动画函数（动画逻辑）
function animation() {
    renderer.render(scene, camera)
    window.requestAnimationFrame(animation)
    planeMesh.rotation.y += 0
        // 用来跟踪 鼠标是否 在物体上
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObject(planeMesh)
    if (intersects.length > 0) {
        const { color } = intersects[0].object.geometry.attributes
            // vertice 1
        color.setX(intersects[0].face.a, 0.1)
        color.setY(intersects[0].face.a, 0.5)
        color.setZ(intersects[0].face.a, 1)
            // vertice 2
        color.setX(intersects[0].face.b, 0.1)
        color.setY(intersects[0].face.b, 0.5)
        color.setZ(intersects[0].face.b, 1)
            // vertice 3
        color.setX(intersects[0].face.c, 0.1)
        color.setY(intersects[0].face.c, 0.5)
        color.setZ(intersects[0].face.c, 1)

        color.needsUpdate = true;

        const initialColor = {
            r: 0,
            g: 0.19,
            b: 0.4
        }
        const hoverColor = {
            r: 0.1,
            g: 0.5,
            b: 1
        }
        gsap.to(hoverColor, {
            r: initialColor.r,
            g: initialColor.g,
            b: initialColor.b,
            onUpdate: () => {
                    // vertice 1
                color.setX(intersects[0].face.a, hoverColor.r)
                color.setY(intersects[0].face.a, hoverColor.g)
                color.setZ(intersects[0].face.a, hoverColor.b)
                    // vertice 2                
                color.setX(intersects[0].face.b, hoverColor.r)
                color.setY(intersects[0].face.b, hoverColor.g)
                color.setZ(intersects[0].face.b, hoverColor.b)
                    // vertice 3                
                color.setX(intersects[0].face.c, hoverColor.r)
                color.setY(intersects[0].face.c, hoverColor.g)
                color.setZ(intersects[0].face.c, hoverColor.b)

                color.needsUpdate = true;
            }
        })

    }
}
// 调用动画
animation();

// 每当移动鼠标事件发生时，event 作为一个 对象返回，进而得到 x, y
addEventListener('mousemove', (event) => {
    // console.log(event.clientX + "," + event.clientY)
    mouse.x = (event.clientX / innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / innerHeight) * 2 + 1;
})


gui.add(world.plane, 'hight', 1, 20).onChange(() => {
    planeMesh.geometry.dispose();
    planeMesh.geometry = new THREE.PlaneGeometry(world.plane.width, world.plane.hight, 10, 10)
    const { array } = planeMesh.geometry.attributes.position;
    for (let i = 0; i < array.length; i += 3) {
        const x = array[i]
        const y = array[i + 1]
        const z = array[i + 2]
            // array[i] = x + 3
        array[i + 2] = z + Math.random()

    }

})