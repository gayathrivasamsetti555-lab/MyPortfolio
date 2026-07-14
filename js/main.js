(function(){
  var canvas = document.getElementById('hero-canvas');
  if(!window.THREE || !canvas){ return; }
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){ return; }

  var scene = new THREE.Scene();
  var hero = document.querySelector('.hero');
  var w = hero.clientWidth, h = hero.clientHeight;
  var camera = new THREE.PerspectiveCamera(55, w/h, 0.1, 1000);
  camera.position.z = 34;

  var renderer = new THREE.WebGLRenderer({canvas:canvas, antialias:true, alpha:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  renderer.setSize(w,h);

  // Labels representing the AI/dev stack — this is an embedding-space metaphor,
  // not decoration: nodes are the actual technologies, edges show relationships.
  var labels = ["Claude","Gemini","RAG","LangChain","React","Python",".NET","Angular",
                "Prompt Eng.","Vector DB","MCP","Agents","FastAPI","Azure","AWS","LLM"];

  function makeLabelSprite(text, isCore){
    var cvs = document.createElement('canvas');
    var size = 256;
    cvs.width = size; cvs.height = size;
    var ctx = cvs.getContext('2d');
    ctx.font = (isCore ? '600 ' : '500 ') + '40px Space Grotesk, sans-serif';
    ctx.fillStyle = isCore ? '#f2a65a' : '#5eead4';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.globalAlpha = isCore ? 1 : 0.85;
    ctx.fillText(text, size/2, size/2);
    var tex = new THREE.CanvasTexture(cvs);
    var mat = new THREE.SpriteMaterial({map:tex, transparent:true, depthWrite:false});
    var sprite = new THREE.Sprite(mat);
    var scale = isCore ? 7.5 : 5.5;
    sprite.scale.set(scale, scale/2, 1);
    return sprite;
  }

  var group = new THREE.Group();
  var nodes = [];
  var radius = 16;

  labels.forEach(function(label, i){
    var phi = Math.acos(-1 + (2*i)/labels.length);
    var theta = Math.sqrt(labels.length*Math.PI) * phi;
    var x = radius*Math.cos(theta)*Math.sin(phi);
    var y = radius*Math.sin(theta)*Math.sin(phi);
    var z = radius*Math.cos(phi);
    var isCore = (label==="Claude"||label==="Gemini"||label==="RAG");
    var sprite = makeLabelSprite(label, isCore);
    sprite.position.set(x,y,z);
    group.add(sprite);
    nodes.push({sprite:sprite, base:new THREE.Vector3(x,y,z), phase:Math.random()*Math.PI*2});
  });

  // connective edges between nearby nodes (embedding-space similarity metaphor)
  var lineMat = new THREE.LineBasicMaterial({color:0x2a3466, transparent:true, opacity:0.5});
  for(var i=0;i<nodes.length;i++){
    for(var j=i+1;j<nodes.length;j++){
      if(nodes[i].base.distanceTo(nodes[j].base) < 17 && Math.random() > 0.55){
        var geom = new THREE.BufferGeometry().setFromPoints([nodes[i].base, nodes[j].base]);
        var line = new THREE.Line(geom, lineMat);
        line.userData = {a:i, b:j};
        group.add(line);
      }
    }
  }

  scene.add(group);
  group.position.x = 6;

  var mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', function(e){
    mouseX = (e.clientX/window.innerWidth - 0.5);
    mouseY = (e.clientY/window.innerHeight - 0.5);
  });

  var clock = new THREE.Clock();
  function animate(){
    requestAnimationFrame(animate);
    var t = clock.getElapsedTime();
    group.rotation.y = t*0.06 + mouseX*0.4;
    group.rotation.x = mouseY*0.25;

    nodes.forEach(function(n){
      n.sprite.position.y = n.base.y + Math.sin(t*0.6 + n.phase)*0.6;
    });

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', function(){
    var w2 = hero.clientWidth, h2 = hero.clientHeight;
    camera.aspect = w2/h2;
    camera.updateProjectionMatrix();
    renderer.setSize(w2,h2);
  });
})();