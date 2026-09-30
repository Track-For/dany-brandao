import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const cdpPort = Number(process.env.CDP_PORT || 9225);
const siteUrl = process.env.SITE_URL || "http://localhost:3012";
const quick = process.env.QUICK === "1";
const heroOnly = process.env.HERO_ONLY === "1";
const root = process.cwd();
const mobileDir = path.join(root, "docs", "screenshots", "mobile");
const responsiveDir = path.join(mobileDir, "responsive");
const desktopDir = path.join(root, "docs", "screenshots", "desktop");
const desktopStoryDir = path.join(desktopDir, "story");

await Promise.all([
  mkdir(mobileDir, { recursive: true }),
  mkdir(responsiveDir, { recursive: true }),
  mkdir(desktopDir, { recursive: true }),
  mkdir(desktopStoryDir, { recursive: true }),
]);

const target = await fetch(`http://127.0.0.1:${cdpPort}/json/new?${encodeURIComponent(siteUrl)}`, { method: "PUT" }).then((response) => response.json());
const socket = new WebSocket(target.webSocketDebuggerUrl);
const pending = new Map();
const runtimeErrors = [];
let commandId = 0;

socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (message.method === "Runtime.exceptionThrown") runtimeErrors.push(message.params?.exceptionDetails?.exception?.description || message.params?.exceptionDetails?.text || "Runtime exception");
  if (message.method === "Runtime.consoleAPICalled" && message.params?.type === "error") runtimeErrors.push(message.params.args?.map((item) => item.value || item.description).join(" ") || "Console error");
  if (!message.id || !pending.has(message.id)) return;
  const { resolve, reject } = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) reject(new Error(message.error.message));
  else resolve(message.result);
});

await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++commandId;
  pending.set(id, { resolve, reject });
  socket.send(JSON.stringify({ id, method, params }));
});

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const evaluate = async (expression) => {
  const result = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
};

await send("Page.enable");
await send("Runtime.enable");
await send("Network.enable");

const setViewport = async (width, height, mobile) => {
  await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile, screenWidth: width, screenHeight: height });
  await send("Emulation.setTouchEmulationEnabled", { enabled: mobile, maxTouchPoints: mobile ? 5 : 1 });
};

const navigate = async (width, height, mobile = true, settle = 1200) => {
  await setViewport(width, height, mobile);
  await send("Page.navigate", { url: `${siteUrl}/` });
  await wait(settle);
  await evaluate("document.fonts.ready.then(() => true)");
  await evaluate("window.scrollTo(0, 0)");
  await wait(250);
};

const scrollToTarget = async (selector, progress = 0, offset = 0) => {
  await evaluate(`(() => {
    const element = document.querySelector(${JSON.stringify(selector)});
    if (!element) throw new Error("Missing selector: ${selector}");
    document.documentElement.style.scrollBehavior = "auto";
    const rect = element.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    const distance = Math.max(0, rect.height - window.innerHeight);
    window.scrollTo(0, Math.max(0, top + distance * ${progress} + ${offset}));
    return window.scrollY;
  })()`);
  await wait(1100);
};

const capture = async (filePath) => {
  const result = await send("Page.captureScreenshot", { format: "png", fromSurface: true, captureBeyondViewport: false });
  await writeFile(filePath, Buffer.from(result.data, "base64"));
};

if (heroOnly) {
  await navigate(1440, 900, false, 2300);
  await capture(path.join(desktopDir, "1440x900-hero.png"));
  await scrollToTarget("[data-hero-section]", 0.98, 0);
  await capture(path.join(desktopStoryDir, "00-hero-fechamento.png"));
  console.log(JSON.stringify({ runtimeErrors }, null, 2));
  socket.close();
  process.exit(0);
}

const metrics = [];
await navigate(390, 844, true, 80);
await capture(path.join(mobileDir, "00-hero-vignette.png"));
await wait(1500);
const states = [
  ["01-hero.png", "[data-hero-section]", 0, 0],
  ["02-classico.png", "[data-language-section]", 0.02, 0],
  ["03-transicao.png", "[data-language-section]", 0.5, 0],
  ["04-pop.png", "[data-language-section]", 0.98, 0],
  ["05-sobreposicao.png", "[data-language-handoff]", 0, -120],
  ["06a-zoom-inicio.png", "[data-zoom-section]", 0.02, 0],
  ["06b-zoom-meio.png", "[data-zoom-section]", 0.5, 0],
  ["06c-zoom-final.png", "[data-zoom-section]", 0.98, 0],
  ["07-metodo.png", "#metodo", 0, 0],
  ["08-detalhes.png", "#detalhes", 0, 0],
  ["09-showcase.png", "#experiencias", 0, 0],
  ["10a-complexidade.png", "[data-complexity-section]", 0.08, 0],
  ["10b-juncao.png", "[data-complexity-section]", 0.58, 0],
  ["10c-tranquilidade.png", "[data-complexity-section]", 0.94, 0],
  ["11-manifesto.png", "[data-manifesto-section]", 0.25, 0],
  ["12-dany.png", "#sobre", 0.38, 0],
  ["13-contato.png", "#contato", 0, 0],
];

