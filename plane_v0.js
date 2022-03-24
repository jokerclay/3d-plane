// ======================= Template ===================================
// // 导入 threeJS
// import * as THREE from '../node_modules/three/build/three.module.js'
// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(75,innerWidth / innerHeight, 0.1, 1000);
// const renderer = new THREE.WebGL1Renderer();
// console.log(scene)
// console.log(camera)
// console.log(renderer)

// // 设置render
// renderer.setSize(innerWidth,innerHeight)
// renderer.setPixelRatio(devicePixelRatio)
// document.body.appendChild(renderer.domElement)

// // 节点
//  const planeGeometry = new THREE.PlaneGeometry(5,5,10,10)
// //  材料
// const material =new THREE.MeshBasicMaterial({color:0xfffff6})

// // mash
// const mesh = new THREE.Mesh(planeGeometry,material)

// // 添加到场景
// scene.add(mesh)

// // 设置相机位置(相机默认在中心点)
// camera.position.z= 5

// // render 相机和场景
// renderer.render(scene,camera)

// // 自定义动画函数（动画逻辑）
// function animation(){
//     mesh.rotation.x +=0.005
//     mesh.rotation.y +=0.005
//     renderer.render(scene,camera)
//     window.requestAnimationFrame(animation )
// }
// // 调用动画
// animation();
// =======================================================================


// 导入 threeJS
import * as THREE from '../node_modules/three/build/three.module.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
const renderer = new THREE.WebGL1Renderer();
console.log(scene)
console.log(camera)
console.log(renderer)

// 导入 dat gui
import * as dat from '../node_modules/dat.gui/build/dat.gui.module.js'
console.log(dat)

// 导入 orbit control， orbit control 不在默认的 three.js 中
// 不知道为什么下面这行代码为什么不能用
// import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js'
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js'
// console.log(OrbitContorl) 
// const OrbitContorl = new
console.log(OrbitControls)

// 导入 raycaster
const raycaster = new THREE.Raycaster()
console.log(raycaster)

// 导入 gsap
import gsap from '../node_modules/gsap/src/gsap-core.js'
console.log(gsap)

// / 继承 GUI 
const gui = new dat.GUI();

// gui.add 函数的第一个参数是一个 对象，所以在使用前先创建一个对象
// 创建一个 world 对象，该对象的第一个元素是 plane , 属性 width 初始值为 10
const world = {
    plane: {
        width: 20,
        hight: 32,
        widthSegments: 30,
        hightSegments: 39,
    }
}

// 将 plane 优化为 一个函数 change the shape
function generatePlane() {
    planeMesh.geometry.dispose();
    planeMesh.geometry = new THREE.PlaneGeometry(world.plane.width, world.plane.hight, world.plane.widthSegments, world.plane.hightSegments)
    const { array } = planeMesh.geometry.attributes.position;
    for (let i = 0; i < array.length; i += 3) {
        const x = array[i]
        const y = array[i + 1]
        const z = array[i + 2]
            // array[i] = x + 3
        array[i] = x + (Math.random() - 0.5)
        array[i + 1] = y + (Math.random() - 0.5)
        array[i + 2] = z + Math.random()

    }

    // change color
    // function changeColor() {
    console.log(planeMesh.geometry.attributes)

    const colors = []
    for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
        // console.log(index)
        colors.push(0, 0.19, 0.4)
            // colors.push(world.plane.red, world.plane.green, world.plane.blue)

    }
    //  给 geometry 添加一个新属性  setAttribute(【属性名】，【要创建的属性的种类，数据类型】,【group number】)
    //  group nunber 意思是，多少个数组元素为 一组， 这里 三个元素为一组， threejs 中 用 0~1 表示颜色 
    planeMesh.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3))

    // }

}


// dat.gui.add(world.plane,'属性',最小值 ,最大值)
gui.add(world.plane, 'width', 1, 100).onChange(generatePlane)
gui.add(world.plane, 'hight', 1, 100).onChange(generatePlane)
gui.add(world.plane, 'widthSegments', 1, 100).onChange(generatePlane)
gui.add(world.plane, 'hightSegments', 1, 100).onChange(generatePlane)
    // gui.add(world.plane, 'red', 0, 1).onChange(changeColor)
    // gui.add(world.plane, 'green', 0, 1).onChange(changeColor)
    // gui.add(world.plane, 'blue', 0, 1).onChange(changeColor)


// 设置render
renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(devicePixelRatio)
document.body.appendChild(renderer.domElement)

// 节点
const planeGeometry = new THREE.PlaneGeometry(world.plane.width, world.plane.hight, world.plane.widthSegments, world.plane.hightSegments)
    //  材料
    // MeshPhongMaterial 这种材料要看到需要有光
const material = new THREE.MeshPhongMaterial({

    side: THREE.DoubleSide,
    flatShading: THREE.FlatShading,
    vertexColors: true
})

// mash
const planeMesh = new THREE.Mesh(planeGeometry, material)

// ========================== 第一次 加载 plane 給 plane 上色=============================
planeMesh.geometry.dispose();
console.log(planeMesh.geometry.attributes)

const colors = []
for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
    // console.log(index)
    colors.push(0, 0.19, 0.4)
        // colors.push(world.plane.red, world.plane.green, world.plane.blue)

}
//  给 geometry 添加一个新属性  setAttribute(【属性名】，【要创建的属性的种类，数据类型】,【group number】)
//  group nunber 意思是，多少个数组元素为 一组， 这里 三个元素为一组， threejs 中 用 0~1 表示颜色 
planeMesh.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3))

// }






// 添加到场景
scene.add(planeMesh)

console.log(planeMesh.geometry.attributes.position.array)
    // object destructring
    //  物体变形
const { array } = planeMesh.geometry.attributes.position;
for (let i = 0; i < array.length; i += 3) {
    const x = array[i]
    const y = array[i + 1]
    const z = array[i + 2]
        // array[i] = x + 3
    array[i + 2] = z + Math.random()

}

// 设置相机位置(相机默认在中心点)
camera.position.z = 11

// orbit control
new OrbitControls(camera, renderer.domElement)
    //  旋转 物体，看不到背面，因为后面没有设置 光源

// render 相机和场景
renderer.render(scene, camera)

// 光 两个参数 【光的颜色】 【光的强度】
const light = new THREE.DirectionalLight(0xffffff, 2)
    // 设置光的位置才能看得到
light.position.set(0, 0, 1);
scene.add(light)

const backLight = new THREE.DirectionalLight(0xffffff, 1)
    // 设置光的位置才能看得到
backLight.position.set(0, 0, -1);
scene.add(backLight)


const mouse = {
    x: undefined,
    y: undefined
}

// 自定义动画函数（动画逻辑）
function animation() {
    renderer.render(scene, camera)
    window.requestAnimationFrame(animation)
    planeMesh.rotation.y += 0.01
        // 用来跟踪 鼠标是否 在物体上
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObject(planeMesh)
        // console.log(intersects)
    if (intersects.length > 0) {
        // console.log('instersecting.........')
        // 鼠标悬浮到时 静止
        // planeMesh.rotation.y -= 0.01

        console.log(intersects[0].object.geometry.attributes.color)

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
                console.log(hoverColor)
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
    console.log(mouse)
    console.log("move")
})































gui.add(world.plane, 'hight', 1, 20).onChange(() => {
    //    console.log(planeMesh.geometry) 
    // console.log(world.plane.width)

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