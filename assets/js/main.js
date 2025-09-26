/* Main JS for Birthday Wish App
 * - Provides page-specific initializers based on body[data-page]
 * - Modular functions and utilities
 */

(function () {
	'use strict';

	// Utility: select
	const $ = (sel, scope = document) => scope.querySelector(sel);
	const $$ = (sel, scope = document) => Array.from(scope.querySelectorAll(sel));

	// Utility: random int
	const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

	// Utility: prefers-reduced-motion
	const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	// Background hearts/stars generator (shared)
	function createFloatingBackground() {
		const heartContainer = document.createElement('div');
		heartContainer.className = 'bg-hearts';
		document.body.appendChild(heartContainer);

		const starContainer = document.createElement('div');
		starContainer.className = 'bg-stars';
		document.body.appendChild(starContainer);

		const emojiContainer = document.createElement('div');
		emojiContainer.className = 'bg-emoji';
		document.body.appendChild(emojiContainer);

		if (reduceMotion) return; // Respect user preferences

		// Hearts
		for (let i = 0; i < 18; i++) {
			const h = document.createElement('div');
			h.className = 'heart';
			h.style.left = rand(0, 100) + 'vw';
			h.style.bottom = rand(-20, 0) + 'vh';
			h.style.animationDuration = rand(10, 20) + 's';
			h.style.animationDelay = rand(0, 10) + 's';
			h.style.color = ['#ff4d6d', '#ff66b2', '#ffb6b9', '#c77dff', '#ffd166'][i % 5];
			heartContainer.appendChild(h);
		}

		// Stars
		for (let i = 0; i < 40; i++) {
			const s = document.createElement('div');
			s.className = 'star';
			s.style.left = rand(0, 100) + 'vw';
			s.style.top = rand(0, 100) + 'vh';
			s.style.animationDelay = rand(0, 3000) + 'ms';
			starContainer.appendChild(s);
		}

		// Party emojis
		const emojis = ['🎉','🥳','💖'];
		for (let i = 0; i < 10; i++) {
			const e = document.createElement('div');
			e.className = 'emoji';
			e.textContent = emojis[i % emojis.length];
			e.style.left = rand(0, 100) + 'vw';
			e.style.bottom = rand(-10, 10) + 'vh';
			e.style.animationDuration = rand(16, 28) + 's';
			e.style.animationDelay = rand(0, 6000) + 'ms';
			emojiContainer.appendChild(e);
		}

		// Background balloons
		const bgBalloons = document.createElement('div');
		bgBalloons.className = 'bg-balloons';
		document.body.appendChild(bgBalloons);
		for (let i = 0; i < 8; i++) {
			const b = document.createElement('div');
			b.className = 'b';
			b.style.left = rand(0, 100) + 'vw';
			b.style.bottom = rand(-10, 20) + 'vh';
			b.style.background = ['#7b2ff7','#ff3cac','#ff5da2','#ffd166','#cfc7d9'][i % 5];
			b.style.animationDuration = rand(14, 28) + 's';
			b.style.animationDelay = rand(0, 6000) + 'ms';
			bgBalloons.appendChild(b);
		}
	}

	// INTRO PAGE
	function initIntro() {
		const triggerBtn = $('#intro-trigger');
		const bigHeartWrap = $('#big-heart-wrap');
		const bigHeart = $('#big-heart');
		const tree = $('#tree');
		const crown = $('#crown');
		const celebrate = $('#intro-celebrate');
		if (!triggerBtn || !bigHeart || !bigHeartWrap || !tree) return;

		function addRipple(e) {
			const r = document.createElement('span');
			r.className = 'ripple';
			const rect = triggerBtn.getBoundingClientRect();
			r.style.left = (e.clientX - rect.left) + 'px';
			r.style.top = (e.clientY - rect.top) + 'px';
			triggerBtn.appendChild(r);
			setTimeout(() => r.remove(), 650);
		}

		function startSequence(e) {
			addRipple(e);
			triggerBtn.disabled = true;
			triggerBtn.setAttribute('aria-busy', 'true');

			if (!reduceMotion) {
				// Create heart particles (pop)
				const count = 60;
				const rect = bigHeart.getBoundingClientRect();
				for (let i = 0; i < count; i++) {
					const p = document.createElement('div');
					p.className = 'particle';
					p.style.color = ['#ff4d6d', '#ffd166', '#a06cd5', '#4cc9f0'][i % 4];
					p.style.left = (rect.width / 2) + 'px';
					p.style.top = (rect.height / 2) + 'px';
					const dx = (Math.random() - 0.5) * 320;
					const dy = (Math.random() - 0.5) * 320;
					const scale = Math.random() * 0.8 + 0.6;
					p.animate([
						{ transform: `translate(0,0) rotate(45deg) scale(${scale})`, opacity: 1 },
						{ transform: `translate(${dx}px, ${dy}px) rotate(45deg) scale(0)`, opacity: 0 }
					], { duration: rand(700, 1000), easing: 'ease-out' });
					bigHeart.appendChild(p);
					setTimeout(() => p.remove(), 1100);
				}
			}

			// Hide big heart, show tree grow
			bigHeart.style.visibility = 'hidden';
			tree.classList.add('grow');
			setTimeout(() => tree.classList.add('show-crown'), 400);

			// Populate emoji leaves in crown
			if (crown && !reduceMotion) {
				crown.innerHTML = '';
				const emojis = ['❤️','💖','💗','💓','💞','💕'];
				for (let i = 0; i < 40; i++) {
					const e = document.createElement('span');
					e.className = 'leaf-emoji';
					e.textContent = emojis[i % emojis.length];
					e.style.left = rand(0, 100) + '%';
					e.style.top = rand(0, 100) + '%';
					e.style.fontSize = rand(12, 22) + 'px';
					crown.appendChild(e);
				}
			}

			// After growth, transition to birthday.php
			const total = reduceMotion ? 800 : 2800;
			setTimeout(() => {
				if (celebrate) celebrate.classList.add('show');
				setTimeout(() => {
					document.body.classList.add('fade-out');
					setTimeout(() => { window.location.href = 'birthday.html'; }, 600);
				}, 1200);
			}, total);
		}

		triggerBtn.addEventListener('click', (e) => startSequence(e));
		bigHeartWrap.addEventListener('click', (ev) => {
			if (ev.target === triggerBtn) return;
			if (triggerBtn.disabled) return;
			startSequence(ev);
		});
	}

	// BIRTHDAY PAGE
	function initBirthday() {
		const title = $('#title');
		const subtitle = $('#subtitle');
		const img = $('#photo');
		const glow = $('#photo-glow');
		if (!title || !subtitle || !img || !glow) return;
		requestAnimationFrame(() => {
			title.classList.add('enter-fade');
			subtitle.classList.add('enter-delay');
			img.classList.add('enter-delay');
			glow.classList.add('enter-delay');
		});
	}

	// BALLOONS PAGE
	function initBalloons() {
		const input = $('#age');
		const goBtn = $('#spawn-balloons');
		const area = $('#balloon-area');
		const afterBtn = $('#magic-btn');
		if (!input || !goBtn || !area || !afterBtn) return;

		// Input validation
		input.addEventListener('input', () => {
			const val = parseInt(input.value || '0', 10);
			if (val < 1) input.value = '1';
			if (val > 100) input.value = '100';
		});

		function spawnBurst(x, y) {
			const colors = ['#ff4d6d','#ffd166','#a06cd5','#4cc9f0','#06d6a0'];
			for (let i = 0; i < 10; i++) {
				const h = document.createElement('div');
				h.className = 'burst-heart';
				h.style.color = colors[i % colors.length];
				h.style.left = x + 'px';
				h.style.top = y + 'px';
				h.style.position = 'absolute';
				const dx = (Math.random() - 0.5) * 140;
				const dy = (Math.random() - 0.5) * 140;
				h.animate([
					{ transform: 'translate(0,0) rotate(45deg)', opacity: 1 },
					{ transform: `translate(${dx}px,${dy}px) rotate(45deg)`, opacity: 0 }
				], { duration: 600, easing: 'ease-out' });
				area.appendChild(h);
				setTimeout(() => h.remove(), 700);
			}
		}

		goBtn.addEventListener('click', () => {
			const n = Math.max(1, Math.min(100, parseInt(input.value, 10) || 0));
			area.innerHTML = '';
			afterBtn.style.display = 'none';

			const balloons = [];
			for (let i = 0; i < n; i++) {
				const b = document.createElement('div');
				b.className = 'balloon';
				b.style.left = rand(0, 90) + 'vw';
				// Palette colors
				const palette = [getComputedStyle(document.documentElement).getPropertyValue('--accent-purple').trim(), getComputedStyle(document.documentElement).getPropertyValue('--magenta').trim(), getComputedStyle(document.documentElement).getPropertyValue('--hot-pink').trim(), getComputedStyle(document.documentElement).getPropertyValue('--gold').trim(), getComputedStyle(document.documentElement).getPropertyValue('--muted').trim() || '#cfc7d9'];
				b.style.background = palette[i % palette.length];
				b.style.animationDuration = (reduceMotion ? 1.2 : rand(3, 6)) + 's';
				b.setAttribute('tabindex','0');
				b.setAttribute('role','button');
				b.setAttribute('aria-label','Balloon');
				area.appendChild(b);
				balloons.push(b);
			}

			// Randomly pop
			const duration = reduceMotion ? 1200 : rand(4000, 5000);
			balloons.forEach((b) => {
				const when = rand(500, 4500);
				setTimeout(() => {
					const r = b.getBoundingClientRect();
					b.classList.add('pop');
					spawnBurst(r.left + r.width / 2, r.top + r.height / 2);
					setTimeout(() => b.remove(), 280);
				}, when);

				// Touch/click to pop immediately
				const manualPop = () => {
					if (!b.isConnected) return;
					const r = b.getBoundingClientRect();
					b.classList.add('pop');
					spawnBurst(r.left + r.width / 2, r.top + r.height / 2);
					// Confetti ribbons
					for (let j = 0; j < 6; j++) {
						const c = document.createElement('div');
						c.className = 'confetti';
						c.style.left = (r.left + r.width / 2 + rand(-10, 10)) + 'px';
						c.style.top = (r.top + r.height / 2) + 'px';
						c.style.background = ['#ffd166','#ff3cac','#ff5da2','#7b2ff7'][j % 4];
						c.style.position = 'fixed';
						document.body.appendChild(c);
						setTimeout(() => c.remove(), 900);
					}
					setTimeout(() => b.remove(), 280);
				};
				b.addEventListener('click', manualPop);
				b.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); manualPop(); } });
			});

			setTimeout(() => { afterBtn.style.display = 'inline-block'; }, 5000);
		});
	}

	// CUBE PAGE
	function initCube() {
		const wrap = $('#cube-wrap');
		const cube = $('#cube');
		const audio = $('#bg-audio');
		const audioToggle = $('#audio-toggle');
		if (!wrap || !cube || !audio || !audioToggle) return;

		// Images to rotate (REPLACE WITH YOUR OWN ASSETS)
		// If your files are .jpeg or have spaces (e.g., "photo 1.jpeg"),
		// the loader below will try common variants automatically.
		const buildImageCandidates = () => {
			const variants = [];
			for (let i = 1; i <= 10; i++) {
				variants.push([
					`assets/images/photo ${i}.jpeg`,
					`assets/images/photo${i}.jpeg`,
					`assets/images/photo ${i}.jpg`,
					`assets/images/photo${i}.jpg`,
					`assets/images/photo ${i}.JPEG`,
					`assets/images/photo${i}.JPEG`,
					`assets/images/photo ${i}.JPG`,
					`assets/images/photo${i}.JPG`,
					`assets/images/photo ${i}.png`,
					`assets/images/photo${i}.png`,
					`assets/images/photo ${i}.webp`,
					`assets/images/photo${i}.webp`
				]);
			}
			return variants;
		};
		const imageCandidates = buildImageCandidates();

		function loadWithFallback(imgEl, candidates) {
			let idx = 0;
			function tryNext() {
				if (idx >= candidates.length) return; // give up
				const raw = candidates[idx++];
				const src = encodeURI(raw);
				imgEl.onerror = () => tryNext();
				imgEl.onload = () => { imgEl.onerror = null; };
				imgEl.src = src;
			}
			tryNext();
		}

		// Create 6 faces with img elements
		const faces = [];
		for (let i = 0; i < 6; i++) {
			const face = document.createElement('div');
			face.className = 'face';
			// Use background-image div to avoid broken <img> icon and ensure display
			const tex = document.createElement('div');
			tex.className = 'tex';
			function setTex(src) { tex.style.backgroundImage = `url('${src}')`; }
			if (Array.isArray(window.CUBE_IMAGES) && window.CUBE_IMAGES.length) {
				// Insert an actual <img> to ensure object-fit: cover applies
				const img = document.createElement('img');
				img.src = window.CUBE_IMAGES[i % window.CUBE_IMAGES.length];
				img.alt = 'Cube face';
				tex.appendChild(img);
			} else {
				const el = new Image();
				el.onload = () => setTex(el.src);
				loadWithFallback(el, imageCandidates[i % imageCandidates.length]);
			}
			face.appendChild(tex);
			cube.appendChild(face);
			faces.push(tex);
		}

		// Position faces in 3D
		const size = wrap.clientWidth;
		const half = size / 2;
		const faceEls = $$('.face', cube);
		faceEls[0].style.transform = `translateZ(${half}px)`; // front
		faceEls[1].style.transform = `rotateY(90deg) translateZ(${half}px)`; // right
		faceEls[2].style.transform = `rotateY(180deg) translateZ(${half}px)`; // back
		faceEls[3].style.transform = `rotateY(-90deg) translateZ(${half}px)`; // left
		faceEls[4].style.transform = `rotateX(90deg) translateZ(${half}px)`; // top
		faceEls[5].style.transform = `rotateX(-90deg) translateZ(${half}px)`; // bottom

		// Swap images only when no custom image list is provided
		let index = 6;
		let interval = null;
		if (!(Array.isArray(window.CUBE_IMAGES) && window.CUBE_IMAGES.length)) {
			const swapMs = reduceMotion ? 1000 : 2000;
			interval = setInterval(() => {
				faces.forEach((tex) => {
					tex.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 250, fill: 'forwards' }).finished
						.then(() => {
							const candidates = imageCandidates[index % imageCandidates.length];
							index++;
							const el = new Image();
							el.onload = () => { tex.style.backgroundImage = `url('${el.src}')`; };
							loadWithFallback(el, candidates);
							return tex.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 250, fill: 'forwards' }).finished;
						})
						.catch(() => {});
				});
			}, swapMs);
		}

		// Apply 31s single-iteration rotation class
		cube.classList.add('cube-31s');

		// Audio control
		audioToggle.addEventListener('click', () => {
			if (audio.muted) { audio.muted = false; audioToggle.textContent = 'Mute'; }
			else { audio.muted = true; audioToggle.textContent = 'Unmute'; }
		});

		// Autoplay (will work on user gesture navigation from previous page). Duration ~31s.
		const attemptPlay = () => {
			const p = audio.play();
			if (p && typeof p.catch === 'function') {
				p.catch(() => { /* will retry on first interaction */ });
			}
		};
		attemptPlay();
		// Fallback: start on first user interaction if autoplay blocked
		const resumeOnInteract = () => {
			audio.muted = false;
			attemptPlay();
			document.removeEventListener('click', resumeOnInteract);
			document.removeEventListener('keydown', resumeOnInteract);
		};
		document.addEventListener('click', resumeOnInteract, { once: true });
		document.addEventListener('keydown', resumeOnInteract, { once: true });


		// Redirect after 31 seconds or when audio ends, whichever occurs first
		let redirected = false;
		function goHeart() {
			if (redirected) return;
			redirected = true;
			if (interval) clearInterval(interval);
			// Pause cube rotation immediately before redirect
			try { cube.style.animationPlayState = 'paused'; } catch (_) {}
			try { audio.pause(); } catch (_) {}
			window.location.href = 'heart.html';
		}

		const totalMs = 31000;
		setTimeout(goHeart, totalMs);
		audio.addEventListener('ended', goHeart);
	}

	// HEART PAGE
	function initHeart() {
		const mega = $('#mega-heart');
		const top = $('#heart-top');
		const bottom = $('#heart-bottom');
		const container = $('#message');
		const lines = $$('.message-line', container);
		if (!mega || !top || !bottom || !container) return;

		// Pump/beat for ~2.2s
		mega.classList.add('beat');
		setTimeout(() => {
			top.classList.add('heart-split-top');
			bottom.classList.add('heart-split-bottom');
			// Reveal container
			container.style.opacity = '1';
			// Typewriter-like line reveal
			let delay = 0;
			lines.forEach((line) => {
				setTimeout(() => line.classList.add('show'), delay);
				delay += reduceMotion ? 20 : 450;
			});
		}, reduceMotion ? 200 : 2200);
	}

	// Router by data-page
	function boot() {
		createFloatingBackground();
		switch (document.body.dataset.page) {
			case 'intro': return initIntro();
			case 'birthday': return initBirthday();
			case 'balloons': return initBalloons();
			case 'cube': return initCube();
			case 'heart': return initHeart();
			default: break;
		}
	}

	// Initialize when DOM is ready; also handle case where DOMContentLoaded already fired
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', boot);
	} else {
		boot();
	}
})();


