// シーン
var scene = new THREE.Scene();
// レンダラー
var renderer = new THREE.WebGLRenderer({alpha:true, antialias: true });
renderer.setClearColor(0x0000ff,1);
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
// カメラ
var camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 2500 );
camera.position.set(0, 0, 1000);
const controls = new THREE.OrbitControls(camera, document.body);
controls.autoRotate = true;
controls.autoRotateSpeed = -20.0;
// 初期化のために実行
onResize();
// リサイズイベント発生時に実行
window.addEventListener('resize', onResize);
// ライト
var light = new THREE.AmbientLight( 0xffffff );
scene.add( light );
// Points生成
var pointsGeometry;
var pointsMaterial = new THREE.PointsMaterial({
  color: 0xFF00FF,
  size: 5,
});

//画像読み込み
var cv = document.createElement('canvas');
var ctx = cv.getContext('2d');
var pixelData;
var imageWidth; var imageHeight;
const points = [];
const indicies = [];
const uvs = [];
const image = new Image();
image.src = '5000.png';

image.onload = () => {
    drawParticle();
}

function drawParticle() {
    imageWidth = image.width; imageHeight = image.height;
    cv.width = imageWidth;
    cv.height = imageHeight;
    ctx.drawImage(image, 0, 0);
    var pixelData = ctx.getImageData(0, 0, imageWidth, imageHeight).data;
    var xOffset = imageWidth / 2;
    console.log(pixelData);
    console.log(pixelData.length);

    for(var x = 0; x < imageWidth; x++) {
        for(var y = 0; y < imageHeight; y++) {
            if (pixelData[(x + y * imageWidth) * 4 + 3] === 0) {
                continue;
            }
            points.push(new THREE.Vector3(x - xOffset, -y, 1));
        }
    }

    pointsGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const pointsMesh = new THREE.Points(pointsGeometry, pointsMaterial);
    scene.add(pointsMesh);
}

// レンダリング
function render() {
    requestAnimationFrame(render);
    controls.update();
    renderer.render(scene, camera);
}
render();

function onResize() {
    // サイズを取得
    const width = window.innerWidth;
    const height = window.innerHeight;
  
    // レンダラーのサイズを調整する
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
  
    // カメラのアスペクト比を正す
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}