let popAudit = null;
let aboutAudit = null;
for (const [name, selector, progress, offset] of states) {
  await scrollToTarget(selector, progress, offset);
  await capture(path.join(mobileDir, name));
  if (name === "04-pop.png") popAudit = await evaluate(`Array.from(document.querySelectorAll('.language__film')).map((element) => ({ rect: element.getBoundingClientRect().toJSON(), opacity: getComputedStyle(element).opacity, visibility: getComputedStyle(element).visibility, clipPath: getComputedStyle(element).clipPath }))`);
  if (name === "12-dany.png") aboutAudit = await evaluate(`(() => { const section = document.querySelector('#sobre'); const portrait = document.querySelector('.about__portrait'); const copy = document.querySelector('.about__copy'); return { section: section?.getBoundingClientRect().toJSON(), portrait: portrait?.getBoundingClientRect().toJSON(), portraitClip: portrait ? getComputedStyle(portrait).clipPath : null, copy: copy?.getBoundingClientRect().toJSON(), copyOpacity: copy ? getComputedStyle(copy).opacity : null }; })()`);
}

const mobileAudit = await evaluate(`(() => {
  document.documentElement.style.scrollBehavior = 'auto';
  window.scrollTo(0, document.documentElement.scrollHeight);
  const footer = document.querySelector('.footer')?.getBoundingClientRect();
  return {
    width: 390,
    height: 844,
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    scrollHeight: document.documentElement.scrollHeight,
    reachedBottom: Math.abs(window.scrollY + window.innerHeight - document.documentElement.scrollHeight) <= 2,
    footerVisible: Boolean(footer && footer.top < window.innerHeight && footer.bottom > 0),
    overflowElements: Array.from(document.querySelectorAll('body *')).map((element) => ({ element, rect: element.getBoundingClientRect() })).filter(({ rect }) => rect.width > 0 && (rect.left < -3 || rect.right > window.innerWidth + 3)).slice(0, 12).map(({ element, rect }) => ({ tag: element.tagName, className: element.className?.toString?.() || '', left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width) })),
  };
})()`);
metrics.push(mobileAudit);

const mobileViewports = [[375, 812], [430, 932], [360, 800], [320, 568], [768, 1024]];
const desktopViewports = [[1366, 768], [1440, 900], [1920, 1080]];
if (!quick) {
  for (const [width, height] of mobileViewports) {
    await navigate(width, height, true, 2300);
    await capture(path.join(responsiveDir, `${width}x${height}-hero.png`));
    metrics.push(await evaluate(`({ width: ${width}, height: ${height}, scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth, scrollHeight: document.documentElement.scrollHeight })`));
  }

  for (const [width, height] of desktopViewports) {
    await navigate(width, height, false, 2300);
    await capture(path.join(desktopDir, `${width}x${height}-hero.png`));
    metrics.push(await evaluate(`({ width: ${width}, height: ${height}, scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth, scrollHeight: document.documentElement.scrollHeight })`));
  }

  await navigate(1440, 900, false, 2300);
  const desktopStory = [
    ["00-hero-fechamento.png", "[data-hero-section]", 0.98],
    ["01-classico.png", "[data-language-section]", 0.01],
    ["02-transformacao.png", "[data-language-section]", 0.5],
    ["03-contemporaneo.png", "[data-language-section]", 0.99],
    ["04-sobreposicao.png", "[data-language-handoff]", 0],
    ["05-zoom-inicio.png", "[data-zoom-section]", 0.02],
    ["06-zoom-final.png", "[data-zoom-section]", 0.98],
    ["07-showcase.png", "#experiencias", 0],
    ["08a-complexidade.png", "[data-complexity-section]", 0.08],
    ["08b-juncao.png", "[data-complexity-section]", 0.58],
    ["09-tranquilidade.png", "[data-complexity-section]", 0.94],
  ];
  for (const [name, selector, progress] of desktopStory) {
    await scrollToTarget(selector, progress, 0);
    await capture(path.join(desktopStoryDir, name));
  }
}

await navigate(390, 844, true);
await evaluate("document.querySelector('.menu-button')?.click()");
await wait(250);
const menuCheck = await evaluate(`(() => {
  const menu = document.querySelector('.mobile-menu');
  return { open: menu?.getAttribute('data-open'), links: Array.from(menu?.querySelectorAll('nav a') || []).map((item) => item.textContent.trim()) };
})()`);
await evaluate("document.querySelector('.menu-button')?.click()");

console.log(JSON.stringify({ metrics, mobileAudit, menuCheck, popAudit, aboutAudit, runtimeErrors }, null, 2));
socket.close();
