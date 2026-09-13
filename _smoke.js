const fs=require('fs'),vm=require('vm'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script id="engine">([\s\S]*?)<\/script>/);
if(!m){ fs.writeFileSync(path.join(__dirname,'_smoke.log'),'FAIL: engine script not found\n'); process.exit(1); }
const ctx={console,Math,Object,Array,JSON,parseInt,String,globalThis:{}};
ctx.globalThis=ctx; vm.createContext(ctx); vm.runInContext(m[1],ctx,{filename:'engine.js'});
const SF=ctx.SF;

let pass=0,fail=0; const fails=[];
function ok(name,cond){ if(cond){pass++;} else {fail++; fails.push(name);} }

// 1) determinism
const a=SF.generate(123456), b=SF.generate(123456);
ok('determinism(puzzle)', JSON.stringify(a.puzzle)===JSON.stringify(b.puzzle));
ok('determinism(solution)', JSON.stringify(a.solution)===JSON.stringify(b.solution));

// 2) solve(generate(seed).puzzle) === solution  (the key closure) + uniqueness
let tested=0;
const seeds=[ '晨星', 'ai-weekly', 'hello-world', '42', 'https://x', 7, 999999, 0, '深圳-SZ-2026', 'fractal', 13, 271828, 'SudokuForge', 65535, 104729 ];
for (const s of seeds){
  const g=SF.generate(s, 30);
  const sol=SF.solve(g.puzzle);
  ok('solve==solution('+JSON.stringify(s)+')', !!sol && JSON.stringify(sol)===JSON.stringify(g.solution));
  ok('unique('+JSON.stringify(s)+')', SF.countSolutions(g.puzzle,2)===1);
  ok('givens-range('+JSON.stringify(s)+')', g.givens>=22 && g.givens<=81);
  tested++;
}

// 3) 300 random numeric/string seeds
for (let i=0;i<300;i++){
  const seed = (i%2===0) ? Math.floor(Math.random()*1e9) : ('r'+Math.floor(Math.random()*1e9));
  const tg = 24 + (i%20);
  const g=SF.generate(seed, tg);
  const sol=SF.solve(g.puzzle);
  ok('rand-solve('+i+')', !!sol && JSON.stringify(sol)===JSON.stringify(g.solution));
  ok('rand-unique('+i+')', SF.countSolutions(g.puzzle,2)===1);
  tested++;
}

// 4) solving a complete grid returns itself
const full=SF.generate('reference').solution;
ok('solve-full', JSON.stringify(SF.solve(full))===JSON.stringify(full));

// 5) edge: empty grid has many solutions (>=2) -> countSolutions cap works
ok('empty-many', SF.countSolutions(SF.emptyGrid(),2)===2);

const summary = `PASS ${pass} / ${pass+fail}  (seeds tested: ${tested})\n`+(fail?('FAIL '+fails.join(' | ')):'ALL GREEN');
fs.writeFileSync(path.join(__dirname,'_smoke.log'), summary+'\n');
console.log(summary);
process.exit(fail?1:0);
