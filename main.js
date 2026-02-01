// ---------- GLOBALS ----------
const canvas = document.getElementById('game');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight,0.1,1000);
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(0,3,5);

let gameActive = false;
let keys = {};
let isMouseDown = false;
let previousX;
let ammo = 6, maxAmmo = 6, reloading = false;

// ---------- DOM ELEMENTS ----------
const menuOverlay = document.getElementById('menuOverlay');
const loginBtn = document.getElementById('loginBtn');
const menuButtons = document.getElementById('menuButtons');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const playerInfo = document.getElementById('playerInfo');
const playBtn = document.getElementById('playBtn');

const weaponDisplay = document.getElementById('weaponDisplay');
const ammoDisplay = document.getElementById('ammoDisplay');

const shopBtn = document.getElementById('shopBtn');
const shopDiv = document.getElementById('shop');
const shopItemsDiv = document.getElementById('shopItems');
const addItemBtn = document.getElementById('addItemBtn');
const newItemInput = document.getElementById('newItemInput');

let playerRank = 'Player';
let shopItems = ['Pistol'];

// ---------- LOGIN ----------
loginBtn.onclick = () => {
  const user = usernameInput.value;
  const pass = passwordInput.value;

  if(user==='SkyPer' && pass==='1618917'){
    playerRank='Owner';
    playerInfo.innerHTML=`<span style="color:red">[Owner]</span> ${user}`;
  } else if(user!=='' && pass!==''){
    playerRank='Player';
    playerInfo.innerHTML=`<span style="color:gray">[Player]</span> ${user}`;
  } else { alert('Enter username and password'); return; }

  usernameInput.style.display='none';
  passwordInput.style.display='none';
  loginBtn.style.display='none';
  menuButtons.style.display='flex';
};

// ---------- SHOP ----------
function updateShop(){
  shopItemsDiv.innerHTML='';
  shopItems.forEach(item=>{
    const div=document.createElement('div');
    div.textContent=item;
    shopItemsDiv.appendChild(div);
  });
  addItemBtn.style.display=(playerRank==='Owner')?'block':'none';
  newItemInput.style.display=(playerRank==='Owner')?'block':'none';
}

shopBtn.onclick=()=>{
  shopDiv.style.display=(shopDiv.style.display==='none')?'block':'none';
  updateShop();
};

addItemBtn.onclick=()=>{
  const newItem=newItemInput.value;
  if(newItem){ shopItems.push(newItem); newItemInput.value=''; updateShop(); }
};

// ---------- SCENE ----------
const light = new THREE.DirectionalLight(0xffffff,1);
light.position.set(5,10,7);
scene.add(light);

// PLAYER CYLINDER
const geometry=new THREE.CylinderGeometry(0.5,0.5,2,32);
const material=new THREE.MeshStandardMaterial({color:0xffffff});
const player=new THREE.Mesh(geometry,material);
scene.add(player);
player.position.y=1;

// RESIZE
window.addEventListener('resize', ()=>{
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect=window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
});

// ---------- INPUT ----------
document.addEventListener('keydown', e=>{
  if(gameActive) keys[e.key.toLowerCase()]=true;
});
document.addEventListener('keyup', e=>{
  if(gameActive) keys[e.key.toLowerCase()]=false;
});

document.addEventListener('mousedown', e=>{
  if(gameActive){ isMouseDown=true; previousX=e.clientX; }
});
document.addEventListener('mouseup', e=>{ if(gameActive) isMouseDown=false; });
document.addEventListener('mousemove', e=>{
  if(gameActive && isMouseDown){
    const deltaX=e.clientX-previousX;
    player.rotation.y+=deltaX*0.01;
    previousX=e.clientX;
  }
});

// CLICK SHOOT
document.addEventListener('click', e=>{
  if(gameActive) shootGun();
});

// ---------- GUN ----------
function shootGun(){
  if(reloading) return;
  if(ammo>0){
    ammo--;
    ammoDisplay.textContent=`Ammo: ${ammo} / ${maxAmmo}`;
    const flash=document.createElement('div');
    flash.classList.add('flash');
    document.body.appendChild(flash);
    setTimeout(()=>document.body.removeChild(flash),100);
  } else reloadGun();
}

function reloadGun(){
  reloading=true;
  ammoDisplay.textContent='Reloading...';
  let rotation=0;
  const reloadInterval=setInterval(()=>{
    rotation+=0.1;
    player.rotation.z=rotation;
  },50);
  setTimeout(()=>{
    clearInterval(reloadInterval);
    player.rotation.z=0;
    ammo=maxAmmo;
    ammoDisplay.textContent=`Ammo: ${ammo} / ${maxAmmo}`;
    reloading=false;
  },1500);
}

// ---------- PLAY BUTTON ----------
playBtn.onclick = ()=>{
  menuOverlay.style.display='none';
  weaponDisplay.style.display='flex';
  ammoDisplay.style.display='flex';
  gameActive=true;
};

// ---------- GAME LOOP ----------
function animate(){
  requestAnimationFrame(animate);

  if(gameActive){
    if(keys['w']) player.position.z-=0.1;
    if(keys['s']) player.position.z+=0.1;
    if(keys['a']) player.position.x-=0.1;
    if(keys['d']) player.position.x+=0.1;
  }

  renderer.render(scene,camera);
}
animate();
