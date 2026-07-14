(function(){
  var parts = ['nav','hero','about','experience','projects','skills','education','contact'];

  function loadPartial(name){
    var el = document.querySelector('[data-partial="'+name+'"]');
    if(!el) return Promise.resolve();
    return fetch('partials/' + name + '.html').then(function(res){
      if(!res.ok) throw new Error('Failed to load ' + name);
      return res.text();
    }).then(function(html){
      el.innerHTML = html;
    });
  }

  Promise.all(parts.map(loadPartial)).then(function(){
    var three = document.createElement('script');
    three.src = 'https://unpkg.com/three@0.128.0/build/three.min.js';
    three.onload = function(){
      var main = document.createElement('script');
      main.src = 'js/main.js';
      document.body.appendChild(main);
    };
    document.body.appendChild(three);
  }).catch(function(err){
    console.error('Error loading partials', err);
  });
})();
