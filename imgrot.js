//three.js設定
// シーン
var scene = new THREE.Scene();
// レンダラー
var renderer = new THREE.WebGLRenderer({alpha:true, antialias: true });
renderer.setClearColor(0x0000ff,1);
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
// カメラ
var camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 3500 );
camera.position.set(0, 0, 1000);
const controls = new THREE.OrbitControls(camera, document.body);
controls.autoRotate = true;
controls.autoRotateSpeed = -15.0;
// 初期化のために実行
onResize();
// リサイズイベント発生時に実行
window.addEventListener('resize', onResize);
// ライト
var light = new THREE.AmbientLight( 0xffffff );
scene.add( light );
// Points生成
//var pointsGeometry;
var pointsMaterial = new THREE.PointsMaterial({
  color: 0xFF00FF,
  size: 4,
});

//画像読み込み
var cv = document.createElement('canvas');
var ctx = cv.getContext('2d');
var pixelData;
var imageWidth; var imageHeight;
var pointsGeometry;
var pointsMesh;
//const indicies = [];
//const uvs = [];
const image = new Image();
image.src = '5000.png';
image.onload = () => {
    drawParticle();
}

function drawParticle() {
    var points = [];
    ctx.clearRect(0, 0, cv.width, cv.height);
    imageWidth = image.width; imageHeight = image.height;
    cv.width = imageWidth; cv.height = imageHeight;
    ctx.drawImage(image, 0, 0);
    var pixelData = ctx.getImageData(0, 0, imageWidth, imageHeight).data;
    var xOffset = imageWidth / 2;
    var yOffset = imageHeight /3;
    //console.log(pixelData);
    //console.log(pixelData.length);

    for(var x = 0; x < imageWidth; x++) {
        for(var y = 0; y < imageHeight; y++) {
            if (pixelData[(x + y * imageWidth) * 4 + 3] === 0) {
                continue;
            }
            points.push(new THREE.Vector3(x - xOffset, -y + yOffset, 1));
        }
    }

    pointsGeometry = new THREE.BufferGeometry().setFromPoints(points);
    pointsMesh = new THREE.Points(pointsGeometry, pointsMaterial);
    scene.add(pointsMesh);
}

// レンダリング
function render() {
    requestAnimationFrame(render);
    controls.update();

    const time = Date.now() / 400;
    //const h = 170 + Math.sin(time) * 170;
    const h = time * 100;
    const s = 100;
    const l = 50;
    const color = new THREE.Color(`hsl(${h},${s}%,${l}%)`);
    pointsMaterial.color = color;
    //pointsMesh.rotation.y -= 0.03;

    renderer.render(scene, camera);
}
render();

//ドラドロ
var cve = document.getElementsByTagName('canvas')[0];
cve.addEventListener('dragover', function(evt){
    evt.preventDefault();
    cve.classList.add('dragover');
});
cve.addEventListener('dragleave', function(evt){
    evt.preventDefault();
    cve.classList.remove('dragover');
});
cve.addEventListener('drop', function(evt){
    evt.preventDefault();
    cve.classList.remove('dragenter');
    var files = evt.dataTransfer.files;
    console.log("DRAG & DROP");
    console.table(files);
    loadPngImage('onChenge',files[0]);
});

function loadPngImage(event, f){
  var fileData = f;
  // 画像ファイル以外は処理を止める
  if(!fileData.type.match('image.*')) {
    alert('画像を選択してください');
    return;
  }
  // FileReaderオブジェクトを使ってファイル読み込み
  var reader = new FileReader();
  reader.onload = function() {
    removeMesh();
    image.src = reader.result;
  }
  reader.readAsDataURL(fileData);
}

function removeMesh(){
    scene.remove(pointsMesh);
    pointsGeometry.dispose();
}

//リサイズ
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