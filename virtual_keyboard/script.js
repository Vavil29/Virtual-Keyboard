const Keyboard = {
    elements: {
      main: null,
      keysContainer: null,
      keys: [],
      audio: [],
      textarea: null,
      recognition: null
    },
  
    eventHandlers: {
      oninput: null,
      onclose: null
    },
  
    properties: {
      value: "",
      point: 0,
      capsLock: false,
      shift: false,
      lang: "EN",
      sound: false,
      speech: false
    },
  
    keyLayoutEN: [
      "caps", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
      "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]",
      "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "enter",
      "Shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "arrow_left", "arrow_right",
      "done", "sound", "space", "mic", "EN"
    ],
  
    keyLayoutRU: [
      "caps", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
      "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ",
      "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "enter",
      "Shift", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", "arrow_left", "arrow_right",
      "done", "sound", "space", "mic", "RU"
    ],
  
    keyShiftEN: [
      "caps", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "backspace",
      "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "{", "}",
      "a", "s", "d", "f", "g", "h", "j", "k", "l", ":", '"', "enter",
      "Shift", "z", "x", "c", "v", "b", "n", "m", "<", ">", "arrow_left", "arrow_right",
      "done", "sound", "space", "mic", "EN"
    ],
  
    keyShiftRU: [
      "caps", "!", '"', "№", ";", "%", ":", "?", "*", "(", ")", "backspace",
      "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ",
      "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "enter",
      "Shift", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", "arrow_left", "arrow_right",
      "done", "sound", "space", "mic", "RU"
    ],
  
  
  
    init() {
      // Create main elements
      this.elements.main = document.createElement("div");
      this.elements.keysContainer = document.createElement("div");
  
      // Setup main elements
      this.elements.main.classList.add("keyboard", "keyboard--hidden");
      this.elements.keysContainer.classList.add("keyboard__keys");
      this.elements.keysContainer.appendChild(this._createKeys());
  
      this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");
  
  
  
      // Add to DOM
      this.elements.main.appendChild(this.elements.keysContainer);
      document.body.appendChild(this.elements.main);
  
      // Automatically use keyboard for elements with .use-keyboard-input
      this.elements.textarea = document.querySelector('.use-keyboard-input');
      this.elements.textarea.addEventListener('focus', () => {
        this.open(this.elements.textarea.value, currentValue => {
          this.elements.textarea.value = currentValue;
        })
      });
  
      // Add focus on textarea
      this.elements.main.addEventListener('click', () => {
        //document.querySelector('.use-keyboard-input').focus();
        this.elements.textarea.selectionStart = this.properties.point;
        this.elements.textarea.selectionEnd = this.properties.point;
        this.elements.textarea.focus();
      });
  
      // Event keyDown
      this.elements.textarea.addEventListener('keydown', (event) => {
        //console.log(event.code);
        this._keyDown(event);
      });
  
      // Event keyUP
      this.elements.textarea.addEventListener('keyup', (event) => {
        this._keyUp(event);
      });
  
      // Audio element
      this.elements.audio = document.querySelectorAll('audio');
  
      // SpeechRecognition
      window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.elements.recognition = new SpeechRecognition();
      this.elements.recognition.interimResults = true;
  
      this.elements.recognition.addEventListener('result', e => {
        const transcript = Array.from(e.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
  
        if (e.results[0].isFinal) {
          this._writeSpeech(transcript);
        }
      });
  
  
      // Open start keyboard
      this.open();
      this.elements.textarea.focus();
      //console.log(this.elements.audio);
  
    },
  
    _createKeys() {
      const fragment = document.createDocumentFragment();
  
      // Creates HTML for an icon
      const createIconHTML = (icon_name) => {
        return `<i class="material-icons">${icon_name}</i>`;
      };
  
      this.keyLayoutEN.forEach(key => {
        const keyElement = document.createElement("button");
        const insertLineBreak = ["backspace", "]", "enter", "arrow_right"].indexOf(key) !== -1;
  
        // Add attributes/classes
        keyElement.setAttribute("type", "button");
        keyElement.classList.add("keyboard__key");
  
        switch (key) {
  
          case "mic":
            keyElement.innerHTML = createIconHTML("mic");
            keyElement.classList.add("keyboard__key--activatable");
  
            keyElement.addEventListener('click', () => {
              keyElement.classList.toggle("keyboard__key--active");
              this._toggleSpeech();
  
              if (this.properties.lang === "EN") {
                this._playSound(8);
              } else if (this.properties.lang === "RU") {
                this._playSound(7);
              }
            })
  
  
            break;
  
          case "sound":
            keyElement.innerHTML = createIconHTML("volume_up");
            keyElement.classList.add("keyboard__key--activatable");
  
            keyElement.addEventListener('click', () => {
              keyElement.classList.toggle("keyboard__key--active");
              this._toggleSound();
  
              if (this.properties.lang === "EN") {
                this._playSound(8);
              } else if (this.properties.lang === "RU") {
                this._playSound(7);
              }
            });
  
            break;
  
          case "arrow_left":
            keyElement.innerHTML = createIconHTML("arrow_left");
            keyElement.addEventListener('click', () => {
              if (this.elements.textarea.selectionStart !== 0) {
                this.properties.point = this.elements.textarea.selectionStart - 1;
              }
              if (this.properties.lang === "EN") {
                this._playSound(8);
              } else if (this.properties.lang === "RU") {
                this._playSound(7);
              }
            });
  
            break;
  
          case "arrow_right":
            keyElement.innerHTML = createIconHTML("arrow_right");
            keyElement.addEventListener('click', () => {
              this.properties.point = this.elements.textarea.selectionStart + 1;
              if (this.properties.lang === "EN") {
                this._playSound(8);
              } else if (this.properties.lang === "RU") {
                this._playSound(7);
              }
            });
  
            break;
  
          case "backspace":
            keyElement.classList.add("keyboard__key--wide");
            keyElement.innerHTML = createIconHTML("backspace");
  
            keyElement.addEventListener("click", () => {
              if (this.elements.textarea.selectionStart !== this.elements.textarea.selectionEnd) {
                if (this.elements.textarea.selectionStart === 0) {
                  this.properties.value = this.elements.textarea.value.substring(this.elements.textarea.selectionEnd);
                } else {
                  this.properties.value = this.elements.textarea.value.substring(0, this.elements.textarea.selectionStart) + this.elements.textarea.value.substring(this.elements.textarea.selectionEnd);
                }
                this.properties.point = this.elements.textarea.selectionStart;
              } else {
                if (this.elements.textarea.selectionStart !== 0) {
                  this.properties.value = this.elements.textarea.value.substring(0, this.elements.textarea.selectionStart - 1) + this.elements.textarea.value.substring(this.elements.textarea.selectionStart);
                  this.properties.point = this.elements.textarea.selectionStart - 1;
                }
              }
  
              this._triggerEvent("oninput");
              this._playSound(6);
            });
  
            break;
  
          case "caps":
            keyElement.classList.add("keyboard__key--activatable");
            keyElement.innerHTML = createIconHTML("keyboard_capslock");
  
            keyElement.addEventListener("click", () => {
              this._toggleCapsLock();
              keyElement.classList.toggle("keyboard__key--active");
              this._playSound(0);
            });
  
            break;
  
          case "Shift":
            keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
            keyElement.textContent = key;
  
            keyElement.addEventListener("click", () => {
              this._toggleShift();
              keyElement.classList.toggle("keyboard__key--active");
              this._playSound(5);
            });
            break;
  
          case "enter":
            keyElement.classList.add("keyboard__key--wide");
            keyElement.innerHTML = createIconHTML("keyboard_return");
  
            keyElement.addEventListener("click", () => {
              this.properties.value = this.elements.textarea.value.substring(0, this.elements.textarea.selectionStart) + "\n" + this.elements.textarea.value.substring(this.elements.textarea.selectionStart);
              this.properties.point = this.elements.textarea.selectionStart + 1;
              this._triggerEvent("oninput");
              this._playSound(4);
            });
  
            break;
  
          case "space":
            keyElement.classList.add("keyboard__key--extra-wide");
            keyElement.innerHTML = createIconHTML("space_bar");
  
            keyElement.addEventListener("click", () => {
              this.properties.value = this.elements.textarea.value.substring(0, this.elements.textarea.selectionStart) + " " + this.elements.textarea.value.substring(this.elements.textarea.selectionStart);
              this.properties.point = this.elements.textarea.selectionStart + 1;
              this._triggerEvent("oninput");
              this._playSound(3);
            });
  
            break;
  
          case "done":
            keyElement.classList.add("keyboard__key--dark");
            keyElement.innerHTML = createIconHTML("check_circle");
  
            keyElement.addEventListener("click", (e) => {
              this.close();
              this._triggerEvent("onclose");
              e.stopPropagation();
            });
  
            break;
  
          case "EN":
            keyElement.textContent = key;
            keyElement.addEventListener('click', (e) => {
              this._toggleLang();
              e.target.textContent = this.properties.lang;
              if (this.properties.lang === "EN") {
                this._playSound(8);
              } else if (this.properties.lang === "RU") {
                this._playSound(7);
              }
            });
  
            break;
  
          default:
            keyElement.textContent = key.toLowerCase();
  
            keyElement.addEventListener("click", (e) => {
              this.properties.value = this.elements.textarea.value.substring(0, this.elements.textarea.selectionStart) + (this.properties.capsLock ? e.target.textContent.toUpperCase() : e.target.textContent.toLowerCase()) + this.elements.textarea.value.substring(this.elements.textarea.selectionStart);
              this.properties.point = this.elements.textarea.selectionStart + 1;
              this._triggerEvent("oninput");
              if (this.properties.lang === "EN") {
                this._playSound(8);
              } else if (this.properties.lang === "RU") {
                this._playSound(7);
              }
            });
            
  
            break;
        }
  
        fragment.appendChild(keyElement);
  
        if (insertLineBreak) {
          fragment.appendChild(document.createElement("br"));
        }
      });
  
      return fragment;
    },
  
    _triggerEvent(handlerName) {
      if (typeof this.eventHandlers[handlerName] == "function") {
        this.eventHandlers[handlerName](this.properties.value);
      }
    },
  
    _toggleCapsLock() {
      this.properties.capsLock = !this.properties.capsLock;
  
      for (const key of this.elements.keys) {
        if (key.childElementCount === 0 && key.textContent !== "EN" && key.textContent !== "Shift" && key.textContent !== "RU") {
          key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
        }
      }
    },
  
    _toggleShift() {
      this.properties.shift = !this.properties.shift;
      if (this.properties.lang === "EN") {
  
        if (this.properties.shift) {
          for (let i = 0; i < this.elements.keys.length; i++) {
            if (this.elements.keys[i].childElementCount === 0 && this.elements.keys[i].textContent !== this.keyShiftEN[i]) {
              this.elements.keys[i].textContent = this.keyShiftEN[i];
            }
          }
        } else {
          for (let i = 0; i < this.elements.keys.length; i++) {
            if (this.elements.keys[i].childElementCount === 0 && this.elements.keys[i].textContent == this.keyShiftEN[i]) {
              this.elements.keys[i].textContent = this.keyLayoutEN[i];
            }
          }
        }
      } else if (this.properties.lang === "RU") {
        if (this.properties.shift) {
          for (let i = 0; i < this.elements.keys.length; i++) {
            if (this.elements.keys[i].childElementCount === 0 && this.elements.keys[i].textContent !== this.keyShiftRU[i]) {
              this.elements.keys[i].textContent = this.keyShiftRU[i];
            }
          }
        } else {
          for (let i = 0; i < this.elements.keys.length; i++) {
            if (this.elements.keys[i].childElementCount === 0 && this.elements.keys[i].textContent == this.keyShiftRU[i]) {
              this.elements.keys[i].textContent = this.keyLayoutRU[i];
            }
          }
        }
      }
  
      this._toggleCapsLock();
    },
  
    _toggleLang() {
      if (this.properties.lang === "EN") {
        this.properties.lang = "RU";
        this.elements.recognition.lang = 'ru-RU';
      } else {
        this.properties.lang = "EN";
        this.elements.recognition.lang = 'en-US';
      }
  
      if (this.properties.lang === "RU") {
        for (let i = 0; i < this.elements.keys.length; i++) {
          if (this.elements.keys[i].childElementCount === 0) {
            this.elements.keys[i].textContent = this.keyLayoutRU[i];
          }
        }
      } else {
        for (let i = 0; i < this.elements.keys.length; i++) {
          if (this.elements.keys[i].childElementCount === 0) {
            this.elements.keys[i].textContent = this.keyLayoutEN[i];
          }
        }
      }
  
      // if capsLock = true
      if (this.properties.capsLock) {
        this.properties.capsLock = !this.properties.capsLock;
        this._toggleCapsLock();
      }
  
      // if shift = true
      if (this.properties.shift) {
        if (this.properties.lang === "EN") {
          if (this.properties.shift) {
            for (let i = 0; i < this.elements.keys.length; i++) {
              if (this.elements.keys[i].childElementCount === 0 && this.elements.keys[i].textContent !== this.keyShiftEN[i]) {
                this.elements.keys[i].textContent = this.keyShiftEN[i];
              }
            }
          }
        } else if (this.properties.lang === "RU") {
          if (this.properties.shift) {
            for (let i = 0; i < this.elements.keys.length; i++) {
              if (this.elements.keys[i].childElementCount === 0 && this.elements.keys[i].textContent !== this.keyShiftRU[i]) {
                this.elements.keys[i].textContent = this.keyShiftRU[i];
              }
            }
          }
        }
  
        if (this.properties.capsLock) {
          for (const key of this.elements.keys) {
            if (key.childElementCount === 0 && key.textContent !== "EN" && key.textContent !== "Shift" && key.textContent !== "RU") {
              key.textContent = key.textContent.toUpperCase();
            }
          }
        }
  
  
      }
  
    },
  
    _keyDown(event) {
      if (event.code.includes("Digit")) {
        let key = event.code[5];
        for (i = 0; i <= this.keyLayoutEN.length; i++) {
          if (key === this.keyLayoutEN[i]) {
            this._addClass(i, event);
          }
        }
      } else if (event.code.includes("Key")) {
        let key = event.code[3];
        for (i = 0; i <= this.keyLayoutEN.length; i++) {
          if (key.toLowerCase() === this.keyLayoutEN[i]) {
            this._addClass(i, event);
          }
        }
      } else if (event.code === "Backspace") {
        this._addClass(11, event);
      } else if (event.code === "Space") {
        this._addClass(50, event);
      } else if (event.code === "Enter") {
        this._addClass(35, event);
      } else if (event.code === "CapsLock") {
        this._addClass(0, event);
      } else if (event.code === "ShiftLeft" || event.code === "ShiftRight") {
        this._addClass(36, event);
      } else if (event.code === "ArrowLeft") {
        this._addClass(46, event);
      } else if (event.code === "ArrowRight") {
        this._addClass(47, event);
      } else if (event.code === "BracketLeft") {
        this._addClass(22, event);
      } else if (event.code === "BracketRight") {
        this._addClass(23, event);
      } else if (event.code === "Semicolon") {
        this._addClass(33, event);
      } else if (event.code === "Quote") {
        this._addClass(34, event);
      } else if (event.code === "Comma") {
        this._addClass(44, event);
      } else if (event.code === "Period") {
        this._addClass(45, event);
      }
    },
  
    _keyUp(event) {
      if (event.code.includes("Digit")) {
        let key = event.code[5];
        for (i = 0; i <= this.keyLayoutEN.length; i++) {
          if (key === this.keyLayoutEN[i]) {
            this._removeClass(i, event);
          }
        }
      } else if (event.code.includes("Key")) {
        let key = event.code[3];
        for (i = 0; i <= this.keyLayoutEN.length; i++) {
          if (key.toLowerCase() === this.keyLayoutEN[i]) {
            this._removeClass(i, event);
          }
        }
      } else if (event.code === "Backspace") {
        this._removeClass(11, event);
      } else if (event.code === "Space") {
        this._removeClass(50, event);
      } else if (event.code === "Enter") {
        this._removeClass(35, event);
      } else if (event.code === "CapsLock") {
        this._removeClass(0, event);
      } else if (event.code === "ShiftLeft" || event.code === "ShiftRight") {
        this._removeClass(36, event);
      } else if (event.code === "ArrowLeft") {
        this._removeClass(46, event);
      } else if (event.code === "ArrowRight") {
        this._removeClass(47, event);
      } else if (event.code === "BracketLeft") {
        this._removeClass(22, event);
      } else if (event.code === "BracketRight") {
        this._removeClass(23, event);
      } else if (event.code === "Semicolon") {
        this._removeClass(33, event);
      } else if (event.code === "Quote") {
        this._removeClass(34, event);
      } else if (event.code === "Comma") {
        this._removeClass(44, event);
      } else if (event.code === "Period") {
        this._removeClass(45, event);
      }
    },
  
    _addClass(key, event) {
      this.elements.keys[key].classList.add('active');
      event.stopPropagation();
      event.preventDefault();
    },
  
    _removeClass(key, event) {
      this.elements.keys[key].click();
      this.elements.keys[key].classList.remove('active');
    },
  
    _playSound(index) {
      if (this.properties.sound) {
        this.elements.audio[index].currentTime = 0;
        this.elements.audio[index].play();
      }
    },
  
    _toggleSound() {
      this.properties.sound = !this.properties.sound;
    },
  
    _toggleSpeech() {
      this.properties.speech = !this.properties.speech;
  
      if(this.properties.speech) {
  
        if (this.properties.lang === "EN") {
          this.elements.recognition.lang = 'en-US';
        } else if (this.properties.lang === "RU") {
          this.elements.recognition.lang = 'ru-RU';
        }
  
        this.elements.recognition.start();
        this.elements.recognition.addEventListener('end', this.elements.recognition.start);
      } else {
        this.elements.recognition.removeEventListener('end', this.elements.recognition.start);
        this.elements.recognition.stop();
      }
    },
  
    _writeSpeech(text) {
      text += " ";
      this.properties.value = this.elements.textarea.value.substring(0, this.elements.textarea.selectionStart) + (this.properties.capsLock ? text.toUpperCase() : text.toLowerCase()) + this.elements.textarea.value.substring(this.elements.textarea.selectionStart);
      this.properties.point = this.elements.textarea.selectionStart + text.length;
      this._triggerEvent("oninput");
    },
  
    open(initialValue, oninput, onclose) {
      this.properties.value = initialValue || "";
      this.eventHandlers.oninput = oninput;
      this.eventHandlers.onclose = onclose;
      this.elements.main.classList.remove("keyboard--hidden");
      this.elements.textarea.classList.add('active');
    },
  
    close() {
      this.properties.value = "";
      this.eventHandlers.oninput = oninput;
      this.eventHandlers.onclose = onclose;
      this.elements.main.classList.add("keyboard--hidden");
      this.elements.textarea.classList.remove('active');
    }
  };
  window.addEventListener("DOMContentLoaded", function () {
    Keyboard.init();
  });
  