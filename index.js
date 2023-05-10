(function() {
  EventTarget.prototype._addEventListener = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function(a,b,c) {
    this._addEventListener(a,b,c);
    if(!this.eventListenerList) this.eventListenerList = {};
    if(!this.eventListenerList[a]) this.eventListenerList[a] = [];
    this.eventListenerList[a].push(b);
  };
})();

document.addEventListener('DOMContentLoaded', function() {
  const display = document.getElementById('display');
  const increaseBtn =  document.getElementById('increase');
  const decreaseBtn =  document.getElementById('decrease');
  const eventTarget = new EventTarget();
  window.eventTarget = eventTarget;
  
  init();

  /**
   * @typedef {CustomEvent<number>} UpdateCounterEvent
   */

  increaseBtn.addEventListener('click', function() {
    const count = +localStorage.getItem('counter') || 0;
    localStorage.setItem('counter', count + 1);
  
    const event = new CustomEvent('counterUpdate', { detail : count + 1 });
    eventTarget.dispatchEvent(event);
  });
  
  decreaseBtn.addEventListener('click', function() {
    const count = +localStorage.getItem('counter') || 0;
    localStorage.setItem('counter', count - 1);

    const event = new CustomEvent('counterUpdate', { detail : count - 1 });
    eventTarget.dispatchEvent(event);
  });
  
  
  decreaseBtn.addEventListener('click', function() {
    localStorage.setItem('counter', parseInt(display.innerHTML) - 1);
  });
  
  /**
   * @param {UpdateCounterEvent} e 
   */
  function updateCounterHandler(e){
    display.innerHTML = e.detail
  }

  eventTarget.addEventListener('counterUpdate', updateCounterHandler);

  window.addEventListener('storage', async function(e) {
    if (e.key == 'counter'){
      const event = new CustomEvent('counterUpdate', { detail : e.newValue });
      eventTarget.dispatchEvent(event);
    }
  });

  function init(){
    display.innerHTML = localStorage.getItem('counter') || 0;
  }
  console.log(eventTarget.eventListenerList)
});