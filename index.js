const overlay = document.getElementById("overlay");
        const dur = document.getElementById("dur");
        const warm = document.getElementById("warm");
        const time = document.getElementById("time");
        const dLbl = document.getElementById("dLbl");
        const wLbl = document.getElementById("wLbl");

        let startTime = null, duration = dur.value * 60 * 1000, running = false, raf;

        dLbl.textContent = dur.value;
        wLbl.textContent = warm.value;

        dur.oninput = () => { dLbl.textContent = dur.value; duration = dur.value * 60000; };
        warm.oninput = () => { wLbl.textContent = warm.value; };

        function smooth(t) { return t * t * (3 - 2 * t); }
        function clamp(v) { return Math.max(0, Math.min(1, v)); }

        function update(p) {
            const s = smooth(p);
            const warmth = warm.value / 100;
            const r = Math.round(255 * warmth + 255 * (1 - warmth));
            const g = Math.round(147 * warmth + 255 * (1 - warmth));
            const b = Math.round(41 * warmth + 245 * (1 - warmth));
            overlay.style.background = `rgba(${r},${g},${b},${0.95 * s})`;
        }

        function step() {
            if (!running) return;
            const t = clamp((performance.now() - startTime) / duration);
            update(t);
            if (t >= 1) { running = false; cancelAnimationFrame(raf); return; }
            raf = requestAnimationFrame(step);
        }

        document.getElementById("start").onclick = () => {
            running = true;
            startTime = performance.now();
            step();
        };

        document.getElementById("stop").onclick = () => {
            running = false;
            cancelAnimationFrame(raf);
            overlay.style.background = "rgba(255,147,41,0)";
        };

        document.getElementById("set").onclick = () => {
            if (!time.value) return alert("Pick a time first");
            const now = new Date();
            const [h, m] = time.value.split(":").map(Number);

            let target = new Date();
            target.setHours(h, m, 0, 0);
            if (target < now) target.setDate(target.getDate() + 1);

            const wait = target - now;
            alert("Alarm set");

            setTimeout(() => {
                running = true;
                startTime = performance.now();
                step();
            }, wait);
        };