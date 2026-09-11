// Hero.island.tsx's ASCII scene cycler. Six ten-second scenes — a rotating
// token torus, a coding tunnel, a git log --graph, a rebase, a compile loop,
// and a call stack — drawn into a <pre> as plain characters, no canvas or
// library. Every transition uses the same reading-order "print" mask as the
// rest of the terminal chrome, so a scene change reads as one continuous
// typing pass. Ported from the Claude Design source (Portfolio v2.dc.html).
export function startHeroArt(el: HTMLPreElement): () => void {
  const COLS = 48;
  const ROWS = 23;
  const CELLS = COLS * ROWS;
  const CX = (COLS - 1) / 2;
  const CY = (ROWS - 1) / 2;
  const ASPECT = 1.6; // a cell is ~1.6x taller than wide
  // DIM is a full-strength colour, not a dimmed one: it carries captions,
  // deleted diff lines and status text, all of which must stay readable.
  const ACCENT = 2;
  const MID = 3;
  const DIM = 1;
  const ch = new Array<string>(CELLS);
  const tone = new Uint8Array(CELLS);
  const zb = new Float32Array(CELLS);
  let SC = 21; // unit -> cell scale, set per scene

  const ux = (x: number) => CX + x * SC;
  const uy = (y: number) => CY - y * (SC / ASPECT);
  const put = (c: number, r: number, g: string, tn: number) => {
    c = Math.round(c);
    r = Math.round(r);
    if (c < 0 || c >= COLS || r < 0 || r >= ROWS) return;
    const k = r * COLS + c;
    ch[k] = g;
    tone[k] = tn;
  };
  const text = (c: number, r: number, s: string, tn: number) => {
    for (let i = 0; i < s.length; i++) put(c + i, r, s[i], tn);
  };

  // Tokens must run along whichever axis has screen width — a word cannot
  // read across a shape only four columns wide. Every tape below is indexed
  // circumferentially for that reason.
  const tape = (words: string[]) => words.join('');
  const glyph = (s: string, i: number) => {
    const g = s[((i % s.length) + s.length) % s.length];
    return g === ' ' ? '·' : g;
  };

  /* 1 · token torus — keywords wrapped onto a rotating solid */
  const torus = (() => {
    const TAPE = ['const ', 'let ', '=> ', 'async ', 'await ', 'return ', 'if ', 'for ', 'type ', 'import '].join('');
    const RING = 0.62, TUBE = 0.3, TILT = 1.05;
    const ct = Math.cos(TILT), stl = Math.sin(TILT);
    const pts: [number, number, number, number, number, number, string][] = [];
    const US = 260, VS = 22;
    for (let iu = 0; iu < US; iu++) {
      const u = (iu / US) * Math.PI * 2, cu = Math.cos(u), su = Math.sin(u);
      const g = TAPE[Math.floor((iu / US) * TAPE.length) % TAPE.length];
      for (let iv = 0; iv < VS; iv++) {
        const v = (iv / VS) * Math.PI * 2, cv = Math.cos(v), sv = Math.sin(v);
        const rr = RING + TUBE * cv;
        pts.push([rr * cu, TUBE * sv, rr * su, cv * cu, sv, cv * su, g === ' ' ? '·' : g]);
      }
    }
    return (t: number) => {
      zb.fill(-9);
      const a = t * 0.00036, ca = Math.cos(a), sa = Math.sin(a);
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        let x = p[0] * ca + p[2] * sa, z = p[2] * ca - p[0] * sa, y = p[1];
        const y2 = y * ct - z * stl; z = y * stl + z * ct; y = y2;
        let nx = p[3] * ca + p[5] * sa, nz = p[5] * ca - p[3] * sa, ny = p[4];
        const n2 = ny * ct - nz * stl; nz = ny * stl + nz * ct; ny = n2;
        const c = Math.round(ux(x)), r = Math.round(uy(y));
        if (c < 0 || c >= COLS || r < 0 || r >= ROWS) continue;
        const k = r * COLS + c;
        if (z <= zb[k]) continue;
        zb[k] = z;
        ch[k] = p[6];
        const lum = nx * -0.4 + ny * 0.5 + nz * 0.77;
        tone[k] = nz < 0 ? DIM : lum > 0.35 ? ACCENT : MID;
      }
    };
  })();

  /* 2 · coding tunnel — keyword rings running past the viewer */
  const tunnel = (() => {
    const T = tape(['while ', 'for ', 'if ', 'else ', 'break ', 'continue ']);
    const RINGS = 16, US = 110, NEAR = 0.30, FAR = 3.9, RAD = 9;
    return (t: number) => {
      zb.fill(-9);
      // Rings advance toward the viewer; the phase keeps the march seamless
      // as each ring recycles to the back.
      const phase = ((t * 0.00048) % 1 + 1) % 1;
      for (let ri = RINGS - 1; ri >= 0; ri--) {
        const dz = NEAR + ((ri + phase) / RINGS) * (FAR - NEAR);
        const rad = RAD / dz;
        const spin = t * 0.00016 + ri * 0.11;
        for (let iu = 0; iu < US; iu++) {
          const u = (iu / US) * Math.PI * 2 + spin;
          const c = Math.round(CX + Math.cos(u) * rad);
          const r = Math.round(CY - (Math.sin(u) * rad) / ASPECT);
          if (c < 0 || c >= COLS || r < 0 || r >= ROWS) continue;
          const k = r * COLS + c;
          if (-dz <= zb[k]) continue;
          zb[k] = -dz;
          ch[k] = glyph(T, Math.floor((iu / US) * T.length * 2) + ri);
          tone[k] = dz < 0.85 ? ACCENT : dz < 1.9 ? MID : DIM;
        }
      }
    };
  })();

  /* 3 · commit graph */
  const gitlog = (t: number) => {
    // Lanes sit close to the spine so a branch reads as a lane peeling off,
    // not as a wide empty rectangle.
    const L0 = 4, L1 = 8, L2 = 12, TX = 16;
    const branch = (lane: number, top: number, bottom: number) => {
      put(L0, top, '├', MID);
      for (let c = L0 + 1; c < lane; c++) put(c, top, '─', MID);
      put(lane, top, '┐', MID);
      for (let r = top + 1; r < bottom; r++) put(lane, r, '│', MID);
      put(lane, bottom, '┘', MID);
      for (let c = L0 + 1; c < lane; c++) put(c, bottom, '─', MID);
      // Right-facing tee: the run leaves the spine rightward on both rows.
      put(L0, bottom, '├', MID);
    };
    const LOG: [number, number, string, string, number][] = [
      [2, L0, '7f3a1c', 'feat: assistant panel', 1],
      [4, L1, '4ee7d2', 'wip: pgvector recall', 0],
      [6, L0, 'c21b90', 'fix: tenant cache key', 0],
      [8, L2, '18cc5e', 'chore: bump axum', 0],
      [10, L0, '9b0a44', 'merge: retrieval', 0],
      [12, L1, '5d9e7b', 'test: e2e inbox', 0],
      [14, L0, 'a3f612', 'feat: admin dash', 0],
      [16, L0, '0001aa', 'init: workspace', 0],
    ];
    text(2, 0, '$ git log --graph', MID);
    for (let r = 2; r <= 16; r++) put(L0, r, '│', MID);
    branch(L1, 3, 5);
    branch(L2, 7, 9);
    branch(L1, 11, 13);
    for (const [r, lane, hash, msg, head] of LOG) {
      put(lane, r, '●', head ? ACCENT : MID);
      text(TX, r, hash, DIM);
      text(TX + 7, r, msg, head ? ACCENT : MID);
      if (head) put(TX + 8 + msg.length, r, Math.floor(t / 520) % 2 ? '█' : ' ', ACCENT);
    }
  };

  /* 4 · rebase — a patch applying itself hunk by hunk */
  const rebase = (_t: number, st: number) => {
    const LINES: [string, string][] = [
      [' ', 'export function resolveTenant(req) {'],
      ['-', "  const id = req.headers['x-tenant'];"],
      ['-', '  return db.tenant(id);'],
      ['+', '  const id = parseTenant(req);'],
      ['+', '  if (!id) throw new TenantError();'],
      ['+', '  return db.tenant.scoped(id);'],
      [' ', '}'],
    ];
    text(2, 1, 'diff --git a/tenant.ts', MID);
    text(2, 2, '@@ -14,6 +14,8 @@', DIM);
    const applied = Math.max(0, Math.floor((st - 1400) / 1500));
    let r = 4, add = 0;
    for (const [sign, code] of LINES) {
      if (sign === '+') {
        if (add++ >= applied) { r++; continue; }
        put(2, r, '+', ACCENT);
        text(4, r, code, ACCENT);
      } else if (sign === '-') {
        put(2, r, '-', DIM);
        text(4, r, code, DIM);
      } else {
        text(4, r, code, MID);
      }
      r++;
    }
    if (applied >= 3) {
      text(4, 13, '3 insertions(+), 2 deletions(-)', MID);
      text(4, 15, 'ok  rebased onto main', DIM);
    } else {
      text(4, 13, 'applying hunk ' + Math.min(applied + 1, 3) + ' of 3', DIM);
    }
  };

  /* 5 · compile loop — a snippet types itself, then reports */
  const compile = (t: number, st: number) => {
    // The command travels with its snippet — tsc cannot compile Rust, and
    // this runs in front of the audience that would notice.
    const SNIPS = [
      { cmd: '$ tsc --watch', ok: 'ok  compiled in 0.34s',
        lines: ['const useTenant = () => {', '  const id = inject(TenantId);', '  return computed(() =>', '    store.byId(id));', '};'] },
      { cmd: '$ cargo watch -x check', ok: 'ok  checked in 1.12s',
        lines: ['async fn embed(doc: &Doc)', '  -> Result<Vec<f32>> {', '  let chunks = split(doc);', '  model.encode(chunks).await', '}'] },
    ];
    const snip = SNIPS[Math.floor(st / 5000) % SNIPS.length];
    const local = st % 5000;
    const joined = snip.lines.join('\n');
    const n = Math.min(joined.length, Math.floor(local / 20));
    text(2, 1, snip.cmd, MID);
    let r = 3, c = 4;
    for (let i = 0; i < n; i++) {
      const g = joined[i];
      if (g === '\n') { r++; c = 4; continue; }
      put(c++, r, g, ACCENT);
    }
    if (n < joined.length) {
      put(c, r, Math.floor(t / 420) % 2 ? '█' : ' ', ACCENT);
    } else {
      const done = local - joined.length * 20;
      if (done > 260) text(4, r + 2, snip.ok, MID);
      if (done > 820) text(4, r + 3, 'watching for changes', DIM);
    }
  };

  /* 6 · call stack — frames pushing and popping in a wave */
  const callstack = (() => {
    const FRAMES = ['main()', 'bootstrap()', 'resolveTenant()', 'loadInbox()', 'query(sql)', 'embed(chunk)', 'rank(hits)'];
    const N = FRAMES.length;
    return (_t: number, st: number) => {
      // Depth climbs to N, then unwinds — a ripple through the stack.
      const cyc = (st % 4200) / 4200;
      const depth = Math.max(1, cyc < 0.55 ? Math.ceil((cyc / 0.55) * N) : Math.ceil((1 - (cyc - 0.55) / 0.45) * N));
      text(2, 0, '$ node --inspect', MID);
      for (let i = 0; i < depth; i++) {
        const r = 2 + i, ind = 2 + i * 2, live = i === depth - 1;
        for (let g = 0; g < i; g++) put(2 + g * 2, r, '│', DIM);
        put(ind, r, live ? '▸' : '┌', live ? ACCENT : MID);
        text(ind + 2, r, FRAMES[i] + ' {', live ? ACCENT : MID);
      }
      // Closers unwind below the deepest frame, mirroring the push.
      for (let i = depth - 1; i >= 0; i--) {
        const r = 2 + depth + (depth - 1 - i), ind = 2 + i * 2;
        for (let g = 0; g < i; g++) put(2 + g * 2, r, '│', DIM);
        put(ind, r, '└', MID);
        text(ind + 2, r, '}', MID);
      }
      if (depth === N) text(4, 2 + depth * 2, 'depth ' + N + '  ok', DIM);
    };
  })();

  const SCENES: { scale: number; draw: (t: number, st: number) => void }[] = [
    { scale: 18, draw: (t) => torus(t) },
    { scale: 18, draw: (t) => tunnel(t) },
    { scale: 18, draw: (t) => gitlog(t) },
    { scale: 18, draw: rebase },
    { scale: 18, draw: compile },
    { scale: 18, draw: callstack },
  ];
  const HOLD = 10000, IN = 900, OUT = 700;

  let artT0 = performance.now();
  let artFull = false;
  let raf = 0;

  const draw = (t: number) => {
    const age = Math.max(0, t - artT0);
    const idx = Math.floor(age / HOLD) % SCENES.length;
    const st = age % HOLD;
    const sc = SCENES[idx];

    SC = sc.scale;
    ch.fill(' ');
    tone.fill(0);
    sc.draw(t, st);

    // The typing mask: cells appear in reading order on the way in and
    // disappear the same way on the way out, so every scene change reads as
    // one continuous printer pass.
    let typed = CELLS, head = -1;
    if (!artFull) {
      if (st < IN) typed = Math.floor((st / IN) * CELLS);
      else if (st > HOLD - OUT) typed = Math.floor(CELLS * (1 - (st - (HOLD - OUT)) / OUT));
      if (typed < CELLS) head = typed;
    }

    let out = '', run = '', cur = 0;
    const flush = () => {
      if (!run) return;
      // The glyph set contains & < >, so runs are escaped before innerHTML.
      run = run.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      out += cur === ACCENT ? '<span style="color:var(--ac)">' + run + '</span>'
        : cur === MID ? '<span style="color:var(--fg2)">' + run + '</span>'
        : cur === DIM ? '<span style="color:var(--fg3)">' + run + '</span>' : run;
      run = '';
    };
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const k = r * COLS + c;
        let g = ch[k] ?? ' ', tn = g === ' ' ? 0 : tone[k];
        if (k >= typed) { g = ' '; tn = 0; }
        if (k === head) { g = '█'; tn = ACCENT; }
        if (tn !== cur) { flush(); cur = tn; }
        run += g;
      }
      flush(); cur = 0;
      if (r < ROWS - 1) out += '\n';
    }
    el.innerHTML = out;
  };

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // One still frame of the first scene — no cycling, no typing.
    artFull = true;
    draw(artT0 + HOLD / 2);
    return () => {};
  }

  let last = 0;
  const loop = (t: number) => {
    raf = requestAnimationFrame(loop);
    if (document.hidden || t - last < 42) return;
    last = t;
    draw(t);
  };
  raf = requestAnimationFrame(loop);

  return () => cancelAnimationFrame(raf);
}
